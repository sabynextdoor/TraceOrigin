<div align="center">

<br/>

<p align="center">
  <img src="docs/logo-horizontal.svg" alt="TraceOrigin" width="560"/>
</p>

<br/>

**TraceOrigin — the phishing-aware job & opportunity verification platform.**
Paste a WhatsApp message, email, or job offer and get an explainable, evidence-backed risk score in seconds.

<br/>

![Version](https://img.shields.io/badge/version-1.0.0-663af3?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React_18-236adc?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646cff?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8-4479a1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS_3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## Table of Contents

- [What is TraceOrigin?](#-what-is-traceorigin)
- [Why it exists](#-the-problem)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
  - [01 · Landing — Hero](#01--landing--hero)
  - [02 · Landing — Features](#02--landing--features)
  - [03 · Sign in](#03--sign-in)
  - [04 · Create account](#04--create-account)
  - [05 · Analyzer workspace](#05--analyzer-workspace)
  - [06 · Analyzer — example loaded](#06--analyzer--example-loaded)
  - [07 · Results — high risk](#07--results--high-risk)
  - [08 · Results — low risk](#08--results--low-risk)
  - [09 · Analysis history](#09--analysis-history)
  - [10 · Scam Intelligence Center](#10--scam-intelligence-center)
  - [11 · Profile](#11--profile)
  - [12 · Dashboard — mobile](#12--dashboard--mobile)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1 · Database](#1--database)
  - [2 · Backend](#2--backend)
  - [3 · Frontend](#3--frontend)
  - [4 · Run it](#4--run-it)
  - [Demo account](#demo-account)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Performance & Engineering Notes](#-performance--engineering-notes)
- [Releases & Packages](#-releases--packages)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#-disclaimer)

---

## 🔭 What is TraceOrigin?

TraceOrigin is a full-stack **student opportunity verification platform**. Every day students receive internship offers, "urgent" WhatsApp jobs, and prize "winners" messages — many engineered to steal money or personal data. TraceOrigin turns any raw opportunity text into a clear, explainable verification trail:

- an **explainable 0–100 risk score** with a live gauge,
- **warning indicators** per detected scam pattern (payment demands, urgency, personal emails, no-interview hiring),
- a **verification checklist** and a machine-readable **recommendation**,
- a personalized **dashboard** with trends and risk distribution,
- a global **Scam Intelligence Center** aggregating patterns across all users.

**Screenshot OCR** is built in (Tesseract.js) — upload a screenshot of the offer and the text is extracted for free.

---

## 🎯 The problem

> *"Congratulations! You have been selected… Pay ₹1999 registration fee today. Only 10 seats remaining."*

This exact message is sent to thousands of students every day. Scammers exploit urgency, fake scarcity, and personal contact channels (WhatsApp, Telegram, Gmail, Paytm / UPI / Google Pay).

**TraceOrigin answers one question a student should always ask:** *is this opportunity — or this origin — worth trusting?* It is deliberately **not** a black-box verdict. Every score ships with the evidence trail behind it, so the user stays the decision-maker.

---

## ✨ Key Features

**Verification engine (backend)**
- ✅ Rule-based risk engine with 30+ detection signals across payment, urgency, contact-channel, and legitimacy patterns
- ✅ Explainable scores — `CRITICAL / HIGH / MEDIUM / LOW` plus a written recommendation
- ✅ Structured information extraction (company, role, salary, location, contact, source, website) from free text
- ✅ JWT authentication (salted-SHA-256 password hashing, HS256 tokens) with per-user data scoping
- ✅ Full REST API — analyze, history, search/filter, delete, dashboard stats, global intelligence

**Experience (frontend)**
- 🚀 **Code-split lazy routes** — 1.15 MB monolithic bundle split into a ~15 KB initial payload
- 📊 Recharts analytics — 7-day trends, risk-distribution pie, weekly activity, warning-signal bars
- 🖼️ Screenshot OCR with live progress (Tesseract.js, lazy-loaded)
- 📑 One-click report export — **PDF**, copy-to-clipboard, share, e-mail, and print-clean (A4 stylesheet)
- 🎛️ AuthKit-inspired frosted-glass design system: violet `#663af3` canvas, glass surfaces, pill buttons, micro-interactions
- 🧭 Role-appropriate navigation, protected routes, mobile-first responsive layout
- 🔔 Notification preferences, profile management, and secure session handling

---

## 📸 Screenshots

The app is fully designed in a **frosted-glass, midnight "cathedral"** visual language. Here is the complete flow — from the landing page through signing in to the analytics dashboards.

<details>
<summary><b>Open the full gallery (12 screenshots)</b></summary>

### 01 · Landing — Hero

<a href="docs/screenshots/01-landing-hero.png"><img src="docs/screenshots/01-landing-hero.png" alt="Landing hero" width="900"/></a>

### 02 · Landing — Features

<a href="docs/screenshots/02-landing-features.png"><img src="docs/screenshots/02-landing-features.png" alt="Landing features" width="900"/></a>

### 03 · Sign in

<a href="docs/screenshots/03-login.png"><img src="docs/screenshots/03-login.png" alt="Sign in" width="900"/></a>

### 04 · Create account

<a href="docs/screenshots/04-register.png"><img src="docs/screenshots/04-register.png" alt="Create account" width="900"/></a>

### 05 · Analyzer workspace

<a href="docs/screenshots/05-analyze-signed-in.png"><img src="docs/screenshots/05-analyze-signed-in.png" alt="Analyzer workspace" width="900"/></a>

### 06 · Analyzer — example loaded

<a href="docs/screenshots/06-analyze-example.png"><img src="docs/screenshots/06-analyze-example.png" alt="Analyzer with example" width="900"/></a>

### 07 · Results — high risk

<a href="docs/screenshots/07-results-high-risk.png"><img src="docs/screenshots/07-results-high-risk.png" alt="High risk results" width="900"/></a>

### 08 · Results — low risk

<a href="docs/screenshots/08-results-low-risk.png"><img src="docs/screenshots/08-results-low-risk.png" alt="Low risk results" width="900"/></a>

### 09 · Analysis history

<a href="docs/screenshots/09-history.png"><img src="docs/screenshots/09-history.png" alt="Analysis history" width="900"/></a>

### 10 · Scam Intelligence Center

<a href="docs/screenshots/10-intelligence.png"><img src="docs/screenshots/10-intelligence.png" alt="Scam Intelligence Center" width="900"/></a>

### 11 · Profile

<a href="docs/screenshots/11-profile.png"><img src="docs/screenshots/11-profile.png" alt="Profile" width="900"/></a>

### 12 · Dashboard — mobile

<a href="docs/screenshots/12-dashboard-mobile.png"><img src="docs/screenshots/12-dashboard-mobile.png" alt="Dashboard on mobile" width="400"/></a>

</details>

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite 5 | UI runtime & build tooling |
| | Tailwind CSS 3 | The AuthKit-inspired design system (tokens, glass, animations) |
| | Recharts | Dashboard & analytics visualizations |
| | Tesseract.js 7 | Client-side screenshot OCR (lazy-loaded) |
| | jsPDF + jspdf-autotable | One-click PDF report export |
| | Lucide React | Icon system |
| **Backend** | Python 3.12 + FastAPI | REST API, OAuth2-style JWT auth |
| | SQLAlchemy 2 + PyMySQL | ORM & MySQL driver |
| | python-jose | HS256 JWT signing |
| | Pydantic 2 | Request/response validation |
| **Database** | MySQL 8 | Users, analyses, alerts |
| **Infra** | GitHub Actions | CI (build + verify) and automated releases |

---

## 🏗️ Architecture

```
┌────────────────────┐        ┌─────────────────────┐        ┌──────────────────────┐
│  React 18 + Vite   │  HTTP  │      FastAPI        │  SQL   │        MySQL 8        │
│  (SPA, lazy routes)│ ─────► │  /api/*  routers     │ ─────► │ users / analyses /   │
│  frosted-glass UI  │  JWT   │  Rule-Based Engine   │        │ alerts               │
└────────────────────┘        └─────────────────────┘        └──────────────────────┘
                                 ├─ Information extractor
                                 ├─ Indicator generator (30+ signals)
                                 └─ Risk scorer + recommendation engine
```

- **Frontend** ships as a static bundle (Vite build) and talks only to `/api/*` through the dev proxy or your CORS-allowed origin.
- **Backend** is a thin FastAPI layer. Business logic lives in `backend/app/analyzer.py` (risk engine), `extractor.py` (entity extraction), and `advanced_analyzer.py` (deep patterns).
- **Auth** uses `OAuth2PasswordBearer` + HS256 JWTs; passwords are salted-SHA-256 hashes.
- Every request is **scoped to the authenticated user** — history, dashboard stats, and deletes never cross account boundaries (verified by an owner check in the history route).

---

## 🚀 Getting Started

### Prerequisites

| Tool    | Version | Notes |
|---------|---------|-------|
| Python  | 3.10+   | 3.12 recommended (pinned deps wheel-tested) |
| Node.js | 18+     | 20/22 LTS recommended |
| MySQL   | 8.x     | Create the `scamcheck` database yourself |
| Git     | —       | For cloning |

### 1 · Database

```sql
CREATE DATABASE IF NOT EXISTS scamcheck CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Tables are **auto-created on first boot** by `Base.metadata.create_all` — no migrations to run.

### 2 · Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create your environment file:

```bash
cp .env.example .env
```

```dotenv
ENV=development
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/scamcheck
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run the API:

```bash
uvicorn app.main:app --reload --port 8001
```

Health check → `http://localhost:8001/api/health` → `{"status":"healthy","service":"ScamCheck API"}`

### 3 · Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the Vite dev server proxies `/api` to `http://localhost:8001`.

### 4 · Run it

| Command | What it does |
|---|---|
| `npm run dev` (frontend) | Dev server on `:5173` with `/api` proxy |
| `npm run build` | Production build → `frontend/dist/` |
| `npm run preview` (frontend) | Serve the production build locally |
| `uvicorn app.main:app --reload --port 8001` (backend) | Dev API on `:8001` |

Prefer one-command helpers? The `scripts/` folder has cross-platform start scripts:

```bash
# Windows PowerShell
.\scripts\start-backend.ps1
.\scripts\start-frontend.ps1

# macOS / Linux
./scripts/start-backend.sh
./scripts/start-frontend.sh
```

### Demo account

Seeded for trying the product end-to-end (includes 8 analyses across all risk levels + a 7-day trend):

```
Email:    demo@traceorigin.app
Password: Demo@1234
```

> ⚠️ The demo dataset lives in your local MySQL from the seed script. While it exists, anyone can sign in with these credentials on your local instance.

---

## ⚙️ Configuration

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `ENV` | `development` | Runtime environment flag |
| `DATABASE_URL` | `mysql+pymysql://…` | SQLAlchemy connection string |
| `SECRET_KEY` | *(change me)* | JWT signing secret — **always override in production** |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Access-token lifetime |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Override for CORS/remote deployments |

---

## 📡 API Reference

Base URL: `http://localhost:8001/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | Health check |
| `POST` | `/auth/register` | — | Create account `{email, username, password, full_name}` |
| `POST` | `/auth/login` | — | OAuth2 form login → `{access_token}` |
| `GET` | `/auth/me` | ✅ | Current user profile |
| `POST` | `/analyze` | ✅ | Analyze opportunity text `{text}` → full report |
| `GET` | `/history` | ✅ | List analyses `?search=&risk_filter=` |
| `GET` | `/history/{id}` | ✅ | Full report for one analysis (owner-scoped) |
| `DELETE` | `/history/{id}` | ✅ | Delete one analysis (owner-scoped) |
| `GET` | `/dashboard/stats` | ✅ | Totals, risk distribution, 7-day trends, signals, recent |
| `GET` | `/dashboard/intelligence` | ✅ | Global intelligence snapshot |
| `GET` | `/intelligence/scam-patterns` | ✅ | Pattern frequency across all analyses |
| `GET` | `/intelligence/company-risk?company=` | ✅ | Aggregate risk for a company name |

**Analyze response shape**

```jsonc
{
  "id": 10,
  "risk_score": 91,
  "risk_level": "CRITICAL",
  "company": "DreamJob LLP",
  "indicators": [
    { "title": "Payment Requested", "severity": "CRITICAL", "detail": "…" }
  ],
  "verification": [ /* 8-item verification checklist */ ],
  "recommendation": "…",
  "created_at": "2026-09-20T00:00:00"
}
```

---

## 🗂️ Project Structure

```
TraceOrigin/
├─ backend/
│  ├─ app/                        # FastAPI application
│  │  ├─ routes/                  # analyze · auth · dashboard · health · history · intelligence · alerts
│  │  ├─ analyzer.py              # Rule-based risk engine (30+ signals)
│  │  ├─ advanced_analyzer.py     # Deep pattern detection
│  │  ├─ extractor.py             # Company / role / salary / entity extraction
│  │  ├─ auth.py                  # JWT helpers + current-user dependency
│  │  ├─ config.py                # Env-driven settings
│  │  ├─ database.py              # SQLAlchemy engine + session
│  │  ├─ main.py                  # App factory, CORS, router wiring
│  │  ├─ models.py                # User · Analysis · (alerts)
│  │  └─ schemas.py               # Pydantic models
│  ├─ .env.example
│  ├─ requirements.txt
│  └─ runtime.txt
├─ frontend/
│  ├─ src/
│  │  ├─ api/client.js            # Axios client + typed wrappers (JWT interceptor)
│  │  ├─ components/              # Analyzer · Dashboard · History · Landing · Navbar · Results · RiskGauge · ScamIntelligence · …
│  │  ├─ context/AuthContext.jsx  # Session state + login/logout
│  │  ├─ App.jsx                  # Lazy route table + Suspense
│  │  ├─ index.css                # Design-system tokens & component classes
│  │  └─ main.jsx
│  ├─ index.html
│  ├─ package.json
│  ├─ tailwind.config.js
│  └─ vite.config.js              # Dev proxy + vendor chunk splitting
├─ docs/
│  ├─ logo.svg / logo-horizontal.svg / logo.png
│  └─ screenshots/                # 12 marketing screenshots
├─ scripts/                       # Cross-platform start helpers
├─ .github/workflows/             # CI + release automation
├─ .gitignore
├─ LICENSE                        # MIT
└─ README.md
```

---

## ⚡ Performance & Engineering Notes

- **Initial bundle ≈ 15 KB** (gzip ~6.5 KB). The original single 1.15 MB entry chunk was split into route-level lazy chunks — recharts, jsPDF, and Tesseract now load *only* on the pages that need them.
- **Vendor caching** — `react`, `react-dom`, `react-router-dom`, and `lucide-react` land in cacheable, immutable vendor chunks.
- **Dashboard uses the server endpoint** (`/dashboard/stats`) instead of shipping full history to the browser for client-side aggregation — less bandwidth, one round trip.
- **Smooth interactions** — global press micro-scaling (`active:scale`), 150–300 ms transitions, a fade-up page transition keyed by route, and `-webkit-tap-highlight-color` removal for mobile.
- **OCR is race-safe** — a run-id guard ignores stale async results if the user cancels mid-extraction; failures degrade gracefully to manual paste.
- **Backend indexes** — `analyses.created_at` indexed for the 7-day trend queries; `user_id` is FK-indexed by MySQL.

---

## 📦 Releases & Packages

- **GitHub Releases** — see [`RELEASE.md`](RELEASE.md) for the release checklist and how versions are cut.
- **Automated packaging** — the [`release.yml`](.github/workflows/release.yml) workflow builds the frontend and attaches:
  - 📦 the production build as `traceorigin-frontend.zip`
  - 📦 the npm tarball via `npm pack`
- **Source archives** — every release automatically includes GitHub's generated `.zip` / `.tar.gz`.
- Versioning follows **SemVer** (`v1.0.0`, `v1.1.0`, …).

```bash
# Manual release (if you prefer not to use the workflow):
gh release create v1.1.0 --title "v1.1.0" --generate-notes
```

---

## 🗺️ Roadmap

- [ ] Deep-learning risk scoring (beyond rule-based signals)
- [ ] Email & WhatsApp sharing with a public/private share link
- [ ] MFA + refresh-token rotation for production auth
- [ ] Company/domain verification API (WHOIS, MX, reputation)
- [ ] CSV export of history for personal audit trails
- [ ] Realtime alerting on newly reported scam patterns (Dockerized alert worker)

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/my-feature`).
3. Commit your changes (`git commit -m "feat: …"`).
4. Push to the branch (`git push origin feat/my-feature`).
5. Open a Pull Request.

**Quality bar:** frontend must pass `npm run build`; backend must boot with `uvicorn app.main:app`. Route changes must stay user-scoped. Secrets never enter the repo.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## ⚠️ Disclaimer

TraceOrigin provides **risk indicators based on available information**. A high score does not prove fraud, and a low score does not guarantee legitimacy. Always verify opportunities through official channels before sharing money or personal data. The demo dataset and screenshots use fictional or synthetic content.

---

<div align="center">
  <sub>Built with React · FastAPI · MySQL — <b>Verify before you trust.</b></sub>
</div>