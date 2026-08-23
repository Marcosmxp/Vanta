package security

import (
	"errors"
	"strings"
	"time"
)

type Availability string
type MFAStatus string
type SessionStatus string
type DeviceTrust string

const (
	AvailabilityReady       Availability = "ready"
	AvailabilityUnavailable Availability = "unavailable"
	AvailabilityRestricted  Availability = "restricted"

	MFAStatusDisabled MFAStatus = "disabled"
	MFAStatusEnabled  MFAStatus = "enabled"
	MFAStatusRequired MFAStatus = "required"

	SessionStatusActive  SessionStatus = "active"
	SessionStatusRevoked SessionStatus = "revoked"

	DeviceTrustTrusted      DeviceTrust = "trusted"
	DeviceTrustUnrecognized DeviceTrust = "unrecognized"
)

type SessionReadModel struct {
	SessionID   string
	PlayerID    string
	DeviceLabel string
	Platform    string
	IPMasked    string
	CountryCode string
	Current     bool
	Status      SessionStatus
	MFAUsed     bool
	Trust       DeviceTrust
	CreatedAt   time.Time
	LastSeenAt  time.Time
}

type Snapshot struct {
	Availability Availability
	PlayerID     string
	MFAStatus    MFAStatus
	Sessions     []SessionReadModel
}

func (s SessionReadModel) Validate() error {
	if strings.TrimSpace(s.SessionID) == "" {
		return errors.New("session id is required")
	}
	if strings.TrimSpace(s.PlayerID) == "" {
		return errors.New("player id is required")
	}
	if strings.TrimSpace(s.DeviceLabel) == "" {
		return errors.New("device label is required")
	}
	if strings.TrimSpace(s.Platform) == "" {
		return errors.New("platform is required")
	}
	if !validSessionStatus(s.Status) {
		return errors.New("invalid session status")
	}
	if !validDeviceTrust(s.Trust) {
		return errors.New("invalid device trust")
	}
	if s.CountryCode != "" && len(s.CountryCode) != 2 {
		return errors.New("country code must use ISO alpha-2 shape")
	}
	if s.IPMasked != "" && !strings.Contains(s.IPMasked, "*") {
		return errors.New("ip address must be masked")
	}
	if s.CreatedAt.IsZero() || s.LastSeenAt.IsZero() {
		return errors.New("session timestamps are required")
	}
	if s.LastSeenAt.Before(s.CreatedAt) {
		return errors.New("last-seen timestamp cannot precede creation")
	}
	if s.Current && s.Status != SessionStatusActive {
		return errors.New("current session must be active")
	}
	return nil
}

func (s Snapshot) Validate() error {
	if !validAvailability(s.Availability) {
		return errors.New("invalid security availability")
	}
	if !validMFAStatus(s.MFAStatus) {
		return errors.New("invalid mfa status")
	}
	if s.Availability != AvailabilityReady {
		return nil
	}
	if strings.TrimSpace(s.PlayerID) == "" {
		return errors.New("ready security snapshot requires player id")
	}

	currentSessions := 0
	for _, session := range s.Sessions {
		if err := session.Validate(); err != nil {
			return err
		}
		if session.PlayerID != s.PlayerID {
			return errors.New("session does not belong to snapshot player")
		}
		if session.Current {
			currentSessions++
		}
	}
	if currentSessions > 1 {
		return errors.New("security snapshot cannot contain multiple current sessions")
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

func validMFAStatus(value MFAStatus) bool {
	switch value {
	case MFAStatusDisabled, MFAStatusEnabled, MFAStatusRequired:
		return true
	default:
		return false
	}
}

func validSessionStatus(value SessionStatus) bool {
	return value == SessionStatusActive || value == SessionStatusRevoked
}

func validDeviceTrust(value DeviceTrust) bool {
	return value == DeviceTrustTrusted || value == DeviceTrustUnrecognized
}
