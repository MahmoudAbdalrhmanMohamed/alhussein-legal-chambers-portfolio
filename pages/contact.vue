<script setup lang="ts">
import { CV_TEXT_SUMMARIES, HUSSEIN_DATA } from '../composables/portfolioContent'
import { copyTextToClipboard, normalizeLocale, showChambersToast } from '../composables/browserHelpers'

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

const scopeOptions = computed(() => (
  lang.value === 'ar'
    ? [
        'وظيفة باحث قانوني أو محامٍ بمكتب محاماة أو شركة',
        'الإدارة القانونية بالشركات وصياغة العقود',
        'قضايا الأسرة والأحوال الشخصية',
        'التقاضي المدني ودعاوى صحة التوقيع',
        'القضاء الإداري ومنازعات مجلس الدولة'
      ]
    : [
        'Legal Researcher / Junior Associate Role at a Law Firm or Company',
        'Corporate Legal Affairs & Contract Drafting',
        'Family & Personal Status Court Matters',
        'Civil Litigation & Signature Validity Lawsuits',
        'Administrative Judiciary & State Council Disputes'
      ]
))

const senderName = ref('')
const senderEmail = ref('')
const selectedScopeIndex = ref(0)
const message = ref('')
const submitting = ref(false)
const statusMessage = ref('')
const isError = ref(false)

async function handleSubmit() {
  if (!senderName.value.trim() || !senderEmail.value.trim() || !message.value.trim() || submitting.value) return
  submitting.value = true
  statusMessage.value = ''
  isError.value = false

  const capturedSender = senderName.value.trim()
  const idx = Number(selectedScopeIndex.value)
  const capturedScope = scopeOptions.value[idx] || scopeOptions.value[0]

  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        senderName: capturedSender,
        senderEmail: senderEmail.value.trim(),
        inquiryScope: capturedScope,
        message: message.value.trim()
      })
    })
    if (!response.ok) {
      isError.value = true
      statusMessage.value = lang.value === 'ar'
        ? 'تعذر تسجيل الرسالة حالياً. يرجى المحاولة مرة أخرى.'
        : 'Unable to submit your inquiry right now. Please try again.'
      return
    }
    statusMessage.value = lang.value === 'ar'
      ? `تم تسجيل رسالتك (${capturedSender} — ${capturedScope}) للأستاذ الحسين محمد عبدالله بنجاح.`
      : `Registered inquiry from ${capturedSender} (${capturedScope}) for Al Hussein Mohamed Abdallah.`
    showChambersToast(lang.value === 'ar' ? 'تم إرسال الرسالة بنجاح' : 'Inquiry registered for Al Hussein Mohamed Abdallah')
    senderName.value = ''
    senderEmail.value = ''
    message.value = ''
  } catch {
    isError.value = true
    statusMessage.value = lang.value === 'ar'
      ? 'تعذر تسجيل الرسالة حالياً. يرجى المحاولة مرة أخرى.'
      : 'Unable to submit your inquiry right now. Please try again.'
  } finally {
    submitting.value = false
  }
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
    <div class="border-b rx-divider pb-6">
      <div class="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2">
        {{ lang === 'ar'
          ? 'التواصل المباشر وعروض التوظيف والاستشارات القانونية'
          : 'Direct Chambers Contact, Legal Roles & Consultations' }}
      </div>
      <h1 class="font-serif-editorial text-3xl sm:text-4xl font-bold">
        {{ lang === 'ar' ? 'تواصل مع الأستاذ الحسين محمد عبدالله' : 'Contact Al Hussein Mohamed Abdallah' }}
      </h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-7 rx-card-static p-6 sm:p-8 space-y-5 rx-animate-in rx-stagger-1">
        <h2 class="text-base font-bold border-b rx-divider pb-3">
          {{ lang === 'ar'
            ? 'إرسال عرض عمل قانوني أو طلب استشارة أو تكليف قضائي'
            : 'Send a Legal Recruitment Offer, Consultation, or Mandate' }}
        </h2>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="input-sender-name" class="block text-xs font-bold mb-1.5">
                {{ lang === 'ar' ? 'الاسم أو مكتب المحاماة أو الشركة' : 'Name / Law Firm / Company' }}
              </label>
              <input
                id="input-sender-name"
                v-model="senderName"
                type="text"
                required
                :placeholder="lang === 'ar' ? 'مثال: مكتب محاماة أو الإدارة القانونية بشركة...' : 'Managing Partner / Law Firm'"
                class="rx-input w-full px-3 py-2 text-sm"
              >
            </div>
            <div>
              <label for="input-sender-email" class="block text-xs font-bold mb-1.5">
                {{ lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address' }}
              </label>
              <input
                id="input-sender-email"
                v-model="senderEmail"
                type="email"
                required
                :placeholder="lang === 'ar' ? 'example@lawfirm.com' : 'counsel@lawfirm.com'"
                class="rx-input w-full px-3 py-2 text-sm"
              >
            </div>
          </div>

          <div>
            <label for="input-inquiry-scope" class="block text-xs font-bold mb-1.5">
              {{ lang === 'ar' ? 'نوع التواصل أو القطاع القانوني' : 'Inquiry Scope / Legal Sector' }}
            </label>
            <select id="input-inquiry-scope" v-model="selectedScopeIndex" class="rx-input w-full px-3 py-2 text-sm">
              <option v-for="(opt, idx) in scopeOptions" :key="idx" :value="idx">
                {{ opt }}
              </option>
            </select>
          </div>

          <div>
            <label for="input-inquiry-msg" class="block text-xs font-bold mb-1.5">
              {{ lang === 'ar' ? 'تفاصيل الرسالة أو الموعد المقترح' : 'Message Details or Proposed Interview Time' }}
            </label>
            <textarea
              id="input-inquiry-msg"
              v-model="message"
              rows="4"
              required
              :placeholder="lang === 'ar' ? 'يرجى كتابة تفاصيل الوظيفة أو موضوع الاستشارة القانونية...' : 'Share role details, legal mandate, or preferred interview schedule...'"
              class="rx-input w-full px-3 py-2 text-sm"
            />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2.5 text-sm font-bold rx-btn-primary disabled:opacity-60"
            >
              {{ submitting
                ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...')
                : (lang === 'ar' ? 'إرسال الرسالة القانونية ←' : 'Send Legal Inquiry →') }}
            </button>
            <span
              v-if="statusMessage"
              :class="isError ? 'text-xs font-bold text-red-600' : 'text-xs font-bold text-[var(--accent)]'"
            >
              {{ statusMessage }}
            </span>
          </div>
        </form>
      </div>

      <div class="lg:col-span-5 space-y-5 rx-animate-in rx-stagger-2">
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
