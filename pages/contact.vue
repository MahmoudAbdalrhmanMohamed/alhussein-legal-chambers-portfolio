<script setup lang="ts">
import { CV_TEXT_SUMMARIES, HUSSEIN_DATA } from '../composables/portfolioContent'
import {
  copyTextToClipboard,
  focusContactErrorDom,
  normalizeLocale,
  resetFileInputDom,
  scheduleAsyncDomTask,
  showChambersToast,
  syncContactFormDomInputs,
  syncScopeSelectionDom,
  toggleSelectDropdownDom,
  triggerFileInputDom,
  triggerResumableActionDom
} from '../composables/browserHelpers'
import {
  useContactForm,
  buildMailtoLink,
  LAWYER_EMAIL,
  getLegalScopeOptions
} from '../composables/useContactForm'

definePageMeta({
  viewTransition: false
})

const i18n = useI18n()
const lang = computed(() => normalizeLocale(i18n.locale.value))
const profile = computed(() => HUSSEIN_DATA[lang.value])
const cvHref = computed(() => i18n.localePath('/cv'))

const pageTitle = lang.value === 'ar'
  ? 'التواصل المباشر والتكليف القانوني | الحسين محمد عبدالله'
  : 'Contact & Legal Mandate Dispatch | Al Hussein Mohamed Abdallah'
const pageDesc = lang.value === 'ar'
  ? 'تواصل مباشرة مع الأستاذ الحسين محمد عبدالله (01040542354 — بولاق الدكرور، الجيزة) لعروض التوظيف القانونية والاستشارات.'
  : 'Direct contact form and official Egyptian Bar Association coordinates for Al Hussein Mohamed Abdallah in Giza, Egypt.'

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  twitterTitle: pageTitle,
  twitterDescription: pageDesc
})

const senderName = useState('contact_sender_name', () => '')
const senderEmail = useState('contact_sender_email', () => '')
const senderPhone = useState('contact_sender_phone', () => '')
const selectedScopeId = useState('contact_selected_scope_id', () => 'recruitment')
const message = useState('contact_message', () => '')

// Created via Resux setupContext so every template binding and computed tracks live changes
const attachedFile = ref<any>(null)
const attachedFileInfo = ref<any>(null)
const fileError = ref('')
const isFileLoading = ref(false)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const errorCode = ref<any>('')
const fieldErrors = ref<Record<string, string>>({})
const submittedEntry = ref<any>(null)
const pendingOutcome = ref<'success' | 'error' | ''>('')
const activeSubmitToken = ref(0)

const {
  getSelectedScope,
  clearFieldErrorIfValid,
  prepareFileUpload,
  completeFileUploadAsync,
  removeAttachedFile,
  prepareSubmission,
  dispatchPreparedSubmission,
  clearErrorState,
  resetForm
} = useContactForm({
  senderName,
  senderEmail,
  senderPhone,
  selectedScopeId,
  message,
  locale: () => lang.value,
  attachedFile,
  attachedFileInfo,
  fileError,
  isFileLoading,
  isSubmitting,
  isSuccess,
  errorMessage,
  errorCode,
  fieldErrors,
  submittedEntry
})

const scopes = computed(() => getLegalScopeOptions(lang.value))

// Custom Luxury Select State & Handlers
const selectOpen = ref(false)
const isSelectOpen = computed(() => Boolean(selectOpen.value))
const focusedOptionIndex = ref(0)

const currentScope = computed(() => {
  const list = scopes.value || []
  return list.find((s) => s.id === selectedScopeId.value) || list[0]
})

function toggleSelectDropdown() {
  if (isBusy.value) return
  selectOpen.value = !selectOpen.value
  toggleSelectDropdownDom(selectOpen.value)
  if (selectOpen.value) {
    const list = scopes.value || []
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === selectedScopeId.value) {
        focusedOptionIndex.value = i
        break
      }
    }
  }
}

function closeSelectDropdown() {
  selectOpen.value = false
  toggleSelectDropdownDom(false)
}

function chooseScope(id: string) {
  selectedScopeId.value = id
  closeSelectDropdown()
  const list = scopes.value || []
  let found = list[0]
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.id === id) {
      found = item
      break
    }
  }
  if (found) {
    syncScopeSelectionDom(id, found.label, found.description)
  }
}

function onChooseScope(id: string) {
  chooseScope(id)
}

function onRemoveAttachedFile() {
  removeAttachedFile()
  resetFileInputDom()
}

function onSelectKeyDown(e: any) {
  if (isBusy.value) return
  const list = scopes.value || []
  if (e.key === 'Escape') {
    e.preventDefault()
    closeSelectDropdown()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!selectOpen.value) {
      selectOpen.value = true
    } else {
      focusedOptionIndex.value = (focusedOptionIndex.value + 1) % list.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!selectOpen.value) {
      selectOpen.value = true
    } else {
      focusedOptionIndex.value = (focusedOptionIndex.value - 1 + list.length) % list.length
    }
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (selectOpen.value) {
      e.preventDefault()
      const item = list[focusedOptionIndex.value]
      if (item) {
        chooseScope(item.id)
      }
    }
  }
}

// Custom Luxury File Uploader State & Handlers
const isDraggingFile = ref(false)

function onDropzoneKeyDown(e: any) {
  if (isBusy.value) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    triggerFileInputDom()
  }
}

function startAsyncFileRead(file: File) {
  const validFile = prepareFileUpload(file)
  if (!validFile) {
    resetFileInputDom()
    return
  }
  scheduleAsyncDomTask(async () => {
    await completeFileUploadAsync(validFile)
    if (fileError.value) {
      resetFileInputDom()
    }
    triggerResumableActionDom('rx-file-settled-trigger')
  })
}

function onFileInputChange(event: any) {
  if (isBusy.value) return
  const target = event?.target
  const file = target?.files?.[0]
  if (file) {
    startAsyncFileRead(file)
  }
}

function onFileDragOver(event: any) {
  if (isBusy.value) return
  event?.preventDefault?.()
  isDraggingFile.value = true
}

function onFileDragLeave(event: any) {
  event?.preventDefault?.()
  isDraggingFile.value = false
}

function onFileDrop(event: any) {
  if (isBusy.value) return
  event?.preventDefault?.()
  isDraggingFile.value = false
  const file = event?.dataTransfer?.files?.[0]
  if (file) {
    startAsyncFileRead(file)
  }
}

function onFileSettled() {
  // Runs after async FileReader finishes so Resux runtime patches the DOM immediately
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '0 B'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const isFormSubmitted = ref(false)
const receiptData = ref<any>({
  id: 0,
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  inquiryScope: '',
  attachment: null
})
const isFormLoading = computed(() => Boolean(isSubmitting.value))
const isBusy = computed(() => Boolean(isSubmitting.value || isFileLoading.value))
const formError = computed(() => errorMessage.value || '')
const formErrorCode = computed(() => errorCode.value || '')
const errors = computed(() => fieldErrors.value || {})
const errorCount = computed(() => Object.keys(fieldErrors.value || {}).length)
const attachedDoc = computed(() => attachedFileInfo.value)
const docError = computed(() => fileError.value || '')
const docLoading = computed(() => Boolean(isFileLoading.value))
const mailtoLink = computed(() =>
  buildMailtoLink({
    locale: lang.value,
    scopeLabel: getSelectedScope().label,
    senderName: senderName.value,
    senderEmail: senderEmail.value,
    senderPhone: senderPhone.value,
    message: message.value,
    attachedFileName: attachedFileInfo.value?.name
  })
)

function syncInputs() {
  const domValues = syncContactFormDomInputs()
  if (domValues.name !== undefined) senderName.value = domValues.name
  if (domValues.email !== undefined) senderEmail.value = domValues.email
  if (domValues.phone !== undefined) senderPhone.value = domValues.phone
  if (domValues.scopeId !== undefined) selectedScopeId.value = domValues.scopeId
  if (domValues.message !== undefined) message.value = domValues.message
}

function onFieldInput(field: 'senderName' | 'senderEmail' | 'senderPhone' | 'message', event: any) {
  const val = event?.target?.value ?? ''
  if (field === 'senderName') senderName.value = val
  else if (field === 'senderEmail') senderEmail.value = val
  else if (field === 'senderPhone') senderPhone.value = val
  else if (field === 'message') message.value = val

  if (field !== 'senderPhone') {
    clearFieldErrorIfValid(field)
  }
}

function onFormSubmit() {
  if (isSubmitting.value || isFileLoading.value) return
  closeSelectDropdown()
  syncInputs()

  const payload = prepareSubmission()
  if (!payload) {
    focusContactErrorDom(fieldErrors.value, 'rx-form-error-alert')
    return
  }

  const token = ++activeSubmitToken.value
  scheduleAsyncDomTask(async () => {
    const result = await dispatchPreparedSubmission(payload)
    if (token !== activeSubmitToken.value) return

    if (result.ok && result.entry) {
      receiptData.value = result.entry
      isFormSubmitted.value = true
      pendingOutcome.value = 'success'
    } else {
      pendingOutcome.value = 'error'
    }
    triggerResumableActionDom('rx-submit-settled-trigger')
  })
}

function onSubmitSettled() {
  const outcome = pendingOutcome.value
  pendingOutcome.value = ''
  if (outcome === 'success') {
    showChambersToast(
      lang.value === 'ar'
        ? 'تم إرسال الرسالة وتأكيد التكليف بنجاح'
        : 'Inquiry & mandate registered for Al Hussein Mohamed Abdallah'
    )
  } else if (outcome === 'error') {
    focusContactErrorDom(fieldErrors.value, 'rx-form-error-alert')
  }
}

function onDismissFormError() {
  clearErrorState()
}

function onResetForm() {
  activeSubmitToken.value += 1
  resetForm()
  resetFileInputDom()
  isFormSubmitted.value = false
  pendingOutcome.value = ''
  receiptData.value = {
    id: 0,
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    inquiryScope: '',
    attachment: null
  }
  selectOpen.value = false
}

function copyCvSummary() {
  copyTextToClipboard(
    CV_TEXT_SUMMARIES[lang.value],
    lang.value === 'ar' ? 'تم نسخ ملخص السيرة الذاتية بنجاح' : 'Copied Al Hussein CV summary to clipboard'
  )
}

function copyProfileData() {
  copyTextToClipboard(
    JSON.stringify(HUSSEIN_DATA[lang.value], null, 2),
    lang.value === 'ar' ? 'تم نسخ بيانات الملف المهني بنجاح' : 'Copied structured legal profile data'
  )
}
</script>

<template>
  <section class="space-y-8">
    <!-- Header -->
    <div class="border-b rx-divider pb-6">
      <div class="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
        {{ lang === 'ar'
          ? 'التواصل المباشر وعروض التوظيف والاستشارات القانونية'
          : 'Direct Chambers Contact, Legal Roles & Consultations' }}
      </div>
      <h1 class="font-serif-editorial text-3xl sm:text-4xl font-bold">
        {{ lang === 'ar' ? 'تواصل مع الأستاذ الحسين محمد عبدالله' : 'Contact Al Hussein Mohamed Abdallah' }}
      </h1>
      <p class="text-xs sm:text-sm text-[var(--ink-muted)] mt-2 leading-relaxed">
        {{ lang === 'ar'
          ? 'يمكنك إرسال عروض العمل القانونية، طلبات الاستشارة، أو التكليف بمتابعة القضايا أمام المحاكم المصرية. يتم استقبال الرسائل مباشرة وتأكيد استلامها.'
          : 'Dispatch recruitment offers, legal consultation inquiries, or litigation mandates before Egyptian courts. Messages are delivered directly to chambers.' }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Main Contact Form Section -->
      <div class="lg:col-span-7 rx-card-static p-6 sm:p-8 relative overflow-visible">
        <!-- Internal zero-hydration settled hooks so Resux patches DOM immediately on async completion -->
        <button
          id="rx-submit-settled-trigger"
          type="button"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
          @click="onSubmitSettled"
        />
        <button
          id="rx-file-settled-trigger"
          type="button"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
          @click="onFileSettled"
        />

        <!-- Indeterminate Top Progress Bar -->
        <div
          v-if="isFormLoading"
          id="rx-form-loading-bar"
          aria-hidden="true"
          class="absolute top-0 left-0 right-0 h-1.5 bg-[var(--accent-soft)] overflow-hidden z-20 rounded-t-xl"
        >
          <div class="h-full bg-[var(--accent)] rx-indeterminate-bar rounded-full" />
        </div>

        <!-- SUCCESS STATE -->
        <div v-show="isFormSubmitted" id="rx-success-state" class="space-y-6 py-4 rx-animate-in">
          <div class="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
            <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="space-y-1">
              <h2 class="text-base font-bold">
                {{ lang === 'ar'
                  ? 'تم إرسال رسالتك وتأكيد التكليف بنجاح!'
                  : 'Inquiry & Legal Mandate Successfully Dispatched!' }}
              </h2>
              <p class="text-xs leading-relaxed opacity-90">
                {{ lang === 'ar'
                  ? `شكراً لتواصلك، تم إرسال تفاصيل رسالتك إلى البريد الإلكتروني الرسمي (${LAWYER_EMAIL}) وسيتم الرد عليك في أقرب وقت.`
                  : `Thank you for reaching out. Your message details were dispatched to (${LAWYER_EMAIL}) and you will receive a response shortly.` }}
              </p>
            </div>
          </div>

          <!-- Structured Receipt Card -->
          <div class="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3.5 text-xs">
            <div class="flex items-center justify-between border-b rx-divider pb-2.5">
              <span class="font-bold text-[var(--accent)]">
                {{ lang === 'ar' ? 'إشعار استلام رسمي رقم:' : 'Official Dispatch Receipt #:' }}
              </span>
              <span class="font-mono font-bold text-[var(--ink)]">
                #RX-{{ receiptData.id || '' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'اسم الراسل:' : 'Sender Name:' }}</span>
                <span class="font-semibold text-[var(--ink)]">{{ receiptData.senderName || '' }}</span>
              </div>
              <div>
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:' }}</span>
                <span class="font-semibold text-[var(--ink)]">{{ receiptData.senderEmail || '' }}</span>
              </div>
              <div v-if="receiptData.senderPhone">
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'الهاتف / واتساب:' : 'Phone / WhatsApp:' }}</span>
                <span class="font-semibold text-[var(--ink)]" dir="ltr">{{ receiptData.senderPhone || '' }}</span>
              </div>
              <div>
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'القطاع القانوني:' : 'Legal Sector:' }}</span>
                <span class="font-semibold text-[var(--ink)]">{{ receiptData.inquiryScope || '' }}</span>
              </div>
              <div v-if="receiptData.attachment" class="sm:col-span-2">
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'الملف المرفق:' : 'Attached File:' }}</span>
                <span class="font-semibold text-[var(--accent)] inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {{ receiptData.attachment.name || '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Post-submission Actions -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              class="px-5 py-2.5 text-xs font-bold rx-btn-primary cursor-pointer"
              @click="onResetForm"
            >
              {{ lang === 'ar' ? '+ إرسال رسالة أو استفسار جديد' : '+ Send Another Inquiry' }}
            </button>
            <ResuxLink
              :to="cvHref"
              class="px-5 py-2.5 text-xs font-bold rx-btn-outline inline-flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ lang === 'ar' ? 'معاينة السيرة الذاتية (PDF)' : 'View Official PDF Resume' }}
            </ResuxLink>
          </div>
        </div>

        <!-- FORM STATE (Empty, Filling, Loading, Error) -->
        <div v-show="!isFormSubmitted">
          <div class="border-b rx-divider pb-3 mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-base font-bold text-[var(--ink)]">
              {{ lang === 'ar'
                ? 'إرسال عرض عمل قانوني أو طلب استشارة أو تكليف قضائي'
                : 'Send a Legal Recruitment Offer, Consultation, or Mandate' }}
            </h2>
            <span class="text-[11px] font-semibold text-[var(--ink-muted)]">
              {{ lang === 'ar' ? 'موجه مباشرة إلى: ' + LAWYER_EMAIL : 'Directly to: ' + LAWYER_EMAIL }}
            </span>
          </div>

          <!-- LOADING STATUS BANNER -->
          <div
            v-if="isFormLoading"
            id="rx-form-loading-banner"
            role="status"
            aria-live="polite"
            class="mb-5 p-3.5 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--ink)] flex items-center gap-3 text-xs rx-animate-in"
          >
            <svg class="w-4 h-4 animate-spin text-[var(--accent)] shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div class="space-y-0.5">
              <div class="font-bold text-[var(--accent)]">
                {{ lang === 'ar' ? 'جارٍ إرسال رسالتك إلى المكتب القانوني...' : 'Sending inquiry to Legal Chambers...' }}
              </div>
              <div class="text-[11px] text-[var(--ink-muted)]">
                {{ lang === 'ar'
                  ? 'يتم الآن توثيق البيانات وتجهيز إشعار الاستلام، يرجى الانتظار قليلاً.'
                  : 'Registering your mandate details and preparing receipt confirmation. Please wait.' }}
              </div>
            </div>
          </div>

          <!-- GLOBAL ERROR ALERT -->
          <div
            v-if="formError"
            id="rx-form-error-alert"
            role="alert"
            aria-live="assertive"
            tabindex="-1"
            class="mb-5 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300 space-y-2.5 rx-animate-in focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-2.5">
                <svg class="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-bold text-xs">
                      {{ formErrorCode === 'VALIDATION_ERROR'
                        ? (lang === 'ar' ? 'يرجى استكمال الحقول المطلوبة' : 'Please Fix Required Fields')
                        : (lang === 'ar' ? 'تعذر إتمام الإرسال حالياً' : 'Submission Error Occurred') }}
                    </span>
                    <span
                      v-if="formErrorCode === 'VALIDATION_ERROR' && errorCount > 0"
                      class="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-[10px] font-bold"
                    >
                      {{ lang === 'ar' ? `${errorCount} أخطاء تحتاج للمراجعة` : `${errorCount} field(s) need attention` }}
                    </span>
                  </div>
                  <p class="text-xs leading-relaxed">
                    {{ formError }}
                  </p>
                </div>
              </div>

              <button
                id="rx-error-dismiss-btn"
                type="button"
                class="p-1 rounded-lg hover:bg-red-500/15 text-red-600 dark:text-red-300 transition-colors shrink-0 cursor-pointer"
                :aria-label="lang === 'ar' ? 'إغلاق التنبيه' : 'Dismiss alert'"
                @click="onDismissFormError"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="text-[11px] pt-2 border-t border-red-500/20 flex flex-wrap items-center justify-between gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-if="formErrorCode !== 'VALIDATION_ERROR'"
                  id="rx-retry-submit-btn"
                  type="button"
                  :disabled="isBusy"
                  class="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                  @click="onFormSubmit"
                >
                  {{ lang === 'ar' ? 'إعادة المحاولة الآن' : 'Retry Sending' }}
                </button>
                <a
                  :href="mailtoLink"
                  class="font-bold underline text-[var(--accent)] hover:opacity-80 inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ lang === 'ar' ? 'الإرسال عبر تطبيق البريد (Gmail / Outlook)' : 'Open in Email Client (Gmail / Outlook)' }}
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <form
            id="rx-contact-form"
            class="space-y-4"
            novalidate
            :aria-busy="isFormLoading ? 'true' : 'false'"
            @submit.prevent="onFormSubmit"
          >
            <!-- Row 1: Sender Name & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="input-sender-name" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                  {{ lang === 'ar' ? 'الاسم أو مكتب المحاماة أو الشركة' : 'Name / Law Firm / Company' }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  id="input-sender-name"
                  type="text"
                  required
                  :value="senderName"
                  :disabled="isBusy"
                  :aria-invalid="errors && errors.senderName ? 'true' : 'false'"
                  :aria-describedby="errors && errors.senderName ? 'err-sender-name' : undefined"
                  :placeholder="lang === 'ar' ? 'مثال: مكتب محاماة أو الإدارة القانونية بشركة...' : 'Managing Partner / Law Firm'"
                  :class="[
                    'rx-input w-full px-3 py-2.5 text-sm transition-colors',
                    errors && errors.senderName ? 'rx-input-error' : ''
                  ]"
                  @input="onFieldInput('senderName', $event)"
                >
                <p
                  v-if="errors && errors.senderName"
                  id="err-sender-name"
                  role="alert"
                  class="text-xs text-red-600 dark:text-red-400 font-semibold mt-1.5 flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ errors.senderName }}</span>
                </p>
              </div>

              <div>
                <label for="input-sender-email" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                  {{ lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address' }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  id="input-sender-email"
                  type="email"
                  required
                  :value="senderEmail"
                  :disabled="isBusy"
                  :aria-invalid="errors && errors.senderEmail ? 'true' : 'false'"
                  :aria-describedby="errors && errors.senderEmail ? 'err-sender-email' : undefined"
                  :placeholder="lang === 'ar' ? 'example@lawfirm.com' : 'counsel@lawfirm.com'"
                  :class="[
                    'rx-input w-full px-3 py-2.5 text-sm transition-colors',
                    errors && errors.senderEmail ? 'rx-input-error' : ''
                  ]"
                  @input="onFieldInput('senderEmail', $event)"
                >
                <p
                  v-if="errors && errors.senderEmail"
                  id="err-sender-email"
                  role="alert"
                  class="text-xs text-red-600 dark:text-red-400 font-semibold mt-1.5 flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ errors.senderEmail }}</span>
                </p>
              </div>
            </div>

            <!-- Row 2: Phone / WhatsApp (Optional) -->
            <div>
              <label for="input-sender-phone" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                {{ lang === 'ar' ? 'رقم الهاتف أو واتساب للتواصل السريع (اختياري)' : 'Phone or WhatsApp Number for Fast Contact (Optional)' }}
              </label>
              <input
                id="input-sender-phone"
                type="tel"
                :value="senderPhone"
                :disabled="isBusy"
                :placeholder="lang === 'ar' ? '010XXXXXXXX أو +2010XXXXXXXX' : '+20 10X XXX XXXX'"
                class="rx-input w-full px-3 py-2.5 text-sm"
                dir="ltr"
                @input="onFieldInput('senderPhone', $event)"
              >
            </div>

            <!-- Row 3: Ultra-Luxury Chambers Legal Sector Custom Select -->
            <div class="relative text-start" @keydown="onSelectKeyDown">
              <label id="label-inquiry-scope" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                {{ lang === 'ar' ? 'نوع التواصل أو القطاع القانوني المستهدف' : 'Inquiry Scope / Target Legal Sector' }}
                <span class="text-red-500">*</span>
              </label>

              <!-- Hidden native select for 100% standard form & autofill compatibility -->
              <select
                id="native-scope-select"
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
                :value="selectedScopeId"
              >
                <option
                  v-for="opt in scopes"
                  :key="opt.id"
                  :value="opt.id"
                  :selected="selectedScopeId === opt.id"
                >
                  {{ opt.label }}
                </option>
              </select>

              <!-- Transparent backdrop overlay when select is open -->
              <div
                id="scope-select-backdrop"
                v-show="selectOpen"
                class="fixed inset-0 z-40 bg-black/10 backdrop-blur-[0.5px] cursor-default"
                aria-hidden="true"
                @click="closeSelectDropdown"
              />

              <!-- Luxury Select Trigger Button -->
              <button
                id="input-inquiry-scope"
                type="button"
                role="combobox"
                :aria-expanded="selectOpen ? 'true' : 'false'"
                aria-haspopup="listbox"
                aria-controls="scope-options-listbox"
                :disabled="isBusy"
                :class="[
                  'relative w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-all shadow-xs z-20',
                  selectOpen
                    ? 'border-[var(--accent)] ring-2 ring-[var(--accent-soft)] bg-[var(--surface-elevated)] shadow-lg'
                    : 'border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:shadow-sm',
                  isBusy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                ]"
                @click="toggleSelectDropdown"
              >
                <div class="flex items-center gap-3.5 min-w-0">
                  <!-- Scope Icon Container -->
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[var(--accent)] bg-[var(--accent-soft)] shadow-inner transition-colors"
                  >
                    <!-- Briefcase -->
                    <svg v-if="currentScope.icon === 'briefcase'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect width="20" height="14" x="2" y="7" rx="2" stroke-width="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke-width="2" />
                    </svg>
                    <!-- Building -->
                    <svg v-else-if="currentScope.icon === 'building'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect width="16" height="20" x="4" y="2" rx="2" stroke-width="2" />
                      <path d="M9 22v-4h6v4" stroke-width="2" />
                      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" stroke-width="2" />
                    </svg>
                    <!-- Scales -->
                    <svg v-else-if="currentScope.icon === 'scales'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18M3 7h18M6 7l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" />
                    </svg>
                    <!-- Gavel -->
                    <svg v-else-if="currentScope.icon === 'gavel'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 13l-4 4m0 0l-4-4m4 4V3m-4 18h8" />
                    </svg>
                    <!-- Shield -->
                    <svg v-else-if="currentScope.icon === 'shield'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <!-- Default Chat -->
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>

                  <!-- Text Preview -->
                  <div class="text-start truncate">
                    <div id="scope-trigger-label" class="font-bold text-sm text-[var(--ink)] truncate leading-tight">
                      {{ currentScope.label }}
                    </div>
                    <div id="scope-trigger-desc" class="text-xs text-[var(--ink-muted)] truncate mt-0.5">
                      {{ currentScope.description }}
                    </div>
                  </div>
                </div>

                <!-- Right Side Badge & Chevron -->
                <div class="flex items-center gap-2 shrink-0">
                  <span class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold rx-badge-accent">
                    {{ lang === 'ar' ? 'القطاع المختار' : 'Selected' }}
                  </span>
                  <svg
                    :class="[
                      'w-5 h-5 transition-transform duration-200 shrink-0',
                      selectOpen ? 'rotate-180 text-[var(--accent)]' : 'text-[var(--ink-muted)]'
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <!-- Luxury Dropdown Popover Panel -->
              <div
                v-show="selectOpen"
                id="scope-options-listbox"
                role="listbox"
                aria-label="Legal Sectors"
                class="absolute start-0 end-0 z-50 mt-2 p-2 rounded-2xl border-2 border-[var(--accent)]/30 bg-[var(--surface-elevated)] shadow-2xl space-y-1 max-h-96 overflow-y-auto"
              >
                <!-- Popover Header -->
                <div class="px-3 py-2 border-b rx-divider flex items-center justify-between text-xs">
                  <span class="font-bold text-[var(--ink-muted)]">
                    {{ lang === 'ar' ? 'اختر القطاع القانوني أو موضوع التكليف القضائي:' : 'Select Target Legal Jurisdiction or Mandate:' }}
                  </span>
                  <span class="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--ink-muted)]">
                    {{ lang === 'ar' ? '6 قطاعات متاحة' : '6 Legal Sectors' }}
                  </span>
                </div>

                <!-- Options List (100% Pure CSS Hover - Zero Flickering, Instant Clicks) -->
                <button
                  v-for="opt in scopes"
                  :key="opt.id"
                  type="button"
                  role="option"
                  :data-scope-id="opt.id"
                  :data-scope-label="opt.label"
                  :data-scope-desc="opt.description"
                  :aria-selected="selectedScopeId === opt.id ? 'true' : 'false'"
                  :class="[
                    'w-full text-start p-3 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer border select-none rx-scope-option',
                    selectedScopeId === opt.id
                      ? 'bg-[var(--accent-soft)] border-[var(--accent)] shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-alt)] hover:border-[var(--accent)]'
                  ]"
                  @click="onChooseScope(opt.id)"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      :class="[
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                        selectedScopeId === opt.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-alt)] text-[var(--accent)] border border-[var(--border)]'
                      ]"
                    >
                      <!-- Briefcase -->
                      <svg v-if="opt.icon === 'briefcase'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect width="20" height="14" x="2" y="7" rx="2" stroke-width="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke-width="2" />
                      </svg>
                      <!-- Building -->
                      <svg v-else-if="opt.icon === 'building'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect width="16" height="20" x="4" y="2" rx="2" stroke-width="2" />
                        <path d="M9 22v-4h6v4" stroke-width="2" />
                      </svg>
                      <!-- Scales -->
                      <svg v-else-if="opt.icon === 'scales'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18M3 7h18M6 7l-3 7h6l-3-7zm12 0l-3 7h6l-3-7z" />
                      </svg>
                      <!-- Gavel -->
                      <svg v-else-if="opt.icon === 'gavel'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 13l-4 4m0 0l-4-4m4 4V3m-4 18h8" />
                      </svg>
                      <!-- Shield -->
                      <svg v-else-if="opt.icon === 'shield'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <!-- Chat -->
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>

                    <div class="truncate">
                      <div class="text-xs sm:text-sm font-bold text-[var(--ink)] truncate">
                        {{ opt.label }}
                      </div>
                      <div class="text-[11px] text-[var(--ink-muted)] truncate mt-0.5">
                        {{ opt.description }}
                      </div>
                    </div>
                  </div>

                  <!-- Active Checkmark Indicator -->
                  <div v-if="selectedScopeId === opt.id" class="w-6 h-6 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Row 4: Ultra-Luxury File Uploader Component -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-[var(--ink)] py-2">
                {{ lang === 'ar' ? 'إرفاق مستند أو أوراق قانونية (اختياري)' : 'Attach Legal Document or Mandate File (Optional)' }}
              </label>

              <!-- Hidden native file input -->
              <input
                id="fileInputEl"
                type="file"
                class="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                :disabled="isBusy"
                @change="onFileInputChange"
              >

              <!-- FILE LOADING STATE -->
              <div
                v-if="docLoading"
                id="rx-file-loading-card"
                role="status"
                aria-live="polite"
                class="p-4 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-soft)] flex items-center gap-3 text-xs rx-animate-in"
              >
                <div class="w-10 h-10 rounded-lg bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div class="space-y-0.5">
                  <div class="font-bold text-[var(--accent)]">
                    {{ lang === 'ar' ? 'جارٍ قراءة وتجهيز المستند...' : 'Reading and preparing attachment...' }}
                  </div>
                  <div class="text-[11px] text-[var(--ink-muted)]">
                    {{ lang === 'ar' ? 'يرجى الانتظار لحظة حتى يكتمل تحميل الملف.' : 'Please wait a moment while the file finishes processing.' }}
                  </div>
                </div>
              </div>

              <!-- EMPTY / DROPZONE STATE (Native Semantic Label for 100% Zero-Hydration & Native Click) -->
              <label
                v-else-if="!attachedDoc"
                for="fileInputEl"
                tabindex="0"
                role="button"
                :aria-label="lang === 'ar' ? 'انقر لاختيار ملف أو اسحب الملف وأفلته هنا' : 'Click to select a file or drag & drop here'"
                :class="[
                  'block border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-all select-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]',
                  isDraggingFile
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] ring-2 ring-[var(--accent-soft)]'
                    : docError
                      ? 'border-red-500/60 bg-red-500/5 hover:border-red-500'
                      : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-alt)]',
                  isBusy ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                ]"
                @keydown="onDropzoneKeyDown"
                @dragover="onFileDragOver"
                @dragleave="onFileDragLeave"
                @drop="onFileDrop"
              >
                <div class="w-12 h-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div class="text-xs sm:text-sm font-bold text-[var(--ink)] mb-1">
                  {{ lang === 'ar' ? 'انقر لاختيار ملف أو اسحب الملف وأفلته هنا' : 'Click to select a file or drag & drop here' }}
                </div>
                <p class="text-[11px] text-[var(--ink-muted)] max-w-sm mx-auto">
                  {{ lang === 'ar'
                    ? 'الملفات المدعومة: PDF، Word (DOCX)، الصور (PNG/JPG/WebP) — بحد أقصى 10 ميجابايت'
                    : 'Supported: PDF, Word (DOCX), Images (PNG/JPG/WebP) — up to 10 MB' }}
                </p>
              </label>

              <!-- SELECTED FILE ATTACHMENT CARD -->
              <div
                v-else
                id="rx-attached-file-card"
                class="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 flex items-center justify-between gap-3 text-xs rx-animate-in shadow-xs"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="truncate">
                    <div class="font-bold text-[var(--ink)] truncate">
                      {{ attachedDoc.name }}
                    </div>
                    <div class="flex items-center gap-2 text-[11px] text-[var(--ink-muted)] mt-0.5">
                      <span>{{ formatBytes(attachedDoc.size) }}</span>
                      <span>•</span>
                      <span class="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {{ lang === 'ar' ? '✓ تم تجهيز الملف للإرفاق' : '✓ Ready to dispatch' }}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  :disabled="isBusy"
                  :class="[
                    'px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors',
                    isBusy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  ]"
                  :title="lang === 'ar' ? 'حذف الملف المرفق' : 'Remove attached file'"
                  @click="onRemoveAttachedFile"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{{ lang === 'ar' ? 'حذف' : 'Remove' }}</span>
                </button>
              </div>

              <!-- FILE ERROR MESSAGE -->
              <div
                v-if="docError"
                id="rx-file-error-alert"
                role="alert"
                class="p-3 rounded-lg border border-red-500/35 bg-red-500/10 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 rx-animate-in"
              >
                <svg class="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ docError }}</span>
              </div>
            </div>

            <!-- Row 5: Details Textarea -->
            <div>
              <label for="input-inquiry-msg" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                {{ lang === 'ar' ? 'تفاصيل الرسالة أو الموعد المقترح' : 'Message Details or Proposed Interview Schedule' }}
                <span class="text-red-500">*</span>
              </label>
              <textarea
                id="input-inquiry-msg"
                rows="4"
                required
                :value="message"
                :disabled="isBusy"
                :aria-invalid="errors && errors.message ? 'true' : 'false'"
                :aria-describedby="errors && errors.message ? 'err-inquiry-message' : undefined"
                :placeholder="lang === 'ar' ? 'يرجى كتابة تفاصيل الوظيفة، موضوع الاستشارة، أو الموعد المقترح للمقابلة...' : 'Share role details, legal mandate, or preferred interview schedule...'"
                :class="[
                  'rx-input w-full px-3 py-2.5 text-sm transition-colors',
                  errors && errors.message ? 'rx-input-error' : ''
                ]"
                @input="onFieldInput('message', $event)"
              ></textarea>
              <p
                v-if="errors && errors.message"
                id="err-inquiry-message"
                role="alert"
                class="text-xs text-red-600 dark:text-red-400 font-semibold mt-1.5 flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ errors.message }}</span>
              </p>
            </div>

            <!-- Row 6: Submit Button, Loading Spinner & Direct Mail Fallback -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t rx-divider">
              <button
                id="rx-submit-btn"
                type="submit"
                :disabled="isBusy"
                :aria-busy="isFormLoading ? 'true' : 'false'"
                :class="[
                  'px-6 py-2.5 text-sm font-bold rx-btn-primary flex items-center justify-center gap-2 min-w-[215px] transition-all shadow-sm',
                  isBusy ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                ]"
              >
                <!-- Animated Spinner during loading -->
                <svg
                  v-if="isBusy"
                  class="animate-spin h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>

                <span>
                  {{ isFormLoading
                    ? (lang === 'ar' ? 'جارٍ إرسال الرسالة والتكليف...' : 'Dispatching Inquiry...')
                    : docLoading
                      ? (lang === 'ar' ? 'جارٍ تجهيز الملف المرفق...' : 'Preparing Attachment...')
                      : (lang === 'ar' ? 'إرسال الرسالة والتكليف القانوني ←' : 'Send Legal Inquiry →') }}
                </span>
              </button>

              <!-- Direct Email Action -->
              <a
                :href="mailtoLink"
                class="text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5"
                title="Open in your default email client"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{{ lang === 'ar' ? 'أو الإرسال عبر تطبيق البريد مباشرة' : 'Or open in your email client' }}</span>
              </a>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Column: Official Bar Credentials & Quick CV Access -->
      <div class="lg:col-span-5 space-y-5">
        <!-- Official Bar Credentials Card -->
        <div class="rx-card-double p-6 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] border-b rx-divider pb-2">
            {{ lang === 'ar' ? 'بيانات الاتصال الرسمية والقيد النقابي' : 'Official Contact Coordinates & Bar Credentials' }}
          </h3>
          <div class="space-y-3 text-sm">
            <div
              v-for="(coord, idx) in profile.contactCoordinates"
              :key="idx"
              class="flex items-baseline justify-between gap-3 border-b rx-divider pb-2 last:border-b-0 last:pb-0"
            >
              <span class="text-xs text-[var(--ink-muted)]">{{ coord[0] }}</span>
              <span class="text-xs font-bold text-end">{{ coord[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Direct CV Actions Card -->
        <div class="rx-card-static p-6 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] border-b rx-divider pb-2">
            {{ lang === 'ar' ? 'الوصول السريع إلى السيرة الذاتية' : 'Quick Curriculum Vitae Access' }}
          </h3>
          <p class="text-xs text-[var(--ink-muted)] leading-relaxed">
            {{ lang === 'ar'
              ? 'يمكنك نسخ ملخص السيرة الذاتية مباشرة إلى الحافظة أو الانتقال لمعاينة وتحميل ملف السيرة الذاتية الرسمي.'
              : 'Copy Al Hussein Mohamed Abdallah’s resume summary directly to your clipboard or open the official PDF preview.' }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="px-3.5 py-2 text-xs font-bold rx-btn-primary cursor-pointer" @click="copyCvSummary">
              {{ lang === 'ar' ? 'نسخ ملخص السيرة الذاتية' : 'Copy Resume Summary' }}
            </button>
            <ResuxLink :to="cvHref" class="px-3.5 py-2 text-xs font-bold rx-btn-outline inline-flex items-center">
              {{ lang === 'ar' ? 'معاينة السيرة الذاتية' : 'Open PDF Preview' }}
            </ResuxLink>
            <button type="button" class="px-3.5 py-2 text-xs font-bold rx-btn-outline cursor-pointer" @click="copyProfileData">
              {{ lang === 'ar' ? 'نسخ البيانات المهيكلة' : 'Copy Structured Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
