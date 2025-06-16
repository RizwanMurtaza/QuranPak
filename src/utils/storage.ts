/**
 * Enhanced storage utilities for Quran app
 * Handles localStorage, sessionStorage, and IndexedDB for offline functionality
 */

// Storage keys
export const STORAGE_KEYS = {
  SURAHS: 'quran_surahs',
  VERSES: 'quran_verses',
  TRANSLATIONS: 'quran_translations',
  AUDIO_CACHE: 'quran_audio_cache',
  USER_PREFERENCES: 'quran_user_preferences',
  READING_PROGRESS: 'quran_reading_progress',
  SEARCH_CACHE: 'quran_search_cache',
  OFFLINE_DATA: 'quran_offline_data'
} as const

// Storage utilities
export class StorageManager {
  /**
   * Save data to localStorage with compression and expiry
   */
  static setItem(key: string, data: any, expiryHours = 24): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + (expiryHours * 60 * 60 * 1000)
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  /**
   * Get data from localStorage with expiry check
   */
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const parsed = JSON.parse(item)
      
      // Check if expired
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }

  /**
   * Clear all Quran-related data
   */
  static clearQuranData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key)
    })
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    let used = 0
    
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }
    } catch (error) {
      console.error('Error calculating storage usage:', error)
    }

    // Estimate available space (5MB typical limit)
    const available = 5 * 1024 * 1024 // 5MB in bytes
    const percentage = (used / available) * 100

    return { used, available, percentage }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, 'test')
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }
}

// IndexedDB utilities for large data storage
export class IndexedDBManager {
  private static dbName = 'QuranAppDB'
  private static version = 1
  private static db: IDBDatabase | null = null

  /**
   * Initialize IndexedDB
   */
  static async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not supported'))
        return
      }

      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains('surahs')) {
          db.createObjectStore('surahs', { keyPath: 'number' })
        }

        if (!db.objectStoreNames.contains('verses')) {
          const verseStore = db.createObjectStore('verses', { keyPath: 'id' })
          verseStore.createIndex('surahNumber', 'surahNumber', { unique: false })
        }

        if (!db.objectStoreNames.contains('audio')) {
          db.createObjectStore('audio', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('translations')) {
          const translationStore = db.createObjectStore('translations', { keyPath: 'id' })
          translationStore.createIndex('edition', 'edition', { unique: false })
        }
      }
    })
  }

  /**
   * Save Surah data to IndexedDB
   */
  static async saveSurah(surahData: any): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['surahs'], 'readwrite')
      const store = transaction.objectStore('surahs')
      const request = store.put(surahData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get Surah data from IndexedDB
   */
  static async getSurah(surahNumber: number): Promise<any> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['surahs'], 'readonly')
      const store = transaction.objectStore('surahs')
      const request = store.get(surahNumber)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Save verse data to IndexedDB
   */
  static async saveVerse(verseData: any): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['verses'], 'readwrite')
      const store = transaction.objectStore('verses')
      const request = store.put({
        ...verseData,
        id: `${verseData.surahNumber}:${verseData.verseNumber}`
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get verses for a Surah from IndexedDB
   */
  static async getVerses(surahNumber: number): Promise<any[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['verses'], 'readonly')
      const store = transaction.objectStore('verses')
      const index = store.index('surahNumber')
      const request = index.getAll(surahNumber)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Save audio data to IndexedDB
   */
  static async saveAudio(audioId: string, audioBlob: Blob): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audio'], 'readwrite')
      const store = transaction.objectStore('audio')
      const request = store.put({ id: audioId, blob: audioBlob, timestamp: Date.now() })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get audio data from IndexedDB
   */
  static async getAudio(audioId: string): Promise<Blob | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audio'], 'readonly')
      const store = transaction.objectStore('audio')
      const request = store.get(audioId)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.blob : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Clear all data from IndexedDB
   */
  static async clearAll(): Promise<void> {
    if (!this.db) await this.init()
    
    const stores = ['surahs', 'verses', 'audio', 'translations']
    
    return Promise.all(stores.map(storeName => 
      new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    )).then(() => {})
  }

  /**
   * Get database usage statistics
   */
  static async getUsageStats(): Promise<{ stores: Record<string, number>; total: number }> {
    if (!this.db) await this.init()
    
    const stores = ['surahs', 'verses', 'audio', 'translations']
    const stats: Record<string, number> = {}
    let total = 0

    for (const storeName of stores) {
      const count = await new Promise<number>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.count()

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      stats[storeName] = count
      total += count
    }

    return { stores: stats, total }
  }
}

// Offline data management
export class OfflineManager {
  /**
   * Check if the app is online
   */
  static isOnline(): boolean {
    return navigator.onLine
  }

  /**
   * Save data for offline use
   */
  static async saveForOffline(type: 'surah' | 'verse' | 'audio', data: any): Promise<void> {
    try {
      if (type === 'audio' && data.blob) {
        await IndexedDBManager.saveAudio(data.id, data.blob)
      } else {
        await IndexedDBManager.saveSurah(data)
      }
    } catch (error) {
      console.error('Error saving for offline:', error)
    }
  }

  /**
   * Get offline data
   */
  static async getOfflineData(type: 'surah' | 'verse' | 'audio', id: string | number): Promise<any> {
    try {
      if (type === 'surah') {
        return await IndexedDBManager.getSurah(id as number)
      } else if (type === 'audio') {
        return await IndexedDBManager.getAudio(id as string)
      }
      return null
    } catch (error) {
      console.error('Error getting offline data:', error)
      return null
    }
  }

  /**
   * Check if data is available offline
   */
  static async isAvailableOffline(type: 'surah' | 'verse' | 'audio', id: string | number): Promise<boolean> {
    try {
      const data = await this.getOfflineData(type, id)
      return data !== null
    } catch {
      return false
    }
  }

  /**
   * Sync data when online
   */
  static async syncWhenOnline(callback: () => Promise<void>): Promise<void> {
    if (this.isOnline()) {
      await callback()
    } else {
      // Wait for online event
      window.addEventListener('online', async () => {
        await callback()
      }, { once: true })
    }
  }

  /**
   * Get offline storage summary
   */
  static async getOfflineSummary(): Promise<{
    localStorage: { used: number; available: number; percentage: number }
    indexedDB: { stores: Record<string, number>; total: number }
    isOnline: boolean
  }> {
    const [localStorageInfo, indexedDBInfo] = await Promise.all([
      Promise.resolve(StorageManager.getStorageInfo()),
      IndexedDBManager.getUsageStats().catch(() => ({ stores: {}, total: 0 }))
    ])

    return {
      localStorage: localStorageInfo,
      indexedDB: indexedDBInfo,
      isOnline: this.isOnline()
    }
  }
}

// Initialize IndexedDB on module load
IndexedDBManager.init().catch(console.error)