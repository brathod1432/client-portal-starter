# Changelog

All notable changes to this project are documented here. The format is loosely
based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added — user-experience & security round

Practical, real-world improvements driven by a user-first review (see
[`docs/improvements.md`](docs/improvements.md)).

**Security**

- **Login rate limiting / account lockout** — the sign-in form locks after 5
  failed attempts for 30s, with a generic (non-enumerating) error message.
  Covered by unit tests.
- **Change password** flow in Settings → Security, with current-password
  verification, strong-password policy and a live strength meter.
- **Real two-factor setup** — replaced the raw toggle with a setup dialog
  (authenticator QR placeholder + secret), 6-digit verification, and one-time
  recovery codes.
- **Password visibility toggle** — accessible show/hide control on all password
  fields (`PasswordInput`).
- **Idle session timeout dialog** — a countdown warning with "Stay signed in" /
  "Sign out now" instead of a silent toast.
- **Client-side upload validation** — avatar uploads are type/size checked
  (documented that a backend must re-validate + virus-scan).

**User experience**

- **Onboarding checklist** on the dashboard (personalize profile, enable 2FA,
  raise first ticket) with progress; dismissible and persisted.
- **Profile photo upload** — real client-side avatar (persisted; shown in the
  header and profile).
- **Download my data (JSON)** — self-service data-portability export
  (GDPR/CCPA-style) in Settings.
- **Keyboard shortcuts help** — press `?` anywhere for a shortcuts dialog.
- **Privacy/consent banner** — lightweight, dismissible, persisted.

### Changed

- Darkened brand/status color tokens to meet WCAG AA contrast for small text.
- Charts render without entry animations for deterministic screenshots.

### Tests

- Added auth-store tests (valid sign-in, generic failure, lockout, change
  password). Suite now: 9 files / 32 tests. Playwright e2e: 16 specs incl. axe.

## [0.1.0] — initial

- Enterprise-grade client portal starter: 12 modules, RBAC (4 roles), hardened
  security headers, shared Zod validation, audit trail, WCAG AA, full test
  tooling, documentation set and reference screenshots.
