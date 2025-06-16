<template>
  <div
    class="word-container inline-flex flex-col items-center cursor-pointer mx-1 my-2 min-w-0"
    @click="handleClick"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <!-- Arabic Word -->
    <div 
      class="arabic-word text-center px-1.5 py-1 rounded-md transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-lg font-medium"
      :class="{ 
        'bg-emerald-100 dark:bg-emerald-900/40': isSelected,
        'text-emerald-800 dark:text-emerald-200': isHighlighted
      }"
    >
      {{ word.arabic }}
    </div>

    <!-- Tooltip -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showTooltip && (showTransliteration || showTranslation || word.root || word.grammar)"
        class="tooltip absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs"
      >
        <div class="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
          <!-- Transliteration -->
          <div v-if="showTransliteration && word.transliteration" class="font-medium mb-1">
            {{ word.transliteration }}
          </div>
          
          <!-- Translation -->
          <div v-if="showTranslation && word.translation" class="text-gray-200 dark:text-gray-300 mb-1">
            {{ word.translation }}
          </div>
          
          <!-- Root -->
          <div v-if="word.root" class="text-gray-300 dark:text-gray-400 text-xs">
            Root: {{ word.root }}
          </div>
          
          <!-- Grammar -->
          <div v-if="word.grammar" class="text-gray-300 dark:text-gray-400 text-xs">
            {{ word.grammar }}
          </div>
        </div>
        
        <!-- Tooltip Arrow -->
        <div class="absolute top-full left-1/2 transform -translate-x-1/2">
          <div class="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>
    </Transition>

    <!-- Word Meanings Below Arabic -->
    <div class="word-meanings text-center mt-1.5 space-y-0.5 min-w-0 max-w-20">
      <!-- Transliteration -->
      <div v-if="showTransliteration && word.transliteration" 
           class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold leading-tight break-words bg-emerald-50 dark:bg-emerald-900/20 px-1 py-0.5 rounded">
        {{ word.transliteration }}
      </div>
      
      <!-- Translation -->
      <div v-if="showTranslation && word.translation" 
           class="text-xs text-gray-600 dark:text-gray-400 leading-tight break-words font-medium">
        {{ word.translation }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Word } from '@/stores/quran'

interface Props {
  word: Word
  showTransliteration?: boolean
  showTranslation?: boolean
  showInlineTranslations?: boolean
  isSelected?: boolean
  isHighlighted?: boolean
}

interface Emits {
  wordClick: [word: Word]
}

const props = withDefaults(defineProps<Props>(), {
  showTransliteration: false,
  showTranslation: false,
  showInlineTranslations: false,
  isSelected: false,
  isHighlighted: false
})

const emit = defineEmits<Emits>()

// State
const showTooltip = ref(false)

// Methods
const handleClick = () => {
  emit('wordClick', props.word)
}
</script>

<style scoped>
.word-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: top;
  margin: 0.125rem 0.25rem;
  min-width: 0;
  max-width: 100px;
  text-align: center;
}

.arabic-word {
  font-family: 'Amiri', 'Scheherazade New', 'Times New Roman', serif;
  font-size: inherit;
  line-height: inherit;
  user-select: text;
}

.tooltip {
  pointer-events: none;
}

.word-meanings {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.2;
  min-width: 0;
  max-width: 80px;
  word-break: break-word;
  overflow-wrap: break-word;
  gap: 0.125rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .tooltip {
    max-width: 200px;
  }
  
  .arabic-word {
    padding: 0.25rem 0.5rem;
  }
}

/* Enhanced hover effects */
.word-container:hover .arabic-word {
  transform: translateY(-1px);
}

/* Selection highlighting */
.arabic-word.selected {
  background: linear-gradient(135deg, theme('colors.primary.100'), theme('colors.primary.200'));
}

.dark .arabic-word.selected {
  background: linear-gradient(135deg, theme('colors.primary.900'), theme('colors.primary.800'));
}

/* Animation for smooth transitions */
.word-container {
  transition: all 0.2s ease-in-out;
}

/* Focus styles for accessibility */
.word-container:focus-within .arabic-word {
  @apply ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800;
}

/* Print styles */
@media print {
  .tooltip {
    display: none !important;
  }
  
  .word-container {
    break-inside: avoid;
  }
}
</style>