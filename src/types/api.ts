// Al-Quran Cloud API Types

export interface ApiResponse<T> {
  code: number
  status: string
  data: T
}

export interface SurahInfo {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface Ayah {
  number: number
  text: string
  surah: SurahInfo
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean | SajdaInfo
}

export interface SajdaInfo {
  id: number
  recommended: boolean
  obligatory: boolean
}

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: string
  numberOfAyahs: number
  ayahs: Ayah[]
}

export interface Edition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: 'text' | 'audio'
  type: 'versebyverse' | 'translation' | 'transliteration' | 'tafsir'
  direction?: 'ltr' | 'rtl'
}

export interface Translation {
  ayah: number
  text: string
  edition: Edition
}

export interface QuranText {
  ayahs: Ayah[]
  surahs: SurahInfo[]
  edition: Edition
}

export interface SearchResult {
  count: number
  matches: SearchMatch[]
}

export interface SearchMatch {
  surah: SurahInfo
  ayah: Ayah
  edition: Edition
}

export interface AudioData {
  ayahs: AudioAyah[]
  surahs: SurahInfo[]
  edition: Edition
}

export interface AudioAyah {
  number: number
  audio: string
  audioSecondary: string[]
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean | SajdaInfo
}

// Word-by-Word specific types
export interface WordByWordData {
  ayah: number
  words: WordInfo[]
}

export interface WordInfo {
  id: number
  position: number
  arabic: string
  transliteration: string
  translation: string
  root?: string
  lemma?: string
  grammar?: GrammarInfo
}

export interface GrammarInfo {
  pos: string // Part of speech
  features: string[]
  root: string
  lemma: string
}

// Popular Translations available in Al-Quran Cloud
export const POPULAR_TRANSLATIONS: Record<string, Edition> = {
  // English Translations
  'en.sahih': {
    identifier: 'en.sahih',
    language: 'en',
    name: 'Saheeh International',
    englishName: 'Saheeh International',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  'en.pickthall': {
    identifier: 'en.pickthall',
    language: 'en',
    name: 'Mohammed Marmaduke William Pickthall',
    englishName: 'Pickthall',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  'en.yusufali': {
    identifier: 'en.yusufali',
    language: 'en',
    name: 'Abdullah Yusuf Ali',
    englishName: 'Yusuf Ali',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  'en.hilali': {
    identifier: 'en.hilali',
    language: 'en',
    name: 'Muhammad Taqi-ud-Din al-Hilali and Muhammad Muhsin Khan',
    englishName: 'Hilali & Khan',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  'en.asad': {
    identifier: 'en.asad',
    language: 'en',
    name: 'Muhammad Asad',
    englishName: 'Muhammad Asad',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  'en.arberry': {
    identifier: 'en.arberry',
    language: 'en',
    name: 'A. J. Arberry',
    englishName: 'Arberry',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  'en.maududi': {
    identifier: 'en.maududi',
    language: 'en',
    name: 'Abul Ala Maududi',
    englishName: 'Maududi',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Urdu Translations
  'ur.jalandhry': {
    identifier: 'ur.jalandhry',
    language: 'ur',
    name: 'Fateh Muhammad Jalandhry',
    englishName: 'Jalandhry (Urdu)',
    format: 'text',
    type: 'translation',
    direction: 'rtl'
  },
  'ur.ahmedali': {
    identifier: 'ur.ahmedali',
    language: 'ur',
    name: 'Ahmed Ali',
    englishName: 'Ahmed Ali (Urdu)',
    format: 'text',
    type: 'translation',
    direction: 'rtl'
  },
  'ur.kanzulimaan': {
    identifier: 'ur.kanzulimaan',
    language: 'ur',
    name: 'Kanz ul Imaan',
    englishName: 'Kanz ul Imaan (Urdu)',
    format: 'text',
    type: 'translation',
    direction: 'rtl'
  },
  
  // Arabic Texts
  'ar.alafasy': {
    identifier: 'ar.alafasy',
    language: 'ar',
    name: 'العفاسي',
    englishName: 'Alafasy (Audio)',
    format: 'audio',
    type: 'versebyverse',
    direction: 'rtl'
  },
  'ar.husary': {
    identifier: 'ar.husary',
    language: 'ar',
    name: 'الحصري',
    englishName: 'Husary (Audio)',
    format: 'audio',
    type: 'versebyverse',
    direction: 'rtl'
  },
  'ar.minshawi': {
    identifier: 'ar.minshawi',
    language: 'ar',
    name: 'المنشاوي',
    englishName: 'Minshawi (Audio)',
    format: 'audio',
    type: 'versebyverse',
    direction: 'rtl'
  },
  'ar.quran': {
    identifier: 'quran-simple',
    language: 'ar',
    name: 'القرآن الكريم',
    englishName: 'Arabic Text (Simple)',
    format: 'text',
    type: 'versebyverse',
    direction: 'rtl'
  },
  'ar.quran-uthmani': {
    identifier: 'quran-uthmani',
    language: 'ar',
    name: 'القرآن الكريم - الرسم العثماني',
    englishName: 'Arabic Text (Uthmani)',
    format: 'text',
    type: 'versebyverse',
    direction: 'rtl'
  },
  
  // French Translations
  'fr.hamidullah': {
    identifier: 'fr.hamidullah',
    language: 'fr',
    name: 'Muhammad Hamidullah',
    englishName: 'Hamidullah (French)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Spanish Translations
  'es.cortes': {
    identifier: 'es.cortes',
    language: 'es',
    name: 'Julio Cortes',
    englishName: 'Cortes (Spanish)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // German Translations
  'de.bubenheim': {
    identifier: 'de.bubenheim',
    language: 'de',
    name: 'Frank Bubenheim and Nadeem Elyas',
    englishName: 'Bubenheim & Elyas (German)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Indonesian Translations
  'id.indonesian': {
    identifier: 'id.indonesian',
    language: 'id',
    name: 'Indonesian Ministry of Religious Affairs',
    englishName: 'Indonesian Translation',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Turkish Translations
  'tr.ates': {
    identifier: 'tr.ates',
    language: 'tr',
    name: 'Süleyman Ateş',
    englishName: 'Ates (Turkish)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Bengali Translations
  'bn.bengali': {
    identifier: 'bn.bengali',
    language: 'bn',
    name: 'Zohurul Hoque',
    englishName: 'Bengali Translation',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Persian Translations
  'fa.ansarian': {
    identifier: 'fa.ansarian',
    language: 'fa',
    name: 'حسین انصاریان',
    englishName: 'Ansarian (Persian)',
    format: 'text',
    type: 'translation',
    direction: 'rtl'
  },
  
  // Russian Translations
  'ru.kuliev': {
    identifier: 'ru.kuliev',
    language: 'ru',
    name: 'Эльмир Кулиев',
    englishName: 'Kuliev (Russian)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Malay Translations
  'ms.basmeih': {
    identifier: 'ms.basmeih',
    language: 'ms',
    name: 'Abdullah Muhammad Basmeih',
    englishName: 'Basmeih (Malay)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Dutch Translations
  'nl.keyzer': {
    identifier: 'nl.keyzer',
    language: 'nl',
    name: 'Salomo Keyzer',
    englishName: 'Keyzer (Dutch)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  },
  
  // Italian Translations
  'it.piccardo': {
    identifier: 'it.piccardo',
    language: 'it',
    name: 'Hamza Roberto Piccardo',
    englishName: 'Piccardo (Italian)',
    format: 'text',
    type: 'translation',
    direction: 'ltr'
  }
}

// Audio Reciters
export const AUDIO_RECITERS: Record<string, Edition> = {
  'ar.alafasy': {
    identifier: 'ar.alafasy',
    language: 'ar',
    name: 'مشاري راشد العفاسي',
    englishName: 'Mishary Rashid Alafasy',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.husary': {
    identifier: 'ar.husary',
    language: 'ar',
    name: 'محمود خليل الحصري',
    englishName: 'Mahmoud Khalil Al-Husary',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.minshawi': {
    identifier: 'ar.minshawi',
    language: 'ar',
    name: 'محمد صديق المنشاوي',
    englishName: 'Mohammad Siddiq Al-Minshawi',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.sudais': {
    identifier: 'ar.abdurrahmaansudais',
    language: 'ar',
    name: 'عبد الرحمن السديس',
    englishName: 'Abdul Rahman Al-Sudais',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.shuraym': {
    identifier: 'ar.saoodshuraym',
    language: 'ar',
    name: 'سعود الشريم',
    englishName: 'Saood bin Ibrahim Ash-Shuraym',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.ghamadi': {
    identifier: 'ar.saadalghamadi',
    language: 'ar',
    name: 'سعد الغامدي',
    englishName: 'Saad Al-Ghamdi',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.ayub': {
    identifier: 'ar.abdullaahcaandoo',
    language: 'ar',
    name: 'عبد الله كاندو',
    englishName: 'Abdullah Awad Al Juhani',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.muaiqly': {
    identifier: 'ar.mahermuaiqly',
    language: 'ar',
    name: 'ماهر المعيقلي',
    englishName: 'Maher Al Muaiqly',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.aziz': {
    identifier: 'ar.abdullaahbasfar',
    language: 'ar',
    name: 'عبد الله بصفر',
    englishName: 'Abdullah Basfar',
    format: 'audio',
    type: 'versebyverse'
  },
  'ar.bukhatir': {
    identifier: 'ar.ahmedneenwaleed',
    language: 'ar',
    name: 'أحمد نعينع',
    englishName: 'Ahmed ibn Ali al-Ajamy',
    format: 'audio',
    type: 'versebyverse'
  }
}

// Language groups for better organization
export const TRANSLATION_GROUPS = {
  english: ['en.sahih', 'en.pickthall', 'en.yusufali', 'en.hilali', 'en.asad', 'en.arberry', 'en.maududi'],
  urdu: ['ur.jalandhry', 'ur.ahmedali', 'ur.kanzulimaan'],
  arabic: ['ar.quran', 'ar.quran-uthmani'],
  french: ['fr.hamidullah'],
  spanish: ['es.cortes'],
  german: ['de.bubenheim'],
  indonesian: ['id.indonesian'],
  turkish: ['tr.ates'],
  bengali: ['bn.bengali'],
  persian: ['fa.ansarian'],
  russian: ['ru.kuliev'],
  malay: ['ms.basmeih'],
  dutch: ['nl.keyzer'],
  italian: ['it.piccardo']
}

// Popular Tafseers (Commentaries)
export const POPULAR_TAFSEERS: Record<string, Edition> = {
  // Arabic Tafseers
  'ar.muyassar': {
    identifier: 'ar.muyassar',
    language: 'ar',
    name: 'التفسير الميسر',
    englishName: 'Tafseer Al-Muyassar',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ar.jalalayn': {
    identifier: 'ar.jalalayn',
    language: 'ar',
    name: 'تفسير الجلالين',
    englishName: 'Tafseer Al-Jalalayn',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ar.qurtubi': {
    identifier: 'ar.qurtubi',
    language: 'ar',
    name: 'تفسير القرطبي',
    englishName: 'Tafseer Al-Qurtubi',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ar.tabari': {
    identifier: 'ar.tabari',
    language: 'ar',
    name: 'تفسير الطبري',
    englishName: 'Tafseer At-Tabari',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ar.baghawi': {
    identifier: 'ar.baghawi',
    language: 'ar',
    name: 'تفسير البغوي',
    englishName: 'Tafseer Al-Baghawi',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ar.kathir': {
    identifier: 'ar.ibnkatheer',
    language: 'ar',
    name: 'تفسير ابن كثير',
    englishName: 'Tafseer Ibn Kathir',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ar.waseet': {
    identifier: 'ar.waseet',
    language: 'ar',
    name: 'التفسير الوسيط',
    englishName: 'At-Tafseer Al-Waseet',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },

  // English Tafseers
  'en.kathir': {
    identifier: 'en.ibnkathir',
    language: 'en',
    name: 'Ibn Kathir',
    englishName: 'Tafsir Ibn Kathir (English)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  },
  'en.maarifulquran': {
    identifier: 'en.maarifulquran',
    language: 'en',
    name: 'Maarif-ul-Quran',
    englishName: 'Maarif-ul-Quran (English)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  },
  'en.tafheem': {
    identifier: 'en.tafheem',
    language: 'en',
    name: 'Tafheem-ul-Quran',
    englishName: 'Tafheem-ul-Quran (Maududi)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  },

  // Urdu Tafseers
  'ur.jalandhri': {
    identifier: 'ur.jalandhri',
    language: 'ur',
    name: 'تفسیر فتح محمد جالندھری',
    englishName: 'Tafseer Jalandhri (Urdu)',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ur.kanzulimaan': {
    identifier: 'ur.kanzulimaan',
    language: 'ur',
    name: 'کنز الایمان',
    englishName: 'Kanz-ul-Imaan (Urdu)',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },
  'ur.ahsanulbayan': {
    identifier: 'ur.ahsanulbayan',
    language: 'ur',
    name: 'احسن البیان',
    englishName: 'Ahsan-ul-Bayan (Urdu)',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },

  // Persian Tafseers
  'fa.makarem': {
    identifier: 'fa.makarem',
    language: 'fa',
    name: 'تفسیر نمونه',
    englishName: 'Tafsir Nemooneh (Persian)',
    format: 'text',
    type: 'tafsir',
    direction: 'rtl'
  },

  // Indonesian Tafseers
  'id.quraish': {
    identifier: 'id.quraish',
    language: 'id',
    name: 'Tafsir Al-Misbah',
    englishName: 'Tafsir Al-Misbah (Indonesian)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  },

  // Turkish Tafseers
  'tr.ates': {
    identifier: 'tr.ates',
    language: 'tr',
    name: 'Süleyman Ateş Tefsiri',
    englishName: 'Ates Tafsir (Turkish)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  },

  // French Tafseers
  'fr.hamidullah': {
    identifier: 'fr.hamidullah',
    language: 'fr',
    name: 'Tafsir Hamidullah',
    englishName: 'Hamidullah Tafsir (French)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  },

  // Bengali Tafseers
  'bn.muhiuddin': {
    identifier: 'bn.muhiuddin',
    language: 'bn',
    name: 'তাফসীর মুহিউদ্দীন খান',
    englishName: 'Muhiuddin Khan Tafsir (Bengali)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  },

  // Russian Tafseers
  'ru.kuliev': {
    identifier: 'ru.kuliev.tafsir',
    language: 'ru',
    name: 'Тафсир Кулиев',
    englishName: 'Kuliev Tafsir (Russian)',
    format: 'text',
    type: 'tafsir',
    direction: 'ltr'
  }
}

// Tafseer groups by language
export const TAFSEER_GROUPS = {
  arabic: ['ar.muyassar', 'ar.jalalayn', 'ar.qurtubi', 'ar.tabari', 'ar.baghawi', 'ar.kathir', 'ar.waseet'],
  english: ['en.kathir', 'en.maarifulquran', 'en.tafheem'],
  urdu: ['ur.jalandhri', 'ur.kanzulimaan', 'ur.ahsanulbayan'],
  persian: ['fa.makarem'],
  indonesian: ['id.quraish'],
  turkish: ['tr.ates'],
  french: ['fr.hamidullah'],
  bengali: ['bn.muhiuddin'],
  russian: ['ru.kuliev']
}

// Default tafseers for each language
export const DEFAULT_TAFSEERS = {
  en: 'en.kathir',
  ur: 'ur.jalandhri',
  ar: 'ar.muyassar',
  fr: 'fr.hamidullah',
  id: 'id.quraish',
  tr: 'tr.ates',
  bn: 'bn.muhiuddin',
  fa: 'fa.makarem',
  ru: 'ru.kuliev'
}

// Default translations for each language
export const DEFAULT_TRANSLATIONS = {
  en: 'en.sahih',
  ur: 'ur.jalandhry',
  ar: 'ar.quran',
  fr: 'fr.hamidullah',
  es: 'es.cortes',
  de: 'de.bubenheim',
  id: 'id.indonesian',
  tr: 'tr.ates',
  bn: 'bn.bengali',
  fa: 'fa.ansarian',
  ru: 'ru.kuliev',
  ms: 'ms.basmeih',
  nl: 'nl.keyzer',
  it: 'it.piccardo'
}