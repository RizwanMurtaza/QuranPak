<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Floating Surah Navigation -->
    <SurahNavigation />
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
      <!-- Compact Islamic Surah Header -->
      <div class="surah-header relative overflow-hidden py-4 px-4 mb-4">
        <div class="absolute inset-0 islamic-pattern opacity-20"></div>
        
        <div class="relative z-10 flex items-center justify-between">
          <!-- Left: Surah Number and Names -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-xl shadow-lg">
              <span class="text-lg font-bold text-white">{{ currentSurah.number }}</span>
            </div>
            
            <div>
              <h1 class="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                {{ currentSurah.englishName }}
                <span class="text-lg font-arabic text-emerald-700 dark:text-emerald-300 ml-2">{{ currentSurah.name }}</span>
              </h1>
              <p class="text-sm text-emerald-700 dark:text-emerald-300">
                {{ currentSurah.englishNameTranslation }}
              </p>
            </div>
          </div>
          
          <!-- Right: Surah Info -->
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-1 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-full shadow-sm">
              <div class="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
              <span class="font-medium text-emerald-800 dark:text-emerald-200">{{ currentSurah.numberOfAyahs }} Ayahs</span>
            </div>
            <div class="flex items-center space-x-1 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-full shadow-sm">
              <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              <span class="font-medium capitalize text-emerald-800 dark:text-emerald-200">{{ currentSurah.revelationType }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Elegant Islamic Controls -->
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg border border-emerald-200 dark:border-gray-600 p-6 mb-8">
        <div class="flex flex-wrap items-center justify-between gap-6">
          <!-- Display Options -->
          <div class="flex items-center space-x-6">
            <label class="flex items-center space-x-3 text-sm font-medium cursor-pointer group">
              <input
                v-model="showWordByWord"
                type="checkbox"
                class="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 transition-all"
              >
              <span class="text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors">
                Word-by-Word
              </span>
            </label>
            
            <label class="flex items-center space-x-3 text-sm font-medium cursor-pointer group">
              <input
                v-model="showTransliteration"
                type="checkbox"
                class="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 transition-all"
              >
              <span class="text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors">
                Transliteration
              </span>
            </label>
            
            <label class="flex items-center space-x-3 text-sm font-medium cursor-pointer group">
              <input
                v-model="showTranslation"
                type="checkbox"
                class="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 transition-all"
              >
              <span class="text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors">
                Translation
              </span>
            </label>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <Button
              @click="showTranslationSelector = true"
              variant="outline"
              size="sm"
              class="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
              </svg>
              Translations ({{ selectedTranslations.length }})
            </Button>
            
            <Button
              @click="showReciterSelector = true"
              variant="outline"
              size="sm"
              class="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142m-5.758-2.828l-2.828-2.828-2.828 2.828"></path>
              </svg>
              {{ getVerseReciterName() }}
            </Button>
            
            <Button
              @click="showTypographySelector = true"
              variant="outline"
              size="sm"
              class="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Font
            </Button>
            
            <AudioPlayer
              v-if="currentSurahVerses.length > 0"
              :tracks="audioTracks"
              :current-reciter="selectedReciter"
              :available-reciters="availableReciters"
              @reciter-change="handleReciterChange"
              @track-changed="handleTrackChanged"
            />
          </div>
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
          :show-metadata="true"
          :is-bookmarked="isBookmarked(verse.surahNumber, verse.verseNumber)"
          :surah-name="currentSurah.englishName"
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

    <!-- Simple Translation Selector Modal -->
    <Teleport to="body">
      <Modal 
        v-model="showTranslationSelector" 
        title="Select Translation"
        size="sm"
        @close="showTranslationSelector = false"
      >
        <div class="space-y-4">
          <!-- Step 1: Select Language -->
          <div>
            <label class="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Choose Language
            </label>
            <select 
              v-model="selectedLanguage"
              @change="updateTranslatorsForLanguage"
              class="w-full px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded-lg bg-white dark:bg-gray-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Select Language --</option>
              <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
                {{ lang.name }} {{ lang.native }}
              </option>
            </select>
          </div>
          
          <!-- Step 2: Select Translators (Multiple) -->
          <div v-if="selectedLanguage">
            <label class="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Choose Translators ({{ selectedTranslators.length }} selected)
            </label>
            <div class="space-y-2 max-h-48 overflow-y-auto border border-emerald-200 dark:border-emerald-700 rounded-lg p-2">
              <div 
                v-for="translator in availableTranslatorsForLanguage" 
                :key="translator.identifier"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors"
                :class="{ 'bg-emerald-50 dark:bg-emerald-900/20': selectedTranslators.includes(translator.identifier) }"
                @click="toggleTranslator(translator.identifier)"
              >
                <input
                  :id="translator.identifier"
                  type="checkbox"
                  :value="translator.identifier"
                  :checked="selectedTranslators.includes(translator.identifier)"
                  @click.stop
                  @change="toggleTranslator(translator.identifier)"
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
                >
                <label :for="translator.identifier" class="flex-1 cursor-pointer">
                  <div class="font-medium text-emerald-900 dark:text-emerald-100">
                    {{ translator.englishName }}
                  </div>
                  <div v-if="translator.author" class="text-xs text-emerald-700 dark:text-emerald-300">
                    {{ translator.author }}
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Preview -->
          <div v-if="selectedTranslators.length > 0" class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
            <div class="text-xs font-medium text-emerald-800 dark:text-emerald-200 mb-2">
              Preview ({{ selectedTranslators.length }} translation{{ selectedTranslators.length > 1 ? 's' : '' }})
            </div>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <div v-for="translatorId in selectedTranslators.slice(0, 3)" :key="translatorId" class="border-b border-emerald-200 dark:border-emerald-700 pb-1 last:border-b-0">
                <div class="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-0.5">
                  {{ getTranslatorName(translatorId) }}
                </div>
                <div class="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed" :class="getPreviewDirection(translatorId)">
                  {{ getPreviewText(translatorId) }}
                </div>
              </div>
              <div v-if="selectedTranslators.length > 3" class="text-xs text-emerald-600 dark:text-emerald-400 italic">
                +{{ selectedTranslators.length - 3 }} more translations selected
              </div>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              @click="showTranslationSelector = false"
              class="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              @click="applySelectedTranslations"
              :disabled="selectedTranslators.length === 0"
              class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500"
            >
              Apply ({{ selectedTranslators.length }})
            </Button>
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
              class="w-full px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded-lg bg-white dark:bg-gray-800 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
          </div>
          
          <div class="space-y-2 max-h-80 overflow-y-auto">
            <div 
              v-for="reciter in filteredReciters" 
              :key="reciter.identifier"
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors border border-transparent"
              :class="{ 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700': selectedVerseReciter === reciter.identifier }"
              @click="selectedVerseReciter = reciter.identifier"
            >
              <input
                :id="reciter.identifier"
                type="radio"
                :value="reciter.identifier"
                :checked="selectedVerseReciter === reciter.identifier"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300"
              >
              <label :for="reciter.identifier" class="flex-1 cursor-pointer">
                <div class="font-medium text-emerald-900 dark:text-emerald-100">
                  {{ reciter.englishName }}
                </div>
                <div class="text-sm text-emerald-700 dark:text-emerald-300">
                  {{ reciter.name }}
                </div>
                <div v-if="reciter.style" class="text-xs text-emerald-600 dark:text-emerald-400">
                  {{ reciter.style }}
                </div>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 pt-4 border-t border-emerald-200 dark:border-emerald-800">
            <Button 
              variant="outline" 
              @click="showReciterSelector = false"
              class="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              @click="applyReciterSelection"
              class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
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
              class="p-4 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors border border-emerald-200 dark:border-emerald-800"
              :class="{ 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600': selectedTypography === font.id }"
              @click="selectTypography(font.id)"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <input
                    :id="font.id"
                    type="radio"
                    :value="font.id"
                    :checked="selectedTypography === font.id"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300"
                  >
                  <label :for="font.id" class="font-medium text-emerald-900 dark:text-emerald-100 cursor-pointer">
                    {{ font.name }}
                  </label>
                </div>
              </div>
              <div 
                class="text-2xl text-center py-3 text-emerald-800 dark:text-emerald-200 leading-relaxed"
                :style="{ fontFamily: font.family }"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div v-if="font.description" class="text-xs text-center text-emerald-600 dark:text-emerald-400 mt-1">
                {{ font.description }}
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 pt-4 border-t border-emerald-200 dark:border-emerald-800">
            <Button 
              variant="outline" 
              @click="showTypographySelector = false"
              class="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              @click="applyTypography"
              class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuranStore } from '@/stores/quran'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import type { Verse, Word } from '@/stores/quran'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import VerseCard from '@/components/quran/VerseCard.vue'
import TranslationSelector from '@/components/quran/TranslationSelector.vue'
import AudioPlayer from '@/components/quran/AudioPlayer.vue'
import SurahNavigation from '@/components/layout/SurahNavigation.vue'
import { getGlobalAyahNumber } from '@/utils/quranUtils'

const route = useRoute()
const quranStore = useQuranStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const props = defineProps<{
  id: number
}>()

// State
const showWordByWord = ref(false)
const showTransliteration = ref(false)
const showTranslation = ref(true)
const showTranslationSelector = ref(false)
const selectedLanguage = ref('')
const selectedTranslators = ref<string[]>([])
const availableTranslatorsForLanguage = ref<any[]>([])
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
const availableReciters = computed(() => {
  // Actual working reciter identifiers from Al-Quran Cloud API
  return [
    { identifier: 'ar.alafasy', englishName: 'Mishary Alafasy', name: 'مشاري العفاسي', style: 'Hafs' },
    { identifier: 'ar.abdulbasitmurattal', englishName: 'Abdul Basit (Murattal)', name: 'عبد الباسط المرتل', style: 'Murattal' },
    { identifier: 'ar.abdullahbasfar', englishName: 'Abdullah Basfar', name: 'عبد الله بصفر', style: 'Hafs' },
    { identifier: 'ar.abdurrahmaansudais', englishName: 'Abdur-Rahman as-Sudais', name: 'عبد الرحمن السديس', style: 'Hafs' },
    { identifier: 'ar.abdulsamad', englishName: 'Abdul Samad', name: 'عبدالباسط عبدالصمد', style: 'Hafs' },
    { identifier: 'ar.shaatree', englishName: 'Abu Bakr Ash-Shaatree', name: 'أبو بكر الشاطري', style: 'Hafs' },
    { identifier: 'ar.ahmedajamy', englishName: 'Ahmed ibn Ali al-Ajamy', name: 'أحمد بن علي العجمي', style: 'Hafs' },
    { identifier: 'ar.hanirifai', englishName: 'Hani Rifai', name: 'هاني الرفاعي', style: 'Hafs' },
    { identifier: 'ar.husary', englishName: 'Mahmoud Khalil Al-Hussary', name: 'محمود خليل الحصري', style: 'Hafs' },
    { identifier: 'ar.husarymujawwad', englishName: 'Al-Hussary (Mujawwad)', name: 'محمود خليل الحصري (المجود)', style: 'Mujawwad' },
    { identifier: 'ar.hudhaify', englishName: 'Ali Hudhaify', name: 'علي بن عبدالرحمن الحذيفي', style: 'Hafs' },
    { identifier: 'ar.ibrahimakhbar', englishName: 'Ibrahim Akhdar', name: 'إبراهيم الأخضر', style: 'Hafs' },
    { identifier: 'ar.mahermuaiqly', englishName: 'Maher Al Muaiqly', name: 'ماهر المعيقلي', style: 'Hafs' },
    { identifier: 'ar.minshawi', englishName: 'Mohamed Siddiq El-Minshawi', name: 'محمد صديق المنشاوي', style: 'Hafs' },
    { identifier: 'ar.minshawimujawwad', englishName: 'Minshawi (Mujawwad)', name: 'محمد صديق المنشاوي (المجود)', style: 'Mujawwad' },
    { identifier: 'ar.muhammadayyoub', englishName: 'Muhammad Ayyoub', name: 'محمد أيوب', style: 'Hafs' },
    { identifier: 'ar.muhammadjibreel', englishName: 'Muhammad Jibreel', name: 'محمد جبريل', style: 'Hafs' },
    { identifier: 'ar.saoodshuraym', englishName: 'Saood Ash-Shuraym', name: 'سعود الشريم', style: 'Hafs' },
    { identifier: 'ar.parhizgar', englishName: 'Parhizgar', name: 'شهریار پرهیزگار', style: 'Hafs' },
    { identifier: 'ar.aymanswoaid', englishName: 'Ayman Sowaid', name: 'أيمن سويد', style: 'Hafs' }
  ]
})

const filteredReciters = computed(() => {
  if (!reciterSearchQuery.value.trim()) {
    return availableReciters.value
  }
  
  const query = reciterSearchQuery.value.toLowerCase()
  return availableReciters.value.filter(reciter => 
    reciter.englishName.toLowerCase().includes(query) ||
    reciter.name.includes(query) ||
    reciter.style.toLowerCase().includes(query)
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
    { identifier: 'fr.hamidullah', englishName: 'Hamidullah', author: 'Muhammad Hamidullah' },
    { identifier: 'fr.kazimirski', englishName: 'Kazimirski', author: 'A. de Biberstein Kazimirski' }
  ],
  es: [
    { identifier: 'es.cortes', englishName: 'Cortés', author: 'Julio Cortés' },
    { identifier: 'es.garcia', englishName: 'García', author: 'Raul González Bórnez' }
  ],
  de: [
    { identifier: 'de.bubenheim', englishName: 'Bubenheim & Elyas', author: 'Frank Bubenheim and Nadeem Elyas' },
    { identifier: 'de.khoury', englishName: 'Khoury', author: 'Adel Theodor Khoury' }
  ],
  id: [
    { identifier: 'id.indonesian', englishName: 'Indonesian Ministry', author: 'Indonesian Ministry of Religious Affairs' },
    { identifier: 'id.muntakhab', englishName: 'Muntakhab', author: 'Muntakhab' }
  ],
  tr: [
    { identifier: 'tr.diyanet', englishName: 'Diyanet', author: 'Diyanet İşleri Başkanlığı' },
    { identifier: 'tr.vakfi', englishName: 'Vakfi', author: 'Diyanet Vakfı' }
  ],
  fa: [
    { identifier: 'fa.makarem', englishName: 'Makarem Shirazi', author: 'Naser Makarem Shirazi' },
    { identifier: 'fa.ansarian', englishName: 'Ansarian', author: 'Hussain Ansarian' }
  ],
  bn: [
    { identifier: 'bn.bengali', englishName: 'Bengali Translation', author: 'Muhiuddin Khan' },
    { identifier: 'bn.hoque', englishName: 'Hoque', author: 'Zohurul Hoque' }
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

function toggleTranslator(translatorId: string) {
  const index = selectedTranslators.value.indexOf(translatorId)
  if (index > -1) {
    selectedTranslators.value.splice(index, 1)
  } else {
    selectedTranslators.value.push(translatorId)
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

watch(() => props.id, (newId) => {
  if (newId) {
    loadSurah()
  }
})

onMounted(() => {
  loadSurah()
  // Load saved Arabic font preference
  selectedTypography.value = settingsStore.arabicFont
})
</script>