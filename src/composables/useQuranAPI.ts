import { ref, computed } from 'vue'
import { quranAPI } from '@/services/api'
import type {
  Surah,
  SurahInfo,
  Ayah,
  Edition,
  SearchResult
} from '@/types/api'
import {
  POPULAR_TRANSLATIONS,
  POPULAR_TAFSEERS,
  AUDIO_RECITERS,
  TRANSLATION_GROUPS,
  TAFSEER_GROUPS,
  DEFAULT_TRANSLATIONS,
  DEFAULT_TAFSEERS
} from '@/types/api'

export function useQuranAPI() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Clear error when starting new request
  const clearError = () => {
    error.value = null
  }

  // Generic request wrapper
  const executeRequest = async <T>(
    requestFn: () => Promise<T>,
    errorMessage = 'Request failed'
  ): Promise<T | null> => {
    clearError()
    loading.value = true
    
    try {
      const result = await requestFn()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : errorMessage
      console.error(errorMessage, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Surahs
  const getSurahs = () => 
    executeRequest(() => quranAPI.getSurahs(), 'Failed to fetch Surahs')

  const getSurah = (surahNumber: number, edition = 'ar.quran') =>
    executeRequest(() => quranAPI.getSurah(surahNumber, edition), `Failed to fetch Surah ${surahNumber}`)

  const getSurahWithTranslations = (surahNumber: number, editions: string[] = ['ar.quran', 'en.sahih']) =>
    executeRequest(
      () => quranAPI.getSurahWithTranslations(surahNumber, editions),
      `Failed to fetch Surah ${surahNumber} with translations`
    )

  const getSurahMultipleTranslations = (surahNumber: number, translationIds: string[]) =>
    executeRequest(
      () => quranAPI.getSurahMultipleTranslations(surahNumber, translationIds),
      `Failed to fetch multiple translations for Surah ${surahNumber}`
    )

  // Ayahs
  const getAyah = (surahNumber: number, ayahNumber: number, edition = 'ar.quran') =>
    executeRequest(
      () => quranAPI.getAyah(surahNumber, ayahNumber, edition),
      `Failed to fetch Ayah ${surahNumber}:${ayahNumber}`
    )

  const getAyahWithTranslations = (
    surahNumber: number,
    ayahNumber: number,
    editions: string[] = ['ar.quran', 'en.sahih']
  ) =>
    executeRequest(
      () => quranAPI.getAyahWithTranslations(surahNumber, ayahNumber, editions),
      `Failed to fetch Ayah ${surahNumber}:${ayahNumber} with translations`
    )

  const getAyahRange = (
    startSurah: number,
    startAyah: number,
    endSurah: number,
    endAyah: number,
    edition = 'ar.quran'
  ) =>
    executeRequest(
      () => quranAPI.getAyahRange(startSurah, startAyah, endSurah, endAyah, edition),
      'Failed to fetch Ayah range'
    )

  // Editions
  const getEditions = () =>
    executeRequest(() => quranAPI.getEditions(), 'Failed to fetch editions')

  const getEditionsByFormat = (format: 'text' | 'audio') =>
    executeRequest(() => quranAPI.getEditionsByFormat(format), `Failed to fetch ${format} editions`)

  const getEditionsByLanguage = (language: string) =>
    executeRequest(() => quranAPI.getEditionsByLanguage(language), `Failed to fetch ${language} editions`)

  const getEditionsByType = (type: 'versebyverse' | 'translation' | 'transliteration' | 'tafsir') =>
    executeRequest(() => quranAPI.getEditionsByType(type), `Failed to fetch ${type} editions`)

  // Search
  const search = (query: string, surah?: number, edition = 'en.sahih') =>
    executeRequest(() => quranAPI.search(query, surah, edition), 'Search failed')

  const advancedSearch = (params: {
    query: string
    surah?: number
    translation?: string
    language?: string
    limit?: number
  }) =>
    executeRequest(() => quranAPI.advancedSearch(params), 'Advanced search failed')

  // Audio
  const getSurahAudio = (surahNumber: number, reciter = 'ar.alafasy') =>
    executeRequest(() => quranAPI.getSurahAudio(surahNumber, reciter), `Failed to fetch audio for Surah ${surahNumber}`)

  const getAyahAudio = (surahNumber: number, ayahNumber: number, reciter = 'ar.alafasy') =>
    executeRequest(
      () => quranAPI.getAyahAudio(surahNumber, ayahNumber, reciter),
      `Failed to fetch audio for Ayah ${surahNumber}:${ayahNumber}`
    )

  // Juz, Page, Hizbquarter
  const getJuz = (juzNumber: number, edition = 'ar.quran') =>
    executeRequest(() => quranAPI.getJuz(juzNumber, edition), `Failed to fetch Juz ${juzNumber}`)

  const getPage = (pageNumber: number, edition = 'ar.quran') =>
    executeRequest(() => quranAPI.getPage(pageNumber, edition), `Failed to fetch Page ${pageNumber}`)

  const getHizbquarter = (hizbNumber: number, edition = 'ar.quran') =>
    executeRequest(() => quranAPI.getHizbquarter(hizbNumber, edition), `Failed to fetch Hizbquarter ${hizbNumber}`)

  // Special features
  const getSajdaAyahs = (edition = 'ar.quran') =>
    executeRequest(() => quranAPI.getSajdaAyahs(edition), 'Failed to fetch Sajda Ayahs')

  const getRandomAyah = (edition = 'ar.quran') =>
    executeRequest(() => quranAPI.getRandomAyah(edition), 'Failed to fetch random Ayah')

  const getVerseOfTheDay = () =>
    executeRequest(() => quranAPI.getVerseOfTheDay(), 'Failed to fetch verse of the day')

  const getWordByWordData = (surahNumber: number, ayahNumber: number) =>
    executeRequest(
      () => quranAPI.getWordByWordData(surahNumber, ayahNumber),
      `Failed to fetch word-by-word data for ${surahNumber}:${ayahNumber}`
    )

  // Utility methods
  const getPopularTranslations = (language: string) => {
    return quranAPI.getPopularTranslations(language)
  }

  const getAudioReciters = () => {
    return quranAPI.getAudioReciters()
  }

  const getTranslationInfo = (identifier: string) => {
    return quranAPI.getTranslationInfo(identifier)
  }

  const getTafseerInfo = (identifier: string) => {
    return POPULAR_TAFSEERS[identifier] || Object.values(POPULAR_TAFSEERS).find(t => t.identifier === identifier)
  }

  const getReciterInfo = (identifier: string) => {
    return quranAPI.getReciterInfo(identifier)
  }

  // Preload data
  const preloadData = () =>
    executeRequest(() => quranAPI.preloadData(), 'Failed to preload data')

  // Cache management
  const clearCache = () => {
    quranAPI.clearCache()
  }

  const getCacheSize = () => {
    return quranAPI.getCacheSize()
  }

  // Computed properties for popular data
  const popularTranslations = computed(() => POPULAR_TRANSLATIONS)
  const popularTafseers = computed(() => POPULAR_TAFSEERS)
  const audioReciters = computed(() => AUDIO_RECITERS)
  const translationGroups = computed(() => TRANSLATION_GROUPS)
  const tafseerGroups = computed(() => TAFSEER_GROUPS)
  const defaultTranslations = computed(() => DEFAULT_TRANSLATIONS)
  const defaultTafseers = computed(() => DEFAULT_TAFSEERS)

  // Helper to get language name
  const getLanguageName = (code: string): string => {
    const languageNames: Record<string, string> = {
      en: 'English',
      ur: 'Urdu',
      ar: 'Arabic',
      fr: 'French',
      es: 'Spanish',
      de: 'German',
      id: 'Indonesian',
      tr: 'Turkish',
      bn: 'Bengali',
      fa: 'Persian',
      ru: 'Russian',
      ms: 'Malay',
      nl: 'Dutch',
      it: 'Italian'
    }
    return languageNames[code] || code.toUpperCase()
  }

  // Helper to format Ayah reference
  const formatAyahReference = (surahNumber: number, ayahNumber: number): string => {
    return `${surahNumber}:${ayahNumber}`
  }

  // Helper to get translation direction
  const getTranslationDirection = (identifier: string): 'ltr' | 'rtl' => {
    const translation = getTranslationInfo(identifier)
    return translation?.direction || 'ltr'
  }

  // Helper to get tafseer direction
  const getTafseerDirection = (identifier: string): 'ltr' | 'rtl' => {
    const tafseer = getTafseerInfo(identifier)
    return tafseer?.direction || 'ltr'
  }

  return {
    // State
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Methods
    clearError,
    
    // Surahs
    getSurahs,
    getSurah,
    getSurahWithTranslations,
    getSurahMultipleTranslations,
    
    // Ayahs
    getAyah,
    getAyahWithTranslations,
    getAyahRange,
    
    // Editions
    getEditions,
    getEditionsByFormat,
    getEditionsByLanguage,
    getEditionsByType,
    
    // Search
    search,
    advancedSearch,
    
    // Audio
    getSurahAudio,
    getAyahAudio,
    
    // Navigation
    getJuz,
    getPage,
    getHizbquarter,
    
    // Special
    getSajdaAyahs,
    getRandomAyah,
    getVerseOfTheDay,
    getWordByWordData,
    
    // Utilities
    getPopularTranslations,
    getAudioReciters,
    getTranslationInfo,
    getTafseerInfo,
    getReciterInfo,
    preloadData,
    clearCache,
    getCacheSize,
    
    // Computed
    popularTranslations,
    popularTafseers,
    audioReciters,
    translationGroups,
    tafseerGroups,
    defaultTranslations,
    defaultTafseers,
    
    // Helpers
    getLanguageName,
    formatAyahReference,
    getTranslationDirection,
    getTafseerDirection
  }
}