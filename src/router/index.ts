import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Quran Word by Word - Home' }
    },
    {
      path: '/surahs',
      name: 'surahs',
      component: () => import('../views/SurahListView.vue'),
      meta: { title: 'All Surahs - Quran Word by Word' }
    },
    {
      path: '/surah/:id',
      name: 'surah',
      component: () => import('../views/SurahView.vue'),
      meta: { title: 'Surah' },
      props: route => ({ id: parseInt(route.params.id as string) })
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: { title: 'Search Quran' }
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('../views/BookmarksView.vue'),
      meta: { title: 'Bookmarks' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { title: 'Settings' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Page Not Found' }
    }
  ],
})

// Update document title on route change
router.beforeEach((to) => {
  document.title = to.meta.title as string || 'Quran Word by Word'
})

export default router
