package support

import (
	"errors"
	"net/http"
	"strings"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
	"github.com/jackc/pgx/v5"
)

const supportBodyLimit = 32 << 10

type HTTPHandler struct {
	repository *PostgresRepository
}

func NewHTTPHandler(repository *PostgresRepository) *HTTPHandler {
	return &HTTPHandler{repository: repository}
}

type createRequestBody struct {
	Category string `json:"category"`
	Subject  string `json:"subject"`
	Message  string `json:"message"`
}

type requestResponse struct {
	RequestID string `json:"requestId"`
	Category  string `json:"category"`
	Subject   string `json:"subject"`
	Status    string `json:"status"`
	CreatedAt any    `json:"createdAt"`
	UpdatedAt any    `json:"updatedAt"`
}

type supportResponse struct {
	Availability   string            `json:"availability"`
	Topics         []topicResponse   `json:"topics"`
	Channels       []channelResponse `json:"channels"`
	RecentRequests []requestResponse `json:"recentRequests"`
	Message        string            `json:"message,omitempty"`
}

type topicResponse struct {
	TopicID  string `json:"topicId"`
	Category string `json:"category"`
	Title    string `json:"title"`
	Summary  string `json:"summary"`
}

type channelResponse struct {
	ChannelID string `json:"channelId"`
	Type      string `json:"type"`
	Label     string `json:"label"`
	Target    string `json:"target"`
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}

	snapshot, err := h.repository.GetSnapshot(r.Context(), principal.PlayerID)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "support_unavailable", "Support information is temporarily unavailable.", "")
		return
	}
	response := supportResponse{Availability: string(snapshot.Availability), Message: snapshot.Message}
	for _, topic := range snapshot.Topics {
		response.Topics = append(response.Topics, topicResponse{TopicID: topic.TopicID, Category: topic.Category, Title: topic.Title, Summary: topic.Summary})
	}
	for _, channel := range snapshot.Channels {
		response.Channels = append(response.Channels, channelResponse{ChannelID: channel.ChannelID, Type: string(channel.Type), Label: channel.Label, Target: channel.Target})
	}
	for _, request := range snapshot.RecentRequests {
		response.RecentRequests = append(response.RecentRequests, mapRequest(request))
	}
	httpapi.WriteJSON(w, http.StatusOK, response)
}

func (h *HTTPHandler) Create(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	var body createRequestBody
	if err := httpapi.DecodeJSON(w, r, &body, supportBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid support request.", "")
		return
	}
	requestID, err := h.repository.CreateRequest(r.Context(), CreateRequestCommand{
		PlayerID:       principal.PlayerID,
		Category:       body.Category,
		Subject:        body.Subject,
		Message:        body.Message,
		IdempotencyKey: strings.TrimSpace(r.Header.Get("Idempotency-Key")),
	})
	if err != nil {
		if errors.Is(err, ErrIdempotencyConflict) {
			httpapi.WriteError(w, http.StatusConflict, "idempotency_conflict", "The idempotency key was already used for a different request.", "")
			return
		}
		httpapi.WriteError(w, http.StatusBadRequest, "support_request_rejected", "The support request could not be created.", "")
		return
	}
	httpapi.WriteJSON(w, http.StatusCreated, struct {
		RequestID string `json:"requestId"`
	}{RequestID: requestID})
}

func (h *HTTPHandler) GetRequest(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	requestID := strings.TrimSpace(r.PathValue("requestID"))
	if requestID == "" {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request_id", "Support request id is required.", "")
		return
	}
	request, err := h.repository.GetRequest(r.Context(), principal.PlayerID, requestID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			httpapi.WriteError(w, http.StatusNotFound, "support_request_not_found", "Support request not found.", "")
			return
		}
		httpapi.WriteError(w, http.StatusServiceUnavailable, "support_unavailable", "Support request is temporarily unavailable.", "")
		return
	}
	httpapi.WriteJSON(w, http.StatusOK, mapRequest(request))
}

func mapRequest(request RequestSummaryReadModel) requestResponse {
	return requestResponse{
		RequestID: request.RequestID,
		Category:  request.Category,
		Subject:   request.Subject,
		Status:    string(request.Status),
		CreatedAt: request.CreatedAt,
		UpdatedAt: request.UpdatedAt,
	}
}
