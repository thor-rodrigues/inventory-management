import { ref, computed } from 'vue'

// Theme preference: 'light' | 'dark' | 'system'. Shared across the app (module-level state).
const STORAGE_KEY = 'app-theme'
const VALID = ['light', 'dark', 'system']

const readPreference = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return VALID.includes(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

const media = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null

const preference = ref(readPreference())
const systemPrefersDark = ref(media ? media.matches : false)

// 'system' resolves to whatever the OS reports right now.
const resolvedTheme = computed(() => {
  if (preference.value === 'system') return systemPrefersDark.value ? 'dark' : 'light'
  return preference.value
})

const applyTheme = () => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', resolvedTheme.value)
}

// Follow OS changes live while the preference is 'system'.
if (media) {
  const onChange = (e) => {
    systemPrefersDark.value = e.matches
    applyTheme()
  }
  if (media.addEventListener) media.addEventListener('change', onChange)
  else if (media.addListener) media.addListener(onChange)
}

applyTheme()

export function useTheme() {
  const setTheme = (value) => {
    if (!VALID.includes(value)) return
    preference.value = value
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* storage unavailable: preference still applies for this session */
    }
    applyTheme()
  }

  return {
    preference,
    resolvedTheme,
    isDark: computed(() => resolvedTheme.value === 'dark'),
    setTheme
  }
}
