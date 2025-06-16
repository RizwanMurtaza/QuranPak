<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <svg 
          class="w-32 h-32 mx-auto text-gray-300 dark:text-gray-600" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>

      <!-- 404 Text -->
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      
      <!-- Error Message -->
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Page Not Found
      </h2>
      
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist. You may have mistyped the address or the page may have moved.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/">
          <Button variant="primary" class="w-full sm:w-auto">
            <template #icon-left>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </template>
            Go Home
          </Button>
        </router-link>
        
        <Button variant="outline" @click="goBack" class="w-full sm:w-auto">
          <template #icon-left>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </template>
          Go Back
        </Button>
      </div>

      <!-- Help Text -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Looking for something specific?
        </p>
        <div class="flex flex-wrap gap-2 justify-center">
          <router-link 
            to="/" 
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            Browse Quran
          </router-link>
          <span class="text-gray-300 dark:text-gray-600">•</span>
          <router-link 
            to="/search" 
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            Search Verses
          </router-link>
          <span class="text-gray-300 dark:text-gray-600">•</span>
          <router-link 
            to="/bookmarks" 
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            My Bookmarks
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>