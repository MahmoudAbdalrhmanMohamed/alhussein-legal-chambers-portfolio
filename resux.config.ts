import { existsSync, readFileSync } from 'node:fs'
import { defineResuxConfig } from 'resuxjs'

const ENV = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env || {}
const VERCEL_HOST = ENV.VERCEL_ENV === 'production'
  ? (ENV.VERCEL_PROJECT_PRODUCTION_URL || ENV.VERCEL_URL || 'alhussein-legal-chambers-portfolio.vercel.app')
  : (ENV.VERCEL_URL || '')
const SITE_ORIGIN = VERCEL_HOST ? `https://${VERCEL_HOST}` : ''
const CANONICAL_ORIGIN = SITE_ORIGIN || 'https://alhussein-legal-chambers-portfolio.vercel.app'
const IS_DEV = ENV.npm_lifecycle_event === 'dev'
const INLINE_TAILWIND_CSS = !IS_DEV && existsSync('public/tailwind.css')
  ? readFileSync('public/tailwind.css', 'utf8')
  : ''

const JSON_LD_GRAPH = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${CANONICAL_ORIGIN}/#website`,
      url: `${CANONICAL_ORIGIN}/`,
      name: 'الحسين محمد عبدالله | الملف القانوني الرسمي',
      alternateName: 'Al Hussein Mohamed Abdallah | Official Legal Portfolio',
      inLanguage: ['ar-EG', 'en-US'],
      publisher: { '@id': `${CANONICAL_ORIGIN}/#al-hussein-mohamed-abdallah` }
    },
    {
      '@type': 'Person',
      '@id': `${CANONICAL_ORIGIN}/#al-hussein-mohamed-abdallah`,
      url: `${CANONICAL_ORIGIN}/`,
      name: 'الحسين محمد عبدالله',
      alternateName: 'Al Hussein Mohamed Abdallah',
      image: `${CANONICAL_ORIGIN}/images/alhussein_portrait.webp`,
      jobTitle: [
        'باحث قانوني | محامٍ متدرب',
        'Legal Professional | Junior Legal Associate'
      ],
      description: 'عضو بنقابة المحامين المصرية وحاصل على ليسانس الحقوق من جامعة حلوان عام 2024 بتقدير عام جيد، يمتلك خبرة قانونية عملية على مدار 3 سنوات في 4 مكاتب محاماة متخصصة في القضايا المدنية ومحاكم الأسرة ومجلس الدولة.',
      telephone: '+20-1040542354',
      email: 'mailto:hm8550845@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Boulaq El Dakrour, Giza',
        addressRegion: 'Giza Governorate',
        addressCountry: 'EG'
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Helwan University',
        sameAs: 'https://www.helwan.edu.eg/'
      },
      memberOf: {
        '@type': 'Organization',
        name: 'Egyptian Bar Association'
      },
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'degree',
          name: 'Bachelor of Laws (LL.B.) — Helwan University (2024, Grade: Good)'
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'membership',
          name: 'Egyptian Bar Association Active Membership'
        }
      ],
      knowsAbout: [
        'Egyptian Civil Litigation',
        'Signature Validity Lawsuits (Article 45 Evidence Law)',
        'Egyptian Family Courts & Personal Status Law',
        'Alimony, Khula, Divorce for Harm, Educational Guardianship',
        'Egyptian State Council & Administrative Judiciary',
        'Public Employment Settlements & Financial Differences'
      ],
      knowsLanguage: ['ar-EG', 'en-US']
    },
    {
      '@type': 'LegalService',
      '@id': `${CANONICAL_ORIGIN}/#legal-chambers-giza`,
      url: `${CANONICAL_ORIGIN}/`,
      image: `${CANONICAL_ORIGIN}/og-ar.png`,
      name: 'مكتب الأستاذ الحسين محمد عبدالله للاستشارات والأعمال القانونية',
      alternateName: 'Al Hussein Mohamed Abdallah Legal Chambers',
      telephone: '+20-1040542354',
      email: 'hm8550845@gmail.com',
      availableLanguage: ['Arabic', 'English'],
      serviceType: [
        'Civil Litigation',
        'Family & Personal Status Law',
        'Administrative Judiciary & State Council Disputes',
        'Legal Research & Judicial Drafting'
      ],
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Giza' },
        { '@type': 'AdministrativeArea', name: 'Greater Cairo' },
        { '@type': 'Country', name: 'Egypt' }
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 30.0333,
        longitude: 31.1833
      }
    },
    {
      '@type': 'FAQPage',
      '@id': `${CANONICAL_ORIGIN}/#legal-guide-faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'ما هي المؤهلات القانونية والعضويات المهنية للأستاذ الحسين محمد عبدالله؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'الأستاذ الحسين محمد عبدالله حاصل على ليسانس الحقوق من جامعة حلوان دفعة 2024 بتقدير عام جيد، وهو عضو مقيد بنقابة المحامين المصرية، وقد أتم الخدمة العسكرية بتقدير قدوة حسنة.'
          }
        },
        {
          '@type': 'Question',
          name: 'ما هي المحاكم والقطاعات القضائية التي يمتلك فيها الأستاذ الحسين خبرة عملية؟',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'يمتلك خبرة عملية على مدار 3 سنوات (2024–2026) في 4 مكاتب محاماة متخصصة تغطي محاكم الأسرة والأحوال الشخصية، والمحاكم المدنية ودعاوى صحة التوقيع، ومحاكم مجلس الدولة والقضاء الإداري بالجيزة والقاهرة الكبرى.'
          }
        },
        {
          '@type': 'Question',
          name: 'What courts and legal jurisdictions does Al Hussein Mohamed Abdallah specialize in?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Al Hussein Mohamed Abdallah has 3 years of practical legal training (2024–2026) across 4 specialized Egyptian law offices covering Family and Personal Status Courts, Civil Courts, and the Egyptian State Council across Giza and Greater Cairo.'
          }
        },
        {
          '@type': 'Question',
          name: 'How can law firms or corporate legal departments contact Al Hussein Mohamed Abdallah or download his CV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Direct contact is available by phone at +20 1040542354, email at hm8550845@gmail.com, or via the online inquiry form. Official Arabic and English PDF CVs are available directly on the /cv and /en/cv pages.'
          }
        }
      ]
    }
  ]
})

const PREFS_AND_SHORTCUTS_SCRIPT = `(function(){try{var r=document.documentElement;var t=localStorage.getItem('resux_hussein_theme')||'light';var k=localStorage.getItem('resux_hussein_accent_key')||'navy';var c=localStorage.getItem('resux_hussein_custom_hex')||'#1B365D';var isDark=t==='dark';if(isDark){r.setAttribute('data-theme','dark');}var p={navy:{light:['#1B365D','#FFFFFF'],dark:['#60A5FA','#0B0F17']},emerald:{light:['#14532D','#FFFFFF'],dark:['#34D399','#0B0F17']},burgundy:{light:['#7A2323','#FFFFFF'],dark:['#F87171','#0B0F17']},slate:{light:['#78572A','#FFFFFF'],dark:['#FBBF24','#0B0F17']}};var acc='#1B365D',ink='#FFFFFF';if(isDark||k!=='navy'){if(k==='custom'&&c){acc=c;var h=c.replace('#','');if(h.length===6){var lum=(0.299*parseInt(h.slice(0,2),16)+0.587*parseInt(h.slice(2,4),16)+0.114*parseInt(h.slice(4,6),16))/255;ink=lum>0.62?'#0F172A':'#FFFFFF';}}else{var v=(p[k]||p.navy)[isDark?'dark':'light'];acc=v[0];ink=v[1];}var ch=acc.replace('#','');var rr=parseInt(ch.slice(0,2),16)||27,gg=parseInt(ch.slice(2,4),16)||54,bb=parseInt(ch.slice(4,6),16)||93;r.style.setProperty('--accent',acc);r.style.setProperty('--accent-ink',ink);r.style.setProperty('--accent-soft','rgba('+rr+','+gg+','+bb+','+(isDark?0.18:0.10)+')');r.style.setProperty('--accent-border','rgba('+rr+','+gg+','+bb+','+(isDark?0.42:0.28)+')');r.style.setProperty('--secondary',acc);r.style.setProperty('--secondary-soft','rgba('+rr+','+gg+','+bb+','+(isDark?0.16:0.11)+')');r.style.setProperty('--brass',acc);r.style.setProperty('--brass-soft','rgba('+rr+','+gg+','+bb+','+(isDark?0.20:0.13)+')');var syncUi=function(){var isAr=(r.getAttribute('lang')||'ar')==='ar';var tl=document.getElementById('btn-theme-text');if(tl){tl.textContent=isAr?(t==='light'?'المظهر الداكن':'المظهر الفاتح'):(t==='light'?'Dark Mode':'Light Mode');}['navy','emerald','burgundy','slate'].forEach(function(id){var b=document.getElementById('swatch-'+id);if(b){b.className=id===k?'swatch-dot active-swatch':'swatch-dot';}});var ci=document.getElementById('custom-color-input');if(ci){ci.value=k==='custom'?c:(p[k]||p.navy).light[0];}var tm=document.querySelector('meta[name="theme-color"]');if(tm){tm.setAttribute('content',acc);}};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',syncUi,{once:true});}else{syncUi();}}window.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key&&e.key.toLowerCase()==='k'){e.preventDefault();var b=document.getElementById('btn-cmd-open');if(b)b.click();}else if(e.key==='Escape'){var c1=document.getElementById('btn-detail-close');if(c1)c1.click();var c2=document.getElementById('btn-cmd-close');if(c2)c2.click();}});}catch(e){}})();`

export default defineResuxConfig({
  router: {
    viewTransition: true
  },
  routeRules: {
    '/**': {
      headers: { 'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, must-revalidate' }
    },
    '/api/**': {
      headers: { 'cache-control': 'no-store' }
    },
    '/__resux/runtime-client.mjs': {
      headers: { 'cache-control': 'public, max-age=0, s-maxage=3600, must-revalidate' }
    },
    '/__resux/handlers/**': {
      headers: { 'cache-control': 'public, max-age=0, s-maxage=3600, must-revalidate' }
    },
    '/__resux/plugins/**': {
      headers: { 'cache-control': 'public, max-age=0, s-maxage=3600, must-revalidate' }
    },
    '/__resux/chunks/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    '/__resux/image': {
      headers: { 'cache-control': 'public, max-age=31536000, s-maxage=31536000, immutable' }
    },
    '/images/**': {
      headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' }
    },
    '/cv/**': {
      headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' }
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: SITE_ORIGIN,
      image: {
        format: 'webp',
        quality: 84,
        densities: [1, 2]
      }
    }
  },
  modules: [
    'resuxjs/i18n',
    'security'
  ],
  i18n: {
    defaultLocale: 'ar',
    fallbackLocale: 'ar',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'ar', name: 'العربية', dir: 'rtl' },
      { code: 'en', name: 'English', dir: 'ltr' }
    ]
  },
  app: {
    head: {
      title: 'الحسين محمد عبدالله | باحث قانوني ومحامٍ متدرب',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
        { rel: 'preload', as: 'image', href: '/images/alhussein_portrait.webp', type: 'image/webp', fetchpriority: 'high' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Readex+Pro:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap',
          media: 'print',
          onload: "this.media='all'"
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        ...(INLINE_TAILWIND_CSS ? [] : [{ rel: 'stylesheet', href: '/tailwind.css' }])
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'theme-color', content: '#1B365D' },
        {
          name: 'description',
          content: 'الموقع الرسمي والسيرة الذاتية للأستاذ الحسين محمد عبدالله — باحث قانوني ومحامٍ متدرب، عضو نقابة المحامين المصرية، ليسانس الحقوق جامعة حلوان (2024).'
        },
        { name: 'author', content: 'الحسين محمد عبدالله — Al Hussein Mohamed Abdallah' },
        { name: 'google-site-verification', content: 'fSLFaGjegny-_ZWDWXEp9G8qtrfkebhJpZe4PvVJjAE' },
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        { name: 'geo.region', content: 'EG-GZ' },
        { name: 'geo.placename', content: 'Boulaq El Dakrour, Giza, Egypt' },
        { name: 'geo.position', content: '30.0333;31.1833' },
        { name: 'ICBM', content: '30.0333, 31.1833' },
        { property: 'og:type', content: 'profile' },
        { property: 'og:image:type', content: 'image/png' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtm.js?id=GTM-NKD7FWZP',
          async: true
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());`
        },
        { innerHTML: PREFS_AND_SHORTCUTS_SCRIPT },
        { type: 'application/ld+json', innerHTML: JSON_LD_GRAPH }
      ],
      noscript: [
        {
          innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NKD7FWZP" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
        },
        {
          innerHTML: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Readex+Pro:wght@600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap">`
        }
      ],
      style: [
        ...(INLINE_TAILWIND_CSS
          ? [{ id: 'resux-tailwind-inline', textContent: INLINE_TAILWIND_CSS }]
          : []),
        {
          textContent: ':root { --accent: #1B365D; --accent-ink: #FFFFFF; --font-ar-body: "IBM Plex Sans Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Arabic", "Cairo", Arial, sans-serif; --font-ar-heading: "Readex Pro", "IBM Plex Sans Arabic", "Segoe UI", Arial, sans-serif; --font-en-body: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }'
        }
      ]
    }
  }
})
