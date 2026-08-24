package responsiblegaming

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
)

const responsibleGamingBodyLimit = 8 << 10

type HTTPHandler struct {
	repository *PostgresRepository
}

func NewHTTPHandler(repository *PostgresRepository) *HTTPHandler {
	return &HTTPHandler{repository: repository}
}

type pendingMoneyResponse struct {
	RequestedAmountMinor int64      `json:"requestedAmountMinor"`
	RequestedAt          time.Time  `json:"requestedAt"`
	EffectiveAt          *time.Time `json:"effectiveAt"`
	Direction            string     `json:"direction"`
}

type moneyLimitResponse struct {
	LimitID       string                `json:"limitId"`
	Kind          string                `json:"kind"`
	Period        string                `json:"period"`
	Currency      string                `json:"currency"`
	AmountMinor   int64                 `json:"amountMinor"`
	PendingChange *pendingMoneyResponse `json:"pendingChange,omitempty"`
}

type pendingSessionResponse struct {
	RequestedMinutes int        `json:"requestedMinutes"`
	RequestedAt      time.Time  `json:"requestedAt"`
	EffectiveAt      *time.Time `json:"effectiveAt"`
	Direction        string     `json:"direction"`
}

type sessionLimitResponse struct {
	Minutes       int                     `json:"minutes"`
	PendingChange *pendingSessionResponse `json:"pendingChange,omitempty"`
}

type policyOptionResponse struct {
	OptionID    string `json:"optionId"`
	Label       string `json:"label"`
	Description string `json:"description"`
}

type activeRestrictionResponse struct {
	OptionID  string     `json:"optionId"`
	Label     string     `json:"label"`
	StartedAt time.Time  `json:"startedAt"`
	EndsAt    *time.Time `json:"endsAt"`
}

type responsibleGamingResponse struct {
	PlayerID      string                     `json:"playerId"`
	Availability  string                     `json:"availability"`
	State         string                     `json:"state"`
	Limits        []moneyLimitResponse       `json:"limits"`
	SessionLimit  *sessionLimitResponse      `json:"sessionLimit,omitempty"`
	ActiveTimeOut *activeRestrictionResponse `json:"activeTimeOut,omitempty"`
	SelfExclusion *activeRestrictionResponse `json:"selfExclusion,omitempty"`
	Policy        struct {
		TimeOutOptions        []policyOptionResponse `json:"timeOutOptions"`
		SelfExclusionOptions  []policyOptionResponse `json:"selfExclusionOptions"`
		CanRequestLimitChange bool                   `json:"canRequestLimitChange"`
		CanStartTimeOut       bool                   `json:"canStartTimeOut"`
		CanSelfExclude        bool                   `json:"canSelfExclude"`
	} `json:"policy"`
}

type moneyLimitChangeRequest struct {
	AmountMinor int64 `json:"amountMinor"`
}

type sessionLimitChangeRequest struct {
	Minutes int `json:"minutes"`
}

type restrictionRequest struct {
	OptionID     string `json:"optionId"`
	Acknowledged bool   `json:"acknowledged,omitempty"`
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	snapshot, err := h.repository.GetSnapshot(r.Context(), principal.PlayerID)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "responsible_gaming_unavailable", "Protection settings are temporarily unavailable.", "")
		return
	}
	httpapi.WriteJSON(w, http.StatusOK, mapSnapshot(snapshot))
}

func (h *HTTPHandler) ChangeMoneyLimit(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	var request moneyLimitChangeRequest
	if err := httpapi.DecodeJSON(w, r, &request, responsibleGamingBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid limit request.", "")
		return
	}
	command := RequestMoneyLimitChangeCommand{
		PlayerID:             principal.PlayerID,
		LimitID:              strings.TrimSpace(r.PathValue("limitID")),
		RequestedAmountMinor: request.AmountMinor,
		IdempotencyKey:       strings.TrimSpace(r.Header.Get("Idempotency-Key")),
	}
	if err := h.repository.RequestMoneyLimitChange(r.Context(), command); err != nil {
		h.writeCommandError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *HTTPHandler) ChangeSessionLimit(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	var request sessionLimitChangeRequest
	if err := httpapi.DecodeJSON(w, r, &request, responsibleGamingBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid session-limit request.", "")
		return
	}
	command := RequestSessionLimitChangeCommand{
		PlayerID:         principal.PlayerID,
		RequestedMinutes: request.Minutes,
		IdempotencyKey:   strings.TrimSpace(r.Header.Get("Idempotency-Key")),
	}
	if err := h.repository.RequestSessionLimitChange(r.Context(), command); err != nil {
		h.writeCommandError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *HTTPHandler) StartTimeOut(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	var request restrictionRequest
	if err := httpapi.DecodeJSON(w, r, &request, responsibleGamingBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid time-out request.", "")
		return
	}
	command := StartTimeOutCommand{PlayerID: principal.PlayerID, OptionID: request.OptionID, IdempotencyKey: strings.TrimSpace(r.Header.Get("Idempotency-Key"))}
	if err := h.repository.StartTimeOut(r.Context(), command); err != nil {
		h.writeCommandError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *HTTPHandler) StartSelfExclusion(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	var request restrictionRequest
	if err := httpapi.DecodeJSON(w, r, &request, responsibleGamingBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid self-exclusion request.", "")
		return
	}
	command := StartSelfExclusionCommand{
		PlayerID:       principal.PlayerID,
		OptionID:       request.OptionID,
		Acknowledged:   request.Acknowledged,
		IdempotencyKey: strings.TrimSpace(r.Header.Get("Idempotency-Key")),
	}
	if err := h.repository.StartSelfExclusion(r.Context(), command); err != nil {
		h.writeCommandError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *HTTPHandler) writeCommandError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, ErrPolicyUnavailable):
		httpapi.WriteError(w, http.StatusConflict, "policy_unavailable", "The requested protection option is not available for this jurisdiction.", "")
	case errors.Is(err, ErrProtectionActive):
		httpapi.WriteError(w, http.StatusConflict, "protection_active", "An active protection prevents this change.", "")
	case errors.Is(err, ErrIdempotencyConflict):
		httpapi.WriteError(w, http.StatusConflict, "idempotency_conflict", "The idempotency key was already used for a different request.", "")
	case errors.Is(err, ErrLimitNotFound):
		httpapi.WriteError(w, http.StatusNotFound, "limit_not_found", "Limit not found.", "")
	default:
		httpapi.WriteError(w, http.StatusBadRequest, "protection_request_rejected", "The protection request could not be applied.", "")
	}
}

func mapSnapshot(snapshot Snapshot) responsibleGamingResponse {
	response := responsibleGamingResponse{PlayerID: snapshot.PlayerID, Availability: string(snapshot.Availability), State: string(snapshot.State)}
	for _, limit := range snapshot.Limits {
		item := moneyLimitResponse{LimitID: limit.LimitID, Kind: string(limit.Kind), Period: string(limit.Period), Currency: limit.Currency, AmountMinor: limit.AmountMinor}
		if limit.PendingChange != nil {
			item.PendingChange = &pendingMoneyResponse{RequestedAmountMinor: limit.PendingChange.RequestedAmountMinor, RequestedAt: limit.PendingChange.RequestedAt, EffectiveAt: limit.PendingChange.EffectiveAt, Direction: string(limit.PendingChange.Direction)}
		}
		response.Limits = append(response.Limits, item)
	}
	if snapshot.SessionLimit != nil {
		response.SessionLimit = &sessionLimitResponse{Minutes: snapshot.SessionLimit.Minutes}
		if snapshot.SessionLimit.PendingChange != nil {
			response.SessionLimit.PendingChange = &pendingSessionResponse{RequestedMinutes: snapshot.SessionLimit.PendingChange.RequestedMinutes, RequestedAt: snapshot.SessionLimit.PendingChange.RequestedAt, EffectiveAt: snapshot.SessionLimit.PendingChange.EffectiveAt, Direction: string(snapshot.SessionLimit.PendingChange.Direction)}
		}
	}
	if snapshot.ActiveTimeOut != nil {
		response.ActiveTimeOut = &activeRestrictionResponse{OptionID: snapshot.ActiveTimeOut.OptionID, Label: snapshot.ActiveTimeOut.Label, StartedAt: snapshot.ActiveTimeOut.StartedAt, EndsAt: snapshot.ActiveTimeOut.EndsAt}
	}
	if snapshot.SelfExclusion != nil {
		response.SelfExclusion = &activeRestrictionResponse{OptionID: snapshot.SelfExclusion.OptionID, Label: snapshot.SelfExclusion.Label, StartedAt: snapshot.SelfExclusion.StartedAt, EndsAt: snapshot.SelfExclusion.EndsAt}
	}
	for _, option := range snapshot.Policy.TimeOutOptions {
		response.Policy.TimeOutOptions = append(response.Policy.TimeOutOptions, policyOptionResponse{OptionID: option.OptionID, Label: option.Label, Description: option.Description})
	}
	for _, option := range snapshot.Policy.SelfExclusionOptions {
		response.Policy.SelfExclusionOptions = append(response.Policy.SelfExclusionOptions, policyOptionResponse{OptionID: option.OptionID, Label: option.Label, Description: option.Description})
	}
	response.Policy.CanRequestLimitChange = snapshot.Policy.CanRequestLimitChange
	response.Policy.CanStartTimeOut = snapshot.Policy.CanStartTimeOut
	response.Policy.CanSelfExclude = snapshot.Policy.CanSelfExclude
	return response
}
