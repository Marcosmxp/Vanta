package support

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/ids"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/pii"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrIdempotencyConflict = errors.New("support idempotency conflict")

type PostgresRepository struct {
	pool      *pgxpool.Pool
	protector *pii.Protector
}

func NewPostgresRepository(pool *pgxpool.Pool, protector *pii.Protector) *PostgresRepository {
	return &PostgresRepository{pool: pool, protector: protector}
}

func (r *PostgresRepository) GetSnapshot(ctx context.Context, playerID string) (Snapshot, error) {
	var countryCode string
	if err := r.pool.QueryRow(ctx, `SELECT country_code FROM players WHERE player_id = $1`, playerID).Scan(&countryCode); err != nil {
		return Snapshot{}, fmt.Errorf("load support jurisdiction: %w", err)
	}

	snapshot := Snapshot{PlayerID: playerID, Availability: AvailabilityReady}

	topicRows, err := r.pool.Query(ctx, `
		SELECT topic_id, category, title, summary
		FROM support_topics
		WHERE jurisdiction = $1 AND active
		ORDER BY sort_order, topic_id`, countryCode)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load support topics: %w", err)
	}
	defer topicRows.Close()
	for topicRows.Next() {
		var topic TopicReadModel
		if err := topicRows.Scan(&topic.TopicID, &topic.Category, &topic.Title, &topic.Summary); err != nil {
			return Snapshot{}, fmt.Errorf("scan support topic: %w", err)
		}
		snapshot.Topics = append(snapshot.Topics, topic)
	}
	if err := topicRows.Err(); err != nil {
		return Snapshot{}, fmt.Errorf("iterate support topics: %w", err)
	}

	channelRows, err := r.pool.Query(ctx, `
		SELECT channel_id, channel_type, label, target
		FROM support_channels
		WHERE jurisdiction = $1 AND active
		ORDER BY sort_order, channel_id`, countryCode)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load support channels: %w", err)
	}
	defer channelRows.Close()
	for channelRows.Next() {
		var channel ChannelReadModel
		if err := channelRows.Scan(&channel.ChannelID, &channel.Type, &channel.Label, &channel.Target); err != nil {
			return Snapshot{}, fmt.Errorf("scan support channel: %w", err)
		}
		snapshot.Channels = append(snapshot.Channels, channel)
	}
	if err := channelRows.Err(); err != nil {
		return Snapshot{}, fmt.Errorf("iterate support channels: %w", err)
	}

	requestRows, err := r.pool.Query(ctx, `
		SELECT request_id, player_id, category, subject, status, created_at, updated_at
		FROM support_requests
		WHERE player_id = $1
		ORDER BY updated_at DESC
		LIMIT 20`, playerID)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load support requests: %w", err)
	}
	defer requestRows.Close()
	for requestRows.Next() {
		var request RequestSummaryReadModel
		if err := requestRows.Scan(&request.RequestID, &request.PlayerID, &request.Category, &request.Subject, &request.Status, &request.CreatedAt, &request.UpdatedAt); err != nil {
			return Snapshot{}, fmt.Errorf("scan support request: %w", err)
		}
		snapshot.RecentRequests = append(snapshot.RecentRequests, request)
	}
	if err := requestRows.Err(); err != nil {
		return Snapshot{}, fmt.Errorf("iterate support requests: %w", err)
	}

	if len(snapshot.Topics) == 0 && len(snapshot.Channels) == 0 {
		snapshot.Message = "Os canais oficiais de suporte ainda não foram configurados para esta jurisdição."
	}
	if err := snapshot.Validate(); err != nil {
		return Snapshot{}, fmt.Errorf("validate support snapshot: %w", err)
	}
	return snapshot, nil
}

func (r *PostgresRepository) CreateRequest(ctx context.Context, command CreateRequestCommand) (string, error) {
	if err := command.Validate(); err != nil {
		return "", err
	}
	if len([]rune(strings.TrimSpace(command.Category))) > 64 || len([]rune(strings.TrimSpace(command.Subject))) > 160 {
		return "", fmt.Errorf("support category or subject is too long")
	}

	requestHash := supportRequestHash(command)
	tx, err := r.pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
	if err != nil {
		return "", fmt.Errorf("begin support request: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	result, err := tx.Exec(ctx, `
		INSERT INTO idempotency_keys(player_id, scope, idempotency_key, request_hash, expires_at)
		VALUES ($1, 'support-create', $2, $3, NOW() + INTERVAL '90 days')
		ON CONFLICT DO NOTHING`, command.PlayerID, command.IdempotencyKey, requestHash)
	if err != nil {
		return "", fmt.Errorf("record support idempotency: %w", err)
	}
	if result.RowsAffected() == 0 {
		var existingHash string
		if err := tx.QueryRow(ctx, `
			SELECT request_hash FROM idempotency_keys
			WHERE player_id = $1 AND scope = 'support-create' AND idempotency_key = $2`, command.PlayerID, command.IdempotencyKey).Scan(&existingHash); err != nil {
			return "", fmt.Errorf("load support idempotency: %w", err)
		}
		if existingHash != requestHash {
			return "", ErrIdempotencyConflict
		}
		var requestID string
		if err := tx.QueryRow(ctx, `
			SELECT request_id FROM support_requests
			WHERE player_id = $1 AND idempotency_key = $2`, command.PlayerID, command.IdempotencyKey).Scan(&requestID); err != nil {
			return "", fmt.Errorf("load idempotent support request: %w", err)
		}
		return requestID, tx.Commit(ctx)
	}

	ciphertext, nonce, err := r.protector.EncryptString(strings.TrimSpace(command.Message))
	if err != nil {
		return "", err
	}
	requestID, err := ids.New("support")
	if err != nil {
		return "", err
	}

	if _, err := tx.Exec(ctx, `
		INSERT INTO support_requests(
			request_id, player_id, category, subject, message_ciphertext, message_nonce, status, idempotency_key
		) VALUES ($1,$2,$3,$4,$5,$6,'open',$7)`,
		requestID,
		command.PlayerID,
		strings.TrimSpace(command.Category),
		strings.TrimSpace(command.Subject),
		ciphertext,
		nonce,
		command.IdempotencyKey,
	); err != nil {
		return "", fmt.Errorf("insert support request: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return "", fmt.Errorf("commit support request: %w", err)
	}
	return requestID, nil
}

func (r *PostgresRepository) GetRequest(ctx context.Context, playerID, requestID string) (RequestSummaryReadModel, error) {
	var request RequestSummaryReadModel
	if err := r.pool.QueryRow(ctx, `
		SELECT request_id, player_id, category, subject, status, created_at, updated_at
		FROM support_requests
		WHERE player_id = $1 AND request_id = $2`, playerID, requestID).Scan(
		&request.RequestID,
		&request.PlayerID,
		&request.Category,
		&request.Subject,
		&request.Status,
		&request.CreatedAt,
		&request.UpdatedAt,
	); err != nil {
		return RequestSummaryReadModel{}, err
	}
	if err := request.Validate(); err != nil {
		return RequestSummaryReadModel{}, fmt.Errorf("validate support request: %w", err)
	}
	return request, nil
}

func supportRequestHash(command CreateRequestCommand) string {
	digest := sha256.Sum256([]byte(strings.TrimSpace(command.Category) + "\x00" + strings.TrimSpace(command.Subject) + "\x00" + strings.TrimSpace(command.Message)))
	return hex.EncodeToString(digest[:])
}
