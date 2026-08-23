package security

import (
	"testing"
	"time"
)

func validSession() SessionReadModel {
	created := time.Date(2026, time.August, 23, 6, 0, 0, 0, time.UTC)
	return SessionReadModel{
		SessionID:   "session_01",
		PlayerID:    "player_01",
		DeviceLabel: "Pixel 9",
		Platform:    "android",
		IPMasked:    "203.0.*.*",
		CountryCode: "PT",
		Current:     true,
		Status:      SessionStatusActive,
		MFAUsed:     true,
		Trust:       DeviceTrustTrusted,
		CreatedAt:   created,
		LastSeenAt:  created.Add(5 * time.Minute),
	}
}

func TestSessionValidateAcceptsMaskedActiveSession(t *testing.T) {
	if err := validSession().Validate(); err != nil {
		t.Fatalf("expected valid session, got %v", err)
	}
}

func TestSessionValidateRejectsRawIPAddress(t *testing.T) {
	session := validSession()
	session.IPMasked = "203.0.113.10"

	if err := session.Validate(); err == nil {
		t.Fatal("expected raw ip address to fail validation")
	}
}

func TestSnapshotValidateRejectsCrossPlayerSession(t *testing.T) {
	session := validSession()
	session.PlayerID = "player_other"
	snapshot := Snapshot{
		Availability: AvailabilityReady,
		PlayerID:     "player_01",
		MFAStatus:    MFAStatusEnabled,
		Sessions:     []SessionReadModel{session},
	}

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected cross-player session to fail validation")
	}
}

func TestSnapshotValidateRejectsMultipleCurrentSessions(t *testing.T) {
	first := validSession()
	second := validSession()
	second.SessionID = "session_02"

	snapshot := Snapshot{
		Availability: AvailabilityReady,
		PlayerID:     "player_01",
		MFAStatus:    MFAStatusEnabled,
		Sessions:     []SessionReadModel{first, second},
	}

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected duplicate current sessions to fail validation")
	}
}
