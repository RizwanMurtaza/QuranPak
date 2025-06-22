<template>
  <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8 min-h-screen">
    <!-- Enhanced Background with Multiple Patterns -->
    <div class="fixed inset-0 bg-gradient-to-br from-islamic-ivory via-calligraphy-50 to-islamic-cream dark:from-islamic-midnight dark:via-islamic-charcoal dark:to-islamic-midnight"></div>
    <div class="fixed inset-0 bg-calligraphy-texture opacity-30 dark:opacity-20"></div>
    <div class="fixed inset-0 bg-arabesque-pattern opacity-10 dark:opacity-5"></div>
    
    <!-- Content Container -->
    <div class="relative z-10">
    <!-- Floating Surah Navigation - Desktop only -->
    <SurahNavigation class="hidden sm:block" />
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading Surah...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Surah</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <Button @click="loadSurah" variant="primary">
        Try Again
      </Button>
    </div>

    <!-- Main Content -->
    <div v-else-if="currentSurah">
      <!-- Mobile Navigation - Top on mobile -->
      <div class="sm:hidden mb-4">
        <div class="flex items-center justify-between p-3 bg-gradient-to-r from-calligraphy-100 to-islamic-cream dark:from-islamic-charcoal dark:to-islamic-midnight rounded-2xl shadow-luxury border border-calligraphy-300 dark:border-calligraphy-700">
          <SurahNavigation mobile-mode />
          <div class="flex items-center space-x-2 text-xs text-calligraphy-700 dark:text-calligraphy-300">
            <span>{{ currentSurah?.numberOfAyahs }} Ayahs</span>
            <div class="w-1 h-1 bg-gold-500 rounded-full"></div>
            <span>{{ currentSurah?.revelationType }}</span>
          </div>
        </div>
      </div>

      <!-- Majestic Islamic Surah Header -->
      <div class="surah-header relative overflow-hidden py-8 px-8 mb-8 bg-gradient-to-br from-calligraphy-200 via-islamic-cream to-gold-100 dark:from-islamic-charcoal dark:via-islamic-midnight dark:to-calligraphy-900 rounded-3xl border-2 border-gold-300/40 dark:border-gold-600/40 shadow-luxury group">
        <!-- Multi-layered Background Patterns -->
        <div class="absolute inset-0 bg-arabesque-pattern opacity-15 dark:opacity-10"></div>
        <div class="absolute inset-0 bg-geometric-pattern opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
        <div class="absolute inset-0 bg-calligraphy-texture opacity-20 dark:opacity-15"></div>
        
        <!-- Elegant Border Decoration -->
        <div class="absolute inset-0 border-2 border-gold-400/30 rounded-3xl animate-pulse-gold"></div>
        
        <!-- Corner Islamic Ornaments -->
        <div class="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400/60 rounded-tl-3xl"></div>
        <div class="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold-400/60 rounded-tr-3xl"></div>
        <div class="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold-400/60 rounded-bl-3xl"></div>
        <div class="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400/60 rounded-br-3xl"></div>
        
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <!-- Enhanced Surah Information -->
          <div class="flex items-center space-x-6">
            <!-- Magnificent Surah Number -->
            <div class="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-islamic-brown via-gold-600 to-islamic-burgundy rounded-3xl shadow-luxury border-2 border-gold-400/50 animate-breathe">
              <!-- Rotating ornamental background -->
              <div class="absolute inset-0 bg-geometric-pattern opacity-30 rounded-3xl animate-rotate-slow"></div>
              <!-- Inner glow -->
              <div class="absolute inset-2 bg-gradient-to-br from-gold-300/20 via-transparent to-islamic-bronze/20 rounded-2xl"></div>
              <!-- Surah number -->
              <span class="relative text-2xl font-bold text-islamic-cream drop-shadow-lg">{{ currentSurah.number }}</span>
              <!-- Decorative ring -->
              <div class="absolute inset-0 border-2 border-gold-400/40 rounded-3xl animate-pulse-gold"></div>
              
              <!-- Corner decorations -->
              <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-gold-300 rounded-tl-3xl"></div>
              <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-gold-300 rounded-tr-3xl"></div>
              <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-gold-300 rounded-bl-3xl"></div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-gold-300 rounded-br-3xl"></div>
            </div>
            
            <!-- Surah Names and Translation -->
            <div class="space-y-2">
              <!-- English and Arabic Names -->
              <div class="space-y-1">
                <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-islamic-charcoal via-calligraphy-800 to-islamic-charcoal dark:from-islamic-cream dark:via-gold-200 dark:to-islamic-cream bg-clip-text text-transparent font-display">
                  {{ currentSurah.englishName }}
                </h1>
                <h2 class="text-2xl lg:text-3xl font-arabic text-calligraphy-700 dark:text-calligraphy-300 leading-relaxed">
                  {{ currentSurah.name }}
                </h2>
              </div>
              
              <!-- Translation with decorative elements -->
              <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
                <p class="text-sm lg:text-base text-calligraphy-600 dark:text-calligraphy-400 font-serif italic">
                  "{{ currentSurah.englishNameTranslation }}"
                </p>
                <div class="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Surah Metadata -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 text-sm lg:text-base">
            <!-- Ayah Count -->
            <div class="flex items-center space-x-3 bg-gradient-to-r from-calligraphy-100 to-islamic-cream dark:from-islamic-charcoal dark:to-calligraphy-800 px-4 py-3 rounded-2xl shadow-sm border border-gold-300/40 dark:border-gold-600/40">
              <div class="w-3 h-3 bg-gold-500 rounded-full animate-pulse"></div>
              <span class="font-medium text-islamic-charcoal dark:text-islamic-cream">{{ currentSurah.numberOfAyahs }}</span>
              <span class="text-calligraphy-600 dark:text-calligraphy-400">Ayahs</span>
            </div>
            
            <!-- Revelation Type -->
            <div class="flex items-center space-x-3 bg-gradient-to-r from-calligraphy-100 to-islamic-cream dark:from-islamic-charcoal dark:to-calligraphy-800 px-4 py-3 rounded-2xl shadow-sm border border-gold-300/40 dark:border-gold-600/40">
              <div class="w-3 h-3 bg-islamic-sage rounded-full animate-pulse"></div>
              <span class="font-medium capitalize text-islamic-charcoal dark:text-islamic-cream">{{ currentSurah.revelationType }}</span>
            </div>
            
            <!-- Additional decorative element -->
            <div class="hidden lg:flex items-center justify-center w-8 h-8 bg-gradient-to-br from-islamic-bronze to-islamic-burgundy rounded-full shadow-md">
              <div class="text-gold-200 text-xs font-arabic">✦</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Elegant Islamic Controls -->
      <div class="bg-gradient-to-r from-calligraphy-100 to-islamic-cream dark:from-islamic-charcoal dark:to-islamic-midnight rounded-2xl shadow-luxury border border-calligraphy-300 dark:border-calligraphy-600 p-4 sm:p-6 mb-8">
        <!-- Display Toggle Switches - Always in one row -->
        <div class="flex items-center justify-center gap-2 sm:gap-4 mb-4">
          <ToggleSwitch v-model="showWordByWord" label="Words" />
          <ToggleSwitch v-model="showTransliteration" label="Roman" />
          <ToggleSwitch v-model="showTranslation" label="Translation" />
          <ToggleSwitch v-model="showTafseer" label="Tafseer" />
        </div>
        
        <!-- Action Buttons - Always in one row -->
        <div class="flex items-center justify-center gap-2 sm:gap-3">
            <Button
              @click="showTranslationSelector = true"
              variant="outline"
              size="sm"
              class="border-calligraphy-300 text-calligraphy-700 hover:bg-calligraphy-100 dark:border-calligraphy-600 dark:text-calligraphy-300 dark:hover:bg-calligraphy-900/20 text-xs sm:text-sm"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
              </svg>
              <span class="hidden sm:inline">Translations</span>
              <span class="sm:hidden">Trans</span> ({{ selectedTranslations.length }})
            </Button>
            
            <Button
              @click="showTafseerSelector = true"
              variant="outline"
              size="sm"
              class="border-calligraphy-300 text-calligraphy-700 hover:bg-calligraphy-100 dark:border-calligraphy-600 dark:text-calligraphy-300 dark:hover:bg-calligraphy-900/20 text-xs sm:text-sm"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span class="hidden sm:inline">Tafseers</span>
              <span class="sm:hidden">Tafseer</span> ({{ selectedTafseers.length }})
            </Button>
            
            <Button
              @click="showReciterSelector = true"
              variant="outline"
              size="sm"
              class="border-calligraphy-300 text-calligraphy-700 hover:bg-calligraphy-100 dark:border-calligraphy-600 dark:text-calligraphy-300 dark:hover:bg-calligraphy-900/20 text-xs sm:text-sm"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142m-5.758-2.828l-2.828-2.828-2.828 2.828"></path>
              </svg>
              <span class="hidden sm:inline">{{ getVerseReciterName() }}</span>
              <span class="sm:hidden">Reciter</span>
            </Button>
            
            <Button
              @click="showTypographySelector = true"
              variant="outline"
              size="sm"
              class="border-calligraphy-300 text-calligraphy-700 hover:bg-calligraphy-100 dark:border-calligraphy-600 dark:text-calligraphy-300 dark:hover:bg-calligraphy-900/20 text-xs sm:text-sm"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Font
            </Button>
            
            <!-- Audio Player - Hidden on mobile, shown on desktop -->
            <AudioPlayer
              v-if="currentSurahVerses.length > 0"
              class="hidden sm:block"
              :tracks="audioTracks"
              :current-reciter="selectedReciter"
              :available-reciters="availableReciters"
              @reciter-change="handleReciterChange"
              @track-changed="handleTrackChanged"
            />
        </div>
      </div>

      <!-- Verses -->
      <div class="space-y-6">
        <VerseCard
          v-for="verse in currentSurahVerses"
          :key="`${verse.surahNumber}-${verse.verseNumber}`"
          :id="`verse-${verse.verseNumber}`"
          :verse="verse"
          :selected-translations="selectedTranslations"
          :show-word-by-word="showWordByWord"
          :show-transliteration="showTransliteration"
          :show-translation="showTranslation"
          :show-tafseer="showTafseer"
          :selected-tafseers="selectedTafseers"
          :show-metadata="true"
          :is-bookmarked="isBookmarked(verse.surahNumber, verse.verseNumber)"
          :surah-name="currentSurah?.englishName || ''"
          :is-playing="currentPlayingVerse === verse.verseNumber"
          :arabic-font="selectedTypography"
          :verse-reciter="selectedVerseReciter"
          @bookmark="addBookmark"
          @unbookmark="removeBookmark"
          @word-click="onWordClick"
          @copy="onVerseCopy"
          @audio-play="onVerseAudioPlay"
          @audio-pause="onVerseAudioPause"
        />
      </div>
    </div>


    <!-- Mobile Audio Player - Bottom-centered, separate from navigation -->
    <div class="sm:hidden">
      <AudioPlayer
        v-if="currentSurahVerses.length > 0"
        :tracks="audioTracks"
        :current-reciter="selectedReciter"
        :available-reciters="availableReciters"
        @reciter-change="handleReciterChange"
        @track-changed="handleTrackChanged"
        mobile-mode
      />
    </div>

    <!-- Compact Translation Selector Modal -->
    <Teleport to="body">
      <Modal 
        v-model="showTranslationSelector" 
        title="Select Translations"
        size="sm"
        @close="showTranslationSelector = false"
      >
        <div class="space-y-3">
          <!-- Quick Language Tabs -->
          <div class="flex flex-wrap gap-1">
            <button
              v-for="lang in availableLanguages.slice(0, 6)"
              :key="lang.code"
              @click="selectLanguageQuick(lang.code)"
              :class="[
                'px-2 py-1 text-xs rounded-md transition-colors border',
                selectedLanguage === lang.code 
                  ? 'bg-calligraphy-100 dark:bg-calligraphy-900/30 border-calligraphy-300 dark:border-calligraphy-600 text-calligraphy-800 dark:text-calligraphy-200'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              {{ lang.native }}
            </button>
          </div>
          
          <!-- Compact Translators List -->
          <div v-if="selectedLanguage" class="max-h-60 overflow-y-auto">
            <div class="text-xs font-medium text-calligraphy-800 dark:text-calligraphy-200 mb-2">
              {{ getLanguageName(selectedLanguage) }} Translations
            </div>
            <div class="space-y-1">
              <label 
                v-for="translator in availableTranslatorsForLanguage" 
                :key="translator.identifier"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-calligraphy-50 dark:hover:bg-calligraphy-900/20 cursor-pointer transition-colors text-sm"
                :class="{ 'bg-calligraphy-50 dark:bg-calligraphy-900/20': selectedTranslators.includes(translator.identifier) }"
              >
                <input
                  type="checkbox"
                  :value="translator.identifier"
                  :checked="selectedTranslators.includes(translator.identifier)"
                  @change="toggleTranslator(translator.identifier)"
                  class="h-3 w-3 text-calligraphy-600 focus:ring-calligraphy-500 border-calligraphy-300 rounded"
                >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-calligraphy-900 dark:text-calligraphy-100 truncate text-sm">
                    {{ translator.englishName }}
                  </div>
                  <div v-if="translator.author" class="text-xs text-calligraphy-600 dark:text-calligraphy-400 truncate">
                    {{ translator.author }}
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Compact Action buttons -->
          <div class="flex justify-between items-center pt-2 border-t border-calligraphy-200 dark:border-calligraphy-700">
            <div class="text-xs text-calligraphy-600 dark:text-calligraphy-400">
              {{ selectedTranslators.length }} selected
            </div>
            <div class="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                @click="showTranslationSelector = false"
                class="text-xs px-3 py-1"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                @click="applySelectedTranslations"
                :disabled="selectedTranslators.length === 0"
                class="text-xs px-3 py-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Teleport>

    <!-- Compact Tafseer Selector Modal -->
    <Teleport to="body">
      <Modal 
        v-model="showTafseerSelector" 
        title="Select Tafseers"
        size="sm"
        @close="showTafseerSelector = false"
      >
        <div class="space-y-3">
          <!-- Quick Language Tabs -->
          <div class="flex flex-wrap gap-1">
            <button
              v-for="lang in availableTafseerLanguages.slice(0, 6)"
              :key="lang.code"
              @click="selectTafseerLanguageQuick(lang.code)"
              :class="[
                'px-2 py-1 text-xs rounded-md transition-colors border',
                selectedTafseerLanguage === lang.code 
                  ? 'bg-calligraphy-100 dark:bg-calligraphy-900/30 border-calligraphy-300 dark:border-calligraphy-600 text-calligraphy-800 dark:text-calligraphy-200'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              {{ lang.native }}
            </button>
          </div>
          
          <!-- Compact Tafseers List -->
          <div v-if="selectedTafseerLanguage" class="max-h-60 overflow-y-auto">
            <div class="text-xs font-medium text-calligraphy-800 dark:text-calligraphy-200 mb-2">
              {{ getLanguageName(selectedTafseerLanguage) }} Tafseers
            </div>
            <div class="space-y-1">
              <label 
                v-for="tafseer in availableTafseersForLanguage" 
                :key="tafseer.identifier"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-calligraphy-50 dark:hover:bg-calligraphy-900/20 cursor-pointer transition-colors text-sm"
                :class="{ 'bg-calligraphy-50 dark:bg-calligraphy-900/20': selectedTafseers.includes(tafseer.identifier) }"
              >
                <input
                  type="checkbox"
                  :value="tafseer.identifier"
                  :checked="selectedTafseers.includes(tafseer.identifier)"
                  @change="toggleTafseer(tafseer.identifier)"
                  class="h-3 w-3 text-calligraphy-600 focus:ring-calligraphy-500 border-calligraphy-300 rounded"
                >
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-calligraphy-900 dark:text-calligraphy-100 truncate text-sm">
                    {{ tafseer.englishName }}
                  </div>
                  <div v-if="tafseer.name !== tafseer.englishName" class="text-xs text-calligraphy-600 dark:text-calligraphy-400 truncate">
                    {{ tafseer.name }}
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Compact Action buttons -->
          <div class="flex justify-between items-center pt-2 border-t border-calligraphy-200 dark:border-calligraphy-700">
            <div class="text-xs text-calligraphy-600 dark:text-calligraphy-400">
              {{ selectedTafseers.length }} selected
            </div>
            <div class="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                @click="showTafseerSelector = false"
                class="text-xs px-3 py-1"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                @click="applySelectedTafseers"
                :disabled="selectedTafseers.length === 0"
                class="text-xs px-3 py-1"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Teleport>

    <!-- Comprehensive Reciter Selector Modal -->
    <Teleport to="body">
      <Modal 
        v-model="showReciterSelector" 
        title="Select Reciter"
        size="md"
        @close="showReciterSelector = false"
      >
        <div class="space-y-4">
          <!-- Search Filter -->
          <div>
            <input 
              v-model="reciterSearchQuery"
              type="text" 
              placeholder="Search reciters..."
              class="w-full px-3 py-2 border border-calligraphy-300 dark:border-calligraphy-700 rounded-lg bg-white dark:bg-gray-800 text-calligraphy-900 dark:text-calligraphy-100 focus:ring-2 focus:ring-calligraphy-500 focus:border-calligraphy-500"
            >
          </div>
          
          <div class="space-y-2 max-h-80 overflow-y-auto">
            <div 
              v-for="reciter in filteredReciters" 
              :key="reciter.identifier"
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-calligraphy-50 dark:hover:bg-calligraphy-900/20 cursor-pointer transition-colors border border-transparent"
              :class="{ 'bg-calligraphy-50 dark:bg-calligraphy-900/20 border-calligraphy-300 dark:border-calligraphy-700': selectedVerseReciter === reciter.identifier }"
              @click="selectedVerseReciter = reciter.identifier"
            >
              <input
                :id="reciter.identifier"
                type="radio"
                :value="reciter.identifier"
                :checked="selectedVerseReciter === reciter.identifier"
                class="h-4 w-4 text-calligraphy-600 focus:ring-calligraphy-500 border-calligraphy-300"
              >
              <label :for="reciter.identifier" class="flex-1 cursor-pointer">
                <div class="font-medium text-calligraphy-900 dark:text-calligraphy-100">
                  {{ reciter.englishName }}
                </div>
                <div class="text-sm text-calligraphy-700 dark:text-calligraphy-300">
                  {{ reciter.name }}
                </div>
                <div class="text-xs text-calligraphy-600 dark:text-calligraphy-400">
                  Audio Recitation
                </div>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 pt-4 border-t border-calligraphy-200 dark:border-calligraphy-800">
            <Button 
              variant="outline" 
              @click="showReciterSelector = false"
              class="border-calligraphy-300 text-calligraphy-700 hover:bg-calligraphy-100 dark:border-calligraphy-600 dark:text-calligraphy-300 dark:hover:bg-calligraphy-900/20"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              @click="applyReciterSelection"
              class="bg-gradient-to-r from-calligraphy-600 to-cream-600 hover:from-calligraphy-700 hover:to-cream-700"
            >
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </Teleport>

    <!-- Typography Selector Modal -->
    <Teleport to="body">
      <Modal 
        v-model="showTypographySelector" 
        title="Select Arabic Font"
        size="sm"
        @close="showTypographySelector = false"
      >
        <div class="space-y-4">
          <div class="space-y-2">
            <div 
              v-for="font in arabicFonts" 
              :key="font.id"
              class="p-4 rounded-lg hover:bg-calligraphy-50 dark:hover:bg-calligraphy-900/20 cursor-pointer transition-colors border border-calligraphy-200 dark:border-calligraphy-800"
              :class="{ 'bg-calligraphy-50 dark:bg-calligraphy-900/20 border-calligraphy-400 dark:border-calligraphy-600': selectedTypography === font.id }"
              @click="selectTypography(font.id)"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <input
                    :id="font.id"
                    type="radio"
                    :value="font.id"
                    :checked="selectedTypography === font.id"
                    class="h-4 w-4 text-calligraphy-600 focus:ring-calligraphy-500 border-calligraphy-300"
                  >
                  <label :for="font.id" class="font-medium text-calligraphy-900 dark:text-calligraphy-100 cursor-pointer">
                    {{ font.name }}
                  </label>
                </div>
              </div>
              <div 
                class="text-2xl text-center py-3 text-calligraphy-800 dark:text-calligraphy-200 leading-relaxed"
                :style="{ fontFamily: font.family }"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div class="text-xs text-center text-calligraphy-600 dark:text-calligraphy-400 mt-1">
                {{ font.name }} Font Style
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 pt-4 border-t border-calligraphy-200 dark:border-calligraphy-800">
            <Button 
              variant="outline" 
              @click="showTypographySelector = false"
              class="border-calligraphy-300 text-calligraphy-700 hover:bg-calligraphy-100 dark:border-calligraphy-600 dark:text-calligraphy-300 dark:hover:bg-calligraphy-900/20"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              @click="applyTypography"
              class="bg-gradient-to-r from-calligraphy-600 to-cream-600 hover:from-calligraphy-700 hover:to-cream-700"
            >
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </Teleport>
    </div> <!-- End content container -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuranStore } from '@/stores/quran'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import type { Verse, Word } from '@/stores/quran'
import type { Edition } from '@/types/api'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import VerseCard from '@/components/quran/VerseCard.vue'
import TranslationSelector from '@/components/quran/TranslationSelector.vue'
import TafseerSelector from '@/components/quran/TafseerSelector.vue'
import AudioPlayer from '@/components/quran/AudioPlayer.vue'
import SurahNavigation from '@/components/layout/SurahNavigation.vue'
import { getGlobalAyahNumber } from '@/utils/quranUtils'
import { useQuranAPI } from '@/composables/useQuranAPI'

const route = useRoute()
const quranStore = useQuranStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const quranAPI = useQuranAPI()

const props = defineProps<{
  id: number
}>()

// State - Connect to settings store with proper reactive refs
const showWordByWord = ref(settingsStore.showWordByWord)
const showTransliteration = ref(settingsStore.showTransliteration)
const showTranslation = ref(settingsStore.showTranslation)
const showTafseer = ref(settingsStore.showTafseer)
const showTranslationSelector = ref(false)
const showTafseerSelector = ref(false)
const selectedLanguage = ref('')
const selectedTranslators = ref<string[]>([])
const selectedTafseers = ref<string[]>(settingsStore.selectedTafseers)
const selectedTafseerLanguage = ref('')
const availableTranslatorsForLanguage = ref<any[]>([])
const availableTafseersForLanguage = ref<any[]>([])
const showReciterSelector = ref(false)
const showTypographySelector = ref(false)
const currentPlayingVerse = ref<number | null>(null)
const selectedTypography = ref(settingsStore.arabicFont || 'amiri')
const reciterSearchQuery = ref('')

// Separate reciter for individual verse playback (top controls)
const selectedVerseReciter = ref('ar.alafasy')

// Computed
const loading = computed(() => quranStore.loading)
const error = computed(() => quranStore.error)
const currentSurah = computed(() => quranStore.currentSurah)
const currentSurahVerses = computed(() => quranStore.currentSurahVerses)
const selectedTranslations = computed(() => quranStore.selectedTranslations)
const selectedReciter = computed(() => quranStore.selectedReciter)
const availableTranslations = computed(() => quranStore.availableTranslations)
const availableReciters = computed((): Edition[] => {
  // Actual working reciter identifiers from Al-Quran Cloud API
  return [
    { identifier: 'ar.alafasy', englishName: 'Mishary Alafasy', name: 'مشاري العفاسي', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.abdulbasitmurattal', englishName: 'Abdul Basit (Murattal)', name: 'عبد الباسط المرتل', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.abdullahbasfar', englishName: 'Abdullah Basfar', name: 'عبد الله بصفر', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.abdurrahmaansudais', englishName: 'Abdur-Rahman as-Sudais', name: 'عبد الرحمن السديس', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.abdulsamad', englishName: 'Abdul Samad', name: 'عبدالباسط عبدالصمد', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.shaatree', englishName: 'Abu Bakr Ash-Shaatree', name: 'أبو بكر الشاطري', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.ahmedajamy', englishName: 'Ahmed ibn Ali al-Ajamy', name: 'أحمد بن علي العجمي', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.hanirifai', englishName: 'Hani Rifai', name: 'هاني الرفاعي', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.husary', englishName: 'Mahmoud Khalil Al-Hussary', name: 'محمود خليل الحصري', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.husarymujawwad', englishName: 'Al-Hussary (Mujawwad)', name: 'محمود خليل الحصري (المجود)', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.hudhaify', englishName: 'Ali Hudhaify', name: 'علي بن عبدالرحمن الحذيفي', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.ibrahimakhbar', englishName: 'Ibrahim Akhdar', name: 'إبراهيم الأخضر', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.mahermuaiqly', englishName: 'Maher Al Muaiqly', name: 'ماهر المعيقلي', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.minshawi', englishName: 'Mohamed Siddiq El-Minshawi', name: 'محمد صديق المنشاوي', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.minshawimujawwad', englishName: 'Minshawi (Mujawwad)', name: 'محمد صديق المنشاوي (المجود)', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.muhammadayyoub', englishName: 'Muhammad Ayyoub', name: 'محمد أيوب', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.muhammadjibreel', englishName: 'Muhammad Jibreel', name: 'محمد جبريل', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.saoodshuraym', englishName: 'Saood Ash-Shuraym', name: 'سعود الشريم', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.parhizgar', englishName: 'Parhizgar', name: 'شهریار پرهیزگار', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const },
    { identifier: 'ar.aymanswoaid', englishName: 'Ayman Sowaid', name: 'أيمن سويد', language: 'ar', format: 'audio' as const, type: 'versebyverse' as const }
  ]
})

const filteredReciters = computed(() => {
  if (!reciterSearchQuery.value.trim()) {
    return availableReciters.value
  }
  
  const query = reciterSearchQuery.value.toLowerCase()
  return availableReciters.value.filter(reciter => 
    reciter.englishName.toLowerCase().includes(query) ||
    reciter.name.includes(query)
  )
})

const audioTracks = computed(() => {
  if (!currentSurahVerses.value || currentSurahVerses.value.length === 0) return []
  
  const reciterId = selectedReciter.value || 'ar.alafasy'
  const surahNumber = currentSurah.value?.number || props.id
  
  const tracks = currentSurahVerses.value.map(verse => {
    // Calculate global ayah number for audio URL using the utility function
    const globalAyahNumber = getGlobalAyahNumber(verse.surahNumber, verse.verseNumber)
    
    // Use the reciter ID as is since we've already corrected the identifiers
    let formattedReciterId = reciterId
    
    const track = {
      id: `${verse.surahNumber}-${verse.verseNumber}`,
      title: `${currentSurah.value?.englishName || 'Surah'} - Verse ${verse.verseNumber}`,
      url: `https://cdn.islamic.network/quran/audio/64/${formattedReciterId}/${globalAyahNumber}.mp3`,
      surahNumber: verse.surahNumber,
      verseNumber: verse.verseNumber
    }
    
    return track
  })
  
  return tracks
})

async function loadSurah() {
  await quranStore.fetchSurah(props.id, true)
}

function isBookmarked(surahNumber: number, verseNumber: number): boolean {
  return userStore.isBookmarked(surahNumber, verseNumber)
}

function toggleBookmark(verse: any) {
  if (isBookmarked(verse.surahNumber, verse.verseNumber)) {
    const bookmark = userStore.getBookmark(verse.surahNumber, verse.verseNumber)
    if (bookmark) {
      userStore.removeBookmark(bookmark.id)
    }
  } else {
    userStore.addBookmark(
      verse.surahNumber,
      verse.verseNumber,
      currentSurah.value?.englishName || '',
      verse.fullTranslation
    )
  }
}

function addBookmark(verse: Verse) {
  userStore.addBookmark(
    verse.surahNumber,
    verse.verseNumber,
    currentSurah.value?.englishName || '',
    verse.fullTranslation
  )
}

function removeBookmark(verse: Verse) {
  const bookmark = userStore.getBookmark(verse.surahNumber, verse.verseNumber)
  if (bookmark) {
    userStore.removeBookmark(bookmark.id)
  }
}

function onWordClick(word: Word, verse: Verse) {
  console.log('Word clicked:', word, 'in verse:', verse.verseNumber)
  // Future: Show word details modal or side panel
}

function onVerseCopy(text: string, verse: Verse) {
  console.log('Verse copied:', verse.verseNumber)
  // Future: Show success notification
}

function onVerseAudioPlay(verse: Verse) {
  console.log('Playing audio for verse:', verse.verseNumber)
}

function onVerseAudioPause(verse: Verse) {
  console.log('Paused audio for verse:', verse.verseNumber)
}

function setSelectedReciter(reciter: string) {
  quranStore.setSelectedReciter(reciter)
}

function applyTranslations(translations: string[]) {
  quranStore.setSelectedTranslations(translations)
  showTranslationSelector.value = false
  
  // Reload the surah with new translations
  loadSurah()
}

function selectReciter(reciterIdentifier: string) {
  quranStore.setSelectedReciter(reciterIdentifier)
}

function handleReciterSelection(reciterIdentifier: string) {
  // This function is for the AudioPlayer's reciter selection (continuous playback)
  quranStore.setSelectedReciter(reciterIdentifier)
  showReciterSelector.value = false
  // Audio tracks will automatically update due to computed property
}

function scrollToVerse(verseNumber: number) {
  currentPlayingVerse.value = verseNumber
  const verseElement = document.getElementById(`verse-${verseNumber}`)
  if (verseElement) {
    verseElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
  }
}

function handleTrackChanged(track: any) {
  // Update playing verse and scroll to it
  currentPlayingVerse.value = track.verseNumber
  scrollToVerse(track.verseNumber)
}

function handleReciterChange(reciterIdentifier: string) {
  quranStore.setSelectedReciter(reciterIdentifier)
  // Reload tracks with new reciter
  loadSurah()
}

// Arabic font options
const arabicFonts = [
  { id: 'amiri', name: 'Amiri', family: "'Amiri', serif" },
  { id: 'scheherazade', name: 'Scheherazade New', family: "'Scheherazade New', serif" },
  { id: 'uthmani', name: 'Uthmani', family: "'KFGQPC Uthmani Script HAFS', serif" },
  { id: 'noto', name: 'Noto Naskh Arabic', family: "'Noto Naskh Arabic', serif" },
  { id: 'lateef', name: 'Lateef', family: "'Lateef', serif" },
  { id: 'kitab', name: 'Kitab', family: "'Kitab', serif" }
]

function selectTypography(fontId: string) {
  selectedTypography.value = fontId
}

function applyTypography() {
  // Save to settings store if needed
  settingsStore.setArabicFont(selectedTypography.value)
  showTypographySelector.value = false
}

function applyReciterSelection() {
  showReciterSelector.value = false
  // The verse reciter has been updated when selected in the modal
}

function getVerseReciterName(): string {
  const reciter = availableReciters.value.find(r => r.identifier === selectedVerseReciter.value)
  return reciter ? reciter.englishName : 'Select Reciter'
}

// Available languages with their native names
const availableLanguages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' }
]

// Available tafseer languages (subset of translation languages)
const availableTafseerLanguages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fa', name: 'Persian', native: 'فارسی' }
]

// Translation database organized by language
const translationDatabase: Record<string, any[]> = {
  en: [
    { identifier: 'en.sahih', englishName: 'Saheeh International', author: 'Saheeh International' },
    { identifier: 'en.pickthall', englishName: 'Pickthall', author: 'Mohammed Marmaduke William Pickthall' },
    { identifier: 'en.yusufali', englishName: 'Yusuf Ali', author: 'Abdullah Yusuf Ali' },
    { identifier: 'en.shakir', englishName: 'Shakir', author: 'M. H. Shakir' },
    { identifier: 'en.hilali', englishName: 'Hilali & Khan', author: 'Muhammad Taqi-ud-Din al-Hilali & Muhammad Muhsin Khan' },
    { identifier: 'en.arberry', englishName: 'Arberry', author: 'A. J. Arberry' },
    { identifier: 'en.asad', englishName: 'Muhammad Asad', author: 'Muhammad Asad' }
  ],
  ur: [
    { identifier: 'ur.jalandhry', englishName: 'Jalandhry', author: 'Fateh Muhammad Jalandhry' },
    { identifier: 'ur.junagarhi', englishName: 'Junagarhi', author: 'Muhammad Junagarhi' },
    { identifier: 'ur.kanzuliman', englishName: 'Kanzul Iman', author: 'Ahmed Raza Khan' },
    { identifier: 'ur.ahmedali', englishName: 'Ahmed Ali', author: 'Ahmed Ali' }
  ],
  ar: [
    { identifier: 'ar.quran', englishName: 'Original Arabic', author: 'Quran (Arabic)' }
  ],
  fr: [
    { identifier: 'fr.hamidullah', englishName: 'Hamidullah', author: 'Muhammad Hamidullah' }
  ],
  es: [
    { identifier: 'es.cortes', englishName: 'Cortes', author: 'Julio Cortes' }
  ],
  de: [
    { identifier: 'de.bubenheim', englishName: 'Bubenheim & Elyas', author: 'A. S. F. Bubenheim and N. Elyas' }
  ],
  id: [
    { identifier: 'id.indonesian', englishName: 'Indonesian Ministry of Religious Affairs', author: 'Indonesian Ministry of Religious Affairs' }
  ],
  tr: [
    { identifier: 'tr.ates', englishName: 'Süleyman Ateş', author: 'Süleyman Ateş' }
  ],
  fa: [
    { identifier: 'fa.makarem', englishName: 'Makarem Shirazi', author: 'Naser Makarem Shirazi' }
  ],
  bn: [
    { identifier: 'bn.bengali', englishName: 'Muhiuddin Khan', author: 'Muhiuddin Khan' }
  ]
}

// Tafseer database organized by language
const tafseerDatabase: Record<string, any[]> = {
  en: [
    { identifier: 'en.ibnkathir', englishName: 'Ibn Kathir', name: 'Tafsir Ibn Kathir' },
    { identifier: 'en.maarifulquran', englishName: 'Maarif ul Quran', name: 'Ma\'arif al-Qur\'an' },
    { identifier: 'en.tafheem', englishName: 'Tafheem ul Quran', name: 'Tafhim al-Qur\'an' }
  ],
  ar: [
    { identifier: 'ar.muyassar', englishName: 'Al-Muyassar', name: 'التفسير الميسر' },
    { identifier: 'ar.jalalayn', englishName: 'Tafsir al-Jalalayn', name: 'تفسير الجلالين' },
    { identifier: 'ar.ibnkatheer', englishName: 'Ibn Kathir', name: 'تفسير ابن كثير' }
  ],
  ur: [
    { identifier: 'ur.jalandhri', englishName: 'Jalandhri', name: 'تفسیر جالندھری' },
    { identifier: 'ur.kanzulimaan', englishName: 'Kanz ul Imaan', name: 'کنز الایمان' }
  ],
  fa: [
    { identifier: 'fa.makarem', englishName: 'Tafsir Nemooneh', name: 'تفسیر نمونه' }
  ]
}

const previewTexts: Record<string, string> = {
  'en.sahih': 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
  'en.pickthall': 'In the name of Allah, the Beneficent, the Merciful.',
  'en.yusufali': 'In the name of Allah, Most Gracious, Most Merciful.',
  'en.shakir': 'In the name of Allah, the Beneficent, the Merciful.',
  'en.hilali': 'In the Name of Allah, the Most Beneficent, the Most Merciful.',
  'en.arberry': 'In the Name of God, the Merciful, the Compassionate.',
  'en.asad': 'In the name of God, The Most Gracious, The Dispenser of Grace.',
  'ur.jalandhry': 'اللہ کے نام سے جو بہت مہربان، نہایت رحم والا ہے',
  'ur.junagarhi': 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
  'ur.kanzuliman': 'اللہ کے نام سے شروع جو نہایت مہربان، بڑا رحم والا ہے',
  'ur.ahmedali': 'اللہ کے نام سے جو رحمن و رحیم ہے',
  'ar.quran': 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'fr.hamidullah': 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
  'fr.kazimirski': 'Au nom de Dieu clément et miséricordieux.',
  'es.cortes': 'En el nombre de Alá, el Compasivo, el Misericordioso.',
  'es.garcia': '¡En el nombre de Alá, el Compasivo, el Misericordioso!',
  'de.bubenheim': 'Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
  'de.khoury': 'Im Namen Gottes, des Erbarmers, des Barmherzigen.',
  'id.indonesian': 'Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.',
  'id.muntakhab': 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
  'tr.diyanet': 'Rahman ve Rahim olan Allah\'ın adıyla.',
  'tr.vakfi': 'Rahmân ve Rahîm Allah\'ın adıyla.',
  'fa.makarem': 'به نام خداوند بخشنده مهربان',
  'fa.ansarian': 'به نام خداوند بخشایشگر مهربان',
  'bn.bengali': 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।',
  'bn.hoque': 'আল্লাহর নামে শুরু করছি যিনি পরম করুণাময়, অতি দয়ালু।'
}

function updateTranslatorsForLanguage() {
  if (selectedLanguage.value && translationDatabase[selectedLanguage.value]) {
    availableTranslatorsForLanguage.value = translationDatabase[selectedLanguage.value]
  } else {
    availableTranslatorsForLanguage.value = []
  }
  selectedTranslators.value = [] // Reset translators when language changes
}

function updateTafseersForLanguage() {
  if (selectedTafseerLanguage.value && tafseerDatabase[selectedTafseerLanguage.value]) {
    availableTafseersForLanguage.value = tafseerDatabase[selectedTafseerLanguage.value]
  } else {
    availableTafseersForLanguage.value = []
  }
}

function toggleTranslator(translatorId: string) {
  const index = selectedTranslators.value.indexOf(translatorId)
  if (index > -1) {
    selectedTranslators.value.splice(index, 1)
  } else {
    selectedTranslators.value.push(translatorId)
  }
}

function toggleTafseer(tafseerId: string) {
  const index = selectedTafseers.value.indexOf(tafseerId)
  if (index > -1) {
    selectedTafseers.value.splice(index, 1)
  } else {
    selectedTafseers.value.push(tafseerId)
  }
}

function getTranslatorName(translatorId: string): string {
  for (const lang of Object.values(translationDatabase)) {
    const translator = lang.find(t => t.identifier === translatorId)
    if (translator) return translator.englishName
  }
  return translatorId
}

function getPreviewText(translatorId: string): string {
  return previewTexts[translatorId] || 'Preview text for this translation...'
}

function getPreviewDirection(translatorId: string): string {
  const rtlTranslations = ['ur.', 'ar.', 'fa.', 'bn.']
  const isRtl = rtlTranslations.some(prefix => translatorId.startsWith(prefix))
  return isRtl ? 'text-right' : 'text-left'
}

function applySelectedTranslations() {
  if (selectedTranslators.value.length > 0) {
    quranStore.setSelectedTranslations(selectedTranslators.value)
    showTranslationSelector.value = false
    
    // Show success feedback
    console.log('Translations applied:', selectedTranslators.value.map(id => getTranslatorName(id)).join(', '))
    
    // Reset form
    selectedLanguage.value = ''
    selectedTranslators.value = []
    availableTranslatorsForLanguage.value = []
    
    // Reload surah with new translations
    loadSurah()
  }
}

function applySelectedTafseers() {
  if (selectedTafseers.value.length > 0) {
    settingsStore.setSelectedTafseers(selectedTafseers.value)
    showTafseerSelector.value = false
    
    // Show success feedback
    console.log('Tafseers applied:', selectedTafseers.value)
    
    // Reset form
    selectedTafseerLanguage.value = ''
    availableTafseersForLanguage.value = []
    
    // Reload surah with new tafseers if needed
    if (showTafseer.value) {
      loadSurah()
    }
  }
}

watch(() => props.id, (newId) => {
  if (newId) {
    loadSurah()
  }
})

// Watch for toggle changes and sync with settings store
watch(showWordByWord, (newValue) => {
  if (newValue !== settingsStore.showWordByWord) {
    settingsStore.toggleWordByWord()
  }
})

watch(showTransliteration, (newValue) => {
  if (newValue !== settingsStore.showTransliteration) {
    settingsStore.toggleTransliteration()
  }
})

watch(showTranslation, (newValue) => {
  if (newValue !== settingsStore.showTranslation) {
    settingsStore.toggleTranslation()
  }
})

watch(showTafseer, (newValue) => {
  if (newValue !== settingsStore.showTafseer) {
    settingsStore.toggleTafseer()
  }
})

watch(selectedTafseers, (newValue) => {
  settingsStore.setSelectedTafseers(newValue)
}, { deep: true })

onMounted(() => {
  loadSurah()
  // Load saved preferences
  selectedTypography.value = settingsStore.arabicFont
})

// New helper functions for compact translation selector
function selectLanguageQuick(langCode: string) {
  selectedLanguage.value = langCode
  updateTranslatorsForLanguage()
}

function selectTafseerLanguageQuick(langCode: string) {
  selectedTafseerLanguage.value = langCode
  updateTafseersForLanguage()
}

function getLanguageName(langCode: string): string {
  const langMap: Record<string, string> = {
    'en': 'English',
    'ur': 'Urdu',
    'ar': 'Arabic', 
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'id': 'Indonesian',
    'tr': 'Turkish',
    'fa': 'Persian',
    'bn': 'Bengali'
  }
  return langMap[langCode] || langCode
}
</script>