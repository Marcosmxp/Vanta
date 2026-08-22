package config

import "testing"

func TestProductionRequiresInfrastructureURLs(t *testing.T) {
	t.Setenv("VANTA_ENV", "production")
	t.Setenv("VANTA_DATABASE_URL", "")
	t.Setenv("VANTA_REDIS_URL", "")

	_, err := Load()
	if err == nil {
		t.Fatal("expected production configuration validation to fail")
	}
}

func TestDevelopmentUsesSafeDefaults(t *testing.T) {
	t.Setenv("VANTA_ENV", "")
	t.Setenv("VANTA_API_PORT", "")

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
}
