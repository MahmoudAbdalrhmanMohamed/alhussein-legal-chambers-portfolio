<script setup lang="ts">
import { HUSSEIN_DATA } from '../composables/portfolioContent'
import { normalizeLocale } from '../composables/browserHelpers'

definePageMeta({
  viewTransition: true
})

const i18n = useI18n()
const lang = computed(() => normalizeLocale(i18n.locale.value))
const profile = computed(() => HUSSEIN_DATA[lang.value])
const contactHref = computed(() => i18n.localePath('/contact'))

const pageTitle = lang.value === 'ar'
  ? 'مكاتب المحاماة وسجل القضايا | الحسين محمد عبدالله'
  : 'Law Offices & Litigation Dockets | Al Hussein Mohamed Abdallah'
const pageDesc = lang.value === 'ar'
  ? 'الخبرات القانونية العملية للأستاذ الحسين محمد عبدالله في أربعة مكاتب محاماة متخصصة بين ٢٠٢٤ و٢٠٢٦.'
  : 'Chronological legal training across four specialized Egyptian law offices (2024–2026) covering Family, Civil, and State Council courts.'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  twitterTitle: pageTitle,
  twitterDescription: pageDesc
})

const searchQuery = ref('')
const activeCategory = ref('ALL')
const selectedOfficeId = ref('')

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return profile.value.items.filter((item) => {
    const matchCat = activeCategory.value === 'ALL' || item.category === activeCategory.value
    const hay = `${item.title} ${item.subtitle} ${item.badge} ${item.highlights.join(' ')}`.toLowerCase()
    return matchCat && (!query || hay.includes(query))
  })
})

const activeDetailItem = computed(() => {
  if (!selectedOfficeId.value) return null
  return profile.value.items.find((x) => x.id === selectedOfficeId.value) ?? null
})

function setCategory(cat: string) {
  activeCategory.value = cat
}

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
</script>

<template>
  <section class="space-y-8 rx-animate-in">
    <div class="border-b rx-divider pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="text-xs font-bold tracking-wider text-[var(--accent)] mb-2">
          {{ profile.workEyebrow }}
        </div>
        <h1 class="font-serif-editorial text-3xl sm:text-4xl font-bold">
          {{ profile.workTitle }}
        </h1>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="profile.searchPlaceholder"
          class="rx-input px-3 py-2 text-sm w-64"
        >
      </div>
    </div>

    <!-- Jurisdiction Filter Tabs -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="cat in profile.categories"
        :key="cat"
        type="button"
        :class="activeCategory === cat ? 'px-3.5 py-1.5 text-xs font-bold rx-btn-primary' : 'px-3.5 py-1.5 text-xs font-bold rx-btn-outline'"
        @click="setCategory(cat)"
      >
        {{ profile.categoryLabels[cat] || cat }}
      </button>
    </div>

    <!-- Law Office Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-if="!filteredItems.length"
        class="col-span-full rx-card-static p-8 text-center text-sm text-[var(--ink-muted)]"
      >
        {{ lang === 'ar' ? 'لا توجد نتائج مطابقة للبحث. يرجى مسح كلمة البحث أعلاه.' : 'No matching law office dockets found. Clear the filter or search input above.' }}
      </div>

      <article
        v-for="item in filteredItems"
        :key="item.id"
        class="rx-card p-6 flex flex-col justify-between space-y-4"
      >
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2 text-xs">
            <span class="px-2.5 py-0.5 rx-badge-brass font-bold">{{ item.year }}</span>
            <span class="px-2.5 py-0.5 rx-badge-accent font-bold">{{ item.badge }}</span>
          </div>
          <h3 class="font-serif-editorial text-xl font-bold leading-snug">{{ item.title }}</h3>
          <p class="text-xs text-[var(--ink-muted)] font-semibold">{{ item.subtitle }}</p>
          <ul class="space-y-2 pt-2 text-xs text-[var(--ink-muted)] list-disc ps-4 leading-relaxed">
            <li v-for="(h, idx) in item.highlights" :key="idx">{{ h }}</li>
          </ul>
        </div>
        <div class="pt-3 border-t rx-divider flex items-center justify-between gap-2">
          <button type="button" class="px-3.5 py-1.5 text-xs font-bold rx-btn-outline" @click="openDetailModal(item.id)">
            {{ lang === 'ar' ? 'استعراض السجل الكامل' : 'Inspect Full Case Record' }}
          </button>
          <ResuxLink :to="contactHref" view-transition class="text-xs font-bold underline hover:text-[var(--accent)]">
            {{ lang === 'ar' ? 'تواصل بخصوص الخبرة ←' : 'Inquire About Experience →' }}
          </ResuxLink>
        </div>
      </article>
    </div>

    <!-- Detail Modal -->
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
          <ul class="space-y-2.5 list-disc ps-5 text-sm leading-relaxed">
            <li v-for="(h, idx) in activeDetailItem.highlights" :key="idx">{{ h }}</li>
          </ul>
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
