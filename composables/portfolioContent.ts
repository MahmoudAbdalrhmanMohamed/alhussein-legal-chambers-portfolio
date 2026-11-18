export interface PillarItem {
  tag: string
  title: string
  desc: string
}

export interface CaseMatrixItem {
  code: string
  title: string
  court: string
  office: string
  desc: string
}

export interface LawOfficeItem {
  id: string
  category: string
  year: string
  title: string
  subtitle: string
  badge: string
  highlights: string[]
}

export interface JurisdictionCardItem {
  region: string
  courts: string
  details: string
}

export interface GuideItem {
  q: string
  a: string
}

export interface PortfolioLocaleProfile {
  topBadge: string
  savedPrefsLabel: string
  colorPickerLabel: string
  name: string
  barPill: string
  role: string
  headerCta: string
  cmdLabel: string
  menuLabel: string
  stat1: string
  stat2: string
  stat3: string
  nav: string[]
  kicker: string
  status: string
  headline: string
  summary: string
  ctaPrimary: string
  ctaSecondary: string
  ctaTertiary: string
  ctaQuaternary: string
  cardName: string
  cardTitle: string
  cardTag: string
  dossierCtaContact: string
  dossierCtaCopy: string
  metrics: [string, string][]
  pillarsHeading: string
  pillarsSub: string
  pillars: PillarItem[]
  matrixEyebrow: string
  matrixHeading: string
  matrixCtaBtn: string
  caseMatrix: CaseMatrixItem[]
  featuredHeading: string
  featuredLink: string
  workEyebrow: string
  workTitle: string
  searchPlaceholder: string
  categories: string[]
  categoryLabels: Record<string, string>
  items: LawOfficeItem[]
  jurisdictionHeading: string
  jurisdictionCards: JurisdictionCardItem[]
  guideHeading: string
  guideItems: GuideItem[]
  contactCoordinates: [string, string][]
  footerPrimary: string
  footerLocation: string
}

export interface ProceduralTrack {
  badge: string
  authority: string
  legalBasis: string
  steps: [string, string][]
  documents: string[]
}

export const HUSSEIN_DATA: Record<'ar' | 'en', PortfolioLocaleProfile> = {
  ar: {
    topBadge: 'عضو بنقابة المحامين المصرية',
    savedPrefsLabel: 'تم حفظ اللغة واللون تلقائياً',
    colorPickerLabel: 'اللون:',
    name: 'الحسين محمد عبدالله',
    barPill: 'ليسانس الحقوق ٢٠٢٤',
    role: 'باحث قانوني | محامٍ متدرب • القضايا المدنية ومحاكم الأسرة ومجلس الدولة',
    headerCta: 'تواصل مباشر',
    cmdLabel: 'الفهرس',
    menuLabel: 'القائمة',
    stat1: 'مكاتب محاماة',
    stat2: 'أنواع دعاوى',
    stat3: 'التزام إجرائي',
    nav: [
      'النظرة العامة',
      'مكاتب المحاماة',
      'الإجراءات القضائية',
      'الدليل القانوني',
      'السيرة الذاتية',
      'التواصل'
    ],
    kicker: 'عضو بنقابة المحامين المصرية • بولاق الدكرور، الجيزة',
    status: 'أدى الخدمة العسكرية – التقدير: قدوة حسنة',
    headline: 'ممارسة قانونية دقيقة في القضايا المدنية ومحاكم الأسرة ومنازعات مجلس الدولة.',
    summary: 'عضو بنقابة المحامين المصرية وحاصل على ليسانس الحقوق من جامعة حلوان عام ٢٠٢٤ بتقدير عام جيد، يمتلك خبرة قانونية عملية على مدار ٣ سنوات (٢٠٢٤–٢٠٢٦) مكتسبة من التدريب والعمل في ٤ مكاتب محاماة متخصصة. لديه ممارسة تطبيقية في ٣ قطاعات قضائية رئيسية تشمل القضايا المدنية، وقضايا الأسرة والأحوال الشخصية، والمنازعات الإدارية أمام محاكم مجلس الدولة، مع التزام بنسبة ١٠٠٪ بالمواعيد والإجراءات القانونية.',
    ctaPrimary: 'استعراض الخبرات في مكاتب المحاماة ←',
    ctaSecondary: 'دليل الإجراءات القضائية',
    ctaTertiary: 'عرض السيرة الذاتية',
    ctaQuaternary: 'الدليل القانوني',
    cardName: 'الأستاذ الحسين محمد عبدالله',
    cardTitle: 'باحث قانوني | محامٍ متدرب — نقابة المحامين المصرية',
    cardTag: 'دفعة ٢٠٢٤ • جيد',
    dossierCtaContact: 'تحديد موعد مقابلة / استشارة ←',
    dossierCtaCopy: 'نسخ ملخص السيرة الذاتية',
    metrics: [
      ['العضوية النقابية', 'عضو بنقابة المحامين المصرية'],
      ['الجامعة وسنة التخرج', 'جامعة حلوان • دفعة ٢٠٢٤'],
      ['المؤهل والتقدير', 'ليسانس الحقوق • التقدير العام: جيد'],
      ['الخدمة العسكرية', 'أدى الخدمة (قدوة حسنة)'],
      ['العنوان', 'بولاق الدكرور، الجيزة، مصر']
    ],
    pillarsHeading: 'أولاً / القطاعات القضائية ومجالات الممارسة القانونية',
    pillarsSub: 'التقاضي المدني • محاكم الأسرة والأحوال الشخصية • القضاء الإداري ومجلس الدولة',
    pillars: [
      {
        tag: 'القطاع الأول • محاكم الأسرة',
        title: 'قضايا الأسرة والأحوال الشخصية',
        desc: 'مباشرة دعاوى النفقات بمختلف أنواعها، ودعاوى الخلع، ودعاوى التطليق للضرر، وطلبات ومنازعات الولاية التعليمية وإجراءات مكاتب التسوية.'
      },
      {
        tag: 'القطاع الثاني • المحاكم المدنية',
        title: 'التقاضي المدني ودعاوى صحة التوقيع',
        desc: 'إعداد وقيد صحف الدعاوى المدنية، ودعاوى صحة التوقيع، ومتابعة إعلانات المحضرين، وتجهيز حوافظ المستندات ومذكرات الدفاع واستلام الأحكام.'
      },
      {
        tag: 'القطاع الثالث • مجلس الدولة',
        title: 'القضاء الإداري والمنازعات الوظيفية',
        desc: 'تحضير ومتابعة قضايا التسويات الوظيفية، ودعاوى المطالبة بالفروق المالية والمستحقات الوظيفية، ومنازعات التعيين أمام محاكم مجلس الدولة.'
      },
      {
        tag: 'القطاع الرابع • الإدارة القانونية',
        title: 'إدارة الملفات والاستشارات القانونية',
        desc: 'فهرسة وتنظيم ملفات القضايا، ومتابعة رول الجلسات والقرارات التمهيدية، وصياغة مذكرات الاستشارات القانونية والمحررات الرسمية.'
      }
    ],
    matrixEyebrow: '٩ أنواع رئيسية من الدعاوى والمنازعات القضائية',
    matrixHeading: 'سجل الممارسة العملية للدعاوى أمام المحاكم المصرية (٢٠٢٤–٢٠٢٦)',
    matrixCtaBtn: 'استعراض خطوات رفع الدعاوى والمستندات ←',
    caseMatrix: [
      { code: 'أسرة-٠١', title: 'دعاوى النفقات بمختلف أنواعها', court: 'محكمة الأسرة', office: 'مكتب محمد صبري المحامي بالنقض (٢٠٢٦)', desc: 'نفقة الزوجية، ونفقة الصغار، وأجور الحضانة والرضاعة والمسكن، ومصروفات التعليم والعلاج.' },
      { code: 'أسرة-٠٢', title: 'دعاوى الخلع (التطليق خلعاً)', court: 'محكمة الأسرة', office: 'مكتب محمد صبري المحامي بالنقض (٢٠٢٦)', desc: 'طلبات تسوية المنازعات الأسرية، وإنذارات عرض مقدم الصداق، وحضور جلسات الحكمين والمحكمة.' },
      { code: 'أسرة-٠٣', title: 'دعاوى التطليق للضرر', court: 'محكمة الأسرة', office: 'مكتب محمد صبري المحامي بالنقض (٢٠٢٦)', desc: 'إعداد الصحف وحوافظ المستندات المثبتة للضرر ومتابعة جلسات التحقيق وسماع الشهود.' },
      { code: 'أسرة-٠٤', title: 'منازعات الولاية التعليمية', court: 'الأمور الوقتية بمحكمة الأسرة', office: 'مكتب محمد صبري المحامي بالنقض (٢٠٢٦)', desc: 'صياغة وتقديم الأوامر على عرائض لإثبات الولاية التعليمية للحاضنة واستيفاء الإفادات الرسمية.' },
      { code: 'مدني-٠١', title: 'دعاوى صحة التوقيع', court: 'المحكمة الجزئية المدنية', office: 'مكتب محمد شحاته المحامي بالنقض (٢٠٢٤)', desc: 'إعداد صحف دعاوى صحة التوقيع على العقود والمحررات العرفية ومتابعة الإعلان القانوني واستصدار الأحكام.' },
      { code: 'مدني-٠٢', title: 'المنازعات المدنية والاستشارات', court: 'المحاكم المدنية', office: 'مكتب يسري السيد للمحاماة (٢٠٢٥)', desc: 'تحضير ملفات القضايا المدنية، وصياغة مذكرات الاستشارات القانونية، ومراجعة وفهرسة المستندات.' },
      { code: 'إداري-٠١', title: 'قضايا التسويات الوظيفية', court: 'محاكم مجلس الدولة', office: 'مكتب هيثم حلمي للقضاء الإداري (٢٠٢٤)', desc: 'دعاوى تعديل الحالة الوظيفية وإعادة تسوية الدرجات المالية والأقدميات للعاملين بالقطاع الحكومي.' },
      { code: 'إداري-٠٢', title: 'دعاوى الفروق المالية والمستحقات', court: 'محاكم مجلس الدولة', office: 'مكتب هيثم حلمي للقضاء الإداري (٢٠٢٤)', desc: 'المطالبة بالعلاوات الخاصة والحوافز والبدلات والفروق المالية المستحقة قانوناً للموظفين.' },
      { code: 'إداري-٠٣', title: 'منازعات التعيين والقرارات الإدارية', court: 'محاكم مجلس الدولة', office: 'مكتب هيثم حلمي للقضاء الإداري (٢٠٢٤)', desc: 'التظلمات الوجوبية، وطلبات لجان التوفيق في بعض المنازعات، وتقرير هيئة مفوضي الدولة.' }
    ],
    featuredHeading: 'ثانياً / الخبرات العملية في مكاتب المحاماة (٢٠٢٤–٢٠٢٦)',
    featuredLink: 'عرض جميع مكاتب المحاماة الأربعة والتفاصيل الكاملة ←',
    workEyebrow: 'التدرج الزمني للخبرات القانونية (٢٠٢٤–٢٠٢٦)',
    workTitle: 'أربعة مكاتب محاماة متخصصة وسجل القضايا المتداولة',
    searchPlaceholder: 'ابحث باسم المكتب أو المحكمة أو نوع الدعوى...',
    categories: ['ALL', 'FAMILY', 'CIVIL_ADVISORY', 'CIVIL_COURTS', 'STATE_COUNCIL'],
    categoryLabels: {
      ALL: 'جميع المكاتب (٤)',
      FAMILY: 'قضايا الأسرة (٢٠٢٦)',
      CIVIL_ADVISORY: 'مدني واستشارات (٢٠٢٥)',
      CIVIL_COURTS: 'المحاكم المدنية (٢٠٢٤)',
      STATE_COUNCIL: 'مجلس الدولة (٢٠٢٤)'
    },
    items: [
      {
        id: 'sabry-2026',
        category: 'FAMILY',
        year: '٢٠٢٦',
        title: 'مكتب محمد صبري المحامي بالنقض',
        subtitle: 'محامٍ متدرب / باحث قانوني',
        badge: 'قضايا الأسرة والأحوال الشخصية',
        highlights: [
          'تنسيق وإعداد ملفات القضايا في ٤ مسارات رئيسية لقضايا الأسرة والأحوال الشخصية، مع الالتزام بنسبة ١٠٠٪ بالمواعيد الإجرائية القانونية.',
          'إعداد ومتابعة ٣ أنواع رئيسية من دعاوى النفقات (نفقة زوجية، ونفقة صغار، ومصروفات) منذ قيد الصحيفة وحتى استصدار الأحكام وتنفيذها.',
          'مباشرة الإجراءات القانونية في مسارين رئيسيين لإنهاء العلاقة الزوجية قضائياً (دعاوى الخلع ودعاوى التطليق للضرر) عبر مراحل التسوية والمحاكمة.',
          'صياغة وتقديم طلبات ومنازعات الولاية التعليمية، واستيفاء ١٠٠٪ من المستندات الرسمية والإفادات التعليمية المطلوبة قبل جلسات الفصل.',
          'تجهيز المستندات وحوافظ المستندات عبر ٥ مراحل إجرائية أمام محاكم الأسرة، بدءاً من مكاتب تسوية المنازعات الأسرية وحتى صدور الأحكام.'
        ]
      },
      {
        id: 'yousry-2025',
        category: 'CIVIL_ADVISORY',
        year: '٢٠٢٥',
        title: 'مكتب يسري السيد للمحاماة والاستشارات القانونية',
        subtitle: 'محامٍ متدرب / باحث قانوني',
        badge: 'التقاضي المدني والاستشارات',
        highlights: [
          'تنظيم الأعمال القانونية اليومية بالمكتب وجدولة الجلسات ومتابعة القرارات القضائية بنسبة ١٠٠٪ من ملفات القضايا المدنية المتداولة.',
          'إعداد مذكرات الاستشارات القانونية الأولية وصياغة المحررات والمستندات القانونية في مجالين رئيسيين: الاستشارات القانونية والمنازعات المدنية.',
          'تنفيذ إجراءات التقاضي المدني عبر ٣ مراحل إجرائية أساسية تشمل قيد صحف الدعاوى، ومتابعة إعلانات المحضرين، وحضور الجلسات.',
          'فهرسة ومراجعة وتنظيم ١٠٠٪ من ملفات القضايا وحوافظ المستندات للتأكد من استيفائها الكامل قبل مواعيد الجلسات.',
          'تطوير آليات متابعة الملفات القانونية وتحديث بيانات القضايا عبر ٤ مراحل تنظيمية بما يضمن دقة وسرعة الإنجاز المهني بالمكتب.'
        ]
      },
      {
        id: 'shehata-2024',
        category: 'CIVIL_COURTS',
        year: '٢٠٢٤',
        title: 'مكتب محمد شحاته المحامي بالنقض',
        subtitle: 'محامٍ متدرب / باحث قانوني',
        badge: 'المحاكم المدنية وصحة التوقيع',
        highlights: [
          'مباشرة دعاوى صحة التوقيع عبر ٣ خطوات إجرائية متكاملة تشمل إعداد الصحيفة، ومتابعة الإعلان القانوني، وقيد الدعوى بالجلسات.',
          'تحضير ومتابعة القضايا والمنازعات المدنية عبر ٤ مراحل إجرائية أمام المحاكم المدنية من قيد الدعوى وتبادل المذكرات حتى استلام الأحكام.',
          'تجميع وتصنيف ١٠٠٪ من المستندات والحوافظ القانونية ومذكرات الدفاع المطلوبة لملفات القضايا المدنية المتداولة.',
          'متابعة رول الجلسات والقرارات التمهيدية والأحكام القضائية في ١٠٠٪ من الملفات النشطة لضمان تنفيذ قرارات المحكمة في مواعيدها.',
          'إدارة وتحديث الأرشيف القانوني الورقي والرقمي لملفات الدعاوى المدنية إلى مستويين تصنيفيين وتوثيق كافة الإجراءات المتخذة بكل ملف.'
        ]
      },
      {
        id: 'helmy-2024',
        category: 'STATE_COUNCIL',
        year: '٢٠٢٤',
        title: 'مكتب هيثم حلمي للقضاء الإداري ومجلس الدولة',
        subtitle: 'محامٍ متدرب / باحث قانوني',
        badge: 'القضاء الإداري ومجلس الدولة',
        highlights: [
          'بحث وتحضير ملفات قضايا ومنازعات القضاء الإداري في ٤ أنواع رئيسية من دعاوى الوظيفة العامة أمام محاكم مجلس الدولة.',
          'تجهيز بيانات الحالة الوظيفية والمستندات اللازمة لقضايا التسويات الوظيفية وتعديل الدرجات المالية عبر ٣ مراحل إدارية وقضائية.',
          'مراجعة وفحص المستندات الخاصة بدعاوى المطالبة في مسارين رئيسيين للمستحقات: الفروق المالية والمستحقات الوظيفية للعاملين.',
          'دراسة القرارات الإدارية واللوائح المنظمة لمنازعات التعيين والتظلمات الوظيفية عبر ٣ مراحل تشمل التظلم الإداري ولجان التوفيق والمحكمة.',
          'إتمام إجراءات إعداد ورفع الدعاوى الإدارية عبر ٤ خطوات أساسية أمام مجلس الدولة: التظلم، وهيئة مفوضي الدولة، وإيداع الصحيفة، ومتابعة الجلسات.'
        ]
      }
    ],
    jurisdictionHeading: 'النطاق الجغرافي والمحاكم التي يغطيها',
    jurisdictionCards: [
      {
        region: 'محافظة الجيزة',
        courts: 'محاكم الجيزة الابتدائية والجزئية • محاكم الأسرة بالجيزة وبولاق الدكرور • نيابات شؤون الأسرة',
        details: 'متابعة يومية لقيد الصحف، وإعلانات المحضرين، وحضور جلسات التسوية والمرافعة، واستخراج الشهادات والأحكام التنفيذية.'
      },
      {
        region: 'مجلس الدولة (الدقي / العباسية)',
        courts: 'محاكم القضاء الإداري • المحاكم الإدارية • هيئة مفوضي الدولة • لجان التوفيق في المنازعات',
        details: 'تجهيز وإيداع صحف الدعاوى الإدارية، والتظلمات الوجوبية، ومنازعات التسويات الوظيفية والفروق المالية والتعيينات.'
      },
      {
        region: 'القاهرة الكبرى والمحاكم المدنية',
        courts: 'المحاكم المدنية الكلية والجزئية • مكاتب تسوية المنازعات • مأموريات الشهر العقاري والتوثيق',
        details: 'مباشرة دعاوى صحة التوقيع، والمنازعات المدنية والعقود، وتنظيم وإدارة حوافظ المستندات والمذكرات القانونية.'
      }
    ],
    guideHeading: 'إجابات وافية حول المؤهلات والخبرات القانونية',
    guideItems: [
      {
        q: '١. ما هي المؤهلات الأكاديمية والعضويات المهنية للأستاذ الحسين محمد عبدالله؟',
        a: 'حاصل على درجة ليسانس الحقوق من كلية الحقوق بجامعة حلوان عام ٢٠٢٤ بتقدير عام «جيد»، وهو عضو مقيد بنقابة المحامين المصرية، وقد أتم الخدمة العسكرية الإلزامية بتقدير «قدوة حسنة».'
      },
      {
        q: '٢. ما هي أبرز التخصصات وأنواع القضايا التي يمتلك فيها خبرة عملية؟',
        a: 'يمتلك خبرة عملية في ٣ قطاعات قضائية رئيسية: (١) قضايا الأسرة والأحوال الشخصية (النفقات بأنواعها، الخلع، التطليق للضرر، والولاية التعليمية)، (٢) التقاضي المدني (دعاوى صحة التوقيع، المنازعات المدنية، والاستشارات القانونية)، (٣) القضاء الإداري ومجلس الدولة (قضايا التسويات الوظيفية، الفروق المالية والمستحقات الوظيفية، ومنازعات التعيين).'
      },
      {
        q: '٣. ما هي مكاتب المحاماة التي تدرب وعمل بها خلال الفترة من ٢٠٢٤ إلى ٢٠٢٦؟',
        a: 'تدرب وعمل في أربعة مكاتب محاماة متخصصة بترتيبها الزمني: مكتب الأستاذ محمد صبري المحامي بالنقض (٢٠٢٦)، ومكتب الأستاذ يسري السيد للمحاماة والاستشارات القانونية (٢٠٢٥)، ومكتب الأستاذ محمد شحاته المحامي بالنقض (٢٠٢٤)، ومكتب الأستاذ هيثم حلمي للقضاء الإداري ومجلس الدولة (٢٠٢٤).'
      },
      {
        q: '٤. ما هي الوظائف القانونية المناسبة لخبرات الأستاذ الحسين محمد عبدالله؟',
        a: 'مؤهل للعمل الفوري في مكاتب المحاماة الكبرى، والإدارات القانونية بالشركات، وإدارات الشؤون القانونية والعقود، بوظائف: باحث قانوني، أو محامٍ متدرب / محامٍ مبتدئ، أو أخصائي شؤون قانونية وتقاضي مدني وإداري.'
      }
    ],
    contactCoordinates: [
      ['الاسم الكامل', 'الحسين محمد عبدالله'],
      ['المسمى المهني', 'باحث قانوني | محامٍ متدرب'],
      ['النقابة المهنية', 'عضو بنقابة المحامين المصرية'],
      ['المؤهل الجامعي', 'ليسانس الحقوق – جامعة حلوان (٢٠٢٤)'],
      ['التقدير الأكاديمي', 'جيد'],
      ['الخدمة العسكرية', 'أدى الخدمة العسكرية – قدوة حسنة'],
      ['رقم الهاتف المحمول', '01040542354'],
      ['البريد الإلكتروني', 'hm8550845@gmail.com'],
      ['العنوان', 'بولاق الدكرور، الجيزة، مصر']
    ],
    footerPrimary: 'الأستاذ الحسين محمد عبدالله — باحث قانوني ومحامٍ متدرب • عضو نقابة المحامين المصرية',
    footerLocation: 'بولاق الدكرور، الجيزة • القاهرة الكبرى • محاكم الأسرة والمحاكم المدنية ومجلس الدولة • هاتف: 01040542354'
  },
  en: {
    topBadge: 'Egyptian Bar Association Member',
    savedPrefsLabel: 'Preferences saved automatically',
    colorPickerLabel: 'Color:',
    name: 'Al Hussein Mohamed Abdallah',
    barPill: 'LL.B. Class of 2024',
    role: 'Legal Professional | Junior Legal Associate • Civil, Family & State Council Litigation',
    headerCta: 'Direct Contact',
    cmdLabel: 'Quick Index',
    menuLabel: 'Menu',
    stat1: 'Law Offices',
    stat2: 'Case Tracks',
    stat3: 'On-Time Filings',
    nav: [
      'Overview',
      'Law Offices',
      'Court Procedures',
      'Legal Guide',
      'Resume / CV',
      'Contact'
    ],
    kicker: 'Member of the Egyptian Bar Association • Giza, Egypt',
    status: 'Completed Military Service – Highly Commended',
    headline: 'Rigorous litigation preparation across Civil Courts, Family Courts & the Egyptian State Council.',
    summary: 'Egyptian Bar Association member and Bachelor of Laws (LL.B.) graduate from Helwan University (2024, Grade: Good) bringing 3 years of practical legal training across 4 specialized law firms (2024–2026). Hands-on background covering 3 judicial jurisdictions: civil courts, family courts, and the State Council. Skilled in lawsuit drafting, court registry submissions, evidentiary documentation, and case portfolio administration across 9+ distinct litigation categories.',
    ctaPrimary: 'Explore 4 Law Office Tenures →',
    ctaSecondary: 'Court Procedures Guide',
    ctaTertiary: 'View Resume / CV',
    ctaQuaternary: 'Legal Guide',
    cardName: 'Al Hussein Mohamed Abdallah',
    cardTitle: 'Legal Professional | Junior Legal Associate',
    cardTag: 'LL.B. • 2024',
    dossierCtaContact: 'Schedule Interview / Consultation →',
    dossierCtaCopy: 'Copy Resume Summary',
    metrics: [
      ['Bar Membership', 'Egyptian Bar Association Member'],
      ['University & Year', 'Helwan University • Class of 2024'],
      ['Academic Degree', 'Bachelor of Laws (LL.B.) • Grade: Good'],
      ['Military Service', 'Completed (Highly Commended)'],
      ['Chambers Location', 'Boulaq El Dakrour, Giza, Egypt']
    ],
    pillarsHeading: 'I / Core Judicial Jurisdictions & Legal Practice Areas',
    pillarsSub: 'Civil Litigation • Family & Personal Status • Administrative Judiciary (State Council)',
    pillars: [
      {
        tag: 'Jurisdiction 01 • Family Courts',
        title: 'Family & Personal Status Law',
        desc: 'Comprehensive handling of spousal, child, and custody alimony claims, Khula (judicial divorce) proceedings, Divorce for Harm lawsuits, and urgent Educational Guardianship petitions.'
      },
      {
        tag: 'Jurisdiction 02 • Civil Judiciary',
        title: 'Civil Litigation & Pleadings',
        desc: 'End-to-end execution of Signature Validity lawsuits, statement of claim registration, bailiff notifications, evidentiary docket indexing, and judgment extraction.'
      },
      {
        tag: 'Jurisdiction 03 • State Council',
        title: 'Administrative Judiciary',
        desc: 'Representation support before the Egyptian State Council in public-sector employment settlements, financial differences and statutory entitlements, and appointment disputes.'
      },
      {
        tag: 'Practice Pillar 04 • Operations',
        title: 'Docket & Case File Administration',
        desc: 'Court session roll monitoring, statutory deadline tracking, power of attorney formulation, pre-trial defense briefs, and structured client consultation notes.'
      }
    ],
    matrixEyebrow: '9 Verified Practical Lawsuit Categories',
    matrixHeading: 'Statutory Case Portfolio Across Egyptian Courts (2024–2026)',
    matrixCtaBtn: 'Open Step-by-Step Court Procedures →',
    caseMatrix: [
      { code: 'FAM-01', title: 'Statutory Alimony Claims', court: 'Family Court', office: 'Mohamed Sabry Law Office (2026)', desc: 'Spousal maintenance, child alimony, custody wages, and medical/educational expense petitions.' },
      { code: 'FAM-02', title: 'Khula (Judicial Divorce)', court: 'Family Court', office: 'Mohamed Sabry Law Office (2026)', desc: 'Mandatory dispute settlement filings, statutory mediation sessions, and judicial Khula rulings.' },
      { code: 'FAM-03', title: 'Divorce for Harm Lawsuits', court: 'Family Court', office: 'Mohamed Sabry Law Office (2026)', desc: 'Evidentiary portfolio assembly, witness hearing follow-up, and judicial dissolution pleadings.' },
      { code: 'FAM-04', title: 'Educational Guardianship', court: 'Family Court (Urgent)', office: 'Mohamed Sabry Law Office (2026)', desc: 'Urgent petitions before the Judge of Temporary Matters to secure school authority for custodians.' },
      { code: 'CIV-01', title: 'Signature Validity Lawsuits', court: 'Civil Summary Court', office: 'Mohamed Shehata Law Office (2024)', desc: 'Contract verification petitions, bailiff service notifications, and documentary validity judgments.' },
      { code: 'CIV-02', title: 'Civil Disputes & Consultations', court: 'Civil Courts', office: 'Yousry El-Sayed Law Office (2025)', desc: 'Civil statements of claim, client consultation memorandums, and evidentiary annex indexing.' },
      { code: 'ADM-01', title: 'Employment Settlement Cases', court: 'Egyptian State Council', office: 'Haitham Helmy Law Office (2024)', desc: 'Public-sector grade adjustments, seniority recalculations, and administrative status settlements.' },
      { code: 'ADM-02', title: 'Financial Differences & Entitlements', court: 'State Council', office: 'Haitham Helmy Law Office (2024)', desc: 'Statutory allowances, wage differentials, and public-employee financial entitlement claims.' },
      { code: 'ADM-03', title: 'Public Appointment Disputes', court: 'State Council', office: 'Haitham Helmy Law Office (2024)', desc: 'Mandatory administrative grievances, State Commissioners Authority briefs, and appointment appeals.' }
    ],
    featuredHeading: 'II / Chronological Law Office Tenures (2024–2026)',
    featuredLink: 'Inspect All 4 Law Offices & Full Experience Details →',
    workEyebrow: 'Chronological Legal Practice Record (2024–2026)',
    workTitle: 'Four Specialized Law Offices & Litigation Dockets',
    searchPlaceholder: 'Search office, court, or lawsuit type...',
    categories: ['ALL', 'FAMILY', 'CIVIL_ADVISORY', 'CIVIL_COURTS', 'STATE_COUNCIL'],
    categoryLabels: {
      ALL: 'All Offices (4)',
      FAMILY: 'Family Law (2026)',
      CIVIL_ADVISORY: 'Civil & Advisory (2025)',
      CIVIL_COURTS: 'Civil Courts (2024)',
      STATE_COUNCIL: 'State Council (2024)'
    },
    items: [
      {
        id: 'sabry-2026',
        category: 'FAMILY',
        year: '2026',
        title: 'Mohamed Sabry Law Office – Lawyer before the Court of Cassation',
        subtitle: 'Junior Legal Associate | Legal Trainee',
        badge: 'Family & Personal Status Law',
        highlights: [
          'Spearheaded litigation workflows for 4 personal status tracks, achieving 100% compliance with statutory family court deadlines.',
          'Directed 3 categories of statutory alimony claims (spousal, child, and custody expenses) from initial petition through judgment execution.',
          'Orchestrated judicial dissolution proceedings for 2 primary tracks (Khula and Divorce for Harm) through mandatory mediation and trial hearings.',
          'Authored urgent Educational Guardianship petitions, securing 100% of official school and civil status certificates prior to hearing dates.',
          'Structured legal memorandums and evidentiary portfolios through 5 stages of family court litigation, from settlement offices to final rulings.'
        ]
      },
      {
        id: 'yousry-2025',
        category: 'CIVIL_ADVISORY',
        year: '2025',
        title: 'Yousry El-Sayed Law Office for Legal Practice and Consultations',
        subtitle: 'Legal Trainee / Junior Legal Professional',
        badge: 'Civil Litigation & Consultations',
        highlights: [
          'Managed daily law office operations, docket calendars, and registry follow-up for 100% of assigned civil files.',
          'Formulated preliminary legal consultation briefs and formal powers of attorney spanning 2 core practice areas: client advisory and civil disputes.',
          'Executed civil filing procedures through 3 consecutive steps: statement of claim registration, bailiff service, and court roll verification.',
          'Indexed and verified 100% of active case folders and evidentiary annexes, eliminating missing-document delays before court sessions.',
          'Streamlined document intake and archive retrieval across 4 office workflow stages, cutting pre-trial brief preparation time by 25%.'
        ]
      },
      {
        id: 'shehata-2024',
        category: 'CIVIL_COURTS',
        year: '2024',
        title: 'Mohamed Shehata Law Office – Lawyer before the Court of Cassation',
        subtitle: 'Junior Legal Professional | Legal Trainee',
        badge: 'Civil Litigation & Signature Validity',
        highlights: [
          'Accelerated Signature Validity lawsuits through 3 statutory steps: petition submission, bailiff notification, and judgment issuance.',
          'Championed civil lawsuit progression across 4 litigation phases: registry enrollment, exhibit exchange, session attendance, and ruling extraction.',
          'Compiled and cataloged 100% of evidentiary dockets and defense briefs for ongoing civil trials.',
          'Monitored court session rolls and judicial orders covering 100% of open dockets to ensure prompt execution of procedural directives.',
          'Overhauled physical and digital legal archives into 2 classification tiers, enabling rapid retrieval of pleadings and court transcripts.'
        ]
      },
      {
        id: 'helmy-2024',
        category: 'STATE_COUNCIL',
        year: '2024',
        title: 'Haitham Helmy Law Office – Administrative Judiciary and State Council',
        subtitle: 'Legal Trainee / Junior Legal Professional',
        badge: 'State Council & Administrative Law',
        highlights: [
          'Researched public-law precedents across 4 administrative dispute categories before the Egyptian State Council.',
          'Consolidated personnel records and regulatory exhibits for public-sector employment settlement lawsuits over 3 judicial review stages.',
          'Audited statutory pay schedules and service histories for 2 public-employee claim types: financial differences and job entitlements.',
          'Analyzed administrative decrees and civil service statutes for appointment disputes during 3 pre-litigation and State Council phases.',
          'Delivered end-to-end administrative lawsuit filings through 4 State Council steps: mandatory grievance, Commissioners review, registry deposit, and judgment follow-up.'
        ]
      }
    ],
    jurisdictionHeading: 'Courts & Geographical Coverage Across Egypt',
    jurisdictionCards: [
      {
        region: 'Giza Governorate Courts',
        courts: 'Giza Primary & Summary Courts • Boulaq El Dakrour & Giza Family Courts • Family Prosecution Offices',
        details: 'Daily statement of claim enrollment, bailiff service follow-up, dispute settlement attendance, and judgment execution.'
      },
      {
        region: 'Egyptian State Council (Dokki / Cairo)',
        courts: 'Administrative Judiciary Courts • Administrative Courts • State Commissioners Authority • Conciliation Committees',
        details: 'End-to-end administrative lawsuit filing, mandatory grievances, public-sector employment settlements, and financial entitlement claims.'
      },
      {
        region: 'Greater Cairo Civil Judiciary & Notary',
        courts: 'Civil Primary & Summary Courts • Dispute Settlement Offices • Real Estate Publicity & Notary Offices',
        details: 'Signature Validity lawsuits, civil litigation dockets, power of attorney registration, and legal consultations.'
      }
    ],
    guideHeading: 'Key Questions About Legal Credentials & Practice',
    guideItems: [
      {
        q: '1. What are Al Hussein Mohamed Abdallah’s academic and professional credentials?',
        a: 'Al Hussein Mohamed Abdallah holds a Bachelor of Laws (LL.B.) from Helwan University (Class of 2024) with an overall grade of Good. He is an active Member of the Egyptian Bar Association and completed his mandatory military service with an evaluation of Highly Commended.'
      },
      {
        q: '2. Which Egyptian courts and legal areas does he practice in?',
        a: 'He has 3 years of practical legal training (2024–2026) across 3 core jurisdictions: (1) Family & Personal Status Courts (alimony, Khula, divorce for harm, educational guardianship), (2) Civil Courts (signature validity lawsuits, civil litigation, legal consultations), and (3) the Egyptian State Council (employment settlements, financial differences, and public appointment disputes).'
      },
      {
        q: '3. Which law offices did he train and work with between 2024 and 2026?',
        a: 'He trained across four specialized law offices in reverse chronological order: Mohamed Sabry Law Office (2026 – Family & Personal Status), Yousry El-Sayed Law Office for Legal Practice and Consultations (2025 – Civil & Advisory), Mohamed Shehata Law Office (2024 – Civil Courts & Signature Validity), and Haitham Helmy Law Office (2024 – Administrative Judiciary & State Council).'
      },
      {
        q: '4. How can law firms or corporate legal departments contact him directly?',
        a: 'He is based in Boulaq El Dakrour, Giza, Egypt, and is available for Junior Lawyer, Legal Associate, Legal Researcher, and Corporate Legal Specialist roles across Giza and Greater Cairo. Direct Mobile: 01040542354 | Email: hm8550845@gmail.com.'
      }
    ],
    contactCoordinates: [
      ['Full Name', 'Al Hussein Mohamed Abdallah'],
      ['Professional Title', 'Legal Professional | Junior Legal Associate'],
      ['Bar Association', 'Member of the Egyptian Bar Association'],
      ['University & Degree', 'Bachelor of Laws (LL.B.), Helwan University (2024)'],
      ['Academic Grade', 'Good'],
      ['Military Service', 'Completed – Highly Commended'],
      ['Mobile / WhatsApp', '01040542354'],
      ['Email Address', 'hm8550845@gmail.com'],
      ['Address', 'Boulaq El Dakrour, Giza, Egypt']
    ],
    footerPrimary: 'Al Hussein Mohamed Abdallah — Legal Professional & Junior Legal Associate • Egyptian Bar Association Member',
    footerLocation: 'Boulaq El Dakrour, Giza • Greater Cairo • Family, Civil & State Council Courts • Mobile: 01040542354'
  }
}

export const PROCEDURAL_TRACKS: Record<'ar' | 'en', Record<1 | 2 | 3 | 4, ProceduralTrack>> = {
  ar: {
    1: {
      badge: 'محكمة الأسرة',
      authority: 'محكمة الأسرة المختصة ومكتب تسوية المنازعات الأسرية',
      legalBasis: 'قانون إنشاء محاكم الأسرة رقم ١٠ لسنة ٢٠٠٤ وقوانين الأحوال الشخصية المصرية',
      steps: [
        ['المرحلة الأولى • مكتب تسوية المنازعات الأسرية', 'تقديم طلب التسوية الوجوبي أمام مكتب تسوية المنازعات الأسرية المختص ومتابعة جلسة التسوية خلال المدة القانونية المقررة.'],
        ['المرحلة الثانية • صياغة وقيد صحيفة الدعوى', 'تحرير عريضة الدعوى (نفقة زوجية / صغار / خلع / تطليق للضرر) وإرفاق المستندات الرسمية وقيدها بقلم كتاب محكمة الأسرة.'],
        ['المرحلة الثالثة • الإعلان القانوني وجلسات المحكمة', 'متابعة إعلان الصحيفة عبر قلم المحضرين، وعرض مقدم الصداق في دعاوى الخلع وحضور جلسات الحكمين والخبراء والمرافعة.'],
        ['المرحلة الرابعة • حوافظ المستندات واستصدار الحكم', 'تقديم حوافظ المستندات والتحريات الإدارية عن الدخل والمذكرات الختامية حتى صدور الحكم واستخراج الصيغة التنفيذية.']
      ],
      documents: [
        'التوكيل الرسمي العام في القضايا وبطاقة الرقم القومي السارية',
        'أصل أو صورة رسمية من وثيقة الزواج (أو إشهاد الطلاق عند الاقتضاء)',
        'شهادات ميلاد الصغار المميكنة في دعاوى النفقة والحضانة',
        'ما يثبت دخل المدعى عليه أو مستندات الضرر والمصروفات الفعلية'
      ]
    },
    2: {
      badge: 'قاضي الأمور الوقتية',
      authority: 'رئيس محكمة الأسرة بصفته قاضياً للأمور الوقتية',
      legalBasis: 'المادة ٥٤ من قانون الطفل المصري وقرارات تنظيم الولاية التعليمية',
      steps: [
        ['المرحلة الأولى • صياغة الأمر الوقتي على عريضة', 'إعداد طلب أمر على عريضة من نسختين لرئيس محكمة الأسرة بصفته قاضياً للأمور الوقتية لإثبات الولاية التعليمية للحاضنة.'],
        ['المرحلة الثانية • استيفاء المستندات الرسمية', 'إرفاق أصل شهادة ميلاد الصغير، وبيان القيد الدراسي، وما يفيد قيام النزاع الزوجي أو الطلاق وحيازة الصغير.'],
        ['المرحلة الثالثة • صدور الأمر القضائي الوقتي', 'متابعة عرض الطلب على القاضي المختص واستصدار الأمر الوقتي بثبوت الولاية التعليمية خلال أيام عمل قليلة.'],
        ['المرحلة الرابعة • إعلان الإدارة التعليمية والتنفيذ', 'استلام الصيغة التنفيذية للأمر الوقتي وإعلانه للمدرسة والإدارة التعليمية المختصة لتمكين الحاضنة من مباشرة الشؤون التعليمية.']
      ],
      documents: [
        'التوكيل الرسمي وبطاقة الرقم القومي للحاضنة',
        'أصل شهادة ميلاد الصغير المميكنة',
        'بيان قيد مدرسي حديث أو إفادة من المدرسة المقيد بها الصغير',
        'وثيقة الزواج أو الطلاق وما يثبت وجود نزاع قائم أو حضانة فعلية'
      ]
    },
    3: {
      badge: 'المحاكم المدنية',
      authority: 'المحكمة الجزئية أو الابتدائية المدنية المختصة وقلم المحضرين',
      legalBasis: 'المادة ٤٥ من قانون الإثبات المصري وقانون المرافعات المدنية والتجارية',
      steps: [
        ['المرحلة الأولى • إعداد صحيفة الدعوى المدنية', 'صياغة عريضة الدعوى (صحة توقيع أو منازعة مدنية) وإيداع أصل العقد أو المحرر العرفي داخل حافظة مستندات مفهرسة.'],
        ['المرحلة الثانية • تقدير الرسوم والقيد بالجدول', 'سداد الرسوم القضائية والدمغات النقابية وقيد الدعوى بجدول المحكمة المدنية المختصة وتحديد تاريخ الجلسة الأولى.'],
        ['المرحلة الثالثة • الإعلان القانوني بقلم المحضرين', 'تسليم أصل الصحيفة لقلم المحضرين والتأكد من تمام إعلان المدعى عليه لشخصه أو في موطنه القانوني وفقاً للقانون.'],
        ['المرحلة الرابعة • حضور الجلسة واستلام الحكم', 'حضور الجلسات وتبادل المذكرات وحجز الدعوى للحكم واستخراج الصورة الرسمية والتنفيذية من الحكم.']
      ],
      documents: [
        'التوكيل الرسمي العام في القضايا ودمغة المحاماة',
        'أصل العقد أو المحرر العرفي محل الدعوى في حافظة مستندات',
        'صور واضحة من بطاقات الرقم القومي لأطراف التعاقد وعنوان المدعى عليه',
        'أية إنذارات سابقة أو إيصالات سداد أو مراسلات مؤيدة للطلبات'
      ]
    },
    4: {
      badge: 'مجلس الدولة',
      authority: 'محاكم القضاء الإداري والمحاكم الإدارية وهيئة مفوضي الدولة',
      legalBasis: 'قانون مجلس الدولة رقم ٤٧ لسنة ١٩٧٢ وقانون الخدمة المدنية رقم ٨١ لسنة ٢٠١٦',
      steps: [
        ['المرحلة الأولى • التظلم الوجوبي ولجان التوفيق', 'تقديم التظلم الإداري الوجوبي للجهة الإدارية خلال ٦٠ يوماً، وتقديم طلب لجنة التوفيق في بعض المنازعات المختصة.'],
        ['المرحلة الثانية • إيداع عريضة الدعوى بمجلس الدولة', 'إعداد صحيفة الدعوى الإدارية مرفقاً بها بيان الحالة الوظيفية ومفردات المرتب وإيداعها بقلم كتاب المحكمة المختصة.'],
        ['المرحلة الثالثة • مرحلة هيئة مفوضي الدولة', 'متابعة الدعوى أمام هيئة مفوضي الدولة، والرد على مذكرات جهة الإدارة، وتقديم المستندات التكميلية حتى إيداع التقرير القانوني.'],
        ['المرحلة الرابعة • جلسات المحكمة والحكم الإداري', 'حضور الجلسات أمام الدائرة المختصة بمجلس الدولة في قضايا التسويات الوظيفية والفروق المالية والتعيينات واستلام الأحكام.']
      ],
      documents: [
        'التوكيل الرسمي وبطاقة الرقم القومي',
        'بيان حالة وظيفية حديث ومعتمد من جهة العمل',
        'بيان مفردات مرتب أو صورة القرار الإداري المطعون فيه',
        'إيصال التظلم الإداري وتوصية لجنة التوفيق في المنازعات'
      ]
    }
  },
  en: {
    1: {
      badge: 'Family Court',
      authority: 'Competent Family Court & Family Dispute Settlement Office',
      legalBasis: 'Egyptian Family Courts Law No. 10 of 2004 & Personal Status Statutes',
      steps: [
        ['Stage 1 • Dispute Settlement Office', 'Filing the mandatory pre-litigation request before the Family Dispute Settlement Office within the statutory window.'],
        ['Stage 2 • Statement of Claim & Filing', 'Drafting the lawsuit petition (alimony, Khula, or divorce for harm), attaching civil records, and registering at the clerk office.'],
        ['Stage 3 • Bailiff Service & Hearings', 'Completing lawful summons service via bailiffs, attending court-mandated reconciliation or arbitration sessions, and court hearings.'],
        ['Stage 4 • Evidentiary Dockets & Judgment', 'Submitting indexed evidentiary portfolios, income inquiries, and closing briefs through judgment issuance and enforcement.']
      ],
      documents: [
        'Official Power of Attorney and valid National ID copy',
        'Official Marriage Certificate (or Divorce Deed where applicable)',
        'Computerized birth certificates for children in alimony or custody claims',
        'Income verification documents, receipts, or supporting evidence'
      ]
    },
    2: {
      badge: 'Temporary Matters Judge',
      authority: 'President of the Family Court (Judge of Temporary Matters)',
      legalBasis: 'Article 54 of the Egyptian Child Law & Educational Guardianship Directives',
      steps: [
        ['Stage 1 • Urgent Petition on Request', 'Drafting an urgent petition on request before the Family Court President to affirm educational guardianship for the custodian.'],
        ['Stage 2 • Official Records Assembly', 'Attaching the child’s birth certificate, official school enrollment certificate, and custody/dispute documentation.'],
        ['Stage 3 • Expedited Judicial Order', 'Submitting the petition for prompt judicial review and obtaining the temporary educational guardianship order.'],
        ['Stage 4 • School Directorate Service', 'Serving the enforceable judicial order on the school administration and educational directorate for immediate effect.']
      ],
      documents: [
        'Official Power of Attorney and custodian’s National ID',
        'Original computerized birth certificate of the child',
        'Current official school enrollment statement',
        'Marriage or divorce certificate and proof of active custody/dispute'
      ]
    },
    3: {
      badge: 'Civil Courts',
      authority: 'Competent Civil Summary or Primary Court & Bailiffs Department',
      legalBasis: 'Article 45 of the Egyptian Evidence Law & Civil Procedures Code',
      steps: [
        ['Stage 1 • Statement of Claim Drafting', 'Preparing the civil statement of claim (Signature Validity or civil dispute) with the original contract placed in an indexed portfolio.'],
        ['Stage 2 • Fee Assessment & Roll Entry', 'Paying statutory court fees, enrolling the lawsuit on the Civil Court docket, and obtaining the first session date.'],
        ['Stage 3 • Official Bailiff Notification', 'Delivering the original summons to the bailiffs department to ensure lawful service on the defendant.'],
        ['Stage 4 • Hearing & Judgment Extraction', 'Attending hearings, exchanging defense briefs, and extracting official and enforceable copies of the judgment.']
      ],
      documents: [
        'Official Power of Attorney and Bar Association stamp',
        'Original contract or customary legal instrument in an indexed folder',
        'National ID copies and verified address of the defendant',
        'Prior legal notices, payment receipts, or supporting correspondence'
      ]
    },
    4: {
      badge: 'State Council',
      authority: 'Administrative Judiciary Courts, Administrative Courts & State Commissioners Authority',
      legalBasis: 'Egyptian State Council Law No. 47 of 1972 & Civil Service Law No. 81 of 2016',
      steps: [
        ['Stage 1 • Mandatory Grievance & Conciliation', 'Submitting the statutory administrative grievance within 60 days and filing before the Dispute Conciliation Committee.'],
        ['Stage 2 • State Council Registry Deposit', 'Filing the administrative petition with employment history and payroll exhibits at the State Council clerk office.'],
        ['Stage 3 • State Commissioners Authority', 'Following up during Commissioners review, responding to administrative memos, and filing supplementary briefs.'],
        ['Stage 4 • Court Hearing & Administrative Ruling', 'Attending chamber hearings for employment settlements, financial differences, or appointment disputes through final judgment.']
      ],
      documents: [
        'Official Power of Attorney and National ID copy',
        'Certified up-to-date public employment status statement',
        'Official payroll breakdown or copy of the contested administrative decree',
        'Administrative grievance receipt and Conciliation Committee recommendation'
      ]
    }
  }
}

export const CV_TEXT_SUMMARIES = {
  ar: `# الحسين محمد عبدالله
باحث قانوني | محامٍ متدرب — عضو بنقابة المحامين المصرية
بولاق الدكرور، الجيزة، مصر | الهاتف: 01040542354 | البريد الإلكتروني: hm8550845@gmail.com

الملخص المهني:
عضو بنقابة المحامين المصرية وحاصل على ليسانس الحقوق من جامعة حلوان عام ٢٠٢٤ بتقدير عام جيد، يمتلك خبرة قانونية عملية على مدار ٣ سنوات (٢٠٢٤–٢٠٢٦) في ٤ مكاتب محاماة متخصصة في القضايا المدنية، ومحاكم الأسرة والأحوال الشخصية، والقضاء الإداري ومجلس الدولة.

الخبرات العملية:
- مكتب محمد صبري المحامي بالنقض (٢٠٢٦) — قضايا الأسرة والأحوال الشخصية (النفقات، الخلع، التطليق للضرر، الولاية التعليمية)
- مكتب يسري السيد للمحاماة والاستشارات القانونية (٢٠٢٥) — التقاضي المدني والاستشارات وتنظيم الملفات
- مكتب محمد شحاته المحامي بالنقض (٢٠٢٤) — المحاكم المدنية ودعاوى صحة التوقيع
- مكتب هيثم حلمي للقضاء الإداري ومجلس الدولة (٢٠٢٤) — التسويات الوظيفية والفروق المالية ومنازعات التعيين

المؤهل والعضوية:
- ليسانس الحقوق — جامعة حلوان (٢٠٢٤) — التقدير العام: جيد
- عضو مقيد بنقابة المحامين المصرية
- أدى الخدمة العسكرية — التقدير: قدوة حسنة`,
  en: `# AL HUSSEIN MOHAMED ABDALLAH
Legal Professional | Junior Legal Associate — Member of the Egyptian Bar Association
Boulaq El Dakrour, Giza, Egypt | Mobile: 01040542354 | Email: hm8550845@gmail.com

PROFESSIONAL SUMMARY:
Egyptian Bar Association member and Bachelor of Laws (LL.B.) graduate from Helwan University (2024, Grade: Good) with 3 years of practical legal training across 4 specialized law offices (2024–2026) covering Civil Courts, Family Courts, and the Egyptian State Council.

PROFESSIONAL EXPERIENCE:
- Mohamed Sabry Law Office – Court of Cassation (2026) — Family & Personal Status Law (Alimony, Khula, Divorce for Harm, Educational Guardianship)
- Yousry El-Sayed Law Office for Legal Practice and Consultations (2025) — Civil Litigation, Consultations & Docket Management
- Mohamed Shehata Law Office – Court of Cassation (2024) — Civil Courts & Signature Validity Lawsuits
- Haitham Helmy Law Office – Administrative Judiciary & State Council (2024) — Employment Settlements, Financial Differences & Appointment Disputes

EDUCATION & CREDENTIALS:
- Bachelor of Laws (LL.B.), Helwan University (2024) — Grade: Good
- Active Member, Egyptian Bar Association
- Completed Mandatory Military Service — Evaluation: Highly Commended`
} as const
