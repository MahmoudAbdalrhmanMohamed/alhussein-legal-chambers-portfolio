<script setup lang="ts">
import { CV_TEXT_SUMMARIES } from '../composables/portfolioContent'
import { copyTextToClipboard, normalizeLocale } from '../composables/browserHelpers'

definePageMeta({
  viewTransition: false
})

const i18n = useI18n()
const lang = computed(() => normalizeLocale(i18n.locale.value))

const pageTitle = lang.value === 'ar'
  ? 'السيرة الذاتية الرسمية | الحسين محمد عبدالله'
  : 'Official Curriculum Vitae | Al Hussein Mohamed Abdallah'
const pageDesc = lang.value === 'ar'
  ? 'معاينة وتحميل السيرة الذاتية الرسمية للأستاذ الحسين محمد عبدالله باللغتين العربية والإنجليزية.'
  : 'Preview and download Al Hussein Mohamed Abdallah’s official Arabic and English Curriculum Vitae PDFs.'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  twitterTitle: pageTitle,
  twitterDescription: pageDesc
})

const selectedPdfLang = ref<'' | 'ar' | 'en'>('')
const showTextSummary = ref(false)

const activePdfLang = computed<'ar' | 'en'>(() => {
  if (selectedPdfLang.value === 'ar' || selectedPdfLang.value === 'en') {
    return selectedPdfLang.value
  }
  return lang.value
})

const activePdfUrl = computed(() =>
  activePdfLang.value === 'ar'
    ? '/cv/AlHussein_Mohamed_Arabic_CV.pdf'
    : '/cv/AlHussein_Mohamed_English_CV.pdf'
)

const activePdfEmbedUrl = computed(() => `${activePdfUrl.value}#view=FitH`)

const activePdfDownloadName = computed(() =>
  activePdfLang.value === 'ar'
    ? 'AlHussein_Mohamed_Arabic_CV.pdf'
    : 'AlHussein_Mohamed_English_CV.pdf'
)

const activeDocumentLabel = computed(() => {
  if (lang.value === 'ar') {
    return activePdfLang.value === 'ar'
      ? 'السيرة الذاتية الرسمية — النسخة العربية'
      : 'السيرة الذاتية الرسمية — النسخة الإنجليزية'
  }
  return activePdfLang.value === 'ar'
    ? 'Official Curriculum Vitae — Arabic Edition'
    : 'Official Curriculum Vitae — English Edition'
})

const activeTextSummary = computed(() => CV_TEXT_SUMMARIES[activePdfLang.value])

function selectPdfLanguage(target: 'ar' | 'en') {
  selectedPdfLang.value = target
}

function toggleTextSummary() {
  showTextSummary.value = !showTextSummary.value
}

function copySummary() {
  copyTextToClipboard(
    activeTextSummary.value,
    lang.value === 'ar' ? 'تم نسخ ملخص السيرة الذاتية إلى الحافظة' : 'Copied CV summary to clipboard'
  )
}
</script>

<template>
  <section class="space-y-7">
    <div class="border-b rx-divider pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
          {{ lang === 'ar'
            ? 'معاينة وتحميل السيرة الذاتية الرسمية'
            : 'Official Curriculum Vitae Preview & Download' }}
        </div>
        <h1 class="font-serif-editorial text-3xl sm:text-4xl font-bold">
          {{ lang === 'ar' ? 'السيرة الذاتية للأستاذ الحسين محمد عبدالله' : 'Al Hussein Mohamed Abdallah — Curriculum Vitae' }}
        </h1>
        <p class="text-sm text-[var(--ink-muted)] mt-2 max-w-2xl">
          {{ lang === 'ar'
            ? 'تُعرض النسخة المطابقة للغة التصفح تلقائياً، ويمكنك التبديل بين النسختين العربية والإنجليزية أو تحميل الملف مباشرة.'
            : 'Automatically displays the PDF edition matching your current language, with one-click switching and direct download.' }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2 no-print" role="group" :aria-label="lang === 'ar' ? 'اختيار لغة ملف السيرة الذاتية' : 'Select CV PDF language'">
        <button
          type="button"
          :aria-pressed="activePdfLang === 'ar' ? 'true' : 'false'"
          :class="activePdfLang === 'ar' ? 'px-4 py-2 text-xs font-bold rx-btn-primary' : 'px-4 py-2 text-xs font-bold rx-btn-outline'"
          @click="selectPdfLanguage('ar')"
        >
          {{ lang === 'ar' ? 'النسخة العربية' : 'Arabic Edition' }}
        </button>
        <button
          type="button"
          :aria-pressed="activePdfLang === 'en' ? 'true' : 'false'"
          :class="activePdfLang === 'en' ? 'px-4 py-2 text-xs font-bold rx-btn-primary' : 'px-4 py-2 text-xs font-bold rx-btn-outline'"
          @click="selectPdfLanguage('en')"
        >
          {{ lang === 'ar' ? 'النسخة الإنجليزية' : 'English Edition' }}
        </button>
      </div>
    </div>

    <div class="rx-card-static overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b rx-divider bg-[var(--surface-alt)]">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="w-8 h-8 rounded-sm rx-badge-accent inline-flex items-center justify-center shrink-0" aria-hidden="true">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
          </span>
          <div class="min-w-0">
            <div class="text-sm font-bold text-[var(--ink)] truncate">{{ activeDocumentLabel }}</div>
            <div class="text-[11px] text-[var(--ink-muted)] font-mono-code truncate">{{ activePdfDownloadName }}</div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 no-print">
          <a
            :href="activePdfUrl"
            :download="activePdfDownloadName"
            class="px-3.5 py-1.5 text-xs font-bold rx-btn-primary inline-flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{{ lang === 'ar' ? 'تحميل الملف' : 'Download PDF' }}</span>
          </a>

          <a
            :href="activePdfUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3.5 py-1.5 text-xs font-bold rx-btn-outline inline-flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>{{ lang === 'ar' ? 'فتح في نافذة مستقلة' : 'Open in New Tab' }}</span>
          </a>

          <button
            type="button"
            class="px-3.5 py-1.5 text-xs font-bold rx-btn-outline"
            @click="copySummary"
          >
            {{ lang === 'ar' ? 'نسخ الملخص النصي' : 'Copy Text Summary' }}
          </button>

          <button
            type="button"
            :aria-expanded="showTextSummary ? 'true' : 'false'"
            class="px-3.5 py-1.5 text-xs font-bold rx-btn-outline"
            @click="toggleTextSummary"
          >
            {{ showTextSummary
              ? (lang === 'ar' ? 'إخفاء الملخص النصي' : 'Hide Text Summary')
              : (lang === 'ar' ? 'عرض الملخص النصي' : 'Show Text Summary') }}
          </button>
        </div>
      </div>

      <div class="bg-[var(--surface-elevated)]">
        <iframe
          :key="activePdfUrl"
          :src="activePdfEmbedUrl"
          :title="activeDocumentLabel"
          class="w-full h-[78vh] min-h-[620px] border-0 block bg-white"
        />
      </div>

      <div class="px-4 sm:px-5 py-3 border-t rx-divider bg-[var(--surface-alt)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ink-muted)]">
        <span>
          {{ lang === 'ar'
            ? 'إذا لم تظهر المعاينة المباشرة على متصفح الهاتف، يمكنك فتح الملف أو تحميله مباشرة.'
            : 'If inline preview is unavailable on your mobile browser, open or download the PDF directly.' }}
        </span>
        <a
          :href="activePdfUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-[var(--accent)] hover:underline"
        >
          {{ lang === 'ar' ? 'فتح ملف السيرة الذاتية مباشرة ←' : 'Open PDF directly →' }}
        </a>
      </div>
    </div>

    <div v-if="showTextSummary" class="rx-card-static overflow-hidden rx-accordion-body">
      <div class="flex items-center justify-between gap-2 px-5 py-3 border-b rx-divider bg-[var(--surface-alt)]">
        <span class="text-xs font-bold text-[var(--accent)]">
          {{ lang === 'ar' ? 'الملخص النصي الكامل للسيرة الذاتية' : 'Full Plain-Text Curriculum Vitae Summary' }}
        </span>
        <button type="button" class="px-3 py-1 text-xs font-bold rx-btn-primary" @click="copySummary">
          {{ lang === 'ar' ? 'نسخ النص' : 'Copy Text' }}
        </button>
      </div>
      <pre
        :dir="activePdfLang === 'ar' ? 'rtl' : 'ltr'"
        class="p-6 bg-[var(--surface)] text-[var(--ink)] text-sm overflow-x-auto leading-relaxed m-0 whitespace-pre-wrap font-sans"
      >{{ activeTextSummary }}</pre>
    </div>
  </section>
</template>
