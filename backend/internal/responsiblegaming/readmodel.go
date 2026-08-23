package responsiblegaming

import (
	"errors"
	"strings"
	"time"
)

type Availability string
type ProtectionState string
type MoneyLimitKind string
type LimitPeriod string
type LimitChangeDirection string

const (
	AvailabilityReady       Availability = "ready"
	AvailabilityUnavailable Availability = "unavailable"
	AvailabilityRestricted  Availability = "restricted"

	ProtectionStandard         ProtectionState = "standard"
	ProtectionLimitsConfigured ProtectionState = "limits-configured"
	ProtectionTimeOut          ProtectionState = "time-out"
	ProtectionSelfExcluded     ProtectionState = "self-excluded"
	ProtectionRestricted       ProtectionState = "restricted"

	LimitDeposit MoneyLimitKind = "deposit"
	LimitNetLoss MoneyLimitKind = "net-loss"
	LimitWager   MoneyLimitKind = "wager"

	PeriodDaily   LimitPeriod = "daily"
	PeriodWeekly  LimitPeriod = "weekly"
	PeriodMonthly LimitPeriod = "monthly"

	DirectionDecrease LimitChangeDirection = "decrease"
	DirectionIncrease LimitChangeDirection = "increase"
)

type PendingMoneyLimitChange struct {
	RequestedAmountMinor int64
	RequestedAt          time.Time
	EffectiveAt          *time.Time
	Direction            LimitChangeDirection
}

type MoneyLimitReadModel struct {
	LimitID       string
	Kind          MoneyLimitKind
	Period        LimitPeriod
	Currency      string
	AmountMinor   int64
	PendingChange *PendingMoneyLimitChange
}

type PendingSessionLimitChange struct {
	RequestedMinutes int
	RequestedAt      time.Time
	EffectiveAt      *time.Time
	Direction        LimitChangeDirection
}

type SessionLimitReadModel struct {
	Minutes       int
	PendingChange *PendingSessionLimitChange
}

type PolicyOptionReadModel struct {
	OptionID    string
	Label       string
	Description string
}

type ActiveRestrictionReadModel struct {
	OptionID  string
	Label     string
	StartedAt time.Time
	EndsAt    *time.Time
}

type PolicyReadModel struct {
	TimeOutOptions        []PolicyOptionReadModel
	SelfExclusionOptions  []PolicyOptionReadModel
	CanRequestLimitChange bool
	CanStartTimeOut       bool
	CanSelfExclude        bool
}

type Snapshot struct {
	PlayerID      string
	Availability  Availability
	State         ProtectionState
	Limits        []MoneyLimitReadModel
	SessionLimit  *SessionLimitReadModel
	ActiveTimeOut *ActiveRestrictionReadModel
	SelfExclusion *ActiveRestrictionReadModel
	Policy        PolicyReadModel
}

func (s Snapshot) Validate() error {
	if !validAvailability(s.Availability) {
		return errors.New("invalid responsible-gaming availability")
	}
	if !validProtectionState(s.State) {
		return errors.New("invalid responsible-gaming protection state")
	}
	if s.Availability == AvailabilityReady && strings.TrimSpace(s.PlayerID) == "" {
		return errors.New("ready responsible-gaming snapshot requires player id")
	}

	for _, limit := range s.Limits {
		if err := limit.Validate(); err != nil {
			return err
		}
	}
	if s.SessionLimit != nil {
		if err := s.SessionLimit.Validate(); err != nil {
			return err
		}
	}
	if err := validatePolicyOptions(s.Policy.TimeOutOptions); err != nil {
		return err
	}
	if err := validatePolicyOptions(s.Policy.SelfExclusionOptions); err != nil {
		return err
	}

	if s.ActiveTimeOut != nil {
		if err := s.ActiveTimeOut.validate(true); err != nil {
			return err
		}
	}
	if s.SelfExclusion != nil {
		if err := s.SelfExclusion.validate(false); err != nil {
			return err
		}
	}

	if s.State == ProtectionTimeOut && s.ActiveTimeOut == nil {
		return errors.New("time-out state requires active time-out")
	}
	if s.State == ProtectionSelfExcluded {
		if s.SelfExclusion == nil {
			return errors.New("self-excluded state requires self-exclusion record")
		}
		if s.Policy.CanRequestLimitChange || s.Policy.CanStartTimeOut || s.Policy.CanSelfExclude {
			return errors.New("self-excluded state cannot expose mutable protection capabilities")
		}
	}
	if s.State == ProtectionTimeOut && s.Policy.CanStartTimeOut {
		return errors.New("active time-out cannot expose another time-out capability")
	}

	return nil
}

func (m MoneyLimitReadModel) Validate() error {
	if strings.TrimSpace(m.LimitID) == "" {
		return errors.New("money limit requires id")
	}
	if !validMoneyLimitKind(m.Kind) {
		return errors.New("invalid money limit kind")
	}
	if !validLimitPeriod(m.Period) {
		return errors.New("invalid money limit period")
	}
	if m.Currency != "EUR" {
		return errors.New("money limit currency must be EUR")
	}
	if m.AmountMinor <= 0 {
		return errors.New("money limit amount must be positive")
	}
	if m.PendingChange != nil {
		return m.PendingChange.Validate()
	}
	return nil
}

func (p PendingMoneyLimitChange) Validate() error {
	if p.RequestedAmountMinor <= 0 {
		return errors.New("pending money limit amount must be positive")
	}
	if p.RequestedAt.IsZero() {
		return errors.New("pending money limit requires request timestamp")
	}
	if !validDirection(p.Direction) {
		return errors.New("invalid money limit change direction")
	}
	if p.EffectiveAt != nil && p.EffectiveAt.Before(p.RequestedAt) {
		return errors.New("money limit effective time cannot precede request")
	}
	return nil
}

func (s SessionLimitReadModel) Validate() error {
	if s.Minutes <= 0 {
		return errors.New("session limit minutes must be positive")
	}
	if s.PendingChange != nil {
		return s.PendingChange.Validate()
	}
	return nil
}

func (p PendingSessionLimitChange) Validate() error {
	if p.RequestedMinutes <= 0 {
		return errors.New("pending session limit minutes must be positive")
	}
	if p.RequestedAt.IsZero() {
		return errors.New("pending session limit requires request timestamp")
	}
	if !validDirection(p.Direction) {
		return errors.New("invalid session limit change direction")
	}
	if p.EffectiveAt != nil && p.EffectiveAt.Before(p.RequestedAt) {
		return errors.New("session limit effective time cannot precede request")
	}
	return nil
}

func (r ActiveRestrictionReadModel) validate(requireEnd bool) error {
	if strings.TrimSpace(r.OptionID) == "" || strings.TrimSpace(r.Label) == "" {
		return errors.New("active protection restriction requires option identity")
	}
	if r.StartedAt.IsZero() {
		return errors.New("active protection restriction requires start timestamp")
	}
	if requireEnd && r.EndsAt == nil {
		return errors.New("time-out restriction requires end timestamp")
	}
	if r.EndsAt != nil && !r.EndsAt.After(r.StartedAt) {
		return errors.New("protection restriction end must follow start")
	}
	return nil
}

func validatePolicyOptions(options []PolicyOptionReadModel) error {
	seen := make(map[string]struct{}, len(options))
	for _, option := range options {
		id := strings.TrimSpace(option.OptionID)
		if id == "" || strings.TrimSpace(option.Label) == "" {
			return errors.New("responsible-gaming policy option requires id and label")
		}
		if _, exists := seen[id]; exists {
			return errors.New("responsible-gaming policy option ids must be unique")
		}
		seen[id] = struct{}{}
	}
	return nil
}

func validAvailability(value Availability) bool {
	switch value {
	case AvailabilityReady, AvailabilityUnavailable, AvailabilityRestricted:
		return true
	default:
		return false
	}
}

func validProtectionState(value ProtectionState) bool {
	switch value {
	case ProtectionStandard, ProtectionLimitsConfigured, ProtectionTimeOut, ProtectionSelfExcluded, ProtectionRestricted:
		return true
	default:
		return false
	}
}

func validMoneyLimitKind(value MoneyLimitKind) bool {
	return value == LimitDeposit || value == LimitNetLoss || value == LimitWager
}

func validLimitPeriod(value LimitPeriod) bool {
	return value == PeriodDaily || value == PeriodWeekly || value == PeriodMonthly
}

func validDirection(value LimitChangeDirection) bool {
	return value == DirectionDecrease || value == DirectionIncrease
}
