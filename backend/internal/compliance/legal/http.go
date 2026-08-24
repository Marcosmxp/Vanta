package legal

import (
	"errors"
	"net/http"
	"strings"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
	"github.com/jackc/pgx/v5"
)

type HTTPHandler struct {
	repository   *PostgresRepository
	jurisdiction string
}

func NewHTTPHandler(repository *PostgresRepository, jurisdiction string) *HTTPHandler {
	return &HTTPHandler{repository: repository, jurisdiction: jurisdiction}
}

type documentSummaryResponse struct {
	DocumentID    string `json:"documentId"`
	Kind          string `json:"kind"`
	Title         string `json:"title"`
	Version       string `json:"version"`
	EffectiveAt   any    `json:"effectiveAt"`
	UpdatedAt     any    `json:"updatedAt"`
	ContentSHA256 string `json:"contentSHA256"`
}

type documentDetailResponse struct {
	documentSummaryResponse
	BodyMarkdown string `json:"bodyMarkdown"`
}

type authorityResponse struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

type licenseReferenceResponse struct {
	LicenseID string `json:"licenseId"`
	Scope     string `json:"scope"`
}

type regulatoryResponse struct {
	JurisdictionCode     string                     `json:"jurisdictionCode"`
	OperatorLegalName    string                     `json:"operatorLegalName"`
	OperatorContact      string                     `json:"operatorContact"`
	OperatorAddress      string                     `json:"operatorAddress"`
	LicensingStatus      string                     `json:"licensingStatus"`
	Regulator            authorityResponse          `json:"regulator"`
	LicenseReferences    []licenseReferenceResponse `json:"licenseReferences"`
	LicenseNotice        string                     `json:"licenseNotice"`
	ComplaintsDocumentID string                     `json:"complaintsDocumentId"`
}

type privacyResponse struct {
	ControllerName       string            `json:"controllerName"`
	PrivacyContact       string            `json:"privacyContact"`
	DPOContact           string            `json:"dpoContact,omitempty"`
	SupervisoryAuthority authorityResponse `json:"supervisoryAuthority"`
	PrivacyDocumentID    string            `json:"privacyDocumentId"`
}

type legalResponse struct {
	Availability string                    `json:"availability"`
	Documents    []documentSummaryResponse `json:"documents"`
	Regulatory   *regulatoryResponse       `json:"regulatory,omitempty"`
	Privacy      *privacyResponse          `json:"privacy,omitempty"`
	Message      string                    `json:"message,omitempty"`
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	snapshot, err := h.repository.GetSnapshot(r.Context(), h.jurisdiction)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "legal_unavailable", "Legal information is temporarily unavailable.", "")
		return
	}

	response := legalResponse{Availability: string(snapshot.Availability), Message: snapshot.Message}
	for _, document := range snapshot.Documents {
		response.Documents = append(response.Documents, mapDocumentSummary(document))
	}
	if snapshot.Regulatory != nil {
		regulatory := regulatoryResponse{
			JurisdictionCode:     snapshot.Regulatory.JurisdictionCode,
			OperatorLegalName:    snapshot.Regulatory.OperatorLegalName,
			OperatorContact:      snapshot.Regulatory.OperatorContact,
			OperatorAddress:      snapshot.Regulatory.OperatorAddress,
			LicensingStatus:      string(snapshot.Regulatory.LicensingStatus),
			Regulator:            authorityResponse{Name: snapshot.Regulatory.Regulator.Name, URL: snapshot.Regulatory.Regulator.URL},
			LicenseNotice:        snapshot.Regulatory.LicenseNotice,
			ComplaintsDocumentID: snapshot.Regulatory.ComplaintsDocumentID,
		}
		for _, reference := range snapshot.Regulatory.LicenseReferences {
			regulatory.LicenseReferences = append(regulatory.LicenseReferences, licenseReferenceResponse{LicenseID: reference.LicenseID, Scope: reference.Scope})
		}
		response.Regulatory = &regulatory
	}
	if snapshot.Privacy != nil {
		response.Privacy = &privacyResponse{
			ControllerName:       snapshot.Privacy.ControllerName,
			PrivacyContact:       snapshot.Privacy.PrivacyContact,
			DPOContact:           snapshot.Privacy.DPOContact,
			SupervisoryAuthority: authorityResponse{Name: snapshot.Privacy.SupervisoryAuthority.Name, URL: snapshot.Privacy.SupervisoryAuthority.URL},
			PrivacyDocumentID:    snapshot.Privacy.PrivacyDocumentID,
		}
	}

	httpapi.WriteJSON(w, http.StatusOK, response)
}

func (h *HTTPHandler) GetDocument(w http.ResponseWriter, r *http.Request) {
	documentID := strings.TrimSpace(r.PathValue("documentID"))
	if documentID == "" {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_document_id", "Document id is required.", "")
		return
	}
	document, err := h.repository.GetDocument(r.Context(), documentID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			httpapi.WriteError(w, http.StatusNotFound, "legal_document_not_found", "Legal document not found.", "")
			return
		}
		httpapi.WriteError(w, http.StatusServiceUnavailable, "legal_unavailable", "Legal document is temporarily unavailable.", "")
		return
	}
	httpapi.WriteJSON(w, http.StatusOK, documentDetailResponse{documentSummaryResponse: mapDocumentSummary(document.DocumentSummaryReadModel), BodyMarkdown: document.BodyMarkdown})
}

func mapDocumentSummary(document DocumentSummaryReadModel) documentSummaryResponse {
	return documentSummaryResponse{
		DocumentID:    document.DocumentID,
		Kind:          string(document.Kind),
		Title:         document.Title,
		Version:       document.Version,
		EffectiveAt:   document.EffectiveAt,
		UpdatedAt:     document.UpdatedAt,
		ContentSHA256: document.ContentSHA256,
	}
}
