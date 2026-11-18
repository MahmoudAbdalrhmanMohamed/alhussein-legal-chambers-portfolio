<script setup lang="ts">
import { HUSSEIN_DATA } from '../composables/portfolioContent'
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
const siteUrl = String(runtimeConfig?.public?.siteUrl || '')
const ogImageUrl = `${siteUrl}${lang.value === 'en' ? '/og-en.png' : '/og-ar.png'}`
const ogAlt = lang.value === 'en'
  ? 'Al Hussein Mohamed Abdallah — Legal Researcher & Junior Legal Associate, Egyptian Bar Association'
  : 'الأستاذ الحسين محمد عبدالله — باحث قانوني ومحامٍ متدرب، عضو نقابة المحامين المصرية'

useSeoMeta({
  ogSiteName: lang.value === 'en'
    ? 'Al Hussein Mohamed Abdallah | Legal Portfolio'
    : 'الحسين محمد عبدالله | الملف القانوني الرسمي',
  ogLocale: lang.value === 'en' ? 'en_US' : 'ar_EG',
  ogImage: ogImageUrl,
  ogImageWidth: '1200',
  ogImageHeight: '630',
  ogImageAlt: ogAlt,
  ogUrl: siteUrl ? `${siteUrl}${String(route.path || '/')}` : undefined,
  twitterImage: ogImageUrl,
  twitterImageAlt: ogAlt
})
const cleanPath = computed(() => {
  const raw = String(route.path || '/')
  const stripped = raw.replace(/^\/en(?=\/|$)/, '') || '/'
  return stripped.length > 1 && stripped.endsWith('/') ? stripped.slice(0, -1) : stripped
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
}

function closeCommandModal() {
  commandModalOpen.value = false
}

function onCmdBackdropClick(event: any) {
  if (event && event.target === event.currentTarget) {
    commandModalOpen.value = false
  }
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
            class="px-3 py-1.5 text-xs font-semibold rx-btn-outline hidden md:inline-flex items-center gap-2"
            @click="openCommandModal"
          >
            <svg class="w-3.5 h-3.5 text-[var(--accent)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <span>{{ profile.cmdLabel }}</span>
            <kbd class="px-1.5 py-0.5 bg-[var(--surface-alt)] border rx-divider text-[10px] font-mono-code text-[var(--ink-muted)] rounded leading-none">⌘K</kbd>
          </button>
        </div>
      </div>
    </div>

    <!-- Clean Two-Tier Sticky Header (Zero Horizontal Overflow) -->
    <header class="no-print border-b rx-divider bg-[var(--surface)]/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-8">
        <div class="flex items-center justify-between py-3 gap-4">
          <div class="flex items-center gap-3.5 min-w-0">
            <ResuxLink
              :to="overviewHref"
              view-transition
              class="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent)] shrink-0 shadow-sm hover:scale-105 transition-transform bg-[var(--surface-alt)]"
              :aria-label="profile.name"
            >
              <img src="/images/alhussein_portrait.jpg" :alt="profile.name" width="48" height="48" class="w-full h-full object-cover object-top">
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

    <!-- Fully Localized Command Palette Modal -->
    <div
      v-if="commandModalOpen"
      id="rx-cmd-modal"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs pt-20 p-4 rx-modal-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="lang === 'ar' ? 'الفهرس السريع' : 'Quick Index'"
      @click="onCmdBackdropClick"
    >
      <div class="rx-card-static max-w-lg w-full p-5 space-y-3 shadow-2xl rx-modal-panel">
        <div class="flex items-center justify-between border-b rx-divider pb-3">
          <span class="text-sm font-bold text-[var(--ink)]">
            {{ lang === 'ar' ? 'الفهرس السريع للموقع' : 'Quick Navigation Index' }}
          </span>
          <button id="btn-cmd-close" type="button" class="text-xs font-semibold px-2.5 py-1 rx-btn-outline" @click="closeCommandModal">
            {{ lang === 'ar' ? 'إغلاق' : 'Close' }}
          </button>
        </div>
        <div class="space-y-1 text-xs">
          <ResuxLink :to="overviewHref" view-transition class="w-full text-start px-3 py-2.5 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="closeCommandModal">
            <span>{{ profile.nav[0] }}</span>
            <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? 'الصفحة الرئيسية' : 'Home' }}</span>
          </ResuxLink>
          <ResuxLink :to="officesHref" view-transition class="w-full text-start px-3 py-2.5 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="closeCommandModal">
            <span>{{ profile.nav[1] }}</span>
            <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? '٤ مكاتب محاماة' : '4 Law Offices' }}</span>
          </ResuxLink>
          <ResuxLink :to="proceduresHref" view-transition class="w-full text-start px-3 py-2.5 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="closeCommandModal">
            <span>{{ profile.nav[2] }}</span>
            <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? 'خطوات ومستندات التقاضي' : 'Steps & Documents' }}</span>
          </ResuxLink>
          <ResuxLink :to="faqHref" view-transition class="w-full text-start px-3 py-2.5 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="closeCommandModal">
            <span>{{ profile.nav[3] }}</span>
            <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? 'المحاكم والأسئلة الشائعة' : 'Courts & Answers' }}</span>
          </ResuxLink>
          <ResuxLink :to="cvHref" view-transition class="w-full text-start px-3 py-2.5 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="closeCommandModal">
            <span>{{ profile.nav[4] }}</span>
            <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? 'معاينة وتحميل الملف' : 'PDF Preview & Download' }}</span>
          </ResuxLink>
          <ResuxLink :to="contactHref" view-transition class="w-full text-start px-3 py-2.5 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="closeCommandModal">
            <span>{{ profile.nav[5] }}</span>
            <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? 'إرسال رسالة مباشرة' : 'Send Inquiry' }}</span>
          </ResuxLink>
          <div class="border-t rx-divider my-2 pt-2 space-y-1">
            <ResuxLink :to="switchLangHref" view-transition class="w-full text-start px-3 py-2 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="closeCommandModal">
              <span>{{ lang === 'ar' ? 'التبديل إلى اللغة الإنجليزية' : 'Switch to Arabic' }}</span>
              <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? 'English' : 'العربية' }}</span>
            </ResuxLink>
            <button type="button" class="w-full text-start px-3 py-2 rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] flex justify-between items-center font-semibold transition-colors" @click="toggleTheme">
              <span>{{ lang === 'ar' ? 'تبديل المظهر (فاتح / داكن)' : 'Toggle Light / Dark Theme' }}</span>
              <span class="text-[11px] text-[var(--ink-subtle)]">{{ lang === 'ar' ? 'المظهر' : 'Theme' }}</span>
            </button>
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
