package profile

import (
	"testing"
	"time"
)

func boolPtr(value bool) *bool { return &value }

func validSnapshot() Snapshot {
	return Snapshot{
		Availability: AvailabilityReady,
		Identity: IdentityReadModel{
			PlayerID:    "player_01",
			DisplayName: "Marcos",
			EmailMasked: "m***@example.com",
			PhoneMasked: "+351 *** *** 210",
			CountryCode: "PT",
			MemberSince: time.Date(2026, time.August, 22, 12, 0, 0, 0, time.UTC),
		},
		Verification: VerificationReadModel{
			AgeVerified:   boolPtr(true),
			KYCStatus:     KYCVerified,
			AccountStatus: AccountActive,
		},
		Preferences: PreferencesReadModel{
			Language:         LanguagePortuguese,
			MarketingOptIn:   boolPtr(false),
			ProtectionStatus: ProtectionLimitsConfigured,
		},
	}
}

func TestSnapshotValidateAcceptsReadyMaskedProfile(t *testing.T) {
	if err := validSnapshot().Validate(); err != nil {
		t.Fatalf("expected valid profile, got %v", err)
	}
}

func TestSnapshotValidateRejectsUnmaskedContactRequirement(t *testing.T) {
	snapshot := validSnapshot()
	snapshot.Identity.EmailMasked = "marcos@example.com"
	snapshot.Identity.PhoneMasked = "+351912345678"

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected profile without masked contact to fail validation")
	}
}

func TestSnapshotValidateRejectsMissingPlayerID(t *testing.T) {
	snapshot := validSnapshot()
	snapshot.Identity.PlayerID = ""

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected ready profile without player id to fail validation")
	}
}

func TestSnapshotValidateRejectsUnknownKYCStatus(t *testing.T) {
	snapshot := validSnapshot()
	snapshot.Verification.KYCStatus = "approved-locally"

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected unknown kyc status to fail validation")
	}
}

func TestUnavailableProfileMayOmitIdentityDetails(t *testing.T) {
	snapshot := Snapshot{
		Availability: AvailabilityUnavailable,
		Verification: VerificationReadModel{
			KYCStatus:     KYCRequired,
			AccountStatus: AccountRestricted,
		},
		Preferences: PreferencesReadModel{
			ProtectionStatus: ProtectionRestricted,
		},
	}

	if err := snapshot.Validate(); err != nil {
		t.Fatalf("expected unavailable profile to allow omitted identity details, got %v", err)
	}
}
