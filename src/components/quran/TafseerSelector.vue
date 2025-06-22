<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-calligraphy-900 dark:text-calligraphy-100">
        Select Tafseers (Commentaries)
      </h3>
      <span class="text-xs text-calligraphy-700 dark:text-calligraphy-300 bg-calligraphy-100 dark:bg-calligraphy-900/30 px-2 py-1 rounded-full">
        {{ selectedTafseers.length }} selected
      </span>
    </div>

    <!-- Language Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8 overflow-x-auto">
        <button
          v-for="(tafseers, language) in groupedTafseers"
          :key="language"
          @click="activeLanguage = language"
          :class="[
            'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeLanguage === language
              ? 'border-islamic-brown text-islamic-brown dark:text-islamic-gold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          {{ getLanguageName(language) }}
          <span class="ml-2 text-xs text-gray-400">({{ tafseers.length }})</span>
        </button>
      </nav>
    </div>

    <!-- Tafseer Options -->
    <div class="space-y-2 max-h-64 overflow-y-auto">
      <div
        v-for="tafseer in groupedTafseers[activeLanguage] || []"
        :key="tafseer.identifier"
        class="flex items-center space-x-3 p-3 rounded-lg hover:bg-calligraphy-50 dark:hover:bg-calligraphy-900/20 transition-colors border border-transparent"
        :class="{ 'bg-calligraphy-50/50 dark:bg-calligraphy-900/10 border-calligraphy-200 dark:border-calligraphy-800': selectedTafseers.includes(tafseer.identifier) }"
      >
        <input
          :id="tafseer.identifier"
          type="checkbox"
          :value="tafseer.identifier"
          :checked="selectedTafseers.includes(tafseer.identifier)"
          @change="toggleTafseer(tafseer.identifier)"
          class="h-4 w-4 text-islamic-brown focus:ring-islamic-brown border-calligraphy-300 rounded"
        >
        <label 
          :for="tafseer.identifier" 
          class="flex-1 cursor-pointer"
          :class="tafseer.direction === 'rtl' ? 'text-right' : 'text-left'"
        >
          <div class="font-medium text-calligraphy-900 dark:text-calligraphy-100">
            {{ tafseer.englishName }}
          </div>
          <div class="text-sm text-calligraphy-700 dark:text-calligraphy-300" :class="tafseer.direction === 'rtl' ? 'font-arabic' : ''">
            {{ tafseer.name }}
          </div>
          <div class="text-xs text-calligraphy-600 dark:text-calligraphy-400 mt-1">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-islamic-brown/10 text-islamic-brown dark:bg-islamic-gold/10 dark:text-islamic-gold">
              Commentary
            </span>
          </div>
        </label>
        
        <!-- Primary Tafseer Badge -->
        <div v-if="selectedTafseers[0] === tafseer.identifier" class="flex-shrink-0">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-islamic-brown text-white dark:bg-islamic-gold dark:text-islamic-charcoal">
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
          @click="selectPopularTafseers"
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
          :disabled="selectedTafseers.length === 0"
        >
          Apply
        </Button>
      </div>
    </div>

    <!-- Compact Preview Section -->
    <div v-if="selectedTafseers.length > 0" class="mt-4 p-3 bg-gradient-to-r from-calligraphy-50 to-cream-50 dark:from-calligraphy-900/20 dark:to-cream-900/20 rounded-md border border-calligraphy-200 dark:border-calligraphy-800">
      <h4 class="font-medium text-sm text-calligraphy-900 dark:text-calligraphy-100 mb-2">Preview</h4>
      <div class="space-y-2">
        <div
          v-for="tafseerId in selectedTafseers.slice(0, 2)"
          :key="tafseerId"
          class="text-xs"
        >
          <div class="font-medium text-calligraphy-800 dark:text-calligraphy-200 mb-0.5">
            {{ getTafseerInfo(tafseerId)?.englishName }}
          </div>
          <div 
            class="text-calligraphy-700 dark:text-calligraphy-300 italic line-clamp-1"
            :class="getTafseerDirection(tafseerId) === 'rtl' ? 'text-right font-arabic' : 'text-left'"
          >
            {{ getSampleText(tafseerId) }}
          </div>
        </div>
        
        <div v-if="selectedTafseers.length > 2" class="text-xs text-calligraphy-600 dark:text-calligraphy-400">
          +{{ selectedTafseers.length - 2 }} more selected
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuranAPI } from '@/composables/useQuranAPI'
import type { Edition } from '@/types/api'
import { TAFSEER_GROUPS } from '@/types/api'
import Button from '@/components/ui/Button.vue'

interface Props {
  modelValue: string[]
  availableTafseers?: Edition[]
}

interface Emits {
  'update:modelValue': [value: string[]]
  'apply': [tafseers: string[]]
  'cancel': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const quranAPI = useQuranAPI()
const activeLanguage = ref('english')
const selectedTafseers = ref<string[]>([...props.modelValue])

// Sample tafseer texts for preview
const sampleTexts: Record<string, string> = {
  'ar.muyassar': 'تفسير ميسر لآيات القرآن الكريم بأسلوب واضح ومفهوم',
  'ar.jalalayn': 'تفسير الجلالين المختصر والمفيد للقرآن الكريم',
  'ar.ibnkatheer': 'تفسير ابن كثير المشهور والمعتمد عند أهل السنة',
  'en.ibnkathir': 'Ibn Kathir\'s renowned commentary providing detailed explanations of Quranic verses',
  'en.maarifulquran': 'Comprehensive commentary by Mufti Muhammad Shafi with detailed explanations',
  'en.tafheem': 'Sayyid Maududi\'s modern commentary focusing on contemporary understanding',
  'ur.jalandhri': 'تفسیر جالندھری - اردو زبان میں قرآن کریم کی مفصل تفسیر',
  'ur.kanzulimaan': 'کنز الایمان - احمد رضا خان بریلوی کی مشہور تفسیر',
  'fa.makarem': 'تفسیر نمونه - تفسیری جامع و معاصر به زبان فارسی'
}

const groupedTafseers = computed(() => {
  const tafseers = props.availableTafseers || Object.values(quranAPI.popularTafseers.value).filter(Boolean)
  const groups: Record<string, Edition[]> = {}

  // Group by language
  tafseers.forEach(tafseer => {
    if (tafseer && tafseer.language) {
      const lang = getLanguageKey(tafseer.language)
      if (!groups[lang]) {
        groups[lang] = []
      }
      groups[lang].push(tafseer)
    }
  })

  // Sort tafseers within each group
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

function toggleTafseer(tafseerId: string): void {
  const index = selectedTafseers.value.indexOf(tafseerId)
  
  if (index > -1) {
    selectedTafseers.value.splice(index, 1)
  } else {
    selectedTafseers.value.push(tafseerId)
  }
}

function selectPopularTafseers(): void {
  const popular = ['en.ibnkathir', 'ar.muyassar', 'ur.jalandhri']
  selectedTafseers.value = popular.filter(id => 
    (props.availableTafseers || Object.values(quranAPI.popularTafseers.value).filter(Boolean))
      .some(t => t && t.identifier === id)
  )
}

function clearSelections(): void {
  selectedTafseers.value = []
}

function applySelections(): void {
  emit('update:modelValue', [...selectedTafseers.value])
  emit('apply', [...selectedTafseers.value])
}

function getTafseerInfo(identifier: string): Edition | undefined {
  return quranAPI.getTafseerInfo(identifier)
}

function getTafseerDirection(identifier: string): 'ltr' | 'rtl' {
  return quranAPI.getTafseerDirection(identifier)
}

function getSampleText(tafseerId: string): string {
  return sampleTexts[tafseerId] || 'Sample tafseer commentary text...'
}

onMounted(() => {
  // Set default active language based on selected tafseers
  if (selectedTafseers.value.length > 0) {
    const firstTafseer = getTafseerInfo(selectedTafseers.value[0])
    if (firstTafseer) {
      activeLanguage.value = getLanguageKey(firstTafseer.language)
    }
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', 'Times New Roman', serif;
  font-weight: 500;
}
</style>