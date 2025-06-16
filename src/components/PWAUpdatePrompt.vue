<template>
  <Teleport to="body">
    <!-- Update Available Notification -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    >
      <div
        v-if="showUpdatePrompt"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <!-- Center notification -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  App Update Available
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    A new version of the Quran Word by Word app is available with improvements and new features. 
                    Would you like to update now?
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
              <Button
                @click="updateApp"
                :disabled="updating"
                variant="primary"
                class="w-full sm:w-auto"
              >
                <template v-if="updating" #icon-left>
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </template>
                {{ updating ? 'Updating...' : 'Update Now' }}
              </Button>
              <Button
                @click="dismissUpdate"
                variant="outline"
                class="w-full sm:w-auto mt-3 sm:mt-0"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Install App Prompt -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div
        v-if="showInstallPrompt"
        class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-40"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                Install App
              </h4>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Add Quran Word by Word to your home screen for easy access
              </p>
              <div class="mt-3 flex gap-2">
                <Button
                  @click="installApp"
                  size="sm"
                  variant="primary"
                  class="text-xs"
                >
                  Install
                </Button>
                <Button
                  @click="dismissInstall"
                  size="sm"
                  variant="ghost"
                  class="text-xs"
                >
                  Not now
                </Button>
              </div>
            </div>
            <button
              @click="dismissInstall"
              class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Offline Indicator -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div
        v-if="isOffline"
        class="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
      >
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-2">
              <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
                You're offline
              </p>
              <p class="text-xs text-amber-700 dark:text-amber-300">
                Some features may be limited. Cached content is available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import Button from '@/components/ui/Button.vue'

// PWA update functionality
const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered(r) {
    console.log('SW Registered: ' + r)
  },
  onRegisterError(error) {
    console.log('SW registration error', error)
  },
})

// State
const showUpdatePrompt = ref(false)
const showInstallPrompt = ref(false)
const updating = ref(false)
const isOffline = ref(!navigator.onLine)
const installEvent = ref<any>(null)

// Watch for updates
const checkForUpdates = () => {
  if (needRefresh.value) {
    showUpdatePrompt.value = true
  }
}

// Update app
const updateApp = async () => {
  updating.value = true
  try {
    await updateServiceWorker(true)
    // The app will automatically reload after update
  } catch (error) {
    console.error('Failed to update app:', error)
    updating.value = false
  }
}

// Dismiss update prompt
const dismissUpdate = () => {
  showUpdatePrompt.value = false
}

// Install app
const installApp = async () => {
  if (installEvent.value) {
    installEvent.value.prompt()
    const { outcome } = await installEvent.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    installEvent.value = null
    showInstallPrompt.value = false
  }
}

// Dismiss install prompt
const dismissInstall = () => {
  showInstallPrompt.value = false
  installEvent.value = null
  
  // Don't show again for this session
  sessionStorage.setItem('pwa-install-dismissed', 'true')
}

// Online/offline handlers
const handleOnline = () => {
  isOffline.value = false
}

const handleOffline = () => {
  isOffline.value = true
}

// Install prompt handler
const handleBeforeInstallPrompt = (e: Event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  
  // Check if user has already dismissed the prompt this session
  if (sessionStorage.getItem('pwa-install-dismissed')) {
    return
  }
  
  // Stash the event so it can be triggered later
  installEvent.value = e
  
  // Show install prompt after a delay (better UX)
  setTimeout(() => {
    showInstallPrompt.value = true
  }, 5000) // Show after 5 seconds
}

// Lifecycle
onMounted(() => {
  // Check for updates periodically
  checkForUpdates()
  setInterval(checkForUpdates, 60000) // Check every minute
  
  // Listen for network status changes
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Listen for install prompt
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  
  // Set initial offline state
  isOffline.value = !navigator.onLine
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})
</script>

<style scoped>
/* Additional styles for PWA prompts */
.transition-gpu {
  transform: translateZ(0);
}
</style>