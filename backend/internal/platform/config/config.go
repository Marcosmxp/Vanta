package config

import (
	"encoding/base64"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Environment string

const (
	EnvironmentDevelopment Environment = "development"
	EnvironmentStaging     Environment = "staging"
	EnvironmentProduction  Environment = "production"
)

const (
	developmentDatabaseURL = "postgres://vanta:vanta_local_only@localhost:5432/vanta?sslmode=disable"
	developmentRedisURL    = "redis://localhost:6379/0"
	developmentPIIKeyB64   = "MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE="
)

type MaintenanceConfig struct {
	Enabled    bool
	IncidentID string
	Message    string
	RetryAfter time.Time
}

type Config struct {
	Environment       Environment
	APIPort           string
	LogLevel          string
	DatabaseURL       string
	DatabaseMaxConns  int32
	RedisURL          string
	AccessTokenTTL    time.Duration
	RefreshTokenTTL   time.Duration
	PIIEncryptionKey  []byte
	PIILookupKey      []byte
	Maintenance       MaintenanceConfig
}

func Load() (Config, error) {
	environment := Environment(valueOrDefault("VANTA_ENV", string(EnvironmentDevelopment)))

	databaseURL := strings.TrimSpace(os.Getenv("VANTA_DATABASE_URL"))
	redisURL := strings.TrimSpace(os.Getenv("VANTA_REDIS_URL"))
	piiEncryptionKeyB64 := strings.TrimSpace(os.Getenv("VANTA_PII_ENCRYPTION_KEY_B64"))
	piiLookupKeyB64 := strings.TrimSpace(os.Getenv("VANTA_PII_LOOKUP_KEY_B64"))

	if environment == EnvironmentDevelopment {
		if databaseURL == "" {
			databaseURL = developmentDatabaseURL
		}
		if redisURL == "" {
			redisURL = developmentRedisURL
		}
		if piiEncryptionKeyB64 == "" {
			piiEncryptionKeyB64 = developmentPIIKeyB64
		}
		if piiLookupKeyB64 == "" {
			piiLookupKeyB64 = developmentPIIKeyB64
		}
	}

	maxConns, err := parseInt32("VANTA_DATABASE_MAX_CONNS", 10)
	if err != nil {
		return Config{}, err
	}
	accessTTL, err := parseDuration("VANTA_AUTH_ACCESS_TTL", 15*time.Minute)
	if err != nil {
		return Config{}, err
	}
	refreshTTL, err := parseDuration("VANTA_AUTH_REFRESH_TTL", 30*24*time.Hour)
	if err != nil {
		return Config{}, err
	}
	piiEncryptionKey, err := decodeKey("VANTA_PII_ENCRYPTION_KEY_B64", piiEncryptionKeyB64)
	if err != nil {
		return Config{}, err
	}
	piiLookupKey, err := decodeKey("VANTA_PII_LOOKUP_KEY_B64", piiLookupKeyB64)
	if err != nil {
		return Config{}, err
	}

	maintenanceEnabled, err := parseBool("VANTA_MAINTENANCE_ENABLED", false)
	if err != nil {
		return Config{}, err
	}
	maintenanceRetryAfter, err := parseOptionalTime("VANTA_MAINTENANCE_RETRY_AFTER")
	if err != nil {
		return Config{}, err
	}

	cfg := Config{
		Environment:      environment,
		APIPort:          valueOrDefault("VANTA_API_PORT", "8080"),
		LogLevel:         valueOrDefault("VANTA_LOG_LEVEL", "info"),
		DatabaseURL:      databaseURL,
		DatabaseMaxConns: maxConns,
		RedisURL:         redisURL,
		AccessTokenTTL:   accessTTL,
		RefreshTokenTTL:  refreshTTL,
		PIIEncryptionKey: piiEncryptionKey,
		PIILookupKey:     piiLookupKey,
		Maintenance: MaintenanceConfig{
			Enabled:    maintenanceEnabled,
			IncidentID: strings.TrimSpace(os.Getenv("VANTA_MAINTENANCE_INCIDENT_ID")),
			Message:    strings.TrimSpace(os.Getenv("VANTA_MAINTENANCE_MESSAGE")),
			RetryAfter: maintenanceRetryAfter,
		},
	}

	if err := cfg.validate(); err != nil {
		return Config{}, err
	}

	return cfg, nil
}

func (c Config) validate() error {
	switch c.Environment {
	case EnvironmentDevelopment, EnvironmentStaging, EnvironmentProduction:
	default:
		return fmt.Errorf("unsupported VANTA_ENV %q", c.Environment)
	}

	if strings.TrimSpace(c.APIPort) == "" {
		return fmt.Errorf("VANTA_API_PORT must not be empty")
	}
	if c.DatabaseURL == "" {
		return fmt.Errorf("VANTA_DATABASE_URL is required")
	}
	if c.RedisURL == "" {
		return fmt.Errorf("VANTA_REDIS_URL is required")
	}
	if c.DatabaseMaxConns < 1 || c.DatabaseMaxConns > 100 {
		return fmt.Errorf("VANTA_DATABASE_MAX_CONNS must be between 1 and 100")
	}
	if c.AccessTokenTTL < time.Minute || c.AccessTokenTTL > time.Hour {
		return fmt.Errorf("VANTA_AUTH_ACCESS_TTL must be between 1m and 1h")
	}
	if c.RefreshTokenTTL < time.Hour || c.RefreshTokenTTL > 90*24*time.Hour {
		return fmt.Errorf("VANTA_AUTH_REFRESH_TTL must be between 1h and 2160h")
	}
	if len(c.PIIEncryptionKey) != 32 {
		return fmt.Errorf("VANTA_PII_ENCRYPTION_KEY_B64 must decode to exactly 32 bytes")
	}
	if len(c.PIILookupKey) < 32 {
		return fmt.Errorf("VANTA_PII_LOOKUP_KEY_B64 must decode to at least 32 bytes")
	}
	if c.Maintenance.Enabled && c.Maintenance.IncidentID == "" {
		return fmt.Errorf("VANTA_MAINTENANCE_INCIDENT_ID is required when maintenance is enabled")
	}

	return nil
}

func valueOrDefault(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func parseInt32(key string, fallback int32) (int32, error) {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback, nil
	}
	parsed, err := strconv.ParseInt(value, 10, 32)
	if err != nil {
		return 0, fmt.Errorf("%s must be an integer: %w", key, err)
	}
	return int32(parsed), nil
}

func parseDuration(key string, fallback time.Duration) (time.Duration, error) {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback, nil
	}
	parsed, err := time.ParseDuration(value)
	if err != nil {
		return 0, fmt.Errorf("%s must be a Go duration: %w", key, err)
	}
	return parsed, nil
}

func parseBool(key string, fallback bool) (bool, error) {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback, nil
	}
	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return false, fmt.Errorf("%s must be a boolean: %w", key, err)
	}
	return parsed, nil
}

func parseOptionalTime(key string) (time.Time, error) {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return time.Time{}, nil
	}
	parsed, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return time.Time{}, fmt.Errorf("%s must be RFC3339: %w", key, err)
	}
	return parsed.UTC(), nil
}

func decodeKey(key, value string) ([]byte, error) {
	if value == "" {
		return nil, fmt.Errorf("%s is required", key)
	}
	decoded, err := base64.StdEncoding.DecodeString(value)
	if err != nil {
		return nil, fmt.Errorf("%s must be valid base64: %w", key, err)
	}
	return decoded, nil
}
