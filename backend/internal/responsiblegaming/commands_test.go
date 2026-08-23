package responsiblegaming

import "testing"

func TestRequestMoneyLimitChangeRequiresIdempotency(t *testing.T) {
	command := RequestMoneyLimitChangeCommand{
		PlayerID:             "player_123",
		LimitID:              "limit_weekly_deposit",
		RequestedAmountMinor: 15000,
	}

	if err := command.Validate(); err == nil {
		t.Fatal("expected missing idempotency key to fail")
	}
}

func TestRequestSessionLimitChangeRequiresPositiveMinutes(t *testing.T) {
	command := RequestSessionLimitChangeCommand{
		PlayerID:         "player_123",
		RequestedMinutes: 0,
		IdempotencyKey:   "idem_123",
	}

	if err := command.Validate(); err == nil {
		t.Fatal("expected non-positive session limit to fail")
	}
}

func TestStartTimeOutRequiresPolicyOption(t *testing.T) {
	command := StartTimeOutCommand{
		PlayerID:       "player_123",
		IdempotencyKey: "idem_123",
	}

	if err := command.Validate(); err == nil {
		t.Fatal("expected missing time-out policy option to fail")
	}
}

func TestStartSelfExclusionRequiresAcknowledgement(t *testing.T) {
	command := StartSelfExclusionCommand{
		PlayerID:       "player_123",
		OptionID:       "exclude_indefinite",
		IdempotencyKey: "idem_123",
	}

	if err := command.Validate(); err == nil {
		t.Fatal("expected self-exclusion without explicit acknowledgement to fail")
	}
}

func TestStartSelfExclusionValidatesAcknowledgedCommand(t *testing.T) {
	command := StartSelfExclusionCommand{
		PlayerID:       "player_123",
		OptionID:       "exclude_indefinite",
		Acknowledged:   true,
		IdempotencyKey: "idem_123",
	}

	if err := command.Validate(); err != nil {
		t.Fatalf("expected valid self-exclusion command, got %v", err)
	}
}
