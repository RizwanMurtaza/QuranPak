<template>
  <button
    @click="toggle"
    :class="[
      'relative inline-flex h-8 min-w-20 sm:h-9 sm:min-w-24 px-3 sm:px-4 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-1 border',
      modelValue 
        ? 'bg-gradient-to-r from-islamic-brown to-islamic-burgundy shadow-md border-islamic-burgundy' 
        : 'bg-calligraphy-200 dark:bg-calligraphy-700 border-calligraphy-300 dark:border-calligraphy-600'
    ]"
    role="switch"
    :aria-checked="modelValue"
  >
    <!-- Text inside switch -->
    <span 
      :class="[
        'text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap',
        modelValue ? 'text-islamic-cream' : 'text-calligraphy-700 dark:text-calligraphy-300'
      ]"
    >
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>