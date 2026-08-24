package history

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
	"github.com/jackc/pgx/v5"
)

type HTTPHandler struct {
	repository *PostgresRepository
}

func NewHTTPHandler(repository *PostgresRepository) *HTTPHandler {
	return &HTTPHandler{repository: repository}
}

type betSummaryResponse struct {
	BetID         string `json:"betId"`
	Game          string `json:"game"`
	Status        string `json:"status"`
	Currency      string `json:"currency"`
	StakeMinor    int64  `json:"stakeMinor"`
	PayoutMinor   *int64 `json:"payoutMinor"`
	MultiplierBps *int64 `json:"multiplierBps"`
	PlacedAt      any    `json:"placedAt"`
	SettledAt     any    `json:"settledAt"`
}

type betListResponse struct {
	Items      []betSummaryResponse `json:"items"`
	NextCursor string               `json:"nextCursor,omitempty"`
}

type plinkoDetailsResponse struct {
	betSummaryResponse
	RulesetID      string `json:"rulesetId"`
	RulesetVersion string `json:"rulesetVersion"`
	Rows           int    `json:"rows"`
	Risk           string `json:"risk"`
	Slot           *int   `json:"slot"`
}

func (h *HTTPHandler) List(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}

	limit := 20
	if value := strings.TrimSpace(r.URL.Query().Get("limit")); value != "" {
		parsed, err := strconv.Atoi(value)
		if err != nil || parsed < 1 || parsed > 50 {
			httpapi.WriteError(w, http.StatusBadRequest, "invalid_limit", "Limit must be between 1 and 50.", "")
			return
		}
		limit = parsed
	}

	bets, nextCursor, err := h.repository.List(r.Context(), principal.PlayerID, strings.TrimSpace(r.URL.Query().Get("cursor")), limit)
	if err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "history_unavailable", "Bet history could not be loaded.", "")
		return
	}
	response := betListResponse{NextCursor: nextCursor}
	for _, bet := range bets {
		response.Items = append(response.Items, mapBetSummary(bet))
	}
	httpapi.WriteJSON(w, http.StatusOK, response)
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	betID := strings.TrimSpace(r.PathValue("betID"))
	if betID == "" {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_bet", "Bet id is required.", "")
		return
	}

	details, err := h.repository.GetPlinko(r.Context(), principal.PlayerID, betID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			httpapi.WriteError(w, http.StatusNotFound, "bet_not_found", "Bet not found.", "")
			return
		}
		httpapi.WriteError(w, http.StatusServiceUnavailable, "bet_unavailable", "Bet details are temporarily unavailable.", "")
		return
	}

	httpapi.WriteJSON(w, http.StatusOK, plinkoDetailsResponse{
		betSummaryResponse: mapBetSummary(details.BetSummary),
		RulesetID:          details.RulesetID,
		RulesetVersion:     details.RulesetVersion,
		Rows:               details.Rows,
		Risk:               details.Risk,
		Slot:               details.Slot,
	})
}

func mapBetSummary(bet BetSummary) betSummaryResponse {
	return betSummaryResponse{
		BetID:         bet.BetID,
		Game:          bet.Game,
		Status:        string(bet.Status),
		Currency:      bet.Currency,
		StakeMinor:    bet.StakeMinor,
		PayoutMinor:   bet.PayoutMinor,
		MultiplierBps: bet.MultiplierBps,
		PlacedAt:      bet.PlacedAt,
		SettledAt:     bet.SettledAt,
	}
}
