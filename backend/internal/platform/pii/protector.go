package pii

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"strings"
)

type Protector struct {
	aead      cipher.AEAD
	lookupKey []byte
}

func NewProtector(encryptionKey, lookupKey []byte) (*Protector, error) {
	if len(encryptionKey) != 32 {
		return nil, fmt.Errorf("PII encryption key must be 32 bytes")
	}
	if len(lookupKey) < 32 {
		return nil, fmt.Errorf("PII lookup key must be at least 32 bytes")
	}

	block, err := aes.NewCipher(encryptionKey)
	if err != nil {
		return nil, fmt.Errorf("create AES cipher: %w", err)
	}
	aead, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("create AES-GCM: %w", err)
	}

	return &Protector{aead: aead, lookupKey: append([]byte(nil), lookupKey...)}, nil
}

func (p *Protector) EncryptString(value string) (ciphertext, nonce []byte, err error) {
	nonce = make([]byte, p.aead.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, nil, fmt.Errorf("generate PII nonce: %w", err)
	}
	ciphertext = p.aead.Seal(nil, nonce, []byte(value), nil)
	return ciphertext, nonce, nil
}

func (p *Protector) DecryptString(ciphertext, nonce []byte) (string, error) {
	plaintext, err := p.aead.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", fmt.Errorf("decrypt PII: %w", err)
	}
	return string(plaintext), nil
}

func (p *Protector) LookupHash(normalized string) string {
	mac := hmac.New(sha256.New, p.lookupKey)
	_, _ = mac.Write([]byte(normalized))
	return hex.EncodeToString(mac.Sum(nil))
}

func NormalizeEmail(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func MaskEmail(value string) string {
	value = NormalizeEmail(value)
	parts := strings.Split(value, "@")
	if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
		return "***"
	}
	local := []rune(parts[0])
	visible := string(local[0])
	return visible + strings.Repeat("*", max(3, len(local)-1)) + "@" + parts[1]
}
