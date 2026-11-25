export interface ScopeOption {
  id: string
  label: string
  description: string
  icon: string
}

export interface AttachmentInfo {
  name: string
  size: number
  type: string
  base64: string
}

export interface InquiryRecord {
  id: number
  senderName: string
  senderEmail: string
  senderPhone?: string
  inquiryScope: string
  message: string
  attachment?: {
    name: string
    size: number
    type: string
  }
  createdAt: string
  emailSent?: boolean
}

export interface ReactiveRef<T> {
  value: T
}

export type ContactErrorCode =
  | ''
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'PAYLOAD_TOO_LARGE'
  | 'SERVER_ERROR'
  | 'FILE_ERROR'

export type ValidatableField = 'senderName' | 'senderEmail' | 'message'

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const SUBMIT_TIMEOUT_MS = 25000 // 25s serverless-safe timeout
export const MIN_NAME_LENGTH = 2
export const MIN_MESSAGE_LENGTH = 10
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp']
export const LAWYER_EMAIL = 'hm8550845@gmail.com'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function createFallbackRef<T>(initial: T): ReactiveRef<T> {
  return { value: initial }
}

export function getLegalScopeOptions(locale: 'ar' | 'en'): ScopeOption[] {
  if (locale === 'ar') {
    return [
      {
        id: 'recruitment',
        label: 'وظيفة باحث قانوني أو محامٍ بمكتب أو شركة',
        description: 'عروض التعيين والتعاقد المهني للباحثين والمحامين المتدربين',
        icon: 'briefcase'
      },
      {
        id: 'corporate',
        label: 'الإدارة القانونية بالشركات وصياغة العقود',
        description: 'صياغة العقود ومراجعة اللوائح وتوفيق الأوضاع القانونية للشركات',
        icon: 'building'
      },
      {
        id: 'family',
        label: 'قضايا الأسرة والأحوال الشخصية',
        description: 'دعاوى النفقات والخلع والطلاق للضرر وإثبات الحضانة والولاية التعليمية',
        icon: 'scales'
      },
      {
        id: 'civil',
        label: 'التقاضي المدني ودعاوى صحة التوقيع',
        description: 'صحة التوقيع، صحة ونفاذ العقود، دعاوى التعويض والملكية',
        icon: 'gavel'
      },
      {
        id: 'admin',
        label: 'القضاء الإداري ومنازعات مجلس الدولة',
        description: 'دعاوى التسويات الوظيفية، بدل رصيد الإجازات، والطعون الإدارية',
        icon: 'shield'
      },
      {
        id: 'general',
        label: 'استشارة قانونية أو استفسار عام',
        description: 'استفسارات قانونية متنوعة وتحديد موعد جلسة استشارية',
        icon: 'chat'
      }
    ]
  }

  return [
    {
      id: 'recruitment',
      label: 'Legal Researcher / Junior Associate Role',
      description: 'Law firm hiring, corporate in-house counsel, and recruitment offers',
      icon: 'briefcase'
    },
    {
      id: 'corporate',
      label: 'Corporate Legal Affairs & Contract Drafting',
      description: 'Drafting commercial contracts, regulatory compliance, and legal audits',
      icon: 'building'
    },
    {
      id: 'family',
      label: 'Family & Personal Status Court Matters',
      description: 'Alimony, Khula, divorce for harm, educational guardianship & custody',
      icon: 'scales'
    },
    {
      id: 'civil',
      label: 'Civil Litigation & Signature Validity Lawsuits',
      description: 'Article 45 signature validity, contract execution, property disputes',
      icon: 'gavel'
    },
    {
      id: 'admin',
      label: 'Administrative Judiciary & State Council Disputes',
      description: 'Public employment settlements, leave allowances, administrative appeals',
      icon: 'shield'
    },
    {
      id: 'general',
      label: 'General Legal Consultation or Meeting Request',
      description: 'General legal advice, consultation scheduling, and initial case review',
      icon: 'chat'
    }
  ]
}

export function buildMailtoLink(params: {
  locale: 'ar' | 'en'
  scopeLabel: string
  senderName: string
  senderEmail: string
  senderPhone: string
  message: string
  attachedFileName?: string
}): string {
  const scope = params.scopeLabel || 'General Legal Inquiry'
  const name = params.senderName.trim() || 'Client'
  const phone = params.senderPhone.trim() ? `\nالهاتف / Phone: ${params.senderPhone.trim()}` : ''
  const fileNotice = params.attachedFileName ? `\n(يوجد ملف مرفق: ${params.attachedFileName})` : ''

  const subject = encodeURIComponent(`[استفسار قانوني / Legal Inquiry] ${scope} - ${name}`)
  const body = encodeURIComponent(
    `الاسم / Name: ${name}\nالبريد / Email: ${params.senderEmail.trim()}${phone}\nالقطاع / Scope: ${scope}${fileNotice}\n\nنص الرسالة / Message:\n${params.message.trim()}`
  )
  return `mailto:${LAWYER_EMAIL}?subject=${subject}&body=${body}`
}

export interface UseContactFormOptions {
  senderName: ReactiveRef<string>
  senderEmail: ReactiveRef<string>
  senderPhone: ReactiveRef<string>
  selectedScopeId: ReactiveRef<string>
  message: ReactiveRef<string>
  locale: () => 'ar' | 'en'
  // Optional Resux-managed refs so component template bindings track updates natively
  attachedFile?: ReactiveRef<any>
  attachedFileInfo?: ReactiveRef<AttachmentInfo | null>
  fileError?: ReactiveRef<string>
  isFileLoading?: ReactiveRef<boolean>
  isSubmitting?: ReactiveRef<boolean>
  isSuccess?: ReactiveRef<boolean>
  errorMessage?: ReactiveRef<string>
  errorCode?: ReactiveRef<ContactErrorCode>
  fieldErrors?: ReactiveRef<Record<string, string>>
  submittedEntry?: ReactiveRef<InquiryRecord | null>
}

interface HttpStatusErrorInfo {
  code: ContactErrorCode
  messageAr: string
  messageEn: string
}

const HTTP_STATUS_ERROR_MAP: Record<number, HttpStatusErrorInfo> = {
  400: {
    code: 'VALIDATION_ERROR',
    messageAr: 'البيانات المدخلة غير مكتملة أو غير صالحة (HTTP 400). يرجى مراجعة الحقول والمحاولة مجدداً.',
    messageEn: 'Submitted data is invalid or incomplete (HTTP 400). Please review the fields and retry.'
  },
  413: {
    code: 'PAYLOAD_TOO_LARGE',
    messageAr: 'حجم الرسالة أو المرفق يتجاوز الحد المسموح به في الخادم (HTTP 413). يرجى اختيار ملف أصغر.',
    messageEn: 'Payload or attachment exceeds the server limit (HTTP 413). Please attach a smaller file.'
  },
  429: {
    code: 'SERVER_ERROR',
    messageAr: 'تم تجاوز الحد المؤقت للطلبات (HTTP 429). يرجى الانتظار بضع ثوانٍ ثم إعادة المحاولة.',
    messageEn: 'Too many requests in a short time (HTTP 429). Please wait a few seconds and retry.'
  }
}

export function validateSingleContactField(
  field: ValidatableField,
  value: string,
  loc: 'ar' | 'en'
): string | null {
  const trimmed = String(value || '').trim()
  if (field === 'senderName') {
    if (!trimmed) {
      return loc === 'ar'
        ? 'يرجى كتابة الاسم أو اسم جهة العمل.'
        : 'Please enter your name or company.'
    }
    if (trimmed.length < MIN_NAME_LENGTH) {
      return loc === 'ar'
        ? 'الاسم قصير جداً (حرفان على الأقل).'
        : 'Name is too short (minimum 2 characters).'
    }
    return null
  }

  if (field === 'senderEmail') {
    if (!trimmed) {
      return loc === 'ar'
        ? 'يرجى إدخال البريد الإلكتروني.'
        : 'Please enter your email address.'
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return loc === 'ar'
        ? 'صيغة البريد الإلكتروني غير صحيحة (مثال: name@domain.com).'
        : 'Please enter a valid email address (e.g. name@domain.com).'
    }
    return null
  }

  if (!trimmed) {
    return loc === 'ar'
      ? 'يرجى كتابة تفاصيل الرسالة أو الاستشارة.'
      : 'Please enter your message details.'
  }
  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return loc === 'ar'
      ? 'يرجى كتابة تفاصيل كافية (10 أحرف على الأقل).'
      : 'Please provide more details (minimum 10 characters).'
  }
  return null
}

export function useContactForm(options: UseContactFormOptions) {
  const { senderName, senderEmail, senderPhone, selectedScopeId, message, locale } = options

  // Reuse setupContext-created refs passed from the SFC so Resux tracks every state change
  const attachedFile = options.attachedFile || createFallbackRef<any>(null)
  const attachedFileInfo = options.attachedFileInfo || createFallbackRef<AttachmentInfo | null>(null)
  const fileError = options.fileError || createFallbackRef('')
  const isFileLoading = options.isFileLoading || createFallbackRef(false)
  const isSubmitting = options.isSubmitting || createFallbackRef(false)
  const isSuccess = options.isSuccess || createFallbackRef(false)
  const errorMessage = options.errorMessage || createFallbackRef('')
  const errorCode = options.errorCode || createFallbackRef<ContactErrorCode>('')
  const fieldErrors = options.fieldErrors || createFallbackRef<Record<string, string>>({})
  const submittedEntry = options.submittedEntry || createFallbackRef<InquiryRecord | null>(null)

  function getSelectedScope(): ScopeOption {
    const list = getLegalScopeOptions(locale())
    const targetId = selectedScopeId && selectedScopeId.value !== undefined
      ? selectedScopeId.value
      : 'recruitment'
    return list.find((s) => s.id === targetId) || list[0]
  }

  function validate(): { valid: boolean; errors: Record<string, string> } {
    const loc = locale()
    const nextErrors: Record<string, string> = {}

    const nameErr = validateSingleContactField('senderName', senderName.value, loc)
    if (nameErr) nextErrors.senderName = nameErr

    const emailErr = validateSingleContactField('senderEmail', senderEmail.value, loc)
    if (emailErr) nextErrors.senderEmail = emailErr

    const msgErr = validateSingleContactField('message', message.value, loc)
    if (msgErr) nextErrors.message = msgErr

    fieldErrors.value = nextErrors
    return {
      valid: Object.keys(nextErrors).length === 0,
      errors: nextErrors
    }
  }

  function clearFieldErrorIfValid(field: ValidatableField): void {
    const current = fieldErrors.value || {}
    if (!current[field]) return

    const valueMap: Record<ValidatableField, string> = {
      senderName: senderName.value,
      senderEmail: senderEmail.value,
      message: message.value
    }
    if (validateSingleContactField(field, valueMap[field], locale()) !== null) return

    const updated = { ...current }
    delete updated[field]
    fieldErrors.value = updated

    if (Object.keys(updated).length === 0 && errorCode.value === 'VALIDATION_ERROR') {
      errorMessage.value = ''
      errorCode.value = ''
    }
  }

  function validateFileMeta(file: File): string | null {
    const loc = locale()
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      return loc === 'ar'
        ? `نوع الملف (${ext || 'غير معروف'}) غير مدعوم. الصيغ المسموحة: PDF، Word، والصور.`
        : `File type (${ext || 'unknown'}) is not supported. Allowed formats: PDF, Word, and images.`
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      return loc === 'ar'
        ? `حجم الملف (${sizeMb} ميجابايت) يتجاوز الحد الأقصى المسموح (10 ميجابايت).`
        : `File size (${sizeMb} MB) exceeds the maximum allowed limit of 10 MB.`
    }
    return null
  }

  /** Starts synchronous file validation; returns the file when async base64 reading is needed. */
  function prepareFileUpload(file: File): File | null {
    fileError.value = ''
    const validationErr = validateFileMeta(file)
    if (validationErr) {
      fileError.value = validationErr
      isFileLoading.value = false
      attachedFile.value = null
      attachedFileInfo.value = null
      return null
    }

    attachedFile.value = file
    isFileLoading.value = true
    return file
  }

  async function completeFileUploadAsync(file: File): Promise<boolean> {
    const loc = locale()
    try {
      const base64 = await readFileAsBase64(file)
      attachedFileInfo.value = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        base64
      }
      fileError.value = ''
      return true
    } catch {
      fileError.value = loc === 'ar'
        ? 'تعذر قراءة الملف المحدد. يرجى التحقق من سلامة الملف وإعادة اختياره.'
        : 'Failed to read the selected file. Please verify the file and select it again.'
      attachedFile.value = null
      attachedFileInfo.value = null
      return false
    } finally {
      isFileLoading.value = false
    }
  }

  function removeAttachedFile(): void {
    attachedFile.value = null
    attachedFileInfo.value = null
    fileError.value = ''
    isFileLoading.value = false
  }

  function prepareSubmission(): {
    senderName: string
    senderEmail: string
    senderPhone?: string
    inquiryScope: string
    scopeId: string
    message: string
    attachment?: {
      name: string
      size: number
      type: string
      data: string
    }
  } | null {
    const loc = locale()
    if (isFileLoading.value) {
      errorMessage.value = loc === 'ar'
        ? 'يرجى الانتظار لحظة حتى يكتمل تجهيز الملف المرفق.'
        : 'Please wait a moment while the attachment finishes processing.'
      errorCode.value = 'FILE_ERROR'
      return null
    }

    errorMessage.value = ''
    errorCode.value = ''

    const { valid } = validate()
    if (!valid) {
      errorMessage.value = loc === 'ar'
        ? 'يرجى مراجعة الحقول المطلوبة المحددة باللون الأحمر وتصحيحها قبل الإرسال.'
        : 'Please review the highlighted required fields below and fix them before sending.'
      errorCode.value = 'VALIDATION_ERROR'
      return null
    }

    const scope = getSelectedScope()
    const attachmentSnapshot = attachedFileInfo.value
    isSubmitting.value = true
    isSuccess.value = false

    return {
      senderName: senderName.value.trim(),
      senderEmail: senderEmail.value.trim(),
      senderPhone: senderPhone.value.trim() || undefined,
      inquiryScope: scope.label,
      scopeId: selectedScopeId.value,
      message: message.value.trim(),
      attachment: attachmentSnapshot
        ? {
            name: attachmentSnapshot.name,
            size: attachmentSnapshot.size,
            type: attachmentSnapshot.type,
            data: attachmentSnapshot.base64
          }
        : undefined
    }
  }

  async function dispatchPreparedSubmission(
    payload: NonNullable<ReturnType<typeof prepareSubmission>>
  ): Promise<{ ok: boolean; entry?: InquiryRecord }> {
    const loc = locale()
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)
      : null

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const mapped = HTTP_STATUS_ERROR_MAP[res.status]
        const fallbackMsg = mapped
          ? (loc === 'ar' ? mapped.messageAr : mapped.messageEn)
          : (loc === 'ar'
              ? `تعذر إرسال الرسالة إلى الخادم (رمز الحالة ${res.status}). يرجى المحاولة مرة أخرى.`
              : `Server could not process the inquiry (HTTP ${res.status}). Please retry.`)

        errorCode.value = mapped?.code || 'SERVER_ERROR'
        errorMessage.value = (typeof data?.error === 'string' && data.error)
          || (typeof data?.message === 'string' && data.message)
          || fallbackMsg

        if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
          fieldErrors.value = { ...fieldErrors.value, ...data.fieldErrors }
        }
        isSuccess.value = false
        return { ok: false }
      }

      const entry: InquiryRecord = {
        id: data?.entry?.id || Date.now(),
        senderName: payload.senderName,
        senderEmail: payload.senderEmail,
        senderPhone: payload.senderPhone,
        inquiryScope: payload.inquiryScope,
        message: payload.message,
        attachment: payload.attachment
          ? {
              name: payload.attachment.name,
              size: payload.attachment.size,
              type: payload.attachment.type
            }
          : undefined,
        createdAt: data?.entry?.createdAt || new Date().toISOString(),
        emailSent: Boolean(data?.emailSent)
      }

      submittedEntry.value = entry
      errorMessage.value = ''
      errorCode.value = ''
      fieldErrors.value = {}
      isSuccess.value = true
      return { ok: true, entry }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        errorCode.value = 'TIMEOUT_ERROR'
        errorMessage.value = loc === 'ar'
          ? 'انتهت مهلة الاتصال بالخادم (25 ثانية) دون استجابة. يمكنك إعادة المحاولة أو الإرسال عبر تطبيق البريد.'
          : 'The request timed out after 25 seconds. Please try again or use your email client.'
      } else {
        errorCode.value = 'NETWORK_ERROR'
        errorMessage.value = loc === 'ar'
          ? 'تعذر الاتصال بالخادم حالياً (انقطاع الشبكة أو رفض الاتصال). يمكنك إعادة المحاولة أو الإرسال مباشرة بالبريد.'
          : 'Network error: unable to reach the server right now. Please retry or send directly via email.'
      }
      isSuccess.value = false
      return { ok: false }
    } finally {
      if (timeoutId !== null) clearTimeout(timeoutId)
      isSubmitting.value = false
    }
  }

  function clearErrorState(): void {
    errorMessage.value = ''
    errorCode.value = ''
  }

  function resetForm(): void {
    senderName.value = ''
    senderEmail.value = ''
    senderPhone.value = ''
    selectedScopeId.value = 'recruitment'
    message.value = ''
    attachedFile.value = null
    attachedFileInfo.value = null
    fileError.value = ''
    isFileLoading.value = false
    isSubmitting.value = false
    errorMessage.value = ''
    errorCode.value = ''
    fieldErrors.value = {}
    isSuccess.value = false
    submittedEntry.value = null
  }

  return {
    getSelectedScope,
    validate,
    clearFieldErrorIfValid,
    prepareFileUpload,
    completeFileUploadAsync,
    removeAttachedFile,
    prepareSubmission,
    dispatchPreparedSubmission,
    clearErrorState,
    resetForm
  }
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const base64 = result.includes(',') ? result.split(',')[1] : result
      if (!base64 && file.size > 0) {
        reject(new Error('Empty file read result'))
        return
      }
      resolve(base64)
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}
