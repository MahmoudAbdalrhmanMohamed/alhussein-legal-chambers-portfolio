export interface LawOfficeTenure {
  id: string
  category: string
  year: string
  titleAr: string
  titleEn: string
  roleAr: string
  roleEn: string
  badgeAr: string
  badgeEn: string
  highlightsAr: string[]
  highlightsEn: string[]
}

export const LAW_OFFICE_TENURES: LawOfficeTenure[] = [
  {
    id: 'sabry-2026',
    category: 'FAMILY_LAW',
    year: '2026',
    titleAr: 'مكتب محمد صبري المحامي بالنقض',
    titleEn: 'Mohamed Sabry Law Office – Lawyer before the Court of Cassation',
    roleAr: 'محامٍ متدرب / باحث قانوني',
    roleEn: 'Junior Legal Associate | Legal Trainee',
    badgeAr: 'قضايا الأسرة والأحوال الشخصية',
    badgeEn: 'Family & Personal Status Law',
    highlightsAr: [
      'تنسيق وإعداد ملفات القضايا في 4 مسارات رئيسية لقضايا الأسرة والأحوال الشخصية، مع الالتزام بنسبة 100% بالمواعيد الإجرائية القانونية.',
      'إعداد ومتابعة 3 أنواع رئيسية من دعاوى النفقات (نفقة زوجية، ونفقة صغار، ومصروفات) منذ قيد الصحيفة وحتى استصدار الأحكام وتنفيذها.',
      'مباشرة الإجراءات القانونية في مسارين رئيسيين لإنهاء العلاقة الزوجية قضائياً (دعاوى الخلع ودعاوى التطليق للضرر) عبر مراحل التسوية والمحاكمة.',
      'صياغة وتقديم طلبات ومنازعات الولاية التعليمية، واستيفاء 100% من المستندات الرسمية والإفادات التعليمية المطلوبة قبل جلسات الفصل.',
      'تجهيز المستندات وحوافظ المستندات عبر 5 مراحل إجرائية أمام محاكم الأسرة، بدءاً من مكاتب تسوية المنازعات الأسرية وحتى صدور الأحكام.'
    ],
    highlightsEn: [
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
    titleAr: 'مكتب يسري السيد للمحاماة والاستشارات القانونية',
    titleEn: 'Yousry El-Sayed Law Office for Legal Practice and Consultations',
    roleAr: 'محامٍ متدرب / باحث قانوني',
    roleEn: 'Legal Trainee / Junior Legal Professional',
    badgeAr: 'التقاضي المدني والاستشارات',
    badgeEn: 'Civil Litigation & Consultations',
    highlightsAr: [
      'تنظيم الأعمال القانونية اليومية بالمكتب وجدولة الجلسات ومتابعة القرارات القضائية بنسبة 100% من ملفات القضايا المدنية المتداولة.',
      'إعداد مذكرات الاستشارات القانونية الأولية وصياغة المحررات والمستندات القانونية في مجالين رئيسيين: الاستشارات القانونية والمنازعات المدنية.',
      'تنفيذ إجراءات التقاضي المدني عبر 3 مراحل إجرائية أساسية تشمل قيد صحف الدعاوى، ومتابعة إعلانات المحضرين، وحضور الجلسات.',
      'فهرسة ومراجعة وتنظيم 100% من ملفات القضايا وحوافظ المستندات للتأكد من استيفائها الكامل قبل مواعيد الجلسات.',
      'تطوير آليات متابعة الملفات القانونية وتحديث بيانات القضايا عبر 4 مراحل تنظيمية بما يضمن دقة وسرعة الإنجاز المهني بالمكتب.'
    ],
    highlightsEn: [
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
    titleAr: 'مكتب محمد شحاته المحامي بالنقض',
    titleEn: 'Mohamed Shehata Law Office – Lawyer before the Court of Cassation',
    roleAr: 'محامٍ متدرب / باحث قانوني',
    roleEn: 'Junior Legal Professional | Legal Trainee',
    badgeAr: 'المحاكم المدنية وصحة التوقيع',
    badgeEn: 'Civil Litigation & Signature Validity',
    highlightsAr: [
      'مباشرة دعاوى صحة التوقيع عبر 3 خطوات إجرائية متكاملة تشمل إعداد الصحيفة، ومتابعة الإعلان القانوني، وقيد الدعوى بالجلسات.',
      'تحضير ومتابعة القضايا والمنازعات المدنية عبر 4 مراحل إجرائية أمام المحاكم المدنية من قيد الدعوى وتبادل المذكرات حتى استلام الأحكام.',
      'تجميع وتصنيف 100% من المستندات والحوافظ القانونية ومذكرات الدفاع المطلوبة لملفات القضايا المدنية المتداولة.',
      'متابعة رول الجلسات والقرارات التمهيدية والأحكام القضائية في 100% من الملفات النشطة لضمان تنفيذ قرارات المحكمة في مواعيدها.',
      'إدارة وتحديث الأرشيف القانوني الورقي والرقمي لملفات الدعاوى المدنية إلى مستويين تصنيفيين وتوثيق كافة الإجراءات المتخذة بكل ملف.'
    ],
    highlightsEn: [
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
    titleAr: 'مكتب هيثم حلمي للقضاء الإداري ومجلس الدولة',
    titleEn: 'Haitham Helmy Law Office – Administrative Judiciary and State Council',
    roleAr: 'محامٍ متدرب / باحث قانوني',
    roleEn: 'Legal Trainee / Junior Legal Professional',
    badgeAr: 'القضاء الإداري ومجلس الدولة',
    badgeEn: 'State Council & Administrative Law',
    highlightsAr: [
      'بحث وتحضير ملفات قضايا ومنازعات القضاء الإداري في 4 أنواع رئيسية من دعاوى الوظيفة العامة أمام محاكم مجلس الدولة.',
      'تجهيز بيانات الحالة الوظيفية والمستندات اللازمة لقضايا التسويات الوظيفية وتعديل الدرجات المالية عبر 3 مراحل إدارية وقضائية.',
      'مراجعة وفحص المستندات الخاصة بدعاوى المطالبة في مسارين رئيسيين للمستحقات: الفروق المالية والمستحقات الوظيفية للعاملين.',
      'دراسة القرارات الإدارية واللوائح المنظمة لمنازعات التعيين والتظلمات الوظيفية عبر 3 مراحل تشمل التظلم الإداري ولجان التوفيق والمحكمة.',
      'إتمام إجراءات إعداد ورفع الدعاوى الإدارية عبر 4 خطوات أساسية أمام مجلس الدولة: التظلم، وهيئة مفوضي الدولة، وإيداع الصحيفة، ومتابعة الجلسات.'
    ],
    highlightsEn: [
      'Researched public-law precedents across 4 administrative dispute categories before the Egyptian State Council.',
      'Consolidated personnel records and regulatory exhibits for public-sector employment settlement lawsuits over 3 judicial review stages.',
      'Audited statutory pay schedules and service histories for 2 public-employee claim types: financial differences and job entitlements.',
      'Analyzed administrative decrees and civil service statutes for appointment disputes during 3 pre-litigation and State Council phases.',
      'Delivered end-to-end administrative lawsuit filings through 4 State Council steps: mandatory grievance, Commissioners review, registry deposit, and judgment follow-up.'
    ]
  }
]
