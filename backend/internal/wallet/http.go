package wallet

import (
	"net/http"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
)

type HTTPHandler struct {
	repository *PostgresRepository
}

func NewHTTPHandler(repository *PostgresRepository) *HTTPHandler {
	return &HTTPHandler{repository: repository}
}

type walletResponse struct {
	Balance      balanceResponse       `json:"balance"`
	Transactions []transactionResponse `json:"transactions"`
	NextCursor   string                `json:"nextCursor,omitempty"`
}

type balanceResponse struct {
	WalletID              string `json:"walletId"`
	Currency              string `json:"currency"`
	Availability          string `json:"availability"`
	AvailableBalanceMinor *int64 `json:"availableBalanceMinor"`
	ReservedBalanceMinor  *int64 `json:"reservedBalanceMinor"`
	TotalBalanceMinor     *int64 `json:"totalBalanceMinor"`
	AsOf                  any    `json:"asOf"`
}

type transactionResponse struct {
	TransactionID string `json:"transactionId"`
	Kind          string `json:"kind"`
	Direction     string `json:"direction"`
	Status        string `json:"status"`
	AmountMinor   int64  `json:"amountMinor"`
	Currency      string `json:"currency"`
	OccurredAt    any    `json:"occurredAt"`
	ReferenceID   string `json:"referenceId,omitempty"`
	Description   string `json:"description"`
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}

	snapshot, err := h.repository.GetSnapshot(r.Context(), principal.PlayerID)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "wallet_unavailable", "Wallet data is temporarily unavailable.", "")
		return
	}

	response := walletResponse{
		Balance: balanceResponse{
			WalletID: snapshot.Balance.WalletID,
			Currency: snapshot.Balance.Currency,
			Availability: string(snapshot.Balance.Availability),
			AvailableBalanceMinor: snapshot.Balance.AvailableBalanceMinor,
			ReservedBalanceMinor: snapshot.Balance.ReservedBalanceMinor,
			TotalBalanceMinor: snapshot.Balance.TotalBalanceMinor,
			AsOf: snapshot.Balance.AsOf,
		},
		NextCursor: snapshot.NextCursor,
	}
	for _, transaction := range snapshot.Transactions {
		response.Transactions = append(response.Transactions, transactionResponse{
			TransactionID: transaction.TransactionID,
			Kind: string(transaction.Kind),
			Direction: string(transaction.Direction),
			Status: string(transaction.Status),
			AmountMinor: transaction.AmountMinor,
			Currency: transaction.Currency,
			OccurredAt: transaction.OccurredAt,
			ReferenceID: transaction.ReferenceID,
			Description: transaction.Description,
		})
	}

	httpapi.WriteJSON(w, http.StatusOK, response)
}
