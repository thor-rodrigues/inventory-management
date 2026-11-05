<template>
  <button
    v-if="compact"
    type="button"
    class="theme-cycle"
    :aria-label="`${t('theme.label')}: ${t('theme.' + preference)}`"
    :title="`${t('theme.label')}: ${t('theme.' + preference)}`"
    @click="cycle"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="icons[currentOption.icon]" /></svg>
  </button>

  <div v-else class="theme-toggle" role="group" :aria-label="t('theme.label')">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="theme-toggle__btn"
      :class="{ 'is-active': preference === option.value }"
      :aria-label="t('theme.' + option.value)"
      :title="t('theme.' + option.value)"
      :aria-pressed="preference === option.value"
      @click="setTheme(option.value)"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="icons[option.icon]" /></svg>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { ICONS } from '../navigation'
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

const OPTIONS = [
  { value: 'light', icon: 'sun' },
  { value: 'dark', icon: 'moon' },
  { value: 'system', icon: 'monitor' }
]

export default {
  name: 'ThemeToggle',
  props: {
    compact: { type: Boolean, default: false }
  },
  setup() {
    const { preference, setTheme } = useTheme()
    const { t } = useI18n()

    const currentOption = computed(
      () => OPTIONS.find((o) => o.value === preference.value) || OPTIONS[2]
    )

    // Compact mode: cycle light -> dark -> system -> light.
    const cycle = () => {
      const idx = OPTIONS.findIndex((o) => o.value === preference.value)
      setTheme(OPTIONS[(idx + 1) % OPTIONS.length].value)
    }

    return { t, preference, setTheme, options: OPTIONS, icons: ICONS, currentOption, cycle }
  }
}
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  background: var(--color-surface-muted);
  border-radius: var(--radius-md);
}
.theme-toggle__btn,
.theme-cycle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color var(--duration) var(--ease), color var(--duration) var(--ease);
}
.theme-toggle__btn:hover { color: var(--color-text); }
.theme-toggle__btn.is-active {
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-xs);
}
.theme-cycle {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
}
.theme-cycle:hover { background: var(--color-surface-muted); color: var(--color-text); }
.theme-toggle svg,
.theme-cycle svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
