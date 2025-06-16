<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        All Surahs
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Browse through all 114 chapters of the Holy Quran
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">114</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Surahs</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ meccanCount }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Meccan Surahs</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ medinanCount }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Medinan Surahs</div>
        </div>
      </div>
    </div>

    <!-- Surah List Component -->
    <SurahList
      :surahs="surahs"
      :loading="loading"
      :error="error"
      :reading-progress="readingProgress"
      @select="navigateToSurah"
      @retry="loadSurahs"
    />

    <!-- Quick Access -->
    <div v-if="!loading && surahs.length > 0" class="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Quick Access
      </h2>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          v-for="quickSurah in quickAccessSurahs"
          :key="quickSurah.number"
          @click="navigateToSurah(quickSurah.number)"
          class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
        >
          <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-2">
            <span class="text-sm font-bold text-primary-800 dark:text-primary-200">
              {{ quickSurah.number }}
            </span>
          </div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ quickSurah.englishName }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ quickSurah.verses }} verses
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuranStore } from '@/stores/quran'
import { useUserStore } from '@/stores/user'
import SurahList from '@/components/quran/SurahList.vue'

const router = useRouter()
const quranStore = useQuranStore()
const userStore = useUserStore()

// Computed
const surahs = computed(() => quranStore.surahs)
const loading = computed(() => quranStore.loading)
const error = computed(() => quranStore.error)

const meccanCount = computed(() => 
  surahs.value.filter(s => s.revelationType.toLowerCase() === 'meccan').length
)

const medinanCount = computed(() => 
  surahs.value.filter(s => s.revelationType.toLowerCase() === 'medinan').length
)

const readingProgress = computed(() => {
  // Calculate reading progress for each surah based on user's reading history
  const progress: Record<number, number> = {}
  
  userStore.recentlyRead.forEach(item => {
    const surah = surahs.value.find(s => s.number === item.surahNumber)
    if (surah) {
      const percentage = (item.verseNumber / surah.numberOfAyahs) * 100
      progress[item.surahNumber] = Math.max(progress[item.surahNumber] || 0, percentage)
    }
  })
  
  return progress
})

const quickAccessSurahs = computed(() => {
  const popularSurahs = [1, 2, 18, 36, 55, 67]
  return popularSurahs.map(number => {
    const surah = surahs.value.find(s => s.number === number)
    return {
      number,
      englishName: surah?.englishName || `Surah ${number}`,
      verses: surah?.numberOfAyahs || 0
    }
  }).filter(s => s.verses > 0)
})

// Methods
const navigateToSurah = (surahNumber: number) => {
  router.push(`/surah/${surahNumber}`)
}

const loadSurahs = async () => {
  await quranStore.fetchSurahs()
}

// Lifecycle
onMounted(() => {
  if (surahs.value.length === 0) {
    loadSurahs()
  }
})
</script>

<style scoped>
/* Component-specific styles if needed */
</style>