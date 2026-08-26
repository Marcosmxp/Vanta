# Vanta — Deployment

## 1. Current deployment state

Vanta currently supports reproducible development/native-alpha builds. A production backend deployment target has not been selected and production deploy is not authorized.

Current validated paths:
- local backend via Docker Compose or `go run`;
- Android debug artifact via GitHub Actions;
- EAS mobile build profiles for development/preview/production configuration.

## 2. Deployment rule

No production deployment without explicit human authorization and completion of production-readiness gates.

Do not infer authorization from:
- a green CI run;
- an APK existing;
- a production EAS profile;
- infrastructure credentials becoming available.

## 3. Development deployment

From repository root, local backend stack may be started with:

```bash
docker compose -f infrastructure/docker/compose.dev.yml up -d --build
```

Validation:
- `GET /health`;
- `GET /health/ready`;
- `GET /v1/platform/status`;
- mobile/API smoke tests as relevant.

## 4. Native alpha build

Native Android workflow must:
1. validate release identity;
2. install with frozen lockfile;
3. validate Expo configuration;
4. prebuild;
5. compile the native artifact;
6. attach non-secret provenance metadata;
7. publish the artifact only after successful build.

Release artifacts are not production releases unless the release gate explicitly says so.

## 5. Preview / staging deployment

`PARTIAL / DECISION REQUIRED`.

Before using staging as a release gate, define:
1. selected backend/database/cache hosting;
2. staging secret injection;
3. controlled migrations;
4. staging API domain/TLS;
5. provider sandbox configuration;
6. deployment identity/version;
7. post-deploy health and smoke checks;
8. rollback path;
9. monitoring/alerting.

## 6. Production deployment design

Production deployment should separate these steps:

```text
approved release candidate
→ backup/readiness confirmation
→ controlled database migration
→ backend deployment
→ health/readiness verification
→ mobile/web distribution as applicable
→ smoke test
→ monitoring watch
→ release completion
```

Database schema changes should not depend permanently on every application replica racing to migrate at startup. Current startup migrations are acceptable for development but must be redesigned before production.

## 7. Required pre-deploy checks

As applicable:
- scope/release notes complete;
- clean reviewed commit/tag;
- lockfiles current;
- lint/typecheck/tests/build green;
- security review completed;
- dependency/security scans green or dispositioned;
- migrations reviewed for safety/backward compatibility;
- environment configuration validated without printing secrets;
- backup/restore readiness confirmed;
- rollback documented;
- monitoring operational;
- jurisdiction/provider gates satisfied for regulated features.

## 8. Post-deploy validation

Validate at minimum:
- liveness/readiness;
- authentication/session path;
- database/cache connectivity;
- critical read-only player flows;
- financial/provider health when enabled;
- error rate/log anomalies;
- exact version/build/commit deployed.

Do not perform real-money production test transactions unless an approved operational test procedure exists.

## 9. Failed deployment

If a deployment fails:
- stop further rollout;
- preserve logs/evidence;
- classify whether code, config, migration or provider failure caused it;
- follow `ROLLBACK.md`;
- never conceal a failed migration by manually editing production schema without a reviewed recovery plan.
