export type LegalAvailability = 'ready' | 'unavailable';
export type LegalDocumentKind =
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'game-rules'
  | 'responsible-gaming'
  | 'complaints'
  | 'regulatory';
export type LicensingStatus = 'unconfigured' | 'pending' | 'licensed';

export interface LegalDocumentSummary {
  documentId: string;
  kind: LegalDocumentKind;
  title: string;
  version: string;
  effectiveAt: string;
  updatedAt: string;
  contentSHA256: string;
}

export interface LegalDocumentDetail extends LegalDocumentSummary {
  bodyMarkdown: string;
}

export interface AuthorityLink {
  name: string;
  url: string;
}

export interface LicenseReference {
  licenseId: string;
  scope: string;
}

export interface RegulatoryDisclosure {
  jurisdictionCode: 'PT';
  operatorLegalName: string | null;
  operatorContact: string | null;
  operatorAddress: string | null;
  licensingStatus: LicensingStatus;
  regulator: AuthorityLink;
  licenseReferences: readonly LicenseReference[];
  licenseNotice: string;
  complaintsDocumentId: string;
}

export interface PrivacyDisclosure {
  controllerName: string;
  privacyContact: string;
  dpoContact: string | null;
  supervisoryAuthority: AuthorityLink;
  privacyDocumentId: string;
}

export interface LegalSnapshot {
  availability: LegalAvailability;
  documents: readonly LegalDocumentSummary[];
  regulatory: RegulatoryDisclosure | null;
  privacy: PrivacyDisclosure | null;
  message?: string;
}
