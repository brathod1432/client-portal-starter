# Design System

> Phase 15 deliverable. Tokens and component conventions for a **premium,
> trustworthy, modern, professional, enterprise, client-friendly** portal.

## Principles

- **Trust through restraint** — calm surfaces, one confident brand accent,
  status colors used sparingly and consistently.
- **Accessible by default** — visible focus, AA contrast, semantic structure.
- **Token-driven** — everything themable from CSS variables; light/dark parity.

## Colors (tokens)

Defined in `src/app/globals.css` in **OKLCH** for perceptual uniformity and
reliable contrast, surfaced to Tailwind via `@theme inline`. Each has a light
and `.dark` value.

| Token                                               | Role                                |
| --------------------------------------------------- | ----------------------------------- |
| `--background` / `--foreground`                     | App surface / text                  |
| `--card` / `--card-foreground`                      | Cards / text on cards               |
| `--primary` / `--primary-foreground`                | Brand (trustworthy blue) / on-brand |
| `--secondary`, `--muted`, `--accent`                | Neutrals & subtle surfaces          |
| `--destructive`, `--success`, `--warning`, `--info` | Status                              |
| `--border`, `--input`, `--ring`                     | Lines & focus                       |
| `--chart-1..5`                                      | Data visualization                  |
| `--sidebar*`                                        | Sidebar surface set                 |

**Usage:** `bg-primary text-primary-foreground`, `text-muted-foreground`,
`border`, `ring-ring`, etc. Never hard-code hex values in components.

## Typography

- **Sans:** Geist (`--font-sans`); **Mono:** Geist Mono (`--font-mono`).
- Scale: page title `text-2xl font-semibold`, section `text-base font-semibold`,
  body `text-sm`, meta `text-xs text-muted-foreground`.
- Line-height and tracking tuned for dense enterprise data without fatigue.

## Iconography

- **lucide-react**, sized `h-4 w-4` inline / `h-5 w-5` in tiles. Icons are
  decorative (`aria-hidden`) unless they are the only label, in which case the
  control has an `aria-label`.

## Spacing & layout

- 4px base scale (Tailwind spacing). Page content max-width `max-w-7xl`, vertical
  rhythm via `space-y-6`. Cards use `p-4`–`p-6`.

## Elevation & radius

- Radius from `--radius` (0.625rem) with `sm/md/lg/xl` derivatives.
- Shadows: `shadow-sm` for cards, `shadow-md/lg` for popovers/dialogs. Elevation
  signals interactivity and layering, used sparingly.

## Component conventions

- **Cards** — `Card`/`CardHeader`/`CardTitle`/`CardContent`; the standard
  container for grouped content.
- **Tables** — base `Table` primitives + `DataTable` (TanStack Table) with
  sortable headers, text filter, and pagination.
- **Forms** — `Form*` (RHF + Zod) with `FormLabel`, `FormControl`,
  `FormDescription`, `FormMessage`; invalid fields set `aria-invalid` and link
  errors via `aria-describedby`; password strength meter on registration.
- **Alerts / Banners** — `Alert` with `default/info/success/warning/destructive`
  variants; used for overdue-invoice and inline guidance.
- **Notifications (toasts)** — `sonner`, top-right, theme-aware.
- **Badges / Status** — `StatusBadge` centralizes domain-status → color mapping
  so tickets/projects/invoices stay consistent.
- **Empty states** — `EmptyState` (icon + title + description + optional action).
- **Loading states** — `Skeleton` blocks and route-level `loading.tsx`; charts
  show skeleton fallbacks while dynamically imported.

## Motion

- Subtle enter/exit via `tw-animate-css`. All motion respects
  `prefers-reduced-motion` (see `globals.css`) and the Settings → Reduce motion
  toggle.

## Theming / white-labelling

Change the brand by editing `--primary` (+ `--sidebar-primary`, `--ring`) and
the `Brand` component. See [customization.md](./customization.md).
