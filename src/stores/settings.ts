import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'auto'
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large'
export type Translation = 'en' | 'ur' | 'fr' | 'es' | 'de' | 'id' | 'tr' | 'bn' | 'fa' | 'ru' | 'ms' | 'nl' | 'it'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<Theme>('light')
  const fontSize = ref<FontSize>('medium')
  const arabicFontSize = ref<FontSize>('medium')
  const preferredTranslation = ref<Translation>('en')
  const autoPlayAudio = ref(false)
  const showTransliteration = ref(true)
  const showTranslation = ref(true)
  const showWordByWord = ref(true)
  const arabicFont = ref('amiri')

  // Computed properties
  const isDarkMode = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })

  const fontSizeClass = computed(() => {
    const sizeMap = {
      'small': 'text-sm',
      'medium': 'text-base',
      'large': 'text-lg',
      'extra-large': 'text-xl'
    }
    return sizeMap[fontSize.value]
  })

  const arabicFontSizeClass = computed(() => {
    const sizeMap = {
      'small': 'text-arabic-sm',
      'medium': 'text-arabic-base',
      'large': 'text-arabic-lg',
      'extra-large': 'text-arabic-xl'
    }
    return sizeMap[arabicFontSize.value]
  })

  // Actions
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    updateDocumentTheme()
    saveToLocalStorage()
  }

  function setFontSize(newSize: FontSize) {
    fontSize.value = newSize
    saveToLocalStorage()
  }

  function setArabicFontSize(newSize: FontSize) {
    arabicFontSize.value = newSize
    saveToLocalStorage()
  }

  function setPreferredTranslation(translation: Translation) {
    preferredTranslation.value = translation
    saveToLocalStorage()
  }

  function toggleAutoPlayAudio() {
    autoPlayAudio.value = !autoPlayAudio.value
    saveToLocalStorage()
  }

  function toggleTransliteration() {
    showTransliteration.value = !showTransliteration.value
    saveToLocalStorage()
  }

  function toggleTranslation() {
    showTranslation.value = !showTranslation.value
    saveToLocalStorage()
  }

  function toggleWordByWord() {
    showWordByWord.value = !showWordByWord.value
    saveToLocalStorage()
  }
  
  function setArabicFont(font: string) {
    arabicFont.value = font
    saveToLocalStorage()
  }

  function updateDocumentTheme() {
    const html = document.documentElement
    if (isDarkMode.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  function saveToLocalStorage() {
    const settings = {
      theme: theme.value,
      fontSize: fontSize.value,
      arabicFontSize: arabicFontSize.value,
      preferredTranslation: preferredTranslation.value,
      autoPlayAudio: autoPlayAudio.value,
      showTransliteration: showTransliteration.value,
      showTranslation: showTranslation.value,
      showWordByWord: showWordByWord.value,
      arabicFont: arabicFont.value
    }
    localStorage.setItem('quran-app-settings', JSON.stringify(settings))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('quran-app-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        theme.value = settings.theme || 'light'
        fontSize.value = settings.fontSize || 'medium'
        arabicFontSize.value = settings.arabicFontSize || 'medium'
        preferredTranslation.value = settings.preferredTranslation || 'en'
        autoPlayAudio.value = settings.autoPlayAudio || false
        showTransliteration.value = settings.showTransliteration !== false
        showTranslation.value = settings.showTranslation !== false
        showWordByWord.value = settings.showWordByWord !== false
        arabicFont.value = settings.arabicFont || 'amiri'
        updateDocumentTheme()
      } catch (error) {
        console.error('Error loading settings from localStorage:', error)
      }
    }
  }

  function resetToDefaults() {
    theme.value = 'light'
    fontSize.value = 'medium'
    arabicFontSize.value = 'medium'
    preferredTranslation.value = 'en'
    autoPlayAudio.value = false
    showTransliteration.value = true
    showTranslation.value = true
    showWordByWord.value = true
    arabicFont.value = 'amiri'
    updateDocumentTheme()
    saveToLocalStorage()
  }

  // Initialize settings on store creation
  loadFromLocalStorage()

  // Listen for system theme changes when in auto mode
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'auto') {
        updateDocumentTheme()
      }
    })
  }

  return {
    theme,
    fontSize,
    arabicFontSize,
    preferredTranslation,
    autoPlayAudio,
    showTransliteration,
    showTranslation,
    showWordByWord,
    arabicFont,
    isDarkMode,
    fontSizeClass,
    arabicFontSizeClass,
    setTheme,
    setFontSize,
    setArabicFontSize,
    setArabicFont,
    setPreferredTranslation,
    toggleAutoPlayAudio,
    toggleTransliteration,
    toggleTranslation,
    toggleWordByWord,
    resetToDefaults
  }
})