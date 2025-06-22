<template>
  <!-- Enhanced Mobile Mode Button -->
  <button
    v-if="mobileMode"
    @click="toggleNavigation"
    class="relative flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-islamic-brown via-gold-600 to-islamic-burgundy hover:from-islamic-burgundy hover:via-gold-700 hover:to-islamic-brown text-islamic-cream rounded-xl shadow-luxury transition-all duration-300 border border-gold-400/30 group overflow-hidden"
  >
    <!-- Background pattern -->
    <div class="absolute inset-0 bg-geometric-pattern opacity-10 group-hover:opacity-20 transition-opacity"></div>
    
    <!-- Islamic menu icon -->
    <div class="relative">
      <svg class="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8M4 18h12"/>
      </svg>
    </div>
    
    <!-- Arabic and English text -->
    <div class="relative text-xs font-medium">
      <span class="font-arabic">سور</span>
      <span class="mx-1">•</span>
      <span class="font-sans">Surahs</span>
    </div>
    
    <!-- Decorative elements -->
    <div class="absolute top-0 right-0 w-2 h-2 bg-gold-400/50 rounded-full group-hover:animate-pulse"></div>
    <div class="absolute bottom-0 left-0 w-1 h-1 bg-gold-300/40 rounded-full group-hover:animate-bounce"></div>
  </button>

  <!-- Desktop Mode - Floating Navigation Toggle Button (Hidden on mobile) -->
  <div v-else class="hidden sm:block fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
    <button
      @click="toggleNavigation"
      class="group bg-gradient-to-r from-islamic-brown to-islamic-burgundy hover:from-islamic-burgundy hover:to-islamic-mahogany text-white p-3 rounded-full shadow-lg transition-all duration-300 border-2 border-gold-300"
    >
      <svg 
        class="w-5 h-5 transition-transform duration-300" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>

  <!-- Collapsible Navigation Panel -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform -translate-x-full"
    enter-to-class="opacity-100 transform translate-x-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 transform translate-x-0"
    leave-to-class="opacity-0 transform -translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed left-0 top-0 bottom-0 w-full sm:w-80 sm:max-w-80 bg-gradient-to-b from-islamic-cream to-calligraphy-100 dark:from-islamic-midnight dark:to-islamic-charcoal border-r-2 border-calligraphy-300 dark:border-calligraphy-700 shadow-2xl z-40 overflow-hidden flex flex-col h-screen"
    >
      <!-- Navigation Header -->
      <div class="flex items-center justify-between h-20 px-6 border-b-2 border-calligraphy-300 dark:border-calligraphy-600 bg-gradient-to-r from-calligraphy-200 to-islamic-cream dark:from-islamic-charcoal dark:to-islamic-midnight">
        <div class="flex items-center space-x-4">
          <!-- Enhanced Islamic Logo -->
          <div class="relative w-14 h-14 bg-gradient-to-br from-islamic-brown via-gold-600 to-islamic-burgundy rounded-2xl flex items-center justify-center shadow-luxury border-2 border-gold-400/40 animate-breathe">
            <!-- Rotating geometric pattern -->
            <div class="absolute inset-0 bg-geometric-pattern opacity-20 rounded-2xl animate-rotate-slow"></div>
            <!-- Inner glow effect -->
            <div class="absolute inset-1 bg-gradient-to-br from-gold-300/20 via-transparent to-islamic-bronze/20 rounded-xl"></div>
            <!-- Bismillah Calligraphy -->
            <div class="relative text-islamic-cream text-sm text-center leading-tight font-arabic drop-shadow-lg">
              ﷽
            </div>
            <!-- Golden decorative border -->
            <div class="absolute inset-0 border-2 border-gold-400/50 rounded-2xl animate-pulse-gold"></div>
            <!-- Corner ornaments -->
            <div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold-300 rounded-tl-2xl"></div>
            <div class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold-300 rounded-tr-2xl"></div>
            <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold-300 rounded-bl-2xl"></div>
            <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold-300 rounded-br-2xl"></div>
          </div>
          
          <!-- Enhanced Branding -->
          <div class="space-y-1">
            <h2 class="text-xl font-bold bg-gradient-to-r from-islamic-charcoal via-calligraphy-800 to-islamic-charcoal dark:from-islamic-cream dark:via-gold-200 dark:to-islamic-cream bg-clip-text text-transparent font-display">
              القرآن الكريم
            </h2>
            <div class="flex items-center space-x-2">
              <div class="w-1 h-1 bg-gold-500 rounded-full animate-pulse"></div>
              <p class="text-xs text-calligraphy-600 dark:text-calligraphy-400 font-serif tracking-wide">Digital Mushaf</p>
              <div class="w-1 h-1 bg-gold-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <button 
          @click="closeNavigation"
          class="p-2 rounded-lg text-islamic-brown dark:text-calligraphy-300 hover:bg-calligraphy-200 dark:hover:bg-calligraphy-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Search Section -->
        <div class="p-4 border-b border-calligraphy-200 dark:border-calligraphy-700">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="surahSearchQuery"
              type="text"
              placeholder="Search Surahs..."
              class="w-full pl-10 pr-4 py-2 text-sm border border-calligraphy-300 dark:border-calligraphy-600 rounded-lg bg-white dark:bg-calligraphy-700 text-islamic-charcoal dark:text-islamic-cream placeholder-calligraphy-500 dark:placeholder-calligraphy-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            >
          </div>
        </div>

        <!-- Continue Reading Section -->
        <div v-if="lastReadPosition" class="p-4 border-b border-calligraphy-200 dark:border-calligraphy-700">
          <h3 class="text-sm font-semibold text-islamic-brown dark:text-calligraphy-200 mb-3 flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Continue Reading</span>
          </h3>
          <router-link
            :to="`/surah/${lastReadPosition.surahNumber}#verse-${lastReadPosition.verseNumber}`"
            @click="closeNavigation"
            class="block p-3 bg-calligraphy-100 dark:bg-calligraphy-900/20 rounded-lg hover:bg-calligraphy-200 dark:hover:bg-calligraphy-900/30 transition-colors border border-calligraphy-200 dark:border-calligraphy-700"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-islamic-brown to-islamic-mahogany rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ lastReadPosition.surahNumber }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-islamic-charcoal dark:text-islamic-cream">
                  {{ getSurahName(lastReadPosition.surahNumber) }}
                </p>
                <p class="text-xs text-calligraphy-700 dark:text-calligraphy-300">
                  Verse {{ lastReadPosition.verseNumber }}
                </p>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Surahs List -->
        <div class="p-4">
          <h3 class="text-sm font-semibold text-islamic-brown dark:text-calligraphy-200 mb-4 flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
            <span>All Surahs ({{ filteredSurahs.length }})</span>
          </h3>
          
          <div class="space-y-2 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-calligraphy-300 scrollbar-track-calligraphy-100 dark:scrollbar-thumb-calligraphy-700 dark:scrollbar-track-gray-800">
            <router-link
              v-for="surah in filteredSurahs"
              :key="surah.number"
              :to="`/surah/${surah.number}`"
              @click="closeNavigation"
              class="block p-3 rounded-xl text-sm hover:bg-calligraphy-100 dark:hover:bg-gray-700 transition-all duration-200 group border border-transparent hover:border-calligraphy-200 dark:hover:border-gray-600 hover:shadow-sm"
              :class="{ 'bg-calligraphy-100 dark:bg-calligraphy-900/20 border-calligraphy-300 shadow-sm': currentSurahNumber === surah.number }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-islamic-brown to-islamic-mahogany rounded-xl flex items-center justify-center shadow-sm">
                    <span class="text-xs font-bold text-white">{{ surah.number }}</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-islamic-charcoal dark:text-islamic-cream font-semibold truncate">{{ surah.englishName }}</p>
                    <p class="text-sm text-calligraphy-700 dark:text-calligraphy-300 font-arabic truncate">{{ surah.name }}</p>
                    <p class="text-xs text-calligraphy-600 dark:text-calligraphy-400">{{ surah.revelationType }} • {{ surah.numberOfAyahs }} Ayahs</p>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <div class="w-2 h-2 bg-gold-500 rounded-full mb-1 opacity-60"></div>
                  <div class="text-xs text-calligraphy-600 dark:text-calligraphy-400 font-medium">
                    {{ surah.numberOfAyahs }}
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Recent Bookmarks Section -->
        <div v-if="recentBookmarks.length > 0" class="p-4 border-t border-calligraphy-200 dark:border-calligraphy-700">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-islamic-brown dark:text-calligraphy-200 flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <span>Recent Bookmarks</span>
            </h3>
            <router-link 
              to="/bookmarks"
              @click="closeNavigation"
              class="text-xs text-calligraphy-600 dark:text-calligraphy-400 hover:text-calligraphy-800 dark:hover:text-calligraphy-300"
            >
              View all
            </router-link>
          </div>
          <div class="space-y-2">
            <router-link
              v-for="bookmark in recentBookmarks.slice(0, 3)"
              :key="bookmark.id"
              :to="`/surah/${bookmark.surahNumber}#verse-${bookmark.verseNumber}`"
              @click="closeNavigation"
              class="block px-3 py-2 rounded-lg text-sm hover:bg-calligraphy-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-islamic-charcoal dark:text-islamic-cream truncate font-medium">
                    {{ bookmark.surahName }}
                  </p>
                  <p class="text-xs text-calligraphy-700 dark:text-calligraphy-300">
                    Verse {{ bookmark.verseNumber }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      @click="closeNavigation"
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
    ></div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuranStore } from '@/stores/quran'
import { useUserStore } from '@/stores/user'

interface Props {
  mobileMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mobileMode: false
})

const route = useRoute()
const quranStore = useQuranStore()
const userStore = useUserStore()

const isOpen = ref(false)
const surahSearchQuery = ref('')

const currentSurahNumber = computed(() => {
  return parseInt(route.params.id as string) || 0
})

const filteredSurahs = computed(() => {
  if (!surahSearchQuery.value) {
    return quranStore.surahs
  }
  const query = surahSearchQuery.value.toLowerCase()
  return quranStore.surahs.filter(surah => 
    surah.englishName.toLowerCase().includes(query) ||
    surah.name.includes(query) ||
    surah.number.toString().includes(query)
  )
})

const lastReadPosition = computed(() => userStore.lastReadPosition)
const recentBookmarks = computed(() => userStore.recentBookmarks)

function toggleNavigation() {
  isOpen.value = !isOpen.value
}

function closeNavigation() {
  isOpen.value = false
}

function getSurahName(surahNumber: number): string {
  const surah = quranStore.surahs.find(s => s.number === surahNumber)
  return surah?.englishName || `Surah ${surahNumber}`
}
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-calligraphy-300::-webkit-scrollbar-thumb {
  background-color: #ddd0aa;
  border-radius: 6px;
}

.scrollbar-track-calligraphy-100::-webkit-scrollbar-track {
  background-color: #f7f3e9;
}

.dark .scrollbar-thumb-calligraphy-700::-webkit-scrollbar-thumb {
  background-color: #7f6937;
}

.dark .scrollbar-track-gray-800::-webkit-scrollbar-track {
  background-color: #1f2937;
}

::-webkit-scrollbar {
  width: 6px;
}

.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', 'Times New Roman', serif;
}
</style>