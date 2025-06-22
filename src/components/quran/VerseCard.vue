<template>
  <div 
    class="verse-card bg-gradient-to-r from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 p-4 transition-all duration-200 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700"
    :class="{ 
      'ring-2 ring-emerald-400 shadow-lg': isHighlighted,
      'ring-2 ring-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20': isPlaying
    }"
  >
    <!-- Compact Verse Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <!-- Elegant Islamic Verse Number -->
        <div class="verse-number-container">
          <div class="verse-number-ornament">
            <!-- Main ornamental frame -->
            <div class="ornament-frame">
              <!-- Inner decorative ring -->
              <div class="inner-ring"></div>
              <!-- Verse number -->
              <span class="verse-number-text">{{ verse.verseNumber }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Actions -->
      <div class="flex items-center space-x-2">
        <button
          @click="toggleBookmark"
          :class="[
            'p-2 sm:p-1.5 rounded-xl border-2 transition-all duration-200 shadow-sm',
            isBookmarked 
              ? 'text-gold-600 hover:text-gold-700 bg-gold-50 dark:bg-gold-900/20 border-gold-300 dark:border-gold-700' 
              : 'text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700'
          ]"
          :title="isBookmarked ? 'Remove bookmark' : 'Add bookmark'"
        >
          <svg class="h-5 w-5 sm:h-4 sm:w-4" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <button
          @click="copyVerse"
          class="p-2 sm:p-1.5 rounded-xl border-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 transition-all duration-200 shadow-sm"
          title="Copy verse"
        >
          <svg class="h-5 w-5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          @click="toggleAudio"
          :class="[
            'p-2 sm:p-1.5 rounded-xl border-2 transition-all duration-200 shadow-sm',
            isPlayingAudio 
              ? 'text-white bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500' 
              : 'text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700'
          ]"
          :title="isPlayingAudio ? 'Pause audio' : 'Play audio'"
        >
          <svg v-if="!isPlayingAudio" class="h-5 w-5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="h-5 w-5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Arabic Text -->
    <div class="mb-4">
      <div 
        class="arabic-text text-right leading-relaxed text-xl sm:text-2xl text-gray-900 dark:text-white"
        :class="{ 
          'text-lg sm:text-xl': fontSizeSmall, 
          'text-2xl sm:text-3xl': fontSizeLarge,
          'font-amiri': arabicFont === 'amiri',
          'font-scheherazade': arabicFont === 'scheherazade',
          'font-uthmani': arabicFont === 'uthmani',
          'font-noto': arabicFont === 'noto',
          'font-lateef': arabicFont === 'lateef',
          'font-kitab': arabicFont === 'kitab'
        }"
      >
        <template v-if="showWordByWord && verse.words && verse.words.length > 0">
          <div class="word-by-word-container flex flex-wrap gap-1 justify-end" dir="rtl">
            <WordDisplay
              v-for="(word, index) in verse.words"
              :key="`${verse.verseNumber}-${index}`"
              :word="word"
              :show-transliteration="showTransliteration"
              :show-translation="showTranslation"
              @word-click="onWordClick"
            />
          </div>
        </template>
        <template v-else>
          {{ verse.arabicText }}
        </template>
      </div>
    </div>

    <!-- Translations -->
    <div v-if="showTranslation && selectedTranslations.length > 0" class="space-y-3">
      <div
        v-for="translationId in selectedTranslations"
        :key="translationId"
        class="translation-block"
      >
        <div class="flex items-center space-x-2 mb-1">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span class="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {{ getTranslationName(translationId) }}
          </span>
        </div>
        <div 
          class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
          :class="getTranslationDirection(translationId) === 'rtl' ? 'text-right' : 'text-left'"
        >
          {{ verse.translations[translationId] || verse.fullTranslation }}
        </div>
      </div>
    </div>

    <!-- Compact Verse Metadata -->
    <div v-if="showMetadata && (verse.page || verse.juz || verse.sajda)" class="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/30">
      <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <div v-if="verse.page" class="flex items-center space-x-1">
          <span class="text-emerald-600 dark:text-emerald-400">Page</span>
          <span class="font-medium">{{ verse.page }}</span>
        </div>
        <div v-if="verse.juz" class="flex items-center space-x-1">
          <span class="text-emerald-600 dark:text-emerald-400">Juz</span>
          <span class="font-medium">{{ verse.juz }}</span>
        </div>
        <div v-if="verse.sajda" class="flex items-center space-x-1 text-gold-600 dark:text-gold-400">
          <div class="w-2 h-2 rounded-full bg-gold-500"></div>
          <span class="font-medium">Sajda</span>
        </div>
      </div>
    </div>

    <!-- Loading/Error States -->
    <div v-if="audioLoading" class="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      <span>Loading audio...</span>
    </div>

    <div v-if="audioError" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center space-x-2 text-sm text-red-700 dark:text-red-400">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ audioError }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Howl } from 'howler'
import type { Verse } from '@/stores/quran'
import { useQuranAPI } from '@/composables/useQuranAPI'
import { useSettingsStore } from '@/stores/settings'
import { getGlobalAyahNumber } from '@/utils/quranUtils'
import WordDisplay from './WordDisplay.vue'

interface Props {
  verse: Verse
  selectedTranslations?: string[]
  showWordByWord?: boolean
  showTransliteration?: boolean
  showTranslation?: boolean
  showMetadata?: boolean
  isHighlighted?: boolean
  isBookmarked?: boolean
  fontSizeSmall?: boolean
  fontSizeLarge?: boolean
  surahName?: string
  isPlaying?: boolean
  arabicFont?: string
  verseReciter?: string
}

interface Emits {
  bookmark: [verse: Verse]
  unbookmark: [verse: Verse]
  wordClick: [word: any, verse: Verse]
  copy: [text: string, verse: Verse]
  audioPlay: [verse: Verse]
  audioPause: [verse: Verse]
}

const props = withDefaults(defineProps<Props>(), {
  selectedTranslations: () => ['en.sahih'],
  showWordByWord: false,
  showTransliteration: false,
  showTranslation: false,
  showMetadata: false,
  isHighlighted: false,
  isBookmarked: false,
  fontSizeSmall: false,
  fontSizeLarge: false,
  surahName: '',
  verseReciter: 'ar.alafasy',
  isPlaying: false,
  arabicFont: 'amiri'
})

const emit = defineEmits<Emits>()

// Composables
const quranAPI = useQuranAPI()
const settingsStore = useSettingsStore()

// State
const isPlayingInternal = ref(false)
const audioLoading = ref(false)
const audioError = ref<string | null>(null)
let currentAudio: Howl | null = null

// Computed
const isPlayingAudio = computed(() => props.isPlaying || isPlayingInternal.value)

// Generate audio URL based on selected verse reciter
const verseAudioUrl = computed(() => {
  const globalAyahNumber = getGlobalAyahNumber(props.verse.surahNumber, props.verse.verseNumber)
  return `https://cdn.islamic.network/quran/audio/64/${props.verseReciter}/${globalAyahNumber}.mp3`
})

// Helper functions
const getSurahName = () => {
  return props.surahName || `Surah ${props.verse.surahNumber}`
}

const getTranslationName = (translationId: string) => {
  const info = quranAPI.getTranslationInfo(translationId)
  return info?.englishName || translationId
}

const getTranslationDirection = (translationId: string) => {
  const info = quranAPI.getTranslationInfo(translationId)
  return info?.direction || 'ltr'
}

// Methods
const toggleBookmark = () => {
  if (props.isBookmarked) {
    emit('unbookmark', props.verse)
  } else {
    emit('bookmark', props.verse)
  }
}

const copyVerse = async () => {
  try {
    const arabicText = props.verse.arabicText
    const translations = props.selectedTranslations
      .map(id => `${getTranslationName(id)}: ${props.verse.translations[id] || props.verse.fullTranslation}`)
      .join('\n\n')
    
    const fullText = `${arabicText}\n\n${translations}\n\n— ${getSurahName()}, Verse ${props.verse.verseNumber}`
    
    await navigator.clipboard.writeText(fullText)
    emit('copy', fullText, props.verse)
    
    // Show temporary success feedback
    console.log('Verse copied to clipboard')
  } catch (error) {
    console.error('Failed to copy verse:', error)
  }
}

const toggleAudio = async () => {
  if (isPlayingAudio.value) {
    pauseAudio()
  } else {
    await playAudio()
  }
}

const playAudio = async () => {
  try {
    audioLoading.value = true
    audioError.value = null

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.stop()
      currentAudio.unload()
    }

    currentAudio = new Howl({
      src: [verseAudioUrl.value],
      format: ['mp3'],
      html5: true, // Use HTML5 audio for better CORS handling
      preload: false, // Don't preload to avoid CORS issues
      onload: () => {
        audioLoading.value = false
        audioError.value = null
      },
      onplay: () => {
        isPlayingInternal.value = true
        audioError.value = null
        emit('audioPlay', props.verse)
      },
      onpause: () => {
        isPlayingInternal.value = false
        emit('audioPause', props.verse)
      },
      onend: () => {
        isPlayingInternal.value = false
        emit('audioPause', props.verse)
      },
      onloaderror: () => {
        audioLoading.value = false
        audioError.value = 'Audio not available'
        isPlayingInternal.value = false
        console.warn('Audio failed to load for verse:', props.verse.verseNumber)
      },
      onplayerror: () => {
        audioLoading.value = false
        audioError.value = 'Failed to play audio'
        isPlayingInternal.value = false
        console.warn('Audio failed to play for verse:', props.verse.verseNumber)
      }
    } as any)

    currentAudio.play()
  } catch (error) {
    audioLoading.value = false
    audioError.value = 'Audio playback failed'
    console.error('Audio playback error:', error)
  }
}

const pauseAudio = () => {
  if (currentAudio && isPlayingAudio.value) {
    currentAudio.pause()
  }
}

const onWordClick = (word: any) => {
  emit('wordClick', word, props.verse)
}

// Cleanup
onUnmounted(() => {
  if (currentAudio) {
    currentAudio.stop()
    currentAudio.unload()
  }
})
</script>

<style scoped>
.verse-card {
  scroll-margin-top: 100px; /* For smooth scrolling to highlighted verses */
}

/* Elegant Islamic Verse Number Styling */
.verse-number-container {
  @apply relative;
}

.verse-number-ornament {
  @apply relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center;
}

.ornament-frame {
  @apply relative w-full h-full flex items-center justify-center;
  background: linear-gradient(135deg, #10b981, #0d9488, #059669);
  border-radius: 50%;
  box-shadow: 
    0 4px 12px rgba(16, 185, 129, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.ornament-frame::before {
  content: '';
  @apply absolute inset-0;
  background: conic-gradient(from 0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
  border-radius: 50%;
}

.ornament-frame::after {
  content: '';
  @apply absolute inset-1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.inner-ring {
  @apply absolute inset-2;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent);
}

.verse-number-text {
  @apply relative z-20 text-white font-bold text-sm sm:text-base;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  letter-spacing: 0.025em;
}

/* Islamic Pattern Background */
.ornament-frame {
  position: relative;
}

.ornament-frame::before {
  content: '';
  @apply absolute inset-0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  border-radius: 50%;
}

/* Hover Effects */
.verse-number-container:hover .ornament-frame {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 
    0 6px 16px rgba(16, 185, 129, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.verse-number-container:hover .verse-number-text {
  transform: scale(1.05);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Active state */
.verse-number-container:active .ornament-frame {
  transform: scale(0.95);
  transition: all 0.1s ease-in-out;
}

.arabic-text {
  line-height: 2;
  word-spacing: 0.4rem;
}

.word-by-word-container {
  line-height: 1.2;
  gap: 0.5rem;
  align-items: flex-start;
}

/* Font-specific styles */
.font-amiri {
  font-family: 'Amiri', 'Times New Roman', serif;
}

.font-scheherazade {
  font-family: 'Scheherazade New', 'Times New Roman', serif;
}

.font-uthmani {
  font-family: 'KFGQPC Uthmani Script HAFS', 'Amiri', serif;
  font-size: 110%; /* Uthmani font needs to be slightly larger */
}

.font-noto {
  font-family: 'Noto Naskh Arabic', 'Times New Roman', serif;
}

.font-lateef {
  font-family: 'Lateef', 'Times New Roman', serif;
}

.font-kitab {
  font-family: 'Kitab', 'Times New Roman', serif;
}

.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', 'Times New Roman', serif;
}

.translation-block {
  @apply pl-3 border-l-2 border-emerald-200 dark:border-emerald-800;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.verse-card {
  animation: fadeIn 0.3s ease-out;
}

/* Responsive text sizing */
@media (max-width: 640px) {
  .arabic-text {
    line-height: 2.2;
    word-spacing: 0.3rem;
  }
}

/* Dark mode adjustments */
.dark .verse-number-badge {
  @apply from-primary-600 to-primary-700;
}

.dark .translation-block {
  @apply border-l-gray-600;
}

/* Selection styling */
.verse-card::selection {
  @apply bg-primary-100 dark:bg-primary-900;
}

.arabic-text::selection {
  @apply bg-primary-200 dark:bg-primary-800;
}
</style>