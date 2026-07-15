export const languages = {
  en: { label: 'English', dir: 'ltr' },
  ar: { label: 'العربية', dir: 'rtl' }
} as const

export type Lang = keyof typeof languages

export const translations = {
  en: {
    nav: {
      home: 'Home',
      join: 'Join a Queue',
      discover: 'Discover',
      register: 'Business Register',
      login: 'Business Login',
      developers: 'Developers',
      dashboard: 'Dashboard',
      themeLight: 'Light mode',
      themeDark: 'Dark mode',
    },
    hero: {
      badge: 'Now with API access for businesses',
      title1: 'Skip the line.',
      title2: 'Join remotely.',
      subtitle: 'Virtual queues for banks, clinics, cafes and any business. Real-time updates. No app download needed.',
      cta1: 'Join a Queue',
      cta2: 'Business Login',
      cta3: 'API Docs'
    },
    discover: {
      searchPlaceholder: 'Search by name...',
      noResults: 'No queues found - try a different search'
    },
    feedback: {
      title: 'How was your experience?',
      subtitle: 'Rate your visit today',
      thankYou: 'Thank you!',
      helpful: 'Your feedback helps us improve the service.'
    },
    stats: {
      queues: 'Active queues',
      served: 'People served today',
      wait: 'Avg wait reduction'
    },
    ticket: {
      your: 'Your ticket',
      position: 'Position',
      wait: 'Est. wait',
      called: "It is your turn!",
      proceed: 'Please proceed now'
    },
    join: {
      title: 'Join a Queue',
      placeholder: 'Enter queue ID or scan QR',
      phonePlaceholder: 'Phone number (for WhatsApp)',
      button: 'Join Queue',
      joining: 'Joining...',
      subtitle: 'We will notify you when your turn is near'
    },
    login: {
      title: 'Business Login',
      email: 'Email',
      password: 'Password',
      button: 'Login',
      loading: 'Logging in...'
    },
    developers: {
      badge: 'Developer API',
      title1: 'Build with',
      title2: 'Queuely',
      subtitle: 'Embed virtual queues into your own app with a single API call.',
      apiKey: 'Your API Key',
      apiKeyDescription: 'Generate a key to start making API calls. Keep it secret.',
      generate: 'Generate API Key',
      generating: 'Generating...',
      endpoints: 'Endpoints',
      copy: 'Copy',
      copied: 'Copied!'
    },
    dashboard: {
      title: 'Business Dashboard',
      load: 'Load Queue',
      enterId: 'Enter Queue ID',
      connecting: 'Connecting to queue...',
      waiting: 'Waiting...',
      serving: 'Currently Serving',
      avg: 'Average Waiting Time',
      callNext: 'Call Next',
      waitingList: 'Waiting Tickets',
      empty: 'Queue is empty',
      position: 'Position',
      none: 'None',
      mins: 'mins'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      join: 'انضم لطابور',
      discover: 'استكشف',
      register: 'تسجيل الأعمال',
      login: 'دخول الأعمال',
      developers: 'المطورين',
      dashboard: 'لوحة التحكم',
      themeLight: 'الوضع الفاتح',
      themeDark: 'الوضع الداكن',
    },
    hero: {
      badge: 'متاح الآن: API للشركات',
      title1: 'تخطى الطابور.',
      title2: 'انضم عن بُعد.',
      subtitle: 'طوابير افتراضية للبنوك والعيادات والمقاهي وأي مكان. تحديثات فورية. بدون تحميل تطبيق.',
      cta1: 'انضم لطابور',
      cta2: 'دخول الأعمال',
      cta3: 'وثائق API'
    },
    stats: {
      queues: 'طابور نشط',
      served: 'شخص تمت خدمته اليوم',
      wait: 'تقليل وقت الانتظار'
    },
    ticket: {
      your: 'تذكرتك',
      position: 'ترتيبك',
      wait: 'وقت الانتظار',
      called: '!دورك الآن',
      proceed: 'تفضل الآن من فضلك'
    },
    dashboard: {
      title: 'لوحة تحكم الأعمال',
      load: 'تحميل الطابور',
      enterId: 'أدخل رقم الطابور',
      connecting: '...جاري الاتصال بالطابور',
      waiting: 'منتظر',
      serving: 'يُخدم الآن',
      avg: 'متوسط الانتظار',
      callNext: 'استدعاء التالي',
      waitingList: 'قائمة الانتظار',
      empty: 'الطابور فارغ',
      position: 'الترتيب',
      none: 'لا يوجد',
      mins: 'دقائق'
    },
    join: {
      title: 'انضم لطابور',
      placeholder: 'أدخل رقم الطابور أو امسح QR',
      phonePlaceholder: 'رقم الهاتف (لـ WhatsApp)',
      button: 'انضم',
      joining: '...جاري الانضمام',
      subtitle: 'سنُعلمك عندما يقترب دورك'
    },
    login: {
      title: 'تسجيل دخول الأعمال',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      button: 'تسجيل الدخول',
      loading: '...جاري تسجيل الدخول'
    },
    developers: {
      badge: 'واجهة المطورين',
      title1: 'ابنِ مع',
      title2: 'Queuely',
      subtitle: 'ادمج الطوابير الافتراضية في تطبيقك عبر استدعاء API واحد.',
      apiKey: 'مفتاح API الخاص بك',
      apiKeyDescription: 'أنشئ مفتاحًا لبدء استخدام واجهات API. احتفظ به سريًا.',
      generate: 'إنشاء مفتاح API',
      generating: '...جاري الإنشاء',
      endpoints: 'النقاط النهائية',
      copy: 'نسخ',
      copied: '!تم النسخ'
    },
    discover: {
      searchPlaceholder: 'ابحث بالاسم...',
      noResults: 'لم يتم العثور على طوابير - جرب بحثًا آخر'
    },
    feedback: {
      title: 'كيف كانت تجربتك؟',
      subtitle: 'قيّم زيارتك اليوم',
      thankYou: 'شكرًا لك!',
      helpful: 'ملاحظاتك تساعدنا على تحسين الخدمة.'
    },
  }
}