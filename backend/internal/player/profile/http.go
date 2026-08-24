package profile

import (
	"net/http"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
)

type Reader interface {
	Get(ctx interface{ Done() <-chan struct{} }, playerID string) (Snapshot, error)
}

// Handler intentionally depends on the concrete PostgreSQL repository through a narrow method call.
// The HTTP response is privacy-minimized and does not include decrypted PII.
type HTTPHandler struct {
	repository *PostgresRepository
}

func NewHTTPHandler(repository *PostgresRepository) *HTTPHandler {
	return &HTTPHandler{repository: repository}
}

type profileResponse struct {
	Availability string                       `json:"availability"`
	Identity     profileIdentityResponse      `json:"identity"`
	Verification profileVerificationResponse  `json:"verification"`
	Preferences  profilePreferencesResponse   `json:"preferences"`
}

type profileIdentityResponse struct {
	PlayerID    string    `json:"playerId"`
	DisplayName string    `json:"displayName"`
	EmailMasked string    `json:"emailMasked"`
	PhoneMasked string    `json:"phoneMasked"`
	CountryCode string    `json:"countryCode"`
	MemberSince time.Time `json:"memberSince"`
}

type profileVerificationResponse struct {
	AgeVerified   *bool  `json:"ageVerified"`
	KYCStatus     string `json:"kycStatus"`
	AccountStatus string `json:"accountStatus"`
}

type profilePreferencesResponse struct {
	Language         string `json:"language"`
	MarketingOptIn   *bool  `json:"marketingOptIn"`
	ProtectionStatus string `json:"protectionStatus"`
}

func (h *HTTPHandler) Get(w http.ResponseWriter, r *http.Request) {
	principal, ok := auth.PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}

	snapshot, err := h.repository.Get(r.Context(), principal.PlayerID)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "profile_unavailable", "Profile data is temporarily unavailable.", "")
		return
	}

	httpapi.WriteJSON(w, http.StatusOK, profileResponse{
		Availability: string(snapshot.Availability),
		Identity: profileIdentityResponse{
			PlayerID: snapshot.Identity.PlayerID, DisplayName: snapshot.Identity.DisplayName,
			EmailMasked: snapshot.Identity.EmailMasked, PhoneMasked: snapshot.Identity.PhoneMasked,
			CountryCode: snapshot.Identity.CountryCode, MemberSince: snapshot.Identity.MemberSince,
		},
		Verification: profileVerificationResponse{
			AgeVerified: snapshot.Verification.AgeVerified,
			KYCStatus: string(snapshot.Verification.KYCStatus),
			AccountStatus: string(snapshot.Verification.AccountStatus),
		},
		Preferences: profilePreferencesResponse{
			Language: string(snapshot.Preferences.Language),
			MarketingOptIn: snapshot.Preferences.MarketingOptIn,
			ProtectionStatus: string(snapshot.Preferences.ProtectionStatus),
		},
	})
}
