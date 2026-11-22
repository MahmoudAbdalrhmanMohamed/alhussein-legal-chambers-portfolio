<script setup lang="ts">
import { HUSSEIN_DATA } from '../composables/portfolioContent'
import { buildIndexItems } from '../composables/useQuickIndex'
import {
  ACCENT_PRESETS,
  STORAGE_KEYS,
  applyThemeAndAccent,
  normalizeLocale,
  readStoredPref,
  saveStoredPref,
  showChambersToast
} from '../composables/browserHelpers'

const route = useRoute()
const i18n = useI18n()
const runtimeConfig = useRuntimeConfig()

const lang = computed(() => normalizeLocale(i18n.locale.value))
const profile = computed(() => HUSSEIN_DATA[lang.value])
const cleanPath = computed(() => {
  const raw = String(route.path || '/')
  const stripped = raw.replace(/^\/en(?=\/|$)/, '') || '/'
  return stripped.length > 1 && stripped.endsWith('/') ? stripped.slice(0, -1) : stripped
})
const siteUrl = String(runtimeConfig?.public?.siteUrl || '')
const ogImageUrl = `${siteUrl}${lang.value === 'en' ? '/og-en.png' : '/og-ar.png'}`
const ogAlt = lang.value === 'en'
  ? 'Al Hussein Mohamed Abdallah — Legal Researcher & Junior Legal Associate, Egyptian Bar Association'
  : 'الأستاذ الحسين محمد عبدالله — باحث قانوني ومحامٍ متدرب، عضو نقابة المحامين المصرية'
const arAlternateUrl = `${siteUrl}${cleanPath.value}`
const enAlternateUrl = `${siteUrl}${cleanPath.value === '/' ? '/en' : `/en${cleanPath.value}`}`
const canonicalUrl = lang.value === 'en' ? enAlternateUrl : arAlternateUrl

useHead({
  link: [
    { rel: 'alternate', type: 'text/plain', title: 'LLMs Dossier', href: `${siteUrl}/llms.txt` },
    { rel: 'alternate', type: 'application/json', title: 'Structured Legal Dossier API', href: `${siteUrl}/api/dossier` },
    { rel: 'modulepreload', href: '/__resux/handlers/m3.mjs' }
  ]
})

useSeoMeta({
  ogSiteName: lang.value === 'en'
    ? 'Al Hussein Mohamed Abdallah | Legal Portfolio'
    : 'الحسين محمد عبدالله | الملف القانوني الرسمي',
  ogLocale: lang.value === 'en' ? 'en_US' : 'ar_EG',
  ogImage: ogImageUrl,
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: ogAlt,
  ogUrl: siteUrl ? canonicalUrl : undefined,
  twitterImage: ogImageUrl,
  twitterImageAlt: ogAlt
})

const overviewHref = computed(() => i18n.localePath('/'))
const officesHref = computed(() => i18n.localePath('/offices'))
const proceduresHref = computed(() => i18n.localePath('/procedures'))
const faqHref = computed(() => i18n.localePath('/faq'))
const cvHref = computed(() => i18n.localePath('/cv'))
const contactHref = computed(() => i18n.localePath('/contact'))
const switchLangHref = computed(() => i18n.switchLocalePath(lang.value === 'ar' ? 'en' : 'ar'))

const theme = ref<'light' | 'dark'>('light')
const accentKey = ref<'navy' | 'emerald' | 'burgundy' | 'slate' | 'custom'>('navy')
const customHex = ref('#1B365D')
const mobileDrawerOpen = ref(false)
const commandModalOpen = ref(false)
const searchQuery = ref('')
const activeCategory = ref<'ALL' | 'pages' | 'offices' | 'dockets' | 'procedures' | 'faq' | 'contact'>('ALL')
const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref('')
const focusedIndex = ref(0)

const allIndexItems = computed(() => buildIndexItems((lang.value as any) || 'ar'))

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const cat = activeCategory.value
  let list = allIndexItems.value

  if (cat !== 'ALL') {
    list = list.filter((item) => item.category === cat)
  }

  if (!query) {
    return list
  }

  return list.filter((item) => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      (item.badge && item.badge.toLowerCase().includes(query)) ||
      (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(query)))
    )
  })
})

const resultsCount = computed(() => filteredItems.value.length)
const isEmpty = computed(() => !isLoading.value && !isError.value && resultsCount.value === 0)

function selectAccent(nextKey: 'navy' | 'emerald' | 'burgundy' | 'slate') {
  accentKey.value = nextKey
  customHex.value = ACCENT_PRESETS[nextKey].light.accent
  saveStoredPref(STORAGE_KEYS.accentKey, nextKey)
  const currentTheme = readStoredPref(STORAGE_KEYS.theme, theme.value) === 'dark' ? 'dark' : 'light'
  theme.value = currentTheme
  applyThemeAndAccent(currentTheme, nextKey, customHex.value)
  showChambersToast(lang.value === 'ar' ? 'تم تحديث لون الموقع وحفظه تلقائياً' : 'Theme accent color updated and saved')
}

function onCustomColorInput(event: any) {
  const target = event?.target
  const hex = target?.value || ''
  if (!hex) return
  accentKey.value = 'custom'
  customHex.value = hex
  saveStoredPref(STORAGE_KEYS.accentKey, 'custom')
  saveStoredPref(STORAGE_KEYS.customHex, hex)
  const currentTheme = readStoredPref(STORAGE_KEYS.theme, theme.value) === 'dark' ? 'dark' : 'light'
  theme.value = currentTheme
  applyThemeAndAccent(currentTheme, 'custom', hex)
}

function toggleTheme() {
  const current = readStoredPref(STORAGE_KEYS.theme, theme.value) === 'dark' ? 'dark' : 'light'
  const next = current === 'light' ? 'dark' : 'light'
  theme.value = next
  const savedAccent = readStoredPref(STORAGE_KEYS.accentKey, accentKey.value) as 'navy' | 'emerald' | 'burgundy' | 'slate' | 'custom'
  const savedHex = readStoredPref(STORAGE_KEYS.customHex, customHex.value)
  accentKey.value = savedAccent
  customHex.value = savedHex
  saveStoredPref(STORAGE_KEYS.theme, next)
  applyThemeAndAccent(next, savedAccent, savedHex)
  showChambersToast(
    lang.value === 'ar'
      ? (next === 'light' ? 'تم تفعيل المظهر الفاتح' : 'تم تفعيل المظهر الداكن')
      : (next === 'light' ? 'Switched to Light Mode' : 'Switched to Dark Mode')
  )
}

function toggleMobileMenu() {
  mobileDrawerOpen.value = !mobileDrawerOpen.value
}

function closeMobileMenu() {
  mobileDrawerOpen.value = false
}

function openCommandModal() {
  commandModalOpen.value = true
  isLoading.value = false
  focusedIndex.value = 0
}

function closeCommandModal() {
  commandModalOpen.value = false
  searchQuery.value = ''
  activeCategory.value = 'ALL'
  focusedIndex.value = 0
}

function onCmdBackdropClick(event: any) {
  if (event && event.target === event.currentTarget) {
    closeCommandModal()
  }
}

function onCmdPanelClick(event: any) {
  if (event && event.stopPropagation) {
    event.stopPropagation()
  }
}

function onCmdRetry() {
  isError.value = false
  isLoading.value = false
  focusedIndex.value = 0
}

function onCmdClearSearch() {
  searchQuery.value = ''
  focusedIndex.value = 0
}

function onCmdSelectCat(cat: 'ALL' | 'pages' | 'offices' | 'dockets' | 'procedures' | 'faq' | 'contact') {
  activeCategory.value = cat
  focusedIndex.value = 0
}

function onCmdSearchInput(event: any) {
  const target = event?.target
  searchQuery.value = target ? target.value : ''
  focusedIndex.value = 0
}

function isSpecialCmdLink(href: string) {
  return href.startsWith('tel:') || href.startsWith('mailto:') || href.endsWith('.pdf')
}

function onMobileQuickIndexClick() {
  closeMobileMenu()
  openCommandModal()
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:px-4 focus:py-2 focus:rx-btn-primary focus:text-xs focus:font-bold"
    >
      {{ lang === 'ar' ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content' }}
    </a>

    <!-- Clean Top Credentials & Preferences Bar -->
    <div class="no-print border-b rx-divider bg-[var(--surface)] px-4 sm:px-8 py-2 text-xs">
      <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rx-badge-accent font-bold">
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18M3 7h18M6 7l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" /></svg>
            <span>{{ profile.topBadge }}</span>
          </span>
          <a href="tel:01040542354" class="inline-flex items-center gap-1.5 px-2.5 py-1 rx-badge font-mono-code text-[11px] hover:border-[var(--accent)] transition-colors">
            <svg class="w-3.5 h-3.5 text-[var(--accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            <span class="ltr-num font-semibold">01040542354</span>
          </a>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border rx-divider bg-[var(--surface-alt)]" role="group" :aria-label="lang === 'ar' ? 'اختيار لون الموقع' : 'Theme Color Picker'">
            <span class="text-[11px] font-semibold text-[var(--ink-muted)] me-1 hidden sm:inline">{{ profile.colorPickerLabel }}</span>
            <button
              id="swatch-navy"
              type="button"
              :aria-label="lang === 'ar' ? 'كحلي قضائي' : 'Judicial Navy'"
              :title="lang === 'ar' ? 'كحلي قضائي' : 'Judicial Navy'"
              :class="accentKey === 'navy' ? 'swatch-dot active-swatch' : 'swatch-dot'"
              style="background-color: #1B365D;"
              @click="selectAccent('navy')"
            />
            <button
              id="swatch-emerald"
              type="button"
              :aria-label="lang === 'ar' ? 'أخضر نقابي' : 'Bar Emerald'"
              :title="lang === 'ar' ? 'أخضر نقابي' : 'Bar Emerald'"
              :class="accentKey === 'emerald' ? 'swatch-dot active-swatch' : 'swatch-dot'"
              style="background-color: #14532D;"
              @click="selectAccent('emerald')"
            />
            <button
              id="swatch-burgundy"
              type="button"
              :aria-label="lang === 'ar' ? 'عنابي كلاسيكي' : 'Royal Burgundy'"
              :title="lang === 'ar' ? 'عنابي كلاسيكي' : 'Royal Burgundy'"
              :class="accentKey === 'burgundy' ? 'swatch-dot active-swatch' : 'swatch-dot'"
              style="background-color: #7A2323;"
              @click="selectAccent('burgundy')"
            />
            <button
              id="swatch-slate"
              type="button"
              :aria-label="lang === 'ar' ? 'ذهبي برونزي' : 'Antique Bronze'"
              :title="lang === 'ar' ? 'ذهبي برونزي' : 'Antique Bronze'"
              :class="accentKey === 'slate' ? 'swatch-dot active-swatch' : 'swatch-dot'"
              style="background-color: #78572A;"
              @click="selectAccent('slate')"
            />
            <input
              id="custom-color-input"
              type="color"
              :value="customHex"
              :aria-label="lang === 'ar' ? 'اختر لوناً مخصصاً' : 'Custom Color Picker'"
              :title="lang === 'ar' ? 'اختر لوناً مخصصاً' : 'Custom Color Picker'"
              class="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
              @input="onCustomColorInput"
            >
          </div>

          <ResuxLink
            id="btn-lang-switch"
            :to="switchLangHref"
            view-transition
            class="px-3 py-1.5 text-xs font-bold rx-btn-primary inline-flex items-center gap-1.5"
            :title="lang === 'ar' ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'"
          >
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            <span>{{ lang === 'ar' ? 'English' : 'العربية' }}</span>
          </ResuxLink>

          <button
            type="button"
            class="px-2.5 py-1.5 text-xs font-semibold rx-btn-outline inline-flex items-center gap-1.5"
            :title="lang === 'ar' ? 'تبديل المظهر' : 'Switch Theme'"
            @click="toggleTheme"
          >
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            <span id="btn-theme-text">{{ lang === 'ar' ? (theme === 'light' ? 'المظهر الداكن' : 'المظهر الفاتح') : (theme === 'light' ? 'Dark Mode' : 'Light Mode') }}</span>
          </button>

          <button
            id="btn-cmd-open"
            type="button"
            class="px-3 py-1.5 text-xs font-semibold rx-btn-outline inline-flex items-center gap-2 hover:border-[var(--accent)] transition-colors cursor-pointer"
            :title="lang === 'ar' ? 'فتح الفهرس السريع والبحث (⌘K)' : 'Open Quick Index & Search (⌘K)'"
            @click="openCommandModal"
          >
            <svg class="w-3.5 h-3.5 text-[var(--accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <span>{{ profile.cmdLabel }}</span>
            <kbd class="hidden sm:inline px-1.5 py-0.5 bg-[var(--surface-alt)] border rx-divider text-[10px] font-mono-code text-[var(--ink-muted)] rounded leading-none">⌘K</kbd>
          </button>
        </div>
      </div>
    </div>

    <!-- Clean Two-Tier Sticky Header (Zero Horizontal Overflow) -->
    <header class="no-print border-b rx-divider bg-[var(--surface)] lg:bg-[var(--surface)]/95 lg:backdrop-blur-sm sticky top-0 z-30 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-8">
        <div class="flex items-center justify-between py-3 gap-4">
          <div class="flex items-center gap-3.5 min-w-0">
            <ResuxLink
              :to="overviewHref"
              view-transition
              class="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent)] shrink-0 shadow-sm hover:scale-105 transition-transform bg-[var(--surface-alt)]"
              :aria-label="profile.name"
            >
              <img
                src="/images/alhussein_portrait-sm.webp"
                :alt="profile.name"
                width="48"
                height="48"
                loading="eager"
                decoding="async"
                class="w-full h-full object-cover object-top"
              />
            </ResuxLink>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-serif-editorial font-bold text-lg sm:text-xl text-[var(--ink)] leading-snug">
                  {{ profile.name }}
                </span>
                <span class="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rx-badge-brass font-bold">
                  <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  <span>{{ profile.barPill }}</span>
                </span>
              </div>
              <div class="text-xs sm:text-sm text-[var(--ink-muted)] mt-0.5 truncate">
                {{ profile.role }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <ResuxLink
              :to="contactHref"
              view-transition
              class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rx-btn-primary"
            >
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span>{{ profile.headerCta }}</span>
            </ResuxLink>

            <button
              type="button"
              :aria-expanded="mobileDrawerOpen ? 'true' : 'false'"
              aria-controls="mobile-nav-drawer"
              class="lg:hidden px-3 py-2 text-xs font-bold rx-btn-outline inline-flex items-center gap-2"
              @click="toggleMobileMenu"
            >
              <span class="font-mono-code text-sm">{{ mobileDrawerOpen ? '✕' : '☰' }}</span>
              <span>{{ profile.menuLabel }}</span>
            </button>
          </div>
        </div>

        <!-- Tier 2: Balanced Desktop Navigation Bar (Fits Cleanly Without Any Scrollbar) -->
        <nav id="primary-desktop-nav" class="hidden lg:grid grid-cols-6 gap-1.5 py-2 border-t rx-divider" :aria-label="lang === 'ar' ? 'التنقل الرئيسي' : 'Primary Navigation'">
          <ResuxLink :to="overviewHref" view-transition :class="cleanPath === '/' ? 'rx-nav-pill rx-nav-active' : 'rx-nav-pill'">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18M3 7h18M6 7l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" /></svg>
            <span>{{ profile.nav[0] }}</span>
          </ResuxLink>
          <ResuxLink :to="officesHref" view-transition :class="cleanPath === '/offices' ? 'rx-nav-pill rx-nav-active' : 'rx-nav-pill'">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            <span>{{ profile.nav[1] }}</span>
          </ResuxLink>
          <ResuxLink :to="proceduresHref" view-transition :class="cleanPath === '/procedures' ? 'rx-nav-pill rx-nav-active' : 'rx-nav-pill'">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            <span>{{ profile.nav[2] }}</span>
          </ResuxLink>
          <ResuxLink :to="faqHref" view-transition :class="cleanPath === '/faq' ? 'rx-nav-pill rx-nav-active' : 'rx-nav-pill'">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" /></svg>
            <span>{{ profile.nav[3] }}</span>
          </ResuxLink>
          <ResuxLink :to="cvHref" view-transition :class="cleanPath === '/cv' ? 'rx-nav-pill rx-nav-active' : 'rx-nav-pill'">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            <span>{{ profile.nav[4] }}</span>
          </ResuxLink>
          <ResuxLink :to="contactHref" view-transition :class="cleanPath === '/contact' ? 'rx-nav-pill rx-nav-active' : 'rx-nav-pill'">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            <span>{{ profile.nav[5] }}</span>
          </ResuxLink>
        </nav>

        <!-- Mobile Drawer -->
        <div v-if="mobileDrawerOpen" id="mobile-nav-drawer" class="lg:hidden border-t rx-divider py-3 rx-accordion-body">
          <button
            type="button"
            class="w-full text-start px-3.5 py-2.5 text-xs font-bold rx-btn-primary flex items-center justify-between mb-2 shadow-sm rounded-xl cursor-pointer"
            @click="onMobileQuickIndexClick"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <span>{{ lang === 'ar' ? 'الفهرس القانوني السريع والبحث' : 'Quick Legal Index & Search' }}</span>
            </span>
            <kbd class="font-mono-code text-[10px] px-1.5 py-0.5 rounded bg-black/20 text-white">⌘K</kbd>
          </button>
          <div class="grid grid-cols-2 gap-2">
            <ResuxLink :to="overviewHref" view-transition :class="cleanPath === '/' ? 'w-full text-start px-3 py-2 text-xs font-bold rx-badge-accent block' : 'w-full text-start px-3 py-2 text-xs font-semibold rx-btn-outline block'" @click="closeMobileMenu">{{ profile.nav[0] }}</ResuxLink>
            <ResuxLink :to="officesHref" view-transition :class="cleanPath === '/offices' ? 'w-full text-start px-3 py-2 text-xs font-bold rx-badge-accent block' : 'w-full text-start px-3 py-2 text-xs font-semibold rx-btn-outline block'" @click="closeMobileMenu">{{ profile.nav[1] }}</ResuxLink>
            <ResuxLink :to="proceduresHref" view-transition :class="cleanPath === '/procedures' ? 'w-full text-start px-3 py-2 text-xs font-bold rx-badge-accent block' : 'w-full text-start px-3 py-2 text-xs font-semibold rx-btn-outline block'" @click="closeMobileMenu">{{ profile.nav[2] }}</ResuxLink>
            <ResuxLink :to="faqHref" view-transition :class="cleanPath === '/faq' ? 'w-full text-start px-3 py-2 text-xs font-bold rx-badge-accent block' : 'w-full text-start px-3 py-2 text-xs font-semibold rx-btn-outline block'" @click="closeMobileMenu">{{ profile.nav[3] }}</ResuxLink>
            <ResuxLink :to="cvHref" view-transition :class="cleanPath === '/cv' ? 'w-full text-start px-3 py-2 text-xs font-bold rx-badge-accent block' : 'w-full text-start px-3 py-2 text-xs font-semibold rx-btn-outline block'" @click="closeMobileMenu">{{ profile.nav[4] }}</ResuxLink>
            <ResuxLink :to="contactHref" view-transition :class="cleanPath === '/contact' ? 'w-full text-start px-3 py-2 text-xs font-bold rx-badge-accent block' : 'w-full text-start px-3 py-2 text-xs font-semibold rx-btn-outline block'" @click="closeMobileMenu">{{ profile.nav[5] }}</ResuxLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Resux Stage -->
    <main id="main-content" class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
      <slot />
    </main>

    <!-- Fully Localized Searchable Quick Index Modal with Shimmer Loading, Error Recovery, and Empty States -->
    <div
      v-if="commandModalOpen"
      id="rx-cmd-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="lang === 'ar' ? 'الفهرس السريع والبحث' : 'Quick Index & Global Search'"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs pt-12 sm:pt-20 p-3 sm:p-4 rx-modal-backdrop rx-animate-in"
      @click="onCmdBackdropClick"
    >
      <div
        class="rx-card-static max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden rx-modal-panel"
        @click="onCmdPanelClick"
      >
        <!-- Modal Header & Search Bar -->
        <div class="p-4 sm:p-5 border-b rx-divider bg-[var(--surface)] space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke-width="2" />
                  <path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div class="truncate">
                <h2 class="text-sm font-bold text-[var(--ink)] leading-tight">
                  {{ lang === 'ar' ? 'الفهرس القانوني السريع والبحث' : 'Quick Legal Index & Search' }}
                </h2>
                <p class="text-[11px] text-[var(--ink-muted)] truncate mt-0.5">
                  {{ lang === 'ar'
                    ? 'ابحث في كافة مكاتب المحاماة، الدعاوى، خطوات التقاضي، والسيرة الذاتية'
                    : 'Search law offices, litigation dockets, court steps, and credentials' }}
                </p>
              </div>
            </div>

            <button
              id="btn-cmd-close"
              type="button"
              class="px-2.5 py-1 text-xs font-semibold rx-btn-outline rounded-lg shrink-0 flex items-center gap-1.5 hover:bg-red-500/10 hover:text-red-600 transition-colors cursor-pointer"
              :title="lang === 'ar' ? 'إغلاق الفهرس (Esc)' : 'Close Index (Esc)'"
              @click="closeCommandModal"
            >
              <span>{{ lang === 'ar' ? 'إغلاق' : 'Close' }}</span>
              <kbd class="hidden sm:inline font-mono-code text-[10px] opacity-70">Esc</kbd>
            </button>
          </div>

          <!-- Search Input Bar -->
          <div class="relative flex items-center">
            <div class="absolute start-3.5 text-[var(--ink-muted)] pointer-events-none">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke-width="2" />
                <path d="M21 21l-4.35-4.35" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <input
              id="input-cmd-search"
              :value="searchQuery"
              type="text"
              autofocus
              :placeholder="lang === 'ar' ? 'اكتب للبحث (مثال: صحة توقيع، نفقات، خلع، مجلس الدولة، حلوان...)' : 'Type to search (e.g. Signature validity, Alimony, Khula, State Council...)'"
              class="rx-input w-full ps-10 pe-9 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all"
              @input="onCmdSearchInput"
            >
            <button
              v-if="searchQuery"
              type="button"
              class="absolute end-3 p-1 rounded-md text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
              :title="lang === 'ar' ? 'مسح البحث' : 'Clear Search'"
              @click="onCmdClearSearch"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Category Filter Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-xs no-scrollbar" role="tablist">
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === 'ALL'"
              :class="activeCategory === 'ALL' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
              @click="onCmdSelectCat('ALL')"
            >
              {{ lang === 'ar' ? 'الكل' : 'All' }}
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === 'pages'"
              :class="activeCategory === 'pages' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
              @click="onCmdSelectCat('pages')"
            >
              {{ lang === 'ar' ? 'الصفحات' : 'Pages' }}
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === 'offices'"
              :class="activeCategory === 'offices' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
              @click="onCmdSelectCat('offices')"
            >
              {{ lang === 'ar' ? 'مكاتب المحاماة' : 'Law Offices' }}
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === 'dockets'"
              :class="activeCategory === 'dockets' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
              @click="onCmdSelectCat('dockets')"
            >
              {{ lang === 'ar' ? 'القضايا والمحاكم' : 'Dockets & Courts' }}
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === 'procedures'"
              :class="activeCategory === 'procedures' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
              @click="onCmdSelectCat('procedures')"
            >
              {{ lang === 'ar' ? 'الإجراءات' : 'Procedures' }}
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === 'faq'"
              :class="activeCategory === 'faq' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
              @click="onCmdSelectCat('faq')"
            >
              {{ lang === 'ar' ? 'الأسئلة' : 'FAQ' }}
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="activeCategory === 'contact'"
              :class="activeCategory === 'contact' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
              @click="onCmdSelectCat('contact')"
            >
              {{ lang === 'ar' ? 'الاتصال والملفات' : 'Contact & CV' }}
            </button>
          </div>
        </div>

        <!-- Modal Body (Results / Loading / Error / Empty States) -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 focus:outline-none max-h-[50vh]" role="listbox">
          
          <!-- 1. LOADING STATE (Shimmer Skeleton Cards) -->
          <div v-if="isLoading" class="space-y-2 py-4">
            <div class="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--accent)] py-2">
              <svg class="animate-spin h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{{ lang === 'ar' ? 'جارٍ تحميل وفهرسة السجلات القانونية...' : 'Indexing legal records and dockets...' }}</span>
            </div>

            <div v-for="n in 4" :key="n" class="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] animate-pulse flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 w-3/4">
                <div class="w-8 h-8 rounded-lg bg-[var(--border)] shrink-0" />
                <div class="space-y-1.5 w-full">
                  <div class="h-3.5 bg-[var(--border)] rounded w-1/2" />
                  <div class="h-2.5 bg-[var(--border)] rounded w-3/4" />
                </div>
              </div>
              <div class="h-4 w-12 bg-[var(--border)] rounded" />
            </div>
          </div>

          <!-- 2. ERROR STATE (Clear alert with retry action) -->
          <div
            v-else-if="isError"
            role="alert"
            class="p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-center space-y-3 rx-animate-in"
          >
            <div class="w-10 h-10 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center mx-auto">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="text-xs sm:text-sm font-bold text-red-700 dark:text-red-300">
              {{ lang === 'ar' ? 'تعذر تحميل بيانات الفهرس القانوني السريع' : 'Failed to load quick index data' }}
            </div>
            <p class="text-xs text-[var(--ink-muted)] max-w-sm mx-auto">
              {{ errorMessage || (lang === 'ar' ? 'حدث خطأ مؤقت أثناء مزامنة الفهرس. يرجى المحاولة مرة أخرى.' : 'A temporary error occurred while syncing the index. Please retry.') }}
            </p>
            <button
              type="button"
              class="px-4 py-1.5 text-xs font-bold rx-btn-primary inline-flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
              @click="onCmdRetry"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ lang === 'ar' ? 'إعادة المحاولة الآن' : 'Retry Now' }}</span>
            </button>
          </div>

          <!-- 3. EMPTY STATE (Clear feedback when search query has 0 matches) -->
          <div
            v-else-if="isEmpty"
            class="p-8 text-center space-y-3 text-[var(--ink-muted)] rx-animate-in"
          >
            <div class="w-12 h-12 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--ink-muted)] flex items-center justify-center mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM9 9h.01M15 9h.01M9 13a4 4 0 006 0" />
              </svg>
            </div>
            <div class="text-xs sm:text-sm font-bold text-[var(--ink)]">
              {{ lang === 'ar' ? 'لم يتم العثور على نتائج مطابقة' : 'No matching results found' }}
            </div>
            <p class="text-xs max-w-sm mx-auto">
              {{ lang === 'ar'
                ? `لا توجد نتائج تطابق "${searchQuery}". جرب البحث باسم محكمة، نوع دعوى (صحة توقيع، نفقة، خلع)، أو تصفح الأقسام.`
                : `No dockets or records matched "${searchQuery}". Try searching by court, lawsuit type, or browse categories above.` }}
            </p>
            <div class="flex items-center justify-center gap-2 pt-1">
              <button
                id="btn-cmd-clear-empty"
                type="button"
                class="px-3.5 py-1.5 text-xs font-semibold rx-btn-outline rounded-lg cursor-pointer"
                @click="onCmdClearSearch"
              >
                {{ lang === 'ar' ? 'مسح كلمة البحث' : 'Clear search query' }}
              </button>
              <button
                v-if="activeCategory !== 'ALL'"
                id="btn-cmd-show-all"
                type="button"
                class="px-3.5 py-1.5 text-xs font-semibold rx-btn-primary rounded-lg cursor-pointer"
                @click="onCmdSelectCat('ALL')"
              >
                {{ lang === 'ar' ? 'عرض كافة الأقسام' : 'Show all categories' }}
              </button>
            </div>
          </div>

          <!-- 4. ACTIVE RESULTS LIST -->
          <div v-else class="space-y-1">
            <div v-for="(item, idx) in filteredItems" :key="item.id" class="contents">
              <!-- External / Direct link (tel, mailto, pdf) -->
              <a
                v-if="isSpecialCmdLink(item.href)"
                :href="item.href"
                :target="item.href.endsWith('.pdf') ? '_blank' : undefined"
                rel="noopener"
                role="option"
                class="group w-full text-start p-3 rounded-xl flex items-center justify-between gap-3 transition-colors border block cursor-pointer border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-alt)] hover:border-[var(--accent)] select-none"
                @click="closeCommandModal"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs transition-colors shadow-xs bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-white"
                  >
                    <svg v-if="item.icon === 'home'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <svg v-else-if="item.icon === 'briefcase'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2" stroke-width="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'building'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2" stroke-width="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'scales'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'gavel'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m14 13-7.5 7.5c-.8.8-2.2.8-3 0a2.1 2.1 0 0 1 0-3l7.5-7.5M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'book'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <svg v-else-if="item.icon === 'phone'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <svg v-else-if="item.icon === 'pdf'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div class="truncate text-start">
                    <div class="text-xs sm:text-sm font-bold text-[var(--ink)] truncate leading-tight group-hover:text-[var(--accent)] transition-colors">
                      {{ item.title }}
                    </div>
                    <div class="text-[11px] text-[var(--ink-muted)] truncate mt-0.5">
                      {{ item.subtitle }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--surface-alt)] text-[var(--ink-muted)] border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                  >
                    {{ item.categoryLabel }}
                  </span>
                  <span
                    v-if="item.badge"
                    class="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--ink-subtle)]"
                  >
                    {{ item.badge }}
                  </span>
                  <svg
                    class="w-4 h-4 text-[var(--ink-muted)] group-hover:text-[var(--accent)] transition-transform shrink-0"
                    :class="lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="lang === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'" />
                  </svg>
                </div>
              </a>

              <!-- Internal route via ResuxLink with view-transition -->
              <ResuxLink
                v-else
                :to="item.href"
                view-transition
                role="option"
                class="group w-full text-start p-3 rounded-xl flex items-center justify-between gap-3 transition-colors border block cursor-pointer border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-alt)] hover:border-[var(--accent)] select-none"
                @click="closeCommandModal"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs transition-colors shadow-xs bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)] group-hover:bg-[var(--accent)] group-hover:text-white"
                  >
                    <svg v-if="item.icon === 'home'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <svg v-else-if="item.icon === 'briefcase'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2" stroke-width="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'building'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2" stroke-width="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'scales'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'gavel'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m14 13-7.5 7.5c-.8.8-2.2.8-3 0a2.1 2.1 0 0 1 0-3l7.5-7.5M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8" stroke-width="2" /></svg>
                    <svg v-else-if="item.icon === 'book'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    <svg v-else-if="item.icon === 'phone'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <svg v-else-if="item.icon === 'pdf'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div class="truncate text-start">
                    <div class="text-xs sm:text-sm font-bold text-[var(--ink)] truncate leading-tight group-hover:text-[var(--accent)] transition-colors">
                      {{ item.title }}
                    </div>
                    <div class="text-[11px] text-[var(--ink-muted)] truncate mt-0.5">
                      {{ item.subtitle }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--surface-alt)] text-[var(--ink-muted)] border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                  >
                    {{ item.categoryLabel }}
                  </span>
                  <span
                    v-if="item.badge"
                    class="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--ink-subtle)]"
                  >
                    {{ item.badge }}
                  </span>
                  <svg
                    class="w-4 h-4 text-[var(--ink-muted)] group-hover:text-[var(--accent)] transition-transform shrink-0"
                    :class="lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="lang === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'" />
                  </svg>
                </div>
              </ResuxLink>
            </div>
          </div>
        </div>

        <!-- Modal Footer with Keyboard Shortcuts and Result Counter -->
        <div class="p-3 sm:px-5 sm:py-2.5 border-t rx-divider bg-[var(--surface)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--ink-muted)]">
          <div class="flex items-center gap-3">
            <span class="font-semibold">
              {{ lang === 'ar' ? `النتائج المتاحة: ${resultsCount}` : `Results: ${resultsCount}` }}
            </span>
          </div>

          <div class="hidden sm:flex items-center gap-3 text-[11px]">
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] font-mono-code text-[10px]">↑↓</kbd>
              <span>{{ lang === 'ar' ? 'للتنقل' : 'Navigate' }}</span>
            </span>
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] font-mono-code text-[10px]">↵</kbd>
              <span>{{ lang === 'ar' ? 'للاختيار' : 'Select' }}</span>
            </span>
            <span class="inline-flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] font-mono-code text-[10px]">Esc</kbd>
              <span>{{ lang === 'ar' ? 'للإغلاق' : 'Close' }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification Banner -->
    <div id="rx-toast" class="fixed bottom-5 end-5 z-50 hidden px-4 py-3 rx-card-static border-s-4 border-s-[var(--accent)] text-xs font-bold shadow-lg" role="status" aria-live="polite">
      <span id="rx-toast-text" />
    </div>

    <!-- Footer with Mahmoud Abdelrahman Credit & Portfolio Link -->
    <footer class="no-print border-t rx-divider bg-[var(--surface)] mt-16 py-8 px-4 sm:px-8 text-xs text-[var(--ink-muted)]">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="font-bold text-[var(--ink)]">{{ profile.footerPrimary }}</div>
          <div>{{ profile.footerLocation }}</div>
        </div>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span>{{ lang === 'ar' ? 'تصميم وتطوير' : 'Crafted by' }}</span>
          <a
            href="https://mahmouddeveloperm.github.io/Portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-bold text-[var(--accent)] underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {{ lang === 'ar' ? 'محمود عبد الرحمن' : 'Mahmoud Abdelrahman' }}
          </a>
          <span class="opacity-50">•</span>
          <a
            href="https://github.com/MahmoudAbdalrhmanMohamed/resux"
            target="_blank"
            rel="noopener noreferrer"
            class="underline text-[var(--ink)] hover:text-[var(--accent)] transition-colors"
          >
            Resux
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
