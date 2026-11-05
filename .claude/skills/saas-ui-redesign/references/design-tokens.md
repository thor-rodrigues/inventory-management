# Design tokens

Put this block in the app's global stylesheet (unscoped). Before inventing values, map the color tokens onto any palette the project already defines. The neutral values below are Tailwind's slate scale, which suits most data-heavy SaaS apps.

```css
:root {
  /* Spacing: 4px scale. Use these and nothing in between. */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --text-xs: 12px;   --leading-xs: 16px;
  --text-sm: 13px;   --leading-sm: 20px;
  --text-base: 14px; --leading-base: 22px;
  --text-lg: 16px;   --leading-lg: 24px;
  --text-xl: 20px;   --leading-xl: 28px;
  --text-2xl: 24px;  --leading-2xl: 32px;
  --text-3xl: 30px;  --leading-3xl: 36px;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;

  /* Neutrals */
  --color-bg: #f8fafc;            /* app background */
  --color-surface: #ffffff;       /* cards, sidebar, topbar */
  --color-surface-muted: #f1f5f9; /* table headers, hover, inputs at rest */
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-text-subtle: #94a3b8;

  /* Accent (map to the brand when there is one) */
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-soft: #eff6ff;   /* active nav item background */
  --color-accent-text: #1e40af;   /* text on accent-soft */

  /* Status: soft background plus strong text, for badges and deltas */
  --color-success: #16a34a; --color-success-soft: #f0fdf4;
  --color-info: #2563eb;    --color-info-soft: #eff6ff;
  --color-warning: #b45309; --color-warning-soft: #fffbeb;
  --color-danger: #dc2626;  --color-danger-soft: #fef2f2;

  /* Shape and elevation */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-full: 999px;
  --shadow-xs: 0 1px 2px rgb(15 23 42 / 0.04);
  --shadow-sm: 0 1px 2px rgb(15 23 42 / 0.06), 0 1px 3px rgb(15 23 42 / 0.04);
  --shadow-md: 0 4px 12px rgb(15 23 42 / 0.08);
  --shadow-lg: 0 12px 32px rgb(15 23 42 / 0.12);
  --focus-ring: 0 0 0 3px rgb(37 99 235 / 0.35);

  /* Layout */
  --sidebar-w: 248px;
  --sidebar-w-collapsed: 68px;
  --topbar-h: 56px;
  --content-max: 1440px;
  --control-h: 36px;

  /* Layering: modals must sit above the mobile drawer */
  --z-sticky: 20;
  --z-topbar: 30;
  --z-scrim: 40;
  --z-drawer: 50;
  --z-dropdown: 60;
  --z-modal: 100;
  --z-toast: 110;

  --ease: cubic-bezier(0.2, 0, 0, 1);
  --duration: 180ms;
}

html { -webkit-font-smoothing: antialiased; }
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-base);
}
:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: var(--radius-sm); }

@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}
```

## Rules for using the tokens

- **Spacing rhythm:**
  - `--space-2` between tightly related items (icon and label, label and value).
  - `--space-4` between controls in a row.
  - `--space-6` for card padding and gaps in a card grid.
  - `--space-8` between page sections and for page padding.
- **Type hierarchy:**
  - Page title: `--text-2xl` semibold.
  - Section and card title: `--text-lg` semibold.
  - Body: `--text-base`.
  - Labels and meta text: `--text-sm` or `--text-xs`, muted, medium weight.
  - KPI values: `--text-3xl` semibold with `font-variant-numeric: tabular-nums`.
  - Use at most three sizes per card.
- **Color restraint:**
  - Use the accent only for primary actions, the active nav item, links and focus.
  - Status colors carry meaning (good, info, caution, bad). Don't use them for decoration.
  - Everything else is neutral.
- **Borders before shadows:**
  - Cards get a 1px `--color-border` and `--shadow-xs` or `--shadow-sm`.
  - Save `--shadow-md` and `--shadow-lg` for floating things: dropdowns, popovers and modals.
- **Modal z-index:** check that existing modals use a value at or above `--z-modal`. If they use something like `z-index: 1000`, that already works. If they use something small, like 10, raise it, or the mobile drawer will cover them.
- **Dark mode:** add it only if the app already supports themes or the user asks. If you add it, redefine the color tokens under `@media (prefers-color-scheme: dark)` (or a `[data-theme="dark"]` selector) and keep the spacing and shape tokens the same.
- **Replace hard-coded values as you go:** a `#64748b` in a view becomes `var(--color-text-muted)`, and `padding: 18px` becomes `var(--space-5)` or `var(--space-4)`. Leave chart data colors alone unless they clash.
