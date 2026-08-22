package plinko

import (
	"errors"
	"fmt"
	"math"
)

const BasisPointsPerUnit int64 = 10_000

var (
	ErrInvalidRuleset = errors.New("invalid plinko ruleset")
	ErrInvalidStake   = errors.New("invalid plinko stake")
)

type Ruleset struct {
	ID                 string
	Version            string
	Rows               int
	Currency           string
	MinStakeMinor      int64
	MaxStakeMinor      int64
	MultipliersBps     []int64
	ProductionApproved bool
}

func (r Ruleset) Validate() error {
	if r.ID == "" || r.Version == "" {
		return fmt.Errorf("%w: id and version are required", ErrInvalidRuleset)
	}
	if r.Rows < MinRows || r.Rows > MaxRows {
		return fmt.Errorf("%w: rows=%d", ErrInvalidRuleset, r.Rows)
	}
	if len(r.Currency) != 3 {
		return fmt.Errorf("%w: currency must be ISO-4217 style", ErrInvalidRuleset)
	}
	if r.MinStakeMinor <= 0 || r.MaxStakeMinor < r.MinStakeMinor {
		return fmt.Errorf("%w: invalid stake limits", ErrInvalidRuleset)
	}
	if len(r.MultipliersBps) != r.Rows+1 {
		return fmt.Errorf("%w: expected %d multiplier slots, got %d", ErrInvalidRuleset, r.Rows+1, len(r.MultipliersBps))
	}
	for slot, multiplier := range r.MultipliersBps {
		if multiplier < 0 {
			return fmt.Errorf("%w: slot %d has negative multiplier", ErrInvalidRuleset, slot)
		}
	}
	return nil
}

func (r Ruleset) ValidateStake(stakeMinor int64) error {
	if stakeMinor < r.MinStakeMinor || stakeMinor > r.MaxStakeMinor {
		return fmt.Errorf("%w: stake outside configured limits", ErrInvalidStake)
	}
	return nil
}

func (r Ruleset) MultiplierForSlot(slot int) (int64, error) {
	if slot < 0 || slot >= len(r.MultipliersBps) {
		return 0, fmt.Errorf("%w: slot=%d", ErrInvalidRuleset, slot)
	}
	return r.MultipliersBps[slot], nil
}

func CalculatePayoutMinor(stakeMinor, multiplierBps int64) (int64, error) {
	if stakeMinor < 0 || multiplierBps < 0 {
		return 0, ErrInvalidStake
	}
	if multiplierBps != 0 && stakeMinor > math.MaxInt64/multiplierBps {
		return 0, errors.New("plinko payout overflow")
	}
	return (stakeMinor * multiplierBps) / BasisPointsPerUnit, nil
}
