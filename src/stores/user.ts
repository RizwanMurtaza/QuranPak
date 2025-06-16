import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Bookmark {
  id: string
  surahNumber: number
  verseNumber: number
  surahName: string
  verseText: string
  note?: string
  createdAt: Date
}

export interface ReadingProgress {
  surahNumber: number
  verseNumber: number
  timestamp: Date
}

export interface StudyNote {
  id: string
  surahNumber: number
  verseNumber: number
  wordId?: number
  content: string
  createdAt: Date
  updatedAt: Date
}

export const useUserStore = defineStore('user', () => {
  const bookmarks = ref<Bookmark[]>([])
  const readingHistory = ref<ReadingProgress[]>([])
  const studyNotes = ref<StudyNote[]>([])
  const lastReadPosition = ref<ReadingProgress | null>(null)

  // Computed properties
  const totalBookmarks = computed(() => bookmarks.value.length)
  const recentBookmarks = computed(() => 
    bookmarks.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  )
  
  const recentlyRead = computed(() =>
    readingHistory.value
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  )

  // Bookmark actions
  function addBookmark(surahNumber: number, verseNumber: number, surahName: string, verseText: string, note?: string) {
    const bookmark: Bookmark = {
      id: generateId(),
      surahNumber,
      verseNumber,
      surahName,
      verseText,
      note,
      createdAt: new Date()
    }
    bookmarks.value.push(bookmark)
    saveToLocalStorage()
  }

  function removeBookmark(id: string) {
    const index = bookmarks.value.findIndex(bookmark => bookmark.id === id)
    if (index > -1) {
      bookmarks.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function updateBookmarkNote(id: string, note: string) {
    const bookmark = bookmarks.value.find(bookmark => bookmark.id === id)
    if (bookmark) {
      bookmark.note = note
      saveToLocalStorage()
    }
  }

  function isBookmarked(surahNumber: number, verseNumber: number): boolean {
    return bookmarks.value.some(
      bookmark => bookmark.surahNumber === surahNumber && bookmark.verseNumber === verseNumber
    )
  }

  function getBookmark(surahNumber: number, verseNumber: number): Bookmark | undefined {
    return bookmarks.value.find(
      bookmark => bookmark.surahNumber === surahNumber && bookmark.verseNumber === verseNumber
    )
  }

  // Reading progress actions
  function updateReadingProgress(surahNumber: number, verseNumber: number) {
    const progress: ReadingProgress = {
      surahNumber,
      verseNumber,
      timestamp: new Date()
    }
    
    // Update last read position
    lastReadPosition.value = progress
    
    // Add to history (avoid duplicates)
    const existingIndex = readingHistory.value.findIndex(
      item => item.surahNumber === surahNumber && item.verseNumber === verseNumber
    )
    
    if (existingIndex > -1) {
      readingHistory.value[existingIndex] = progress
    } else {
      readingHistory.value.push(progress)
    }
    
    // Keep only last 100 entries
    if (readingHistory.value.length > 100) {
      readingHistory.value = readingHistory.value
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 100)
    }
    
    saveToLocalStorage()
  }

  // Study notes actions
  function addStudyNote(surahNumber: number, verseNumber: number, content: string, wordId?: number) {
    const note: StudyNote = {
      id: generateId(),
      surahNumber,
      verseNumber,
      wordId,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    studyNotes.value.push(note)
    saveToLocalStorage()
    return note.id
  }

  function updateStudyNote(id: string, content: string) {
    const note = studyNotes.value.find(note => note.id === id)
    if (note) {
      note.content = content
      note.updatedAt = new Date()
      saveToLocalStorage()
    }
  }

  function removeStudyNote(id: string) {
    const index = studyNotes.value.findIndex(note => note.id === id)
    if (index > -1) {
      studyNotes.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  function getStudyNotes(surahNumber: number, verseNumber: number): StudyNote[] {
    return studyNotes.value.filter(
      note => note.surahNumber === surahNumber && note.verseNumber === verseNumber
    )
  }

  function getWordStudyNotes(surahNumber: number, verseNumber: number, wordId: number): StudyNote[] {
    return studyNotes.value.filter(
      note => note.surahNumber === surahNumber && 
              note.verseNumber === verseNumber && 
              note.wordId === wordId
    )
  }

  // Utility functions
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  function saveToLocalStorage() {
    const userData = {
      bookmarks: bookmarks.value,
      readingHistory: readingHistory.value,
      studyNotes: studyNotes.value,
      lastReadPosition: lastReadPosition.value
    }
    localStorage.setItem('quran-app-user-data', JSON.stringify(userData, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    }))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('quran-app-user-data')
    if (saved) {
      try {
        const userData = JSON.parse(saved, (key, value) => {
          if (key.includes('At') || key === 'timestamp') {
            return new Date(value)
          }
          return value
        })
        
        bookmarks.value = userData.bookmarks || []
        readingHistory.value = userData.readingHistory || []
        studyNotes.value = userData.studyNotes || []
        lastReadPosition.value = userData.lastReadPosition || null
      } catch (error) {
        console.error('Error loading user data from localStorage:', error)
      }
    }
  }

  function clearAllData() {
    bookmarks.value = []
    readingHistory.value = []
    studyNotes.value = []
    lastReadPosition.value = null
    localStorage.removeItem('quran-app-user-data')
  }

  // Initialize user data on store creation
  loadFromLocalStorage()

  return {
    bookmarks,
    readingHistory,
    studyNotes,
    lastReadPosition,
    totalBookmarks,
    recentBookmarks,
    recentlyRead,
    addBookmark,
    removeBookmark,
    updateBookmarkNote,
    isBookmarked,
    getBookmark,
    updateReadingProgress,
    addStudyNote,
    updateStudyNote,
    removeStudyNote,
    getStudyNotes,
    getWordStudyNotes,
    clearAllData
  }
})