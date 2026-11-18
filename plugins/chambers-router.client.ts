import {
  STORAGE_KEYS,
  applyThemeAndAccent,
  readStoredPref
} from '@/composables/browserHelpers'

function normalizeCleanPath(pathname: string): string {
  const raw = String(pathname || '/')
  const stripped = raw.replace(/^\/en(?=\/|$)/, '') || '/'
  return stripped.length > 1 && stripped.endsWith('/') ? stripped.slice(0, -1) : stripped
}

function syncNavigationAndPreferences() {
  if (typeof document === 'undefined' || typeof location === 'undefined') return

  const currentPath = location.pathname || '/'
  const isEnglish = currentPath === '/en' || currentPath.startsWith('/en/')
  const clean = normalizeCleanPath(currentPath)

  // Keep desktop active navigation pill synchronized during persistent-layout soft navigation
  const nav = document.getElementById('primary-desktop-nav')
  if (nav) {
    const links = nav.querySelectorAll('a[href]')
    for (const link of links) {
      const href = link.getAttribute('href') || '/'
      const linkClean = normalizeCleanPath(href)
      if (linkClean === clean) {
        link.classList.add('rx-nav-active')
      } else {
        link.classList.remove('rx-nav-active')
      }
    }
  }

  // Keep language switch link pointed to the current route in the opposite locale
  const langSwitch = document.getElementById('btn-lang-switch')
  if (langSwitch) {
    const targetHref = isEnglish
      ? clean
      : (clean === '/' ? '/en' : `/en${clean}`)
    langSwitch.setAttribute('href', targetHref)
  }

  // Preserve saved theme & dynamic accent palette across soft transitions & locale switches
  const savedTheme = readStoredPref(STORAGE_KEYS.theme, 'light') === 'dark' ? 'dark' : 'light'
  const savedAccent = readStoredPref(STORAGE_KEYS.accentKey, 'navy') as 'navy' | 'emerald' | 'burgundy' | 'slate' | 'custom'
  const savedHex = readStoredPref(STORAGE_KEYS.customHex, '#1B365D')
  applyThemeAndAccent(savedTheme, savedAccent, savedHex)

  const themeLabel = document.getElementById('btn-theme-text')
  if (themeLabel) {
    themeLabel.textContent = isEnglish
      ? (savedTheme === 'light' ? 'Dark Mode' : 'Light Mode')
      : (savedTheme === 'light' ? 'المظهر الداكن' : 'المظهر الفاتح')
  }
}

export default defineResuxPlugin(() => {
  if (typeof window === 'undefined') return
  const guardKey = '__ALHUSSEIN_CHAMBERS_ROUTER_SYNC__'
  if ((globalThis as Record<string, unknown>)[guardKey]) return
  ;(globalThis as Record<string, unknown>)[guardKey] = true

  // Initial theme, accent, and active nav state are already set by SSR + inline head script.
  // Re-sync only after client-side soft transitions to avoid initial forced reflow.
  window.addEventListener('resux:route-transition', (event: Event) => {
    const detail = (event as CustomEvent<{ state?: string }>)?.detail
    if (detail?.state === 'complete') {
      syncNavigationAndPreferences()
    }
  })
})
