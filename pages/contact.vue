<script setup lang="ts">
import { CV_TEXT_SUMMARIES, HUSSEIN_DATA } from '../composables/portfolioContent'
import { copyTextToClipboard, normalizeLocale, showChambersToast } from '../composables/browserHelpers'
import { useContactForm, LAWYER_EMAIL } from '../composables/useContactForm'

definePageMeta({
  viewTransition: true
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

const senderName = ref('')
const senderEmail = ref('')
const senderPhone = ref('')
const selectedScopeId = ref('recruitment')
const message = ref('')

const {
  attachedFile,
  attachedFileInfo,
  fileError,
  isSubmitting,
  isSuccess,
  errorMessage,
  fieldErrors,
  submittedEntry,
  scopes,
  selectedScope,
  isEmpty,
  mailtoLink,
  handleFileUpload,
  removeAttachedFile,
  submit,
  resetForm
} = useContactForm({
  senderName,
  senderEmail,
  senderPhone,
  selectedScopeId,
  message,
  locale: () => lang.value
})

async function onFormSubmit() {
  const success = await submit()
  if (success) {
    showChambersToast(
      lang.value === 'ar'
        ? 'تم إرسال الرسالة وتأكيد التكليف بنجاح'
        : 'Inquiry & mandate registered for Al Hussein Mohamed Abdallah'
    )
  }
}

function onResetForm() {
  resetForm()
}

function onFileSelected(file: any) {
  handleFileUpload(file)
}

function onFileRemoved() {
  removeAttachedFile()
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
  <section class="space-y-8 rx-animate-in">
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
      <div class="lg:col-span-7 rx-card-static p-6 sm:p-8 space-y-5 rx-animate-in rx-stagger-1 relative overflow-hidden">
        
        <!-- Loading Progress Bar -->
        <div
          v-if="isSubmitting.value"
          class="absolute top-0 left-0 right-0 h-1 bg-[var(--accent-soft)] overflow-hidden z-20"
        >
          <div class="w-full h-full bg-[var(--accent)] animate-pulse" />
        </div>

        <!-- SUCCESS STATE -->
        <div v-if="isSuccess.value && submittedEntry.value" class="space-y-6 py-4 rx-animate-in">
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
                #RX-{{ submittedEntry.value.id }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'اسم الراسل:' : 'Sender Name:' }}</span>
                <span class="font-semibold text-[var(--ink)]">{{ submittedEntry.value.senderName }}</span>
              </div>
              <div>
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:' }}</span>
                <span class="font-semibold text-[var(--ink)]">{{ submittedEntry.value.senderEmail }}</span>
              </div>
              <div v-if="submittedEntry.value.senderPhone">
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'الهاتف / واتساب:' : 'Phone / WhatsApp:' }}</span>
                <span class="font-semibold text-[var(--ink)]" dir="ltr">{{ submittedEntry.value.senderPhone }}</span>
              </div>
              <div>
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'القطاع القانوني:' : 'Legal Sector:' }}</span>
                <span class="font-semibold text-[var(--ink)]">{{ submittedEntry.value.inquiryScope }}</span>
              </div>
              <div v-if="submittedEntry.value.attachment" class="sm:col-span-2">
                <span class="text-[var(--ink-muted)] block mb-0.5">{{ lang === 'ar' ? 'الملف المرفق:' : 'Attached File:' }}</span>
                <span class="font-semibold text-[var(--accent)] inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {{ submittedEntry.value.attachment.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Post-submission Actions -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              class="px-5 py-2.5 text-xs font-bold rx-btn-primary"
              @click="onResetForm"
            >
              {{ lang === 'ar' ? '+ إرسال رسالة أو استفسار جديد' : '+ Send Another Inquiry' }}
            </button>
            <ResuxLink
              :to="cvHref"
              view-transition
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
        <div v-else class="space-y-5">
          <div class="border-b rx-divider pb-3 flex items-center justify-between gap-3">
            <h2 class="text-base font-bold text-[var(--ink)]">
              {{ lang === 'ar'
                ? 'إرسال عرض عمل قانوني أو طلب استشارة أو تكليف قضائي'
                : 'Send a Legal Recruitment Offer, Consultation, or Mandate' }}
            </h2>
            <span class="text-[11px] font-semibold text-[var(--ink-muted)]">
              {{ lang === 'ar' ? 'موجه مباشرة إلى: ' + LAWYER_EMAIL : 'Directly to: ' + LAWYER_EMAIL }}
            </span>
          </div>

          <!-- GLOBAL ERROR ALERT -->
          <div
            v-if="errorMessage.value"
            role="alert"
            class="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 space-y-2 rx-animate-in"
          >
            <div class="flex items-center gap-2 font-bold text-xs">
              <svg class="w-4 h-4 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage.value }}</span>
            </div>
            <div class="text-[11px] pt-1 border-t border-red-500/20 flex flex-wrap items-center gap-2">
              <span>{{ lang === 'ar' ? 'أو يمكنك التواصل مباشرة عبر تطبيق بريدك:' : 'Or send directly via your email client:' }}</span>
              <a
                :href="mailtoLink"
                class="font-bold underline text-[var(--accent)] hover:opacity-80 inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ lang === 'ar' ? 'فتح تطبيق البريد الإلكتروني (Gmail / Outlook)' : 'Open in Email Client (Gmail / Outlook)' }}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <form class="space-y-4" @submit.prevent="onFormSubmit">
            <!-- Row 1: Sender Name & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="input-sender-name" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                  {{ lang === 'ar' ? 'الاسم أو مكتب المحاماة أو الشركة' : 'Name / Law Firm / Company' }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  id="input-sender-name"
                  v-model="senderName"
                  type="text"
                  required
                  :disabled="isSubmitting.value"
                  :placeholder="lang === 'ar' ? 'مثال: مكتب محاماة أو الإدارة القانونية بشركة...' : 'Managing Partner / Law Firm'"
                  class="rx-input w-full px-3 py-2.5 text-sm transition-colors"
                  :class="{ 'border-red-500 bg-red-50/20 focus:ring-red-400': fieldErrors.value && fieldErrors.value.senderName }"
                >
                <p v-if="fieldErrors.value && fieldErrors.value.senderName" class="text-xs text-red-600 font-semibold mt-1">
                  {{ fieldErrors.value.senderName }}
                </p>
              </div>

              <div>
                <label for="input-sender-email" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                  {{ lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address' }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  id="input-sender-email"
                  v-model="senderEmail"
                  type="email"
                  required
                  :disabled="isSubmitting.value"
                  :placeholder="lang === 'ar' ? 'example@lawfirm.com' : 'counsel@lawfirm.com'"
                  class="rx-input w-full px-3 py-2.5 text-sm transition-colors"
                  :class="{ 'border-red-500 bg-red-50/20 focus:ring-red-400': fieldErrors.value && fieldErrors.value.senderEmail }"
                >
                <p v-if="fieldErrors.value && fieldErrors.value.senderEmail" class="text-xs text-red-600 font-semibold mt-1">
                  {{ fieldErrors.value.senderEmail }}
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
                v-model="senderPhone"
                type="tel"
                :disabled="isSubmitting.value"
                :placeholder="lang === 'ar' ? '010XXXXXXXX أو +2010XXXXXXXX' : '+20 10X XXX XXXX'"
                class="rx-input w-full px-3 py-2.5 text-sm"
                dir="ltr"
              >
            </div>

            <!-- Row 3: Enhanced Custom Legal Sector Select -->
            <div>
              <label id="label-inquiry-scope" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                {{ lang === 'ar' ? 'نوع التواصل أو القطاع القانوني المستهدف' : 'Inquiry Scope / Target Legal Sector' }}
                <span class="text-red-500">*</span>
              </label>
              
              <!-- Custom Luxury Chambers Select Component -->
              <ChambersSelect
                id="input-inquiry-scope"
                v-model="selectedScopeId"
                :options="scopes.value"
                :disabled="isSubmitting.value"
                :locale="lang.value"
              />
            </div>

            <!-- Row 4: File Uploader Component -->
            <ChambersFileUploader
              :model-value="attachedFile"
              :file-info="attachedFileInfo"
              :error-message="fileError"
              :disabled="isSubmitting.value"
              :locale="lang.value"
              @file-selected="onFileSelected"
              @file-removed="onFileRemoved"
            />

            <!-- Row 5: Details Textarea -->
            <div>
              <label for="input-inquiry-msg" class="block text-xs font-bold mb-1.5 text-[var(--ink)]">
                {{ lang === 'ar' ? 'تفاصيل الرسالة أو الموعد المقترح' : 'Message Details or Proposed Interview Schedule' }}
                <span class="text-red-500">*</span>
              </label>
              <textarea
                id="input-inquiry-msg"
                v-model="message"
                rows="4"
                required
                :disabled="isSubmitting.value"
                :placeholder="lang === 'ar' ? 'يرجى كتابة تفاصيل الوظيفة، موضوع الاستشارة، أو الموعد المقترح للمقابلة...' : 'Share role details, legal mandate, or preferred interview schedule...'"
                class="rx-input w-full px-3 py-2.5 text-sm transition-colors"
                :class="{ 'border-red-500 bg-red-50/20 focus:ring-red-400': fieldErrors.value && fieldErrors.value.message }"
              />
              <p v-if="fieldErrors.value && fieldErrors.value.message" class="text-xs text-red-600 font-semibold mt-1">
                {{ fieldErrors.value.message }}
              </p>
            </div>

            <!-- Row 6: Submit Button, Loading Spinner & Direct Mail Fallback -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t rx-divider">
              <button
                type="submit"
                :disabled="isSubmitting.value"
                class="px-6 py-2.5 text-sm font-bold rx-btn-primary flex items-center justify-center gap-2 min-w-[180px] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                <!-- Animated Spinner during loading -->
                <svg
                  v-if="isSubmitting.value"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>

                <span>
                  {{ isSubmitting.value
                    ? (lang === 'ar' ? 'جارٍ إرسال الرسالة...' : 'Dispatching Inquiry...')
                    : (lang === 'ar' ? 'إرسال الرسالة والتكليف القانوني ←' : 'Send Legal Inquiry →') }}
                </span>
              </button>

              <!-- Optional Direct Email Action -->
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
      <div class="lg:col-span-5 space-y-5 rx-animate-in rx-stagger-2">
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
            <button type="button" class="px-3.5 py-2 text-xs font-bold rx-btn-primary" @click="copyCvSummary">
              {{ lang === 'ar' ? 'نسخ ملخص السيرة الذاتية' : 'Copy Resume Summary' }}
            </button>
            <ResuxLink :to="cvHref" view-transition class="px-3.5 py-2 text-xs font-bold rx-btn-outline inline-flex items-center">
              {{ lang === 'ar' ? 'معاينة السيرة الذاتية' : 'Open PDF Preview' }}
            </ResuxLink>
            <button type="button" class="px-3.5 py-2 text-xs font-bold rx-btn-outline" @click="copyProfileData">
              {{ lang === 'ar' ? 'نسخ البيانات المهيكلة' : 'Copy Structured Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
