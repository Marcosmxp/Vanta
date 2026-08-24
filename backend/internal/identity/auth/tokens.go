package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"strings"
)

func newToken(sessionID string) (plain string, hash string, err error) {
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		return "", "", fmt.Errorf("generate token secret: %w", err)
	}
	plain = sessionID + "." + base64.RawURLEncoding.EncodeToString(secret)
	return plain, tokenHash(plain), nil
}

func tokenHash(token string) string {
	digest := sha256.Sum256([]byte(token))
	return hex.EncodeToString(digest[:])
}

func tokenSessionID(token string) (string, bool) {
	sessionID, secret, ok := strings.Cut(strings.TrimSpace(token), ".")
	if !ok || sessionID == "" || secret == "" {
		return "", false
	}
	if _, err := base64.RawURLEncoding.DecodeString(secret); err != nil {
		return "", false
	}
	return sessionID, true
}

func hashesEqual(expected, actual string) bool {
	if len(expected) != len(actual) {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(expected), []byte(actual)) == 1
}
