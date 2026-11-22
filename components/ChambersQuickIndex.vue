<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useQuickIndex } from '../composables/useQuickIndex'

const props = defineProps<{
  locale?: string
}>()

const activeLocale = computed(() => {
  const l: any = props.locale
  return (l && l.value !== undefined ? l.value : l) || 'ar'
})

const quickIndex = useQuickIndex(activeLocale as any)

const isOpen = computed(() => quickIndex.isOpen.value)
const searchQuery = computed({
  get: () => quickIndex.searchQuery.value,
  set: (val: string) => { quickIndex.searchQuery.value = val }
})
const activeCategory = computed(() => quickIndex.activeCategory.value)
const isLoading = computed(() => quickIndex.isLoading.value)
const isError = computed(() => quickIndex.isError.value)
const errorMessage = computed(() => quickIndex.errorMessage.value)
const focusedIndex = computed(() => quickIndex.focusedIndex.value)
const filteredItems = computed(() => quickIndex.filteredItems.value)
const resultsCount = computed(() => quickIndex.resultsCount.value)
const isEmpty = computed(() => quickIndex.isEmpty.value)

const searchInputRef = ref<HTMLInputElement | null>(null)

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => {
      setTimeout(() => {
        if (searchInputRef.value) {
          searchInputRef.value.focus()
        }
      }, 50)
    })
  }
})

function onBackdropClick(event: any) {
  if (event && event.target === event.currentTarget) {
    onClose()
  }
}

function onPanelClick(event: any) {
  if (event && event.stopPropagation) {
    event.stopPropagation()
  }
}

function onClose() {
  quickIndex.close()
}

function onRetry() {
  quickIndex.retry()
}

function onSearchInput(event: any) {
  const target = event?.target
  quickIndex.searchQuery.value = target ? target.value : ''
}

function clearSearch() {
  quickIndex.searchQuery.value = ''
  if (searchInputRef.value) {
    searchInputRef.value.focus()
  }
}

function isSpecialLink(href: string) {
  return href.startsWith('tel:') || href.startsWith('mailto:') || href.endsWith('.pdf')
}

function navigateToItem(href: string) {
  onClose()
  if (typeof window !== 'undefined') {
    if (isSpecialLink(href)) {
      window.location.href = href
    } else {
      try {
        navigateTo(href)
      } catch {
        window.location.href = href
      }
    }
  }
}

function onSelectCat(cat: 'ALL' | 'pages' | 'offices' | 'dockets' | 'procedures' | 'faq' | 'contact') {
  quickIndex.selectCategory(cat)
}

function handleKeyDown(e: any) {
  if (e.key === 'Escape') {
    e.preventDefault()
    onClose()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    quickIndex.nextItem()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    quickIndex.prevItem()
  } else if (e.key === 'Enter') {
    const item = quickIndex.selectFocused()
    if (item) {
      e.preventDefault()
      navigateToItem(item.href)
    }
  }
}
</script>

<template>
  <!-- Full-Screen Modal Dialog with Pure CSS / Resumable Visibility -->
  <div
    v-if="isOpen"
    id="rx-cmd-modal"
    role="dialog"
    aria-modal="true"
    :aria-label="activeLocale === 'ar' ? 'الفهرس السريع والبحث' : 'Quick Index & Global Search'"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs pt-12 sm:pt-20 p-3 sm:p-4 rx-modal-backdrop rx-animate-in"
    @click="onBackdropClick"
    @keydown="handleKeyDown"
  >
    <div
      class="rx-card-static max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden rx-modal-panel"
      @click="onPanelClick"
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
                {{ activeLocale === 'ar' ? 'الفهرس القانوني السريع والبحث' : 'Quick Legal Index & Search' }}
              </h2>
              <p class="text-[11px] text-[var(--ink-muted)] truncate mt-0.5">
                {{ activeLocale === 'ar'
                  ? 'ابحث في كافة مكاتب المحاماة، الدعاوى، خطوات التقاضي، والسيرة الذاتية'
                  : 'Search law offices, litigation dockets, court steps, and credentials' }}
              </p>
            </div>
          </div>

          <button
            id="btn-cmd-close"
            type="button"
            class="px-2.5 py-1 text-xs font-semibold rx-btn-outline rounded-lg shrink-0 flex items-center gap-1.5 hover:bg-red-500/10 hover:text-red-600 transition-colors cursor-pointer"
            :title="activeLocale === 'ar' ? 'إغلاق الفهرس (Esc)' : 'Close Index (Esc)'"
            @click="onClose"
          >
            <span>{{ activeLocale === 'ar' ? 'إغلاق' : 'Close' }}</span>
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
            ref="searchInputRef"
            :value="searchQuery"
            type="text"
            autofocus
            :placeholder="activeLocale === 'ar' ? 'اكتب للبحث (مثال: صحة توقيع، نفقات، خلع، مجلس الدولة، حلوان...)' : 'Type to search (e.g. Signature validity, Alimony, Khula, State Council...)'"
            class="rx-input w-full ps-10 pe-9 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all"
            @input="onSearchInput"
          >
          <button
            v-if="searchQuery"
            type="button"
            class="absolute end-3 p-1 rounded-md text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            :title="activeLocale === 'ar' ? 'مسح البحث' : 'Clear Search'"
            @click="clearSearch"
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
            @click="onSelectCat('ALL')"
          >
            {{ activeLocale === 'ar' ? 'الكل' : 'All' }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'pages'"
            :class="activeCategory === 'pages' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
            @click="onSelectCat('pages')"
          >
            {{ activeLocale === 'ar' ? 'الصفحات' : 'Pages' }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'offices'"
            :class="activeCategory === 'offices' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
            @click="onSelectCat('offices')"
          >
            {{ activeLocale === 'ar' ? 'مكاتب المحاماة' : 'Law Offices' }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'dockets'"
            :class="activeCategory === 'dockets' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
            @click="onSelectCat('dockets')"
          >
            {{ activeLocale === 'ar' ? 'القضايا والمحاكم' : 'Dockets & Courts' }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'procedures'"
            :class="activeCategory === 'procedures' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
            @click="onSelectCat('procedures')"
          >
            {{ activeLocale === 'ar' ? 'الإجراءات' : 'Procedures' }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'faq'"
            :class="activeCategory === 'faq' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
            @click="onSelectCat('faq')"
          >
            {{ activeLocale === 'ar' ? 'الأسئلة' : 'FAQ' }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'contact'"
            :class="activeCategory === 'contact' ? 'px-2.5 py-1 rounded-md font-bold rx-btn-primary text-xs shrink-0 cursor-pointer' : 'px-2.5 py-1 rounded-md font-semibold rx-btn-outline text-xs shrink-0 cursor-pointer'"
            @click="onSelectCat('contact')"
          >
            {{ activeLocale === 'ar' ? 'الاتصال والملفات' : 'Contact & CV' }}
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
            <span>{{ activeLocale === 'ar' ? 'جارٍ تحميل وفهرسة السجلات القانونية...' : 'Indexing legal records and dockets...' }}</span>
          </div>

          <!-- Skeleton pulse item placeholders -->
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
            {{ activeLocale === 'ar' ? 'تعذر تحميل بيانات الفهرس القانوني السريع' : 'Failed to load quick index data' }}
          </div>
          <p class="text-xs text-[var(--ink-muted)] max-w-sm mx-auto">
            {{ errorMessage || (activeLocale === 'ar' ? 'حدث خطأ مؤقت أثناء مزامنة الفهرس. يرجى المحاولة مرة أخرى.' : 'A temporary error occurred while syncing the index. Please retry.') }}
          </p>
          <button
            type="button"
            class="px-4 py-1.5 text-xs font-bold rx-btn-primary inline-flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
            @click="onRetry"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ activeLocale === 'ar' ? 'إعادة المحاولة الآن' : 'Retry Now' }}</span>
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
            {{ activeLocale === 'ar' ? 'لم يتم العثور على نتائج مطابقة' : 'No matching results found' }}
          </div>
          <p class="text-xs max-w-sm mx-auto">
            {{ activeLocale === 'ar'
              ? `لا توجد نتائج تطابق "${searchQuery}". جرب البحث باسم محكمة، نوع دعوى (صحة توقيع، نفقة، خلع)، أو تصفح الأقسام.`
              : `No dockets or records matched "${searchQuery}". Try searching by court, lawsuit type, or browse categories above.` }}
          </p>
          <div class="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              class="px-3.5 py-1.5 text-xs font-semibold rx-btn-outline rounded-lg cursor-pointer"
              @click="clearSearch"
            >
              {{ activeLocale === 'ar' ? 'مسح كلمة البحث' : 'Clear search query' }}
            </button>
            <button
              v-if="activeCategory !== 'ALL'"
              type="button"
              class="px-3.5 py-1.5 text-xs font-semibold rx-btn-primary rounded-lg cursor-pointer"
              @click="onSelectCat('ALL')"
            >
              {{ activeLocale === 'ar' ? 'عرض كافة الأقسام' : 'Show all categories' }}
            </button>
          </div>
        </div>

        <!-- 4. ACTIVE RESULTS LIST -->
        <div v-else class="space-y-1">
          <template v-for="(item, idx) in filteredItems" :key="item.id">
            <!-- External / Direct link (tel, mailto, pdf) -->
            <a
              v-if="isSpecialLink(item.href)"
              :href="item.href"
              :target="item.href.endsWith('.pdf') ? '_blank' : undefined"
              rel="noopener"
              role="option"
              :aria-selected="idx === focusedIndex"
              class="group w-full text-start p-3 rounded-xl flex items-center justify-between gap-3 transition-colors border block cursor-pointer border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-alt)] hover:border-[var(--accent)] select-none"
              @click="onClose"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs transition-colors shadow-xs"
                  :class="idx === focusedIndex ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)]'"
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
                  class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold"
                  :class="idx === focusedIndex ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-alt)] text-[var(--ink-muted)] border border-[var(--border)]'"
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
                  :class="activeLocale === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activeLocale === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'" />
                </svg>
              </div>
            </a>

            <!-- Internal route via ResuxLink with view-transition -->
            <ResuxLink
              v-else
              :to="item.href"
              view-transition
              role="option"
              :aria-selected="idx === focusedIndex"
              class="group w-full text-start p-3 rounded-xl flex items-center justify-between gap-3 transition-colors border block cursor-pointer border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-alt)] hover:border-[var(--accent)] select-none"
              @click="onClose"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs transition-colors shadow-xs"
                  :class="idx === focusedIndex ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)]'"
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
                  class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold"
                  :class="idx === focusedIndex ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-alt)] text-[var(--ink-muted)] border border-[var(--border)]'"
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
                  :class="activeLocale === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activeLocale === 'ar' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'" />
                </svg>
              </div>
            </ResuxLink>
          </template>
        </div>
      </div>

      <!-- Modal Footer with Keyboard Shortcuts and Result Counter -->
      <div class="p-3 sm:px-5 sm:py-2.5 border-t rx-divider bg-[var(--surface)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--ink-muted)]">
        <div class="flex items-center gap-3">
          <span class="font-semibold">
            {{ activeLocale === 'ar' ? `النتائج المتاحة: ${resultsCount}` : `Results: ${resultsCount}` }}
          </span>
        </div>

        <div class="hidden sm:flex items-center gap-3 text-[11px]">
          <span class="inline-flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] font-mono-code text-[10px]">↑↓</kbd>
            <span>{{ activeLocale === 'ar' ? 'للتنقل' : 'Navigate' }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] font-mono-code text-[10px]">↵</kbd>
            <span>{{ activeLocale === 'ar' ? 'للاختيار' : 'Select' }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)] font-mono-code text-[10px]">Esc</kbd>
            <span>{{ activeLocale === 'ar' ? 'للإغلاق' : 'Close' }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
