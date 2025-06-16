import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { 
        title: 'Listen to Quran Online with Translation | SunnahLife - Word by Word Quran Learning',
        description: 'Listen to Quran recitation online with accurate translations in multiple languages. Learn Arabic Quran word-by-word with audio pronunciation, meanings, and Islamic studies.',
        keywords: 'listen to quran online, quran recitation audio, quran translation, arabic quran learning, word by word quran'
      }
    },
    {
      path: '/surahs',
      name: 'surahs',
      component: () => import('../views/SurahListView.vue'),
      meta: { 
        title: 'All 114 Quran Surahs with Audio & Translation | Listen to Complete Quran Online',
        description: 'Browse all 114 Quran chapters (Surahs) with authentic Arabic recitation and translations. Listen to complete Quran online with word-by-word learning and pronunciation guide.',
        keywords: 'all quran surahs, 114 quran chapters, listen complete quran, quran audio, surah list, islamic chapters'
      }
    },
    {
      path: '/surah/:id',
      name: 'surah',
      component: () => import('../views/SurahView.vue'),
      meta: { 
        title: 'Surah with Audio Recitation & Translation',
        description: 'Listen to Quran Surah with authentic Arabic recitation and accurate translations. Learn word-by-word meaning and pronunciation.',
        keywords: 'quran surah audio, surah recitation, surah translation, listen quran chapter'
      },
      props: route => ({ id: parseInt(route.params.id as string) })
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: { 
        title: 'Search Quran Verses & Translation | Find Islamic Text Online',
        description: 'Search through the Holy Quran with accurate translations and audio recitation. Find specific verses, topics, and Islamic teachings with advanced search.',
        keywords: 'search quran verses, find quran text, quran search engine, islamic search, verse finder'
      }
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('../views/BookmarksView.vue'),
      meta: { 
        title: 'My Quran Bookmarks & Saved Verses | Personal Quran Study Collection',
        description: 'Access your saved Quran verses and bookmarked chapters. Build your personal collection of favorite Islamic verses for study and reflection.',
        keywords: 'quran bookmarks, saved verses, personal quran collection, favorite verses, islamic study'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { 
        title: 'Quran App Settings | Customize Reading & Audio Preferences',
        description: 'Customize your Quran learning experience. Adjust audio settings, translation preferences, text size, and reading modes for optimal Islamic study.',
        keywords: 'quran app settings, audio preferences, translation settings, reading preferences, islamic app customization'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { 
        title: 'Page Not Found | SunnahLife Quran Learning Platform',
        description: 'The page you are looking for could not be found. Return to our Quran learning platform to continue your Islamic studies.',
        keywords: 'page not found, quran platform, islamic learning'
      }
    }
  ],
})

// Enhanced SEO meta tag updates on route change
router.beforeEach((to) => {
  // Update document title
  document.title = to.meta.title as string || 'Listen to Quran Online with Translation | SunnahLife'
  
  // Update meta description
  const description = to.meta.description as string
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
  }
  
  // Update meta keywords
  const keywords = to.meta.keywords as string
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords)
    }
  }
  
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    const baseUrl = 'https://quranpak.sunnahlife.com'
    const fullPath = to.fullPath === '/' ? '' : to.fullPath
    canonical.setAttribute('href', baseUrl + fullPath)
  }
  
  // Update Open Graph URL
  let ogUrl = document.querySelector('meta[property="og:url"]')
  if (ogUrl) {
    const baseUrl = 'https://quranpak.sunnahlife.com'
    const fullPath = to.fullPath === '/' ? '' : to.fullPath
    ogUrl.setAttribute('content', baseUrl + fullPath)
  }
})

export default router
