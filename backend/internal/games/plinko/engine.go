package plinko

import (
	"crypto/rand"
	"errors"
	"fmt"
	"io"
)

const (
	MinRows = 8
	MaxRows = 16
)

var ErrInvalidRows = errors.New("plinko rows outside supported range")

type Direction uint8

const (
	Left Direction = iota
	Right
)

type DropResult struct {
	Path []Direction
	Slot int
}

type Engine interface {
	Drop(rows int) (DropResult, error)
}

type SecureEngine struct {
	reader io.Reader
}

func NewSecureEngine() SecureEngine {
	return SecureEngine{reader: rand.Reader}
}

func newEngineWithReader(reader io.Reader) SecureEngine {
	return SecureEngine{reader: reader}
}

func (e SecureEngine) Drop(rows int) (DropResult, error) {
	if rows < MinRows || rows > MaxRows {
		return DropResult{}, fmt.Errorf("%w: %d", ErrInvalidRows, rows)
	}
	if e.reader == nil {
		return DropResult{}, errors.New("plinko random source is not configured")
	}

	entropy := make([]byte, (rows+7)/8)
	if _, err := io.ReadFull(e.reader, entropy); err != nil {
		return DropResult{}, fmt.Errorf("read plinko entropy: %w", err)
	}

	path := make([]Direction, rows)
	slot := 0
	for row := 0; row < rows; row++ {
		bit := (entropy[row/8] >> uint(row%8)) & 1
		if bit == 1 {
			path[row] = Right
			slot++
			continue
		}
		path[row] = Left
	}

	return DropResult{Path: path, Slot: slot}, nil
}
