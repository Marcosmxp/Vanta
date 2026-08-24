package support

import (
	"errors"
	"strings"
	"time"
)

type Availability string
type RequestStatus string
type ChannelType string

const (
	AvailabilityReady       Availability = "ready"
	AvailabilityUnavailable Availability = "unavailable"
	AvailabilityRestricted  Availability = "restricted"

	RequestOpen          RequestStatus = "open"
	RequestWaitingPlayer RequestStatus = "waiting-player"
	RequestResolved      RequestStatus = "resolved"
	RequestClosed        RequestStatus = "closed"

	ChannelInApp ChannelType = "in-app"
	ChannelEmail ChannelType = "email"
	ChannelPhone ChannelType = "phone"
	ChannelWeb   ChannelType = "web"
)

type TopicReadModel struct {
	TopicID  string
	Category string
	Title    string
	Summary  string
}

type ChannelReadModel struct {
	ChannelID string
	Type      ChannelType
	Label     string
	Target    string
}

type RequestSummaryReadModel struct {
	RequestID string
	PlayerID  string
	Category  string
	Subject   string
	Status    RequestStatus
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Snapshot struct {
	PlayerID       string
	Availability   Availability
	Topics         []TopicReadModel
	Channels       []ChannelReadModel
	RecentRequests []RequestSummaryReadModel
	Message        string
}

func (s Snapshot) Validate() error {
	if !validAvailability(s.Availability) {
		return errors.New("invalid support availability")
	}
	if s.Availability == AvailabilityReady && strings.TrimSpace(s.PlayerID) == "" {
		return errors.New("ready support snapshot requires player id")
	}
	for _, topic := range s.Topics {
		if err := topic.Validate(); err != nil {
			return err
		}
	}
	for _, channel := range s.Channels {
		if err := channel.Validate(); err != nil {
			return err
		}
	}
	for _, request := range s.RecentRequests {
		if request.PlayerID != s.PlayerID {
			return errors.New("support request ownership mismatch")
		}
		if err := request.Validate(); err != nil {
			return err
		}
	}
	return nil
}

func (t TopicReadModel) Validate() error {
	if strings.TrimSpace(t.TopicID) == "" || strings.TrimSpace(t.Category) == "" || strings.TrimSpace(t.Title) == "" {
		return errors.New("support topic requires id, category and title")
	}
	return nil
}

func (c ChannelReadModel) Validate() error {
	if strings.TrimSpace(c.ChannelID) == "" || strings.TrimSpace(c.Label) == "" {
		return errors.New("support channel requires id and label")
	}
	if c.Type != ChannelInApp && c.Type != ChannelEmail && c.Type != ChannelPhone && c.Type != ChannelWeb {
		return errors.New("invalid support channel type")
	}
	if strings.TrimSpace(c.Target) == "" {
		return errors.New("support channel requires target")
	}
	return nil
}

func (r RequestSummaryReadModel) Validate() error {
	if strings.TrimSpace(r.RequestID) == "" || strings.TrimSpace(r.PlayerID) == "" {
		return errors.New("support request requires request and player id")
	}
	if strings.TrimSpace(r.Category) == "" || strings.TrimSpace(r.Subject) == "" {
		return errors.New("support request requires category and subject")
	}
	if !validRequestStatus(r.Status) {
		return errors.New("invalid support request status")
	}
	if r.CreatedAt.IsZero() || r.UpdatedAt.IsZero() || r.UpdatedAt.Before(r.CreatedAt) {
		return errors.New("invalid support request timestamps")
	}
	return nil
}

func validAvailability(value Availability) bool {
	return value == AvailabilityReady || value == AvailabilityUnavailable || value == AvailabilityRestricted
}

func validRequestStatus(value RequestStatus) bool {
	return value == RequestOpen || value == RequestWaitingPlayer || value == RequestResolved || value == RequestClosed
}
