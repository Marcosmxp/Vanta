package security

import (
	"errors"
	"strings"
)

type RevokeSessionCommand struct {
	PlayerID       string
	SessionID      string
	IdempotencyKey string
}

type RevokeOtherSessionsCommand struct {
	PlayerID       string
	CurrentSession string
	IdempotencyKey string
}

type BeginMFAEnrollmentCommand struct {
	PlayerID       string
	IdempotencyKey string
}

func (c RevokeSessionCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("player id is required")
	}
	if strings.TrimSpace(c.SessionID) == "" {
		return errors.New("session id is required")
	}
	return validateIdempotencyKey(c.IdempotencyKey)
}

func (c RevokeOtherSessionsCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("player id is required")
	}
	if strings.TrimSpace(c.CurrentSession) == "" {
		return errors.New("current session id is required")
	}
	return validateIdempotencyKey(c.IdempotencyKey)
}

func (c BeginMFAEnrollmentCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("player id is required")
	}
	return validateIdempotencyKey(c.IdempotencyKey)
}

func validateIdempotencyKey(value string) error {
	trimmed := strings.TrimSpace(value)
	if len(trimmed) < 16 || len(trimmed) > 128 {
		return errors.New("idempotency key must be between 16 and 128 characters")
	}
	return nil
}
