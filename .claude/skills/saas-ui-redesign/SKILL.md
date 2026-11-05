---
name: saas-ui-redesign
description: Redesign a Vue 3 application's UI into a modern SaaS-style interface. It replaces a top navigation bar with a collapsible vertical sidebar on the left, adds a slim top bar for page context and utilities, introduces design tokens for consistent spacing, type, color, radius and elevation, and polishes every view into a clean, professional look without changing app behavior. Use this skill whenever the user wants to modernize, restyle, refresh, re-skin or "make professional" a Vue app, move navigation into a side nav or left menu, adopt a dashboard or admin-panel layout, fix inconsistent spacing across pages, or make the app look like Linear, Vercel, Stripe-style SaaS products, even if they don't say "redesign" or "sidebar".
---

# SaaS UI Redesign for Vue 3

This skill turns a Vue 3 app with a top nav into a polished SaaS layout:

```
+-----------+--------------------------------------------+
|  Brand    |  Page title          [filters] [lang] [me] |  <- top bar (sticky)
|           +--------------------------------------------+
|  Nav      |                                            |
|  - Item   |   Page header (title, description, actions)|
|  - Item   |                                            |
|  - Item   |   Content: cards / tables / charts on a    |
|           |   consistent spacing grid                  |
|           |                                            |
|  Footer   |                                            |
|  collapse |                                            |
+-----------+--------------------------------------------+
```

The goal is a visual and structural redesign. Routes, data loading, API calls, i18n keys, emitted events and business logic stay exactly as they are. A redesign that breaks a filter or a modal is a regression, however good it looks.

## Workflow

Work through these phases in order. Each one depends on what the previous one found.

### 1. Audit before touching anything

Read the code that defines the current shell and look. Don't guess.

- **Project rules.** Read `CLAUDE.md` (root and `client/`) and anything it points to. Follow its rules over this skill's defaults: required subagents (for example "delegate .vue changes to vue-expert"), design-system colors, "no emojis", the browser-testing tool to use, and so on.
- **The shell.** Usually `App.vue`. Note the header markup, the nav links and how their active state is computed, global utilities in the header (language switcher, profile menu, notifications, search), any global filter bar, modals mounted at the root, and the `<router-view>`.
- **The router.** `main.js` or `router/index.js`. List every route and its label. Note any routes not in the nav, and nav links not in the router.
- **Global styles.** Where the base CSS lives (`App.vue` unscoped `<style>`, `style.css`, `main.css`), and whether there are CSS custom properties, Tailwind, a UI library (Vuetify, PrimeVue, Element Plus, Naive UI) or a preprocessor.
- **Layout-coupled CSS.** Search views and components for things that assume a full-width page or a top header: `100vw`, `position: fixed` or `sticky` with a `top:` offset, `calc(100vh - <header height>)`, hard-coded `max-width` containers, and `z-index` values. These break when the content column gets narrower.
- **Component API style.** Note whether components use `<script setup>`, `setup()` returning bindings, or the Options API. Write new components in the style the project already uses.
- **Baseline screenshots.** If the app can run, capture each route at desktop width before changing anything, so you can compare later.

Write down a short inventory before moving on: routes and labels, header utilities, global elements, the styling approach, and risky CSS. Every later step works from it.

### 2. Establish design tokens

Put one set of CSS custom properties on `:root` in the global stylesheet. All new and restyled CSS uses them, so spacing and color stay consistent everywhere. See `references/design-tokens.md` for a ready-made token set and the rules for using it.

- If the project already has a color palette (in `CLAUDE.md` or existing variables), map the tokens onto it rather than inventing a new brand.
- If the project uses Tailwind or a UI library, configure that system's theme instead of adding a parallel token layer.
- Use a 4px spacing scale. Snap any spacing value that is off the scale (13px, 18px, 22px and so on) to the nearest step as you restyle.

### 3. Build the app shell

Create these pieces, following `references/app-shell.md`:

- **`AppSidebar.vue`**: brand, grouped nav items with icons, a collapse toggle, and a footer slot. It is sticky and full height on desktop, and becomes an off-canvas drawer with a scrim under 1024px.
- **`AppTopbar.vue`**: the current page title (from the route), a menu button for mobile, and a slot for utilities on the right.
- **`App.vue`**: becomes a CSS grid with the sidebar column and a main column (top bar, then a scrolling page area holding `<router-view>`).

Rules that matter here, and why:

- **Keep the nav data-driven.** Define one `navItems` array (`to`, `label`, `icon`, optional `exact` and `group`) and render the sidebar from it. Labels keep going through the existing i18n function (`t('nav.x')`) so translations still work.
- **Active state comes from the router.** Use `router-link` and its `exact-active` / `active` classes, or compare against `useRoute().path`. The root route `/` needs exact matching, or it shows as active on every page.
- **Keep existing utilities.** Move the language switcher, profile menu and other header utilities into the top bar's right side. Put rarely used ones in the sidebar footer. Leave their props and events alone.
- **Global filter bars** go directly under the top bar, inside the main column, not across the full window. They stay sticky if they were before.
- **Keep root-level modals** mounted at the root of `App.vue`, outside the grid, so their `position: fixed` overlay still covers the sidebar.
- **Remember the collapsed state** in `localStorage`, wrapped in try/catch. On mobile, close the drawer on route change and on Escape, and lock body scroll while it is open.
- **Icons are inline SVG**: 20px, stroke-based, `currentColor`, `aria-hidden="true"`. Don't add an icon package unless the project already has one, and never use emojis as icons.
- **Accessibility.** Use `<nav aria-label="Primary">` (router-link sets `aria-current="page"` for you). Give icon-only buttons an `aria-label`. Show a visible `:focus-visible` ring. When the sidebar is collapsed, keep labels available via `title` or a tooltip.

### 4. Restyle the views

Apply the same patterns to every page so the app feels like one product:

- **Page header**: an H1 page title, an optional one-line description in muted text, and primary actions on the right. If the top bar already shows the title, either keep the page-level H1 and make the top bar show breadcrumbs or section context, or drop the H1. Don't show the same title twice at the same size.
- **Content width**: fluid with `max-width: var(--content-max)` and page padding `var(--space-8)` (`var(--space-4)` on mobile). Grid and flex children need `min-width: 0` so wide tables and charts scroll inside their card and don't push the layout wider.
- **Cards**: surface background, 1px border, `--radius-lg`, `--shadow-sm`, padding `var(--space-6)`. Pick one card style and use it everywhere.
- **KPI or stat tiles**: label (small, muted, medium weight), value (large, tabular numbers), and delta or goal text (small, status-colored). All tiles align on the same grid.
- **Tables**: sticky header row with a muted background, `--space-3` cell padding, row hover, right-aligned numbers with `font-variant-numeric: tabular-nums`, and a horizontal scroll wrapper.
- **Forms and filters**: inputs and selects 36px tall, `--radius-md`, a border that turns accent-colored on focus, and labels above or inline, applied the same way everywhere.
- **Buttons**: primary (accent fill), secondary (surface with border), ghost (text only). They share the same height, radius and focus ring.
- **Status badges**: soft tinted background with strong text, using the existing green/blue/yellow/red meaning.
- **Charts**: leave the data logic alone. Restyle only colors, gridlines (lighter), axis text (muted, `--text-xs`) and container padding.

Keep the changes to `<template>` and `<style>`. If a script change seems necessary (for example a new computed for the page title), keep it small and say so in your summary.

When a project rule says to delegate `.vue` work to a specialist subagent, give it the token file, the shell spec from `references/app-shell.md`, and a precise list of files and patterns to apply. Then review what comes back.

### 5. Verify like a user

A redesign is done only when it has been seen working.

1. Build: `npm run build` must succeed with no new warnings.
2. Run the dev server and open every route, using the browser tool the project specifies.
3. Check at three widths: about 1440px, about 1024px and 375px. At each one confirm:
   - The sidebar's active item matches the route, and only `/` is active on the home page.
   - The collapse toggle works and is remembered after a reload.
   - On mobile, the drawer opens and closes with the button, the scrim, Escape and navigation.
   - There is no horizontal page scroll (`document.documentElement.scrollWidth <= innerWidth`).
   - Modals open above the sidebar and close as before.
   - Global filters still change the data on each view.
   - Language switching still relabels the nav.
   - The console has no new errors.
4. Compare with the baseline screenshots, and fix anything that was lost, such as a missing nav item, a utility or a badge.
5. Run the project's existing tests if there are any.

## Summary to give the user

End with a short report:

- **Files created and changed**, grouped into shell, tokens and views.
- **Where things moved**: for example, "the language switcher is now in the top bar, and the profile menu is in the sidebar footer".
- **What you verified**, at which widths, and anything you could not check.
- **Follow-ups**, such as views that need deeper redesign or a hard-coded color you left in place.

## Reference files

- `references/design-tokens.md`: the token set (spacing, type, color, radius, shadow, z-index, layout sizes) and the rules for using it. Read it in phase 2.
- `references/app-shell.md`: the `AppSidebar`, `AppTopbar` and `App.vue` shell code with responsive and accessible behavior. Read it in phase 3 and adapt it to the project's component style.
