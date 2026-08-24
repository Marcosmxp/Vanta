package kyc

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

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	snapshot, err := h.repository.Get(r.Context(), principal.PlayerID)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "kyc_unavailable", "Verification status is temporarily unavailable.", "")
		return
	}
	httpapi.WriteJSON(w, http.StatusOK, struct {
		Status        string `json:"status"`
		RejectionCode string `json:"rejectionCode,omitempty"`
		UpdatedAt     any    `json:"updatedAt"`
	}{Status: snapshot.Status, RejectionCode: snapshot.RejectionCode, UpdatedAt: snapshot.UpdatedAt})
}
