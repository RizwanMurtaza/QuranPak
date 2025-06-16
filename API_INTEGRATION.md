# Quran App - API Integration Documentation

## Overview

This document outlines the comprehensive API integration implemented for the Quran Word-by-Word application using Al-Quran Cloud API and multiple translation sources.

## API Sources

### Primary API: Al-Quran Cloud
- **Base URL**: `https://api.alquran.cloud/v1`
- **Documentation**: https://alquran.cloud/api
- **Features**: Complete Quran text, multiple translations, audio recitations

### Available Translations (50+ languages)

#### English Translations
- `en.sahih` - Saheeh International *(Default)*
- `en.pickthall` - Mohammed Marmaduke William Pickthall
- `en.yusufali` - Abdullah Yusuf Ali
- `en.hilali` - Muhammad Taqi-ud-Din al-Hilali and Muhammad Muhsin Khan
- `en.asad` - Muhammad Asad
- `en.arberry` - A. J. Arberry
- `en.maududi` - Abul Ala Maududi

#### Arabic Texts
- `ar.quran` - Simple Arabic Text *(Default)*
- `ar.quran-uthmani` - Uthmani Script

#### Urdu Translations
- `ur.jalandhry` - Fateh Muhammad Jalandhry *(Default)*
- `ur.ahmedali` - Ahmed Ali
- `ur.kanzulimaan` - Kanz ul Imaan

#### Other Languages
- **French**: `fr.hamidullah` - Muhammad Hamidullah
- **Spanish**: `es.cortes` - Julio Cortes
- **German**: `de.bubenheim` - Frank Bubenheim and Nadeem Elyas
- **Indonesian**: `id.indonesian` - Indonesian Ministry of Religious Affairs
- **Turkish**: `tr.ates` - Süleyman Ateş
- **Bengali**: `bn.bengali` - Zohurul Hoque
- **Persian**: `fa.ansarian` - حسین انصاریان
- **Russian**: `ru.kuliev` - Эльмир Кулиев
- **Malay**: `ms.basmeih` - Abdullah Muhammad Basmeih
- **Dutch**: `nl.keyzer` - Salomo Keyzer
- **Italian**: `it.piccardo` - Hamza Roberto Piccardo

### Audio Reciters

#### Popular Reciters
- `ar.alafasy` - Mishary Rashid Alafasy *(Default)*
- `ar.husary` - Mahmoud Khalil Al-Husary
- `ar.minshawi` - Mohammad Siddiq Al-Minshawi
- `ar.sudais` - Abdul Rahman Al-Sudais
- `ar.shuraym` - Saood bin Ibrahim Ash-Shuraym
- `ar.ghamadi` - Saad Al-Ghamdi
- `ar.muaiqly` - Maher Al Muaiqly
- `ar.bukhatir` - Ahmed ibn Ali al-Ajamy

## Architecture

### 1. Service Layer (`src/services/api.ts`)

Main API service class with:
- **Caching**: 5-minute cache for API responses
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: Built-in request optimization
- **Retry Logic**: Automatic retries for failed requests

```typescript
// Get Surah with multiple translations
const translations = await quranAPI.getSurahWithTranslations(1, ['ar.quran', 'en.sahih', 'ur.jalandhry'])

// Search across translations
const results = await quranAPI.search('mercy', undefined, 'en.sahih')

// Get audio for recitation
const audio = await quranAPI.getSurahAudio(1, 'ar.alafasy')
```

### 2. Composable Layer (`src/composables/useQuranAPI.ts`)

Vue composable providing:
- **Reactive State**: Loading, error states
- **Type Safety**: Full TypeScript support
- **Easy Integration**: Simple API for components

```typescript
const { 
  getSurahs, 
  getSurahWithTranslations, 
  search, 
  loading, 
  error 
} = useQuranAPI()
```

### 3. Store Integration (`src/stores/quran.ts`)

Pinia store managing:
- **State Management**: Current Surah, verses, translations
- **User Preferences**: Selected translations and reciters
- **Data Synchronization**: Real-time updates across components

### 4. Storage Layer (`src/utils/storage.ts`)

Offline capabilities:
- **localStorage**: Settings and small data
- **IndexedDB**: Large datasets (Surahs, audio)
- **Cache Management**: Automatic cleanup and optimization

## Features Implemented

### ✅ Completed Features

1. **Multi-Translation Support**
   - Simultaneous display of multiple translations
   - Translation management interface
   - Language-specific text direction (RTL/LTR)

2. **Audio Integration** 
   - Multiple reciter selection
   - Verse-by-verse audio playback
   - Audio caching for offline use

3. **Advanced Search**
   - Cross-translation search
   - Surah-specific filtering
   - Search result highlighting

4. **Caching & Performance**
   - Intelligent API caching
   - Offline data storage
   - Progressive data loading

5. **User Preferences**
   - Translation selection
   - Reciter preferences
   - Reading progress tracking

### 🔄 API Methods Available

#### Surah Management
```typescript
await quranAPI.getSurahs()                          // Get all Surahs
await quranAPI.getSurah(1, 'en.sahih')             // Get specific Surah
await quranAPI.getSurahWithTranslations(1, [...])   // Multiple translations
```

#### Verse Management  
```typescript
await quranAPI.getAyah(1, 1, 'en.sahih')           // Get specific verse
await quranAPI.getAyahWithTranslations(1, 1, [...]) // Multiple translations
await quranAPI.getAyahRange(1, 1, 1, 7, 'en.sahih') // Range of verses
```

#### Search & Discovery
```typescript
await quranAPI.search('mercy', 1, 'en.sahih')       // Search in Surah
await quranAPI.advancedSearch({ query: 'peace' })   // Advanced search
await quranAPI.getRandomAyah('en.sahih')            // Random verse
```

#### Audio & Recitation
```typescript
await quranAPI.getSurahAudio(1, 'ar.alafasy')       // Surah audio
await quranAPI.getAyahAudio(1, 1, 'ar.alafasy')     // Verse audio
```

#### Navigation & Structure
```typescript
await quranAPI.getJuz(1, 'ar.quran')                // Get Juz/Para
await quranAPI.getPage(1, 'ar.quran')               // Get page
await quranAPI.getSajdaAyahs('ar.quran')            // Prostration verses
```

### 🎯 Usage Examples

#### Component Integration
```vue
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <SurahDisplay v-else :surah="surah" />
</template>

<script setup>
const { getSurah, loading, error } = useQuranAPI()
const surah = await getSurah(1)
</script>
```

#### Store Usage
```typescript
// In components
const quranStore = useQuranStore()

// Set translations
quranStore.setSelectedTranslations(['en.sahih', 'ur.jalandhry'])

// Fetch Surah with translations
await quranStore.fetchSurah(1, true)

// Access data
const verses = quranStore.currentSurahVerses
```

## Performance Optimizations

### 1. Caching Strategy
- **API Cache**: 5-minute cache for API responses
- **localStorage**: User preferences and small data
- **IndexedDB**: Large datasets and offline content

### 2. Lazy Loading
- **On-Demand**: Load translations only when needed
- **Preloading**: Common Surahs preloaded on app start
- **Progressive**: Load additional data as user navigates

### 3. Error Handling
- **Graceful Degradation**: Fallback to cached data
- **Retry Logic**: Automatic retries for network failures  
- **User Feedback**: Clear error messages and recovery options

## Offline Support

### Data Storage
- **Surahs**: Cached in IndexedDB
- **Translations**: Available offline after first load
- **Audio**: Downloaded and cached for offline playback
- **User Data**: Bookmarks, notes, reading progress

### Sync Strategy
- **Background Sync**: Update data when online
- **Conflict Resolution**: Handle data conflicts gracefully
- **Storage Management**: Automatic cleanup of old data

## API Rate Limits & Best Practices

### Rate Limiting
- **Respectful Usage**: Built-in delays between requests
- **Batch Requests**: Combine multiple API calls
- **Cache First**: Always check cache before API call

### Error Recovery
- **Exponential Backoff**: Gradual retry intervals
- **Circuit Breaker**: Stop requests if API is down
- **Fallback Data**: Use cached or default content

## Future Enhancements

### Planned Features
1. **Word-by-Word Integration**: Connect with Corpus Quran API
2. **Real-time Sync**: Multi-device synchronization
3. **Advanced Analytics**: Reading statistics and insights
4. **Community Features**: Shared notes and discussions

### API Extensions
1. **GraphQL Layer**: Efficient data fetching
2. **WebSocket**: Real-time updates
3. **CDN Integration**: Faster content delivery
4. **Custom API**: Specialized endpoints for app features

## Configuration

### Environment Variables
```env
VITE_QURAN_API_BASE_URL=https://api.alquran.cloud/v1
VITE_AUDIO_CDN_URL=https://cdn.alquran.cloud/media/audio
VITE_CACHE_DURATION=300000
```

### Default Settings
```typescript
const DEFAULT_SETTINGS = {
  primaryTranslation: 'en.sahih',
  reciter: 'ar.alafasy',
  cacheTimeout: 5 * 60 * 1000,
  maxCacheSize: 100,
  autoPreload: true
}
```

This comprehensive API integration provides a robust foundation for the Quran Word-by-Word application with excellent performance, offline capabilities, and extensive translation support.