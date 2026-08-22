package payments

import (
	"errors"
	"strings"
	"time"
)

type Kind string

type IntentStatus string

const (
	KindDeposit    Kind = "deposit"
	KindWithdrawal Kind = "withdrawal"

	StatusRequiresAction IntentStatus = "requires_action"
	StatusProcessing     IntentStatus = "processing"
	StatusSucceeded      IntentStatus = "succeeded"
	StatusFailed         IntentStatus = "failed"
	StatusCancelled      IntentStatus = "cancelled"
)

type CreateIntentCommand struct {
	PlayerID       string
	WalletID       string
	Kind           Kind
	AmountMinor    int64
	Currency       string
	MethodID       string
	IdempotencyKey string
}

type IntentReadModel struct {
	PaymentIntentID string
	PlayerID        string
	WalletID        string
	Kind            Kind
	Status          IntentStatus
	AmountMinor     int64
	Currency        string
	MethodLabel     string
	ProviderRef     string
	CreatedAt       time.Time
	UpdatedAt       time.Time
	FailureCode     string
	UserMessage     string
}

func (c CreateIntentCommand) Validate() error {
	if strings.TrimSpace(c.PlayerID) == "" {
		return errors.New("player id is required")
	}
	if strings.TrimSpace(c.WalletID) == "" {
		return errors.New("wallet id is required")
	}
	if c.Kind != KindDeposit && c.Kind != KindWithdrawal {
		return errors.New("invalid payment kind")
	}
	if c.AmountMinor <= 0 {
		return errors.New("payment amount must be positive")
	}
	if c.Currency != "EUR" {
		return errors.New("payment currency must be EUR")
	}
	if strings.TrimSpace(c.MethodID) == "" {
		return errors.New("payment method id is required")
	}
	if strings.TrimSpace(c.IdempotencyKey) == "" || len(c.IdempotencyKey) > 128 {
		return errors.New("valid idempotency key is required")
	}
	return nil
}

func (i IntentReadModel) Validate() error {
	if strings.TrimSpace(i.PaymentIntentID) == "" {
		return errors.New("payment intent id is required")
	}
	if strings.TrimSpace(i.PlayerID) == "" || strings.TrimSpace(i.WalletID) == "" {
		return errors.New("payment intent ownership is required")
	}
	if i.Kind != KindDeposit && i.Kind != KindWithdrawal {
		return errors.New("invalid payment kind")
	}
	if !validStatus(i.Status) {
		return errors.New("invalid payment status")
	}
	if i.AmountMinor <= 0 || i.Currency != "EUR" {
		return errors.New("invalid payment amount or currency")
	}
	if strings.TrimSpace(i.MethodLabel) == "" {
		return errors.New("payment method label is required")
	}
	if i.CreatedAt.IsZero() || i.UpdatedAt.IsZero() || i.UpdatedAt.Before(i.CreatedAt) {
		return errors.New("invalid payment timestamps")
	}
	return nil
}

func validStatus(status IntentStatus) bool {
	switch status {
	case StatusRequiresAction, StatusProcessing, StatusSucceeded, StatusFailed, StatusCancelled:
		return true
	default:
		return false
	}
}
