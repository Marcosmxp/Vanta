package security

import "testing"

func TestRevokeSessionCommandRequiresIdempotency(t *testing.T) {
	command := RevokeSessionCommand{
		PlayerID:  "player_01",
		SessionID: "session_01",
	}

	if err := command.Validate(); err == nil {
		t.Fatal("expected missing idempotency key to fail validation")
	}
}

func TestRevokeOtherSessionsCommandAcceptsValidInput(t *testing.T) {
	command := RevokeOtherSessionsCommand{
		PlayerID:       "player_01",
		CurrentSession: "session_01",
		IdempotencyKey: "security-command-0001",
	}

	if err := command.Validate(); err != nil {
		t.Fatalf("expected valid command, got %v", err)
	}
}

func TestBeginMFAEnrollmentCommandRequiresPlayer(t *testing.T) {
	command := BeginMFAEnrollmentCommand{
		IdempotencyKey: "security-command-0002",
	}

	if err := command.Validate(); err == nil {
		t.Fatal("expected missing player id to fail validation")
	}
}
