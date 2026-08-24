package ids

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

func New(prefix string) (string, error) {
	if prefix == "" {
		return "", fmt.Errorf("identifier prefix is required")
	}

	random := make([]byte, 16)
	if _, err := rand.Read(random); err != nil {
		return "", fmt.Errorf("generate identifier: %w", err)
	}

	return prefix + "_" + hex.EncodeToString(random), nil
}
