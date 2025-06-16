import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface SEOData {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  canonical?: string
  robots?: string
  jsonLd?: object
}

export function useSEO() {
  const router = useRouter()
  const route = useRoute()
  
  // Default SEO values
  const defaultSEO: SEOData = {
    title: 'Listen to Quran Online with Translation | SunnahLife - Word by Word Quran Learning',
    description: 'Listen to Quran recitation online with accurate translations in multiple languages. Learn Arabic Quran word-by-word with audio pronunciation, meanings, and Islamic studies. Free Quran listening platform by SunnahLife.',
    keywords: 'listen to quran online, quran recitation audio, quran translation, arabic quran learning, word by word quran, quran with translation, islamic audio books, quran listening app, learn quran online, holy quran recitation',
    ogTitle: 'Listen to Quran Online with Translation | SunnahLife - Word by Word Learning',
    ogDescription: 'Listen to authentic Quran recitation with translations. Learn Arabic word-by-word with audio pronunciation. Free Islamic education platform for Quran study and memorization.',
    ogImage: 'https://quranpak.sunnahlife.com/og-image.jpg',
    ogUrl: 'https://quranpak.sunnahlife.com/',
    canonical: 'https://quranpak.sunnahlife.com/',
    robots: 'index, follow, max-snippet:300, max-image-preview:large'
  }

  const currentSEO = ref<SEOData>({ ...defaultSEO })

  // Update meta tags in the document head
  const updateMetaTags = (seoData: SEOData) => {
    // Update title
    if (seoData.title) {
      document.title = seoData.title
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Update basic meta tags
    if (seoData.description) {
      updateMetaTag('description', seoData.description)
    }
    
    if (seoData.keywords) {
      updateMetaTag('keywords', seoData.keywords)
    }
    
    if (seoData.robots) {
      updateMetaTag('robots', seoData.robots)
    }

    // Update Open Graph tags
    if (seoData.ogTitle) {
      updateMetaTag('og:title', seoData.ogTitle, true)
    }
    
    if (seoData.ogDescription) {
      updateMetaTag('og:description', seoData.ogDescription, true)
    }
    
    if (seoData.ogImage) {
      updateMetaTag('og:image', seoData.ogImage, true)
    }
    
    if (seoData.ogUrl) {
      updateMetaTag('og:url', seoData.ogUrl, true)
    }

    // Update Twitter Card tags
    if (seoData.ogTitle) {
      updateMetaTag('twitter:title', seoData.ogTitle)
    }
    
    if (seoData.ogDescription) {
      updateMetaTag('twitter:description', seoData.ogDescription)
    }
    
    if (seoData.ogImage) {
      updateMetaTag('twitter:image', seoData.ogImage)
    }

    // Update canonical link
    if (seoData.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', seoData.canonical)
    }

    // Add JSON-LD structured data
    if (seoData.jsonLd) {
      // Remove existing JSON-LD with same type
      const existingJsonLd = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]')
      if (existingJsonLd) {
        existingJsonLd.remove()
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-dynamic', 'true')
      script.textContent = JSON.stringify(seoData.jsonLd)
      document.head.appendChild(script)
    }
  }

  // Set SEO data for current page
  const setSEO = (seoData: Partial<SEOData>) => {
    currentSEO.value = { ...defaultSEO, ...seoData }
    updateMetaTags(currentSEO.value)
  }

  // Generate SEO for Surah pages
  const generateSurahSEO = (surahNumber: number, surahNameArabic: string, surahNameEnglish: string, ayahCount: number, revelationType: string) => {
    const title = `Surah ${surahNameEnglish} (${surahNameArabic}) - Listen Online with Translation | SunnahLife`
    const description = `Listen to Surah ${surahNameEnglish} (Chapter ${surahNumber}) with authentic Arabic recitation and accurate translations. ${ayahCount} verses of ${revelationType} revelation. Learn word-by-word meaning and pronunciation.`
    const keywords = `surah ${surahNameEnglish.toLowerCase()}, ${surahNameArabic}, quran chapter ${surahNumber}, listen quran surah ${surahNumber}, ${surahNameEnglish.toLowerCase()} recitation, ${surahNameEnglish.toLowerCase()} translation, islamic audio, quran listening, arabic recitation`
    
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Chapter",
      "name": `Surah ${surahNameEnglish}`,
      "alternateName": surahNameArabic,
      "description": description,
      "position": surahNumber,
      "isPartOf": {
        "@type": "Book",
        "name": "The Holy Quran",
        "inLanguage": "ar"
      },
      "inLanguage": "ar",
      "about": {
        "@type": "Religion",
        "name": "Islam"
      },
      "numberOfPages": Math.ceil(ayahCount / 10),
      "learningResourceType": ["Audio", "Text"],
      "educationalUse": "Religious Study"
    }

    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogUrl: `https://quranpak.sunnahlife.com/surah/${surahNumber}`,
      canonical: `https://quranpak.sunnahlife.com/surah/${surahNumber}`,
      jsonLd
    }
  }

  // Generate SEO for search pages
  const generateSearchSEO = (query: string) => {
    const title = `Search Results for "${query}" in Quran | SunnahLife`
    const description = `Find Quranic verses and translations containing "${query}". Search through the Holy Quran with accurate translations and audio recitation.`
    const keywords = `quran search, search quran verses, ${query} in quran, find quran text, islamic search, quran verse finder`
    
    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogUrl: `https://quranpak.sunnahlife.com/search?q=${encodeURIComponent(query)}`,
      canonical: `https://quranpak.sunnahlife.com/search?q=${encodeURIComponent(query)}`,
      robots: 'noindex, nofollow' // Don't index search result pages
    }
  }

  // Generate breadcrumb structured data
  const generateBreadcrumbJsonLd = (breadcrumbs: Array<{name: string, url: string}>) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    }
  }

  // Watch route changes and update SEO
  watch(route, () => {
    // Reset to default when route changes
    currentSEO.value = { ...defaultSEO }
    updateMetaTags(currentSEO.value)
  })

  return {
    currentSEO,
    setSEO,
    generateSurahSEO,
    generateSearchSEO,
    generateBreadcrumbJsonLd,
    updateMetaTags
  }
}