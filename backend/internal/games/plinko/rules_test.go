package plinko

import "testing"

func fixtureRuleset() Ruleset {
	return Ruleset{
		ID:                 "test-rules",
		Version:            "test-v1",
		Rows:               8,
		Currency:           "EUR",
		MinStakeMinor:      10,
		MaxStakeMinor:      10_000,
		MultipliersBps:     []int64{20_000, 15_000, 12_000, 10_000, 5_000, 10_000, 12_000, 15_000, 20_000},
		ProductionApproved: false,
	}
}

func TestRulesetValidate(t *testing.T) {
	rules := fixtureRuleset()
	if err := rules.Validate(); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}

func TestRulesetRejectsMissingMultiplierSlot(t *testing.T) {
	rules := fixtureRuleset()
	rules.MultipliersBps = rules.MultipliersBps[:len(rules.MultipliersBps)-1]

	if err := rules.Validate(); err == nil {
		t.Fatal("Validate() error = nil, want failure")
	}
}

func TestCalculatePayoutMinor(t *testing.T) {
	payout, err := CalculatePayoutMinor(250, 15_000)
	if err != nil {
		t.Fatalf("CalculatePayoutMinor() error = %v", err)
	}
	if payout != 375 {
		t.Fatalf("payout = %d, want 375", payout)
	}
}
