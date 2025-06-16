<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @keydown.esc="handleEscape"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        :class="{ 'opacity-100': show, 'opacity-0': !show }"
        @click="handleBackdropClick"
      ></div>

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          ref="modalRef"
          class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all transform"
          :class="[
            modalSizeClasses,
            { 
              'opacity-100 scale-100': show, 
              'opacity-0 scale-95': !show 
            }
          ]"
        >
          <!-- Header -->
          <div
            v-if="$slots.header || title || closable"
            class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center space-x-3">
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ title }}
                </h3>
              </slot>
            </div>
            <button
              v-if="closable"
              @click="close"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnEscape: true,
  closeOnBackdrop: true,
  persistent: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'open': []
}>()

const isOpen = ref(false)
const show = ref(false)
const modalRef = ref<HTMLElement>()

const modalSizeClasses = {
  sm: 'max-w-sm w-full mx-4',
  md: 'max-w-md w-full mx-4',
  lg: 'max-w-lg w-full mx-4',
  xl: 'max-w-4xl w-full mx-4',
  full: 'max-w-full w-full h-full m-4'
}

watch(() => props.modelValue, async (newValue) => {
  if (newValue && !isOpen.value) {
    await open()
  } else if (!newValue && isOpen.value) {
    await close()
  }
})

async function open() {
  isOpen.value = true
  await nextTick()
  show.value = true
  
  // Focus management
  if (modalRef.value) {
    const focusableElement = modalRef.value.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement
    focusableElement?.focus()
  }
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden'
  
  emit('open')
}

async function close() {
  if (props.persistent) return
  
  show.value = false
  
  // Wait for animation to complete
  setTimeout(() => {
    isOpen.value = false
    document.body.style.overflow = ''
    emit('update:modelValue', false)
    emit('close')
  }, 150)
}

function handleEscape(event: KeyboardEvent) {
  if (props.closeOnEscape && event.key === 'Escape') {
    close()
  }
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Handle initial state
onMounted(() => {
  if (props.modelValue) {
    open()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>