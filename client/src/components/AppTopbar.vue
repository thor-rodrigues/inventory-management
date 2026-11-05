<template>
  <header class="topbar">
    <button
      type="button"
      class="topbar__menu"
      :aria-label="t('nav.openNavigation')"
      @click="$emit('open-menu')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="menuIcon" /></svg>
    </button>

    <nav v-if="current" class="topbar__crumbs" aria-label="Breadcrumb">
      <span class="topbar__crumb-group">{{ t(current.group.label) }}</span>
      <span class="topbar__sep" aria-hidden="true">/</span>
      <span class="topbar__crumb-page" aria-current="page">{{ t(current.item.label) }}</span>
    </nav>

    <div class="topbar__actions">
      <slot />
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ICONS, findNavItem } from '../navigation'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'AppTopbar',
  emits: ['open-menu'],
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const current = computed(() => findNavItem(route.path))
    return { t, current, menuIcon: ICONS.menu }
  }
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: var(--z-topbar);
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-8);
  background: var(--color-topbar);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}
.topbar__menu {
  display: none;
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
.topbar__menu svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
}
.topbar__menu:hover { background: var(--color-surface-muted); color: var(--color-text); }
.topbar__crumbs {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  font-size: var(--text-sm);
  white-space: nowrap;
}
.topbar__crumb-group { color: var(--color-text-muted); }
.topbar__sep { color: var(--color-text-subtle); }
.topbar__crumb-page {
  color: var(--color-text);
  font-weight: var(--weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
}
.topbar__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
@media (max-width: 1023px) {
  .topbar { padding: 0 var(--space-4); }
  .topbar__menu { display: inline-flex; }
}
@media (max-width: 767px) {
  .topbar__crumb-group,
  .topbar__sep { display: none; }
}
</style>
