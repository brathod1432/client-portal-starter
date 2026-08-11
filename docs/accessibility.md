# Accessibility

> Phase 16 deliverable. Target: **WCAG 2.1 AA minimum.** Accessibility is
> verified automatically (jest-axe unit tests + `@axe-core/playwright` on key
> pages) and built into the components.

## What we implement

### Keyboard support

- All interactive elements are native buttons/links or Radix primitives with
  full keyboard interaction (Tab/Shift+Tab, Enter/Space, arrow keys, Escape).
- **Skip link** ("Skip to main content") is the first focusable element.
- **Command palette** (Cmd/Ctrl+K) is fully keyboard-driven (arrows + Enter).
- Dialogs/sheets/menus trap focus and restore it on close (Radix).

### Screen-reader support

- Semantic landmarks: `header`, `nav` (labelled "Primary"), `main` (`id=
main-content`, focus target for the skip link), `ol/ul` for lists.
- Icon-only controls have `aria-label`s (theme toggle, notifications, menus).
- Notifications bell announces unread count; live regions used for password
  strength and inline status.
- `aria-current="page"` on the active nav item and breadcrumb.

### Forms

- Every input has an associated `<label>`.
- Invalid fields set `aria-invalid` and reference their message via
  `aria-describedby`; error messages use `role="alert"`.

### Focus management

- Visible focus rings (`ring-ring`, offsets) on every interactive element.
- Logical DOM order; no positive `tabindex`.

### Color & contrast

- OKLCH tokens chosen for AA contrast in light and dark themes.
- Status is never conveyed by color alone — always paired with a text label
  (`StatusBadge`) or icon.

### Motion

- All animations respect `prefers-reduced-motion`; a Settings toggle is provided.

### Semantic HTML

- Headings follow a logical hierarchy (one `h1` per page via `PageHeader`).
- Tables use `th`/`caption` semantics.

## Automated testing

- **jest-axe** — component-level checks (`src/components/__tests__/accessibility.test.tsx`).
- **@axe-core/playwright** — page-level checks on `/login`, `/dashboard`,
  `/projects`, `/tickets`, `/documents`, `/invoices`
  (`e2e/accessibility.spec.ts`), asserting **no serious/critical violations**.

Run:

```bash
npm test           # includes jest-axe
npm run e2e        # includes axe page scans
```

## Manual QA checklist

- [ ] Navigate the entire portal with keyboard only.
- [ ] Verify skip link works and focus lands on main content.
- [ ] Screen-reader pass (VoiceOver/NVDA) on dashboard, a form, a dialog.
- [ ] 200% zoom / reflow at 320px width.
- [ ] Dark mode contrast.
- [ ] `prefers-reduced-motion` disables non-essential animation.

## Known limitations

- Charts (Recharts) expose limited SR semantics, so the dashboard charts now
  ship with visually-hidden (`sr-only`) data tables carrying the same figures
  (ticket volume, uptime, spend). Apply the same pattern to any new chart.
