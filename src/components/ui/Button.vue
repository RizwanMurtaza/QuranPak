<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    
    <span :class="{ 'opacity-0': loading }" class="flex items-center justify-center space-x-2">
      <slot name="icon-left" />
      <span v-if="$slots.default"><slot /></span>
      <slot name="icon-right" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tag?: 'button' | 'a' | 'router-link'
  disabled?: boolean
  loading?: boolean
  rounded?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  disabled: false,
  loading: false,
  rounded: false,
  block: false
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  ]

  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base'
  }

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-primary-500',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
  }

  // Rounded classes
  const roundedClasses = props.rounded ? 'rounded-full' : 'rounded-md'

  // Block classes
  const blockClasses = props.block ? 'w-full' : ''

  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    roundedClasses,
    blockClasses
  ].filter(Boolean).join(' ')
})

function handleClick(event: Event) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>