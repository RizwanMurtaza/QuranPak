<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Search Quran</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Search across Arabic text, translations, and transliterations
      </p>
    </div>

    <!-- Search Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-verse p-6 mb-8">
      <div class="space-y-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Enter your search query..."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Button
              @click="performSearch"
              :disabled="!searchQuery.trim()"
              size="sm"
              class="px-4"
            >
              Search
            </Button>
          </div>
        </div>

        <!-- Search Filters -->
        <div class="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Translation:
            </label>
            <select
              v-model="selectedTranslation"
              class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en.sahih">English (Saheeh International)</option>
              <option value="en.pickthall">English (Pickthall)</option>
              <option value="en.yusufali">English (Yusuf Ali)</option>
              <option value="ur.jalandhry">Urdu (Jalandhry)</option>
              <option value="ar.quran">Arabic (Original)</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Surah:
            </label>
            <select
              v-model="selectedSurah"
              class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Surahs</option>
              <option v-for="surah in surahs" :key="surah.number" :value="surah.number">
                {{ surah.number }}. {{ surah.englishName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="hasSearched">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Search Error</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <Button @click="performSearch" variant="outline">Try Again</Button>
      </div>

      <div v-else-if="searchResults.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Try adjusting your search terms or filters
        </p>
      </div>

      <div v-else>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Search Results
          </h2>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ totalResults }} result{{ totalResults !== 1 ? 's' : '' }} found
            <span v-if="totalResults !== searchResults.length">
              (showing {{ searchResults.length }})
            </span>
          </span>
        </div>

        <div class="space-y-4">
          <div
            v-for="result in searchResults"
            :key="`${result.ayah.surah.number}-${result.ayah.numberInSurah}`"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-sm font-semibold">
                  {{ result.ayah.numberInSurah }}
                </div>
                <div>
                  <router-link
                    :to="`/surah/${result.ayah.surah.number}#verse-${result.ayah.numberInSurah}`"
                    class="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {{ result.surah.englishName }}
                  </router-link>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Verse {{ result.ayah.numberInSurah }} • {{ result.surah.revelationType }}
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  @click="copyVerse(result)"
                  title="Copy verse"
                >
                  <template #icon-left>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </template>
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  @click="toggleBookmark(result)"
                  :title="isBookmarked(result.ayah.surah.number, result.ayah.numberInSurah) ? 'Remove bookmark' : 'Add bookmark'"
                >
                  <template #icon-left>
                    <svg 
                      class="w-4 h-4" 
                      :class="isBookmarked(result.ayah.surah.number, result.ayah.numberInSurah) ? 'text-yellow-500 fill-current' : ''"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                    </svg>
                  </template>
                </Button>
              </div>
            </div>

            <!-- Arabic Text -->
            <div class="arabic-text text-right text-2xl leading-relaxed mb-4 font-arabic" v-html="highlightText(result.ayah.text)"></div>

            <!-- Translation -->
            <div class="text-gray-700 dark:text-gray-300 leading-relaxed" v-html="highlightText(result.ayah.text)"></div>
            
            <!-- Metadata -->
            <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-4">
                <span>Juz {{ result.ayah.juz }}</span>
                <span>Page {{ result.ayah.page }}</span>
                <span v-if="result.ayah.sajda">Sajda Verse</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Suggestions -->
    <div v-else class="mt-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Searches</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="suggestion in searchSuggestions"
          :key="suggestion"
          @click="searchQuery = suggestion; performSearch()"
          class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuranStore } from '@/stores/quran'
import { useUserStore } from '@/stores/user'
import { useQuranAPI } from '@/composables/useQuranAPI'
import type { SearchResult, SearchMatch } from '@/types/api'
import Button from '@/components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const quranStore = useQuranStore()
const userStore = useUserStore()
const quranAPI = useQuranAPI()

const searchQuery = ref('')
const searchType = ref('all')
const selectedSurah = ref('')
const selectedTranslation = ref('en.sahih')
const searchResults = ref<SearchMatch[]>([])
const totalResults = ref(0)
const loading = ref(false)
const hasSearched = ref(false)
const error = ref<string | null>(null)

const searchSuggestions = [
  'mercy', 'forgiveness', 'patience', 'prayer', 'charity',
  'paradise', 'guidance', 'wisdom', 'peace', 'faith',
  'righteous', 'believers', 'grateful', 'remember', 'Allah'
]

const surahs = computed(() => quranStore.surahs)

async function performSearch() {
  if (!searchQuery.value.trim()) return

  loading.value = true
  hasSearched.value = true
  error.value = null
  
  try {
    const surahNumber = selectedSurah.value ? parseInt(selectedSurah.value) : undefined
    const translation = selectedTranslation.value
    
    // Perform the actual search using our API
    const result = await quranAPI.search(searchQuery.value.trim(), surahNumber, translation)
    
    if (result) {
      searchResults.value = result.matches || []
      totalResults.value = result.count || 0
    } else {
      searchResults.value = []
      totalResults.value = 0
    }

    // Update URL with search query
    const query: Record<string, string> = { q: searchQuery.value }
    if (selectedSurah.value) query.surah = selectedSurah.value
    if (selectedTranslation.value !== 'en.sahih') query.translation = selectedTranslation.value
    router.push({ name: 'search', query })
  } catch (err) {
    console.error('Search error:', err)
    error.value = err instanceof Error ? err.message : 'Search failed'
    searchResults.value = []
    totalResults.value = 0
  } finally {
    loading.value = false
  }
}

function getSurahName(surahNumber: number): string {
  const surah = surahs.value.find(s => s.number === surahNumber)
  return surah?.englishName || `Surah ${surahNumber}`
}

function isBookmarked(surahNumber: number, verseNumber: number): boolean {
  return userStore.isBookmarked(surahNumber, verseNumber)
}

function toggleBookmark(result: SearchMatch) {
  const surahNumber = result.ayah.surah.number
  const verseNumber = result.ayah.numberInSurah
  
  if (isBookmarked(surahNumber, verseNumber)) {
    const bookmark = userStore.getBookmark(surahNumber, verseNumber)
    if (bookmark) {
      userStore.removeBookmark(bookmark.id)
    }
  } else {
    userStore.addBookmark(
      surahNumber,
      verseNumber,
      result.surah.englishName,
      result.ayah.text
    )
  }
}

function copyVerse(result: SearchMatch) {
  const arabicText = result.ayah.text
  const surahName = result.surah.englishName
  const verseNumber = result.ayah.numberInSurah
  
  const fullText = `${arabicText}\n\n— ${surahName}, Verse ${verseNumber}`
  
  navigator.clipboard.writeText(fullText).then(() => {
    console.log('Verse copied to clipboard')
    // Future: Show success notification
  }).catch(err => {
    console.error('Failed to copy verse:', err)
  })
}

function highlightText(text: string): string {
  if (!searchQuery.value.trim()) return text
  
  const regex = new RegExp(`(${searchQuery.value.trim()})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

onMounted(async () => {
  // Initialize Quran store if needed
  if (quranStore.surahs.length === 0) {
    await quranStore.fetchSurahs()
  }
  
  // Check if there's a search query in the URL
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    
    if (route.query.surah) {
      selectedSurah.value = route.query.surah as string
    }
    
    if (route.query.translation) {
      selectedTranslation.value = route.query.translation as string
    }
    
    performSearch()
  }
})
</script>