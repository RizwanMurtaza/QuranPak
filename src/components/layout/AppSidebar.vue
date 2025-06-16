<template>
  <aside 
    :class="[
      'fixed lg:static inset-y-0 left-0 z-40 w-80 bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 border-r-2 border-emerald-200 dark:border-emerald-700 transform transition-transform duration-300 ease-in-out lg:transform-none shadow-xl',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between h-24 px-6 border-b-2 border-emerald-200 dark:border-emerald-700 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-gray-800 dark:to-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h2 class="text-lg font-bold text-emerald-800 dark:text-emerald-200">Al-Quran</h2>
      </div>
      <button 
        @click="$emit('close')"
        class="lg:hidden p-2 rounded-md text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-gray-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Sidebar Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Reading Progress Section -->
      <div v-if="lastReadPosition" class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Continue Reading</h3>
        <router-link
          :to="`/surah/${lastReadPosition.surahNumber}#verse-${lastReadPosition.verseNumber}`"
          class="block p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Surah {{ getSurahName(lastReadPosition.surahNumber) }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Verse {{ lastReadPosition.verseNumber }}
              </p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Surah List -->
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
            <span>Surahs</span>
          </h3>
          <div class="relative">
            <svg class="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="surahSearchQuery"
              type="text"
              placeholder="Search..."
              class="w-28 pl-7 pr-2 py-1 text-xs border border-emerald-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-emerald-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
          </div>
        </div>
        
        <div class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          <router-link
            v-for="surah in filteredSurahs"
            :key="surah.number"
            :to="`/surah/${surah.number}`"
            class="block p-3 rounded-xl text-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200 group border border-transparent hover:border-emerald-200 dark:hover:border-gray-600 hover:shadow-md"
            :class="{ 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 shadow-sm': $route.params.id === surah.number.toString() }"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <span class="text-xs font-bold text-white">
                    {{ surah.number }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-emerald-900 dark:text-emerald-100 font-semibold truncate">{{ surah.englishName }}</p>
                  <p class="text-sm text-emerald-700 dark:text-emerald-300 font-arabic truncate">{{ surah.arabicName }}</p>
                  <p class="text-xs text-emerald-600 dark:text-emerald-400">{{ surah.revelationType }} • {{ surah.numberOfAyahs }} Ayahs</p>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <div class="w-2 h-2 bg-gold-500 rounded-full mb-1 opacity-60"></div>
                <div class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {{ surah.numberOfAyahs }}
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Recently Read Section -->
      <div v-if="recentlyRead.length > 0" class="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Recently Read</h3>
        <div class="space-y-2">
          <router-link
            v-for="progress in recentlyRead"
            :key="`${progress.surahNumber}-${progress.verseNumber}`"
            :to="`/surah/${progress.surahNumber}#verse-${progress.verseNumber}`"
            class="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-900 dark:text-white">
                  {{ getSurahName(progress.surahNumber) }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Verse {{ progress.verseNumber }}
                </p>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(progress.timestamp) }}
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Bookmarks Section -->
      <div v-if="recentBookmarks.length > 0" class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">Recent Bookmarks</h3>
          <router-link 
            to="/bookmarks" 
            class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            View all
          </router-link>
        </div>
        <div class="space-y-2">
          <router-link
            v-for="bookmark in recentBookmarks.slice(0, 5)"
            :key="bookmark.id"
            :to="`/surah/${bookmark.surahNumber}#verse-${bookmark.verseNumber}`"
            class="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-start space-x-2">
              <svg class="w-4 h-4 text-islamic-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 dark:text-white truncate">
                  {{ bookmark.surahName }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Verse {{ bookmark.verseNumber }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay for mobile -->
  <div 
    v-if="isOpen" 
    @click="$emit('close')"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
  ></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuranStore } from '@/stores/quran'
import { useUserStore } from '@/stores/user'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const quranStore = useQuranStore()
const userStore = useUserStore()

const surahSearchQuery = ref('')

const filteredSurahs = computed(() => {
  if (!surahSearchQuery.value) {
    return quranStore.surahs
  }
  const query = surahSearchQuery.value.toLowerCase()
  return quranStore.surahs.filter(surah => 
    surah.englishName.toLowerCase().includes(query) ||
    surah.arabicName.includes(query) ||
    surah.number.toString().includes(query)
  )
})

const lastReadPosition = computed(() => userStore.lastReadPosition)
const recentlyRead = computed(() => userStore.recentlyRead)
const recentBookmarks = computed(() => userStore.recentBookmarks)

function getSurahName(surahNumber: number): string {
  const surah = quranStore.surahs.find(s => s.number === surahNumber)
  return surah?.englishName || `Surah ${surahNumber}`
}

function formatDate(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}
</script>