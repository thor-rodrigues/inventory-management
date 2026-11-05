<template>
  <aside
    class="sidebar"
    :class="{ 'is-collapsed': collapsed, 'is-open': mobileOpen }"
  >
    <div class="sidebar__brand">
      <span class="sidebar__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path :d="icons.box" /></svg>
      </span>
      <div v-if="!collapsed || mobileOpen" class="sidebar__brand-text">
        <span class="sidebar__company">{{ t('nav.companyName') }}</span>
        <span class="sidebar__subtitle">{{ t('nav.subtitle') }}</span>
      </div>
      <button
        type="button"
        class="sidebar__close"
        :aria-label="t('nav.closeNavigation')"
        @click="$emit('close')"
      >
        <svg class="sidebar__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>

    <nav class="sidebar__nav" :aria-label="t('nav.primaryNavigation')">
      <div v-for="group in groups" :key="group.label" class="sidebar__group">
        <p class="sidebar__group-label">{{ t(group.label) }}</p>
        <router-link
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="sidebar__link"
          :class="{ 'is-active': isActive(item) }"
          :title="collapsed ? t(item.label) : undefined"
          :aria-current="isActive(item) ? 'page' : undefined"
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
      <ThemeToggle :compact="collapsed && !mobileOpen" />
      <button
        type="button"
        class="sidebar__collapse"
        :aria-label="collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
        :title="collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')"
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
import { useI18n } from '../composables/useI18n'
import ThemeToggle from './ThemeToggle.vue'

export default {
  name: 'AppSidebar',
  components: { ThemeToggle },
  props: {
    groups: { type: Array, required: true },
    collapsed: { type: Boolean, default: false },
    mobileOpen: { type: Boolean, default: false }
  },
  emits: ['toggle-collapse', 'navigate', 'close'],
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    // Root needs an exact match; other items also match their sub-routes.
    const isActive = (item) =>
      item.exact
        ? route.path === item.to
        : route.path === item.to || route.path.startsWith(item.to + '/')
    return { t, isActive, icons: ICONS }
  }
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
  gap: var(--space-3);
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}
.sidebar__mark {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: var(--color-on-accent);
}
.sidebar__mark svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sidebar__brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.sidebar__company {
  font-size: var(--text-sm);
  line-height: var(--leading-xs);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sidebar__subtitle {
  font-size: var(--text-xs);
  line-height: var(--leading-xs);
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sidebar__close {
  display: none;
  margin-left: auto;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}
.sidebar__close:hover { background: var(--color-surface-muted); color: var(--color-text); }

.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4) var(--space-3);
}
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
  height: var(--control-h);
  padding: 0 var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  text-decoration: none;
  white-space: nowrap;
  transition: background-color var(--duration) var(--ease), color var(--duration) var(--ease);
}
.sidebar__link + .sidebar__link { margin-top: 2px; }
.sidebar__link:hover { background: var(--color-surface-muted); color: var(--color-text); }
.sidebar__link.is-active {
  background: var(--color-accent-soft);
  color: var(--color-accent-text);
  font-weight: var(--weight-semibold);
}
.sidebar__label { overflow: hidden; text-overflow: ellipsis; }
.sidebar__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sidebar__footer {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}
.sidebar__collapse {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}
.sidebar__collapse:hover { background: var(--color-surface-muted); color: var(--color-text); }

/* Collapsed (desktop only): icons only; footer stacks vertically to fit 68px */
.sidebar.is-collapsed .sidebar__brand { justify-content: center; padding: 0; }
.sidebar.is-collapsed .sidebar__label,
.sidebar.is-collapsed .sidebar__group-label { display: none; }
.sidebar.is-collapsed .sidebar__link { justify-content: center; padding: 0; }
.sidebar.is-collapsed .sidebar__collapse { margin: 0; transform: rotate(180deg); }
.sidebar.is-collapsed .sidebar__footer { flex-direction: column; }
.sidebar.is-collapsed .sidebar__group + .sidebar__group {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
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
  .sidebar__close { display: inline-flex; }
  .sidebar__collapse { display: none; }
  /* Collapse does not apply in drawer mode: always show labels */
  .sidebar.is-collapsed .sidebar__brand { justify-content: flex-start; padding: 0 var(--space-4); }
  .sidebar.is-collapsed .sidebar__label,
  .sidebar.is-collapsed .sidebar__group-label { display: revert; }
  .sidebar.is-collapsed .sidebar__link { justify-content: flex-start; padding: 0 var(--space-3); }
  .sidebar.is-collapsed .sidebar__footer { flex-direction: row; }
  .sidebar.is-collapsed .sidebar__group + .sidebar__group { margin-top: var(--space-6); padding-top: 0; border-top: 0; }
}
</style>
