package wallet

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/ids"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrLedgerUnbalanced           = errors.New("ledger transaction is not balanced")
	ErrLedgerOwnership            = errors.New("ledger account ownership mismatch")
	ErrInsufficientFunds          = errors.New("wallet balance would become negative")
	ErrLedgerIdempotencyConflict  = errors.New("ledger idempotency conflict")
)

type LedgerEntryInput struct {
	AccountID   string
	AmountMinor int64
}

type PostLedgerTransactionInput struct {
	TransactionID string
	PlayerID      string
	Kind          string
	ReferenceID   string
	IdempotencyKey string
	Description   string
	Entries       []LedgerEntryInput
}

type LedgerService struct {
	pool *pgxpool.Pool
}

func NewLedgerService(pool *pgxpool.Pool) *LedgerService {
	return &LedgerService{pool: pool}
}

func (s *LedgerService) Post(ctx context.Context, input PostLedgerTransactionInput) (string, error) {
	if strings.TrimSpace(input.PlayerID) == "" || strings.TrimSpace(input.Kind) == "" || strings.TrimSpace(input.IdempotencyKey) == "" {
		return "", fmt.Errorf("player, kind and idempotency key are required")
	}
	if len(input.Entries) < 2 {
		return "", ErrLedgerUnbalanced
	}

	var sum int64
	accountIDs := make([]string, 0, len(input.Entries))
	seen := make(map[string]struct{}, len(input.Entries))
	for _, entry := range input.Entries {
		if strings.TrimSpace(entry.AccountID) == "" || entry.AmountMinor == 0 {
			return "", ErrLedgerUnbalanced
		}
		if _, exists := seen[entry.AccountID]; exists {
			return "", fmt.Errorf("duplicate ledger account in transaction")
		}
		seen[entry.AccountID] = struct{}{}
		accountIDs = append(accountIDs, entry.AccountID)
		if (entry.AmountMinor > 0 && sum > (1<<63-1)-entry.AmountMinor) || (entry.AmountMinor < 0 && sum < (-1<<63)-entry.AmountMinor) {
			return "", fmt.Errorf("ledger amount overflow")
		}
		sum += entry.AmountMinor
	}
	if sum != 0 {
		return "", ErrLedgerUnbalanced
	}

	transactionID := strings.TrimSpace(input.TransactionID)
	if transactionID == "" {
		var err error
		transactionID, err = ids.New("txn")
		if err != nil {
			return "", err
		}
	}

	tx, err := s.pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
	if err != nil {
		return "", fmt.Errorf("begin ledger transaction: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtextextended($1, 0))`, input.PlayerID); err != nil {
		return "", fmt.Errorf("acquire wallet transaction lock: %w", err)
	}

	requestHash := ledgerRequestHash(input)
	inserted, err := tx.Exec(ctx, `
		INSERT INTO idempotency_keys(player_id, scope, idempotency_key, request_hash, expires_at)
		VALUES ($1, 'ledger', $2, $3, NOW() + INTERVAL '90 days')
		ON CONFLICT DO NOTHING`, input.PlayerID, input.IdempotencyKey, requestHash)
	if err != nil {
		return "", fmt.Errorf("record ledger idempotency: %w", err)
	}
	if inserted.RowsAffected() == 0 {
		var existingHash string
		if err := tx.QueryRow(ctx, `SELECT request_hash FROM idempotency_keys WHERE player_id=$1 AND scope='ledger' AND idempotency_key=$2`, input.PlayerID, input.IdempotencyKey).Scan(&existingHash); err != nil {
			return "", fmt.Errorf("read ledger idempotency: %w", err)
		}
		if existingHash != requestHash {
			return "", ErrLedgerIdempotencyConflict
		}
		var existingTransactionID string
		if err := tx.QueryRow(ctx, `SELECT transaction_id FROM ledger_transactions WHERE player_id=$1 AND idempotency_key=$2`, input.PlayerID, input.IdempotencyKey).Scan(&existingTransactionID); err != nil {
			return "", fmt.Errorf("read idempotent ledger transaction: %w", err)
		}
		return existingTransactionID, tx.Commit(ctx)
	}

	var accountCount int
	var foreignWalletAccounts int
	if err := tx.QueryRow(ctx, `
		SELECT COUNT(*),
		       COUNT(*) FILTER (WHERE la.wallet_id IS NOT NULL AND w.player_id <> $1)
		FROM ledger_accounts la
		LEFT JOIN wallets w ON w.wallet_id = la.wallet_id
		WHERE la.account_id = ANY($2)`, input.PlayerID, accountIDs).Scan(&accountCount, &foreignWalletAccounts); err != nil {
		return "", fmt.Errorf("validate ledger accounts: %w", err)
	}
	if accountCount != len(accountIDs) || foreignWalletAccounts != 0 {
		return "", ErrLedgerOwnership
	}

	if _, err := tx.Exec(ctx, `
		INSERT INTO ledger_transactions(transaction_id, player_id, kind, reference_id, idempotency_key, description)
		VALUES ($1,$2,$3,$4,$5,$6)`, transactionID, input.PlayerID, input.Kind, input.ReferenceID, input.IdempotencyKey, input.Description); err != nil {
		return "", fmt.Errorf("insert ledger transaction: %w", err)
	}

	for _, entry := range input.Entries {
		entryID, err := ids.New("entry")
		if err != nil {
			return "", err
		}
		if _, err := tx.Exec(ctx, `
			INSERT INTO ledger_entries(entry_id, transaction_id, account_id, amount_minor, currency)
			VALUES ($1,$2,$3,$4,'EUR')`, entryID, transactionID, entry.AccountID, entry.AmountMinor); err != nil {
			return "", fmt.Errorf("insert ledger entry: %w", err)
		}
	}

	var negativeWalletAccounts int
	if err := tx.QueryRow(ctx, `
		SELECT COUNT(*) FROM (
			SELECT la.account_id
			FROM ledger_accounts la
			JOIN wallets w ON w.wallet_id = la.wallet_id
			LEFT JOIN ledger_entries le ON le.account_id = la.account_id
			WHERE w.player_id = $1 AND la.account_kind IN ('wallet_available','wallet_reserved')
			GROUP BY la.account_id
			HAVING COALESCE(SUM(le.amount_minor), 0) < 0
		) negative_accounts`, input.PlayerID).Scan(&negativeWalletAccounts); err != nil {
		return "", fmt.Errorf("verify non-negative wallet balances: %w", err)
	}
	if negativeWalletAccounts > 0 {
		return "", ErrInsufficientFunds
	}

	if err := tx.Commit(ctx); err != nil {
		return "", fmt.Errorf("commit ledger transaction: %w", err)
	}
	return transactionID, nil
}

func ledgerRequestHash(input PostLedgerTransactionInput) string {
	entries := append([]LedgerEntryInput(nil), input.Entries...)
	sort.Slice(entries, func(i, j int) bool { return entries[i].AccountID < entries[j].AccountID })
	builder := strings.Builder{}
	builder.WriteString(input.Kind)
	builder.WriteByte('|')
	builder.WriteString(input.ReferenceID)
	for _, entry := range entries {
		builder.WriteByte('|')
		builder.WriteString(entry.AccountID)
		builder.WriteByte(':')
		builder.WriteString(fmt.Sprintf("%d", entry.AmountMinor))
	}
	digest := sha256.Sum256([]byte(builder.String()))
	return hex.EncodeToString(digest[:])
}

var _ = time.Second
