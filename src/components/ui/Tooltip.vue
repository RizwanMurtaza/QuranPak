<template>
  <div class="relative inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot />
    
    <Teleport to="body">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        :class="tooltipClasses"
        :style="tooltipStyles"
        role="tooltip"
      >
        <slot name="content">
          {{ content }}
        </slot>
        
        <!-- Arrow -->
        <div
          :class="arrowClasses"
          :style="arrowStyles"
        ></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

interface Props {
  content?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
  theme?: 'dark' | 'light'
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  delay: 100,
  disabled: false,
  theme: 'dark'
})

const isVisible = ref(false)
const tooltipRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const position = ref({ x: 0, y: 0 })
let showTimeout: number | undefined = undefined
let hideTimeout: number | undefined = undefined

const tooltipClasses = computed(() => {
  const baseClasses = [
    'absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-lg pointer-events-none transition-opacity duration-200'
  ]
  
  const themeClasses = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900 border border-gray-200'
  }
  
  return [
    ...baseClasses,
    themeClasses[props.theme],
    isVisible.value ? 'opacity-100' : 'opacity-0'
  ].join(' ')
})

const tooltipStyles = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
}))

const arrowClasses = computed(() => {
  const baseClasses = 'absolute w-2 h-2 transform rotate-45'
  
  const themeClasses = {
    dark: 'bg-gray-900',
    light: 'bg-white border-l border-t border-gray-200'
  }
  
  const placementClasses = {
    top: '-bottom-1 left-1/2 -translate-x-1/2',
    bottom: '-top-1 left-1/2 -translate-x-1/2',
    left: '-right-1 top-1/2 -translate-y-1/2',
    right: '-left-1 top-1/2 -translate-y-1/2'
  }
  
  return [baseClasses, themeClasses[props.theme], placementClasses[props.placement]].join(' ')
})

const arrowStyles = computed(() => {
  // Additional arrow positioning if needed
  return {}
})

function showTooltip() {
  if (props.disabled) return
  
  if (hideTimeout) clearTimeout(hideTimeout)
  showTimeout = window.setTimeout(async () => {
    isVisible.value = true
    await nextTick()
    updatePosition()
  }, props.delay)
}

function hideTooltip() {
  if (props.disabled) return
  
  if (showTimeout) clearTimeout(showTimeout)
  hideTimeout = window.setTimeout(() => {
    isVisible.value = false
  }, 100)
}

function updatePosition() {
  if (!tooltipRef.value || !triggerRef.value) return
  
  const triggerRect = (triggerRef.value as HTMLElement).getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const offset = 8 // Distance from trigger
  
  let x = 0
  let y = 0
  
  switch (props.placement) {
    case 'top':
      x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
      y = triggerRect.top - tooltipRect.height - offset
      break
    case 'bottom':
      x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
      y = triggerRect.bottom + offset
      break
    case 'left':
      x = triggerRect.left - tooltipRect.width - offset
      y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
      break
    case 'right':
      x = triggerRect.right + offset
      y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
      break
  }
  
  // Keep tooltip within viewport
  const padding = 8
  x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding))
  y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding))
  
  position.value = { x, y }
}

onMounted(() => {
  // Get reference to the trigger element (first child)
  const slot = document.querySelector('.relative.inline-block')
  if (slot) {
    triggerRef.value = slot as HTMLElement
  }
})

onUnmounted(() => {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})
</script>