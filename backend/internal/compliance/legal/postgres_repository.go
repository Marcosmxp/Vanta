package legal

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepository struct {
	pool *pgxpool.Pool
}

func NewPostgresRepository(pool *pgxpool.Pool) *PostgresRepository {
	return &PostgresRepository{pool: pool}
}

func (r *PostgresRepository) GetSnapshot(ctx context.Context, jurisdiction string) (Snapshot, error) {
	documents, err := r.listDocuments(ctx)
	if err != nil {
		return Snapshot{}, err
	}

	snapshot := Snapshot{
		Availability: AvailabilityUnavailable,
		Documents:    documents,
		Message:      "A informação legal e regulatória verificada ainda não está configurada para esta jurisdição.",
	}

	var regulatory RegulatoryDisclosureReadModel
	var privacy PrivacyDisclosureReadModel
	var licensingStatus string
	var licenseReferencesJSON []byte
	var regulatorName, regulatorURL string
	var supervisoryName, supervisoryURL string

	err = r.pool.QueryRow(ctx, `
		SELECT operator_legal_name,
		       operator_contact,
		       operator_address,
		       licensing_status,
		       regulator_name,
		       regulator_url,
		       license_references,
		       license_notice,
		       complaints_document_id,
		       controller_name,
		       privacy_contact,
		       dpo_contact,
		       supervisory_authority_name,
		       supervisory_authority_url,
		       privacy_document_id
		FROM legal_disclosures
		WHERE jurisdiction = $1`, jurisdiction).Scan(
		&regulatory.OperatorLegalName,
		&regulatory.OperatorContact,
		&regulatory.OperatorAddress,
		&licensingStatus,
		&regulatorName,
		&regulatorURL,
		&licenseReferencesJSON,
		&regulatory.LicenseNotice,
		&regulatory.ComplaintsDocumentID,
		&privacy.ControllerName,
		&privacy.PrivacyContact,
		&privacy.DPOContact,
		&supervisoryName,
		&supervisoryURL,
		&privacy.PrivacyDocumentID,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return snapshot, nil
	}
	if err != nil {
		return Snapshot{}, fmt.Errorf("load legal disclosure: %w", err)
	}

	regulatory.JurisdictionCode = jurisdiction
	regulatory.LicensingStatus = LicensingStatus(licensingStatus)
	regulatory.Regulator = AuthorityLinkReadModel{Name: regulatorName, URL: regulatorURL}
	privacy.SupervisoryAuthority = AuthorityLinkReadModel{Name: supervisoryName, URL: supervisoryURL}
	if len(licenseReferencesJSON) > 0 {
		if err := json.Unmarshal(licenseReferencesJSON, &regulatory.LicenseReferences); err != nil {
			return Snapshot{}, fmt.Errorf("decode license references: %w", err)
		}
	}

	snapshot.Availability = AvailabilityReady
	snapshot.Regulatory = &regulatory
	snapshot.Privacy = &privacy
	snapshot.Message = ""
	if err := snapshot.Validate(); err != nil {
		return Snapshot{}, fmt.Errorf("validate legal snapshot: %w", err)
	}
	return snapshot, nil
}

func (r *PostgresRepository) GetDocument(ctx context.Context, documentID string) (DocumentDetailReadModel, error) {
	var document DocumentDetailReadModel
	if err := r.pool.QueryRow(ctx, `
		SELECT document_id, kind, title, version, effective_at, updated_at, content_sha256, body_markdown
		FROM legal_documents
		WHERE document_id = $1 AND active`, documentID).Scan(
		&document.DocumentID,
		&document.Kind,
		&document.Title,
		&document.Version,
		&document.EffectiveAt,
		&document.UpdatedAt,
		&document.ContentSHA256,
		&document.BodyMarkdown,
	); err != nil {
		return DocumentDetailReadModel{}, err
	}
	if err := document.Validate(); err != nil {
		return DocumentDetailReadModel{}, fmt.Errorf("validate legal document: %w", err)
	}
	return document, nil
}

func (r *PostgresRepository) listDocuments(ctx context.Context) ([]DocumentSummaryReadModel, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT document_id, kind, title, version, effective_at, updated_at, content_sha256
		FROM legal_documents
		WHERE active
		ORDER BY kind, effective_at DESC`)
	if err != nil {
		return nil, fmt.Errorf("load legal documents: %w", err)
	}
	defer rows.Close()

	var documents []DocumentSummaryReadModel
	for rows.Next() {
		var document DocumentSummaryReadModel
		if err := rows.Scan(&document.DocumentID, &document.Kind, &document.Title, &document.Version, &document.EffectiveAt, &document.UpdatedAt, &document.ContentSHA256); err != nil {
			return nil, fmt.Errorf("scan legal document: %w", err)
		}
		if err := document.Validate(); err != nil {
			return nil, fmt.Errorf("validate legal document summary: %w", err)
		}
		documents = append(documents, document)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate legal documents: %w", err)
	}
	return documents, nil
}
