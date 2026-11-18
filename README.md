# الأستاذ الحسين محمد عبدالله — موقع السيرة الذاتية القانونية (`resuxjs@0.4.0-beta.7`)

موقع شخصي قانوني ثنائي اللغة (**العربية RTL كلغة افتراضية** والإنجليزية LTR كلغة ثانية) للأستاذ **الحسين محمد عبدالله (`Al Hussein Mohamed Abdallah`)** — باحث قانوني ومحامٍ متدرب وعضو نقابة المحامين المصرية، مبني بالكامل باستخدام إطار العمل **[Resux (`resuxjs@0.4.0-beta.7`)](https://github.com/MahmoudAbdalrhmanMohamed/resux)**.

## هيكل مشروع Resux الكامل (`resuxjs@0.4.0-beta.7`)

```text
├── resux.config.ts                     # إعدادات View Transitions + Fontless 1.3.4 & Fontaine 1.0.3 + resuxjs/icons
├── package.json                        # يعتمد على resuxjs@0.4.0-beta.7
├── tsconfig.json                       # إعدادات TypeScript القياسية لـ Resux
├── tailwind.config.ts                  # متغيرات الألوان والخطوط (Readex Pro + IBM Plex Sans Arabic + Plus Jakarta Sans)
├── .env.example                        # متغيرات بيئة Halal Core CLI (PR #126)
├── assets/
│   ├── css/main.css                    # نظام الألوان الأبيض النقي والكحلي القضائي (Light/Dark + Color Swatches)
│   └── icons/                          # أيقونات SVG قانونية مخصصة (custom:scales, custom:gavel, custom:courthouse, custom:seal)
├── public/
│   └── images/alhussein_portrait.jpg   # الصورة الرسمية للأستاذ الحسين محمد عبدالله
├── composables/
│   ├── usePortfolioPreferences.ts      # حفظ تلقائي في localStorage للغة (ar/en) والمظهر واللون المفضل
│   └── useLegalDossierData.ts          # السجل الكامل للخبرات في 4 مكاتب محاماة (2024–2026)
├── components/
│   ├── ChambersHeader.vue              # هيدر متجاوب من مستويين مع <ResuxLink view-transition> و<Icon>
│   └── ChambersFooter.vue              # الفوتر القانوني مع بيانات النطاق الجغرافي (GEO)
├── pages/
│   ├── index.vue                       # ١. الصفحة الرئيسية والبطاقة المهنية بالصورة الرسمية
│   ├── offices.vue                     # ٢. سجل مكاتب المحاماة الأربعة (2024–2026) مع البحث والفلترة و<RxModal>
│   ├── procedures.vue                  # ٣. مختبر الإجراءات القضائية المصرية و<RxVerificationCode> و<RxSwitch>
│   ├── faq.vue                         # ٤. الدليل القانوني التفاعلي (SEO / GEO / AEO FAQ) مع <RxAccordion>
│   ├── cv.vue                          # ٥. عارض السيرة الذاتية ثنائي اللغة مع <RxTabs>
│   └── contact.vue                     # ٦. نموذج التواصل المباشر المربوط بـ $fetch('/api/inquiries')
└── server/
    └── api/
        ├── dossier.ts                  # مسار Nitro API يرجع بيانات السيرة الذاتية المهيكلة (defineServerHandler)
        └── inquiries.ts                # مسار Nitro API لاستقبال وحفظ رسائل التوظيف والاستشارات (readBody)
```

## طريقة التشغيل محلياً عبر Resux CLI

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل خادم التطوير (Halal Core CLI)
npm run dev

# 3. بناء نسخة الإنتاج (SSR / Prerender)
npm run build
npm run preview
```
