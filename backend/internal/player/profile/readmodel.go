package profile

import (
	"errors"
	"strings"
	"time"
)

type Availability string

type KYCStatus string

type AccountStatus string

type ProtectionStatus string

type Language string

const (
	AvailabilityReady       Availability = "ready"
	AvailabilityUnavailable Availability = "unavailable"
	AvailabilityRestricted  Availability = "restricted"

	KYCVerified KYCStatus = "verified"
	KYCPending  KYCStatus = "pending"
	KYCRequired KYCStatus = "required"
	KYCRejected KYCStatus = "rejected"

	AccountActive     AccountStatus = "active"
	AccountRestricted AccountStatus = "restricted"
	AccountBlocked    AccountStatus = "blocked"

	ProtectionStandard         ProtectionStatus = "standard"
	ProtectionLimitsConfigured ProtectionStatus = "limits-configured"
	ProtectionRestricted       ProtectionStatus = "restricted"

	LanguagePortuguese Language = "pt-PT"
	LanguageEnglish    Language = "en"
)

type IdentityReadModel struct {
	PlayerID     string
	DisplayName  string
	EmailMasked  string
	PhoneMasked  string
	CountryCode  string
	MemberSince  time.Time
}

type VerificationReadModel struct {
	AgeVerified  *bool
	KYCStatus    KYCStatus
	AccountStatus AccountStatus
}

type PreferencesReadModel struct {
	Language         Language
	MarketingOptIn   *bool
	ProtectionStatus ProtectionStatus
}

type Snapshot struct {
	Availability Availability
	Identity     IdentityReadModel
	Verification VerificationReadModel
	Preferences  PreferencesReadModel
}

func (s Snapshot) Validate() error {
	if !validAvailability(s.Availability) {
		return errors.New("invalid profile availability")
	}
	if !validKYCStatus(s.Verification.KYCStatus) {
		return errors.New("invalid kyc status")
	}
	if !validAccountStatus(s.Verification.AccountStatus) {
		return errors.New("invalid account status")
	}
	if !validProtectionStatus(s.Preferences.ProtectionStatus) {
		return errors.New("invalid protection status")
	}
	if s.Preferences.Language != "" && !validLanguage(s.Preferences.Language) {
		return errors.New("invalid profile language")
	}

	if s.Availability != AvailabilityReady {
		return nil
	}

	if strings.TrimSpace(s.Identity.PlayerID) == "" {
		return errors.New("ready profile requires player id")
	}
	if strings.TrimSpace(s.Identity.DisplayName) == "" {
		return errors.New("ready profile requires display name")
	}
	if !validMaskedEmail(s.Identity.EmailMasked) && !validMaskedPhone(s.Identity.PhoneMasked) {
		return errors.New("ready profile requires at least one masked contact")
	}
	if len(s.Identity.CountryCode) != 2 {
		return errors.New("country code must use ISO alpha-2 shape")
	}
	if s.Identity.MemberSince.IsZero() {
		return errors.New("ready profile requires member-since timestamp")
	}
	if s.Verification.AgeVerified == nil {
		return errors.New("ready profile requires age-verification state")
	}

	return nil
}

func validMaskedEmail(value string) bool {
	return strings.Contains(value, "@") && strings.Contains(value, "*")
}

func validMaskedPhone(value string) bool {
	return strings.Contains(value, "*") && len(strings.TrimSpace(value)) >= 4
}

func validAvailability(value Availability) bool {
	switch value {
	case AvailabilityReady, AvailabilityUnavailable, AvailabilityRestricted:
		return true
	default:
		return false
	}
}

func validKYCStatus(value KYCStatus) bool {
	switch value {
	case KYCVerified, KYCPending, KYCRequired, KYCRejected:
		return true
	default:
		return false
	}
}

func validAccountStatus(value AccountStatus) bool {
	switch value {
	case AccountActive, AccountRestricted, AccountBlocked:
		return true
	default:
		return false
	}
}

func validProtectionStatus(value ProtectionStatus) bool {
	switch value {
	case ProtectionStandard, ProtectionLimitsConfigured, ProtectionRestricted:
		return true
	default:
		return false
	}
}

func validLanguage(value Language) bool {
	return value == LanguagePortuguese || value == LanguageEnglish
}
