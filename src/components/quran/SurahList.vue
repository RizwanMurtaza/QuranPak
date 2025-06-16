<template>
  <div class="space-y-4">
    <!-- Search and Filter -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Surahs..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2">
        <select
          v-model="filterBy"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Surahs</option>
          <option value="meccan">Meccan</option>
          <option value="medinan">Medinan</option>
        </select>
        
        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="number">By Number</option>
          <option value="name">By Name</option>
          <option value="ayahs">By Length</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-600 dark:text-red-400 mb-4">{{ error }}</div>
      <Button @click="$emit('retry')" variant="outline">
        Try Again
      </Button>
    </div>

    <!-- Surah List -->
    <div v-else class="space-y-2">
      <div
        v-for="surah in filteredSurahs"
        :key="surah.number"
        @click="$emit('select', surah.number)"
        class="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Surah Number -->
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                <span class="text-sm font-semibold text-primary-800 dark:text-primary-200">
                  {{ surah.number }}
                </span>
              </div>
            </div>

            <!-- Surah Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ surah.englishName }}
                </h3>
                <div class="text-xl text-primary-600 dark:text-primary-400 font-arabic">
                  {{ surah.name }}
                </div>
              </div>
              
              <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                {{ surah.englishNameTranslation }}
              </p>
              
              <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center space-x-1">
                  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ surah.numberOfAyahs }} verses</span>
                </span>
                
                <span class="flex items-center space-x-1">
                  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  <span class="capitalize">{{ surah.revelationType }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Arrow Icon -->
          <div class="flex-shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        <!-- Progress Bar (if reading progress available) -->
        <div v-if="getReadingProgress(surah.number) > 0" class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Reading Progress</span>
            <span>{{ Math.round(getReadingProgress(surah.number)) }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <div 
              class="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
              :style="{ width: `${getReadingProgress(surah.number)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && filteredSurahs.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.329-1.313-5.5-3.291L12 21l5.5-9.291z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Surahs found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Try adjusting your search or filter criteria.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Surah } from '@/stores/quran'
import Button from '@/components/ui/Button.vue'

interface Props {
  surahs: Surah[]
  loading?: boolean
  error?: string | null
  readingProgress?: Record<number, number>
}

interface Emits {
  select: [surahNumber: number]
  retry: []
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  readingProgress: () => ({})
})

const emit = defineEmits<Emits>()

// State
const searchQuery = ref('')
const filterBy = ref<'all' | 'meccan' | 'medinan'>('all')
const sortBy = ref<'number' | 'name' | 'ayahs'>('number')

// Computed
const filteredSurahs = computed(() => {
  let filtered = [...props.surahs]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(surah => 
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.name.includes(query) ||
      surah.number.toString().includes(query)
    )
  }

  // Apply revelation type filter
  if (filterBy.value !== 'all') {
    filtered = filtered.filter(surah => 
      surah.revelationType.toLowerCase() === filterBy.value
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.englishName.localeCompare(b.englishName)
      case 'ayahs':
        return b.numberOfAyahs - a.numberOfAyahs
      case 'number':
      default:
        return a.number - b.number
    }
  })

  return filtered
})

// Methods
const getReadingProgress = (surahNumber: number): number => {
  return props.readingProgress?.[surahNumber] || 0
}

// Watch for search query changes and emit events if needed
watch(searchQuery, (newQuery) => {
  // Could emit search events for analytics
  if (newQuery.length > 0) {
    console.log('Searching for:', newQuery)
  }
})
</script>

<style scoped>
.font-arabic {
  font-family: 'Amiri', 'Times New Roman', serif;
  direction: rtl;
}

/* Custom scrollbar for the container */
.space-y-2 {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.primary.400') theme('colors.gray.200');
}

.space-y-2::-webkit-scrollbar {
  width: 6px;
}

.space-y-2::-webkit-scrollbar-track {
  @apply bg-gray-200 dark:bg-gray-700 rounded-full;
}

.space-y-2::-webkit-scrollbar-thumb {
  @apply bg-primary-400 dark:bg-primary-600 rounded-full;
}

.space-y-2::-webkit-scrollbar-thumb:hover {
  @apply bg-primary-600 dark:bg-primary-400;
}
</style>