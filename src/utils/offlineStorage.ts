/**
 * Offline Storage Utilities for Quran App
 * Provides IndexedDB storage for offline capabilities
 */

interface StoredSurah {
  id: number
  data: any
  timestamp: number
  translations: string[]
}

interface StoredAudio {
  id: string
  url: string
  data: ArrayBuffer
  timestamp: number
}

interface StoredTranslation {
  id: string
  edition: string
  surahNumber: number
  data: any
  timestamp: number
}

class OfflineStorage {
  private dbName = 'quran-app-db'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  constructor() {
    this.initDB()
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('IndexedDB opened successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Surahs store
        if (!db.objectStoreNames.contains('surahs')) {
          const surahStore = db.createObjectStore('surahs', { keyPath: 'id' })
          surahStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Audio store
        if (!db.objectStoreNames.contains('audio')) {
          const audioStore = db.createObjectStore('audio', { keyPath: 'id' })
          audioStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Translations store
        if (!db.objectStoreNames.contains('translations')) {
          const translationStore = db.createObjectStore('translations', { keyPath: 'id' })
          translationStore.createIndex('surahNumber', 'surahNumber', { unique: false })
          translationStore.createIndex('edition', 'edition', { unique: false })
        }

        // User data store (bookmarks, reading progress, etc.)
        if (!db.objectStoreNames.contains('userData')) {
          const userStore = db.createObjectStore('userData', { keyPath: 'key' })
          userStore.createIndex('type', 'type', { unique: false })
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB()
    }
    return this.db!
  }

  // Surah storage methods
  async storeSurah(surahNumber: number, data: any, translations: string[] = []): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['surahs'], 'readwrite')
    const store = transaction.objectStore('surahs')

    const storedSurah: StoredSurah = {
      id: surahNumber,
      data,
      timestamp: Date.now(),
      translations
    }

    return new Promise((resolve, reject) => {
      const request = store.put(storedSurah)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSurah(surahNumber: number): Promise<StoredSurah | null> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['surahs'], 'readonly')
    const store = transaction.objectStore('surahs')

    return new Promise((resolve, reject) => {
      const request = store.get(surahNumber)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllStoredSurahs(): Promise<StoredSurah[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['surahs'], 'readonly')
    const store = transaction.objectStore('surahs')

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Audio storage methods
  async storeAudio(audioId: string, url: string, audioData: ArrayBuffer): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['audio'], 'readwrite')
    const store = transaction.objectStore('audio')

    const storedAudio: StoredAudio = {
      id: audioId,
      url,
      data: audioData,
      timestamp: Date.now()
    }

    return new Promise((resolve, reject) => {
      const request = store.put(storedAudio)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getAudio(audioId: string): Promise<StoredAudio | null> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['audio'], 'readonly')
    const store = transaction.objectStore('audio')

    return new Promise((resolve, reject) => {
      const request = store.get(audioId)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  // Translation storage methods
  async storeTranslation(edition: string, surahNumber: number, data: any): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['translations'], 'readwrite')
    const store = transaction.objectStore('translations')

    const translationId = `${edition}-${surahNumber}`
    const storedTranslation: StoredTranslation = {
      id: translationId,
      edition,
      surahNumber,
      data,
      timestamp: Date.now()
    }

    return new Promise((resolve, reject) => {
      const request = store.put(storedTranslation)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getTranslation(edition: string, surahNumber: number): Promise<StoredTranslation | null> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['translations'], 'readonly')
    const store = transaction.objectStore('translations')

    const translationId = `${edition}-${surahNumber}`

    return new Promise((resolve, reject) => {
      const request = store.get(translationId)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  // User data methods (bookmarks, reading progress, etc.)
  async storeUserData(key: string, data: any, type: string = 'general'): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['userData'], 'readwrite')
    const store = transaction.objectStore('userData')

    const userData = {
      key,
      data,
      type,
      timestamp: Date.now()
    }

    return new Promise((resolve, reject) => {
      const request = store.put(userData)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getUserData(key: string): Promise<any> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['userData'], 'readonly')
    const store = transaction.objectStore('userData')

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result?.data || null)
      request.onerror = () => reject(request.error)
    })
  }

  // Settings methods
  async storeSetting(key: string, value: any): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['settings'], 'readwrite')
    const store = transaction.objectStore('settings')

    const setting = { key, value, timestamp: Date.now() }

    return new Promise((resolve, reject) => {
      const request = store.put(setting)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSetting(key: string): Promise<any> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['settings'], 'readonly')
    const store = transaction.objectStore('settings')

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result?.value || null)
      request.onerror = () => reject(request.error)
    })
  }

  // Cleanup methods
  async clearOldData(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    const db = await this.ensureDB()
    const cutoffTime = Date.now() - maxAge

    const stores = ['surahs', 'audio', 'translations']
    
    for (const storeName of stores) {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore('surahs')
      const index = store.index('timestamp')
      
      const range = IDBKeyRange.upperBound(cutoffTime)
      const request = index.openCursor(range)
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }
    }
  }

  async getStorageSize(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      }
    }
    return { used: 0, quota: 0 }
  }

  async clearAllData(): Promise<void> {
    const db = await this.ensureDB()
    const storeNames = ['surahs', 'audio', 'translations', 'userData', 'settings']
    
    for (const storeName of storeNames) {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  }

  // Offline sync methods
  async markForSync(type: string, data: any): Promise<void> {
    const syncKey = `sync_${type}_${Date.now()}`
    await this.storeUserData(syncKey, data, 'sync')
  }

  async getPendingSyncData(): Promise<any[]> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['userData'], 'readonly')
    const store = transaction.objectStore('userData')
    const index = store.index('type')

    return new Promise((resolve, reject) => {
      const request = index.getAll('sync')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async removeSyncData(key: string): Promise<void> {
    const db = await this.ensureDB()
    const transaction = db.transaction(['userData'], 'readwrite')
    const store = transaction.objectStore('userData')

    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage()
export default offlineStorage

// Helper functions for common operations
export const cacheQuranData = async (surahNumber: number, data: any, translations: string[] = []): Promise<void> => {
  try {
    await offlineStorage.storeSurah(surahNumber, data, translations)
    console.log(`Cached Surah ${surahNumber} with ${translations.length} translations`)
  } catch (error) {
    console.error('Failed to cache Surah data:', error)
  }
}

export const getCachedQuranData = async (surahNumber: number): Promise<any> => {
  try {
    const cached = await offlineStorage.getSurah(surahNumber)
    if (cached) {
      // Check if data is not too old (e.g., 7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - cached.timestamp < maxAge) {
        return cached.data
      }
    }
    return null
  } catch (error) {
    console.error('Failed to get cached Surah data:', error)
    return null
  }
}

export const cacheAudioFile = async (audioUrl: string, audioId: string): Promise<void> => {
  try {
    const response = await fetch(audioUrl)
    const audioData = await response.arrayBuffer()
    await offlineStorage.storeAudio(audioId, audioUrl, audioData)
    console.log(`Cached audio file: ${audioId}`)
  } catch (error) {
    console.error('Failed to cache audio file:', error)
  }
}

export const getCachedAudio = async (audioId: string): Promise<string | null> => {
  try {
    const cached = await offlineStorage.getAudio(audioId)
    if (cached) {
      const blob = new Blob([cached.data], { type: 'audio/mpeg' })
      return URL.createObjectURL(blob)
    }
    return null
  } catch (error) {
    console.error('Failed to get cached audio:', error)
    return null
  }
}