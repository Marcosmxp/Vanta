package wallet

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool}
}

func (r *PostgresRepository) GetSnapshot(ctx context.Context, playerID string) (Snapshot, error) {
	var walletID string
	var currency string
	var available int64
	var reserved int64
	if err := r.pool.QueryRow(ctx, `
		SELECT w.wallet_id,
		       w.currency,
		       COALESCE(SUM(CASE WHEN la.account_kind = 'wallet_available' THEN le.amount_minor ELSE 0 END), 0),
		       COALESCE(SUM(CASE WHEN la.account_kind = 'wallet_reserved' THEN le.amount_minor ELSE 0 END), 0)
		FROM wallets w
		JOIN ledger_accounts la ON la.wallet_id = w.wallet_id
		LEFT JOIN ledger_entries le ON le.account_id = la.account_id
		WHERE w.player_id = $1
		GROUP BY w.wallet_id, w.currency`, playerID,
	).Scan(&walletID, &currency, &available, &reserved); err != nil {
		return Snapshot{}, fmt.Errorf("load wallet balance: %w", err)
	}

	now := time.Now().UTC()
	total := available + reserved
	snapshot := Snapshot{
		Balance: BalanceReadModel{
			WalletID: walletID,
			Currency: currency,
			Availability: AvailabilityReady,
			AvailableBalanceMinor: &available,
			ReservedBalanceMinor: &reserved,
			TotalBalanceMinor: &total,
			AsOf: &now,
		},
	}

	rows, err := r.pool.Query(ctx, `
		SELECT lt.transaction_id,
		       lt.kind,
		       lt.reference_id,
		       lt.description,
		       lt.created_at,
		       COALESCE(SUM(le.amount_minor), 0) AS wallet_delta
		FROM ledger_transactions lt
		JOIN ledger_entries le ON le.transaction_id = lt.transaction_id
		JOIN ledger_accounts la ON la.account_id = le.account_id AND la.wallet_id = $2
		WHERE lt.player_id = $1
		  AND lt.kind IN ('deposit', 'withdrawal', 'wager', 'payout', 'refund', 'adjustment')
		GROUP BY lt.transaction_id, lt.kind, lt.reference_id, lt.description, lt.created_at
		HAVING COALESCE(SUM(le.amount_minor), 0) <> 0
		ORDER BY lt.created_at DESC
		LIMIT 50`, playerID, walletID)
	if err != nil {
		return Snapshot{}, fmt.Errorf("load wallet transactions: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var transaction TransactionReadModel
		var kind string
		var delta int64
		if err := rows.Scan(
			&transaction.TransactionID,
			&kind,
			&transaction.ReferenceID,
			&transaction.Description,
			&transaction.OccurredAt,
			&delta,
		); err != nil {
			return Snapshot{}, fmt.Errorf("scan wallet transaction: %w", err)
		}
		transaction.WalletID = walletID
		transaction.Kind = TransactionKind(kind)
		transaction.Status = StatusCompleted
		transaction.Currency = currency
		transaction.Direction = DirectionCredit
		if delta < 0 {
			transaction.Direction = DirectionDebit
			delta = -delta
		}
		transaction.AmountMinor = delta
		if transaction.Description == "" {
			transaction.Description = kind
		}
		snapshot.Transactions = append(snapshot.Transactions, transaction)
	}
	if err := rows.Err(); err != nil {
		return Snapshot{}, fmt.Errorf("iterate wallet transactions: %w", err)
	}

	if err := snapshot.Validate(); err != nil {
		return Snapshot{}, fmt.Errorf("validate wallet snapshot: %w", err)
	}
	return snapshot, nil
}
