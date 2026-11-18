export type LocaleCode = 'ar' | 'en'
export type ThemeMode = 'light' | 'dark'
export type AccentPresetKey = 'navy' | 'emerald' | 'burgundy' | 'slate' | 'custom'

export const STORAGE_KEYS = {
  theme: 'resux_hussein_theme',
  accentKey: 'resux_hussein_accent_key',
  customHex: 'resux_hussein_custom_hex'
} as const

export const ACCENT_PRESETS: Record<Exclude<AccentPresetKey, 'custom'>, {
  light: { accent: string; ink: string }
  dark: { accent: string; ink: string }
}> = {
  navy: {
    light: { accent: '#1B365D', ink: '#FFFFFF' },
    dark: { accent: '#60A5FA', ink: '#0B0F17' }
  },
  emerald: {
    light: { accent: '#14532D', ink: '#FFFFFF' },
    dark: { accent: '#34D399', ink: '#0B0F17' }
  },
  burgundy: {
    light: { accent: '#7A2323', ink: '#FFFFFF' },
    dark: { accent: '#F87171', ink: '#0B0F17' }
  },
  slate: {
    light: { accent: '#78572A', ink: '#FFFFFF' },
    dark: { accent: '#FBBF24', ink: '#0B0F17' }
  }
}

export function normalizeLocale(raw: unknown): LocaleCode {
  return String(raw || '').toLowerCase() === 'en' ? 'en' : 'ar'
}

export function readStoredPref(key: string, fallback: string): string {
  try {
    const ls = globalThis.localStorage
    if (!ls) return fallback
    return ls.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function saveStoredPref(key: string, value: string): void {
  try {
    const ls = globalThis.localStorage
    if (ls) ls.setItem(key, value)
  } catch {
    // Ignore storage restrictions
  }
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return [27, 54, 93]
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  return Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b) ? [r, g, b] : [27, 54, 93]
}

function getContrastInk(hex: string): string {
  const [r, g, b] = hexToRgbTuple(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#0F172A' : '#FFFFFF'
}

export function applyThemeAndAccent(theme: ThemeMode, accentKey: AccentPresetKey, customHex: string): void {
  const doc = globalThis.document
  if (!doc) return
  const root = doc.documentElement
  root.setAttribute('data-theme', theme)
  const isDark = theme === 'dark'

  let accent = '#1B365D'
  let ink = '#FFFFFF'

  if (accentKey === 'custom' && customHex) {
    accent = customHex
    ink = getContrastInk(customHex)
  } else {
    const preset = ACCENT_PRESETS[accentKey === 'custom' ? 'navy' : accentKey] ?? ACCENT_PRESETS.navy
    const pal = isDark ? preset.dark : preset.light
    accent = pal.accent
    ink = pal.ink
  }

  const [r, g, b] = hexToRgbTuple(accent)
  root.style.setProperty('--accent', accent)
  root.style.setProperty('--accent-ink', ink)
  root.style.setProperty('--accent-soft', `rgba(${r}, ${g}, ${b}, ${isDark ? 0.18 : 0.10})`)
  root.style.setProperty('--accent-border', `rgba(${r}, ${g}, ${b}, ${isDark ? 0.42 : 0.28})`)
  root.style.setProperty('--secondary', accent)
  root.style.setProperty('--secondary-soft', `rgba(${r}, ${g}, ${b}, ${isDark ? 0.16 : 0.11})`)
  root.style.setProperty('--brass', accent)
  root.style.setProperty('--brass-soft', `rgba(${r}, ${g}, ${b}, ${isDark ? 0.20 : 0.13})`)

  const themeMeta = doc.querySelector('meta[name="theme-color"]')
  if (themeMeta) themeMeta.setAttribute('content', accent)
}

export function showChambersToast(msg: string): void {
  const doc = globalThis.document
  if (!doc) return
  const toast = doc.getElementById('rx-toast')
  const text = doc.getElementById('rx-toast-text')
  if (!toast || !text) return
  text.textContent = msg
  toast.classList.remove('hidden')
  const g = globalThis as Record<string, unknown>
  if (g.__rxToastTimer) clearTimeout(g.__rxToastTimer as ReturnType<typeof setTimeout>)
  g.__rxToastTimer = setTimeout(() => {
    toast.classList.add('hidden')
  }, 3200)
}

export function copyTextToClipboard(text: string, label: string): void {
  const nav = globalThis.navigator
  if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
    nav.clipboard.writeText(text).then(() => showChambersToast(label)).catch(() => fallbackCopy(text, label))
    return
  }
  fallbackCopy(text, label)
}

function fallbackCopy(text: string, label: string): void {
  const doc = globalThis.document
  if (!doc) return
  const ta = doc.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  doc.body.appendChild(ta)
  ta.select()
  try {
    doc.execCommand('copy')
  } catch {
    // Ignore
  }
  doc.body.removeChild(ta)
  showChambersToast(label)
}
