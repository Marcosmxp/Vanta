package responsiblegaming

import (
	"testing"
	"time"
)

func TestSnapshotValidateReadyLimitsConfigured(t *testing.T) {
	snapshot := Snapshot{
		PlayerID:     "player_123",
		Availability: AvailabilityReady,
		State:        ProtectionLimitsConfigured,
		Limits: []MoneyLimitReadModel{
			{
				LimitID:     "limit_deposit_weekly",
				Kind:        LimitDeposit,
				Period:      PeriodWeekly,
				Currency:    "EUR",
				AmountMinor: 25000,
			},
		},
		SessionLimit: &SessionLimitReadModel{Minutes: 120},
		Policy: PolicyReadModel{
			TimeOutOptions:        []PolicyOptionReadModel{{OptionID: "timeout_short", Label: "Pausa curta"}},
			SelfExclusionOptions:  []PolicyOptionReadModel{{OptionID: "exclude_long", Label: "Autoexclusão"}},
			CanRequestLimitChange: true,
			CanStartTimeOut:       true,
			CanSelfExclude:        true,
		},
	}

	if err := snapshot.Validate(); err != nil {
		t.Fatalf("expected valid snapshot, got %v", err)
	}
}

func TestSnapshotValidateRejectsSelfExclusionWithMutableCapabilities(t *testing.T) {
	started := time.Date(2026, time.August, 23, 6, 0, 0, 0, time.UTC)
	snapshot := Snapshot{
		PlayerID:     "player_123",
		Availability: AvailabilityReady,
		State:        ProtectionSelfExcluded,
		SelfExclusion: &ActiveRestrictionReadModel{
			OptionID:  "exclude_indefinite",
			Label:     "Autoexclusão",
			StartedAt: started,
		},
		Policy: PolicyReadModel{CanRequestLimitChange: true},
	}

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected self-excluded snapshot with mutable capability to fail")
	}
}

func TestSnapshotValidateRejectsTimeOutWithoutEnd(t *testing.T) {
	started := time.Date(2026, time.August, 23, 6, 0, 0, 0, time.UTC)
	snapshot := Snapshot{
		PlayerID:     "player_123",
		Availability: AvailabilityReady,
		State:        ProtectionTimeOut,
		ActiveTimeOut: &ActiveRestrictionReadModel{
			OptionID:  "timeout_short",
			Label:     "Pausa curta",
			StartedAt: started,
		},
	}

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected time-out without end timestamp to fail")
	}
}

func TestMoneyLimitValidateRejectsNonEUR(t *testing.T) {
	limit := MoneyLimitReadModel{
		LimitID:     "limit_1",
		Kind:        LimitDeposit,
		Period:      PeriodMonthly,
		Currency:    "USD",
		AmountMinor: 10000,
	}

	if err := limit.Validate(); err == nil {
		t.Fatal("expected non-EUR responsible-gaming limit to fail")
	}
}

func TestPendingIncreaseAllowsFutureEffectiveAt(t *testing.T) {
	requested := time.Date(2026, time.August, 23, 6, 0, 0, 0, time.UTC)
	effective := requested.Add(24 * time.Hour)
	pending := PendingMoneyLimitChange{
		RequestedAmountMinor: 50000,
		RequestedAt:          requested,
		EffectiveAt:          &effective,
		Direction:            DirectionIncrease,
	}

	if err := pending.Validate(); err != nil {
		t.Fatalf("expected future effective timestamp to validate, got %v", err)
	}
}
