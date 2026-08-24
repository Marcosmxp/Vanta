package config

import "testing"

func clearRuntimeEnv(t *testing.T) {
	t.Helper()
	for _, key := range []string{
		"VANTA_ENV",
		"VANTA_API_PORT",
		"VANTA_DATABASE_URL",
		"VANTA_DATABASE_MAX_CONNS",
		"VANTA_REDIS_URL",
		"VANTA_AUTH_ACCESS_TTL",
		"VANTA_AUTH_REFRESH_TTL",
		"VANTA_PII_ENCRYPTION_KEY_B64",
		"VANTA_PII_LOOKUP_KEY_B64",
		"VANTA_MAINTENANCE_ENABLED",
		"VANTA_MAINTENANCE_INCIDENT_ID",
		"VANTA_MAINTENANCE_MESSAGE",
		"VANTA_MAINTENANCE_RETRY_AFTER",
	} {
		t.Setenv(key, "")
	}
}

func TestProductionRequiresInfrastructureAndCryptographicKeys(t *testing.T) {
	clearRuntimeEnv(t)
	t.Setenv("VANTA_ENV", "production")

	if _, err := Load(); err == nil {
		t.Fatal("expected production configuration validation to fail")
	}
}

func TestDevelopmentUsesSafeLocalDefaults(t *testing.T) {
	clearRuntimeEnv(t)

	cfg, err := Load()
	if err != nil {
		t.Fatalf("expected development configuration to load: %v", err)
	}

	if cfg.Environment != EnvironmentDevelopment {
		t.Fatalf("expected development environment, got %q", cfg.Environment)
	}
	if cfg.APIPort != "8080" {
		t.Fatalf("expected port 8080, got %q", cfg.APIPort)
	}
	if cfg.DatabaseURL == "" || cfg.RedisURL == "" {
		t.Fatal("development runtime must have local infrastructure defaults")
	}
	if len(cfg.PIIEncryptionKey) != 32 || len(cfg.PIILookupKey) < 32 {
		t.Fatal("development runtime must initialize valid local-only cryptographic placeholders")
	}
}

func TestMaintenanceRequiresIncidentID(t *testing.T) {
	clearRuntimeEnv(t)
	t.Setenv("VANTA_MAINTENANCE_ENABLED", "true")

	if _, err := Load(); err == nil {
		t.Fatal("expected enabled maintenance without incident id to fail")
	}
}

func TestRejectsUnsafeSessionTTLs(t *testing.T) {
	clearRuntimeEnv(t)
	t.Setenv("VANTA_AUTH_ACCESS_TTL", "2h")

	if _, err := Load(); err == nil {
		t.Fatal("expected access token TTL above policy maximum to fail")
	}
}
