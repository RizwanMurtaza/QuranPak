<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import PWAUpdatePrompt from '@/components/PWAUpdatePrompt.vue'
import { useQuranStore } from '@/stores/quran'
import { useSettingsStore } from '@/stores/settings'

const quranStore = useQuranStore()
const settingsStore = useSettingsStore()

onMounted(async () => {
  // Apply initial theme
  settingsStore.setTheme(settingsStore.theme)
  
  // Initialize Quran store with API integration
  await quranStore.initialize()
})
</script>

<template>
  <div class="min-h-screen bg-cream-50 dark:bg-gray-900 flex flex-col">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="min-h-full">
        <RouterView />
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- PWA Update Prompt -->
    <PWAUpdatePrompt />
  </div>
</template>
