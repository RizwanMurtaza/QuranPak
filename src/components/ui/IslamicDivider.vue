<template>
  <div class="islamic-divider flex items-center justify-center py-4 sm:py-6">
    <!-- Left ornament -->
    <div class="flex-1 flex justify-end">
      <div class="islamic-ornament-left">
        <svg class="w-16 h-6 sm:w-20 sm:h-8 text-gold-400/60" viewBox="0 0 80 32" fill="currentColor">
          <path d="M0 16c8-8 16-8 24 0s16 8 24 0 16-8 24 0 8 8 8 16-0 16-8 16-16-8-24 0-16-8-24 0-16 8-24 0-8-8-8-16z" opacity="0.6"/>
          <circle cx="20" cy="16" r="2" opacity="0.8"/>
          <circle cx="40" cy="16" r="3" opacity="1"/>
          <circle cx="60" cy="16" r="2" opacity="0.8"/>
        </svg>
      </div>
    </div>

    <!-- Center Islamic symbol -->
    <div class="relative mx-4 sm:mx-6">
      <div class="islamic-center-ornament relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-islamic-sage via-gold-500 to-islamic-forest rounded-full shadow-luxury border-2 border-gold-400/50 flex items-center justify-center animate-breathe">
        <!-- Rotating background pattern -->
        <div class="absolute inset-0 bg-geometric-pattern opacity-20 rounded-full animate-rotate-slow"></div>
        
        <!-- Islamic Star -->
        <div class="relative text-islamic-cream text-lg sm:text-xl font-arabic">
          ✦
        </div>
        
        <!-- Pulsing ring -->
        <div class="absolute inset-0 border-2 border-gold-300/40 rounded-full animate-pulse-gold"></div>
      </div>
    </div>

    <!-- Right ornament -->
    <div class="flex-1 flex justify-start">
      <div class="islamic-ornament-right">
        <svg class="w-16 h-6 sm:w-20 sm:h-8 text-gold-400/60 scale-x-[-1]" viewBox="0 0 80 32" fill="currentColor">
          <path d="M0 16c8-8 16-8 24 0s16 8 24 0 16-8 24 0 8 8 8 16-0 16-8 16-16-8-24 0-16-8-24 0-16 8-24 0-8-8-8-16z" opacity="0.6"/>
          <circle cx="20" cy="16" r="2" opacity="0.8"/>
          <circle cx="40" cy="16" r="3" opacity="1"/>
          <circle cx="60" cy="16" r="2" opacity="0.8"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.islamic-divider {
  overflow: hidden;
}

.islamic-ornament-left,
.islamic-ornament-right {
  opacity: 0.7;
  transition: all 0.3s ease;
}

.islamic-divider:hover .islamic-ornament-left,
.islamic-divider:hover .islamic-ornament-right {
  opacity: 1;
  transform: scale(1.05);
}

.islamic-center-ornament:hover {
  transform: scale(1.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>