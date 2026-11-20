<script setup lang="ts">
import { ref } from 'vue'
import type { AttachmentInfo } from '../composables/useContactForm'

const props = withDefaults(
  defineProps<{
    modelValue: File | null
    fileInfo?: AttachmentInfo | null
    errorMessage?: string | null
    disabled?: boolean
    locale?: 'ar' | 'en'
  }>(),
  {
    fileInfo: null,
    errorMessage: null,
    disabled: false,
    locale: 'ar'
  }
)

const emit = defineEmits<{
  'file-selected': [file: File]
  'file-removed': []
}>()

const fileInputRef = ref<any>(null)
const isDragging = ref(false)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileChange(event: any) {
  const target: any = event?.target
  const file = target?.files?.[0]
  if (file) {
    emit('file-selected', file)
  }
  // Reset input value so re-selecting same file triggers change
  if (target) {
    target.value = ''
  }
}

function onDragOver(event: any) {
  event?.preventDefault?.()
  isDragging.value = true
}

function onDragLeave(event: any) {
  event?.preventDefault?.()
  isDragging.value = false
}

function onDrop(event: any) {
  event?.preventDefault?.()
  isDragging.value = false
  const file = event?.dataTransfer?.files?.[0]
  if (file) {
    emit('file-selected', file)
  }
}

function removeFile() {
  emit('file-removed')
}

function formatSize(bytes: number): string {
  if (!bytes) return '0 B'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-xs font-bold text-[var(--ink)]">
      {{ locale === 'ar' ? 'إرفاق مستند أو أوراق قانونية (اختياري)' : 'Attach Document or Legal Papers (Optional)' }}
    </label>

    <!-- Hidden Native File Input -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
      class="hidden"
      :disabled="disabled"
      @change="onFileChange"
    >

    <!-- Uploaded State -->
    <div
      v-if="modelValue && fileInfo"
      class="flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] shadow-sm rx-animate-in"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="truncate text-start">
          <div class="text-xs font-bold truncate text-[var(--ink)]" :title="fileInfo.name">
            {{ fileInfo.name }}
          </div>
          <div class="text-[11px] text-[var(--ink-muted)]">
            {{ formatSize(fileInfo.size) }} • {{ locale === 'ar' ? 'جاهز للإرسال' : 'Ready to dispatch' }}
          </div>
        </div>
      </div>

      <button
        type="button"
        :disabled="disabled"
        class="p-1.5 rounded-md text-[var(--ink-muted)] hover:text-red-600 hover:bg-red-500/10 transition-colors shrink-0"
        :title="locale === 'ar' ? 'إزالة الملف المرفق' : 'Remove attached file'"
        @click="removeFile"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="sr-only">{{ locale === 'ar' ? 'إزالة الملف' : 'Remove file' }}</span>
      </button>
    </div>

    <!-- Empty State / Drag and Drop Area -->
    <div
      v-else
      class="group relative border-2 border-dashed rounded-lg p-4 sm:p-5 text-center transition-all cursor-pointer"
      :class="[
        isDragging
          ? 'border-[var(--accent)] bg-[var(--accent-soft)] scale-[1.01]'
          : errorMessage
            ? 'border-red-400 bg-red-50/20'
            : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-alt)]',
        disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
      ]"
      role="button"
      tabindex="0"
      @click="triggerFileInput"
      @keydown.enter.prevent="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div class="flex flex-col items-center justify-center gap-1.5">
        <div class="w-10 h-10 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--ink-muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] flex items-center justify-center transition-colors shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <div class="text-xs font-semibold text-[var(--ink)]">
          {{ locale === 'ar' ? 'اسحب المستند هنا أو اضغط للاختيار' : 'Drag file here or click to browse' }}
        </div>

        <div class="text-[11px] text-[var(--ink-muted)]">
          {{ locale === 'ar' ? 'صيغ PDF، Word، أو صور (الحد الأقصى 10 ميجابايت)' : 'PDF, Word, or images (Max 10 MB)' }}
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="text-xs font-semibold text-red-600 flex items-center gap-1.5 rx-animate-in">
      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>
