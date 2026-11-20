<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { ScopeOption } from '../composables/useContactForm'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: ScopeOption[]
    disabled?: boolean
    id?: string
    locale?: 'ar' | 'en'
    hasError?: boolean
  }>(),
  {
    disabled: false,
    id: 'chambers-select',
    locale: 'ar',
    hasError: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const containerRef = ref<any>(null)
const focusedIndex = ref(0)

const optionsList = computed(() => props.options || [])
const currentVal = computed(() => props.modelValue)
const optionsCount = computed(() => optionsList.value.length)

const selectedOption = computed(() => {
  return optionsList.value.find((o) => o.id === currentVal.value) || optionsList.value[0]
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    for (let i = 0; i < optionsList.value.length; i++) {
      const opt = optionsList.value[i]
      if (opt && opt.id === currentVal.value) {
        focusedIndex.value = i
        break
      }
    }
  }
}

function closeDropdown() {
  isOpen.value = false
}

function selectOption(id: string) {
  emit('update:modelValue', id)
  closeDropdown()
}

function handleKeyDown(e: any) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeDropdown()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!isOpen.value) {
      isOpen.value = true
    } else {
      const len = optionsCount.value || 1
      focusedIndex.value = (focusedIndex.value + 1) % len
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!isOpen.value) {
      isOpen.value = true
    } else {
      const len = optionsCount.value || 1
      focusedIndex.value = (focusedIndex.value - 1 + len) % len
    }
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (isOpen.value) {
      const target = optionsList.value[focusedIndex.value]
      if (target) {
        selectOption(target.id)
      }
    } else {
      isOpen.value = true
    }
  } else if (e.key === 'Tab') {
    if (isOpen.value) {
      closeDropdown()
    }
  }
}

function handleClickOutside(event: any) {
  if (!containerRef.value) return
  const target = event.target as Node
  if (!containerRef.value.contains(target)) {
    closeDropdown()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('pointerdown', handleClickOutside)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointerdown', handleClickOutside)
  }
})
</script>

<template>
  <div ref="containerRef" class="relative w-full text-start" @keydown="handleKeyDown">
    <!-- Trigger Button -->
    <button
      :id="id"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="'listbox'"
      :aria-controls="id + '-listbox'"
      :disabled="disabled"
      class="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none"
      :class="[
        hasError
          ? 'border-red-500 focus:ring-2 focus:ring-red-400 bg-red-50/20'
          : isOpen
            ? 'border-[var(--accent)] ring-2 ring-[var(--accent-soft)] shadow-md'
            : 'border-[var(--border)] hover:border-[var(--accent)]',
        'bg-[var(--surface-elevated)] text-[var(--ink)]',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      ]"
      @click="toggleDropdown"
    >
      <div class="flex items-center gap-3 min-w-0">
        <!-- Scope Icon -->
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[var(--accent)] bg-[var(--accent-soft)]"
        >
          <!-- Briefcase Icon -->
          <svg
            v-if="selectedOption?.icon === 'briefcase'"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect width="20" height="14" x="2" y="7" rx="2" stroke-width="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke-width="2" />
          </svg>
          <!-- Corporate / Building Icon -->
          <svg
            v-else-if="selectedOption?.icon === 'building'"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect width="16" height="20" x="4" y="2" rx="2" stroke-width="2" />
            <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" stroke-width="2" />
          </svg>
          <!-- Scales of Justice Icon -->
          <svg
            v-else-if="selectedOption?.icon === 'scales'"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" stroke-width="2" />
          </svg>
          <!-- Gavel Icon -->
          <svg
            v-else-if="selectedOption?.icon === 'gavel'"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="m14 13-7.5 7.5c-.8.8-2.2.8-3 0a2.1 2.1 0 0 1 0-3l7.5-7.5M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8" stroke-width="2" />
          </svg>
          <!-- Shield Icon -->
          <svg
            v-else-if="selectedOption?.icon === 'shield'"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" />
          </svg>
          <!-- Chat / General Icon -->
          <svg
            v-else
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2" />
          </svg>
        </div>

        <div class="text-start truncate">
          <div class="font-bold text-sm truncate leading-tight">
            {{ selectedOption?.label }}
          </div>
          <div class="text-xs text-[var(--ink-muted)] truncate mt-0.5">
            {{ selectedOption?.description }}
          </div>
        </div>
      </div>

      <!-- Animated Chevron Arrow -->
      <svg
        class="w-5 h-5 shrink-0 text-[var(--ink-muted)] transition-transform duration-200"
        :class="{ 'rotate-180 text-[var(--accent)]': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Accessible Dropdown Menu -->
    <div
      v-if="isOpen"
      :id="id + '-listbox'"
      role="listbox"
      :aria-labelledby="id"
      class="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl p-1.5 space-y-1 focus:outline-none rx-animate-in"
      tabindex="-1"
    >
      <div
        v-for="(option, idx) in options"
        :key="option.id"
        role="option"
        :aria-selected="option.id === modelValue"
        class="flex items-center justify-between gap-3 p-2.5 rounded-lg cursor-pointer transition-colors"
        :class="[
          option.id === modelValue
            ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-bold'
            : idx === focusedIndex
              ? 'bg-[var(--surface-alt)] text-[var(--ink)]'
              : 'hover:bg-[var(--surface-alt)] text-[var(--ink)]'
        ]"
        @click="selectOption(option.id)"
        @mouseenter="focusedIndex = idx"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs"
            :class="option.id === modelValue ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--ink-muted)] border border-[var(--border)]'"
          >
            <!-- Briefcase -->
            <svg v-if="option.icon === 'briefcase'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="20" height="14" x="2" y="7" rx="2" stroke-width="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke-width="2" />
            </svg>
            <!-- Building -->
            <svg v-else-if="option.icon === 'building'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="16" height="20" x="4" y="2" rx="2" stroke-width="2" />
              <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" stroke-width="2" />
            </svg>
            <!-- Scales -->
            <svg v-else-if="option.icon === 'scales'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" stroke-width="2" />
            </svg>
            <!-- Gavel -->
            <svg v-else-if="option.icon === 'gavel'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="m14 13-7.5 7.5c-.8.8-2.2.8-3 0a2.1 2.1 0 0 1 0-3l7.5-7.5M16 16l6-6M8 8l6-6M9 7l8 8M21 11l-8-8" stroke-width="2" />
            </svg>
            <!-- Shield -->
            <svg v-else-if="option.icon === 'shield'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" />
            </svg>
            <!-- Chat -->
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2" />
            </svg>
          </div>

          <div class="truncate text-start">
            <div class="text-sm font-semibold truncate leading-tight">
              {{ option.label }}
            </div>
            <div class="text-xs text-[var(--ink-muted)] truncate mt-0.5">
              {{ option.description }}
            </div>
          </div>
        </div>

        <!-- Checkmark if selected -->
        <svg
          v-if="option.id === modelValue"
          class="w-4 h-4 text-[var(--accent)] shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  </div>
</template>
