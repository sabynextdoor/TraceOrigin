# Security Policy

## Supported versions

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | ✅ actively patched |

## Reporting a vulnerability

TraceOrigin takes security seriously — this project belongs to *[Saby N. (sabynextdoor)](https://github.com/sabynextdoor)*, who reviews every report personally.

**Please do not open a public issue for security problems.** Instead, report privately:

- Open a **security advisory** on GitHub: *Issues → New issue → Security Report*, or
- E-mail the maintainer (reachable via the GitHub profile of `sabynextdoor`).

Include:

- The affected endpoint / component and version
- A step-by-step reproduction (PoC preferred)
- Impact assessment (what an attacker could do)

You should receive an acknowledgement within **48 hours**, and a fix + advisory within a reasonable window depending on severity.

## Scope

- Authentication (JWT handling, token expiry, password storage)
- API authorization — any unowned cross-user data access
- Prompt/command injection surfaces in the analyzer
- Dependency supply-chain vulnerabilities
- Secrets / credential handling

## Security reminders for contributors

- `backend/.env` and `frontend/.env` are git-ignored and must **never** be committed.
- Keep `SECRET_KEY` fresh for each deployment — never reuse the dev value.
- All history/dashboard endpoints operate under per-user ownership; new routes must follow the same `get_current_user` scoping pattern.