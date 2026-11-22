import { ref, computed, type Ref } from 'vue'

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

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp']
export const LAWYER_EMAIL = 'hm8550845@gmail.com'

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

export interface UseContactFormOptions {
  senderName: Ref<string>
  senderEmail: Ref<string>
  senderPhone: Ref<string>
  selectedScopeId: Ref<string>
  message: Ref<string>
  locale: () => 'ar' | 'en'
}

export function useContactForm(options: UseContactFormOptions) {
  const { senderName, senderEmail, senderPhone, selectedScopeId, message, locale } = options

  const attachedFile = ref<File | null>(null)
  const attachedFileInfo = ref<AttachmentInfo | null>(null)
  const fileError = ref<string | null>(null)

  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const errorMessage = ref<string | null>(null)
  const fieldErrors = ref<Record<string, string>>({})
  const submittedEntry = ref<InquiryRecord | null>(null)

  const scopes = computed(() => getLegalScopeOptions(locale()))

  function getSelectedScope(): ScopeOption {
    const list = getLegalScopeOptions(locale())
    const targetId = (selectedScopeId && (selectedScopeId as any).value !== undefined)
      ? (selectedScopeId as any).value
      : selectedScopeId
    return list.find((s) => s.id === targetId) || list[0]
  }

  const selectedScope = {
    get value() {
      return getSelectedScope()
    }
  }

  const isEmpty = computed(() => {
    return !senderName.value.trim() && !senderEmail.value.trim() && !message.value.trim() && !attachedFile.value
  })

  function validate(): boolean {
    fieldErrors.value = {}
    const loc = locale()

    if (!senderName.value.trim()) {
      fieldErrors.value.senderName = loc === 'ar'
        ? 'يرجى كتابة الاسم أو اسم جهة العمل.'
        : 'Please enter your name or company.'
    } else if (senderName.value.trim().length < 2) {
      fieldErrors.value.senderName = loc === 'ar'
        ? 'الاسم قصير جداً (حرفان على الأقل).'
        : 'Name is too short (minimum 2 characters).'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!senderEmail.value.trim()) {
      fieldErrors.value.senderEmail = loc === 'ar'
        ? 'يرجى إدخال البريد الإلكتروني.'
        : 'Please enter your email address.'
    } else if (!emailRegex.test(senderEmail.value.trim())) {
      fieldErrors.value.senderEmail = loc === 'ar'
        ? 'صيغة البريد الإلكتروني غير صحيحة.'
        : 'Please enter a valid email address.'
    }

    if (!message.value.trim()) {
      fieldErrors.value.message = loc === 'ar'
        ? 'يرجى كتابة تفاصيل الرسالة أو الاستشارة.'
        : 'Please enter your message details.'
    } else if (message.value.trim().length < 10) {
      fieldErrors.value.message = loc === 'ar'
        ? 'يرجى كتابة تفاصيل كافية (10 أحرف على الأقل).'
        : 'Please provide more details (minimum 10 characters).'
    }

    return Object.keys(fieldErrors.value).length === 0
  }

  async function handleFileUpload(file: File) {
    fileError.value = null
    const loc = locale()

    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      fileError.value = loc === 'ar'
        ? `نوع الملف (${ext}) غير مدعوم. الصيغ المسموحة: PDF، Word، والصور.`
        : `File type (${ext}) is not supported. Allowed formats: PDF, Word, and images.`
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      fileError.value = loc === 'ar'
        ? `حجم الملف (${sizeMb} ميجابايت) يتجاوز الحد الأقصى المسموح (10 ميجابايت).`
        : `File size (${sizeMb} MB) exceeds the maximum allowed limit of 10 MB.`
      return
    }

    attachedFile.value = file

    try {
      const base64 = await readFileAsBase64(file)
      attachedFileInfo.value = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        base64
      }
    } catch {
      fileError.value = loc === 'ar'
        ? 'فشلت قراءة الملف. يرجى إعادة اختياره.'
        : 'Failed to read the file. Please try selecting it again.'
      attachedFile.value = null
      attachedFileInfo.value = null
    }
  }

  function removeAttachedFile() {
    attachedFile.value = null
    attachedFileInfo.value = null
    fileError.value = null
  }

  const mailtoLink = computed(() => {
    const scope = selectedScope.value?.label || 'General Legal Inquiry'
    const name = senderName.value.trim() || 'Client'
    const phone = senderPhone.value.trim() ? `\nالهاتف / Phone: ${senderPhone.value.trim()}` : ''
    const fileNotice = attachedFileInfo.value ? `\n(يوجد ملف مرفق: ${attachedFileInfo.value.name})` : ''

    const subject = encodeURIComponent(`[استفسار قانوني / Legal Inquiry] ${scope} - ${name}`)
    const body = encodeURIComponent(
      `الاسم / Name: ${name}\nالبريد / Email: ${senderEmail.value.trim()}${phone}\nالقطاع / Scope: ${scope}\n${fileNotice}\n\nنص الرسالة / Message:\n${message.value.trim()}`
    )
    return `mailto:${LAWYER_EMAIL}?subject=${subject}&body=${body}`
  })

  async function submit(): Promise<boolean> {
    if (isSubmitting.value) return false

    errorMessage.value = null
    const isValid = validate()
    if (!isValid) {
      const loc = locale()
      errorMessage.value = loc === 'ar'
        ? 'يرجى مراجعة الحقول المطلوبة وتصحيح الأخطاء الموضحة أدناه.'
        : 'Please review the required fields and fix the errors below.'
      return false
    }

    isSubmitting.value = true
    const loc = locale()

    try {
      const payload = {
        senderName: senderName.value.trim(),
        senderEmail: senderEmail.value.trim(),
        senderPhone: senderPhone.value.trim() || undefined,
        inquiryScope: selectedScope.value.label,
        scopeId: selectedScopeId.value,
        message: message.value.trim(),
        attachment: attachedFileInfo.value
          ? {
              name: attachedFileInfo.value.name,
              size: attachedFileInfo.value.size,
              type: attachedFileInfo.value.type,
              data: attachedFileInfo.value.base64
            }
          : undefined
      }

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || data?.message || (loc === 'ar' ? 'تعذر إرسال الرسالة إلى السيرفر.' : 'Failed to submit inquiry.'))
      }

      submittedEntry.value = {
        id: data?.entry?.id || Date.now(),
        senderName: payload.senderName,
        senderEmail: payload.senderEmail,
        senderPhone: payload.senderPhone,
        inquiryScope: payload.inquiryScope,
        message: payload.message,
        attachment: attachedFileInfo.value
          ? {
              name: attachedFileInfo.value.name,
              size: attachedFileInfo.value.size,
              type: attachedFileInfo.value.type
            }
          : undefined,
        createdAt: data?.entry?.createdAt || new Date().toISOString(),
        emailSent: Boolean(data?.emailSent)
      }

      isSuccess.value = true
      return true
    } catch (err: any) {
      errorMessage.value = err?.message || (loc === 'ar'
        ? 'حدث خطأ أثناء إرسال الرسالة. يمكنك المحاولة مرة أخرى أو الإرسال مباشرة عبر البريد الإلكتروني.'
        : 'An error occurred while submitting. You can try again or use direct email.')
      isSuccess.value = false
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function resetForm() {
    senderName.value = ''
    senderEmail.value = ''
    senderPhone.value = ''
    selectedScopeId.value = 'recruitment'
    message.value = ''
    attachedFile.value = null
    attachedFileInfo.value = null
    fileError.value = null
    errorMessage.value = null
    fieldErrors.value = {}
    isSuccess.value = false
    submittedEntry.value = null
  }

  return {
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
    getSelectedScope,
    isEmpty,
    mailtoLink,
    handleFileUpload,
    removeAttachedFile,
    submit,
    resetForm
  }
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}
