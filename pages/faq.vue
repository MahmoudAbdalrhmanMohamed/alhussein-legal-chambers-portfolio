<script setup lang="ts">
import { HUSSEIN_DATA } from '../composables/portfolioContent'
import { normalizeLocale } from '../composables/browserHelpers'

definePageMeta({
  viewTransition: true
})

const i18n = useI18n()
const lang = computed(() => normalizeLocale(i18n.locale.value))
const profile = computed(() => HUSSEIN_DATA[lang.value])

const pageTitle = lang.value === 'ar'
  ? 'الدليل القانوني والنطاق القضائي | الحسين محمد عبدالله'
  : 'Legal Guide & Court Jurisdiction Coverage | Al Hussein Mohamed Abdallah'
const pageDesc = lang.value === 'ar'
  ? 'إجابات مباشرة حول مؤهلات وخبرات الأستاذ الحسين محمد عبدالله والنطاق الجغرافي للمحاكم في الجيزة والقاهرة الكبرى ومجلس الدولة.'
  : 'Direct legal guide covering Al Hussein Mohamed Abdallah’s credentials, court jurisdictions across Giza and Greater Cairo, and practice areas.'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  twitterTitle: pageTitle,
  twitterDescription: pageDesc
})

const openGuideIndex = ref(0)

function toggleGuideItem(idx: number) {
  openGuideIndex.value = openGuideIndex.value === idx ? -1 : idx
}
</script>

<template>
  <section class="space-y-10 rx-animate-in">
    <div class="border-b rx-divider pb-6">
      <div class="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
        {{ lang === 'ar'
          ? 'الدليل القانوني والاختصاص المكاني للمحاكم'
          : 'Legal Guide & Territorial Court Coverage' }}
      </div>
      <h1 class="font-serif-editorial text-3xl sm:text-4xl font-bold">
        {{ lang === 'ar'
          ? 'الدليل القانوني ونطاق العمل أمام المحاكم المصرية'
          : 'Legal Guide & Egyptian Court Jurisdiction Coverage' }}
      </h1>
      <p class="text-sm text-[var(--ink-muted)] mt-2 max-w-3xl leading-relaxed">
        {{ lang === 'ar'
          ? 'إجابات مباشرة وواضحة لمكاتب المحاماة والشركات والموكلين حول المؤهلات القانونية، ومناطق التغطية القضائية، وقطاعات الممارسة العملية.'
          : 'Clear, direct answers for law firms, corporate legal teams, and clients regarding credentials, court coverage, and legal practice scope.' }}
      </p>
    </div>

    <div class="space-y-4 rx-animate-in rx-stagger-1">
      <h2 class="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
        {{ profile.jurisdictionHeading }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article
          v-for="(area, idx) in profile.jurisdictionCards"
          :key="idx"
          class="rx-card p-5 space-y-2.5"
        >
          <span class="inline-block text-xs font-bold px-2.5 py-0.5 rx-badge-accent">{{ area.region }}</span>
          <h3 class="font-serif-editorial font-bold text-lg leading-snug">{{ area.courts }}</h3>
          <p class="text-xs text-[var(--ink-muted)] leading-relaxed">{{ area.details }}</p>
        </article>
      </div>
    </div>

    <div class="space-y-4 rx-animate-in rx-stagger-2">
      <h2 class="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
        {{ profile.guideHeading }}
      </h2>
      <div class="space-y-3">
        <div
          v-for="(item, idx) in profile.guideItems"
          :key="idx"
          class="rx-card-static overflow-hidden transition-colors"
        >
          <button
            type="button"
            :aria-expanded="openGuideIndex === idx ? 'true' : 'false'"
            :aria-controls="`guide-panel-${idx}`"
            class="w-full px-5 py-4 text-start flex items-center justify-between gap-4 hover:bg-[var(--surface-alt)] transition-colors"
            @click="toggleGuideItem(idx)"
          >
            <span class="font-serif-editorial font-bold text-base sm:text-lg leading-snug">{{ item.q }}</span>
            <span
              class="shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-sm text-sm font-bold transition-colors"
              :class="openGuideIndex === idx ? 'rx-badge-accent' : 'rx-badge'"
              aria-hidden="true"
            >
              {{ openGuideIndex === idx ? '−' : '+' }}
            </span>
          </button>
          <div
            v-if="openGuideIndex === idx"
            :id="`guide-panel-${idx}`"
            class="rx-accordion-body px-5 pb-4 pt-3 border-t rx-divider text-sm text-[var(--ink-muted)] leading-relaxed bg-[var(--surface-elevated)]"
          >
            {{ item.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
