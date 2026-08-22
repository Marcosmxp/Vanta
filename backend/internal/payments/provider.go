package payments

import "context"

type ProviderCreateIntentRequest struct {
	Kind           Kind
	AmountMinor    int64
	Currency       string
	MethodToken    string
	IdempotencyKey string
	ReferenceID    string
}

type ProviderIntentResult struct {
	ProviderReference string
	Status            IntentStatus
	RequiresActionURL string
	FailureCode       string
}

type Gateway interface {
	CreateIntent(ctx context.Context, request ProviderCreateIntentRequest) (ProviderIntentResult, error)
	GetIntent(ctx context.Context, providerReference string) (ProviderIntentResult, error)
}
