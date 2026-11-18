<script setup lang="ts">
import { PROCEDURAL_TRACKS } from '../composables/portfolioContent'
import { normalizeLocale } from '../composables/browserHelpers'

definePageMeta({
  viewTransition: true
})

const i18n = useI18n()
const lang = computed(() => normalizeLocale(i18n.locale.value))
const contactHref = computed(() => i18n.localePath('/contact'))

const pageTitle = lang.value === 'ar'
  ? 'دليل الإجراءات القضائية والمستندات المطلوبة | الحسين محمد عبدالله'
  : 'Egyptian Court Procedures & Required Documents | Al Hussein Mohamed Abdallah'
const pageDesc = lang.value === 'ar'
  ? 'خطوات رفع الدعاوى والمستندات المطلوبة أمام محكمة الأسرة والمحاكم المدنية ومجلس الدولة في مصر.'
  : 'Clear step-by-step Egyptian court filing stages and required documents across Family, Civil, and State Council jurisdictions.'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  twitterTitle: pageTitle,
  twitterDescription: pageDesc
})

const activeTrackId = ref<1 | 2 | 3 | 4>(1)
const doc0 = ref(true)
const doc1 = ref(true)
const doc2 = ref(false)
const doc3 = ref(false)

const activeTrack = computed(() => PROCEDURAL_TRACKS[lang.value][activeTrackId.value])

const trackButtons = computed(() => lang.value === 'ar'
  ? [
      { id: 1 as const, label: '١. قضايا الأسرة', sub: 'النفقات والخلع والضرر' },
      { id: 2 as const, label: '٢. الولاية التعليمية', sub: 'أمر وقتي على عريضة' },
      { id: 3 as const, label: '٣. المحاكم المدنية', sub: 'صحة التوقيع والعقود' },
      { id: 4 as const, label: '٤. مجلس الدولة', sub: 'التسويات والفروق المالية' }
    ]
  : [
      { id: 1 as const, label: '1. Family Courts', sub: 'Alimony, Khula & Harm' },
      { id: 2 as const, label: '2. Guardianship', sub: 'Urgent School Order' },
      { id: 3 as const, label: '3. Civil Courts', sub: 'Signature Validity' },
      { id: 4 as const, label: '4. State Council', sub: 'Admin Settlements' }
    ]
)

const readyCount = computed(() => [doc0.value, doc1.value, doc2.value, doc3.value].filter(Boolean).length)
const readinessPct = computed(() => readyCount.value * 25)

function selectTrack(trackId: 1 | 2 | 3 | 4) {
  activeTrackId.value = trackId
}

function selectAllDocs() {
  doc0.value = true
  doc1.value = true
  doc2.value = true
  doc3.value = true
}

function resetDocs() {
  doc0.value = false
  doc1.value = false
  doc2.value = false
  doc3.value = false
}
</script>

<template>
  <section class="space-y-8 rx-animate-in">
    <div class="border-b rx-divider pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="text-xs font-bold tracking-wider text-[var(--accent)] mb-2">
          {{ lang === 'ar' ? 'دليل عملي مبسط للموكلين ومكاتب المحاماة' : 'Practical Litigation Roadmap for Clients & Law Firms' }}
        </div>
        <h1 class="font-serif-editorial text-3xl sm:text-4xl font-bold">
          {{ lang === 'ar' ? 'خطوات رفع الدعاوى والمستندات المطلوبة' : 'Egyptian Court Procedures & Required Documents' }}
        </h1>
        <p class="text-sm text-[var(--ink-muted)] mt-2 max-w-3xl">
          {{ lang === 'ar'
            ? 'اختر نوع الدعوى أدناه للتعرف بوضوح على المراحل القانونية أمام المحكمة المختصة وتجهيز المستندات المطلوبة قبل التوجه للمكتب أو الجلسة.'
            : 'Choose a lawsuit track below to review each legal stage before the competent Egyptian court and prepare the required documents before filing.' }}
        </p>
      </div>
      <span class="px-3 py-1.5 rx-badge-accent text-xs font-bold self-start md:self-auto">
        {{ lang === 'ar' ? '٤ مسارات قضائية رئيسية' : '4 Core Legal Tracks' }}
      </span>
    </div>

    <!-- Track Selector Buttons -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <button
        v-for="tb in trackButtons"
        :key="tb.id"
        type="button"
        :class="activeTrackId === tb.id ? 'p-4 text-start border-2 border-[var(--accent)] bg-[var(--accent-soft)] rounded-xl transition-all' : 'p-4 text-start border rx-divider bg-[var(--surface)] hover:border-[var(--accent)] rounded-xl transition-all'"
        @click="selectTrack(tb.id)"
      >
        <div class="font-bold text-sm" :class="activeTrackId === tb.id ? 'text-[var(--accent)]' : 'text-[var(--ink)]'">
          {{ tb.label }}
        </div>
        <div class="text-xs text-[var(--ink-muted)] mt-1">{{ tb.sub }}</div>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Clear 4-Stage Court Timeline -->
      <div class="lg:col-span-7 rx-card-static p-6 sm:p-7 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b rx-divider pb-4">
          <h2 class="font-serif-editorial text-xl font-bold">
            {{ lang === 'ar' ? 'المراحل الإجرائية خطوة بخطوة' : 'Step-by-Step Court Stages' }}
          </h2>
          <span class="text-xs px-3 py-1 rx-badge-accent font-bold">{{ activeTrack.badge }}</span>
        </div>

        <ol class="space-y-3.5">
          <li
            v-for="(step, idx) in activeTrack.steps"
            :key="idx"
            class="p-4 rounded-xl border rx-divider bg-[var(--surface-elevated)] flex items-start gap-3.5 transition-colors hover:border-[var(--accent)]"
          >
            <span class="w-7 h-7 rounded-full rx-btn-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {{ idx + 1 }}
            </span>
            <div class="space-y-1">
              <div class="text-sm font-bold text-[var(--accent)]">{{ step[0] }}</div>
              <p class="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">{{ step[1] }}</p>
            </div>
          </li>
        </ol>

        <div class="p-4 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] space-y-1.5 text-xs">
          <div class="font-bold text-[var(--accent)]">
            {{ lang === 'ar' ? 'الجهة القضائية المختصة والسند القانوني:' : 'Competent Court & Statutory Basis:' }}
          </div>
          <div class="text-[var(--ink)] font-semibold">{{ activeTrack.authority }}</div>
          <div class="text-[var(--ink-muted)]">{{ activeTrack.legalBasis }}</div>
        </div>
      </div>

      <!-- Right Column: Practical Pre-Filing Documents Checklist -->
      <div class="lg:col-span-5 space-y-5">
        <div class="rx-card-static p-6 space-y-4">
          <div class="flex items-center justify-between gap-2 border-b rx-divider pb-3">
            <div>
              <h2 class="font-bold text-base">
                {{ lang === 'ar' ? 'قائمة المستندات المطلوبة' : 'Required Documents Checklist' }}
              </h2>
              <p class="text-xs text-[var(--ink-muted)] mt-0.5">
                {{ lang === 'ar' ? 'علّم على المستندات الجاهزة لديك لمتابعة جاهزية الملف.' : 'Check off the documents you already have ready.' }}
              </p>
            </div>
            <span class="text-xs px-2.5 py-1 rx-badge-accent font-bold whitespace-nowrap">
              {{ lang === 'ar' ? `${readinessPct}٪ جاهز` : `${readinessPct}% Ready` }}
            </span>
          </div>

          <div class="w-full h-2 rounded-full bg-[var(--surface-alt)] overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :style="`width: ${readinessPct}%; background-color: var(--accent);`"
            />
          </div>

          <div class="space-y-2.5">
            <label class="flex items-start justify-between p-3 rounded-lg border rx-divider bg-[var(--surface-alt)] cursor-pointer gap-3 hover:border-[var(--accent)] transition-colors">
              <span class="text-xs font-semibold leading-relaxed">{{ activeTrack.documents[0] }}</span>
              <input v-model="doc0" type="checkbox" class="w-4 h-4 shrink-0 mt-0.5">
            </label>
            <label class="flex items-start justify-between p-3 rounded-lg border rx-divider bg-[var(--surface-alt)] cursor-pointer gap-3 hover:border-[var(--accent)] transition-colors">
              <span class="text-xs font-semibold leading-relaxed">{{ activeTrack.documents[1] }}</span>
              <input v-model="doc1" type="checkbox" class="w-4 h-4 shrink-0 mt-0.5">
            </label>
            <label class="flex items-start justify-between p-3 rounded-lg border rx-divider bg-[var(--surface-alt)] cursor-pointer gap-3 hover:border-[var(--accent)] transition-colors">
              <span class="text-xs font-semibold leading-relaxed">{{ activeTrack.documents[2] }}</span>
              <input v-model="doc2" type="checkbox" class="w-4 h-4 shrink-0 mt-0.5">
            </label>
            <label class="flex items-start justify-between p-3 rounded-lg border rx-divider bg-[var(--surface-alt)] cursor-pointer gap-3 hover:border-[var(--accent)] transition-colors">
              <span class="text-xs font-semibold leading-relaxed">{{ activeTrack.documents[3] }}</span>
              <input v-model="doc3" type="checkbox" class="w-4 h-4 shrink-0 mt-0.5">
            </label>
          </div>

          <div class="flex items-center justify-between gap-2 pt-1 text-xs">
            <button type="button" class="underline text-[var(--accent)] font-semibold" @click="selectAllDocs">
              {{ lang === 'ar' ? 'تحديد الكل' : 'Check all' }}
            </button>
            <button type="button" class="underline text-[var(--ink-muted)] hover:text-[var(--ink)]" @click="resetDocs">
              {{ lang === 'ar' ? 'إعادة ضبط' : 'Reset' }}
            </button>
          </div>
        </div>

        <div class="rx-card-double p-6 space-y-3">
          <h3 class="font-serif-editorial font-bold text-lg">
            {{ lang === 'ar' ? 'هل لديك استفسار حول إجراءات قضيتك؟' : 'Need guidance on your filing steps?' }}
          </h3>
          <p class="text-xs text-[var(--ink-muted)] leading-relaxed">
            {{ lang === 'ar'
              ? 'يمكنك التواصل مباشرة مع الأستاذ الحسين محمد عبدالله لمراجعة المستندات وتحديد المسار القانوني الأنسب.'
              : 'Reach out directly to Al Hussein Mohamed Abdallah to review your documents and discuss the proper legal procedure.' }}
          </p>
          <div class="flex flex-wrap gap-2 pt-1">
            <ResuxLink :to="contactHref" view-transition class="px-4 py-2 text-xs font-bold rx-btn-primary inline-block">
              {{ lang === 'ar' ? 'تواصل الآن ←' : 'Contact Now →' }}
            </ResuxLink>
            <a href="tel:01040542354" class="px-4 py-2 text-xs font-bold rx-btn-outline inline-block ltr-num">
              01040542354
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
