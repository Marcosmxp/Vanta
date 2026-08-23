package status

import (
	"errors"
	"strings"
	"time"
)

type Availability string

const (
	AvailabilityOperational Availability = "operational"
	AvailabilityDegraded    Availability = "degraded"
	AvailabilityMaintenance Availability = "maintenance"
)

type ReadModel struct {
	Availability Availability
	IncidentID   string
	Message      string
	RetryAfterAt *time.Time
	UpdatedAt    time.Time
}

func (m ReadModel) Validate() error {
	if !validAvailability(m.Availability) {
		return errors.New("invalid platform availability")
	}
	if m.UpdatedAt.IsZero() {
		return errors.New("platform availability requires updated timestamp")
	}
	if strings.TrimSpace(m.Message) == "" {
		return errors.New("platform availability requires safe public message")
	}
	if m.RetryAfterAt != nil && !m.RetryAfterAt.After(m.UpdatedAt) {
		return errors.New("retry-after timestamp must follow update timestamp")
	}
	if m.Availability == AvailabilityMaintenance && strings.TrimSpace(m.IncidentID) == "" {
		return errors.New("maintenance state requires public incident id")
	}
	if m.Availability == AvailabilityOperational && strings.TrimSpace(m.IncidentID) != "" {
		return errors.New("operational state cannot expose active incident id")
	}
	return nil
}

func validAvailability(value Availability) bool {
	return value == AvailabilityOperational || value == AvailabilityDegraded || value == AvailabilityMaintenance
}
