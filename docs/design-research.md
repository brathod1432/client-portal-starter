# Design Research

> Phase 2 deliverable. Evaluation of free/open-source design resources for
> inspiration and building blocks. We **never copy blindly** — patterns are
> re-implemented and adapted to our tokens, accessibility bar and code style.

## Evaluation criteria

Each source was reviewed for: **license**, **source legitimacy**,
**dependencies**, **security**, **community adoption**, and **maintenance**.

## Summary matrix

| Source                   | License          | Risk | Security assessment                                                             | Decision                                             |
| ------------------------ | ---------------- | ---- | ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **shadcn/ui**            | MIT              | Low  | Copy-in components (you own the code); Radix under the hood; no runtime lock-in | **Selected** as the component foundation             |
| **Radix UI**             | MIT              | Low  | Accessible, audited primitives; widely adopted; active                          | **Selected** (primitive layer)                       |
| **Tailwind CSS**         | MIT              | Low  | Build-time CSS; huge adoption; actively maintained                              | **Selected** (styling)                               |
| **lucide-react**         | ISC              | Low  | Tree-shakeable SVG icons; active                                                | **Selected** (icons)                                 |
| **Recharts**             | MIT              | Low  | Popular, mature charting; SVG-based                                             | **Selected** (charts)                                |
| **Tremor**               | Apache-2.0       | Low  | Great dashboard blocks, but overlaps with our shadcn/Recharts stack             | Rejected (redundant dependency)                      |
| **HyperUI**              | MIT              | Low  | Tailwind snippets, good for inspiration                                         | Inspiration only (patterns re-implemented)           |
| **Origin UI**            | MIT              | Low  | shadcn-compatible patterns                                                      | Inspiration only                                     |
| **Flowbite (Free)**      | MIT              | Low  | Solid components but ties to its own JS/theme                                   | Rejected (different design language)                 |
| **Magic UI**             | MIT              | Low  | Beautiful motion/marketing components                                           | Inspiration only (kept motion minimal for a11y/perf) |
| **Aceternity UI (free)** | MIT (free parts) | Med  | Heavy animation; some snippets pull extra deps                                  | Inspiration only; avoided heavy-motion pieces        |

## Detail

### Selected

- **shadcn/ui** — Not an installed dependency but a **code-ownership** model:
  components are generated into `src/components/ui/*` and become ours to adapt.
  This eliminates runtime version lock-in and lets us tune accessibility and
  tokens. Because a corporate TLS proxy blocked the CLI's network fetch during
  setup, the primitives were authored directly in the shadcn style against the
  same Radix packages (documented in [security-governance.md](./security-governance.md)).
- **Radix UI** — WAI-ARIA compliant primitives (dialog, dropdown, select, tabs,
  tooltip, etc.). Focus management and keyboard interaction come for free.
- **Tailwind CSS v4** — CSS-first config via `@theme`; our tokens live in
  `globals.css` in OKLCH for reliable contrast.
- **Recharts** — declarative, SVG-based charts themed with our CSS variables.

### Inspiration only (re-implemented, not copied)

- **HyperUI / Origin UI** — layout and empty-state patterns.
- **Magic UI / Aceternity** — subtle gradient/hero treatments on the auth
  screen and showcase, kept lightweight to respect `prefers-reduced-motion`
  and performance budgets.

### Rejected

- **Tremor** and **Flowbite** — capable, but each introduces a second design
  language / component runtime that overlaps with shadcn + Recharts, increasing
  bundle size and maintenance surface for no net benefit.

## How we adapted, not copied

- All interactive components are Radix-backed for accessibility.
- Colors converted to **OKLCH** design tokens with dark-mode parity.
- Status colors centralized in `status-badge.tsx` for consistency.
- Motion minimized and gated on `prefers-reduced-motion`.
- Every pattern re-typed and linted to our standards.
