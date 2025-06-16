<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-emerald-900 dark:text-emerald-100">
        Select Translations
      </h3>
      <span class="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
        {{ selectedTranslations.length }} selected
      </span>
    </div>

    <!-- Language Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8 overflow-x-auto">
        <button
          v-for="(translations, language) in groupedTranslations"
          :key="language"
          @click="activeLanguage = language"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeLanguage === language
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ getLanguageName(language) }}
          <span class="ml-2 text-xs text-gray-400">({{ translations.length }})</span>
        </button>
      </nav>
    </div>

    <!-- Translation Options -->
    <div class="space-y-2 max-h-64 overflow-y-auto">
      <div
        v-for="translation in groupedTranslations[activeLanguage] || []"
        :key="translation.identifier"
        class="flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-transparent"
        :class="{ 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800': selectedTranslations.includes(translation.identifier) }"
      >
        <input
          :id="translation.identifier"
          type="checkbox"
          :value="translation.identifier"
          :checked="selectedTranslations.includes(translation.identifier)"
          @change="toggleTranslation(translation.identifier)"
          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
        >
        <label 
          :for="translation.identifier" 
          class="flex-1 cursor-pointer"
          :class="translation.direction === 'rtl' ? 'text-right' : 'text-left'"
        >
          <div class="font-medium text-emerald-900 dark:text-emerald-100">
            {{ translation.englishName }}
          </div>
          <div class="text-sm text-emerald-700 dark:text-emerald-300">
            {{ translation.name }}
          </div>
        </label>
        
        <!-- Primary Translation Badge -->
        <div v-if="selectedTranslations[0] === translation.identifier" class="flex-shrink-0">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            Primary
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          @click="selectPopularTranslations"
        >
          Popular
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="clearSelections"
        >
          Clear
        </Button>
      </div>
      
      <div class="flex space-x-2">
        <Button
          variant="outline"
          @click="$emit('cancel')"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          @click="applySelections"
          :disabled="selectedTranslations.length === 0"
        >
          Apply
        </Button>
      </div>
    </div>

    <!-- Compact Preview Section -->
    <div v-if="selectedTranslations.length > 0" class="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-md border border-emerald-200 dark:border-emerald-800">
      <h4 class="font-medium text-sm text-emerald-900 dark:text-emerald-100 mb-2">Preview</h4>
      <div class="space-y-2">
        <div
          v-for="translationId in selectedTranslations.slice(0, 2)"
          :key="translationId"
          class="text-xs"
        >
          <div class="font-medium text-emerald-800 dark:text-emerald-200 mb-0.5">
            {{ getTranslationInfo(translationId)?.englishName }}
          </div>
          <div 
            class="text-emerald-700 dark:text-emerald-300 italic line-clamp-1"
            :class="getTranslationDirection(translationId) === 'rtl' ? 'text-right' : 'text-left'"
          >
            {{ getSampleText(translationId) }}
          </div>
        </div>
        
        <div v-if="selectedTranslations.length > 2" class="text-xs text-emerald-600 dark:text-emerald-400">
          +{{ selectedTranslations.length - 2 }} more selected
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuranAPI } from '@/composables/useQuranAPI'
import type { Edition } from '@/types/api'
import { TRANSLATION_GROUPS } from '@/types/api'
import Button from '@/components/ui/Button.vue'

interface Props {
  modelValue: string[]
  availableTranslations?: Edition[]
}

interface Emits {
  'update:modelValue': [value: string[]]
  'apply': [translations: string[]]
  'cancel': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const quranAPI = useQuranAPI()
const activeLanguage = ref('english')
const selectedTranslations = ref<string[]>([...props.modelValue])

// Sample verses for preview
const sampleTexts: Record<string, string> = {
  'en.sahih': 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
  'en.pickthall': 'In the name of Allah, the Beneficent, the Merciful.',
  'en.yusufali': 'In the name of Allah, Most Gracious, Most Merciful.',
  'ur.jalandhry': 'اللہ کے نام سے جو بہت مہربان، نہایت رحم والا ہے',
  'fr.hamidullah': 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
  'es.cortes': 'En el nombre de Alá, el Compasivo, el Misericordioso.',
  'ar.quran': 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
}

const groupedTranslations = computed(() => {
  const translations = props.availableTranslations || Object.values(quranAPI.popularTranslations.value)
  const groups: Record<string, Edition[]> = {}

  // Group by language
  translations.forEach(translation => {
    const lang = getLanguageKey(translation.language)
    if (!groups[lang]) {
      groups[lang] = []
    }
    groups[lang].push(translation)
  })

  // Sort translations within each group
  Object.keys(groups).forEach(lang => {
    groups[lang].sort((a, b) => a.englishName.localeCompare(b.englishName))
  })

  return groups
})

function getLanguageKey(languageCode: string): string {
  const languageMap: Record<string, string> = {
    en: 'english',
    ur: 'urdu',
    ar: 'arabic',
    fr: 'french',
    es: 'spanish',
    de: 'german',
    id: 'indonesian',
    tr: 'turkish',
    bn: 'bengali',
    fa: 'persian',
    ru: 'russian',
    ms: 'malay',
    nl: 'dutch',
    it: 'italian'
  }
  return languageMap[languageCode] || languageCode
}

function getLanguageName(key: string): string {
  return quranAPI.getLanguageName(key.slice(0, 2))
}

function toggleTranslation(translationId: string): void {
  const index = selectedTranslations.value.indexOf(translationId)
  
  if (index > -1) {
    selectedTranslations.value.splice(index, 1)
  } else {
    selectedTranslations.value.push(translationId)
  }
}

function selectPopularTranslations(): void {
  const popular = ['en.sahih', 'ur.jalandhry', 'fr.hamidullah']
  selectedTranslations.value = popular.filter(id => 
    (props.availableTranslations || Object.values(quranAPI.popularTranslations.value))
      .some(t => t.identifier === id)
  )
}

function clearSelections(): void {
  selectedTranslations.value = []
}

function applySelections(): void {
  emit('update:modelValue', [...selectedTranslations.value])
  emit('apply', [...selectedTranslations.value])
}

function getTranslationInfo(identifier: string): Edition | undefined {
  return quranAPI.getTranslationInfo(identifier)
}

function getTranslationDirection(identifier: string): 'ltr' | 'rtl' {
  return quranAPI.getTranslationDirection(identifier)
}

function getSampleText(translationId: string): string {
  return sampleTexts[translationId] || 'Sample translation text...'
}

onMounted(() => {
  // Set default active language based on selected translations
  if (selectedTranslations.value.length > 0) {
    const firstTranslation = getTranslationInfo(selectedTranslations.value[0])
    if (firstTranslation) {
      activeLanguage.value = getLanguageKey(firstTranslation.language)
    }
  }
})
</script>