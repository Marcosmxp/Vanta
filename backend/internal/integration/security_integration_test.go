package integration_test

import (
	"context"
	"errors"
	"fmt"
	"os"
	"sync"
	"testing"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/database"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/migrations"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/pii"
	"github.com/Marcosmxp/Vanta/backend/internal/support"
	"github.com/Marcosmxp/Vanta/backend/internal/wallet"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func openSecurityRuntime(t *testing.T) (*pgxpool.Pool, *pii.Protector) {
	t.Helper()
	databaseURL := os.Getenv("VANTA_TEST_DATABASE_URL")
	if databaseURL == "" {
		t.Skip("integration PostgreSQL is not configured")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	pool, err := database.Open(ctx, databaseURL, 8)
	if err != nil {
		t.Fatalf("open PostgreSQL: %v", err)
	}
	if err := migrations.Run(ctx, pool); err != nil {
		pool.Close()
		t.Fatalf("run migrations: %v", err)
	}
	key := []byte("01234567890123456789012345678901")
	protector, err := pii.NewProtector(key, key)
	if err != nil {
		pool.Close()
		t.Fatalf("create PII protector: %v", err)
	}
	t.Cleanup(pool.Close)
	return pool, protector
}

func registerSecurityPlayer(t *testing.T, service *auth.Service, suffix string) auth.TokenPair {
	t.Helper()
	pair, err := service.Register(context.Background(), auth.RegisterInput{
		Email:         fmt.Sprintf("phase19-%s-%d@example.test", suffix, time.Now().UnixNano()),
		Password:      "Vanta-Security-Integration-42!",
		DisplayName:   "Phase 19",
		CountryCode:   "PT",
		TermsAccepted: true,
		DeviceLabel:   "Security integration device",
		Platform:      "test",
		IPMasked:      "203.0.113.*",
	})
	if err != nil {
		t.Fatalf("register security player: %v", err)
	}
	return pair
}

func TestConcurrentRefreshReplayRevokesSession(t *testing.T) {
	pool, protector := openSecurityRuntime(t)
	store := auth.NewPostgresStore(pool)
	service := auth.NewService(store, protector, 15*time.Minute, 24*time.Hour)
	pair := registerSecurityPlayer(t, service, "refresh-race")

	start := make(chan struct{})
	type result struct {
		pair auth.TokenPair
		err  error
	}
	results := make(chan result, 2)
	var wg sync.WaitGroup
	for i := 0; i < 2; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			<-start
			rotated, err := service.Refresh(context.Background(), pair.RefreshToken)
			results <- result{pair: rotated, err: err}
		}()
	}
	close(start)
	wg.Wait()
	close(results)

	successes := 0
	failures := 0
	var successfulPair auth.TokenPair
	for result := range results {
		if result.err == nil {
			successes++
			successfulPair = result.pair
		} else {
			failures++
		}
	}
	if successes != 1 || failures != 1 {
		t.Fatalf("expected one refresh winner and one replay rejection, got successes=%d failures=%d", successes, failures)
	}

	session, err := store.GetSession(context.Background(), pair.SessionID)
	if err != nil {
		t.Fatalf("load raced session: %v", err)
	}
	if session.RevokedAt == nil {
		t.Fatal("concurrent reuse of one refresh generation must revoke the session fail-closed")
	}
	if _, err := service.Authenticate(context.Background(), successfulPair.AccessToken); err == nil {
		t.Fatal("a token returned during a detected refresh replay must not remain usable")
	}
}

func TestSupportRequestOwnershipPreventsIDOR(t *testing.T) {
	pool, protector := openSecurityRuntime(t)
	service := auth.NewService(auth.NewPostgresStore(pool), protector, 15*time.Minute, 24*time.Hour)
	owner := registerSecurityPlayer(t, service, "support-owner")
	other := registerSecurityPlayer(t, service, "support-other")
	repository := support.NewPostgresRepository(pool, protector)

	requestID, err := repository.CreateRequest(context.Background(), support.CreateRequestCommand{
		PlayerID:       owner.PlayerID,
		Category:       "account",
		Subject:        "Ownership test",
		Message:        "This request must remain scoped to its authenticated player.",
		IdempotencyKey: fmt.Sprintf("support-idor-%d", time.Now().UnixNano()),
	})
	if err != nil {
		t.Fatalf("create support request: %v", err)
	}
	if _, err := repository.GetRequest(context.Background(), other.PlayerID, requestID); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatalf("foreign player must not resolve support request, got %v", err)
	}
	request, err := repository.GetRequest(context.Background(), owner.PlayerID, requestID)
	if err != nil || request.RequestID != requestID {
		t.Fatalf("owner could not resolve support request: request=%+v err=%v", request, err)
	}
}

func TestConcurrentLedgerOverspendCommitsAtMostOneDebit(t *testing.T) {
	pool, protector := openSecurityRuntime(t)
	service := auth.NewService(auth.NewPostgresStore(pool), protector, 15*time.Minute, 24*time.Hour)
	player := registerSecurityPlayer(t, service, "ledger-race")

	var availableAccountID string
	if err := pool.QueryRow(context.Background(), `
		SELECT la.account_id
		FROM wallets w
		JOIN ledger_accounts la ON la.wallet_id = w.wallet_id AND la.account_kind = 'wallet_available'
		WHERE w.player_id = $1`, player.PlayerID).Scan(&availableAccountID); err != nil {
		t.Fatalf("load available account: %v", err)
	}

	candidateHouseAccountID := fmt.Sprintf("house_security_%d", time.Now().UnixNano())
	if _, err := pool.Exec(context.Background(), `
		INSERT INTO ledger_accounts(account_id, wallet_id, account_kind, currency)
		VALUES ($1, NULL, 'house_cash', 'EUR')
		ON CONFLICT DO NOTHING`, candidateHouseAccountID); err != nil {
		t.Fatalf("ensure canonical house account: %v", err)
	}
	var houseAccountID string
	if err := pool.QueryRow(context.Background(), `
		SELECT account_id
		FROM ledger_accounts
		WHERE wallet_id IS NULL AND account_kind = 'house_cash' AND currency = 'EUR'`).Scan(&houseAccountID); err != nil {
		t.Fatalf("load canonical house account: %v", err)
	}

	ledger := wallet.NewLedgerService(pool)
	if _, err := ledger.Post(context.Background(), wallet.PostLedgerTransactionInput{
		PlayerID:       player.PlayerID,
		Kind:           "deposit",
		ReferenceID:    "security-credit",
		IdempotencyKey: fmt.Sprintf("security-credit-%d", time.Now().UnixNano()),
		Description:    "Security race test credit",
		Entries: []wallet.LedgerEntryInput{
			{AccountID: availableAccountID, AmountMinor: 1000},
			{AccountID: houseAccountID, AmountMinor: -1000},
		},
	}); err != nil {
		t.Fatalf("credit wallet: %v", err)
	}

	start := make(chan struct{})
	results := make(chan error, 2)
	var wg sync.WaitGroup
	for i := 0; i < 2; i++ {
		index := i
		wg.Add(1)
		go func() {
			defer wg.Done()
			<-start
			_, err := ledger.Post(context.Background(), wallet.PostLedgerTransactionInput{
				PlayerID:       player.PlayerID,
				Kind:           "withdrawal",
				ReferenceID:    fmt.Sprintf("security-debit-%d", index),
				IdempotencyKey: fmt.Sprintf("security-debit-%d-%d", index, time.Now().UnixNano()),
				Description:    "Concurrent overspend attempt",
				Entries: []wallet.LedgerEntryInput{
					{AccountID: availableAccountID, AmountMinor: -700},
					{AccountID: houseAccountID, AmountMinor: 700},
				},
			})
			results <- err
		}()
	}
	close(start)
	wg.Wait()
	close(results)

	successes := 0
	for err := range results {
		if err == nil {
			successes++
		}
	}
	if successes != 1 {
		t.Fatalf("exactly one concurrent debit may commit against a 1000 balance, got %d", successes)
	}

	snapshot, err := wallet.NewPostgresRepository(pool).GetSnapshot(context.Background(), player.PlayerID)
	if err != nil {
		t.Fatalf("load final wallet snapshot: %v", err)
	}
	if snapshot.Balance.AvailableBalanceMinor == nil || *snapshot.Balance.AvailableBalanceMinor != 300 {
		t.Fatalf("expected authoritative balance 300 after one debit, got %+v", snapshot.Balance)
	}
}
