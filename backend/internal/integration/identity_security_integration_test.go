package integration_test

import (
	"context"
	"testing"
	"time"

	"github.com/Marcosmxp/Vanta/backend/internal/identity/auth"
	identitysecurity "github.com/Marcosmxp/Vanta/backend/internal/identity/security"
)

func TestSecurityCenterCannotRevokeForeignSession(t *testing.T) {
	pool, protector := openSecurityRuntime(t)
	service := auth.NewService(auth.NewPostgresStore(pool), protector, 15*time.Minute, 24*time.Hour)
	attacker := registerSecurityPlayer(t, service, "session-attacker")
	victim := registerSecurityPlayer(t, service, "session-victim")
	repository := identitysecurity.NewPostgresRepository(pool)

	revoked, err := repository.RevokeSession(context.Background(), attacker.PlayerID, victim.SessionID)
	if err != nil {
		t.Fatalf("cross-player revoke returned infrastructure error: %v", err)
	}
	if revoked {
		t.Fatal("security center must not revoke a session owned by another player")
	}
	if _, err := service.Authenticate(context.Background(), victim.AccessToken); err != nil {
		t.Fatalf("victim session changed after foreign revoke attempt: %v", err)
	}
}
