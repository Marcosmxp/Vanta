package httpapi

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestRemoteIPIgnoresEphemeralPort(t *testing.T) {
	first := RemoteIP("203.0.113.7:41001")
	second := RemoteIP("203.0.113.7:51999")
	if first != "203.0.113.7" || second != first {
		t.Fatalf("expected stable canonical IP, got first=%q second=%q", first, second)
	}
}

func TestRemoteIPSupportsIPv6(t *testing.T) {
	got := RemoteIP("[2001:db8::1]:443")
	if got != "2001:db8::1" {
		t.Fatalf("unexpected canonical IPv6 address: %q", got)
	}
}

func TestRemoteIPRejectsNonIPText(t *testing.T) {
	if got := RemoteIP("attacker-controlled.example:1234"); got != "" {
		t.Fatalf("non-IP RemoteAddr must not become a security subject: %q", got)
	}
}

func TestMaskRemoteIPUsesCanonicalHost(t *testing.T) {
	if got := MaskRemoteIP("203.0.113.7:41001"); got != "203.0.113.*" {
		t.Fatalf("unexpected masked IPv4: %q", got)
	}
}

func TestDecodeJSONRejectsUnknownFields(t *testing.T) {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/", strings.NewReader(`{"known":"ok","unexpected":true}`))
	var payload struct {
		Known string `json:"known"`
	}
	if err := DecodeJSON(recorder, request, &payload, 1024); err == nil {
		t.Fatal("expected unknown JSON field to be rejected")
	}
}

func TestDecodeJSONRejectsTrailingObject(t *testing.T) {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/", strings.NewReader(`{"known":"one"} {"known":"two"}`))
	var payload struct {
		Known string `json:"known"`
	}
	if err := DecodeJSON(recorder, request, &payload, 1024); err == nil {
		t.Fatal("expected multiple JSON objects to be rejected")
	}
}

func TestDecodeJSONEnforcesBodyLimit(t *testing.T) {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/", strings.NewReader(`{"known":"this payload is intentionally too long"}`))
	var payload struct {
		Known string `json:"known"`
	}
	if err := DecodeJSON(recorder, request, &payload, 16); err == nil {
		t.Fatal("expected oversized JSON body to be rejected")
	}
}
