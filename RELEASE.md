# Releasing TraceOrigin

This document explains how TraceOrigin releases work. Releases are **automated** by the [`Release` workflow](.github/workflows/release.yml) whenever a tag matching `v*` is pushed, and each release ships ready-to-run artifacts.

## Versioning

TraceOrigin follows **SemVer** (`MAJOR.MINOR.PATCH`).

| Bump | When | Example |
|---|---|---|
| MAJOR | Breaking API or breaking UX change | `1.0.0` → `2.0.0` |
| MINOR | Backward-compatible feature addition | `1.0.0` → `1.1.0` |
| PATCH | Bug fixes and small polish | `1.0.0` → `1.0.1` |

## Cutting a release (CI path — recommended)

1. Make sure `main` is green on CI.
2. Update the version where it lives:
   - `frontend/package.json` → `version`
   - `backend/app/main.py` → `version` in the `/` root endpoint
3. Commit the bump: `git commit -am "chore: bump to v1.1.0"`
4. Push and tag:

   ```bash
   git push origin main
   git tag v1.1.0
   git push origin v1.1.0
   ```

5. The `Release` workflow builds the frontend (`npm ci && npm run build`) and attaches to the GitHub Release:
   - `scamcheck-frontend-<version>.tgz` — npm tarball of the frontend package
   - `traceorigin-frontend.tar.gz` — the deployable production build (`frontend/dist`)
   - auto-generated GitHub source archives (`.zip` + `.tar.gz`) and release notes

## Cutting a release (manual path)

If you ever need to do it locally instead of waiting on CI:

```bash
npm run build                                   # frontend/dist
npm pack --pack-destination dist               # npm tarball
tar -czf traceorigin-frontend.tar.gz -C dist . # or zip the build
gh release create v1.1.0 \
  --title "TraceOrigin v1.1.0" \
  --generate-notes \
  dist/*.tgz dist/*.tar.gz
```

## Release checklist

Before tagging, verify:

- [ ] `npm run build` succeeds with no warnings
- [ ] backend boots: `uvicorn app.main:app --port 8001` and `/api/health` is healthy
- [ ] README screenshots match the current design
- [ ] `.env.example` reflects any new configuration keys
- [ ] secrets unchanged — **never** commit `backend/.env` or `frontend/.env`

## Known limitations

- GitHub Actions **source archives** are free on public repos. The workflow additionally packages the frontend build and npm tarball as release assets.
- `npm publish` to GitHub Packages is intentionally **not** used — this repository's token scope is limited to releases, so packages ship as release attachments instead.