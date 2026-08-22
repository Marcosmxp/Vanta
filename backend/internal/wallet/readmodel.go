package wallet

import (
	"errors"
	"strings"
	"time"
)

type Availability string

type TransactionKind string

type TransactionDirection string

type TransactionStatus string

const (
	AvailabilityReady       Availability = "ready"
	AvailabilityUnavailable Availability = "unavailable"
	AvailabilityRestricted  Availability = "restricted"

	TransactionDeposit    TransactionKind = "deposit"
	TransactionWithdrawal TransactionKind = "withdrawal"
	TransactionWager      TransactionKind = "wager"
	TransactionPayout     TransactionKind = "payout"
	TransactionRefund     TransactionKind = "refund"
	TransactionAdjustment TransactionKind = "adjustment"

	DirectionCredit TransactionDirection = "credit"
	DirectionDebit  TransactionDirection = "debit"

	StatusPending   TransactionStatus = "pending"
	StatusCompleted TransactionStatus = "completed"
	StatusFailed    TransactionStatus = "failed"
	StatusReversed  TransactionStatus = "reversed"
)

type BalanceReadModel struct {
	WalletID              string
	Currency              string
	Availability          Availability
	AvailableBalanceMinor *int64
	ReservedBalanceMinor  *int64
	TotalBalanceMinor     *int64
	AsOf                  *time.Time
}

type TransactionReadModel struct {
	TransactionID    string
	WalletID         string
	Kind             TransactionKind
	Direction        TransactionDirection
	Status           TransactionStatus
	AmountMinor      int64
	Currency         string
	OccurredAt       time.Time
	ReferenceID      string
	Description      string
	BalanceAfterMinor *int64
	SettledAt        *time.Time
}

type Snapshot struct {
	Balance      BalanceReadModel
	Transactions []TransactionReadModel
	NextCursor   string
}

func (b BalanceReadModel) Validate() error {
	if b.Currency != "EUR" {
		return errors.New("wallet currency must be EUR")
	}
	if !validAvailability(b.Availability) {
		return errors.New("invalid wallet availability")
	}

	if b.Availability != AvailabilityReady {
		return nil
	}

	if strings.TrimSpace(b.WalletID) == "" {
		return errors.New("ready wallet requires wallet id")
	}
	if b.AvailableBalanceMinor == nil || b.ReservedBalanceMinor == nil || b.TotalBalanceMinor == nil {
		return errors.New("ready wallet requires all balance fields")
	}
	if *b.AvailableBalanceMinor < 0 || *b.ReservedBalanceMinor < 0 || *b.TotalBalanceMinor < 0 {
		return errors.New("wallet balances cannot be negative")
	}
	if b.AsOf == nil || b.AsOf.IsZero() {
		return errors.New("ready wallet requires as-of timestamp")
	}

	return nil
}

func (t TransactionReadModel) Validate() error {
	if strings.TrimSpace(t.TransactionID) == "" {
		return errors.New("transaction id is required")
	}
	if strings.TrimSpace(t.WalletID) == "" {
		return errors.New("wallet id is required")
	}
	if !validKind(t.Kind) {
		return errors.New("invalid transaction kind")
	}
	if t.Direction != DirectionCredit && t.Direction != DirectionDebit {
		return errors.New("invalid transaction direction")
	}
	if !validStatus(t.Status) {
		return errors.New("invalid transaction status")
	}
	if t.AmountMinor <= 0 {
		return errors.New("transaction amount must be positive")
	}
	if t.Currency != "EUR" {
		return errors.New("transaction currency must be EUR")
	}
	if t.OccurredAt.IsZero() {
		return errors.New("transaction occurred-at timestamp is required")
	}
	if strings.TrimSpace(t.Description) == "" {
		return errors.New("transaction description is required")
	}
	if t.BalanceAfterMinor != nil && *t.BalanceAfterMinor < 0 {
		return errors.New("balance after transaction cannot be negative")
	}

	return nil
}

func (s Snapshot) Validate() error {
	if err := s.Balance.Validate(); err != nil {
		return err
	}

	for _, transaction := range s.Transactions {
		if err := transaction.Validate(); err != nil {
			return err
		}
		if s.Balance.WalletID != "" && transaction.WalletID != s.Balance.WalletID {
			return errors.New("transaction does not belong to snapshot wallet")
		}
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

func validKind(value TransactionKind) bool {
	switch value {
	case TransactionDeposit, TransactionWithdrawal, TransactionWager, TransactionPayout, TransactionRefund, TransactionAdjustment:
		return true
	default:
		return false
	}
}

func validStatus(value TransactionStatus) bool {
	switch value {
	case StatusPending, StatusCompleted, StatusFailed, StatusReversed:
		return true
	default:
		return false
	}
}
