<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuranStore } from '@/stores/quran'
import { useUserStore } from '@/stores/user'
import Button from '@/components/ui/Button.vue'

const quranStore = useQuranStore()
const userStore = useUserStore()

const surahs = computed(() => quranStore.surahs.slice(0, 12)) // Show first 12 surahs
const recentlyRead = computed(() => userStore.recentlyRead.slice(0, 3))
const recentBookmarks = computed(() => userStore.recentBookmarks.slice(0, 3))
const lastReadPosition = computed(() => userStore.lastReadPosition)

const featuredSurahs = [
  { number: 1, highlight: 'The Opening' },
  { number: 2, highlight: 'The Longest Surah' },
  { number: 18, highlight: 'The Cave' },
  { number: 36, highlight: 'Ya-Seen' },
  { number: 55, highlight: 'The Beneficent' },
  { number: 67, highlight: 'The Sovereignty' }
]

onMounted(() => {
  if (quranStore.surahs.length === 0) {
    quranStore.fetchSurahs()
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Compact Hero Section -->
    <section class="relative bg-gradient-to-br from-calligraphy-50 via-cream-50 to-calligraphy-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Islamic Pattern Background -->
        <div class="absolute inset-0 opacity-5">
          <svg class="w-full h-full text-calligraphy-600" viewBox="0 0 400 400" fill="currentColor">
            <defs>
              <pattern id="islamic-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2"/>
                <circle cx="10" cy="10" r="1"/>
                <circle cx="30" cy="30" r="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-pattern)"/>
          </svg>
        </div>

        <div class="relative">
          <h1 class="text-4xl md:text-5xl font-bold text-calligraphy-900 dark:text-calligraphy-100 mb-4">
            QuranLight <span class="text-calligraphy-600 dark:text-calligraphy-400">Digital Mushaf</span>
          </h1>
          
          <p class="text-lg md:text-xl text-calligraphy-700 dark:text-calligraphy-300 mb-6 leading-relaxed">
            Let Divine Light Guide Your Journey • Word-by-Word Translation
          </p>

          <!-- Bismillah -->
          <div class="mb-6">
            <p class="text-xl md:text-2xl font-arabic text-calligraphy-800 dark:text-calligraphy-200 mb-2">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p class="text-sm text-calligraphy-600 dark:text-calligraphy-400 italic">
              "In the name of Allah, the Entirely Merciful, the Especially Merciful"
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <router-link v-if="lastReadPosition" :to="`/surah/${lastReadPosition.surahNumber}`">
              <Button variant="primary" size="md" class="w-full sm:w-auto">
                <template #icon-left>
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </template>
                Continue Reading
              </Button>
            </router-link>
            
            <router-link v-else to="/surah/1">
              <Button variant="primary" size="md" class="w-full sm:w-auto">
                <template #icon-left>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </template>
                Start Reading
              </Button>
            </router-link>

            <router-link to="/search">
              <Button variant="outline" size="md" class="w-full sm:w-auto">
                <template #icon-left>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </template>
                Search Quran
              </Button>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <!-- Continue Reading Section -->
      <section v-if="lastReadPosition || recentlyRead.length > 0" class="space-y-4">
        <h2 class="text-xl font-bold text-calligraphy-900 dark:text-calligraphy-100">Continue Your Journey</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Last Read Position -->
          <div v-if="lastReadPosition" class="bg-gradient-to-r from-calligraphy-50 to-cream-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-4 border-l-4 border-calligraphy-500">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-8 h-8 bg-calligraphy-600 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-calligraphy-900 dark:text-calligraphy-100 text-sm">Last Read</h3>
                <p class="text-xs text-calligraphy-700 dark:text-calligraphy-300">Continue where you left off</p>
              </div>
            </div>
            <router-link 
              :to="`/surah/${lastReadPosition.surahNumber}#verse-${lastReadPosition.verseNumber}`"
              class="block text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-900 dark:hover:text-calligraphy-200 text-sm font-medium"
            >
              Surah {{ lastReadPosition.surahNumber }}, Verse {{ lastReadPosition.verseNumber }}
            </router-link>
          </div>

          <!-- Recently Read -->
          <div 
            v-for="progress in recentlyRead" 
            :key="`${progress.surahNumber}-${progress.verseNumber}`"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
          >
            <h3 class="font-semibold text-calligraphy-900 dark:text-calligraphy-100 text-sm mb-2">Recently Read</h3>
            <router-link 
              :to="`/surah/${progress.surahNumber}#verse-${progress.verseNumber}`"
              class="text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-900 dark:hover:text-calligraphy-200 text-sm font-medium"
            >
              Surah {{ progress.surahNumber }}, Verse {{ progress.verseNumber }}
            </router-link>
            <p class="text-xs text-calligraphy-600 dark:text-calligraphy-400 mt-1">
              {{ new Date(progress.timestamp).toLocaleDateString() }}
            </p>
          </div>
        </div>
      </section>

      <!-- Featured Surahs -->
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-calligraphy-900 dark:text-calligraphy-100">Featured Surahs</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <router-link
            v-for="featured in featuredSurahs"
            :key="featured.number"
            :to="`/surah/${featured.number}`"
            class="group text-center p-4 hover:bg-calligraphy-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <!-- Round Circle with Surah Names -->
            <div class="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-calligraphy-600 via-cream-600 to-calligraphy-700 rounded-full flex flex-col items-center justify-center shadow-xl border-3 border-calligraphy-300 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 relative">
              <!-- Decorative Islamic Pattern -->
              <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
              <!-- Surah Number Badge -->
              <div class="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                {{ featured.number }}
              </div>
              <!-- English Name -->
              <span class="text-white font-bold text-xs leading-tight text-center px-1 relative z-10">
                {{ quranStore.surahs.find(s => s.number === featured.number)?.englishName || `Surah ${featured.number}` }}
              </span>
              <!-- Arabic Name -->
              <span class="text-calligraphy-100 text-sm font-arabic-elegant mt-1 leading-tight relative z-10">
                {{ quranStore.surahs.find(s => s.number === featured.number)?.name || '' }}
              </span>
            </div>
            <h3 class="font-semibold text-calligraphy-900 dark:text-calligraphy-100 text-sm mb-1">
              {{ featured.highlight }}
            </h3>
            <p class="text-xs text-calligraphy-600 dark:text-calligraphy-400 font-medium">
              {{ quranStore.surahs.find(s => s.number === featured.number)?.numberOfAyahs || 0 }} Ayahs
            </p>
          </router-link>
        </div>
      </section>

      <!-- Recent Bookmarks -->
      <section v-if="recentBookmarks.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-calligraphy-900 dark:text-calligraphy-100">Recent Bookmarks</h2>
          <router-link to="/bookmarks">
            <Button variant="ghost" size="sm">
              View All
              <template #icon-right>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </template>
            </Button>
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            v-for="bookmark in recentBookmarks"
            :key="bookmark.id"
            :to="`/surah/${bookmark.surahNumber}#verse-${bookmark.verseNumber}`"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start space-x-3">
              <svg class="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-calligraphy-900 dark:text-calligraphy-100 truncate text-sm">
                  {{ bookmark.surahName }}
                </h3>
                <p class="text-xs text-calligraphy-700 dark:text-calligraphy-300">
                  Verse {{ bookmark.verseNumber }}
                </p>
                <p class="text-xs text-calligraphy-600 dark:text-calligraphy-400 mt-1 line-clamp-2">
                  {{ bookmark.verseText }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <!-- All Surahs Preview -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-calligraphy-900 dark:text-calligraphy-100">All Surahs</h2>
          <span class="text-sm text-calligraphy-600 dark:text-calligraphy-400">114 chapters</span>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <router-link
            v-for="surah in surahs"
            :key="surah.number"
            :to="`/surah/${surah.number}`"
            class="group text-center p-3 hover:bg-calligraphy-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <!-- Round Circle with Surah Names -->
            <div class="w-18 h-18 mx-auto mb-2 bg-gradient-to-br from-calligraphy-600 via-cream-600 to-calligraphy-700 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-calligraphy-300 group-hover:shadow-xl group-hover:scale-105 transition-all duration-200 relative">
              <!-- Decorative gradient overlay -->
              <div class="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
              <!-- Surah Number Badge -->
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-gold-400 to-gold-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white z-10">
                {{ surah.number }}
              </div>
              <!-- English Name -->
              <span class="text-white font-semibold text-xs leading-tight text-center px-1 relative z-10">
                {{ surah.englishName }}
              </span>
              <!-- Arabic Name -->
              <span class="text-calligraphy-100 text-xs font-arabic mt-0.5 leading-tight relative z-10">
                {{ surah.name }}
              </span>
            </div>
            <div class="text-xs text-calligraphy-600 dark:text-calligraphy-400 font-medium">
              {{ surah.numberOfAyahs }} Ayahs
            </div>
          </router-link>
        </div>
      </section>
    </div>

    <!-- Features Section -->
    <section class="bg-gradient-to-r from-calligraphy-50 to-cream-50 dark:from-gray-800 dark:to-gray-700 py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-calligraphy-900 dark:text-calligraphy-100 mb-3">
            Why Choose QuranLight?
          </h2>
          <p class="text-calligraphy-700 dark:text-calligraphy-300">
            Experience the Quran with modern, interactive features
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4">
            <div class="w-12 h-12 bg-calligraphy-100 dark:bg-calligraphy-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-calligraphy-600 dark:text-calligraphy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-calligraphy-900 dark:text-calligraphy-100 mb-2">Word-by-Word</h3>
            <p class="text-sm text-calligraphy-700 dark:text-calligraphy-300">Interactive exploration of each Arabic word with translation</p>
          </div>

          <div class="text-center p-4">
            <div class="w-12 h-12 bg-calligraphy-100 dark:bg-calligraphy-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-calligraphy-600 dark:text-calligraphy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 12.536a4 4 0 11-7.072 0m7.072 0A8.001 8.001 0 0112 4a8.001 8.001 0 016.536 8.536m-7.072 0L12 19"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-calligraphy-900 dark:text-calligraphy-100 mb-2">Audio Recitation</h3>
            <p class="text-sm text-calligraphy-700 dark:text-calligraphy-300">Listen to beautiful recitations from multiple reciters</p>
          </div>

          <div class="text-center p-4">
            <div class="w-12 h-12 bg-calligraphy-100 dark:bg-calligraphy-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-calligraphy-600 dark:text-calligraphy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-base font-semibold text-calligraphy-900 dark:text-calligraphy-100 mb-2">Mobile Optimized</h3>
            <p class="text-sm text-calligraphy-700 dark:text-calligraphy-300">Beautiful, responsive design for all devices</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', 'Times New Roman', serif;
  font-weight: 500;
}

.font-arabic-elegant {
  font-family: 'Scheherazade New', 'Amiri', 'Noto Naskh Arabic', 'Arabic Typesetting', serif;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Enhanced circular design */
.border-3 {
  border-width: 3px;
}

.w-18 {
  width: 4.5rem; /* 72px */
}

.h-18 {
  height: 4.5rem; /* 72px */
}

/* Islamic geometric pattern effect */
.group:hover .w-20,
.group:hover .w-18 {
  background: linear-gradient(135deg, #8b4513 0%, #c04000 50%, #800020 100%);
}

/* Golden accent hover effect */
.group:hover .bg-gradient-to-br.from-gold-400 {
  transform: rotate(5deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

/* Smooth animations */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(139, 69, 19, 0.3); }
  50% { box-shadow: 0 0 30px rgba(139, 69, 19, 0.5), 0 0 40px rgba(139, 69, 19, 0.2); }
}

.group:hover .w-20,
.group:hover .w-18,
.group:hover .w-16 {
  animation: glow 2s ease-in-out infinite;
}
</style>
