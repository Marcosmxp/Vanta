package integration_test

import (
	"context"
	"errors"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/cache"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/database"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/migrations"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/pii"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/ratelimit"
	"github.com/Marcosmxp/Vanta/backend/internal/wallet"
)

func TestRuntimePersistenceAndSecurityBoundaries(t *testing.T) {
	databaseURL := os.Getenv("VANTA_TEST_DATABASE_URL")
	redisURL := os.Getenv("VANTA_TEST_REDIS_URL")
	if databaseURL == "" || redisURL == "" {
		t.Skip("integration infrastructure is not configured")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	pool, err := database.Open(ctx, databaseURL, 5)
	if err != nil {
		t.Fatalf("open PostgreSQL: %v", err)
	}
	defer pool.Close()
	if err := migrations.Run(ctx, pool); err != nil {
		t.Fatalf("run migrations: %v", err)
	}

	redisClient, err := cache.Open(ctx, redisURL)
	if err != nil {
		t.Fatalf("open Redis: %v", err)
	}
	defer func() { _ = redisClient.Close() }()

	limiter := ratelimit.New(redisClient)
	allowed, err := limiter.Allow(ctx, "integration", fmt.Sprintf("subject-%d", time.Now().UnixNano()), 1, time.Minute)
	if err != nil || !allowed {
		t.Fatalf("expected first Redis-backed rate-limit request to pass: allowed=%v err=%v", allowed, err)
	}

	key := []byte("01234567890123456789012345678901")
	protector, err := pii.NewProtector(key, key)
	if err != nil {
		t.Fatalf("create PII protector: %v", err)
	}

	authService := auth.NewService(auth.NewPostgresStore(pool), protector, 15*time.Minute, 24*time.Hour)
	email := fmt.Sprintf("phase17-%d@example.test", time.Now().UnixNano())
	registered, err := authService.Register(ctx, auth.RegisterInput{
		Email:         email,
		Password:      "Vanta-Integration-Password-42!",
		DisplayName:   "Phase 17",
		CountryCode:   "PT",
		TermsAccepted: true,
		DeviceLabel:   "CI integration device",
		Platform:      "test",
		IPMasked:      "127.0.*.*",
	})
	if err != nil {
		t.Fatalf("register player: %v", err)
	}
	if registered.PlayerID == "" || registered.SessionID == "" || registered.AccessToken == "" || registered.RefreshToken == "" {
		t.Fatal("registration did not return the expected opaque session credentials")
	}

	principal, err := authService.Authenticate(ctx, registered.AccessToken)
	if err != nil {
		t.Fatalf("authenticate access token: %v", err)
	}
	if principal.PlayerID != registered.PlayerID || principal.SessionID != registered.SessionID {
		t.Fatal("access token resolved to the wrong principal")
	}

	rotated, err := authService.Refresh(ctx, registered.RefreshToken)
	if err != nil {
		t.Fatalf("rotate refresh token: %v", err)
	}
	if rotated.RefreshToken == registered.RefreshToken || rotated.AccessToken == registered.AccessToken {
		t.Fatal("refresh rotation must issue new opaque tokens")
	}
	if _, err := authService.Authenticate(ctx, registered.AccessToken); err == nil {
		t.Fatal("previous access token must stop authenticating after rotation")
	}
	if _, err := authService.Refresh(ctx, registered.RefreshToken); err == nil {
		t.Fatal("previous refresh token must not be reusable")
	}

	var walletID, availableAccountID string
	if err := pool.QueryRow(ctx, `
		SELECT w.wallet_id, la.account_id
		FROM wallets w
		JOIN ledger_accounts la ON la.wallet_id = w.wallet_id AND la.account_kind = 'wallet_available'
		WHERE w.player_id = $1`, registered.PlayerID).Scan(&walletID, &availableAccountID); err != nil {
		t.Fatalf("load wallet accounts: %v", err)
	}

	houseAccountID := fmt.Sprintf("house_%d", time.Now().UnixNano())
	if _, err := pool.Exec(ctx, `
		INSERT INTO ledger_accounts(account_id, wallet_id, account_kind, currency)
		VALUES ($1, NULL, 'house_cash', 'EUR')`, houseAccountID); err != nil {
		t.Fatalf("create integration house account: %v", err)
	}

	ledger := wallet.NewLedgerService(pool)
	credit := wallet.PostLedgerTransactionInput{
		PlayerID:       registered.PlayerID,
		Kind:           "deposit",
		ReferenceID:    "integration-credit",
		IdempotencyKey: "integration-credit-1",
		Description:    "Integration test credit",
		Entries: []wallet.LedgerEntryInput{
			{AccountID: availableAccountID, AmountMinor: 1000},
			{AccountID: houseAccountID, AmountMinor: -1000},
		},
	}
	transactionID, err := ledger.Post(ctx, credit)
	if err != nil {
		t.Fatalf("post balanced ledger transaction: %v", err)
	}
	replayedID, err := ledger.Post(ctx, credit)
	if err != nil || replayedID != transactionID {
		t.Fatalf("ledger idempotency did not replay the original transaction: id=%q err=%v", replayedID, err)
	}

	snapshot, err := wallet.NewPostgresRepository(pool).GetSnapshot(ctx, registered.PlayerID)
	if err != nil {
		t.Fatalf("load wallet snapshot: %v", err)
	}
	if snapshot.Balance.WalletID != walletID || snapshot.Balance.AvailableBalanceMinor == nil || *snapshot.Balance.AvailableBalanceMinor != 1000 {
		t.Fatalf("unexpected authoritative wallet balance: %+v", snapshot.Balance)
	}

	_, err = ledger.Post(ctx, wallet.PostLedgerTransactionInput{
		PlayerID:       registered.PlayerID,
		Kind:           "withdrawal",
		ReferenceID:    "integration-overdraft",
		IdempotencyKey: "integration-overdraft-1",
		Description:    "Integration overdraft attempt",
		Entries: []wallet.LedgerEntryInput{
			{AccountID: availableAccountID, AmountMinor: -2000},
			{AccountID: houseAccountID, AmountMinor: 2000},
		},
	})
	if !errors.Is(err, wallet.ErrInsufficientFunds) {
		t.Fatalf("expected insufficient-funds protection, got %v", err)
	}
}
