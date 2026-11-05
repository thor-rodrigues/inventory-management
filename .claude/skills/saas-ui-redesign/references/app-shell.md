# App shell reference

A working shell for Vue 3 and vue-router 4: a sidebar, a top bar and the `App.vue` layout. The code is written with `setup()` returning bindings. If the project uses `<script setup>` or the Options API, convert it to match. Read the existing shell first and carry over its utilities, modals and global elements. Don't drop any of them.

## Contents

1. Nav items
2. `AppSidebar.vue`
3. `AppTopbar.vue`
4. `App.vue` layout
5. Common pitfalls

---

## 1. Nav items

Define the items once, in `App.vue` or `src/navigation.js`. Icons are SVG path data for a 24x24, stroke-based icon (Lucide or Feather style, drawn inline).

```js
// src/navigation.js
export const ICONS = {
  home:      'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  box:       'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  cart:      'M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h7.7a2 2 0 0 0 2-1.6L21 8H6M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  wallet:    'M3 7a2 2 0 0 1 2-2h14v4M3 7v10a2 2 0 0 0 2 2h16V9H5a2 2 0 0 1-2-2zM17 14h.01',
  trend:     'M3 17l6-6 4 4 8-8M15 7h6v6',
  file:      'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6',
  chevronsLeft: 'M11 17l-5-5 5-5M18 17l-5-5 5-5',
  menu:      'M4 6h16M4 12h16M4 18h16',
}

// Labels are i18n keys when the app has i18n; resolve them with t() at render time.
export const NAV_GROUPS = [
  {
    label: 'nav.groupMain',          // optional group heading; omit for a single flat list
    items: [
      { to: '/',          label: 'nav.overview',  icon: 'home', exact: true },
      { to: '/inventory', label: 'nav.inventory', icon: 'box' },
      { to: '/orders',    label: 'nav.orders',    icon: 'cart' },
    ],
  },
  {
    label: 'nav.groupInsights',
    items: [
      { to: '/spending', label: 'nav.finance',        icon: 'wallet' },
      { to: '/demand',   label: 'nav.demandForecast', icon: 'trend' },
      { to: '/reports',  label: 'nav.reports',        icon: 'file' },
    ],
  },
]
```

If a label isn't an i18n key yet, for example a hard-coded `Reports`, add the key to every locale file. Don't leave one item untranslated.

## 2. `AppSidebar.vue`

```vue
<template>
  <aside
    class="sidebar"
    :class="{ 'is-collapsed': collapsed, 'is-open': mobileOpen }"
  >
    <div class="sidebar__brand">
      <slot name="brand" />
    </div>

    <nav class="sidebar__nav" aria-label="Primary">
      <div v-for="group in groups" :key="group.label || 'main'" class="sidebar__group">
        <p v-if="group.label && !collapsed" class="sidebar__group-label">{{ t(group.label) }}</p>
        <router-link
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="sidebar__link"
          :class="{ 'is-active': isActive(item) }"
          :title="collapsed ? t(item.label) : undefined"
          @click="$emit('navigate')"
        >
          <svg class="sidebar__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="icons[item.icon]" />
          </svg>
          <span class="sidebar__label">{{ t(item.label) }}</span>
        </router-link>
      </div>
    </nav>

    <div class="sidebar__footer">
      <slot name="footer" :collapsed="collapsed" />
      <button
        type="button"
        class="sidebar__collapse"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="!collapsed"
        @click="$emit('toggle-collapse')"
      >
        <svg class="sidebar__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="icons.chevronsLeft" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script>
import { useRoute } from 'vue-router'
import { ICONS } from '../navigation'
import { useI18n } from '../composables/useI18n' // use the project's existing i18n; drop if none

export default {
  name: 'AppSidebar',
  props: {
    groups: { type: Array, required: true },
    collapsed: { type: Boolean, default: false },
    mobileOpen: { type: Boolean, default: false },
  },
  emits: ['toggle-collapse', 'navigate'],
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    // Root needs exact match; others match their sub-routes too (/orders/123).
    const isActive = (item) =>
      item.exact ? route.path === item.to : route.path === item.to || route.path.startsWith(item.to + '/')
    return { t, isActive, icons: ICONS }
  },
}
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  overflow: hidden;
}
.sidebar__brand {
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}
.sidebar__nav { flex: 1; overflow-y: auto; padding: var(--space-4) var(--space-3); }
.sidebar__group + .sidebar__group { margin-top: var(--space-6); }
.sidebar__group-label {
  margin: 0 0 var(--space-2);
  padding: 0 var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}
.sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 36px;
  padding: 0 var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  text-decoration: none;
  white-space: nowrap;
  transition: background var(--duration) var(--ease), color var(--duration) var(--ease);
}
.sidebar__link + .sidebar__link { margin-top: 2px; }
.sidebar__link:hover { background: var(--color-surface-muted); color: var(--color-text); }
.sidebar__link.is-active { background: var(--color-accent-soft); color: var(--color-accent-text); }
.sidebar__icon {
  width: 20px; height: 20px; flex-shrink: 0;
  fill: none; stroke: currentColor; stroke-width: 1.75;
  stroke-linecap: round; stroke-linejoin: round;
}
.sidebar__footer {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3);
  border-top: 1px solid var(--color-border);
}
.sidebar__collapse {
  margin-left: auto;
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border: 0; border-radius: var(--radius-md);
  background: transparent; color: var(--color-text-muted); cursor: pointer;
}
.sidebar__collapse:hover { background: var(--color-surface-muted); color: var(--color-text); }

/* Collapsed (desktop only) */
.sidebar.is-collapsed .sidebar__label,
.sidebar.is-collapsed .sidebar__group-label { display: none; }
.sidebar.is-collapsed .sidebar__link { justify-content: center; padding: 0; }
.sidebar.is-collapsed .sidebar__collapse { margin: 0 auto; transform: rotate(180deg); }
.sidebar.is-collapsed .sidebar__group + .sidebar__group {
  margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--color-border);
}

/* Mobile drawer */
@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--sidebar-w);
    z-index: var(--z-drawer);
    transform: translateX(-100%);
    transition: transform var(--duration) var(--ease);
    box-shadow: var(--shadow-lg);
  }
  .sidebar.is-open { transform: none; }
  /* Collapse does not apply in drawer mode */
  .sidebar.is-collapsed .sidebar__label,
  .sidebar.is-collapsed .sidebar__group-label { display: revert; }
  .sidebar.is-collapsed .sidebar__link { justify-content: flex-start; padding: 0 var(--space-3); }
  .sidebar__collapse { display: none; }
}
</style>
```

## 3. `AppTopbar.vue`

```vue
<template>
  <header class="topbar">
    <button type="button" class="topbar__menu" aria-label="Open navigation" @click="$emit('open-menu')">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="menuIcon" /></svg>
    </button>
    <div class="topbar__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="topbar__actions">
      <slot />
    </div>
  </header>
</template>

<script>
import { ICONS } from '../navigation'

export default {
  name: 'AppTopbar',
  props: { title: { type: String, default: '' } },
  emits: ['open-menu'],
  setup() {
    return { menuIcon: ICONS.menu }
  },
}
</script>

<style scoped>
.topbar {
  position: sticky; top: 0; z-index: var(--z-topbar);
  height: var(--topbar-h);
  display: flex; align-items: center; gap: var(--space-4);
  padding: 0 var(--space-8);
  background: rgb(255 255 255 / 0.85);
  backdrop-filter: saturate(180%) blur(8px);
  border-bottom: 1px solid var(--color-border);
}
.topbar__title { font-size: var(--text-lg); font-weight: var(--weight-semibold); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.topbar__actions { margin-left: auto; display: flex; align-items: center; gap: var(--space-3); }
.topbar__menu {
  display: none;
  width: 36px; height: 36px; border: 0; border-radius: var(--radius-md);
  background: transparent; color: var(--color-text-muted); cursor: pointer;
  align-items: center; justify-content: center;
}
.topbar__menu svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; }
.topbar__menu:hover { background: var(--color-surface-muted); }
@media (max-width: 1023px) {
  .topbar { padding: 0 var(--space-4); }
  .topbar__menu { display: inline-flex; }
}
</style>
```

## 4. `App.vue` layout

Keep every global element the old shell had: filter bar, utilities, modals and their handlers. Only their position changes.

```vue
<template>
  <div class="app-shell" :class="{ 'is-collapsed': collapsed }">
    <AppSidebar
      :groups="navGroups"
      :collapsed="collapsed"
      :mobile-open="mobileOpen"
      @toggle-collapse="toggleCollapse"
      @navigate="mobileOpen = false"
    >
      <template #brand>
        <!-- existing logo / company name markup, restyled -->
      </template>
      <template #footer>
        <!-- optional: rarely used utilities -->
      </template>
    </AppSidebar>

    <div v-if="mobileOpen" class="app-scrim" @click="mobileOpen = false" />

    <div class="app-main">
      <AppTopbar :title="pageTitle" @open-menu="mobileOpen = true">
        <!-- existing header utilities, unchanged props/events -->
        <LanguageSwitcher />
        <ProfileMenu @show-profile-details="showProfileDetails = true" @show-tasks="showTasks = true" />
      </AppTopbar>

      <!-- existing global filter bar, if any -->
      <FilterBar />

      <main class="app-page">
        <router-view />
      </main>
    </div>

    <!-- existing root-level modals stay here, outside the grid -->
  </div>
</template>

<script>
// inside the existing setup(): add these, keep everything already there
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { NAV_GROUPS } from './navigation'

const STORAGE_KEY = 'sidebar-collapsed'
const readCollapsed = () => { try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false } }

// setup() {
const route = useRoute()
const navGroups = NAV_GROUPS
const collapsed = ref(readCollapsed())
const mobileOpen = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  try { localStorage.setItem(STORAGE_KEY, collapsed.value ? '1' : '0') } catch { /* storage unavailable */ }
}

// Title comes from the matching nav item, so it stays translated.
const pageTitle = computed(() => {
  const items = NAV_GROUPS.flatMap(g => g.items)
  const match = items.find(i => i.exact ? route.path === i.to : route.path.startsWith(i.to) && i.to !== '/')
    || items.find(i => i.to === route.path)
  return match ? t(match.label) : ''
})

watch(() => route.fullPath, () => { mobileOpen.value = false })
watch(mobileOpen, open => { document.body.style.overflow = open ? 'hidden' : '' })

const onKey = (e) => { if (e.key === 'Escape') mobileOpen.value = false }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
// return { navGroups, collapsed, mobileOpen, toggleCollapse, pageTitle, ...existing }
</script>

<style>
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
  min-height: 100vh;
  transition: grid-template-columns var(--duration) var(--ease);
}
.app-shell.is-collapsed { grid-template-columns: var(--sidebar-w-collapsed) minmax(0, 1fr); }
.app-main { min-width: 0; display: flex; flex-direction: column; }
.app-page {
  flex: 1;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--space-8);
  box-sizing: border-box;
}
.app-scrim { display: none; }

@media (max-width: 1023px) {
  .app-shell, .app-shell.is-collapsed { grid-template-columns: minmax(0, 1fr); }
  .app-scrim {
    display: block; position: fixed; inset: 0;
    background: rgb(15 23 42 / 0.4);
    z-index: var(--z-scrim);
  }
  .app-page { padding: var(--space-4); }
}
</style>
```

### Shared page patterns

Add these to the global stylesheet so every view can use them without duplicating scoped CSS:

```css
.page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-8); }
.page-header h1 { margin: 0; font-size: var(--text-2xl); line-height: var(--leading-2xl); font-weight: var(--weight-semibold); }
.page-header p { margin: var(--space-1) 0 0; color: var(--color-text-muted); }

.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-xs); padding: var(--space-6); min-width: 0; }
.card-title { margin: 0 0 var(--space-4); font-size: var(--text-lg); font-weight: var(--weight-semibold); }

.grid { display: grid; gap: var(--space-6); }
.grid-kpi { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); }

.table-wrap { overflow-x: auto; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
.table-wrap table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.table-wrap th { position: sticky; top: 0; background: var(--color-surface-muted); color: var(--color-text-muted); font-weight: var(--weight-medium); text-align: left; }
.table-wrap th, .table-wrap td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--color-border); }
.table-wrap tbody tr:hover { background: var(--color-surface-muted); }
.num { text-align: right; font-variant-numeric: tabular-nums; }

.badge { display: inline-flex; align-items: center; height: 22px; padding: 0 var(--space-2); border-radius: var(--radius-full); font-size: var(--text-xs); font-weight: var(--weight-medium); }
.badge-success { background: var(--color-success-soft); color: var(--color-success); }
.badge-info    { background: var(--color-info-soft);    color: var(--color-info); }
.badge-warning { background: var(--color-warning-soft); color: var(--color-warning); }
.badge-danger  { background: var(--color-danger-soft);  color: var(--color-danger); }

.btn { display: inline-flex; align-items: center; gap: var(--space-2); height: var(--control-h); padding: 0 var(--space-4); border-radius: var(--radius-md); font: inherit; font-size: var(--text-sm); font-weight: var(--weight-medium); cursor: pointer; border: 1px solid transparent; }
.btn-primary { background: var(--color-accent); color: #fff; }
.btn-primary:hover { background: var(--color-accent-hover); }
.btn-secondary { background: var(--color-surface); color: var(--color-text); border-color: var(--color-border); }
.btn-secondary:hover { background: var(--color-surface-muted); }
.btn-ghost { background: transparent; color: var(--color-text-muted); }
.btn-ghost:hover { background: var(--color-surface-muted); color: var(--color-text); }

.input, select.input { height: var(--control-h); padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); font: inherit; font-size: var(--text-sm); color: var(--color-text); }
.input:focus { outline: none; border-color: var(--color-accent); box-shadow: var(--focus-ring); }
```

Before adding these, check for name clashes. If views already define `.card` or `.badge` in scoped styles, either fold those into the global pattern and delete the local copy, or use prefixed names (`.ui-card`). Don't leave two competing definitions.

## 5. Common pitfalls

- **Home always active.** You compared `startsWith('/')` for the root. Use exact matching for `/`.
- **Content pushes past the viewport.** A child of the grid or flex container is missing `min-width: 0`. Wide tables and SVG charts need it at every level, plus a scroll wrapper.
- **Sticky elements offset wrong.** Old styles set `top: 64px` for an old header height. Change them to `top: var(--topbar-h)`, or `top: 0` inside the scroll container.
- **Modal hidden behind the drawer.** The modal's z-index is lower than `--z-drawer`. Raise it.
- **Collapsed sidebar flickers on reload.** You read localStorage after mount. Read it when the ref is created, as shown above.
- **The title shows twice.** The top bar title and the page H1 say the same thing at a similar size. Keep one at full size, or make the top bar show breadcrumbs.
- **Untranslated new strings.** New labels (group headings, "Collapse sidebar") must go through the project's i18n when it has one.
