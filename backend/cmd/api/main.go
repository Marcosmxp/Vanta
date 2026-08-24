package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	bettinghistory "github.com/Marcosmxp/Vanta/backend/internal/betting/history"
	"github.com/Marcosmxp/Vanta/backend/internal/compliance/legal"
	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	identitysecurity "github.com/Marcosmxp/Vanta/backend/internal/identity/security"
	"github.com/Marcosmxp/Vanta/backend/internal/kyc"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/cache"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/config"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/database"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/httpserver"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/migrations"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/pii"
	"github.com/Marcosmxp/Vanta/backend/internal/platform/ratelimit"
	platformstatus "github.com/Marcosmxp/Vanta/backend/internal/platform/status"
	"github.com/Marcosmxp/Vanta/backend/internal/player/profile"
	"github.com/Marcosmxp/Vanta/backend/internal/responsiblegaming"
	"github.com/Marcosmxp/Vanta/backend/internal/support"
	"github.com/Marcosmxp/Vanta/backend/internal/wallet"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("failed to load configuration", "error", err)
		os.Exit(1)
	}

	startupCtx, startupCancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer startupCancel()

	postgresPool, err := database.Open(startupCtx, cfg.DatabaseURL, cfg.DatabaseMaxConns)
	if err != nil {
		slog.Error("failed to initialize PostgreSQL", "error", err)
		os.Exit(1)
	}
	defer postgresPool.Close()

	if err := migrations.Run(startupCtx, postgresPool); err != nil {
		slog.Error("failed to apply database migrations", "error", err)
		os.Exit(1)
	}

	redisClient, err := cache.Open(startupCtx, cfg.RedisURL)
	if err != nil {
		slog.Error("failed to initialize Redis", "error", err)
		os.Exit(1)
	}
	defer func() { _ = redisClient.Close() }()

	piiProtector, err := pii.NewProtector(cfg.PIIEncryptionKey, cfg.PIILookupKey)
	if err != nil {
		slog.Error("failed to initialize PII protection", "error", err)
		os.Exit(1)
	}

	authStore := auth.NewPostgresStore(postgresPool)
	authService := auth.NewService(authStore, piiProtector, cfg.AccessTokenTTL, cfg.RefreshTokenTTL)
	authHandler := auth.NewHTTPHandler(authService, ratelimit.New(redisClient))

	profileHandler := profile.NewHTTPHandler(profile.NewPostgresRepository(postgresPool))
	walletHandler := wallet.NewHTTPHandler(wallet.NewPostgresRepository(postgresPool))
	securityHandler := identitysecurity.NewHTTPHandler(identitysecurity.NewPostgresRepository(postgresPool))
	responsibleGamingHandler := responsiblegaming.NewHTTPHandler(responsiblegaming.NewPostgresRepository(postgresPool))
	betHistoryHandler := bettinghistory.NewHTTPHandler(bettinghistory.NewPostgresRepository(postgresPool))
	kycHandler := kyc.NewHTTPHandler(kyc.NewPostgresRepository(postgresPool))
	supportHandler := support.NewHTTPHandler(support.NewPostgresRepository(postgresPool, piiProtector))
	legalHandler := legal.NewHTTPHandler(legal.NewPostgresRepository(postgresPool), "PT")
	platformStatusHandler := platformstatus.NewHTTPHandler(platformstatus.NewService(postgresPool, redisClient, cfg.Maintenance))

	server := httpserver.New(cfg, httpserver.Dependencies{
		Postgres:          postgresPool,
		Redis:             redisClient,
		Auth:              authHandler,
		Profile:           profileHandler,
		Wallet:            walletHandler,
		Security:          securityHandler,
		ResponsibleGaming: responsibleGamingHandler,
		BetHistory:        betHistoryHandler,
		KYC:               kycHandler,
		Support:           supportHandler,
		Legal:             legalHandler,
		PlatformStatus:    platformStatusHandler,
	})

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	serverErrors := make(chan error, 1)
	go func() {
		slog.Info("Vanta API started", "environment", cfg.Environment, "address", server.Addr)
		serverErrors <- server.ListenAndServe()
	}()

	select {
	case <-ctx.Done():
		slog.Info("shutdown signal received")
	case err := <-serverErrors:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("HTTP server stopped unexpectedly", "error", err)
			os.Exit(1)
		}
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		slog.Error("graceful shutdown failed", "error", err)
		os.Exit(1)
	}

	slog.Info("Vanta API stopped")
}
