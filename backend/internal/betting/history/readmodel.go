package history

import (
	"errors"
	"time"
)

type BetStatus string

const (
	BetStatusAccepted BetStatus = "accepted"
	BetStatusSettled  BetStatus = "settled"
	BetStatusVoided   BetStatus = "voided"
)

type BetSummary struct {
	BetID         string
	Game          string
	Status        BetStatus
	Currency      string
	StakeMinor    int64
	PayoutMinor   *int64
	MultiplierBps *int64
	PlacedAt      time.Time
	SettledAt     *time.Time
}

type PlinkoDetails struct {
	BetSummary
	RulesetID      string
	RulesetVersion string
	Rows           int
	Risk           string
	Slot           *int
}

func (b BetSummary) Validate() error {
	if b.BetID == "" {
		return errors.New("bet id is required")
	}
	if b.Game == "" {
		return errors.New("game is required")
	}
	if b.Currency == "" {
		return errors.New("currency is required")
	}
	if b.StakeMinor < 0 {
		return errors.New("stake cannot be negative")
	}
	if b.PayoutMinor != nil && *b.PayoutMinor < 0 {
		return errors.New("payout cannot be negative")
	}
	if b.MultiplierBps != nil && *b.MultiplierBps < 0 {
		return errors.New("multiplier cannot be negative")
	}
	if b.PlacedAt.IsZero() {
		return errors.New("placed time is required")
	}
	if b.Status != BetStatusAccepted && b.Status != BetStatusSettled && b.Status != BetStatusVoided {
		return errors.New("unsupported bet status")
	}
	if b.Status == BetStatusSettled && (b.PayoutMinor == nil || b.MultiplierBps == nil || b.SettledAt == nil) {
		return errors.New("settled bet requires payout, multiplier and settled time")
	}
	return nil
}

func (b PlinkoDetails) Validate() error {
	if err := b.BetSummary.Validate(); err != nil {
		return err
	}
	if b.Game != "plinko" {
		return errors.New("plinko details require plinko game")
	}
	if b.RulesetID == "" || b.RulesetVersion == "" {
		return errors.New("ruleset identity is required")
	}
	if b.Rows <= 0 {
		return errors.New("rows must be positive")
	}
	if b.Slot != nil && (*b.Slot < 0 || *b.Slot > b.Rows) {
		return errors.New("slot is outside board bounds")
	}
	return nil
}
