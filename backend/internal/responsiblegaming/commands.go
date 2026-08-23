package responsiblegaming

import (
	"errors"
	"strings"
)

type RequestMoneyLimitChangeCommand struct {
	PlayerID             string
	LimitID              string
	RequestedAmountMinor int64
	IdempotencyKey       string
}

func (c RequestMoneyLimitChangeCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("money limit change requires player id")
	}
	if strings.TrimSpace(c.LimitID) == "" {
		return errors.New("money limit change requires limit id")
	}
	if c.RequestedAmountMinor <= 0 {
		return errors.New("money limit change amount must be positive")
	}
	return validateIdempotencyKey(c.IdempotencyKey)
}

type RequestSessionLimitChangeCommand struct {
	PlayerID         string
	RequestedMinutes int
	IdempotencyKey   string
}

func (c RequestSessionLimitChangeCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("session limit change requires player id")
	}
	if c.RequestedMinutes <= 0 {
		return errors.New("session limit change minutes must be positive")
	}
	return validateIdempotencyKey(c.IdempotencyKey)
}

type StartTimeOutCommand struct {
	PlayerID       string
	OptionID       string
	IdempotencyKey string
}

func (c StartTimeOutCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("time-out requires player id")
	}
	if strings.TrimSpace(c.OptionID) == "" {
		return errors.New("time-out requires policy option id")
	}
	return validateIdempotencyKey(c.IdempotencyKey)
}

type StartSelfExclusionCommand struct {
	PlayerID       string
	OptionID       string
	Acknowledged   bool
	IdempotencyKey string
}

func (c StartSelfExclusionCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("self-exclusion requires player id")
	}
	if strings.TrimSpace(c.OptionID) == "" {
		return errors.New("self-exclusion requires policy option id")
	}
	if !c.Acknowledged {
		return errors.New("self-exclusion requires explicit acknowledgement")
	}
	return validateIdempotencyKey(c.IdempotencyKey)
}

func validateIdempotencyKey(value string) error {
	if strings.TrimSpace(value) == "" {
		return errors.New("responsible-gaming command requires idempotency key")
	}
	return nil
}
