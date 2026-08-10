# Customization & White-Labelling

One codebase adapts to many industries (see [business-use-cases.md](./business-use-cases.md)
and the in-app `/showcase`). Most rebrands touch only tokens, copy and
terminology.

## 1. Brand colors (theme)

Edit the tokens in `src/app/globals.css`. The primary brand color drives buttons,
links, active nav and focus rings:

```css
:root {
  --primary: oklch(0.52 0.16 258); /* your brand hue */
  --sidebar-primary: oklch(0.52 0.16 258);
  --ring: oklch(0.52 0.16 258);
}
.dark {
  --primary: oklch(0.7 0.14 255); /* … */
}
```

Update the same values in the `.dark` block for dark-mode parity. Colors are in
OKLCH — adjust the **hue** (third value) to rebrand quickly.

## 2. Logo & product name

- Wordmark/logo: `src/components/portal/brand.tsx`.
- App name / metadata: `src/app/layout.tsx` and `NEXT_PUBLIC_APP_NAME`.

## 3. Terminology & navigation

- Rename modules by editing labels in `src/lib/navigation.ts` (e.g. Projects →
  _Matters_ / _Shipments_ / _Policies_). Update page `PageHeader` titles to match.
- Add/remove nav items and gate them with a `permission`.

## 4. Roles & permissions

- Adjust roles and the permission matrix in `src/lib/rbac.ts`. Add new
  `PERMISSIONS`, grant them per role, and gate UI with `<Can>` /
  `usePermissions`. See [rbac.md](./rbac.md).

## 5. Data & modules

- Demo content lives in `src/lib/mock/*`. Replace with your own seed data, or
  swap the stores/mock for real API calls via TanStack Query (see
  [architecture.md](./architecture.md)).
- Add a module by creating a route under `src/app/(portal)/<module>/`, a nav
  entry, and (optionally) a store.

## 6. Status colors & badges

- Centralized in `src/components/shared/status-badge.tsx`. Add new statuses/
  variants there so they stay consistent everywhere.

## 7. Content & FAQs

- Help center content: `src/app/(portal)/help-center/page.tsx`.
- Showcase verticals: `src/app/(portal)/showcase/page.tsx`.

## 8. Fonts

- Swap Geist for your brand font in `src/app/layout.tsx` (`next/font`) and update
  `--font-sans` / `--font-mono` mapping in `globals.css`.

## Rebrand checklist

- [ ] Primary/brand tokens (light + dark)
- [ ] Logo + product name + metadata
- [ ] Module terminology + nav
- [ ] Roles/permissions if different
- [ ] Seed data / API wiring
- [ ] Help & showcase content
- [ ] Favicon / OG image
