<template>
  <button
    @click="toggle"
    :class="[
      'relative inline-flex h-8 min-w-20 sm:h-9 sm:min-w-24 px-3 sm:px-4 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1',
      modelValue ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md' : 'bg-gray-200 dark:bg-gray-600'
    ]"
    role="switch"
    :aria-checked="modelValue"
  >
    <!-- Text inside switch -->
    <span 
      :class="[
        'text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap',
        modelValue ? 'text-white' : 'text-gray-500 dark:text-gray-400'
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