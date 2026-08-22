package payments

import (
	"testing"
	"time"
)

func validCreateIntentCommand() CreateIntentCommand {
	return CreateIntentCommand{
		PlayerID:       "player_01",
		WalletID:       "wallet_01",
		Kind:           KindDeposit,
		AmountMinor:    2500,
		Currency:       "EUR",
		MethodID:       "method_token_01",
		IdempotencyKey: "payment-01",
	}
}

func TestCreateIntentCommandValidateAcceptsValidCommand(t *testing.T) {
	if err := validCreateIntentCommand().Validate(); err != nil {
		t.Fatalf("expected valid command, got %v", err)
	}
}

func TestCreateIntentCommandRejectsMissingIdempotencyKey(t *testing.T) {
	command := validCreateIntentCommand()
	command.IdempotencyKey = ""

	if err := command.Validate(); err == nil {
		t.Fatal("expected missing idempotency key to fail validation")
	}
}

func TestCreateIntentCommandRejectsNonPositiveAmount(t *testing.T) {
	command := validCreateIntentCommand()
	command.AmountMinor = 0

	if err := command.Validate(); err == nil {
		t.Fatal("expected zero amount to fail validation")
	}
}

func TestIntentReadModelRejectsInvalidTimestampOrder(t *testing.T) {
	created := time.Date(2026, time.August, 22, 20, 0, 0, 0, time.UTC)
	intent := IntentReadModel{
		PaymentIntentID: "pi_01",
		PlayerID:        "player_01",
		WalletID:        "wallet_01",
		Kind:            KindWithdrawal,
		Status:          StatusProcessing,
		AmountMinor:     5000,
		Currency:        "EUR",
		MethodLabel:     "Conta bancária",
		CreatedAt:       created,
		UpdatedAt:       created.Add(-time.Second),
	}

	if err := intent.Validate(); err == nil {
		t.Fatal("expected invalid timestamp order to fail validation")
	}
}
