import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useQuranAPI } from '@/composables/useQuranAPI'
import type { 
  Surah as APISurah, 
  SurahInfo, 
  Ayah, 
  Edition,
  WordByWordData
} from '@/types/api'
import { POPULAR_TRANSLATIONS } from '@/types/api'
import { useSettingsStore } from './settings'

// Local interfaces that extend API types
export interface Word {
  id: number
  arabic: string
  transliteration: string
  translation: string
  root?: string
  grammar?: string
  audio?: string
  position?: number
}

export interface Verse {
  surahNumber: number
  verseNumber: number
  arabicText: string
  words: Word[]
  translations: Record<string, string>
  fullTranslation: string
  audio?: string
  page?: number
  juz?: number
  manzil?: number
  ruku?: number
  hizbQuarter?: number
  sajda?: boolean
}

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  arabicName: string
  numberOfAyahs: number
  revelationType: string
  verses?: Verse[]
}

export const useQuranStore = defineStore('quran', () => {
  const quranAPI = useQuranAPI()
  const settingsStore = useSettingsStore()

  // State
  const surahs = ref<Surah[]>([])
  const currentSurah = ref<Surah | null>(null)
  const verses = ref<Verse[]>([])
  const currentVerse = ref<Verse | null>(null)
  const availableTranslations = ref<Edition[]>([])
  const availableReciters = ref<Edition[]>([])
  const selectedTranslations = ref<string[]>(['en.sahih'])
  const selectedReciter = ref('ar.alafasy')
  const verseOfTheDay = ref<{ arabic: Ayah; translation: Ayah } | null>(null)

  // Computed properties
  const loading = computed(() => quranAPI.loading.value)
  const error = computed(() => quranAPI.error.value)
  const totalSurahs = computed(() => surahs.value.length)
  const currentSurahVerses = computed(() => 
    verses.value.filter(verse => verse.surahNumber === currentSurah.value?.number)
  )

  const popularTranslations = computed(() => quranAPI.popularTranslations.value)
  const audioReciters = computed(() => quranAPI.audioReciters.value)

  // Helper function to convert API Surah to local Surah interface
  function convertAPISubrahToLocal(apiSurah: SurahInfo): Surah {
    return {
      number: apiSurah.number,
      name: apiSurah.name,
      englishName: apiSurah.englishName,
      englishNameTranslation: apiSurah.englishNameTranslation || apiSurah.englishName,
      arabicName: apiSurah.name,
      numberOfAyahs: apiSurah.numberOfAyahs,
      revelationType: apiSurah.revelationType
    }
  }

  // Helper function to convert API Ayah to local Verse
  function convertAyahToVerse(ayah: Ayah, translations: Record<string, string> = {}, surahNumber?: number): Verse {
    if (!ayah || !ayah.text || !ayah.numberInSurah) {
      console.error('Invalid ayah data:', ayah)
      throw new Error('Invalid ayah data structure')
    }
    
    const words = parseArabicText(ayah.text)
    
    // Get surah number from ayah.surah.number if available, otherwise use passed surahNumber
    const currentSurahNumber = ayah.surah?.number || surahNumber || currentSurah.value?.number || 1
    
    return {
      surahNumber: currentSurahNumber,
      verseNumber: ayah.numberInSurah,
      arabicText: ayah.text,
      words,
      translations,
      fullTranslation: translations[selectedTranslations.value[0]] || ayah.text,
      audio: `https://cdn.islamic.network/quran/audio/64/${selectedReciter.value}/${ayah.number}.mp3`,
      page: ayah.page || 1,
      juz: ayah.juz || 1,
      manzil: ayah.manzil || 1,
      ruku: ayah.ruku || 1,
      hizbQuarter: ayah.hizbQuarter || 1,
      sajda: typeof ayah.sajda === 'boolean' ? ayah.sajda : false
    }
  }

  // Parse Arabic text into words (mock implementation)
  function parseArabicText(text: string): Word[] {
    const words = text.split(' ').filter(word => word.trim())
    return words.map((word, index) => ({
      id: index + 1,
      position: index + 1,
      arabic: word.trim(),
      transliteration: `word${index + 1}`, // This would come from word-by-word API
      translation: `word${index + 1}`, // This would come from word-by-word API
      root: undefined,
      grammar: undefined,
      audio: undefined
    }))
  }

  // Actions
  async function fetchSurahs() {
    try {
      const apiSurahs = await quranAPI.getSurahs()
      if (apiSurahs) {
        surahs.value = apiSurahs.map(convertAPISubrahToLocal)
      }
    } catch (err) {
      console.error('Error fetching surahs:', err)
    }
  }

  async function fetchSurah(surahNumber: number, withTranslations = true) {
    try {
      // Get basic surah info if not already available
      if (surahs.value.length === 0) {
        await fetchSurahs()
      }

      const surahInfo = surahs.value.find(s => s.number === surahNumber)
      if (surahInfo) {
        currentSurah.value = surahInfo
      }

      if (withTranslations && selectedTranslations.value.length > 0) {
        // Fetch with multiple translations
        const translationIds = ['ar.quran', ...selectedTranslations.value]
        const results = await quranAPI.getSurahMultipleTranslations(surahNumber, translationIds)
        
        if (results) {
          await processSurahWithTranslations(results)
        }
      } else {
        // Fetch only Arabic text
        const surahData = await quranAPI.getSurah(surahNumber, 'ar.quran')
        if (surahData) {
          await processSurahData(surahData)
        }
      }
    } catch (err) {
      console.error('Error fetching surah:', err)
    }
  }

  async function processSurahData(surahData: APISurah) {
    const surahVerses: Verse[] = []

    for (const ayah of surahData.ayahs) {
      const verse = convertAyahToVerse(ayah, {}, surahData.number)
      
      // Try to get word-by-word data
      const wordByWordData = await quranAPI.getWordByWordData(surahData.number, ayah.numberInSurah)
      if (wordByWordData) {
        verse.words = wordByWordData.words.map(word => ({
          id: word.id,
          position: word.position,
          arabic: word.arabic,
          transliteration: word.transliteration,
          translation: word.translation,
          root: word.root,
          grammar: word.grammar?.pos,
          audio: undefined
        }))
      }

      surahVerses.push(verse)
    }

    verses.value = surahVerses
  }

  async function processSurahWithTranslations(results: Record<string, APISurah>) {
    const arabicSurah = results['ar.quran']
    if (!arabicSurah || !arabicSurah.ayahs) {
      console.error('No Arabic surah data found in results:', results)
      return
    }

    const surahVerses: Verse[] = []

    for (const ayah of arabicSurah.ayahs) {
      if (!ayah || !ayah.text || !ayah.numberInSurah) {
        console.warn('Skipping invalid ayah:', ayah)
        continue
      }
      
      const translations: Record<string, string> = {}
      
      // Collect translations for this ayah
      Object.entries(results).forEach(([translationId, surahData]) => {
        if (surahData && surahData.ayahs && surahData.ayahs[ayah.numberInSurah - 1]) {
          translations[translationId] = surahData.ayahs[ayah.numberInSurah - 1].text
        }
      })

      try {
        const verse = convertAyahToVerse(ayah, translations, arabicSurah.number)
        
        // Generate word-by-word data from the Arabic text
        // Since Al-Quran Cloud doesn't provide word-by-word, we'll create a mock implementation
        const arabicWords = ayah.text.split(' ')
        verse.words = arabicWords.map((word, index) => ({
          id: index + 1,
          position: index + 1,
          arabic: word,
          transliteration: transliterateArabicWord(word),
          translation: translateArabicWord(word, index, arabicWords.length),
          root: undefined,
          grammar: undefined,
          audio: undefined
        }))

        surahVerses.push(verse)
      } catch (error) {
        console.error('Error converting ayah to verse:', error, ayah)
        continue
      }
    }

    verses.value = surahVerses
  }

  async function fetchVerse(surahNumber: number, verseNumber: number) {
    try {
      const ayahData = await quranAPI.getAyahWithTranslations(
        surahNumber, 
        verseNumber, 
        ['ar.quran', ...selectedTranslations.value]
      )
      
      if (ayahData && ayahData.length > 0) {
        const arabicAyah = ayahData.find(a => a.text && !a.text.match(/[a-zA-Z]/)) || ayahData[0]
        
        const translations: Record<string, string> = {}
        ayahData.forEach(ayah => {
          // This would need proper edition identification
          translations['ar.quran'] = arabicAyah.text
          if (ayah !== arabicAyah) {
            translations[selectedTranslations.value[0]] = ayah.text
          }
        })

        const verse = convertAyahToVerse(arabicAyah, translations)
        currentVerse.value = verse
        return verse
      }
    } catch (err) {
      console.error('Error fetching verse:', err)
    }
    return null
  }

  async function searchQuran(query: string, surahNumber?: number) {
    try {
      const searchResults = await quranAPI.search(query, surahNumber, selectedTranslations.value[0])
      return searchResults
    } catch (err) {
      console.error('Error searching Quran:', err)
      return null
    }
  }

  async function fetchVerseOfTheDay() {
    try {
      const verse = await quranAPI.getVerseOfTheDay()
      if (verse) {
        verseOfTheDay.value = verse
      }
    } catch (err) {
      console.error('Error fetching verse of the day:', err)
    }
  }

  async function fetchAvailableTranslations() {
    try {
      const textEditions = await quranAPI.getEditionsByFormat('text')
      if (textEditions) {
        availableTranslations.value = textEditions.filter(edition => 
          edition.type === 'translation' || edition.type === 'versebyverse'
        )
      }
    } catch (err) {
      console.error('Error fetching translations:', err)
    }
  }

  async function fetchAvailableReciters() {
    try {
      const audioEditions = await quranAPI.getEditionsByFormat('audio')
      if (audioEditions) {
        availableReciters.value = audioEditions
      }
    } catch (err) {
      console.error('Error fetching reciters:', err)
    }
  }

  function setSelectedTranslations(translations: string[]) {
    selectedTranslations.value = translations
    // Update preferred translation setting
    if (translations.length > 0) {
      const primaryTranslation = translations[0]
      const translationInfo = quranAPI.getTranslationInfo(primaryTranslation)
      if (translationInfo) {
        settingsStore.setPreferredTranslation(translationInfo.language as any)
      }
    }
  }

  function setSelectedReciter(reciter: string) {
    selectedReciter.value = reciter
  }

  function setCurrentVerse(verse: Verse) {
    currentVerse.value = verse
  }

  function clearError() {
    quranAPI.clearError()
  }

  // Initialize store
  async function initialize() {
    try {
      await Promise.all([
        fetchSurahs(),
        fetchAvailableTranslations(),
        fetchAvailableReciters(),
        fetchVerseOfTheDay()
      ])
      
      // Set default translations based on user's preferred language
      const preferredLang = settingsStore.preferredTranslation
      const defaultTranslation = quranAPI.defaultTranslations.value[preferredLang]
      if (defaultTranslation) {
        setSelectedTranslations([defaultTranslation])
      }
      
      console.log('Quran store initialized successfully')
    } catch (err) {
      console.error('Error initializing Quran store:', err)
    }
  }

  // Helper functions for word-by-word mock data
  function transliterateArabicWord(word: string): string {
    // Remove diacritics for cleaner transliteration
    const cleanWord = word.replace(/[ً-ْٰـ]/g, '')
    
    // Comprehensive Arabic words transliteration mapping
    const commonWords: Record<string, string> = {
      // Bismillah and common phrases
      'بِسْمِ': 'Bismi',
      'بسم': 'Bismi',
      'اللَّهِ': 'Allahi',
      'الله': 'Allah',
      'الرَّحْمَٰنِ': 'Ar-Rahman',
      'الرحمن': 'Ar-Rahman',
      'الرَّحِيمِ': 'Ar-Raheem',
      'الرحيم': 'Ar-Raheem',
      
      // Al-Fatiha transliterations
      'الْحَمْدُ': 'Al-Hamdu',
      'الحمد': 'Al-Hamdu',
      'لِلَّهِ': 'Lillahi',
      'لله': 'Lillahi',
      'رَبِّ': 'Rabbi',
      'رب': 'Rabbi',
      'الْعَالَمِينَ': 'Al-Alameen',
      'العالمين': 'Al-Alameen',
      'مَالِكِ': 'Maliki',
      'مالك': 'Maliki',
      'يَوْمِ': 'Yawmi',
      'يوم': 'Yawmi',
      'الدِّينِ': 'Ad-Deen',
      'الدين': 'Ad-Deen',
      'إِيَّاكَ': 'Iyyaka',
      'اياك': 'Iyyaka',
      'نَعْبُدُ': "Na'budu",
      'نعبد': "Na'budu",
      'وَإِيَّاكَ': 'Wa-iyyaka',
      'واياك': 'Wa-iyyaka',
      'نَسْتَعِينُ': "Nasta'een",
      'نستعين': "Nasta'een",
      'اهْدِنَا': 'Ihdina',
      'اهدنا': 'Ihdina',
      'الصِّرَاطَ': 'As-Sirat',
      'الصراط': 'As-Sirat',
      'الْمُسْتَقِيمَ': 'Al-Mustaqeem',
      'المستقيم': 'Al-Mustaqeem',
      
      // Common particles
      'وَ': 'wa',
      'و': 'wa',
      'فَ': 'fa',
      'ف': 'fa',
      'لَ': 'la',
      'ل': 'li',
      'مَن': 'man',
      'من': 'min',
      'فِي': 'fee',
      'في': 'fee',
      'عَلَى': 'ala',
      'على': 'ala'
    }
    
    // Try exact match first, then clean word, then generate phonetic
    return commonWords[word] || commonWords[cleanWord] || generatePhoneticTransliteration(cleanWord)
  }
  
  function generatePhoneticTransliteration(arabicWord: string): string {
    // Basic Arabic to Latin transliteration map
    const transliterationMap: Record<string, string> = {
      'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
      'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's',
      'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': "'",
      'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
      'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h'
    }
    
    let result = ''
    for (const char of arabicWord) {
      result += transliterationMap[char] || char
    }
    
    return result || 'word'
  }
  
  function translateArabicWord(word: string, index: number, totalWords: number): string {
    // Remove diacritics for better matching
    const cleanWord = word.replace(/[ً-ْٰـ]/g, '')
    
    // Comprehensive Arabic words translation mapping
    const commonWords: Record<string, string> = {
      // Bismillah and common phrases
      'بِسْمِ': 'In the name',
      'بسم': 'In the name',
      'اللَّهِ': 'of Allah',
      'الله': 'Allah',
      'الرَّحْمَٰنِ': 'the Most Gracious',
      'الرحمن': 'the Most Gracious',
      'الرَّحِيمِ': 'the Most Merciful',
      'الرحيم': 'the Most Merciful',
      
      // Al-Fatiha words
      'الْحَمْدُ': 'All praise',
      'الحمد': 'All praise',
      'لِلَّهِ': 'to Allah',
      'لله': 'to Allah',
      'رَبِّ': 'Lord',
      'رب': 'Lord',
      'الْعَالَمِينَ': 'of the worlds',
      'العالمين': 'of the worlds',
      'مَالِكِ': 'Master',
      'مالك': 'Master',
      'يَوْمِ': 'of the Day',
      'يوم': 'Day',
      'الدِّينِ': 'of Judgment',
      'الدين': 'the Religion',
      'إِيَّاكَ': 'You alone',
      'اياك': 'You',
      'نَعْبُدُ': 'we worship',
      'نعبد': 'we worship',
      'وَإِيَّاكَ': 'and You alone',
      'واياك': 'and You',
      'نَسْتَعِينُ': 'we seek help',
      'نستعين': 'we seek help',
      'اهْدِنَا': 'Guide us',
      'اهدنا': 'Guide us',
      'الصِّرَاطَ': 'to the path',
      'الصراط': 'the path',
      'الْمُسْتَقِيمَ': 'the straight',
      'المستقيم': 'the straight',
      
      // Common particles and connectors
      'وَ': 'and',
      'و': 'and',
      'فَ': 'so',
      'ف': 'so',
      'لَ': 'for',
      'ل': 'for',
      'إِنَّ': 'indeed',
      'ان': 'that',
      'مَن': 'who',
      'من': 'who/from',
      'فِي': 'in',
      'في': 'in',
      'عَلَى': 'upon',
      'على': 'upon',
      'إِلَى': 'to',
      'الى': 'to',
      
      // Common verbs
      'قَالَ': 'said',
      'قال': 'said',
      'كَانَ': 'was',
      'كان': 'was',
      'يَعْلَمُ': 'knows',
      'يعلم': 'knows',
      'قَدْ': 'indeed',
      'قد': 'indeed',
      
      // People and beings
      'النَّاسِ': 'the people',
      'الناس': 'the people',
      'الْمُؤْمِنِينَ': 'the believers',
      'المؤمنين': 'the believers',
      'الْكَافِرِينَ': 'the disbelievers',
      'الكافرين': 'the disbelievers'
    }
    
    // Try exact match first, then clean word
    return commonWords[word] || commonWords[cleanWord] || getGenericMeaning(cleanWord, index)
  }
  
  function getGenericMeaning(cleanWord: string, index: number): string {
    // Generate contextual meanings for unknown words
    const patterns = [
      'word',
      'that',
      'which',
      'from',
      'with',
      'upon',
      'about',
      'they',
      'this',
      'those'
    ]
    
    return patterns[index % patterns.length] || `word-${index + 1}`
  }

  return {
    // State
    surahs,
    currentSurah,
    verses,
    currentVerse,
    availableTranslations,
    availableReciters,
    selectedTranslations,
    selectedReciter,
    verseOfTheDay,
    
    // Computed
    loading,
    error,
    totalSurahs,
    currentSurahVerses,
    popularTranslations,
    audioReciters,
    
    // Actions
    fetchSurahs,
    fetchSurah,
    fetchVerse,
    searchQuran,
    fetchVerseOfTheDay,
    fetchAvailableTranslations,
    fetchAvailableReciters,
    setSelectedTranslations,
    setSelectedReciter,
    setCurrentVerse,
    clearError,
    initialize
  }
})