<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Customize your reading experience
      </p>
    </div>

    <div class="space-y-6">
      <!-- Theme Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-verse p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="themeOption in themeOptions"
                :key="themeOption.value"
                @click="setTheme(themeOption.value)"
                :class="[
                  'p-3 border-2 rounded-lg text-center transition-colors',
                  theme === themeOption.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                ]"
              >
                <div class="flex items-center justify-center mb-2">
                  <component :is="themeOption.icon" class="w-5 h-5" />
                </div>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ themeOption.label }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Typography Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-verse p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typography</h2>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Arabic Font Size
            </label>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-400">Small</span>
              <input
                type="range"
                min="0"
                max="3"
                :value="fontSizeIndex"
                @input="setArabicFontSize(($event.target as HTMLInputElement).value)"
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              >
              <span class="text-sm text-gray-600 dark:text-gray-400">Large</span>
            </div>
            <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p :class="['arabic-text text-center', arabicFontSizeClass]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Translation Font Size
            </label>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-400">Small</span>
              <input
                type="range"
                min="0"
                max="3"
                :value="translationFontSizeIndex"
                @input="setFontSize(($event.target as HTMLInputElement).value)"
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              >
              <span class="text-sm text-gray-600 dark:text-gray-400">Large</span>
            </div>
            <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p :class="['text-center', fontSizeClass]">
                In the name of Allah, the Entirely Merciful, the Especially Merciful.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reading Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-verse p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Preferences</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Translation
              </label>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Display English translation below Arabic text
              </p>
            </div>
            <ToggleSwitch v-model="showTranslation" />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Transliteration
              </label>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Show phonetic pronunciation guide
              </p>
            </div>
            <ToggleSwitch v-model="showTransliteration" />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Word-by-Word Display
              </label>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Enable interactive word-by-word mode
              </p>
            </div>
            <ToggleSwitch v-model="showWordByWord" />
          </div>
        </div>
      </div>

      <!-- Audio Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-verse p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audio</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-play Audio
              </label>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Automatically play verse audio when selected
              </p>
            </div>
            <ToggleSwitch v-model="autoPlayAudio" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Translation Language
            </label>
            <select
              v-model="preferredTranslation"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="id">Indonesian</option>
              <option value="tr">Turkish</option>
              <option value="bn">Bengali</option>
              <option value="fa">Persian</option>
              <option value="ru">Russian</option>
              <option value="ms">Malay</option>
              <option value="nl">Dutch</option>
              <option value="it">Italian</option>
            </select>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Selected Translations
              </label>
              <Button
                variant="outline"
                size="sm"
                @click="showTranslationSelector = true"
              >
                Manage
              </Button>
            </div>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <div
                v-for="translationId in selectedTranslations"
                :key="translationId"
                class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ getTranslationName(translationId) }}
                  </span>
                  <span v-if="selectedTranslations[0] === translationId" class="ml-2 text-xs text-primary-600 dark:text-primary-400">
                    (Primary)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="removeTranslation(translationId)"
                  :disabled="selectedTranslations.length === 1"
                >
                  <template #icon-left>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </template>
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Audio Reciter
              </label>
            </div>
            <select
              v-model="selectedReciter"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option
                v-for="reciter in availableReciters"
                :key="reciter.identifier"
                :value="reciter.identifier"
              >
                {{ reciter.englishName }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Reset Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-verse p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reset</h2>
        
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reset to Default Settings
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              This will restore all settings to their default values
            </p>
          </div>
          <Button variant="outline" @click="showResetModal = true">
            Reset Settings
          </Button>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <Modal v-model="showResetModal" title="Reset Settings" size="sm">
      <div class="text-center">
        <div class="text-yellow-600 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Reset All Settings?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          This will restore all settings to their default values. Your bookmarks and reading history will not be affected.
        </p>
      </div>

      <template #footer>
        <Button variant="outline" @click="showResetModal = false">
          Cancel
        </Button>
        <Button variant="primary" @click="resetSettings">
          Reset Settings
        </Button>
      </template>
    </Modal>

    <!-- Translation Selector Modal -->
    <Modal v-model="showTranslationSelector" title="Select Translations" size="lg">
      <TranslationSelector
        v-model="selectedTranslations"
        :available-translations="availableTranslations"
        @apply="applyTranslationSelection"
        @cancel="showTranslationSelector = false"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useQuranStore } from '@/stores/quran'
import { useQuranAPI } from '@/composables/useQuranAPI'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import TranslationSelector from '@/components/quran/TranslationSelector.vue'

const settingsStore = useSettingsStore()
const quranStore = useQuranStore()
const quranAPI = useQuranAPI()

const showResetModal = ref(false)
const showTranslationSelector = ref(false)

// Additional computed properties for Quran store integration
const selectedTranslations = computed({
  get: () => quranStore.selectedTranslations,
  set: (value) => quranStore.setSelectedTranslations(value)
})

const selectedReciter = computed({
  get: () => quranStore.selectedReciter,
  set: (value) => quranStore.setSelectedReciter(value)
})

const availableTranslations = computed(() => quranStore.availableTranslations)
const availableReciters = computed(() => Object.values(quranAPI.audioReciters.value))

const themeOptions = [
  {
    value: 'light',
    label: 'Light',
    icon: 'SunIcon'
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: 'MoonIcon'
  },
  {
    value: 'auto',
    label: 'Auto',
    icon: 'ComputerDesktopIcon'
  }
]

const fontSizes = ['small', 'medium', 'large', 'extra-large']

// Computed properties
const theme = computed({
  get: () => settingsStore.theme,
  set: (value) => settingsStore.setTheme(value)
})

const fontSize = computed(() => settingsStore.fontSize)
const arabicFontSize = computed(() => settingsStore.arabicFontSize)
const fontSizeClass = computed(() => settingsStore.fontSizeClass)
const arabicFontSizeClass = computed(() => settingsStore.arabicFontSizeClass)

const fontSizeIndex = computed(() => fontSizes.indexOf(arabicFontSize.value))
const translationFontSizeIndex = computed(() => fontSizes.indexOf(fontSize.value))

const showTranslation = computed({
  get: () => settingsStore.showTranslation,
  set: () => settingsStore.toggleTranslation()
})

const showTransliteration = computed({
  get: () => settingsStore.showTransliteration,
  set: () => settingsStore.toggleTransliteration()
})

const showWordByWord = computed({
  get: () => settingsStore.showWordByWord,
  set: () => settingsStore.toggleWordByWord()
})

const autoPlayAudio = computed({
  get: () => settingsStore.autoPlayAudio,
  set: () => settingsStore.toggleAutoPlayAudio()
})

const preferredTranslation = computed({
  get: () => settingsStore.preferredTranslation,
  set: (value) => settingsStore.setPreferredTranslation(value)
})

// Methods
function setTheme(newTheme: string) {
  settingsStore.setTheme(newTheme as any)
}

function setFontSize(index: string) {
  const size = fontSizes[parseInt(index)] as any
  settingsStore.setFontSize(size)
}

function setArabicFontSize(index: string) {
  const size = fontSizes[parseInt(index)] as any
  settingsStore.setArabicFontSize(size)
}

function resetSettings() {
  settingsStore.resetToDefaults()
  showResetModal.value = false
}

function getTranslationName(translationId: string): string {
  const translation = quranAPI.getTranslationInfo(translationId)
  return translation?.englishName || translationId
}

function removeTranslation(translationId: string) {
  const current = [...selectedTranslations.value]
  const index = current.indexOf(translationId)
  if (index > -1 && current.length > 1) {
    current.splice(index, 1)
    selectedTranslations.value = current
  }
}

function applyTranslationSelection(translations: string[]) {
  selectedTranslations.value = translations
  showTranslationSelector.value = false
}

// Icon components (simplified)
const SunIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
  `
}

const MoonIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
  `
}

const ComputerDesktopIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    </svg>
  `
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #22c55e;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #22c55e;
  cursor: pointer;
  border: none;
}
</style>