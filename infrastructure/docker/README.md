# Vanta local runtime

Start the complete development backend from the repository root:

```bash
docker compose -f infrastructure/docker/compose.dev.yml up -d --build
```

Services:

- API: `http://127.0.0.1:8080`
- PostgreSQL: `127.0.0.1:5432`
- Redis: `127.0.0.1:6379`

Readiness:

```bash
curl http://127.0.0.1:8080/health/ready
```

Stop the runtime:

```bash
docker compose -f infrastructure/docker/compose.dev.yml down
```

PostgreSQL data is stored under `.infrastructure-data/`, which is ignored by Git. Redis is intentionally ephemeral because it is not a source of financial truth.

All host ports bind to `127.0.0.1`. The database password and development cryptographic defaults are local-only placeholders. Never reuse them in staging or production.

The API container runs as a non-root user, uses a read-only filesystem, drops Linux capabilities and enables `no-new-privileges`.
