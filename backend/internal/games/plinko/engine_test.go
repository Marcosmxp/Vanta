package plinko

import (
	"bytes"
	"errors"
	"testing"
)

func TestSecureEngineDropMapsEntropyToPathAndSlot(t *testing.T) {
	engine := newEngineWithReader(bytes.NewReader([]byte{0b10101100, 0b00000011}))

	result, err := engine.Drop(10)
	if err != nil {
		t.Fatalf("Drop() error = %v", err)
	}
	if len(result.Path) != 10 {
		t.Fatalf("path length = %d, want 10", len(result.Path))
	}

	rights := 0
	for _, direction := range result.Path {
		if direction == Right {
			rights++
		}
	}
	if result.Slot != rights {
		t.Fatalf("slot = %d, rights = %d", result.Slot, rights)
	}
}

func TestSecureEngineRejectsUnsupportedRows(t *testing.T) {
	engine := newEngineWithReader(bytes.NewReader([]byte{0xFF}))

	_, err := engine.Drop(MinRows - 1)
	if !errors.Is(err, ErrInvalidRows) {
		t.Fatalf("Drop() error = %v, want ErrInvalidRows", err)
	}
}

func TestSecureEngineFailsClosedWhenEntropyUnavailable(t *testing.T) {
	engine := newEngineWithReader(bytes.NewReader(nil))

	_, err := engine.Drop(MinRows)
	if err == nil {
		t.Fatal("Drop() error = nil, want entropy failure")
	}
}
