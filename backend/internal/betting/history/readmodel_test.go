package history

import (
	"testing"
	"time"
)

func TestSettledBetRequiresSettlementFields(t *testing.T) {
	bet := BetSummary{
		BetID:      "bet_123",
		Game:       "plinko",
		Status:     BetStatusSettled,
		Currency:   "EUR",
		StakeMinor: 100,
		PlacedAt:   time.Now(),
	}

	if err := bet.Validate(); err == nil {
		t.Fatal("expected settled bet without payout fields to be rejected")
	}
}

func TestValidPlinkoDetails(t *testing.T) {
	payout := int64(250)
	multiplier := int64(25000)
	settledAt := time.Now()
	slot := 4

	bet := PlinkoDetails{
		BetSummary: BetSummary{
			BetID:         "bet_123",
			Game:          "plinko",
			Status:        BetStatusSettled,
			Currency:      "EUR",
			StakeMinor:    100,
			PayoutMinor:   &payout,
			MultiplierBps: &multiplier,
			PlacedAt:      settledAt.Add(-time.Second),
			SettledAt:     &settledAt,
		},
		RulesetID:      "plinko-standard",
		RulesetVersion: "1",
		Rows:           8,
		Risk:           "medium",
		Slot:           &slot,
	}

	if err := bet.Validate(); err != nil {
		t.Fatalf("expected valid plinko details, got %v", err)
	}
}

func TestPlinkoSlotMustFitBoard(t *testing.T) {
	placedAt := time.Now()
	slot := 9

	bet := PlinkoDetails{
		BetSummary: BetSummary{
			BetID:      "bet_123",
			Game:       "plinko",
			Status:     BetStatusAccepted,
			Currency:   "EUR",
			StakeMinor: 100,
			PlacedAt:   placedAt,
		},
		RulesetID:      "plinko-standard",
		RulesetVersion: "1",
		Rows:           8,
		Risk:           "medium",
		Slot:           &slot,
	}

	if err := bet.Validate(); err == nil {
		t.Fatal("expected slot outside board bounds to be rejected")
	}
}
