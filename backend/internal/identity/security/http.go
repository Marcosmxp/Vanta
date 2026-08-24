package security

import (
	"net/http"
	"strings"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
)

type HTTPHandler struct {
	repository *PostgresRepository
}

func NewHTTPHandler(repository *PostgresRepository) *HTTPHandler {
	return &HTTPHandler{repository: repository}
}

type securityResponse struct {
	Availability string            `json:"availability"`
	MFAStatus    string            `json:"mfaStatus"`
	Sessions     []sessionResponse `json:"sessions"`
}

type sessionResponse struct {
	SessionID   string `json:"sessionId"`
	DeviceLabel string `json:"deviceLabel"`
	Platform    string `json:"platform"`
	IPMasked    string `json:"ipMasked,omitempty"`
	CountryCode string `json:"countryCode,omitempty"`
	Current     bool   `json:"current"`
	Status      string `json:"status"`
	MFAUsed     bool   `json:"mfaUsed"`
	Trust       string `json:"trust"`
	CreatedAt   any    `json:"createdAt"`
	LastSeenAt  any    `json:"lastSeenAt"`
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}

	snapshot, err := h.repository.GetSnapshot(r.Context(), principal.PlayerID, principal.SessionID)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "security_unavailable", "Security information is temporarily unavailable.", "")
		return
	}

	response := securityResponse{Availability: string(snapshot.Availability), MFAStatus: string(snapshot.MFAStatus)}
	for _, session := range snapshot.Sessions {
		response.Sessions = append(response.Sessions, sessionResponse{
			SessionID:   session.SessionID,
			DeviceLabel: session.DeviceLabel,
			Platform:    session.Platform,
			IPMasked:    session.IPMasked,
			CountryCode: session.CountryCode,
			Current:     session.Current,
			Status:      string(session.Status),
			MFAUsed:     session.MFAUsed,
			Trust:       string(session.Trust),
			CreatedAt:   session.CreatedAt,
			LastSeenAt:  session.LastSeenAt,
		})
	}
	httpapi.WriteJSON(w, http.StatusOK, response)
}

func (h *HTTPHandler) Revoke(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}

	sessionID := strings.TrimSpace(r.PathValue("sessionID"))
	if sessionID == "" {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_session", "Session id is required.", "")
		return
	}

	owned, err := h.repository.RevokeSession(r.Context(), principal.PlayerID, sessionID)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "revoke_unavailable", "The session could not be revoked safely.", "")
		return
	}
	if !owned {
		httpapi.WriteError(w, http.StatusNotFound, "session_not_found", "Session not found.", "")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *HTTPHandler) RevokeOthers(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	if err := h.repository.RevokeOtherSessions(r.Context(), principal.PlayerID, principal.SessionID); err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "revoke_unavailable", "Other sessions could not be revoked safely.", "")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
