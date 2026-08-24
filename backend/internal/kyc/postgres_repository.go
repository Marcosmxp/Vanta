package kyc

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Snapshot struct {
	Status        string
	RejectionCode string
	UpdatedAt     time.Time
}

type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool}
}

func (r *PostgresRepository) Get(ctx context.Context, playerID string) (Snapshot, error) {
	var snapshot Snapshot
	if err := r.pool.QueryRow(ctx, `
		SELECT status, rejection_code, updated_at
		FROM kyc_verifications
		WHERE player_id = $1`, playerID).Scan(&snapshot.Status, &snapshot.RejectionCode, &snapshot.UpdatedAt); err != nil {
		return Snapshot{}, fmt.Errorf("load kyc status: %w", err)
	}
	return snapshot, nil
}
