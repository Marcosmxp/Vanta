package auth

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpapi"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/ratelimit"
)

type contextKey string

const principalContextKey contextKey = "auth-principal"

const authBodyLimit = 16 << 10

type HTTPHandler struct {
	service *Service
	limiter *ratelimit.Limiter
}

func NewHTTPHandler(service *Service, limiter *ratelimit.Limiter) *HTTPHandler {
	return &HTTPHandler{service: service, limiter: limiter}
}

type registerRequest struct {
	Email         string `json:"email"`
	Password      string `json:"password"`
	DisplayName   string `json:"displayName"`
	CountryCode   string `json:"countryCode"`
	TermsAccepted bool   `json:"termsAccepted"`
	DeviceLabel   string `json:"deviceLabel"`
	Platform      string `json:"platform"`
}

type loginRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DeviceLabel string `json:"deviceLabel"`
	Platform    string `json:"platform"`
}

type refreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

func (h *HTTPHandler) Register(w http.ResponseWriter, r *http.Request) {
	if !h.allowAuthAttempt(w, r, "register", 5, 10*time.Minute) {
		return
	}
	var request registerRequest
	if err := httpapi.DecodeJSON(w, r, &request, authBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid registration request.", "")
		return
	}

	pair, err := h.service.Register(r.Context(), RegisterInput{
		Email:         request.Email,
		Password:      request.Password,
		DisplayName:   request.DisplayName,
		CountryCode:   request.CountryCode,
		TermsAccepted: request.TermsAccepted,
		DeviceLabel:   request.DeviceLabel,
		Platform:      request.Platform,
		IPMasked:      httpapi.MaskRemoteIP(r.RemoteAddr),
	})
	if err != nil {
		if errors.Is(err, ErrConflict) {
			httpapi.WriteError(w, http.StatusConflict, "account_conflict", "An account with these credentials already exists.", "")
			return
		}
		httpapi.WriteError(w, http.StatusBadRequest, "registration_rejected", "The account could not be created with the supplied data.", "")
		return
	}

	httpapi.WriteJSON(w, http.StatusCreated, pair)
}

func (h *HTTPHandler) Login(w http.ResponseWriter, r *http.Request) {
	if !h.allowAuthAttempt(w, r, "login", 10, 10*time.Minute) {
		return
	}
	var request loginRequest
	if err := httpapi.DecodeJSON(w, r, &request, authBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid login request.", "")
		return
	}

	pair, err := h.service.Login(r.Context(), LoginInput{
		Email:       request.Email,
		Password:    request.Password,
		DeviceLabel: request.DeviceLabel,
		Platform:    request.Platform,
		IPMasked:    httpapi.MaskRemoteIP(r.RemoteAddr),
	})
	if err != nil {
		httpapi.WriteError(w, http.StatusUnauthorized, "invalid_credentials", "Email or password is invalid.", "")
		return
	}

	httpapi.WriteJSON(w, http.StatusOK, pair)
}

func (h *HTTPHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	if !h.allowAuthAttempt(w, r, "refresh", 30, 10*time.Minute) {
		return
	}
	var request refreshRequest
	if err := httpapi.DecodeJSON(w, r, &request, authBodyLimit); err != nil {
		httpapi.WriteError(w, http.StatusBadRequest, "invalid_request", "Invalid refresh request.", "")
		return
	}

	pair, err := h.service.Refresh(r.Context(), request.RefreshToken)
	if err != nil {
		httpapi.WriteError(w, http.StatusUnauthorized, "invalid_refresh_token", "The session can no longer be refreshed.", "")
		return
	}

	httpapi.WriteJSON(w, http.StatusOK, pair)
}

func (h *HTTPHandler) Logout(w http.ResponseWriter, r *http.Request) {
	principal, ok := PrincipalFromContext(r.Context())
	if !ok {
		httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
		return
	}
	if err := h.service.Logout(r.Context(), principal.SessionID); err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "logout_unavailable", "The session could not be revoked safely.", "")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *HTTPHandler) RequireAuthentication(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := strings.TrimSpace(r.Header.Get("Authorization"))
		scheme, token, ok := strings.Cut(header, " ")
		if !ok || !strings.EqualFold(scheme, "Bearer") || strings.TrimSpace(token) == "" {
			httpapi.WriteError(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.", "")
			return
		}

		principal, err := h.service.Authenticate(r.Context(), strings.TrimSpace(token))
		if err != nil {
			httpapi.WriteError(w, http.StatusUnauthorized, "invalid_access_token", "The access token is invalid or expired.", "")
			return
		}

		ctx := context.WithValue(r.Context(), principalContextKey, principal)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (h *HTTPHandler) allowAuthAttempt(w http.ResponseWriter, r *http.Request, scope string, maximum int64, window time.Duration) bool {
	subject := httpapi.RemoteIP(r.RemoteAddr)
	if subject == "" {
		// RemoteAddr is server-supplied. If it cannot be normalized, collapse it
		// into one fail-safe bucket rather than using attacker-controlled text.
		subject = "unknown-client"
	}
	allowed, err := h.limiter.Allow(r.Context(), scope, subject, maximum, window)
	if err != nil {
		httpapi.WriteError(w, http.StatusServiceUnavailable, "security_dependency_unavailable", "Authentication is temporarily unavailable.", "")
		return false
	}
	if !allowed {
		w.Header().Set("Retry-After", "600")
		httpapi.WriteError(w, http.StatusTooManyRequests, "rate_limited", "Too many authentication attempts. Try again later.", "")
		return false
	}
	return true
}

func PrincipalFromContext(ctx context.Context) (Principal, bool) {
	principal, ok := ctx.Value(principalContextKey).(Principal)
	return principal, ok
}
