import { ref, computed, type Ref } from 'vue'
import { HUSSEIN_DATA } from './portfolioContent'

export interface QuickIndexItem {
  id: string
  title: string
  subtitle: string
  category: 'pages' | 'offices' | 'dockets' | 'procedures' | 'faq' | 'contact'
  categoryLabel: string
  href: string
  badge?: string
  icon: 'home' | 'briefcase' | 'building' | 'scales' | 'gavel' | 'book' | 'pdf' | 'mail' | 'phone' | 'shield'
  keywords: string[]
}

// Global singleton state so opening from header, mobile drawer, or keyboard shortcut shares exact state
const isOpen = ref(false)
const searchQuery = ref('')
const activeCategory = ref<'ALL' | 'pages' | 'offices' | 'dockets' | 'procedures' | 'faq' | 'contact'>('ALL')
const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref('')
const focusedIndex = ref(0)
const indexCache = new Map<string, QuickIndexItem[]>()

export function buildIndexItems(locale: 'ar' | 'en'): QuickIndexItem[] {
  const profile = HUSSEIN_DATA[locale] || HUSSEIN_DATA.ar
  const isAr = locale === 'ar'
  const prefix = isAr ? '' : '/en'

  const items: QuickIndexItem[] = [
    // 1. Core Pages
    {
      id: 'page-overview',
      title: profile.nav[0],
      subtitle: isAr ? 'الصفحة الرئيسية • النظرة العامة والسجل النقابي' : 'Home • Executive Overview & Bar Credentials',
      category: 'pages',
      categoryLabel: isAr ? 'الصفحات' : 'Pages',
      href: isAr ? '/' : '/en',
      icon: 'home',
      keywords: isAr ? ['الرئيسية', 'نظرة عامة', 'الملف', 'حلوان', 'السيرة'] : ['home', 'overview', 'profile', 'bar']
    },
    {
      id: 'page-offices',
      title: profile.nav[1],
      subtitle: isAr ? 'سجل الخبرات العملية في ٤ مكاتب محاماة متخصصة' : 'Practical Record across 4 Specialized Law Offices',
      category: 'pages',
      categoryLabel: isAr ? 'الصفحات' : 'Pages',
      href: `${prefix}/offices`,
      icon: 'briefcase',
      keywords: isAr ? ['مكاتب', 'محاماة', 'خبرات', 'تدريب', 'صبري', 'عمارة', 'شحاته', 'يسري'] : ['offices', 'experience', 'training', 'firms']
    },
    {
      id: 'page-procedures',
      title: profile.nav[2],
      subtitle: isAr ? 'دليل الإجراءات القضائية وخطوات ومستندات التقاضي' : 'Court Litigation Roadmap & Required Documents Checklist',
      category: 'pages',
      categoryLabel: isAr ? 'الصفحات' : 'Pages',
      href: `${prefix}/procedures`,
      icon: 'gavel',
      keywords: isAr ? ['إجراءات', 'خطوات', 'مستندات', 'دعاوى', 'صحة توقيع', 'نفقات', 'خلع'] : ['procedures', 'steps', 'documents', 'lawsuit', 'filing']
    },
    {
      id: 'page-faq',
      title: profile.nav[3],
      subtitle: isAr ? 'الدليل القانوني، المحاكم المغطاة، والأسئلة الشائعة' : 'Legal FAQ, Covered Court Jurisdictions & Bar Answers',
      category: 'pages',
      categoryLabel: isAr ? 'الصفحات' : 'Pages',
      href: `${prefix}/faq`,
      icon: 'book',
      keywords: isAr ? ['دليل', 'محاكم', 'أسئلة', 'شائعة', 'الجيزة', 'القاهرة', 'مجلس الدولة'] : ['faq', 'courts', 'jurisdictions', 'giza', 'cairo']
    },
    {
      id: 'page-cv',
      title: profile.nav[4],
      subtitle: isAr ? 'معاينة وتحميل السيرة الذاتية الرسمية PDF' : 'Official Curriculum Vitae PDF Preview & Direct Download',
      category: 'pages',
      categoryLabel: isAr ? 'الصفحات' : 'Pages',
      href: `${prefix}/cv`,
      icon: 'pdf',
      keywords: isAr ? ['سيرة', 'ذاتية', 'تحميل', 'pdf', 'ملف'] : ['cv', 'resume', 'pdf', 'download']
    },
    {
      id: 'page-contact',
      title: profile.nav[5],
      subtitle: isAr ? 'إرسال عرض تعيين، طلب استشارة، أو تكليف قضائي' : 'Send Recruitment Offer, Legal Consultation, or Mandate',
      category: 'pages',
      categoryLabel: isAr ? 'الصفحات' : 'Pages',
      href: `${prefix}/contact`,
      icon: 'mail',
      keywords: isAr ? ['تواصل', 'بريد', 'هاتف', 'تعيين', 'استشارة', 'تكليف'] : ['contact', 'email', 'phone', 'hire', 'mandate']
    }
  ]

  // 2. Law Offices & Dockets
  profile.items.forEach((office) => {
    items.push({
      id: `office-${office.id}`,
      title: office.title,
      subtitle: `${office.badge} • ${office.year} (${office.subtitle})`,
      category: 'offices',
      categoryLabel: isAr ? 'مكاتب المحاماة' : 'Law Offices',
      href: `${prefix}/offices`,
      badge: office.year,
      icon: 'building',
      keywords: [office.title, office.subtitle, office.badge, office.year, ...office.highlights]
    })
  })

  // 3. Case Matrix Dockets
  profile.caseMatrix.forEach((docket) => {
    items.push({
      id: `docket-${docket.code}`,
      title: docket.title,
      subtitle: `${docket.court} • ${docket.office}`,
      category: 'dockets',
      categoryLabel: isAr ? 'القضايا والمحاكم' : 'Court Dockets',
      href: `${prefix}/procedures`,
      badge: docket.code,
      icon: 'scales',
      keywords: [docket.title, docket.court, docket.office, docket.desc, docket.code]
    })
  })

  // 4. Legal FAQ Items
  profile.guideItems.forEach((guide, idx) => {
    items.push({
      id: `faq-${idx}`,
      title: guide.q,
      subtitle: guide.a.slice(0, 110) + '...',
      category: 'faq',
      categoryLabel: isAr ? 'الدليل والأسئلة' : 'Legal FAQ',
      href: `${prefix}/faq`,
      icon: 'book',
      keywords: [guide.q, guide.a]
    })
  })

  // 5. Contact & Official Actions
  items.push({
    id: 'action-call',
    title: isAr ? 'الاتصال الهاتفي المباشر (٠١٠٤٠٥٤٢٣٥٤)' : 'Direct Phone Call (+20 1040542354)',
    subtitle: isAr ? 'متاح للمكالمات وتكليفات المحاكم الفورية' : 'Available for immediate legal inquiries and litigation dockets',
    category: 'contact',
    categoryLabel: isAr ? 'الاتصال والملفات' : 'Contact & CV',
    href: 'tel:01040542354',
    badge: '01040542354',
    icon: 'phone',
    keywords: isAr ? ['هاتف', 'اتصال', 'موبايل', 'رقم'] : ['call', 'phone', 'mobile']
  })

  items.push({
    id: 'action-email',
    title: isAr ? 'مراسلة البريد الإلكتروني (hm8550845@gmail.com)' : 'Direct Chambers Email (hm8550845@gmail.com)',
    subtitle: isAr ? 'إرسال ملفات القضايا والأوراق القانونية رسمياً' : 'Dispatch formal legal correspondence and litigation mandates',
    category: 'contact',
    categoryLabel: isAr ? 'الاتصال والملفات' : 'Contact & CV',
    href: 'mailto:hm8550845@gmail.com',
    badge: 'Email',
    icon: 'mail',
    keywords: isAr ? ['بريد', 'إيميل', 'رسالة'] : ['email', 'mail']
  })

  items.push({
    id: 'action-pdf-ar',
    title: isAr ? 'تحميل السيرة الذاتية الرسمية بالعربية (PDF)' : 'Download Official Arabic CV (PDF)',
    subtitle: isAr ? 'ملف السيرة الذاتية المهني المعتمد والمطبوع' : 'Certified Egyptian Bar Association Curriculum Vitae',
    category: 'contact',
    categoryLabel: isAr ? 'الاتصال والملفات' : 'Contact & CV',
    href: '/cv/AlHussein_Mohamed_Arabic_CV.pdf',
    badge: 'PDF',
    icon: 'pdf',
    keywords: isAr ? ['تحميل', 'pdf', 'عربي', 'سيرة'] : ['download', 'pdf', 'arabic']
  })

  items.push({
    id: 'action-pdf-en',
    title: isAr ? 'تحميل السيرة الذاتية بالإنجليزية (English PDF)' : 'Download Official English CV (PDF)',
    subtitle: isAr ? 'النسخة الإنجليزية الرسمية لمكاتب المحاماة الدولية والشركات' : 'Official English version for international law firms and corporate legal departments',
    category: 'contact',
    categoryLabel: isAr ? 'الاتصال والملفات' : 'Contact & CV',
    href: '/cv/AlHussein_Mohamed_English_CV.pdf',
    badge: 'PDF',
    icon: 'pdf',
    keywords: isAr ? ['إنجليزي', 'english', 'pdf'] : ['english', 'pdf', 'download']
  })

  return items
}

export function useQuickIndex(localeRef?: Ref<'ar' | 'en'>) {
  const currentLocale = computed(() => localeRef?.value || 'ar')

  async function loadIndex(force = false) {
    const loc = currentLocale.value
    if (!force && indexCache.has(loc)) {
      return indexCache.get(loc)!
    }

    isLoading.value = true
    isError.value = false
    errorMessage.value = ''

    try {
      // Fast non-blocking async delay to ensure visual smoothness & demonstrate loading state if lazy-loaded
      await new Promise((resolve) => setTimeout(resolve, 80))
      const items = buildIndexItems(loc)
      indexCache.set(loc, items)
      return items
    } catch (err: any) {
      isError.value = true
      errorMessage.value = err?.message || (loc === 'ar' ? 'فشل تحميل بيانات الفهرس' : 'Failed to load index data')
      return []
    } finally {
      isLoading.value = false
    }
  }

  function open() {
    isOpen.value = true
    focusedIndex.value = 0
    // Trigger lazy loading
    loadIndex()
  }

  function close() {
    isOpen.value = false
    searchQuery.value = ''
    activeCategory.value = 'ALL'
    focusedIndex.value = 0
  }

  function retry() {
    loadIndex(true)
  }

  function selectCategory(cat: 'ALL' | 'pages' | 'offices' | 'dockets' | 'procedures' | 'faq' | 'contact') {
    activeCategory.value = cat
    focusedIndex.value = 0
  }

  const allItems = computed(() => {
    const loc = currentLocale.value
    return indexCache.get(loc) || buildIndexItems(loc)
  })

  const filteredItems = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const cat = activeCategory.value
    let list = allItems.value

    if (cat !== 'ALL') {
      list = list.filter((item) => item.category === cat)
    }

    if (!query) {
      return list
    }

    return list.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(query)
      const matchSubtitle = item.subtitle.toLowerCase().includes(query)
      const matchBadge = item.badge?.toLowerCase().includes(query)
      const matchKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(query))
      return matchTitle || matchSubtitle || matchBadge || matchKeywords
    })
  })

  const resultsCount = computed(() => filteredItems.value.length)
  const isEmpty = computed(() => !isLoading.value && !isError.value && filteredItems.value.length === 0)

  function nextItem() {
    const len = filteredItems.value.length
    if (len > 0) {
      focusedIndex.value = (focusedIndex.value + 1) % len
    }
  }

  function prevItem() {
    const len = filteredItems.value.length
    if (len > 0) {
      focusedIndex.value = (focusedIndex.value - 1 + len) % len
    }
  }

  function selectFocused() {
    const item = filteredItems.value[focusedIndex.value]
    if (item) {
      return item
    }
    return null
  }

  return {
    isOpen,
    searchQuery,
    activeCategory,
    isLoading,
    isError,
    errorMessage,
    focusedIndex,
    filteredItems,
    resultsCount,
    isEmpty,
    open,
    close,
    retry,
    selectCategory,
    nextItem,
    prevItem,
    selectFocused,
    loadIndex
  }
}
