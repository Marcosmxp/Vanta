package pii

import (
	"bytes"
	"testing"
)

func TestProtectorEncryptsAndDetectsTampering(t *testing.T) {
	key := []byte("01234567890123456789012345678901")
	protector, err := NewProtector(key, key)
	if err != nil {
		t.Fatalf("create protector: %v", err)
	}

	plaintext := "player@example.test"
	ciphertext, nonce, err := protector.EncryptString(plaintext)
	if err != nil {
		t.Fatalf("encrypt: %v", err)
	}
	if bytes.Contains(ciphertext, []byte(plaintext)) {
		t.Fatal("ciphertext must not contain plaintext")
	}
	decrypted, err := protector.DecryptString(ciphertext, nonce)
	if err != nil {
		t.Fatalf("decrypt: %v", err)
	}
	if decrypted != plaintext {
		t.Fatalf("unexpected plaintext %q", decrypted)
	}

	tampered := append([]byte(nil), ciphertext...)
	tampered[len(tampered)-1] ^= 0x01
	if _, err := protector.DecryptString(tampered, nonce); err == nil {
		t.Fatal("tampered ciphertext must fail authentication")
	}
}

func TestLookupHashIsKeyedAndDeterministic(t *testing.T) {
	encryptionKey := []byte("01234567890123456789012345678901")
	lookupKeyA := []byte("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
	lookupKeyB := []byte("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")

	protectorA, err := NewProtector(encryptionKey, lookupKeyA)
	if err != nil {
		t.Fatalf("create protector A: %v", err)
	}
	protectorB, err := NewProtector(encryptionKey, lookupKeyB)
	if err != nil {
		t.Fatalf("create protector B: %v", err)
	}

	value := NormalizeEmail(" Player@Example.Test ")
	first := protectorA.LookupHash(value)
	if first != protectorA.LookupHash(value) {
		t.Fatal("lookup hash must be deterministic for the same key/value")
	}
	if first == protectorB.LookupHash(value) {
		t.Fatal("lookup hash must depend on the secret lookup key")
	}
}

func TestMaskEmailMinimizesLocalPart(t *testing.T) {
	masked := MaskEmail("alice@example.test")
	if masked != "a****@example.test" {
		t.Fatalf("unexpected masked email %q", masked)
	}
}
