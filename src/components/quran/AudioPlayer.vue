<template>
  <!-- Bottom-centered Audio Player for both Mobile and Desktop -->
  <div 
    data-audio-player
    class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300"
    :class="[
      isExpanded ? 'w-96 max-w-[90vw]' : 'w-auto',
      mobileMode ? 'bottom-2' : 'bottom-4'
    ]"
  >
    <div class="relative bg-gradient-to-br from-calligraphy-100 via-islamic-cream to-calligraphy-50 dark:from-islamic-charcoal dark:via-islamic-midnight dark:to-calligraphy-900 rounded-2xl shadow-luxury border-2 border-gold-300/40 dark:border-gold-600/40 backdrop-blur-sm overflow-hidden group">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-geometric-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
      
      <!-- Islamic Border Decoration -->
      <div class="absolute inset-0 rounded-2xl border border-gold-400/20 animate-pulse-gold"></div>
      
      <!-- Corner Ornaments -->
      <div class="absolute top-1 left-1 w-3 h-3 border-t border-l border-gold-400/50 rounded-tl-2xl"></div>
      <div class="absolute top-1 right-1 w-3 h-3 border-t border-r border-gold-400/50 rounded-tr-2xl"></div>
      <div class="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-gold-400/50 rounded-bl-2xl"></div>
      <div class="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-gold-400/50 rounded-br-2xl"></div>
      
      <!-- Content Wrapper -->
      <div class="relative z-10">
      
      <!-- Collapsed State - Compact Player -->
      <div v-if="!isExpanded" class="p-3">
        <div class="flex items-center space-x-3">
          <!-- Track Info - Clickable to expand -->
          <div 
            class="flex-1 min-w-0 cursor-pointer hover:bg-calligraphy-100 dark:hover:bg-calligraphy-900/20 rounded-lg p-1 transition-colors"
            @click.stop="toggleExpanded"
          >
            <p class="text-xs font-medium text-islamic-charcoal dark:text-islamic-cream truncate">
              {{ currentTrack?.title || 'Quran Audio Player' }}
            </p>
            <p class="text-xs text-calligraphy-700 dark:text-calligraphy-300">
              {{ currentReciterData?.englishName || 'Select Reciter' }}
            </p>
          </div>

          <!-- Basic Controls -->
          <div class="flex items-center space-x-2">
            <!-- Previous -->
            <button
              @click.stop="previousTrack"
              :disabled="!canGoPrevious"
              class="p-1.5 rounded-lg bg-calligraphy-100 dark:bg-calligraphy-900/30 text-calligraphy-600 dark:text-calligraphy-400 hover:bg-calligraphy-200 dark:hover:bg-calligraphy-900/50 transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            <!-- Play/Pause -->
            <button
              @click.stop="togglePlayPause"
              :disabled="!currentTrack"
              class="p-2 rounded-full bg-gradient-to-br from-calligraphy-600 to-cream-600 text-white hover:from-calligraphy-700 hover:to-cream-700 transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <svg v-if="isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>

            <!-- Next -->
            <button
              @click.stop="nextTrack"
              :disabled="!canGoNext"
              class="p-1.5 rounded-lg bg-calligraphy-100 dark:bg-calligraphy-900/30 text-calligraphy-600 dark:text-calligraphy-400 hover:bg-calligraphy-200 dark:hover:bg-calligraphy-900/50 transition-colors disabled:opacity-50"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>

            <!-- Expand Button -->
            <button
              @click.stop="toggleExpanded"
              class="p-1.5 rounded-lg bg-calligraphy-100 dark:bg-calligraphy-900/30 text-calligraphy-600 dark:text-calligraphy-400 hover:bg-calligraphy-200 dark:hover:bg-calligraphy-900/50 transition-colors"
              title="Expand player"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress Bar (collapsed) - Click to expand -->
        <div v-if="currentTrack" class="mt-2">
          <div 
            class="w-full bg-calligraphy-200 dark:bg-calligraphy-800 rounded-full h-1 cursor-pointer hover:h-2 transition-all duration-200"
            @click.stop="toggleExpanded"
          >
            <div 
              class="bg-gradient-to-r from-calligraphy-600 to-cream-600 h-full rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Expanded State - Full Player -->
      <div v-else class="p-4">
        <!-- Player Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-calligraphy-100 dark:bg-calligraphy-900/30 rounded-full flex items-center justify-center border border-calligraphy-200 dark:border-calligraphy-700">
              <svg class="w-5 h-5 text-calligraphy-600 dark:text-calligraphy-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-calligraphy-900 dark:text-calligraphy-100 text-sm">
                {{ currentTrack?.title || 'Quran Audio' }}
              </h3>
              <p class="text-xs text-calligraphy-700 dark:text-calligraphy-300">
                {{ currentReciterData?.englishName || 'Select Reciter' }}
              </p>
            </div>
          </div>
          
          <!-- Collapse Button -->
          <button
            @click.stop="toggleExpanded"
            class="p-2 rounded-lg bg-calligraphy-100 dark:bg-calligraphy-900/30 text-calligraphy-600 dark:text-calligraphy-400 hover:bg-calligraphy-200 dark:hover:bg-calligraphy-900/50 transition-colors"
            title="Collapse player"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7-7m0 0l-7 7m7-7v18"/>
            </svg>
          </button>
        </div>

        <!-- Reciter Selector -->
        <div class="mb-4">
          <div class="relative">
            <Button
              variant="outline"
              size="sm"
              @click.stop="showReciterSelect = !showReciterSelect"
              class="w-full justify-between text-xs"
            >
              <span>{{ currentReciterData?.englishName || 'Select Reciter' }}</span>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showReciterSelect }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </Button>

            <!-- Reciter Dropdown -->
            <div
              v-if="showReciterSelect"
              class="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-calligraphy-50 to-cream-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-xl border-2 border-calligraphy-200 dark:border-calligraphy-700 z-10"
            >
              <div class="py-1 max-h-48 overflow-y-auto">
                <button
                  v-for="reciter in availableReciters"
                  :key="reciter.identifier"
                  @click.stop="selectReciter(reciter)"
                  class="block w-full text-left px-3 py-2 text-xs text-calligraphy-800 dark:text-calligraphy-200 hover:bg-calligraphy-100 dark:hover:bg-calligraphy-900/20 transition-colors rounded-lg mx-1"
                  :class="{ 'bg-calligraphy-100 dark:bg-calligraphy-900/30 border border-calligraphy-300 dark:border-calligraphy-600': currentReciterData?.identifier === reciter.identifier }"
                >
                  <div class="font-medium">{{ reciter.englishName }}</div>
                  <div class="text-xs text-calligraphy-600 dark:text-calligraphy-400 truncate font-arabic">{{ reciter.name }}</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex items-center justify-between text-xs text-calligraphy-700 dark:text-calligraphy-300 mb-2">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
          <div 
            ref="progressBar"
            class="w-full bg-calligraphy-200 dark:bg-calligraphy-800 rounded-full h-2 cursor-pointer"
            @click.stop="seek"
          >
            <div 
              class="bg-gradient-to-r from-calligraphy-600 to-cream-600 h-2 rounded-full transition-all duration-300 shadow-sm"
              :style="{ width: `${progress}%` }"
            ></div>
            <!-- Loading indicator -->
            <div 
              v-if="loading"
              class="absolute inset-0 bg-calligraphy-300 dark:bg-calligraphy-800 rounded-full animate-pulse"
            ></div>
          </div>
        </div>

    <!-- Controls -->
    <div class="flex items-center justify-center space-x-4">
      <!-- Previous -->
      <Button
        variant="ghost"
        size="sm"
        @click.stop="previousTrack"
        :disabled="!canGoPrevious"
        title="Previous verse"
      >
        <template #icon-left>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </template>
      </Button>

      <!-- Backward 10s -->
      <Button
        variant="ghost"
        size="sm"
        @click.stop="backward"
        title="Backward 10 seconds"
      >
        <template #icon-left>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
          </svg>
        </template>
      </Button>

      <!-- Play/Pause -->
      <Button
        variant="primary"
        size="lg"
        @click.stop="togglePlayPause"
        :disabled="!currentTrack"
        class="rounded-full w-12 h-12 p-0 bg-gradient-to-br from-calligraphy-600 to-cream-600 hover:from-calligraphy-700 hover:to-cream-700 border-2 border-calligraphy-300 shadow-lg"
      >
        <template #icon-left>
          <svg v-if="isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </template>
      </Button>

      <!-- Forward 10s -->
      <Button
        variant="ghost"
        size="sm"
        @click.stop="forward"
        title="Forward 10 seconds"
      >
        <template #icon-left>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
          </svg>
        </template>
      </Button>

      <!-- Next -->
      <Button
        variant="ghost"
        size="sm"
        @click.stop="nextTrack"
        :disabled="!canGoNext"
        title="Next verse"
      >
        <template #icon-left>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </template>
      </Button>
    </div>

    <!-- Additional Controls -->
    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <!-- Repeat Mode -->
      <div class="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          @click.stop="toggleRepeat"
          :class="{ 'text-primary-600 dark:text-primary-400': repeatMode !== 'none' }"
          :title="getRepeatTitle()"
        >
          <template #icon-left>
            <svg v-if="repeatMode === 'one'" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7,7H17V10L21,6L17,2V5H5V11H7V7M17,17H7V14L3,18L7,22V19H19V13H17V17M13,15V9H12L10,10.5V12H11.5V15H13Z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z"/>
            </svg>
          </template>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          @click.stop="toggleShuffle"
          :class="{ 'text-primary-600 dark:text-primary-400': shuffleMode }"
          title="Shuffle"
        >
          <template #icon-left>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z"/>
            </svg>
          </template>
        </Button>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          @click.stop="toggleMute"
        >
          <template #icon-left>
            <svg v-if="isMuted || volume === 0" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
            <svg v-else-if="volume < 0.5" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </template>
        </Button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="isMuted ? 0 : volume"
          @input.stop="setVolume"
          class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        >
      </div>

      <!-- Playback Speed -->
      <div class="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          @click.stop="toggleSpeedMenu"
        >
          {{ playbackRate }}x
        </Button>
        
        <div
          v-if="showSpeedMenu"
          class="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1"
        >
          <button
            v-for="speed in playbackSpeeds"
            :key="speed"
            @click.stop="setPlaybackRate(speed)"
            class="block w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': playbackRate === speed }"
          >
            {{ speed }}x
          </button>
        </div>
      </div>
    </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>
      </div>
      </div> <!-- End content wrapper -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Howl } from 'howler'
import { useQuranAPI } from '@/composables/useQuranAPI'
import type { Edition } from '@/types/api'
import Button from '@/components/ui/Button.vue'
import { getGlobalAyahNumber } from '@/utils/quranUtils'

interface AudioTrack {
  id: string
  title: string
  url: string
  surahNumber: number
  verseNumber: number
}

interface Props {
  tracks?: AudioTrack[]
  currentReciter?: string
  availableReciters?: Edition[]
  mobileMode?: boolean
}

interface Emits {
  'track-changed': [track: AudioTrack]
  'reciter-change': [reciter: string]
}

const props = withDefaults(defineProps<Props>(), {
  mobileMode: false
})
const emit = defineEmits<Emits>()

const quranAPI = useQuranAPI()

// State
const howl = ref<Howl | null>(null)
const isPlaying = ref(false)
const loading = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)
const playbackRate = ref(1)
const repeatMode = ref<'none' | 'one' | 'all'>('none')
const shuffleMode = ref(false)
const error = ref<string | null>(null)
const currentTrack = ref<AudioTrack | null>(null)

// UI state
const isExpanded = ref(false)
const showReciterSelect = ref(false)
const showSpeedMenu = ref(false)
const progressBar = ref<HTMLElement>()

// Constants
const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

// Computed
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const currentReciterData = computed(() => {
  const reciterId = props.currentReciter || 'ar.alafasy'
  return props.availableReciters?.find(r => r.identifier === reciterId)
})

const canGoPrevious = computed(() => {
  if (!props.tracks) return false
  const currentIndex = props.tracks.findIndex(track => track.id === currentTrack.value?.id)
  return currentIndex > 0
})

const canGoNext = computed(() => {
  if (!props.tracks) return false
  const currentIndex = props.tracks.findIndex(track => track.id === currentTrack.value?.id)
  return currentIndex < props.tracks.length - 1
})

// Expand/collapse functions
function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

// Audio controls
function loadTrack(track: AudioTrack) {
  if (howl.value) {
    howl.value.unload()
  }

  loading.value = true
  error.value = null

  howl.value = new Howl({
    src: [track.url],
    html5: true,
    preload: true,
    volume: isMuted.value ? 0 : volume.value,
    rate: playbackRate.value,
    onload: () => {
      loading.value = false
      duration.value = howl.value?.duration() || 0
    },
    onplay: () => {
      isPlaying.value = true
      updateProgress()
    },
    onpause: () => {
      isPlaying.value = false
    },
    onstop: () => {
      isPlaying.value = false
      currentTime.value = 0
    },
    onend: () => {
      isPlaying.value = false
      handleTrackEnd()
    },
    onloaderror: (id, err) => {
      loading.value = false
      error.value = `Failed to load audio: ${track.title}`
      console.error('Audio load error for:', track.url, 'Error code:', err)
    },
    onplayerror: (id, err) => {
      error.value = `Playback error: ${track.title}`
      console.error('Audio play error for:', track.url, 'Error code:', err)
    }
  })
}

function togglePlayPause() {
  if (!currentTrack.value && props.tracks && props.tracks.length > 0) {
    // If no track is loaded, load the first one
    currentTrack.value = props.tracks[0]
    loadTrack(currentTrack.value)
    emit('track-changed', currentTrack.value)
    // Play after loading
    setTimeout(() => {
      if (howl.value) {
        howl.value.play()
      }
    }, 100)
    return
  }
  
  if (!howl.value) return

  if (isPlaying.value) {
    howl.value.pause()
  } else {
    howl.value.play()
  }
}

function seek(event: MouseEvent) {
  if (!howl.value || !progressBar.value) return

  const rect = progressBar.value.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const seekTime = percent * duration.value
  
  howl.value.seek(seekTime)
  currentTime.value = seekTime
}

function forward() {
  if (!howl.value) return
  const newTime = Math.min(currentTime.value + 10, duration.value)
  howl.value.seek(newTime)
  currentTime.value = newTime
}

function backward() {
  if (!howl.value) return
  const newTime = Math.max(currentTime.value - 10, 0)
  howl.value.seek(newTime)
  currentTime.value = newTime
}

function setVolume(event: Event) {
  const target = event.target as HTMLInputElement
  const newVolume = parseFloat(target.value)
  volume.value = newVolume
  
  if (howl.value) {
    howl.value.volume(isMuted.value ? 0 : newVolume)
  }
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (howl.value) {
    howl.value.volume(isMuted.value ? 0 : volume.value)
  }
}

function setPlaybackRate(rate: number) {
  playbackRate.value = rate
  if (howl.value) {
    howl.value.rate(rate)
  }
  showSpeedMenu.value = false
}

function toggleSpeedMenu() {
  showSpeedMenu.value = !showSpeedMenu.value
}

function toggleRepeat() {
  const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all']
  const currentIndex = modes.indexOf(repeatMode.value)
  repeatMode.value = modes[(currentIndex + 1) % modes.length]
}

function toggleShuffle() {
  shuffleMode.value = !shuffleMode.value
}

function previousTrack() {
  if (!props.tracks || !canGoPrevious.value) return

  const currentIndex = props.tracks.findIndex(track => track.id === currentTrack.value?.id)
  const previousTrack = props.tracks[currentIndex - 1]
  
  if (previousTrack) {
    currentTrack.value = previousTrack
    loadTrack(previousTrack)
    emit('track-changed', previousTrack)
  }
}

function nextTrack() {
  if (!props.tracks || !canGoNext.value) return

  let nextIndex: number
  const currentIndex = props.tracks.findIndex(track => track.id === currentTrack.value?.id)

  if (shuffleMode.value) {
    do {
      nextIndex = Math.floor(Math.random() * props.tracks.length)
    } while (nextIndex === currentIndex && props.tracks.length > 1)
  } else {
    nextIndex = currentIndex + 1
  }

  const nextTrackItem = props.tracks[nextIndex]
  if (nextTrackItem) {
    currentTrack.value = nextTrackItem
    loadTrack(nextTrackItem)
    emit('track-changed', nextTrackItem)
  }
}

function handleTrackEnd() {
  if (repeatMode.value === 'one') {
    howl.value?.play()
  } else if (canGoNext.value) {
    // Auto-play next verse for continuous surah playback
    nextTrack()
    // Auto-play the next track
    setTimeout(() => {
      if (howl.value) {
        howl.value.play()
      }
    }, 100)
  } else if (repeatMode.value === 'all') {
    // If at the end of surah and repeat all is on, go back to first track
    if (props.tracks && props.tracks.length > 0) {
      currentTrack.value = props.tracks[0]
      loadTrack(currentTrack.value)
      emit('track-changed', currentTrack.value)
      // Auto-play
      setTimeout(() => {
        if (howl.value) {
          howl.value.play()
        }
      }, 100)
    }
  }
}

function selectReciter(reciter: Edition) {
  emit('reciter-change', reciter.identifier)
  showReciterSelect.value = false
  
  // The parent component will update the tracks with the new reciter
  // We don't need to update URLs here as they come from the parent
}

function getRepeatTitle(): string {
  switch (repeatMode.value) {
    case 'one': return 'Repeat current verse'
    case 'all': return 'Repeat all'
    default: return 'No repeat'
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function updateProgress() {
  if (howl.value && isPlaying.value) {
    currentTime.value = howl.value.seek() as number
    requestAnimationFrame(updateProgress)
  }
}

// Removed - now using the utility function from utils/quranUtils.ts

// Watch for tracks changes and set first track
watch(() => props.tracks, (newTracks) => {
  if (newTracks && newTracks.length > 0) {
    // If no current track or tracks have changed, set first track
    if (!currentTrack.value || newTracks[0].id !== currentTrack.value.id) {
      currentTrack.value = newTracks[0]
      loadTrack(newTracks[0])
    }
  }
}, { immediate: true })

// Event handlers and cleanup
let handleClickOutside: ((event: Event) => void) | null = null

onMounted(() => {
  handleClickOutside = (event: Event) => {
    const target = event.target as Element
    
    // Close dropdowns when clicking outside relative containers
    if (!target.closest('.relative')) {
      showReciterSelect.value = false
      showSpeedMenu.value = false
    }
    
    // Minimize audio player when clicking outside and it's expanded
    if (isExpanded.value) {
      const audioPlayerElement = document.querySelector('[data-audio-player]')
      if (audioPlayerElement && !audioPlayerElement.contains(target)) {
        isExpanded.value = false
      }
    }
  }
  
  document.addEventListener('click', handleClickOutside)
})

// Cleanup
onUnmounted(() => {
  if (howl.value) {
    howl.value.unload()
  }
  
  if (handleClickOutside) {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.font-arabic {
  font-family: 'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', 'Arabic Typesetting', serif;
  font-weight: 500;
}
</style>