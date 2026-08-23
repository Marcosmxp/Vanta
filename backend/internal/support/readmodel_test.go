package support

import (
	"testing"
	"time"
)

func TestSnapshotValidateRejectsRequestOwnershipMismatch(t *testing.T) {
	now := time.Date(2026, time.August, 23, 8, 0, 0, 0, time.UTC)
	snapshot := Snapshot{
		PlayerID:     "player_1",
		Availability: AvailabilityReady,
		RecentRequests: []RequestSummaryReadModel{{
			RequestID: "support_1",
			PlayerID:  "player_2",
			Category:  "payments",
			Subject:   "Withdrawal",
			Status:    RequestOpen,
			CreatedAt: now,
			UpdatedAt: now,
		}},
	}

	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected support ownership mismatch to fail")
	}
}

func TestSnapshotValidateReadySupport(t *testing.T) {
	now := time.Date(2026, time.August, 23, 8, 0, 0, 0, time.UTC)
	snapshot := Snapshot{
		PlayerID:     "player_1",
		Availability: AvailabilityReady,
		Topics:       []TopicReadModel{{TopicID: "topic_security", Category: "security", Title: "Account security"}},
		Channels:     []ChannelReadModel{{ChannelID: "channel_inapp", Type: ChannelInApp, Label: "In-app", Target: "support"}},
		RecentRequests: []RequestSummaryReadModel{{
			RequestID: "support_1",
			PlayerID:  "player_1",
			Category:  "security",
			Subject:   "Unknown session",
			Status:    RequestOpen,
			CreatedAt: now,
			UpdatedAt: now,
		}},
	}

	if err := snapshot.Validate(); err != nil {
		t.Fatalf("expected valid support snapshot, got %v", err)
	}
}
