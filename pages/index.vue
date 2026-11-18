<script setup lang="ts">
import { CV_TEXT_SUMMARIES, HUSSEIN_DATA } from '../composables/portfolioContent'
import { copyTextToClipboard, normalizeLocale } from '../composables/browserHelpers'

definePageMeta({
  viewTransition: true
})

const i18n = useI18n()
const lang = computed(() => normalizeLocale(i18n.locale.value))
const profile = computed(() => HUSSEIN_DATA[lang.value])

const pageTitle = lang.value === 'ar'
  ? 'الحسين محمد عبدالله | باحث قانوني ومحامٍ متدرب — نقابة المحامين المصرية'
  : 'Al Hussein Mohamed Abdallah | Legal Professional & Junior Legal Associate'
const ogPageTitle = lang.value === 'ar'
  ? 'الأستاذ الحسين محمد عبدالله — باحث قانوني ومحامٍ متدرب'
  : 'Al Hussein Mohamed Abdallah — Egyptian Bar Association Member'

useSeoMeta({
  title: pageTitle,
  description: profile.value.summary,
  ogTitle: ogPageTitle,
  ogDescription: profile.value.summary,
  twitterTitle: ogPageTitle,
  twitterDescription: profile.value.summary
})

const officesHref = computed(() => i18n.localePath('/offices'))
const proceduresHref = computed(() => i18n.localePath('/procedures'))
const cvHref = computed(() => i18n.localePath('/cv'))
const faqHref = computed(() => i18n.localePath('/faq'))
const contactHref = computed(() => i18n.localePath('/contact'))

const selectedOfficeId = ref('')
const activeDetailItem = computed(() => {
  if (!selectedOfficeId.value) return null
  return profile.value.items.find((x) => x.id === selectedOfficeId.value) ?? null
})

function openDetailModal(id: string) {
  selectedOfficeId.value = id
}

function closeDetailModal() {
  selectedOfficeId.value = ''
}

function onModalBackdropClick(event: any) {
  if (event && event.target === event.currentTarget) {
    selectedOfficeId.value = ''
  }
}

function copySummaryCv() {
  const summary = CV_TEXT_SUMMARIES[lang.value]
  copyTextToClipboard(
    summary,
    lang.value === 'ar' ? 'تم نسخ ملخص السيرة الذاتية' : 'Copied resume summary to clipboard'
  )
}
</script>

<template>
  <section class="space-y-12">
    <!-- Editorial Law Chambers Hero with Official Portrait -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b rx-divider pb-10">
      <div class="lg:col-span-7 flex flex-col justify-between space-y-6">
        <div class="space-y-5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rx-badge-accent">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span>{{ profile.kicker }}</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rx-badge-secondary">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              <span>{{ profile.status }}</span>
            </span>
          </div>

          <h1 class="font-serif-editorial text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[var(--ink)]">
            {{ profile.headline }}
          </h1>

          <p class="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
            {{ profile.summary }}
          </p>
        </div>

        <!-- Key Quick Stat Highlights -->
        <div class="grid grid-cols-3 gap-3 pt-1">
          <div class="rx-card p-3.5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg rx-badge-accent flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            </div>
            <div>
              <div class="font-bold text-base leading-none ltr-num">4</div>
              <div class="text-[11px] text-[var(--ink-muted)] mt-1">{{ profile.stat1 }}</div>
            </div>
          </div>
          <div class="rx-card p-3.5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg rx-badge-secondary flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18M3 7h18M6 7l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" /></svg>
            </div>
            <div>
              <div class="font-bold text-base leading-none ltr-num">9+</div>
              <div class="text-[11px] text-[var(--ink-muted)] mt-1">{{ profile.stat2 }}</div>
            </div>
          </div>
          <div class="rx-card p-3.5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg rx-badge-brass flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div>
              <div class="font-bold text-base leading-none ltr-num">100%</div>
              <div class="text-[11px] text-[var(--ink-muted)] mt-1">{{ profile.stat3 }}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          <ResuxLink :to="officesHref" view-transition class="px-5 py-2.5 text-sm font-bold rx-btn-primary inline-block">
            {{ profile.ctaPrimary }}
          </ResuxLink>
          <ResuxLink :to="proceduresHref" view-transition class="px-4 py-2.5 text-sm font-bold rx-btn-outline inline-block">
            {{ profile.ctaSecondary }}
          </ResuxLink>
          <ResuxLink :to="cvHref" view-transition class="px-4 py-2.5 text-sm font-bold rx-btn-outline inline-block">
            {{ profile.ctaTertiary }}
          </ResuxLink>
          <ResuxLink :to="faqHref" view-transition class="px-4 py-2.5 text-sm font-bold rx-btn-outline inline-block">
            {{ profile.ctaQuaternary }}
          </ResuxLink>
        </div>
      </div>

      <!-- Official Portrait & Counsel Dossier Card -->
      <div class="lg:col-span-5 rx-card-double p-5 sm:p-6 flex flex-col justify-between space-y-5">
        <div class="flex flex-col sm:flex-row items-center gap-4 border-b rx-divider pb-4">
          <div class="w-28 h-32 sm:w-32 sm:h-36 rounded-xl overflow-hidden border-2 border-[var(--accent)] shadow-md shrink-0 bg-[var(--surface-alt)]">
            <img src="/images/alhussein_portrait.webp" :alt="profile.cardName" width="128" height="146" fetchpriority="high" decoding="async" class="w-full h-full object-cover object-top">
          </div>
          <div class="text-center sm:text-start space-y-1.5">
            <span class="inline-block text-[11px] px-2.5 py-0.5 rx-badge-brass font-bold">
              {{ profile.cardTag }}
            </span>
            <h2 class="font-serif-editorial font-bold text-xl text-[var(--ink)]">
              {{ profile.cardName }}
            </h2>
            <p class="text-xs font-semibold text-[var(--accent)]">
              {{ profile.cardTitle }}
            </p>
            <p class="text-xs text-[var(--ink-muted)] font-mono-code ltr-num">
              01040542354 • hm8550845@gmail.com
            </p>
          </div>
        </div>

        <div class="space-y-2.5 text-xs sm:text-sm">
          <div
            v-for="(metric, idx) in profile.metrics"
            :key="idx"
            class="flex items-baseline justify-between gap-2 border-b rx-divider pb-2 last:border-b-0 last:pb-0"
          >
            <span class="text-xs text-[var(--ink-muted)]">{{ metric[0] }}</span>
            <span class="text-xs font-bold text-end">{{ metric[1] }}</span>
          </div>
        </div>

        <div class="pt-3 border-t rx-divider grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ResuxLink :to="contactHref" view-transition class="w-full py-2.5 px-3 text-xs rx-btn-accent text-center font-bold block">
            {{ profile.dossierCtaContact }}
          </ResuxLink>
          <button type="button" class="w-full py-2.5 px-3 text-xs rx-btn-outline text-center font-bold" @click="copySummaryCv">
            {{ profile.dossierCtaCopy }}
          </button>
        </div>
      </div>
    </div>

    <!-- 4 Core Judicial Pillars -->
    <div class="space-y-4 rx-stagger-2">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-sm font-bold tracking-wider text-[var(--accent)] flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18M3 7h18M6 7l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" /></svg>
          <span>{{ profile.pillarsHeading }}</span>
        </h2>
        <span class="text-xs text-[var(--ink-subtle)] font-semibold">
          {{ profile.pillarsSub }}
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <article
          v-for="(pil, idx) in profile.pillars"
          :key="idx"
          class="rx-card p-5 flex flex-col justify-between space-y-3"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-block text-[11px] font-bold px-2.5 py-0.5 rx-badge-brass">{{ pil.tag }}</span>
              <div class="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center shrink-0 text-[var(--accent)]">
                <svg v-if="idx === 0" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <svg v-else-if="idx === 1" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18M3 7h18M6 7l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" /></svg>
                <svg v-else-if="idx === 2" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" /></svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              </div>
            </div>
            <h3 class="font-serif-editorial font-bold text-lg leading-snug">{{ pil.title }}</h3>
            <p class="text-xs text-[var(--ink-muted)] leading-relaxed">{{ pil.desc }}</p>
          </div>
          <div class="pt-2 border-t rx-divider flex items-center justify-between text-[11px] font-semibold text-[var(--accent)]">
            <span>{{ lang === 'ar' ? 'المحاكم المصرية' : 'Egyptian Courts' }}</span>
            <span>§</span>
          </div>
        </article>
      </div>
    </div>

    <!-- 9 Practical Case Categories Matrix -->
    <div class="rx-card-static p-6 sm:p-8 space-y-5 rx-stagger-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b rx-divider pb-4">
        <div>
          <span class="text-xs font-bold tracking-wider text-[var(--accent)]">
            {{ profile.matrixEyebrow }}
          </span>
          <h3 class="font-serif-editorial text-2xl sm:text-3xl font-bold mt-1">
            {{ profile.matrixHeading }}
          </h3>
        </div>
        <ResuxLink :to="proceduresHref" view-transition class="text-xs font-bold px-3.5 py-2 rx-btn-outline self-start">
          {{ profile.matrixCtaBtn }}
        </ResuxLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div
          v-for="cm in profile.caseMatrix"
          :key="cm.code"
          class="p-4 rounded-xl border rx-divider bg-[var(--surface-elevated)] space-y-2 hover:border-[var(--accent)] transition-all duration-200 hover:-translate-y-0.5"
        >
          <div class="flex items-center justify-between text-[11px]">
            <span class="px-2 py-0.5 rx-badge-accent font-bold">{{ cm.code }}</span>
            <span class="text-[var(--ink-muted)] font-semibold">{{ cm.court }}</span>
          </div>
          <div class="font-serif-editorial font-bold text-base">{{ cm.title }}</div>
          <p class="text-xs text-[var(--ink-muted)] leading-relaxed">{{ cm.desc }}</p>
          <div class="text-[11px] font-semibold text-[var(--accent)] pt-1.5 border-t rx-divider">{{ cm.office }}</div>
        </div>
      </div>
    </div>

    <!-- Featured Law Office Timeline Preview -->
    <div class="space-y-4 rx-stagger-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-sm font-bold tracking-wider text-[var(--accent)]">
          {{ profile.featuredHeading }}
        </h2>
        <ResuxLink :to="officesHref" view-transition class="text-xs font-bold underline underline-offset-4 hover:text-[var(--accent)]">
          {{ profile.featuredLink }}
        </ResuxLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article
          v-for="item in profile.items"
          :key="item.id"
          class="rx-card p-6 flex flex-col justify-between space-y-4"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2 text-xs">
              <span class="px-2.5 py-0.5 rx-badge-brass font-bold">{{ item.year }}</span>
              <span class="px-2.5 py-0.5 rx-badge-accent font-bold">{{ item.badge }}</span>
            </div>
            <h3 class="font-serif-editorial text-xl font-bold leading-snug">{{ item.title }}</h3>
            <div class="text-xs text-[var(--ink-muted)] font-semibold">{{ item.subtitle }}</div>
            <div class="space-y-1.5 pt-2 text-xs text-[var(--ink-muted)] leading-relaxed">
              <p v-for="(h, hIdx) in item.highlights.slice(0, 3)" :key="hIdx" class="flex items-start gap-2">
                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" aria-hidden="true" />
                <span>{{ h }}</span>
              </p>
            </div>
          </div>
          <div class="pt-3 border-t rx-divider flex items-center justify-between">
            <button
              type="button"
              class="text-xs underline underline-offset-4 hover:text-[var(--accent)] font-bold"
              @click="openDetailModal(item.id)"
            >
              {{ lang === 'ar' ? 'عرض التفاصيل الكاملة (٥ مهام قانونية) ←' : 'Open Full 5-Point Litigation Docket →' }}
            </button>
            <span class="text-[11px] font-semibold text-[var(--ink-subtle)]">{{ item.year }}</span>
          </div>
        </article>
      </div>
    </div>

    <!-- Case / Law Office Detail Modal -->
    <div
      v-if="activeDetailItem"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 rx-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      @click="onModalBackdropClick"
    >
      <div class="rx-card-static max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[88vh] overflow-y-auto rx-modal-panel">
        <div class="flex items-start justify-between gap-4 border-b rx-divider pb-4">
          <div>
            <span class="text-xs px-2.5 py-0.5 rx-badge-accent font-bold">
              {{ activeDetailItem.badge }} • {{ activeDetailItem.year }}
            </span>
            <h2 id="modal-title" class="font-serif-editorial text-2xl font-bold mt-2">
              {{ activeDetailItem.title }}
            </h2>
            <p class="text-xs text-[var(--ink-muted)] mt-1">
              {{ activeDetailItem.subtitle }}
            </p>
          </div>
          <button id="btn-detail-close" type="button" class="px-2.5 py-1 text-xs font-semibold rx-btn-outline" @click="closeDetailModal">
            {{ lang === 'ar' ? 'إغلاق ✕' : 'Close ✕' }}
          </button>
        </div>
        <div class="space-y-3 text-sm leading-relaxed">
          <div class="text-xs font-bold text-[var(--ink-muted)]">
            {{ lang === 'ar' ? 'المسؤوليات العملية والإجراءات القضائية المنفذة' : 'Verified Practical Responsibilities & Court Procedures' }}
          </div>
          <div class="space-y-2.5 text-sm leading-relaxed">
            <p v-for="(h, idx) in activeDetailItem.highlights" :key="idx" class="flex items-start gap-2.5">
              <span class="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" aria-hidden="true" />
              <span>{{ h }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between pt-4 border-t rx-divider">
          <span class="text-xs text-[var(--ink-muted)]">
            {{ lang === 'ar'
              ? `الحسين محمد عبدالله • عضو نقابة المحامين المصرية • ${activeDetailItem.year}`
              : `Al Hussein Mohamed Abdallah • Egyptian Bar Association • ${activeDetailItem.year}` }}
          </span>
          <button type="button" class="px-4 py-1.5 text-xs font-bold rx-btn-primary" @click="closeDetailModal">
            {{ lang === 'ar' ? 'إغلاق' : 'Close' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
