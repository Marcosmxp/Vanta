# Local infrastructure

Start development dependencies with:

```bash
docker compose -f infrastructure/docker/compose.dev.yml up -d
```

Both PostgreSQL and Redis bind to `127.0.0.1` only. The credentials in `compose.dev.yml` are development-only values and must never be reused in staging or production.

Persistent development database files live under `.infrastructure-data/`, which is ignored by Git.
