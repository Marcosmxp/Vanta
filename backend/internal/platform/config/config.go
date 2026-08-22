package config

import (
	"fmt"
	"os"
	"strings"
)

type Environment string

const (
	EnvironmentDevelopment Environment = "development"
	EnvironmentStaging     Environment = "staging"
	EnvironmentProduction  Environment = "production"
)

type Config struct {
	Environment Environment
	APIPort     string
	DatabaseURL string
	RedisURL    string
}

func Load() (Config, error) {
	cfg := Config{
		Environment: Environment(valueOrDefault("VANTA_ENV", string(EnvironmentDevelopment))),
		APIPort:     valueOrDefault("VANTA_API_PORT", "8080"),
		DatabaseURL: strings.TrimSpace(os.Getenv("VANTA_DATABASE_URL")),
		RedisURL:    strings.TrimSpace(os.Getenv("VANTA_REDIS_URL")),
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

	if c.Environment == EnvironmentProduction {
		if c.DatabaseURL == "" {
			return fmt.Errorf("VANTA_DATABASE_URL is required in production")
		}
		if c.RedisURL == "" {
			return fmt.Errorf("VANTA_REDIS_URL is required in production")
		}
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
