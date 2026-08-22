package wallet

import (
	"testing"
	"time"
)

func int64Ptr(value int64) *int64 { return &value }

func timePtr(value time.Time) *time.Time { return &value }

func validBalance() BalanceReadModel {
	now := time.Date(2026, time.August, 22, 12, 0, 0, 0, time.UTC)
	return BalanceReadModel{
		WalletID:              "wallet_01",
		Currency:              "EUR",
		Availability:          AvailabilityReady,
		AvailableBalanceMinor: int64Ptr(12500),
		ReservedBalanceMinor:  int64Ptr(2500),
		TotalBalanceMinor:     int64Ptr(15000),
		AsOf:                  timePtr(now),
	}
}

func validTransaction() TransactionReadModel {
	now := time.Date(2026, time.August, 22, 12, 1, 0, 0, time.UTC)
	return TransactionReadModel{
		TransactionID: "txn_01",
		WalletID:      "wallet_01",
		Kind:          TransactionWager,
		Direction:     DirectionDebit,
		Status:        StatusCompleted,
		AmountMinor:   1000,
		Currency:      "EUR",
		OccurredAt:    now,
		Description:   "Plinko wager",
		SettledAt:     timePtr(now),
	}
}

func TestBalanceValidateAcceptsReadyProjection(t *testing.T) {
	if err := validBalance().Validate(); err != nil {
		t.Fatalf("expected valid balance, got %v", err)
	}
}

func TestBalanceValidateRejectsMissingReadyBalances(t *testing.T) {
	balance := validBalance()
	balance.AvailableBalanceMinor = nil

	if err := balance.Validate(); err == nil {
		t.Fatal("expected missing balance field to fail validation")
	}
}

func TestTransactionValidateRejectsNonPositiveAmount(t *testing.T) {
	transaction := validTransaction()
	transaction.AmountMinor = 0

	if err := transaction.Validate(); err == nil {
		t.Fatal("expected zero transaction amount to fail validation")
	}
}

func TestSnapshotValidateRejectsWalletMismatch(t *testing.T) {
	transaction := validTransaction()
	transaction.WalletID = "wallet_other"

	snapshot := Snapshot{
		Balance:      validBalance(),
		Transactions: []TransactionReadModel{transaction},
	}

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected wallet mismatch to fail validation")
	}
}

func TestUnavailableBalanceMayOmitSensitiveAmounts(t *testing.T) {
	balance := BalanceReadModel{
		Currency:     "EUR",
		Availability: AvailabilityUnavailable,
	}

	if err := balance.Validate(); err != nil {
		t.Fatalf("expected unavailable projection to allow omitted amounts, got %v", err)
	}
}
