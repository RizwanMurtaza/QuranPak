<template>
  <header class="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg border-b-2 border-emerald-200 dark:border-emerald-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-24">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="flex items-center space-x-4">
            <!-- Islamic Bismillah Logo -->
            <div class="flex items-center space-x-4">
              <div class="relative">
                <!-- Bismillah Circular Design -->
                <div class="w-16 h-16 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-full flex items-center justify-center shadow-xl border-2 border-emerald-300">
                  <!-- Arabic Bismillah Text -->
                  <div class="text-white bismillah-text text-center">
                    بِسْمِ<br>اللّٰهِ
                  </div>
                </div>
                <!-- Decorative Islamic Pattern -->
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full opacity-80"></div>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-400 rounded-full opacity-60"></div>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-2xl font-bold text-emerald-800 dark:text-emerald-200 font-serif">
                  SunnahLife
                </h1>
                <p class="text-sm text-emerald-700 dark:text-emerald-300 font-medium -mt-1">
                  Read, Listen and Learn Quran
                </p>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text" 
              placeholder="Search Quran..." 
              class="block w-full pl-10 pr-3 py-3 border border-emerald-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-emerald-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-lg"
            >
          </div>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search button for mobile -->
          <button 
            @click="showMobileSearch = !showMobileSearch"
            class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>

          <!-- Dark Mode Toggle -->
          <button 
            @click="toggleTheme"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="isDarkMode" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <!-- Bookmarks -->
          <router-link 
            to="/bookmarks"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Bookmarks"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
            <span v-if="totalBookmarks > 0" class="absolute -top-1 -right-1 bg-islamic-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ totalBookmarks > 99 ? '99+' : totalBookmarks }}
            </span>
          </router-link>

          <!-- Settings -->
          <router-link 
            to="/settings"
            class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div v-if="showMobileSearch" class="md:hidden pb-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text" 
            placeholder="Search Quran..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'

// No emits needed since sidebar toggle is removed

const router = useRouter()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const searchQuery = ref('')
const showMobileSearch = ref(false)

const isDarkMode = computed(() => settingsStore.isDarkMode)
const totalBookmarks = computed(() => userStore.totalBookmarks)

function toggleTheme() {
  const newTheme = settingsStore.isDarkMode ? 'light' : 'dark'
  settingsStore.setTheme(newTheme)
}

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
    showMobileSearch.value = false
  }
}
</script>