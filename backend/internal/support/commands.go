package support

import (
	"errors"
	"strings"
)

const MaxSupportMessageLength = 4000

type CreateRequestCommand struct {
	PlayerID       string
	Category       string
	Subject        string
	Message        string
	IdempotencyKey string
}

func (c CreateRequestCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("support request requires player id")
	}
	if strings.TrimSpace(c.Category) == "" {
		return errors.New("support request requires category")
	}
	if strings.TrimSpace(c.Subject) == "" {
		return errors.New("support request requires subject")
	}
	message := strings.TrimSpace(c.Message)
	if message == "" {
		return errors.New("support request requires message")
	}
	if len([]rune(message)) > MaxSupportMessageLength {
		return errors.New("support request message is too long")
	}
	if strings.TrimSpace(c.IdempotencyKey) == "" {
		return errors.New("support request requires idempotency key")
	}
	return nil
}
