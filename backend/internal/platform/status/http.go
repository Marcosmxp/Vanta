package status

import (
	"net/http"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
)

type HTTPHandler struct {
	service *Service
}

func NewHTTPHandler(service *Service) *HTTPHandler {
	return &HTTPHandler{service: service}
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	model := h.service.Get(r.Context())
	if err := model.Validate(); err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "status_unavailable", "Service status is temporarily unavailable.", "")
		return
	}
	statusCode := http.StatusOK
	if model.Availability == AvailabilityMaintenance {
		statusCode = http.StatusServiceUnavailable
	}
	httpapi.WriteJSON(w, statusCode, struct {
		Availability string `json:"availability"`
		IncidentID   string `json:"incidentId,omitempty"`
		Message      string `json:"message"`
		RetryAfterAt any    `json:"retryAfterAt,omitempty"`
		UpdatedAt    any    `json:"updatedAt"`
	}{
		Availability: string(model.Availability),
		IncidentID:   model.IncidentID,
		Message:      model.Message,
		RetryAfterAt: model.RetryAfterAt,
		UpdatedAt:    model.UpdatedAt,
	})
}
