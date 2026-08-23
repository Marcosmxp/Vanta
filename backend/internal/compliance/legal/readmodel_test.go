package legal

import (
	"testing"
	"time"
)

const digest = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

func TestLicensedDisclosureRequiresLicenseReference(t *testing.T) {
	disclosure := RegulatoryDisclosureReadModel{
		JurisdictionCode:    "PT",
		OperatorLegalName:   "Example Operator, S.A.",
		OperatorContact:     "support@example.invalid",
		OperatorAddress:     "Lisboa, Portugal",
		LicensingStatus:     LicensingLicensed,
		Regulator:           AuthorityLinkReadModel{Name: "SRIJ", URL: "https://www.srij.turismodeportugal.pt/"},
		LicenseNotice:       "Verified licensing disclosure",
		ComplaintsDocumentID: "complaints_v1",
	}

	if err := disclosure.Validate(); err == nil {
		t.Fatal("expected licensed disclosure without license reference to fail")
	}
}

func TestUnconfiguredDisclosureRejectsLicenseReferences(t *testing.T) {
	disclosure := RegulatoryDisclosureReadModel{
		JurisdictionCode:    "PT",
		LicensingStatus:     LicensingUnconfigured,
		Regulator:           AuthorityLinkReadModel{Name: "SRIJ", URL: "https://www.srij.turismodeportugal.pt/"},
		LicenseReferences:   []LicenseReferenceReadModel{{LicenseID: "001", Scope: "example"}},
		LicenseNotice:       "Not configured",
		ComplaintsDocumentID: "complaints_v1",
	}

	if err := disclosure.Validate(); err == nil {
		t.Fatal("expected license references without licensed status to fail")
	}
}

func TestReadySnapshotRequiresPrivacyAndRegulatoryDisclosure(t *testing.T) {
	now := time.Date(2026, time.August, 23, 8, 0, 0, 0, time.UTC)
	snapshot := Snapshot{
		Availability: AvailabilityReady,
		Documents: []DocumentSummaryReadModel{{
			DocumentID:    "terms_v1",
			Kind:          DocumentTerms,
			Title:         "Terms",
			Version:       "1.0.0",
			EffectiveAt:   now,
			UpdatedAt:     now,
			ContentSHA256: digest,
		}},
	}
	if err := snapshot.Validate(); err == nil {
		t.Fatal("expected ready snapshot without disclosures to fail")
	}
}

func TestDocumentDetailRequiresIntegrityDigestAndBody(t *testing.T) {
	now := time.Date(2026, time.August, 23, 8, 0, 0, 0, time.UTC)
	document := DocumentDetailReadModel{
		DocumentSummaryReadModel: DocumentSummaryReadModel{
			DocumentID:    "privacy_v1",
			Kind:          DocumentPrivacy,
			Title:         "Privacy",
			Version:       "1.0.0",
			EffectiveAt:   now,
			UpdatedAt:     now,
			ContentSHA256: digest,
		},
		BodyMarkdown: "# Privacy",
	}
	if err := document.Validate(); err != nil {
		t.Fatalf("expected valid legal document detail, got %v", err)
	}
}
