<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Bookmarks</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Your saved verses and personal notes
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="bookmarks.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookmarks yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Start bookmarking verses to save them for later reading
      </p>
      <router-link to="/">
        <Button variant="primary">
          Browse Quran
        </Button>
      </router-link>
    </div>

    <!-- Bookmarks List -->
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ totalBookmarks }} Bookmark{{ totalBookmarks !== 1 ? 's' : '' }}
        </h2>
        
        <div class="flex items-center space-x-3">
          <!-- Search Bookmarks -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search bookmarks..."
              class="w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Clear All Button -->
          <Button
            variant="outline"
            size="sm"
            @click="showClearAllModal = true"
            :disabled="bookmarks.length === 0"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="bookmark in filteredBookmarks"
          :key="bookmark.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-verse p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-islamic-gold bg-opacity-20 text-islamic-gold rounded-full flex items-center justify-center text-sm font-semibold">
                {{ bookmark.verseNumber }}
              </div>
              <div>
                <router-link
                  :to="`/surah/${bookmark.surahNumber}#verse-${bookmark.verseNumber}`"
                  class="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {{ bookmark.surahName }}
                </router-link>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Verse {{ bookmark.verseNumber }} • Bookmarked {{ formatDate(bookmark.createdAt) }}
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                @click="editBookmark(bookmark)"
                title="Edit note"
              >
                <template #icon-left>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </template>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                @click="removeBookmark(bookmark.id)"
                title="Remove bookmark"
                class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <template #icon-left>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </template>
              </Button>
            </div>
          </div>

          <!-- Verse Text -->
          <div class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {{ bookmark.verseText }}
          </div>

          <!-- Personal Note -->
          <div v-if="bookmark.note" class="bg-gray-50 dark:bg-gray-700 rounded-md p-3 border-l-4 border-primary-500">
            <p class="text-sm text-gray-700 dark:text-gray-300 italic">
              "{{ bookmark.note }}"
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Bookmark Modal -->
    <Modal v-model="showEditModal" title="Edit Bookmark Note" size="md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Personal Note
          </label>
          <textarea
            v-model="editingNote"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add your personal thoughts or reflections..."
          ></textarea>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="cancelEdit">
          Cancel
        </Button>
        <Button variant="primary" @click="saveEdit">
          Save Note
        </Button>
      </template>
    </Modal>

    <!-- Clear All Confirmation Modal -->
    <Modal v-model="showClearAllModal" title="Clear All Bookmarks" size="sm">
      <div class="text-center">
        <div class="text-red-600 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Clear All Bookmarks?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          This action cannot be undone. All your bookmarks and notes will be permanently deleted.
        </p>
      </div>

      <template #footer>
        <Button variant="outline" @click="showClearAllModal = false">
          Cancel
        </Button>
        <Button variant="danger" @click="clearAllBookmarks">
          Clear All
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'

const userStore = useUserStore()

const searchQuery = ref('')
const showEditModal = ref(false)
const showClearAllModal = ref(false)
const editingBookmark = ref<any>(null)
const editingNote = ref('')

const bookmarks = computed(() => userStore.bookmarks)
const totalBookmarks = computed(() => userStore.totalBookmarks)

const filteredBookmarks = computed(() => {
  if (!searchQuery.value.trim()) {
    return bookmarks.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return bookmarks.value.filter(bookmark => 
    bookmark.surahName.toLowerCase().includes(query) ||
    bookmark.verseText.toLowerCase().includes(query) ||
    bookmark.note?.toLowerCase().includes(query)
  )
})

function formatDate(date: Date): string {
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

function editBookmark(bookmark: any) {
  editingBookmark.value = bookmark
  editingNote.value = bookmark.note || ''
  showEditModal.value = true
}

function cancelEdit() {
  showEditModal.value = false
  editingBookmark.value = null
  editingNote.value = ''
}

function saveEdit() {
  if (editingBookmark.value) {
    userStore.updateBookmarkNote(editingBookmark.value.id, editingNote.value)
    showEditModal.value = false
    editingBookmark.value = null
    editingNote.value = ''
  }
}

function removeBookmark(id: string) {
  userStore.removeBookmark(id)
}

function clearAllBookmarks() {
  userStore.clearAllData()
  showClearAllModal.value = false
}
</script>