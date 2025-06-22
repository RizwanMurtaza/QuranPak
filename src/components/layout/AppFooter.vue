<template>
  <footer class="bg-gradient-to-r from-calligraphy-50 to-cream-50 dark:from-gray-800 dark:to-gray-700 border-t border-calligraphy-200 dark:border-calligraphy-800 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Disclaimer Section -->
      <div class="mb-8 p-4 bg-calligraphy-100 dark:bg-calligraphy-900/20 rounded-xl border border-calligraphy-200 dark:border-calligraphy-700">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-calligraphy-600 dark:text-calligraphy-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-calligraphy-900 dark:text-calligraphy-100 mb-2">Data Sources Disclaimer</h4>
            <p class="text-xs text-calligraphy-800 dark:text-calligraphy-200 leading-relaxed">
              <strong>QuranLight.co.uk</strong> does not hold any translation data. It is a service that retrieves and displays data from various sources. 
              All Quranic text, translations, and audio content are sourced from the resources mentioned below in this application.
            </p>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-calligraphy-600 via-cream-600 to-calligraphy-700 rounded-xl flex items-center justify-center shadow-lg border-2 border-calligraphy-300">
              <div class="text-white text-xs text-center leading-tight">
                بِسْمِ<br>اللّٰهِ
              </div>
            </div>
            <div>
              <h3 class="text-lg font-bold text-calligraphy-900 dark:text-calligraphy-100">QuranLight</h3>
              <p class="text-sm text-calligraphy-700 dark:text-calligraphy-300">Let Divine Light Guide Your Journey</p>
            </div>
          </div>
          <p class="text-calligraphy-800 dark:text-calligraphy-200 text-sm leading-relaxed">
            A modern, interactive Quran application designed to help you understand the Quran word by word. 
            Study, bookmark, and enhance your spiritual journey with beautiful typography and intuitive features.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-semibold text-calligraphy-900 dark:text-calligraphy-100 mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <router-link 
                to="/" 
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Home
              </router-link>
            </li>
            <li>
              <router-link 
                to="/search" 
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Search
              </router-link>
            </li>
            <li>
              <router-link 
                to="/bookmarks" 
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Bookmarks
              </router-link>
            </li>
            <li>
              <router-link 
                to="/settings" 
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Settings
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Data Sources -->
        <div>
          <h4 class="text-sm font-semibold text-calligraphy-900 dark:text-calligraphy-100 mb-4">Data Sources</h4>
          <ul class="space-y-2">
            <li>
              <a 
                href="https://alquran.cloud" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Al-Quran Cloud API
              </a>
            </li>
            <li>
              <a 
                href="https://api.quran.com" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Quran.com API
              </a>
            </li>
            <li>
              <a 
                href="https://cdn.islamic.network" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Islamic Network CDN
              </a>
            </li>
            <li>
              <a 
                href="https://corpus.quran.com" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors"
              >
                Quranic Arabic Corpus
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-8 pt-8 border-t border-calligraphy-200 dark:border-calligraphy-700">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex items-center space-x-4 text-sm text-calligraphy-700 dark:text-calligraphy-300">
            <span>© {{ currentYear }} QuranLight</span>
            <span class="hidden md:inline">•</span>
            <span class="hidden md:inline">Islamic Educational Platform</span>
          </div>
          
          <div class="flex items-center space-x-6 text-sm">
            <button 
              @click="scrollToTop"
              class="text-calligraphy-700 dark:text-calligraphy-300 hover:text-calligraphy-800 dark:hover:text-calligraphy-200 transition-colors flex items-center space-x-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
              </svg>
              <span>Back to top</span>
            </button>
          </div>
        </div>
        
        <!-- Islamic Quote -->
        <div class="mt-6 text-center">
          <p class="text-sm text-calligraphy-600 dark:text-calligraphy-400 italic">
            "And We have certainly made the Qur'an easy for remembrance, so is there any who will remember?" 
            <span class="text-xs">(54:17)</span>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>