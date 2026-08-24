package auth

import (
	"context"
	"errors"
	"fmt"
	"net/mail"
	"strings"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/platform/ids"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/pii"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrConflict           = errors.New("account already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidToken       = errors.New("invalid session token")
	ErrSessionRevoked     = errors.New("session revoked")
)

const passwordCost = 12

type Credential struct {
	PlayerID      string
	PasswordHash  []byte
	AccountStatus string
}

type Session struct {
	SessionID         string
	PlayerID          string
	AccessTokenHash   string
	AccessExpiresAt   time.Time
	RefreshTokenHash  string
	RefreshExpiresAt  time.Time
	RefreshGeneration int64
	DeviceLabel       string
	Platform          string
	IPMasked          string
	MFAUsed           bool
	Trust             string
	CreatedAt         time.Time
	LastSeenAt        time.Time
	RevokedAt         *time.Time
}

type NewAccount struct {
	PlayerID         string
	EmailLookupHash  string
	EmailCiphertext  []byte
	EmailNonce       []byte
	EmailMasked      string
	DisplayName      string
	CountryCode      string
	PasswordHash     []byte
	WalletID         string
	AvailableAccount string
	ReservedAccount  string
}

type NewSession struct {
	SessionID        string
	PlayerID         string
	AccessTokenHash  string
	AccessExpiresAt  time.Time
	RefreshTokenHash string
	RefreshExpiresAt time.Time
	DeviceLabel      string
	Platform         string
	IPMasked         string
}

type SessionRotation struct {
	SessionID                string
	ExpectedRefreshTokenHash string
	ExpectedGeneration       int64
	AccessTokenHash          string
	AccessExpiresAt          time.Time
	RefreshTokenHash         string
	RefreshExpiresAt         time.Time
	Generation               int64
}

type Store interface {
	CreateAccount(context.Context, NewAccount) error
	FindCredentialByEmailHash(context.Context, string) (Credential, error)
	CreateSession(context.Context, NewSession) error
	GetSession(context.Context, string) (Session, error)
	RotateSession(context.Context, SessionRotation) error
	RevokeSession(context.Context, string, string) error
	TouchSession(context.Context, string, time.Time) error
}

type Service struct {
	store      Store
	protector  *pii.Protector
	accessTTL  time.Duration
	refreshTTL time.Duration
	now        func() time.Time
}

type RegisterInput struct {
	Email         string
	Password      string
	DisplayName   string
	CountryCode   string
	TermsAccepted bool
	DeviceLabel   string
	Platform      string
	IPMasked      string
}

type LoginInput struct {
	Email       string
	Password    string
	DeviceLabel string
	Platform    string
	IPMasked    string
}

type TokenPair struct {
	AccessToken      string    `json:"accessToken"`
	AccessExpiresAt  time.Time `json:"accessExpiresAt"`
	RefreshToken     string    `json:"refreshToken"`
	RefreshExpiresAt time.Time `json:"refreshExpiresAt"`
	SessionID        string    `json:"sessionId"`
	PlayerID         string    `json:"playerId"`
}

type Principal struct {
	PlayerID  string
	SessionID string
}

func NewService(store Store, protector *pii.Protector, accessTTL, refreshTTL time.Duration) *Service {
	return &Service{
		store:      store,
		protector:  protector,
		accessTTL:  accessTTL,
		refreshTTL: refreshTTL,
		now:        func() time.Time { return time.Now().UTC() },
	}
}

func (s *Service) Register(ctx context.Context, input RegisterInput) (TokenPair, error) {
	email, err := validateEmail(input.Email)
	if err != nil {
		return TokenPair{}, err
	}
	if err := validatePassword(input.Password); err != nil {
		return TokenPair{}, err
	}
	if !input.TermsAccepted {
		return TokenPair{}, fmt.Errorf("terms acceptance is required")
	}

	displayName := strings.TrimSpace(input.DisplayName)
	if len([]rune(displayName)) < 2 || len([]rune(displayName)) > 50 {
		return TokenPair{}, fmt.Errorf("display name must contain 2 to 50 characters")
	}
	countryCode := strings.ToUpper(strings.TrimSpace(input.CountryCode))
	if len(countryCode) != 2 {
		return TokenPair{}, fmt.Errorf("country code must use ISO alpha-2 shape")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), passwordCost)
	if err != nil {
		return TokenPair{}, fmt.Errorf("hash password: %w", err)
	}
	ciphertext, nonce, err := s.protector.EncryptString(email)
	if err != nil {
		return TokenPair{}, err
	}

	playerID, err := ids.New("player")
	if err != nil {
		return TokenPair{}, err
	}
	walletID, err := ids.New("wallet")
	if err != nil {
		return TokenPair{}, err
	}
	availableAccount, err := ids.New("ledger")
	if err != nil {
		return TokenPair{}, err
	}
	reservedAccount, err := ids.New("ledger")
	if err != nil {
		return TokenPair{}, err
	}

	account := NewAccount{
		PlayerID:         playerID,
		EmailLookupHash:  s.protector.LookupHash(email),
		EmailCiphertext:  ciphertext,
		EmailNonce:       nonce,
		EmailMasked:      pii.MaskEmail(email),
		DisplayName:      displayName,
		CountryCode:      countryCode,
		PasswordHash:     passwordHash,
		WalletID:         walletID,
		AvailableAccount: availableAccount,
		ReservedAccount:  reservedAccount,
	}
	if err := s.store.CreateAccount(ctx, account); err != nil {
		return TokenPair{}, err
	}

	return s.issueSession(ctx, playerID, input.DeviceLabel, input.Platform, input.IPMasked)
}

func (s *Service) Login(ctx context.Context, input LoginInput) (TokenPair, error) {
	email, err := validateEmail(input.Email)
	if err != nil {
		return TokenPair{}, ErrInvalidCredentials
	}
	credential, err := s.store.FindCredentialByEmailHash(ctx, s.protector.LookupHash(email))
	if err != nil {
		return TokenPair{}, ErrInvalidCredentials
	}
	if bcrypt.CompareHashAndPassword(credential.PasswordHash, []byte(input.Password)) != nil {
		return TokenPair{}, ErrInvalidCredentials
	}

	return s.issueSession(ctx, credential.PlayerID, input.DeviceLabel, input.Platform, input.IPMasked)
}

func (s *Service) Refresh(ctx context.Context, refreshToken string) (TokenPair, error) {
	sessionID, ok := tokenSessionID(refreshToken)
	if !ok {
		return TokenPair{}, ErrInvalidToken
	}
	session, err := s.store.GetSession(ctx, sessionID)
	if err != nil {
		return TokenPair{}, ErrInvalidToken
	}
	if session.RevokedAt != nil {
		return TokenPair{}, ErrSessionRevoked
	}

	now := s.now()
	presentedHash := tokenHash(refreshToken)
	if !hashesEqual(session.RefreshTokenHash, presentedHash) {
		_ = s.store.RevokeSession(ctx, sessionID, "refresh-token-reuse-or-mismatch")
		return TokenPair{}, ErrInvalidToken
	}
	if !now.Before(session.RefreshExpiresAt) {
		_ = s.store.RevokeSession(ctx, sessionID, "refresh-token-expired")
		return TokenPair{}, ErrInvalidToken
	}

	accessToken, accessHash, err := newToken(sessionID)
	if err != nil {
		return TokenPair{}, err
	}
	refreshTokenNext, refreshHash, err := newToken(sessionID)
	if err != nil {
		return TokenPair{}, err
	}
	accessExpiresAt := now.Add(s.accessTTL)
	refreshExpiresAt := now.Add(s.refreshTTL)
	generation := session.RefreshGeneration + 1

	err = s.store.RotateSession(ctx, SessionRotation{
		SessionID:                sessionID,
		ExpectedRefreshTokenHash: presentedHash,
		ExpectedGeneration:       session.RefreshGeneration,
		AccessTokenHash:          accessHash,
		AccessExpiresAt:          accessExpiresAt,
		RefreshTokenHash:         refreshHash,
		RefreshExpiresAt:         refreshExpiresAt,
		Generation:               generation,
	})
	if err != nil {
		// A failed compare-and-swap after a valid pre-check means the refresh
		// generation changed concurrently or the session was otherwise altered.
		// Treat this as token replay/race and revoke fail-closed.
		_ = s.store.RevokeSession(ctx, sessionID, "refresh-token-reuse-or-race")
		return TokenPair{}, ErrInvalidToken
	}

	return TokenPair{
		AccessToken:      accessToken,
		AccessExpiresAt:  accessExpiresAt,
		RefreshToken:     refreshTokenNext,
		RefreshExpiresAt: refreshExpiresAt,
		SessionID:        sessionID,
		PlayerID:         session.PlayerID,
	}, nil
}

func (s *Service) Authenticate(ctx context.Context, accessToken string) (Principal, error) {
	sessionID, ok := tokenSessionID(accessToken)
	if !ok {
		return Principal{}, ErrInvalidToken
	}
	session, err := s.store.GetSession(ctx, sessionID)
	if err != nil || session.RevokedAt != nil {
		return Principal{}, ErrInvalidToken
	}
	if !hashesEqual(session.AccessTokenHash, tokenHash(accessToken)) || !s.now().Before(session.AccessExpiresAt) {
		return Principal{}, ErrInvalidToken
	}
	_ = s.store.TouchSession(ctx, sessionID, s.now())
	return Principal{PlayerID: session.PlayerID, SessionID: session.SessionID}, nil
}

func (s *Service) Logout(ctx context.Context, sessionID string) error {
	return s.store.RevokeSession(ctx, sessionID, "player-logout")
}

func (s *Service) issueSession(ctx context.Context, playerID, deviceLabel, platform, ipMasked string) (TokenPair, error) {
	sessionID, err := ids.New("session")
	if err != nil {
		return TokenPair{}, err
	}
	accessToken, accessHash, err := newToken(sessionID)
	if err != nil {
		return TokenPair{}, err
	}
	refreshToken, refreshHash, err := newToken(sessionID)
	if err != nil {
		return TokenPair{}, err
	}

	now := s.now()
	accessExpiresAt := now.Add(s.accessTTL)
	refreshExpiresAt := now.Add(s.refreshTTL)
	if strings.TrimSpace(deviceLabel) == "" {
		deviceLabel = "Unknown device"
	}
	if strings.TrimSpace(platform) == "" {
		platform = "unknown"
	}

	if err := s.store.CreateSession(ctx, NewSession{
		SessionID:        sessionID,
		PlayerID:         playerID,
		AccessTokenHash:  accessHash,
		AccessExpiresAt:  accessExpiresAt,
		RefreshTokenHash: refreshHash,
		RefreshExpiresAt: refreshExpiresAt,
		DeviceLabel:      strings.TrimSpace(deviceLabel),
		Platform:         strings.TrimSpace(platform),
		IPMasked:         strings.TrimSpace(ipMasked),
	}); err != nil {
		return TokenPair{}, err
	}

	return TokenPair{
		AccessToken:      accessToken,
		AccessExpiresAt:  accessExpiresAt,
		RefreshToken:     refreshToken,
		RefreshExpiresAt: refreshExpiresAt,
		SessionID:        sessionID,
		PlayerID:         playerID,
	}, nil
}

func validateEmail(value string) (string, error) {
	normalized := pii.NormalizeEmail(value)
	address, err := mail.ParseAddress(normalized)
	if err != nil || address.Address != normalized || len(normalized) > 254 {
		return "", fmt.Errorf("invalid email address")
	}
	return normalized, nil
}

func validatePassword(value string) error {
	length := len([]rune(value))
	if length < 12 || length > 128 {
		return fmt.Errorf("password must contain 12 to 128 characters")
	}
	return nil
}
