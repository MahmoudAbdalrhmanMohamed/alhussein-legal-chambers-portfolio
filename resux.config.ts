import { defineResuxConfig } from 'resuxjs'

const ENV = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env || {}
const VERCEL_HOST = ENV.VERCEL_ENV === 'production'
  ? (ENV.VERCEL_PROJECT_PRODUCTION_URL || ENV.VERCEL_URL || '')
  : (ENV.VERCEL_URL || '')
const SITE_ORIGIN = VERCEL_HOST ? `https://${VERCEL_HOST}` : ''

const JSON_LD_GRAPH = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': '#al-hussein-mohamed-abdallah',
      name: 'الحسين محمد عبدالله',
      alternateName: 'Al Hussein Mohamed Abdallah',
      image: `${SITE_ORIGIN}/images/alhussein_portrait.jpg`,
      jobTitle: [
        'باحث قانوني | محامٍ متدرب',
        'Legal Professional | Junior Legal Associate'
      ],
      description: 'عضو بنقابة المحامين المصرية وحاصل على ليسانس الحقوق من جامعة حلوان عام 2024 بتقدير عام جيد، يمتلك خبرة قانونية عملية في القضايا المدنية ومحاكم الأسرة ومجلس الدولة.',
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
        '@type': 'ProfessionalService',
        name: 'Egyptian Bar Association'
      },
      knowsLanguage: ['ar-EG', 'en-US']
    },
    {
      '@type': 'LegalService',
      '@id': '#legal-chambers-giza',
      name: 'مكتب الأستاذ الحسين محمد عبدالله للاستشارات والأعمال القانونية',
      alternateName: 'Al Hussein Mohamed Abdallah Legal Chambers',
      telephone: '+20-1040542354',
      email: 'hm8550845@gmail.com',
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
      '@id': '#legal-guide-faq',
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
          name: 'What courts and legal jurisdictions does Al Hussein Mohamed Abdallah specialize in?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Al Hussein Mohamed Abdallah has 3 years of practical legal training (2024–2026) across 4 specialized Egyptian law offices covering Family and Personal Status Courts, Civil Courts, and the Egyptian State Council.'
          }
        }
      ]
    }
  ]
})

const PREFS_AND_SHORTCUTS_SCRIPT = `(function(){try{var r=document.documentElement;var t=localStorage.getItem('resux_hussein_theme')||'light';r.setAttribute('data-theme',t);var isDark=t==='dark';var k=localStorage.getItem('resux_hussein_accent_key')||'navy';var c=localStorage.getItem('resux_hussein_custom_hex')||'#1B365D';var p={navy:{light:['#1B365D','#FFFFFF'],dark:['#60A5FA','#0B0F17']},emerald:{light:['#14532D','#FFFFFF'],dark:['#34D399','#0B0F17']},burgundy:{light:['#7A2323','#FFFFFF'],dark:['#F87171','#0B0F17']},slate:{light:['#78572A','#FFFFFF'],dark:['#FBBF24','#0B0F17']}};var acc='#1B365D',ink='#FFFFFF';if(k==='custom'&&c){acc=c;var h=c.replace('#','');if(h.length===6){var lum=(0.299*parseInt(h.slice(0,2),16)+0.587*parseInt(h.slice(2,4),16)+0.114*parseInt(h.slice(4,6),16))/255;ink=lum>0.62?'#0F172A':'#FFFFFF';}}else{var v=(p[k]||p.navy)[isDark?'dark':'light'];acc=v[0];ink=v[1];}r.style.setProperty('--accent',acc);r.style.setProperty('--accent-ink',ink);r.style.setProperty('--accent-soft','color-mix(in srgb, '+acc+' '+(isDark?'18%':'10%')+', var(--surface))');r.style.setProperty('--accent-border','color-mix(in srgb, '+acc+' '+(isDark?'42%':'30%')+', var(--border))');r.style.setProperty('--secondary',acc);r.style.setProperty('--secondary-soft','color-mix(in srgb, '+acc+' '+(isDark?'16%':'9%')+', var(--surface))');r.style.setProperty('--brass','color-mix(in srgb, '+acc+' 82%, var(--ink))');r.style.setProperty('--brass-soft','color-mix(in srgb, '+acc+' '+(isDark?'20%':'13%')+', var(--surface))');var syncUi=function(){var isAr=(r.getAttribute('lang')||'ar')==='ar';var tl=document.getElementById('btn-theme-text');if(tl){tl.textContent=isAr?(t==='light'?'المظهر الداكن':'المظهر الفاتح'):(t==='light'?'Dark Mode':'Light Mode');}['navy','emerald','burgundy','slate'].forEach(function(id){var b=document.getElementById('swatch-'+id);if(b){b.className=id===k?'swatch-dot active-swatch':'swatch-dot';}});var ci=document.getElementById('custom-color-input');if(ci){ci.value=k==='custom'?c:(p[k]||p.navy).light[0];}var tm=document.querySelector('meta[name="theme-color"]');if(tm){tm.setAttribute('content',acc);}};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',syncUi,{once:true});}else{syncUi();}window.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key&&e.key.toLowerCase()==='k'){e.preventDefault();var b=document.getElementById('btn-cmd-open');if(b)b.click();}else if(e.key==='Escape'){var c1=document.getElementById('btn-detail-close');if(c1)c1.click();var c2=document.getElementById('btn-cmd-close');if(c2)c2.click();}});}catch(e){}})();`

export default defineResuxConfig({
  router: {
    viewTransition: true
  },
  routeRules: {
    '/__resux/runtime-client.mjs': {
      headers: { 'cache-control': 'public, max-age=0, must-revalidate' }
    },
    '/__resux/handlers/**': {
      headers: { 'cache-control': 'public, max-age=0, must-revalidate' }
    },
    '/__resux/plugins/**': {
      headers: { 'cache-control': 'public, max-age=0, must-revalidate' }
    },
    '/__resux/chunks/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: SITE_ORIGIN
    }
  },
  modules: ['resuxjs/i18n'],
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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preload', as: 'image', href: '/images/alhussein_portrait.jpg', fetchpriority: 'high' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Readex+Pro:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap'
        },
        { rel: 'stylesheet', href: '/tailwind.css' }
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
        { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
        { name: 'geo.region', content: 'EG-GZ' },
        { name: 'geo.placename', content: 'Boulaq El Dakrour, Giza, Egypt' },
        { name: 'geo.position', content: '30.0333;31.1833' },
        { property: 'og:type', content: 'profile' },
        { property: 'og:image:type', content: 'image/png' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      script: [
        { innerHTML: PREFS_AND_SHORTCUTS_SCRIPT },
        { type: 'application/ld+json', innerHTML: JSON_LD_GRAPH }
      ],
      style: [
        {
          textContent: ':root { --accent: #1B365D; --accent-ink: #FFFFFF; }'
        }
      ]
    }
  }
})
