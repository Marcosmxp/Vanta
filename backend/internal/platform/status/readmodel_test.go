package status

import (
	"testing"
	"time"
)

func TestReadModelValidateMaintenance(t *testing.T) {
	now := time.Date(2026, time.August, 23, 9, 0, 0, 0, time.UTC)
	retryAt := now.Add(30 * time.Minute)
	model := ReadModel{
		Availability: AvailabilityMaintenance,
		IncidentID:   "incident_public_123",
		Message:      "Serviço temporariamente indisponível para manutenção.",
		RetryAfterAt: &retryAt,
		UpdatedAt:    now,
	}

	if err := model.Validate(); err != nil {
		t.Fatalf("expected valid maintenance read model, got %v", err)
	}
}

func TestReadModelValidateRejectsMaintenanceWithoutIncident(t *testing.T) {
	model := ReadModel{
		Availability: AvailabilityMaintenance,
		Message:      "Maintenance",
		UpdatedAt:    time.Now().UTC(),
	}

	if err := model.Validate(); err == nil {
		t.Fatal("expected maintenance without public incident id to fail")
	}
}

func TestReadModelValidateRejectsOperationalIncident(t *testing.T) {
	model := ReadModel{
		Availability: AvailabilityOperational,
		IncidentID:   "incident_should_not_be_active",
		Message:      "Operational",
		UpdatedAt:    time.Now().UTC(),
	}

	if err := model.Validate(); err == nil {
		t.Fatal("expected operational state with active incident id to fail")
	}
}

func TestReadModelValidateRejectsInvalidRetryTimestamp(t *testing.T) {
	now := time.Date(2026, time.August, 23, 9, 0, 0, 0, time.UTC)
	retryAt := now.Add(-time.Minute)
	model := ReadModel{
		Availability: AvailabilityDegraded,
		IncidentID:   "incident_public_456",
		Message:      "Serviço degradado.",
		RetryAfterAt: &retryAt,
		UpdatedAt:    now,
	}

	if err := model.Validate(); err == nil {
		t.Fatal("expected retry timestamp before update to fail")
	}
}
