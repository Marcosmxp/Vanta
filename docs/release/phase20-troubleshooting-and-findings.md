# Phase 20 — Troubleshooting and Findings

**Purpose:** preserve repeatable, non-sensitive recovery knowledge from native Android/Windows testing.  
**Last consolidated:** 2026-08-25.

This is an engineering troubleshooting record, not a production operations runbook.

---

## 1. Current development topology

Physical Android development uses:

```text
Android phone
├── Vanta debug APK
├── API → http://<LAN_IP>:8080
└── Metro → http://<LAN_IP>:8081

Windows workstation
├── Metro :8081
├── Docker API :8080
├── PostgreSQL (internal development service)
└── Redis (internal development service)
```

Phone and workstation must share the same trusted local network.

Use the workstation's actual Wi-Fi/LAN IPv4 address. Do not substitute unrelated virtual-adapter addresses.

---

## 2. Recommended startup path

From the repository root in PowerShell:

```powershell
.\scripts\start-physical-device-dev.ps1 -LanIp <LAN_IP>
```

Expected output includes:

```text
API:   http://<LAN_IP>:8080
Health: http://<LAN_IP>:8080/health
Metro: http://<LAN_IP>:8081
```

Keep both API/runtime and Metro PowerShell windows open while testing.

---

## 3. Docker Desktop / WSL2 not ready

### Symptom

Docker Desktop reports virtualization/WSL2 backend unavailable, or `docker info` cannot reach the daemon.

### Diagnosis

Confirm Windows virtualization/WSL environment before debugging Vanta containers.

Useful checks:

```powershell
wsl --status
docker info
```

### Resolution observed

Windows `VirtualMachinePlatform` and WSL were enabled, the workstation restarted, and Docker Desktop subsequently ran using WSL2.

### Lesson

Do not modify Vanta code to solve a host virtualization problem.

---

## 4. PostgreSQL 18 container fails to start

### Symptom

PostgreSQL development service fails after migration to PostgreSQL 18 image even though credentials/config appear correct.

### Root cause

Old persistence layout mounted data directly at the legacy path instead of the PostgreSQL 18-compatible volume root.

### Fix

Development Compose now uses a named volume mounted at:

```text
/var/lib/postgresql
```

Relevant checkpoints:

```text
1fb89871f06d2b1fc9c0cbcbac18a075bbb3ab7c
5e7c6cecc013b69b0c73958ccebe9e8347a396ae
```

### Diagnostics

```powershell
docker compose -f infrastructure/docker/compose.dev.yml ps
docker compose -f infrastructure/docker/compose.dev.yml logs --no-color --tail 120 postgres
```

---

## 5. Rebuild/start the backend after server-side changes

When backend code/Compose changes need to be reflected locally:

```powershell
$env:VANTA_DEV_API_BIND_ADDRESS="<LAN_IP>"
docker compose -f infrastructure/docker/compose.dev.yml up -d --build
```

Check API logs:

```powershell
docker compose -f infrastructure/docker/compose.dev.yml logs --no-color --tail 120 api
```

Check health from the workstation/phone network as appropriate:

```text
http://<LAN_IP>:8080/health
```

Do not expose PostgreSQL or Redis directly to the phone merely for convenience.

---

## 6. Phone cannot load Metro / app points to localhost

### Symptom

The Vanta APK opens but cannot load the JavaScript bundle, or Metro is shown as localhost despite LAN development.

### Important finding

Current mobile package does not explicitly include `expo-dev-client`, despite commands using `expo start --dev-client`. The QR/deep-link development-build flow therefore was not the reliable working path during this checkpoint.

### Working solution

On the Android device, open React Native development settings and set:

```text
Debug server host & port for device
<LAN_IP>:8081
```

Then reload the app.

### Not required for the current Wi-Fi path

- Expo Go;
- ADB;
- a Wi-Fi proxy.

Keep Wi-Fi proxy set to `None` unless deliberately testing through a proxy.

### Future cleanup

Normalize the development-client strategy instead of relying indefinitely on manual debug host configuration.

---

## 7. `EventEmitter` undefined after reload/update

### Symptom

Red runtime screen similar to:

```text
[runtime not ready]: TypeError: Cannot read property 'EventEmitter' of undefined
```

### First interpretation

If the same APK already rendered successfully before a JS update, treat Metro/cache inconsistency as a likely first cause rather than immediately rebuilding the native binary.

### Recovery

Stop Metro (`Ctrl+C`) and clear development caches:

```powershell
Remove-Item -Recurse -Force .\apps\mobile\.expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\metro-cache" -ErrorAction SilentlyContinue
```

Restart:

```powershell
$env:EXPO_PUBLIC_VANTA_ENV="development"
$env:EXPO_PUBLIC_VANTA_API_URL="http://<LAN_IP>:8080"
$env:REACT_NATIVE_PACKAGER_HOSTNAME="<LAN_IP>"
pnpm --dir apps/mobile exec expo start --dev-client --lan --port 8081 --clear
```

Reload Vanta after Metro is ready.

### When a native rebuild *is* warranted

Rebuild if a change actually modifies native dependencies/configuration or the reset does not resolve a verified native-module compatibility issue.

---

## 8. Registration rejected with apparently valid form

### Symptom

Server returns a generic account-creation rejection.

### Root cause found

Backend password policy required at least 12 characters while the mobile form previously allowed/communicated 10.

### Fix

Mobile schema aligned to minimum 12 characters:

```text
a0da68541809e6c4e0784dc5bd0990af03a48be1
```

### Remaining action

Audit all password help text and intentional complexity policy. The server remains authoritative.

### Diagnostic principle

When generic auth messages intentionally avoid leaking details, compare client validation contract with backend validation before assuming a database failure.

---

## 9. Wallet crashes on `.length` of null

### Symptom

```text
Render Error
Cannot read property 'length' of null
```

Location observed:

```text
WalletOverviewScreen.tsx
snapshot.transactions.length
```

### Root cause

The backend initialized the transaction response slice as nil. Go JSON serialization produced:

```json
{
  "transactions": null
}
```

The mobile TypeScript contract expected an array.

### Fix

Three defenses were applied:
1. backend emits an empty array when no transactions exist;
2. API wallet provider normalizes unexpected null/empty collection state;
3. Wallet UI uses a guarded local transaction array.

Relevant commits:

```text
21e44eaec1efd23f68641853fd131abe1795e623
e1921a929adbf9e26b084648bfe2489d4eb4b021
fd215a0c45d657b58623f26146ffdf1700e04335
```

### Verification

Physical Android rendered authoritative zero balance and `Sem movimentos` without crash.

### Regression lesson

Explicitly define empty-collection JSON behavior and test both `[]` and defensive handling of unexpected `null` at external boundaries.

---

## 10. Login succeeds but invalid-password message remains

### Symptom

Player makes one invalid attempt, corrects credentials, later authenticates successfully, but the old invalid-credentials message may remain visible around the transition.

### Classification

UI state bug. It does not prove the later successful credentials were rejected.

### Required remediation

Clear submission error:
- before a new submit;
- when relevant credentials change, where appropriate;
- on successful authentication before/navigation transition.

Add a focused regression test where practical.

---

## 11. Android CI creates too many APKs

### Problem

An intermediate workflow generated multiple Android variants that increased build time without providing proportional Phase 20 value.

### Decision

Current workflow produces a single artifact:

```text
vanta-android-physical-device-debug-apk
```

Relevant simplification checkpoint:

```text
13483338ad0200959657a22b53da03d1b7fbf9ad
```

Do not add additional artifacts unless they have a specific validation/release purpose.

---

## 12. Local repository changed by tooling

During local Expo/pnpm work, generated/tooling changes may appear unexpectedly (for example Expo updating `tsconfig.json` or a lockfile appearing during a setup path).

Before pulling/retesting, inspect:

```powershell
git status
```

Do not blindly commit generated local drift.

If a tracked file was only unintentionally modified and there is no desired change:

```powershell
git restore <path>
```

For an unwanted untracked generated file, review it before removal.

A deliberate lockfile will later be introduced as part of release governance; do not confuse that with accidental local generation.

---

## 13. Pull latest Phase 20 branch before retest

```powershell
cd C:\Users\Marcos\Documents\Vanta
git pull --ff-only origin feat/phase20-native-builds
```

Use `--ff-only` to avoid silently creating a merge commit in the local testing branch.

---

## 14. States that are *not* current bugs

### Deposit says unavailable

Expected. Production payment provider/reconciliation is intentionally not connected.

### Plinko says protected/unavailable

Expected. Production game placement remains closed until identity/compliance, financial, game-math and risk prerequisites exist.

### KYC says required / age not confirmed

Expected for an account that has not passed a real production verification process. Do not fabricate approval for testing.

### No physical iOS test

Known test limitation, not an Android defect. Validate iOS build/simulator path separately and record physical iOS as pending.

---

## 15. Security notes for development troubleshooting

- Use placeholder/local credentials only in docs/examples.
- Do not paste access/refresh tokens into troubleshooting files.
- Do not commit personal account email/passwords/screenshots containing unnecessary private information.
- Do not expose database/Redis to LAN to simplify phone testing.
- Development HTTP is allowed only in the explicit development environment.
- Production/staging remain HTTPS-only.
- Do not disable identity/Responsible Gaming/payment/game security controls simply to make a smoke test pass.

---

## 16. How to add a future finding

Use this structure:

```text
ID
Date / build / commit
Symptom
Impact
Environment
Root cause
Fix
Verification
Regression test/status
Security/product lesson
```

Do not record secrets or exploit-ready private production data.

If a finding is a security vulnerability rather than normal troubleshooting, follow `SECURITY.md` and the security audit process instead of publishing sensitive details here.
