import type {
  ApiResponse,
  Surah,
  SurahInfo,
  Ayah,
  Edition,
  QuranText,
  SearchResult,
  AudioData,
  WordByWordData
} from '@/types/api'
import {
  POPULAR_TRANSLATIONS,
  AUDIO_RECITERS
} from '@/types/api'
import { offlineStorage, getCachedQuranData, cacheQuranData } from '@/utils/offlineStorage'

class QuranAPIService {
  private baseURL = 'https://api.alquran.cloud/v1'
  private cache = new Map<string, any>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  /**
   * Generic API request method with caching and offline support
   */
  private async request<T>(endpoint: string, useCache = true, offlineKey?: string): Promise<T> {
    const cacheKey = endpoint
    
    // Check memory cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data
      }
    }

    // Check offline storage for important data
    if (offlineKey && !navigator.onLine) {
      try {
        const offlineData = await offlineStorage.getUserData(offlineKey)
        if (offlineData) {
          console.log(`Using offline data for ${endpoint}`)
          return offlineData
        }
      } catch (error) {
        console.warn('Failed to retrieve offline data:', error)
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`)
      
      if (!response.ok) {
        // If offline and we have cached data, use it
        if (!navigator.onLine && offlineKey) {
          const offlineData = await offlineStorage.getUserData(offlineKey)
          if (offlineData) {
            console.log(`Falling back to offline data for ${endpoint}`)
            return offlineData
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const apiResponse: ApiResponse<T> = await response.json()
      
      if (apiResponse.code !== 200) {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      // Cache the result in memory
      if (useCache) {
        this.cache.set(cacheKey, {
          data: apiResponse.data,
          timestamp: Date.now()
        })
      }

      // Store important data offline
      if (offlineKey) {
        try {
          await offlineStorage.storeUserData(offlineKey, apiResponse.data, 'api_cache')
        } catch (error) {
          console.warn('Failed to store offline data:', error)
        }
      }

      return apiResponse.data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      
      // Try offline storage as last resort
      if (offlineKey) {
        try {
          const offlineData = await offlineStorage.getUserData(offlineKey)
          if (offlineData) {
            console.log(`Using offline fallback data for ${endpoint}`)
            return offlineData
          }
        } catch (offlineError) {
          console.warn('Failed to retrieve offline fallback data:', offlineError)
        }
      }
      
      throw error
    }
  }

  /**
   * Get all Surahs (chapters) information
   */
  async getSurahs(): Promise<SurahInfo[]> {
    return this.request<SurahInfo[]>('/surah', true, 'surahs_list')
  }

  /**
   * Get specific Surah by number
   */
  async getSurah(surahNumber: number, edition = 'ar.quran'): Promise<Surah> {
    return this.request<Surah>(`/surah/${surahNumber}/${edition}`, true, `surah_${surahNumber}_${edition}`)
  }

  /**
   * Get specific Surah with multiple translations
   */
  async getSurahWithTranslations(
    surahNumber: number,
    editions: string[] = ['ar.quran', 'en.sahih']
  ): Promise<QuranText[]> {
    const editionsParam = editions.join(',')
    return this.request<QuranText[]>(`/surah/${surahNumber}/editions/${editionsParam}`)
  }

  /**
   * Get specific Ayah (verse) by Surah and Ayah number
   */
  async getAyah(surahNumber: number, ayahNumber: number, edition = 'ar.quran'): Promise<Ayah> {
    return this.request<Ayah>(`/ayah/${surahNumber}:${ayahNumber}/${edition}`)
  }

  /**
   * Get specific Ayah with multiple translations
   */
  async getAyahWithTranslations(
    surahNumber: number,
    ayahNumber: number,
    editions: string[] = ['ar.quran', 'en.sahih']
  ): Promise<Ayah[]> {
    const editionsParam = editions.join(',')
    const response = await this.request<{ ayahs: Ayah[] }>(`/ayah/${surahNumber}:${ayahNumber}/editions/${editionsParam}`)
    return response.ayahs
  }

  /**
   * Get range of Ayahs
   */
  async getAyahRange(
    startSurah: number,
    startAyah: number,
    endSurah: number,
    endAyah: number,
    edition = 'ar.quran'
  ): Promise<Ayah[]> {
    const response = await this.request<{ ayahs: Ayah[] }>(
      `/ayah/${startSurah}:${startAyah}-${endSurah}:${endAyah}/${edition}`
    )
    return response.ayahs
  }

  /**
   * Get all available editions (translations and audio)
   */
  async getEditions(): Promise<Edition[]> {
    return this.request<Edition[]>('/edition')
  }

  /**
   * Get editions by format (text or audio)
   */
  async getEditionsByFormat(format: 'text' | 'audio'): Promise<Edition[]> {
    return this.request<Edition[]>(`/edition/format/${format}`)
  }

  /**
   * Get editions by language
   */
  async getEditionsByLanguage(language: string): Promise<Edition[]> {
    return this.request<Edition[]>(`/edition/language/${language}`)
  }

  /**
   * Get editions by type
   */
  async getEditionsByType(type: 'versebyverse' | 'translation' | 'transliteration' | 'tafsir'): Promise<Edition[]> {
    return this.request<Edition[]>(`/edition/type/${type}`)
  }

  /**
   * Search in Quran
   */
  async search(
    query: string,
    surah?: number,
    edition = 'en.sahih'
  ): Promise<SearchResult> {
    let endpoint = `/search/${encodeURIComponent(query)}/${edition}`
    if (surah) {
      endpoint += `/${surah}`
    }
    return this.request<SearchResult>(endpoint)
  }

  /**
   * Get Juz (Para) information
   */
  async getJuz(juzNumber: number, edition = 'ar.quran'): Promise<{ ayahs: Ayah[] }> {
    return this.request<{ ayahs: Ayah[] }>(`/juz/${juzNumber}/${edition}`)
  }

  /**
   * Get Page information
   */
  async getPage(pageNumber: number, edition = 'ar.quran'): Promise<{ ayahs: Ayah[] }> {
    return this.request<{ ayahs: Ayah[] }>(`/page/${pageNumber}/${edition}`)
  }

  /**
   * Get Hizbquarter information
   */
  async getHizbquarter(hizbNumber: number, edition = 'ar.quran'): Promise<{ ayahs: Ayah[] }> {
    return this.request<{ ayahs: Ayah[] }>(`/hizbQuarter/${hizbNumber}/${edition}`)
  }

  /**
   * Get audio data for a Surah
   */
  async getSurahAudio(surahNumber: number, reciter = 'ar.alafasy'): Promise<AudioData> {
    return this.request<AudioData>(`/surah/${surahNumber}/${reciter}`)
  }

  /**
   * Get audio data for an Ayah
   */
  async getAyahAudio(surahNumber: number, ayahNumber: number, reciter = 'ar.alafasy'): Promise<Ayah> {
    return this.request<Ayah>(`/ayah/${surahNumber}:${ayahNumber}/${reciter}`)
  }

  /**
   * Get Sajda (prostration) ayahs
   */
  async getSajdaAyahs(edition = 'ar.quran'): Promise<{ ayahs: Ayah[] }> {
    return this.request<{ ayahs: Ayah[] }>(`/sajda/${edition}`)
  }

  /**
   * Get random Ayah
   */
  async getRandomAyah(edition = 'ar.quran'): Promise<Ayah> {
    // Al-Quran Cloud API doesn't have a direct random endpoint
    // So we'll generate a random ayah reference and fetch it
    const randomSurah = Math.floor(Math.random() * 114) + 1
    const surahs = await this.getSurahs()
    const selectedSurah = surahs.find(s => s.number === randomSurah)
    
    if (selectedSurah) {
      const randomAyah = Math.floor(Math.random() * selectedSurah.numberOfAyahs) + 1
      return this.getAyah(randomSurah, randomAyah, edition)
    } else {
      // Fallback to first ayah of first surah
      return this.getAyah(1, 1, edition)
    }
  }

  /**
   * Get Word-by-Word data (using external source as Al-Quran Cloud doesn't provide this)
   */
  async getWordByWordData(surahNumber: number, ayahNumber: number): Promise<WordByWordData | null> {
    try {
      // This would integrate with Corpus Quran or similar word-by-word API
      // For now, we'll create a mock structure
      const ayahKey = `${surahNumber}:${ayahNumber}`
      
      // Check if we have cached word-by-word data
      if (this.cache.has(`wbw_${ayahKey}`)) {
        return this.cache.get(`wbw_${ayahKey}`).data
      }

      // In a real implementation, you would fetch from corpus.quran.com API
      // or use a local database with word-by-word data
      
      return null
    } catch (error) {
      console.error('Failed to fetch word-by-word data:', error)
      return null
    }
  }

  /**
   * Utility method to get popular translations for a language
   */
  getPopularTranslations(language: string): Edition[] {
    return Object.values(POPULAR_TRANSLATIONS).filter(
      edition => edition.language === language && edition.format === 'text'
    )
  }

  /**
   * Utility method to get available audio reciters
   */
  getAudioReciters(): Edition[] {
    return Object.values(AUDIO_RECITERS)
  }

  /**
   * Get translation by identifier
   */
  getTranslationInfo(identifier: string): Edition | undefined {
    return POPULAR_TRANSLATIONS[identifier] || Object.values(POPULAR_TRANSLATIONS).find(
      t => t.identifier === identifier
    )
  }

  /**
   * Get reciter by identifier
   */
  getReciterInfo(identifier: string): Edition | undefined {
    return AUDIO_RECITERS[identifier] || Object.values(AUDIO_RECITERS).find(
      r => r.identifier === identifier
    )
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size
  }

  /**
   * Preload commonly used data
   */
  async preloadData(): Promise<void> {
    try {
      // Preload Surahs list
      await this.getSurahs()
      
      // Preload first few Surahs (most commonly read)
      const commonSurahs = [1, 2, 18, 36, 55, 67, 78, 112, 113, 114]
      const preloadPromises = commonSurahs.map(surahNumber => 
        this.getSurah(surahNumber, 'ar.quran').catch(() => {}) // Ignore errors
      )
      
      await Promise.allSettled(preloadPromises)
      
      console.log('Quran data preloaded successfully')
    } catch (error) {
      console.error('Failed to preload data:', error)
    }
  }

  /**
   * Get multiple translations for a Surah in parallel
   */
  async getSurahMultipleTranslations(
    surahNumber: number,
    translationIds: string[]
  ): Promise<Record<string, Surah>> {
    const promises = translationIds.map(async translationId => {
      try {
        const surah = await this.getSurah(surahNumber, translationId)
        return { [translationId]: surah }
      } catch (error) {
        console.error(`Failed to fetch ${translationId} for surah ${surahNumber}:`, error)
        return { [translationId]: null }
      }
    })

    const results = await Promise.allSettled(promises)
    
    return results.reduce((acc, result) => {
      if (result.status === 'fulfilled' && result.value) {
        Object.assign(acc, result.value)
      }
      return acc
    }, {} as Record<string, Surah>)
  }

  /**
   * Advanced search with multiple parameters
   */
  async advancedSearch(params: {
    query: string
    surah?: number
    translation?: string
    language?: string
    limit?: number
  }): Promise<SearchResult> {
    const { query, surah, translation = 'en.sahih' } = params
    
    try {
      return await this.search(query, surah, translation)
    } catch (error) {
      console.error('Advanced search failed:', error)
      return { count: 0, matches: [] }
    }
  }

  /**
   * Get verse of the day (featured verse)
   */
  async getVerseOfTheDay(): Promise<{
    arabic: Ayah
    translation: Ayah
  }> {
    try {
      // Use a rotation of beautiful verses for verse of the day
      const featuredVerses = [
        { surah: 1, ayah: 1 }, // Al-Fatiha opening
        { surah: 2, ayah: 255 }, // Ayat al-Kursi
        { surah: 3, ayah: 26 }, // "Say: O Allah, Owner of sovereignty"
        { surah: 24, ayah: 35 }, // Light verse
        { surah: 55, ayah: 13 }, // "Which of your Lord's favors will you deny?"
        { surah: 94, ayah: 5 }, // "Indeed, with hardship comes ease"
        { surah: 112, ayah: 1 } // Al-Ikhlas
      ]
      
      // Select based on day of year for consistency
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
      const selectedVerse = featuredVerses[dayOfYear % featuredVerses.length]
      
      const [arabic, translation] = await Promise.all([
        this.getAyah(selectedVerse.surah, selectedVerse.ayah, 'ar.quran'),
        this.getAyah(selectedVerse.surah, selectedVerse.ayah, 'en.sahih')
      ])

      return {
        arabic,
        translation
      }
    } catch (error) {
      console.error('Failed to get verse of the day:', error)
      // Fallback to Al-Fatiha first verse
      try {
        const [arabic, translation] = await Promise.all([
          this.getAyah(1, 1, 'ar.quran'),
          this.getAyah(1, 1, 'en.sahih')
        ])
        return { arabic, translation }
      } catch (fallbackError) {
        console.error('Fallback verse also failed:', fallbackError)
        throw error
      }
    }
  }
}

// Export singleton instance
export const quranAPI = new QuranAPIService()
export default quranAPI