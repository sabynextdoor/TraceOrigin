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

5. The `Release` workflow builds the frontend (`npm ci && npm run build`) and:
   - 📦 publishes `@sabynextdoor/scamcheck-frontend` to **GitHub Packages** (the npm registry at `npm.pkg.github.com`) using the workflow's `GITHUB_TOKEN`
   - 📦 attaches to the GitHub Release:
     - `sabynextdoor-scamcheck-frontend-<version>.tgz` — npm tarball of the frontend package
     - `traceorigin-frontend.tar.gz` — the deployable production build (`frontend/dist`)
     - auto-generated GitHub source archives (`.zip` + `.tar.gz`) and release notes

> The published package is a **build artifact**, not a distributable library: it contains the compiled `frontend/dist` bundle built on CI. The GitHub Packages version is set by the tag — keep `frontend/package.json` `version` in sync with the tag.

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

> Manual local `npm publish` to GitHub Packages requires a token with **write:packages** scope plus `@sabynextdoor:registry=npm.pkg.github.com` in `.npmrc`. Prefer letting the workflow publish.

## Release checklist

Before tagging, verify:

- [ ] `npm run build` succeeds with no warnings
- [ ] `frontend/package.json` `version` matches the tag you're about to push
- [ ] backend boots: `uvicorn app.main:app --port 8001` and `/api/health` is healthy
- [ ] README screenshots match the current design
- [ ] `.env.example` reflects any new configuration keys
- [ ] secrets unchanged — **never** commit `backend/.env` or `frontend/.env`

## Known limitations

- GitHub Actions **source archives** are free on public repos. The workflow additionally packages the frontend build and npm tarball as release assets.
- The published GitHub Packages npm package is scoped (`@sabynextdoor/…`) and built by CI only — it will never appear on the public npmjs.com registry.
- A version can be published to GitHub Packages **only once** per repo/tag; to republish after a fix, bump the version or delete the package first.