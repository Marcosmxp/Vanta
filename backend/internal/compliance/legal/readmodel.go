package legal

import (
	"errors"
	"net/url"
	"regexp"
	"strings"
	"time"
)

type Availability string
type DocumentKind string
type LicensingStatus string

const (
	AvailabilityReady       Availability = "ready"
	AvailabilityUnavailable Availability = "unavailable"

	DocumentTerms             DocumentKind = "terms"
	DocumentPrivacy           DocumentKind = "privacy"
	DocumentCookies           DocumentKind = "cookies"
	DocumentGameRules         DocumentKind = "game-rules"
	DocumentResponsibleGaming DocumentKind = "responsible-gaming"
	DocumentComplaints        DocumentKind = "complaints"
	DocumentRegulatory        DocumentKind = "regulatory"

	LicensingUnconfigured LicensingStatus = "unconfigured"
	LicensingPending      LicensingStatus = "pending"
	LicensingLicensed     LicensingStatus = "licensed"
)

var sha256Pattern = regexp.MustCompile(`^[a-fA-F0-9]{64}$`)

type DocumentSummaryReadModel struct {
	DocumentID    string
	Kind          DocumentKind
	Title         string
	Version       string
	EffectiveAt   time.Time
	UpdatedAt     time.Time
	ContentSHA256 string
}

type DocumentDetailReadModel struct {
	DocumentSummaryReadModel
	BodyMarkdown string
}

type AuthorityLinkReadModel struct {
	Name string
	URL  string
}

type LicenseReferenceReadModel struct {
	LicenseID string
	Scope     string
}

type RegulatoryDisclosureReadModel struct {
	JurisdictionCode    string
	OperatorLegalName   string
	OperatorContact     string
	OperatorAddress     string
	LicensingStatus     LicensingStatus
	Regulator           AuthorityLinkReadModel
	LicenseReferences   []LicenseReferenceReadModel
	LicenseNotice       string
	ComplaintsDocumentID string
}

type PrivacyDisclosureReadModel struct {
	ControllerName       string
	PrivacyContact       string
	DPOContact           string
	SupervisoryAuthority AuthorityLinkReadModel
	PrivacyDocumentID    string
}

type Snapshot struct {
	Availability Availability
	Documents    []DocumentSummaryReadModel
	Regulatory   *RegulatoryDisclosureReadModel
	Privacy      *PrivacyDisclosureReadModel
	Message      string
}

func (s Snapshot) Validate() error {
	if s.Availability != AvailabilityReady && s.Availability != AvailabilityUnavailable {
		return errors.New("invalid legal availability")
	}
	for _, document := range s.Documents {
		if err := document.Validate(); err != nil {
			return err
		}
	}
	if s.Availability == AvailabilityReady {
		if s.Regulatory == nil || s.Privacy == nil {
			return errors.New("ready legal snapshot requires regulatory and privacy disclosures")
		}
	}
	if s.Regulatory != nil {
		if err := s.Regulatory.Validate(); err != nil {
			return err
		}
	}
	if s.Privacy != nil {
		if err := s.Privacy.Validate(); err != nil {
			return err
		}
	}
	return nil
}

func (d DocumentSummaryReadModel) Validate() error {
	if strings.TrimSpace(d.DocumentID) == "" || strings.TrimSpace(d.Title) == "" || strings.TrimSpace(d.Version) == "" {
		return errors.New("legal document requires id, title and version")
	}
	if !validDocumentKind(d.Kind) {
		return errors.New("invalid legal document kind")
	}
	if d.EffectiveAt.IsZero() || d.UpdatedAt.IsZero() {
		return errors.New("legal document requires timestamps")
	}
	if !sha256Pattern.MatchString(d.ContentSHA256) {
		return errors.New("legal document requires sha256 content digest")
	}
	return nil
}

func (d DocumentDetailReadModel) Validate() error {
	if err := d.DocumentSummaryReadModel.Validate(); err != nil {
		return err
	}
	if strings.TrimSpace(d.BodyMarkdown) == "" {
		return errors.New("legal document detail requires body")
	}
	return nil
}

func (a AuthorityLinkReadModel) Validate() error {
	if strings.TrimSpace(a.Name) == "" {
		return errors.New("authority link requires name")
	}
	parsed, err := url.Parse(a.URL)
	if err != nil || parsed.Scheme != "https" || parsed.Host == "" {
		return errors.New("authority link must use a valid https url")
	}
	return nil
}

func (r RegulatoryDisclosureReadModel) Validate() error {
	if r.JurisdictionCode != "PT" {
		return errors.New("phase 15 regulatory disclosure supports PT jurisdiction only")
	}
	if r.LicensingStatus != LicensingUnconfigured && r.LicensingStatus != LicensingPending && r.LicensingStatus != LicensingLicensed {
		return errors.New("invalid licensing status")
	}
	if err := r.Regulator.Validate(); err != nil {
		return err
	}
	if strings.TrimSpace(r.LicenseNotice) == "" || strings.TrimSpace(r.ComplaintsDocumentID) == "" {
		return errors.New("regulatory disclosure requires license notice and complaints document")
	}
	if r.LicensingStatus == LicensingLicensed {
		if strings.TrimSpace(r.OperatorLegalName) == "" || strings.TrimSpace(r.OperatorContact) == "" || strings.TrimSpace(r.OperatorAddress) == "" {
			return errors.New("licensed disclosure requires complete operator identity")
		}
		if len(r.LicenseReferences) == 0 {
			return errors.New("licensed disclosure requires license references")
		}
	}
	if r.LicensingStatus != LicensingLicensed && len(r.LicenseReferences) > 0 {
		return errors.New("license references require licensed status")
	}
	for _, reference := range r.LicenseReferences {
		if strings.TrimSpace(reference.LicenseID) == "" || strings.TrimSpace(reference.Scope) == "" {
			return errors.New("license reference requires id and scope")
		}
	}
	return nil
}

func (p PrivacyDisclosureReadModel) Validate() error {
	if strings.TrimSpace(p.ControllerName) == "" || strings.TrimSpace(p.PrivacyContact) == "" || strings.TrimSpace(p.PrivacyDocumentID) == "" {
		return errors.New("privacy disclosure requires controller, contact and privacy document")
	}
	return p.SupervisoryAuthority.Validate()
}

func validDocumentKind(value DocumentKind) bool {
	switch value {
	case DocumentTerms, DocumentPrivacy, DocumentCookies, DocumentGameRules, DocumentResponsibleGaming, DocumentComplaints, DocumentRegulatory:
		return true
	default:
		return false
	}
}
