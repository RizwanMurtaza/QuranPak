// Mapping of surah numbers to their starting global ayah numbers
const SURAH_START_AYAH_NUMBERS: Record<number, number> = {
  1: 1,
  2: 8,
  3: 294,
  4: 494,
  5: 670,
  6: 790,
  7: 955,
  8: 1161,
  9: 1236,
  10: 1365,
  11: 1474,
  12: 1597,
  13: 1708,
  14: 1751,
  15: 1803,
  16: 1902,
  17: 2030,
  18: 2141,
  19: 2251,
  20: 2349,
  21: 2484,
  22: 2596,
  23: 2674,
  24: 2792,
  25: 2856,
  26: 2933,
  27: 3160,
  28: 3254,
  29: 3342,
  30: 3411,
  31: 3471,
  32: 3505,
  33: 3535,
  34: 3608,
  35: 3663,
  36: 3708,
  37: 3791,
  38: 3973,
  39: 4059,
  40: 4134,
  41: 4219,
  42: 4273,
  43: 4326,
  44: 4415,
  45: 4474,
  46: 4511,
  47: 4546,
  48: 4585,
  49: 4614,
  50: 4632,
  51: 4677,
  52: 4737,
  53: 4786,
  54: 4848,
  55: 4903,
  56: 4981,
  57: 5077,
  58: 5106,
  59: 5128,
  60: 5152,
  61: 5165,
  62: 5179,
  63: 5190,
  64: 5201,
  65: 5219,
  66: 5231,
  67: 5243,
  68: 5273,
  69: 5325,
  70: 5377,
  71: 5421,
  72: 5449,
  73: 5477,
  74: 5497,
  75: 5553,
  76: 5593,
  77: 5624,
  78: 5674,
  79: 5715,
  80: 5761,
  81: 5803,
  82: 5832,
  83: 5851,
  84: 5887,
  85: 5912,
  86: 5934,
  87: 5951,
  88: 5970,
  89: 5996,
  90: 6026,
  91: 6046,
  92: 6061,
  93: 6082,
  94: 6093,
  95: 6101,
  96: 6109,
  97: 6128,
  98: 6133,
  99: 6141,
  100: 6149,
  101: 6160,
  102: 6171,
  103: 6179,
  104: 6182,
  105: 6191,
  106: 6196,
  107: 6200,
  108: 6207,
  109: 6210,
  110: 6216,
  111: 6219,
  112: 6224,
  113: 6228,
  114: 6233
}

/**
 * Calculate the global ayah number for audio playback
 * @param surahNumber - The surah number (1-114)
 * @param ayahNumber - The ayah number within the surah
 * @returns The global ayah number
 */
export function getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
  const startNumber = SURAH_START_AYAH_NUMBERS[surahNumber]
  if (!startNumber) {
    console.warn(`No mapping found for surah ${surahNumber}, using approximation`)
    // Fallback calculation (approximate)
    let approxStart = 1
    for (let i = 1; i < surahNumber; i++) {
      approxStart += 100 // Very rough approximation
    }
    return approxStart + ayahNumber - 1
  }
  
  return startNumber + ayahNumber - 1
}

/**
 * Format a surah number with leading zeros
 * @param surahNumber - The surah number
 * @returns Formatted surah number (e.g., "001", "012", "114")
 */
export function formatSurahNumber(surahNumber: number): string {
  return surahNumber.toString().padStart(3, '0')
}

/**
 * Get the Juz number for a given surah and ayah
 * This is a simplified version - in production you'd have exact mappings
 */
export function getJuzNumber(surahNumber: number, ayahNumber: number): number {
  // Simplified Juz calculation
  // In reality, you'd need the exact mappings for each Juz boundary
  const globalAyah = getGlobalAyahNumber(surahNumber, ayahNumber)
  return Math.ceil(globalAyah / 240) // Approximate: ~240 ayahs per Juz
}

/**
 * Check if a verse is a sajda (prostration) verse
 */
export function isSajdaVerse(surahNumber: number, ayahNumber: number): boolean {
  const sajdaVerses = [
    { surah: 7, ayah: 206 },
    { surah: 13, ayah: 15 },
    { surah: 16, ayah: 50 },
    { surah: 17, ayah: 109 },
    { surah: 19, ayah: 58 },
    { surah: 22, ayah: 18 },
    { surah: 22, ayah: 77 },
    { surah: 25, ayah: 60 },
    { surah: 27, ayah: 26 },
    { surah: 32, ayah: 15 },
    { surah: 38, ayah: 24 },
    { surah: 41, ayah: 38 },
    { surah: 53, ayah: 62 },
    { surah: 84, ayah: 21 },
    { surah: 96, ayah: 19 }
  ]
  
  return sajdaVerses.some(v => v.surah === surahNumber && v.ayah === ayahNumber)
}