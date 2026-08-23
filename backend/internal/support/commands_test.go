package support

import "testing"

func TestCreateRequestCommandValidate(t *testing.T) {
	command := CreateRequestCommand{
		PlayerID:       "player_1",
		Category:       "technical",
		Subject:        "App issue",
		Message:        "The application closed while opening the wallet.",
		IdempotencyKey: "idem_support_1",
	}

	if err := command.Validate(); err != nil {
		t.Fatalf("expected valid support command, got %v", err)
	}
}

func TestCreateRequestCommandRejectsMissingIdempotency(t *testing.T) {
	command := CreateRequestCommand{PlayerID: "player_1", Category: "technical", Subject: "App issue", Message: "Details"}
	if err := command.Validate(); err == nil {
		t.Fatal("expected missing idempotency key to fail")
	}
}

func TestCreateRequestCommandRejectsOversizedMessage(t *testing.T) {
	message := make([]rune, MaxSupportMessageLength+1)
	for index := range message {
		message[index] = 'a'
	}
	command := CreateRequestCommand{
		PlayerID:       "player_1",
		Category:       "technical",
		Subject:        "App issue",
		Message:        string(message),
		IdempotencyKey: "idem_support_2",
	}
	if err := command.Validate(); err == nil {
		t.Fatal("expected oversized support message to fail")
	}
}
