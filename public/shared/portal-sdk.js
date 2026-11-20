/**
 * OpenAI.com.my — Unified Academic Game Portal SDK (v2.5)
 * Connects user accounts, guest sessions, real-time XP/score accumulation,
 * live dynamic online presence (/api/telemetry + BroadcastChannel),
 * Admin Portal management, CSV/JSON data export, and future game integrations.
 */
(function (window) {
  'use strict';

  const PORTAL_STORAGE_KEY = 'openai-portal-v2';
  const PRESENCE_STORAGE_KEY = 'openai-portal-presence-v2';
  const ADMIN_SESSION_KEY = 'openai-admin-session-v2';
  const LEAP_STORAGE_KEY = 'learn-leap-v2-full';
  const TITAN_STORAGE_KEY = 'titan-academy-v1';
  const VOXEL_STORAGE_KEY = 'voxel-craft-v1';
  const FLORA_STORAGE_KEY = 'flora-scholars-v1';
  const SLUG_STORAGE_KEY = 'slug-math-v1';
  const SCIENCE_STORAGE_KEY = 'science-quest-v1';
  const TANKMATH_STORAGE_KEY = 'tankmath_save_v1';
  let isApplyingStorageSync = false;

  const AVATARS = ['🧑‍🎓', '🧙‍♂️', '🦸‍♀️', '🥷', '🧑‍🚀', '🦊', '🐯', '🐉', '⚡', '🌟', '🛡️', '🤖'];

  const AGE_BANDS = [
    { id: '5-6', label: 'Ages 5–6 (Preschool)', short: 'Preschool (5-6)' },
    { id: '7-9', label: 'Ages 7–9 (KSSR Lower Pri)', short: 'KSSR Pri 1-3' },
    { id: '10-12', label: 'Ages 10–12 (KSSR Upper Pri)', short: 'KSSR Pri 4-6' },
    { id: '13-15', label: 'Ages 13–15 (KSSM / PT3)', short: 'KSSM Form 1-3' },
    { id: '16+', label: 'Ages 16+ (SPM Scholar)', short: 'SPM Scholar' }
  ];

  const LANGUAGES = [
    { id: 'en', label: 'English', short: 'EN' },
    { id: 'ms', label: 'Bahasa Melayu', short: 'BM' },
    { id: 'zh', label: '中文 (Chinese)', short: '中文' }
  ];

  const MALAYSIAN_STATES = [
    'Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perak', 'Sarawak',
    'Sabah', 'Kedah', 'Kelantan', 'Pahang', 'Terengganu', 'Negeri Sembilan',
    'Melaka', 'Perlis', 'Putrajaya', 'Labuan'
  ];

  const BRAND_ARIA_LABEL = 'O.A.I. Malaysia - Open Academic Interactive: The Educational Game Portal';

  /**
   * 3D "O.A.I." Arcade Block Emblem SVG (for compact badges, favicons, and in-game HUD)
   */
  function getBrandLogoSvg(size = 44, idSuffix = 'main') {
    const w = Math.round(size * 2.15);
    const h = size;
    return `<svg width="${w}" height="${h}" viewBox="0 0 240 110" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${BRAND_ARIA_LABEL}" title="${BRAND_ARIA_LABEL}">
      <!-- Base Soft Elliptical Drop Shadow -->
      <ellipse cx="120" cy="98" rx="92" ry="6" fill="#1E1B4B" opacity="0.22"/>
      <!-- Sparkles & Confetti -->
      <circle cx="19" cy="18" r="2.5" fill="#EF4444"/>
      <circle cx="13" cy="28" r="3.5" fill="#14B8A6"/>
      <path d="M36 9L37.8 14.2L43 16L37.8 17.8L36 23L34.2 17.8L29 16L34.2 14.2L36 9Z" fill="#FBBF24"/>
      <path d="M72 8L75.2 15.8L83 19L75.2 22.2L72 30L68.8 22.2L61 19L68.8 15.8L72 8Z" fill="#14B8A6"/>
      <path d="M168 10L170.4 15.6L176 18L170.4 20.4L168 26L165.6 20.4L160 18L165.6 15.6L168 10Z" fill="#F87171"/>
      <path d="M222 18L224.6 24.4L231 27L224.6 29.6L222 36L219.4 29.6L213 27L219.4 24.4L222 18Z" fill="#FBBF24"/>
      <!-- Tile 1: O. Block (-rotate-6, Amber) -->
      <g transform="translate(18, 22) rotate(-6 34 34)">
        <rect x="-3" y="5" width="68" height="68" rx="15" fill="#D97706"/>
        <rect x="0" y="0" width="68" height="68" rx="15" fill="#FBBF24" stroke="#FEF08A" stroke-width="1.5"/>
        <path d="M 10 22 C 10 12 13 9 23 9" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" opacity="0.78"/>
        <path d="M 31 16 C 19 16 13 24 13 36 C 13 48 19 56 31 56 C 43 56 49 48 49 36 C 49 24 43 16 31 16 Z M 31 26 C 36 26 38 30 38 36 C 38 42 36 46 31 46 C 26 46 24 42 24 36 C 24 30 26 26 31 26 Z" fill="#110E2E" transform="translate(0, 3)"/>
        <path d="M 31 16 C 19 16 13 24 13 36 C 13 48 19 56 31 56 C 43 56 49 48 49 36 C 49 24 43 16 31 16 Z M 31 26 C 36 26 38 30 38 36 C 38 42 36 46 31 46 C 26 46 24 42 24 36 C 24 30 26 26 31 26 Z" fill="#1E1B4B"/>
        <circle cx="56" cy="51" r="5.2" fill="#1E1B4B"/>
      </g>
      <!-- Tile 3: I. Block (rotate-6, Mint-Teal) -->
      <g transform="translate(144, 22) rotate(6 34 34)">
        <rect x="3" y="5" width="68" height="68" rx="15" fill="#0F766E"/>
        <rect x="0" y="0" width="68" height="68" rx="15" fill="#14B8A6" stroke="#99F6E4" stroke-width="1.5"/>
        <path d="M 10 22 C 10 12 13 9 23 9" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" opacity="0.78"/>
        <circle cx="14" cy="49" r="5" fill="#FBBF24"/>
        <g transform="rotate(6 34 35)">
          <rect x="26" y="13" width="15" height="42" rx="7.5" fill="#CBD5E1"/>
          <rect x="27" y="11" width="15" height="41" rx="7.5" fill="#FFFFFF"/>
          <circle cx="34.5" cy="18" r="1.9" fill="#2563EB"/>
          <circle cx="30.8" cy="21.8" r="1.9" fill="#10B981"/>
          <circle cx="38.2" cy="21.8" r="1.9" fill="#EF4444"/>
          <circle cx="34.5" cy="25.5" r="1.9" fill="#F59E0B"/>
        </g>
        <circle cx="54" cy="51" r="5" fill="#EF4444"/>
      </g>
      <!-- Tile 2: A. Block (Center Upright, Coral-Red + Mortarboard Cap) -->
      <g transform="translate(82, 18)">
        <rect x="0" y="5" width="68" height="68" rx="15" fill="#B91C1C"/>
        <rect x="0" y="0" width="68" height="68" rx="15" fill="#EF4444" stroke="#FECDD3" stroke-width="1.5"/>
        <path d="M 10 22 C 10 12 13 9 23 9" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" opacity="0.78"/>
        <path d="M 26 17 C 27 14 29 12 32 12 C 35 12 37 14 38 17 L 49 47 C 51 50 49 54 45 54 C 41 54 39 52 38 49 L 37 45 L 27 45 L 26 49 C 25 52 23 54 19 54 C 15 54 13 50 15 47 L 26 17 Z M 29 36 L 35 36 L 32 25 L 29 36 Z" fill="#E2E8F0" transform="translate(0, 2.2)"/>
        <path d="M 26 17 C 27 14 29 12 32 12 C 35 12 37 14 38 17 L 49 47 C 51 50 49 54 45 54 C 41 54 39 52 38 49 L 37 45 L 27 45 L 26 49 C 25 52 23 54 19 54 C 15 54 13 50 15 47 L 26 17 Z M 29 36 L 35 36 L 32 25 L 29 36 Z" fill="#FFFFFF"/>
        <circle cx="56" cy="50" r="5.2" fill="#FFFFFF"/>
        <!-- Prominent Square Academic Cap (Graduation Mortarboard) on Top of A. -->
        <g transform="translate(22, -20) rotate(8 26 18)">
          <ellipse cx="26" cy="28" rx="18" ry="4.5" fill="rgba(15, 23, 42, 0.35)"/>
          <path d="M 13 17 L 12 26 C 12 31 19 34 26 34 C 33 34 40 31 40 26 L 39 17 Z" fill="#1E1B4B" stroke="#FBBF24" stroke-width="1.5"/>
          <path d="M 13 24.5 C 20 28 32 28 39 24.5" stroke="#FDE047" stroke-width="1.8" stroke-linecap="round" fill="none"/>
          <polygon points="0,14 26,3 52,14 26,25" fill="#0F172A" transform="translate(0, 2.2)"/>
          <polygon points="0,14 26,3 52,14 26,25" fill="#283578" stroke="#FBBF24" stroke-width="2" stroke-linejoin="round"/>
          <polygon points="6,14 26,5.8 46,14 26,22.2" fill="none" stroke="#60A5FA" stroke-width="0.9" opacity="0.65"/>
          <ellipse cx="26" cy="14" rx="3.5" ry="2.2" fill="#FBBF24" stroke="#B45309" stroke-width="0.9"/>
          <path d="M 26 14 Q 38 17.5 43 24 L 42.5 34" stroke="#FDE047" stroke-width="2.2" stroke-linecap="round" fill="none"/>
          <circle cx="42.5" cy="31.5" r="2" fill="#EF4444"/>
          <polygon points="40,33 45,33 46.5,39 38.5,39" fill="#FBBF24" stroke="#D97706" stroke-width="0.7"/>
        </g>
      </g>
    </svg>`;
  }

  /**
   * Full Horizontal Brand Lockup Component HTML ("O.A.I. Malaysia - Open Academic Interactive: The Educational Game Portal")
   * Replicates Logo.tsx with support for size = "sm" | "md" | "lg" and theme = "dark" | "light"
   */
  function getBrandLockupHtml(size = 'md', options = {}) {
    const SIZE_CONFIG = {
      sm: {
        containerGap: 'gap-2.5 sm:gap-3',
        emblemWrap: 'py-1 px-1',
        tileSize: 'w-7 h-7 sm:w-8 sm:h-8 rounded-[7px] sm:rounded-[8px]',
        tileOverlap: '-ml-0.5',
        centerLift: '-translate-y-0.5',
        bezelO: 'shadow-[-2px_3px_0px_#D97706,_-2px_5px_8px_rgba(217,119,6,0.32)]',
        bezelA: 'shadow-[0px_3px_0px_#B91C1C,_0px_5px_8px_rgba(185,28,28,0.32)]',
        bezelI: 'shadow-[2px_3px_0px_#0F766E,_2px_5px_8px_rgba(15,118,110,0.32)]',
        capClass: 'w-5 h-5 sm:w-5.5 sm:h-5.5 -top-2 -right-1.5',
        baseShadow: '-bottom-1 left-1.5 right-1.5 h-1.5 blur-[2px]',
        eyebrow: 'text-[7px] sm:text-[8px] tracking-[0.08em] mb-0.5',
        titleTop: 'text-[11.5px] sm:text-[13px] leading-[0.94] tracking-[-0.01em]',
        titleBottom: 'text-[13.2px] sm:text-[15px] leading-[0.94] tracking-[0.015em]',
        tagline: 'text-[5.5px] sm:text-[6.2px] tracking-[0.11em] mt-0.5',
      },
      md: {
        containerGap: 'gap-3 sm:gap-4',
        emblemWrap: 'py-1.5 px-1.5',
        tileSize: 'w-9 h-9 sm:w-11 sm:h-11 rounded-[9px] sm:rounded-[11px]',
        tileOverlap: '-ml-0.5',
        centerLift: '-translate-y-1',
        bezelO: 'shadow-[-2.5px_4px_0px_#D97706,_-3px_7px_10px_rgba(217,119,6,0.35)]',
        bezelA: 'shadow-[0px_4px_0px_#B91C1C,_0px_7px_10px_rgba(185,28,28,0.35)]',
        bezelI: 'shadow-[2.5px_4px_0px_#0F766E,_3px_7px_10px_rgba(15,118,110,0.35)]',
        capClass: 'w-6 h-6 sm:w-7 sm:h-7 -top-3 -right-2',
        baseShadow: '-bottom-1.5 left-2 right-2 h-2 blur-[3px]',
        eyebrow: 'text-[8.5px] sm:text-[10px] tracking-[0.08em] mb-0.5',
        titleTop: 'text-[14px] sm:text-[16.5px] leading-[0.93] tracking-[-0.01em]',
        titleBottom: 'text-[16px] sm:text-[19px] leading-[0.93] tracking-[0.015em]',
        tagline: 'text-[6.5px] sm:text-[7.8px] tracking-[0.12em] mt-0.5',
      },
      lg: {
        containerGap: 'gap-4 sm:gap-5 md:gap-6',
        emblemWrap: 'py-2 px-2',
        tileSize: 'w-12 h-12 sm:w-15 sm:h-15 md:w-[68px] md:h-[68px] rounded-[13px] sm:rounded-[15px] md:rounded-[17px]',
        tileOverlap: '-ml-1',
        centerLift: '-translate-y-1 sm:-translate-y-1.5',
        bezelO: 'shadow-[-3.5px_6px_0px_#D97706,_-4px_10px_16px_rgba(217,119,6,0.4)]',
        bezelA: 'shadow-[0px_6px_0px_#B91C1C,_0px_10px_16px_rgba(185,28,28,0.4)]',
        bezelI: 'shadow-[3.5px_6px_0px_#0F766E,_4px_10px_16px_rgba(15,118,110,0.4)]',
        capClass: 'w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 -top-3.5 sm:-top-4.5 -right-2.5 sm:-right-3',
        baseShadow: '-bottom-2 left-3 right-3 h-3 blur-[4px]',
        eyebrow: 'text-[10px] sm:text-[12px] md:text-[14px] tracking-[0.08em] mb-0.5',
        titleTop: 'text-[18.5px] sm:text-[23.5px] md:text-[29px] leading-[0.92] tracking-[-0.01em]',
        titleBottom: 'text-[21.5px] sm:text-[27px] md:text-[33.5px] leading-[0.92] tracking-[0.015em]',
        tagline: 'text-[8px] sm:text-[10px] md:text-[11.5px] tracking-[0.135em] mt-1',
      }
    };

    const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.md;
    const isDark = (options.theme || 'dark') === 'dark';
    const hideTaglineOnMobile = options.hideTaglineOnMobile !== undefined ? options.hideTaglineOnMobile : (size !== 'lg');
    const extraClass = options.className || '';

    return `
      <div
        role="img"
        aria-label="${BRAND_ARIA_LABEL}"
        title="${BRAND_ARIA_LABEL}"
        class="group inline-flex items-center select-none bg-transparent ${cfg.containerGap} ${extraClass}"
        style="font-family: 'Fredoka', 'Nunito', 'Plus Jakarta Sans', sans-serif;"
      >
        <!-- 1. Left Side: The 3D "O.A.I." Arcade Block Emblem -->
        <div class="relative inline-flex items-center justify-center flex-shrink-0 ${cfg.emblemWrap}">
          ${isDark ? '<div class="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400/15 via-rose-500/15 to-teal-400/15 blur-xl pointer-events-none" aria-hidden="true"></div>' : ''}
          <!-- Floating 4-Point Star Sparkles & Confetti Dots -->
          <svg
            class="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none z-20 overflow-visible"
            viewBox="0 0 245 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="19" cy="18" r="2.2" fill="#FB7185" />
            <circle cx="13" cy="28" r="3.4" fill="#2DD4BF" />
            <path d="M36 8Q36.5 14.5 43 15Q36.5 15.5 36 22Q35.5 15.5 29 15Q35.5 14.5 36 8Z" fill="#FBBF24" />
            <path d="M67 8Q68 18 78 19Q68 20 67 30Q66 20 56 19Q66 18 67 8Z" fill="#2DD4BF" />
            <path d="M84 8Q84.5 12 88.5 12.5Q84.5 13 84 17Q83.5 13 79.5 12.5Q83.5 12 84 8Z" fill="#FBBF24" />
            <path d="M170 10Q170.8 16.2 177 17Q170.8 17.8 170 24Q169.2 17.8 163 17Q169.2 16.2 170 10Z" fill="#FB7185" />
            <path d="M224 18Q224.8 25.2 232 26Q224.8 26.8 224 34Q223.2 26.8 216 26Q223.2 25.2 224 18Z" fill="#FBBF24" />
            <circle cx="234" cy="37" r="2.6" fill="#2DD4BF" />
            <line x1="6" y1="84" x2="12" y2="83" stroke="#FB7185" stroke-width="2.6" stroke-linecap="round" />
            <line x1="8" y1="92" x2="14" y2="88" stroke="#FB7185" stroke-width="2.6" stroke-linecap="round" />
            <circle cx="18" cy="91" r="2" fill="${isDark ? '#A5B4FC' : '#1E1B4B'}" opacity="0.75" />
            <path d="M68 85Q68.6 90.4 74 91Q68.6 91.6 68 97Q67.4 91.6 62 91Q67.4 90.4 68 85Z" fill="#2DD4BF" />
            <path d="M150 83Q150.8 90.2 158 91Q150.8 91.8 150 99Q149.2 91.8 142 91Q149.2 90.2 150 83Z" fill="#FB7185" />
            <path d="M229 76Q229.6 80.4 234 81Q229.6 81.6 229 86Q228.4 81.6 224 81Q228.4 80.4 229 76Z" fill="#FB923C" />
            <circle cx="219" cy="94" r="2.4" fill="#FBBF24" />
          </svg>

          <!-- Base Shadow -->
          <div class="absolute ${cfg.baseShadow} rounded-full ${isDark ? 'bg-black/65' : 'bg-[#1E1B4B]/22'} pointer-events-none" aria-hidden="true"></div>

          <!-- Tile 1 ("O." Block) -->
          <div class="relative -rotate-6 bg-amber-400 bg-gradient-to-br from-[#FDE047] via-[#FBBF24] to-[#F59E0B] ${cfg.tileSize} ${cfg.bezelO} border border-[#FEF08A]/85 flex items-center justify-center transition-transform duration-300 group-hover:-rotate-12">
            <svg viewBox="0 0 100 100" class="w-full h-full overflow-visible" aria-hidden="true">
              <path d="M 14 31 C 14 16 17 13 32 13" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.8" />
              <path d="M 43 23 C 26 23 17 35 17 52 C 17 69 26 81 43 81 C 60 81 69 69 69 52 C 69 35 60 23 43 23 Z M 43 38 C 50 38 53 43 53 52 C 53 61 50 66 43 66 C 36 66 33 61 33 52 C 33 43 36 38 43 38 Z" fill="#110E2E" transform="translate(0, 4.5)" />
              <path d="M 43 23 C 26 23 17 35 17 52 C 17 69 26 81 43 81 C 60 81 69 69 69 52 C 69 35 60 23 43 23 Z M 43 38 C 50 38 53 43 53 52 C 53 61 50 66 43 66 C 36 66 33 61 33 52 C 33 43 36 38 43 38 Z" fill="#1E1B4B" />
              <path d="M 30 30 C 34 27 38 26 43 26" stroke="#4338CA" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
              <circle cx="79" cy="76.5" r="7.5" fill="#110E2E" />
              <circle cx="79" cy="73.5" r="7.5" fill="#1E1B4B" />
            </svg>
          </div>

          <!-- Tile 2 ("A." Block) -->
          <div class="relative z-10 ${cfg.centerLift} ${cfg.tileOverlap} bg-rose-500 bg-gradient-to-br from-[#FB7185] via-[#EF4444] to-[#DC2626] ${cfg.tileSize} ${cfg.bezelA} border border-[#FECDD3]/80 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
            <!-- Perched Navy-Indigo Graduation Mortarboard Cap -->
            <svg viewBox="0 0 80 70" class="absolute ${cfg.capClass} z-30 pointer-events-none overflow-visible drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]" aria-hidden="true">
              <path d="M 22 33 L 20 46 C 20 53 32 58 43 56 C 53 54 58 49 58 42 L 56 31 Z" fill="#1E1B4B" stroke="${isDark ? '#6366F1' : '#312E81'}" stroke-width="1.2" />
              <path d="M 22 44 C 28 50 42 52 56 44" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" fill="none" />
              <polygon points="6,23 43,12 75,31 38,43" fill="#110E2E" transform="translate(0, 3.5)" />
              <polygon points="6,23 43,12 75,31 38,43" fill="#283578" stroke="${isDark ? '#818CF8' : '#3B4990'}" stroke-width="1.6" stroke-linejoin="round" />
              <ellipse cx="41" cy="27" rx="4" ry="2.5" fill="#F97316" />
              <path d="M 42 27 Q 57 32 62 41 L 60 58" stroke="#EF4444" stroke-width="3" stroke-linecap="round" fill="none" />
              <circle cx="60.5" cy="53" r="2.4" fill="#FBBF24" />
              <path d="M 58 54 L 56 63 L 63 64 L 62 54 Z" fill="#EF4444" />
            </svg>

            <svg viewBox="0 0 100 100" class="w-full h-full overflow-visible" aria-hidden="true">
              <path d="M 14 31 C 14 16 17 13 32 13" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.8" />
              <path d="M 36 25 C 38 20 41 18 45 18 C 49 18 52 20 54 25 L 71 68 C 73 73 70 79 64 79 C 59 79 56 76 55 72 L 53 66 L 37 66 L 35 72 C 34 76 31 79 26 79 C 20 79 17 73 19 68 L 36 25 Z M 40 53 L 50 53 L 45 37 L 40 53 Z" fill="#991B1B" opacity="0.55" transform="translate(0, 5)" />
              <path d="M 36 25 C 38 20 41 18 45 18 C 49 18 52 20 54 25 L 71 68 C 73 73 70 79 64 79 C 59 79 56 76 55 72 L 53 66 L 37 66 L 35 72 C 34 76 31 79 26 79 C 20 79 17 73 19 68 L 36 25 Z M 40 53 L 50 53 L 45 37 L 40 53 Z" fill="#E2E8F0" transform="translate(0, 3)" />
              <path d="M 36 25 C 38 20 41 18 45 18 C 49 18 52 20 54 25 L 71 68 C 73 73 70 79 64 79 C 59 79 56 76 55 72 L 53 66 L 37 66 L 35 72 C 34 76 31 79 26 79 C 20 79 17 73 19 68 L 36 25 Z M 40 53 L 50 53 L 45 37 L 40 53 Z" fill="#FFFFFF" />
              <circle cx="81" cy="76.5" r="7.5" fill="#991B1B" opacity="0.5" />
              <circle cx="81" cy="74.5" r="7.5" fill="#E2E8F0" />
              <circle cx="81" cy="73" r="7.5" fill="#FFFFFF" />
            </svg>
          </div>

          <!-- Tile 3 ("I." Block) -->
          <div class="relative rotate-6 ${cfg.tileOverlap} bg-teal-500 bg-gradient-to-br from-[#2DD4BF] via-[#14B8A6] to-[#0D9488] ${cfg.tileSize} ${cfg.bezelI} border border-[#99F6E4]/80 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <svg viewBox="0 0 100 100" class="w-full h-full overflow-visible" aria-hidden="true">
              <path d="M 14 31 C 14 16 17 13 32 13" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.8" />
              <circle cx="20" cy="75.5" r="7.5" fill="#B45309" opacity="0.75" />
              <circle cx="20" cy="72.5" r="7.5" fill="#FBBF24" />
              <circle cx="18" cy="70.5" r="2.2" fill="#FEF08A" />
              <g transform="rotate(6 50 52)">
                <rect x="39" y="22" width="22" height="62" rx="11" fill="#0F766E" opacity="0.7" />
                <rect x="38" y="20" width="22" height="61" rx="11" fill="#CBD5E1" />
                <rect x="40" y="18" width="22" height="60" rx="11" fill="#FFFFFF" />
                <circle cx="51" cy="28" r="2.7" fill="#2563EB" />
                <circle cx="45.5" cy="33.5" r="2.7" fill="#10B981" />
                <circle cx="56.5" cy="33.5" r="2.7" fill="#EF4444" />
                <circle cx="51" cy="39" r="2.7" fill="#F59E0B" />
              </g>
              <circle cx="79" cy="78.5" r="7.5" fill="#991B1B" opacity="0.7" />
              <circle cx="79" cy="75.5" r="7.5" fill="#EF4444" />
              <circle cx="77" cy="73.5" r="2.2" fill="#FCA5A5" />
            </svg>
          </div>
        </div>

        <!-- 2. Right Side: 4-Line Stacked Typography Lockup -->
        <div class="flex flex-col items-center justify-center text-center leading-none">
          <span class="font-extrabold uppercase ${isDark ? 'text-[#E0E7FF]' : 'text-[#1E1B4B]'} ${cfg.eyebrow}" style="font-family: 'Fredoka', 'Nunito', sans-serif; ${isDark ? 'text-shadow: 0 1.5px 0 #1E1B4B, 0 2px 6px rgba(0,0,0,0.6);' : ''}">MALAYSIA</span>
          <span class="font-extrabold uppercase whitespace-nowrap ${isDark ? 'text-white' : 'text-[#1E1B4B]'} ${cfg.titleTop}" style="font-family: 'Fredoka', 'Nunito', sans-serif; ${isDark ? 'text-shadow: 0 2.5px 0 #1E1B4B, 0 4px 12px rgba(15,23,42,0.8);' : ''}">OPEN ACADEMIC</span>
          <span class="font-extrabold uppercase whitespace-nowrap bg-gradient-to-r from-teal-500 via-emerald-400 to-rose-500 bg-clip-text text-transparent ${cfg.titleBottom}" style="font-family: 'Fredoka', 'Nunito', sans-serif; background-image: ${isDark ? 'linear-gradient(90deg, #2DD4BF 0%, #14B8A6 45%, #FB7185 55%, #F87171 100%)' : 'linear-gradient(90deg, #14B8A6 0%, #14B8A6 44%, #F87171 56%, #EF4444 100%)'}; ${isDark ? 'filter: drop-shadow(0 2.5px 0 #1E1B4B);' : ''}">INTERACTIVE</span>
          <span class="${hideTaglineOnMobile ? 'hidden sm:block' : 'block'} font-bold uppercase whitespace-nowrap ${isDark ? 'text-[#CBD5E1]' : 'text-[#1E1B4B]'} ${cfg.tagline}" style="font-family: 'Plus Jakarta Sans', 'Nunito', sans-serif; ${isDark ? 'text-shadow: 0 1px 3px rgba(0,0,0,0.75);' : ''}">THE EDUCATIONAL GAME PORTAL</span>
        </div>
      </div>
    `;
  }

  // Built-in Game Registry (Extensible for 12+ games ecosystem)
  const DEFAULT_GAMES = [
    {
      id: 'learn-and-leap',
      title: 'Learn & Leap Adventure v4',
      genre: '3D Platformer',
      category: 'all-subjects',
      status: 'live',
      path: './learn-and-leap/index.html',
      storageKey: LEAP_STORAGE_KEY,
      maxLevels: 100,
      maxStars: 300,
      icon: '✦',
      accentColor: '#38bdf8',
      badgeText: 'LIVE · 3D WEBGL',
      subjects: ['Mathematics', 'English', 'Science', 'General Knowledge'],
      description: 'Run, jump, and cast energy in real 3D! Awaken educational shrines in Math, English, Science & GK across 10 mythical worlds.',
      coverImage: './learn-and-leap/assets/world-01.webp',
      heroSprite: './learn-and-leap/assets/ari.png'
    },
    {
      id: 'titan-academy',
      title: 'Titan Academy',
      genre: 'RPG Battle',
      category: 'all-subjects',
      status: 'live',
      path: './titan-academy/index.html',
      storageKey: TITAN_STORAGE_KEY,
      maxLevels: 100,
      maxStars: 300,
      icon: '⚔️',
      accentColor: '#a855f7',
      badgeText: 'LIVE · 100 MONSTERS',
      subjects: ['Mathematics', 'Science', 'English', 'Bahasa Melayu', 'Sejarah'],
      description: 'Battle 100 illustrated monsters and conquer dungeons by answering KSSR/KSSM academic quiz questions!',
      coverImage: './titan-academy/art-source/monster-atlas-2.png',
      heroSprite: null
    },
    {
      id: 'voxel-craft-my',
      title: 'Voxel Craft MY',
      genre: '3D Voxel Sandbox',
      category: 'all-subjects',
      status: 'live',
      path: './voxel-craft-my/index.html',
      storageKey: VOXEL_STORAGE_KEY,
      maxLevels: 100,
      maxStars: 300,
      icon: '⛏️',
      accentColor: '#10b981',
      badgeText: 'LIVE · 100 VOXEL BIOMES',
      subjects: ['Mathematics', 'Science', 'English', 'Bahasa Melayu', 'General Knowledge'],
      description: 'Mine glowing Knowledge Ores, answer KSSR/KSSM/SPM questions to craft 3D Malaysian Blueprint structures, shatter Obsidian Shields, and conquer 10 Voxel Bosses!',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'flora-scholars',
      title: 'Flora Scholars: Botanical Defense',
      genre: 'Tactical Botanical Tower Defense',
      category: 'all-subjects',
      status: 'live',
      path: './flora-scholars/index.html',
      storageKey: FLORA_STORAGE_KEY,
      maxLevels: 100,
      maxStars: 300,
      icon: '🌻',
      accentColor: '#22c55e',
      badgeText: 'LIVE · 100 BOTANICAL STAGES',
      subjects: ['Mathematics', 'Science', 'English', 'Bahasa Melayu', 'Sejarah'],
      description: 'Defend 10 Malaysian Botanical Worlds by harvesting Solar Quiz Blooms and commanding native flora defenders (Durian Shield, Rafflesia Bomb, Hibiscus Laser)!',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'slug-math',
      title: 'Slug Math: Tactical Command',
      genre: '2.5D Run-and-Gun Math Arcade',
      category: 'math',
      status: 'live',
      path: './slug-math/index.html',
      storageKey: SLUG_STORAGE_KEY,
      maxLevels: 5,
      maxStars: 15,
      icon: '🪖',
      accentColor: '#f59e0b',
      badgeText: 'LIVE · 5 TACTICAL SECTORS',
      subjects: ['Mathematics', 'Arithmetic', 'Multiplication', 'Fractions', 'Money & Geometry'],
      description: 'Command the SV-001 Math Slug tank, rescue POW Scholars, upgrade heavy ordnance in the R&D Lab, and master KSSR/KSSM mathematics across 5 extended 4,800m combat sectors!',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'math-galaxy',
      title: 'Math Galaxy: Nebula Odyssey',
      genre: 'Space Puzzle RPG',
      category: 'math',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'math-galaxy-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '🚀',
      accentColor: '#60a5fa',
      badgeText: 'UPCOMING WAVE 1',
      subjects: ['Mathematics', 'Algebra', 'Geometry', 'KSSM Maths'],
      description: 'Navigate star systems by solving KSSR & KSSM algebra, fractions, and geometry challenges in zero gravity.',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'science-quest-my',
      title: 'Science Quest MY: Lab Defenders',
      genre: 'Tactical STEM Tower Defense',
      category: 'science',
      status: 'live',
      path: './games/science-quest-my/index.html',
      storageKey: SCIENCE_STORAGE_KEY,
      maxLevels: 25,
      maxStars: 75,
      icon: '🔬',
      accentColor: '#22d3ee',
      badgeText: '3D · PLAYABLE · 25 LAB OPS',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Earth & Space', 'STEM Math'],
      description: '3D diorama STEM tower defense! Solve EN/BM/中文 quizzes to earn Energy for building & upgrading 5 architectural tower classes against waves of increasing difficulty and Sector Bosses.',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'tankmath-armageddon',
      title: 'TankMath Armageddon — Math Artillery',
      genre: 'Math Artillery',
      category: 'math',
      status: 'live',
      path: './games/tankmath-armageddon/index.html',
      storageKey: TANKMATH_STORAGE_KEY,
      maxLevels: 10,
      maxStars: 30,
      icon: '🚀',
      accentColor: '#f97316',
      badgeText: '2D ARTILLERY · UPGRADE SHOP',
      subjects: ['Mathematics', 'Arithmetic', 'Algebra', 'Geometry', 'KSSR & KSSM'],
      description: '2D vector tank artillery educational math game! Solve curriculum equations to lock ballistics trajectories, upgrade heavy shells, and blast rival tanks across destructible terrain.',
      coverImage: '/assets/games/tankmath-scene.png',
      heroSprite: null
    },
    {
      id: 'kata-warrior-bm',
      title: 'Kata Warrior: Legenda Bahasa',
      genre: 'Action Word RPG',
      category: 'language',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'kata-warrior-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '🗡️',
      accentColor: '#f59e0b',
      badgeText: 'UPCOMING WAVE 1',
      subjects: ['Bahasa Melayu', 'Tatabahasa', 'Peribahasa', 'KSSR & KSSM'],
      description: 'Master Tatabahasa, Peribahasa, and Komsas in an epic Nusantara martial-arts adventure across legendary Malaysian kingdoms.',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'chrono-sejarah-my',
      title: 'Chrono Malaysia: Sejarah Odyssey',
      genre: 'Time-Travel Adventure',
      category: 'sejarah',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'chrono-sejarah-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '⏳',
      accentColor: '#f97316',
      badgeText: 'UPCOMING WAVE 2',
      subjects: ['Sejarah', 'General Knowledge', 'Kemerdekaan', 'SPM Sejarah'],
      description: 'Travel from the Melaka Sultanate to Merdeka 1957 and modern Malaysia by solving historical mysteries and primary source quests.',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'grammar-gladiators',
      title: 'Grammar Gladiators Arena',
      genre: 'Word Battle Tactics',
      category: 'language',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'grammar-gladiators-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '🛡️',
      accentColor: '#ec4899',
      badgeText: 'UPCOMING WAVE 2',
      subjects: ['English', 'CEFR Grammar', 'Vocabulary', 'Comprehension'],
      description: 'Fast-paced CEFR-aligned English grammar, vocabulary, and idiom duels designed for Malaysian primary and secondary scholars.',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'cyber-coder-my',
      title: 'Cyber Coder MY: AI & Logic',
      genre: 'Coding & Logic Tactics',
      category: 'science',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'cyber-coder-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '🤖',
      accentColor: '#06b6d4',
      badgeText: 'UPCOMING WAVE 2',
      subjects: ['Science', 'RBT & Coding', 'Logic', 'AI Literacy'],
      description: 'Program autonomous drones and solve computational thinking puzzles aligned with RBT (Reka Bentuk & Teknologi) and Asas Sains Komputer.',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'pasar-tycoon-math',
      title: 'Pasar Malam Tycoon: Ringgit Master',
      genre: 'Financial Math Sim',
      category: 'math',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'pasar-tycoon-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '🏮',
      accentColor: '#eab308',
      badgeText: 'UPCOMING WAVE 3',
      subjects: ['Mathematics', 'Financial Literacy', 'Percentages', 'Prinsip Perakaunan'],
      description: 'Build a bustling Malaysian night market empire using mental arithmetic, Ringgit budgeting, profit margins, and percentages!',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'eco-borneo-3d',
      title: 'Eco Borneo 3D: Rainforest Rescue',
      genre: '3D Ecology Sim',
      category: 'science',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'eco-borneo-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '🦧',
      accentColor: '#22c55e',
      badgeText: 'UPCOMING WAVE 3',
      subjects: ['Science', 'Biology', 'Geography', 'Environmental STEM'],
      description: 'Explore Sarawak & Sabah rainforest biomes in 3D, protect endangered wildlife, and solve food-web and climate science missions.',
      coverImage: null,
      heroSprite: null
    },
    {
      id: 'spm-boss-rush',
      title: 'SPM Trial Boss Rush',
      genre: 'High-Speed Quiz Roguelike',
      category: 'all-subjects',
      status: 'upcoming',
      path: '#game-sdk-section',
      storageKey: 'spm-boss-rush-v1',
      maxLevels: 100,
      maxStars: 300,
      icon: '⚡',
      accentColor: '#f43f5e',
      badgeText: 'UPCOMING WAVE 3',
      subjects: ['Mathematics', 'Science', 'Sejarah', 'Bahasa Melayu', 'English'],
      description: 'Timed exam-prep boss gauntlets covering core KSSR, KSSM, and SPM subjects with instant step-by-step marking scheme explanations.',
      coverImage: null,
      heroSprite: null
    }
  ];

  // Peer scholars for realistic Malaysian leaderboard competition
  const BASE_SCHOLARS = [
    { id: 'peer_1', name: 'Nurul Aina', avatar: '🦸‍♀️', state: 'Selangor', school: 'SMK Subang Utama', ageBand: '16+', leapXp: 2450, titanXp: 1800, voxelXp: 2200, floraXp: 2350, slugXp: 2150, scienceXp: 2280, tankXp: 2190, leapStars: 36, titanStars: 28, voxelStars: 32, floraStars: 34, slugStars: 15, scienceStars: 42, tankStars: 24 },
    { id: 'peer_2', name: 'Ahmad Rayyan', avatar: '🧙‍♂️', state: 'Kuala Lumpur', school: 'SK Taman Tun Dr Ismail', ageBand: '10-12', leapXp: 2100, titanXp: 1800, voxelXp: 1950, floraXp: 2050, slugXp: 1920, scienceXp: 2010, tankXp: 1960, leapStars: 31, titanStars: 27, voxelStars: 29, floraStars: 30, slugStars: 14, scienceStars: 38, tankStars: 21 },
    { id: 'peer_3', name: 'Siti Humaira', avatar: '🌟', state: 'Johor', school: 'SMK Sultan Ismail', ageBand: '13-15', leapXp: 1920, titanXp: 1800, voxelXp: 1750, floraXp: 1850, slugXp: 1760, scienceXp: 1840, tankXp: 1780, leapStars: 28, titanStars: 26, voxelStars: 25, floraStars: 27, slugStars: 13, scienceStars: 33, tankStars: 19 },
    { id: 'peer_4', name: 'Brendan Lim', avatar: '🐉', state: 'Penang', school: 'SJK(C) Chung Hwa', ageBand: '10-12', leapXp: 1750, titanXp: 1450, voxelXp: 1600, floraXp: 1680, slugXp: 1580, scienceXp: 1640, tankXp: 1590, leapStars: 25, titanStars: 21, voxelStars: 24, floraStars: 24, slugStars: 12, scienceStars: 29, tankStars: 17 },
    { id: 'peer_5', name: 'Harith Iskandar', avatar: '🥷', state: 'Perak', school: 'SMK Anderson Ipoh', ageBand: '16+', leapXp: 1400, titanXp: 1350, voxelXp: 1500, floraXp: 1450, slugXp: 1390, scienceXp: 1420, tankXp: 1380, leapStars: 20, titanStars: 19, voxelStars: 22, floraStars: 21, slugStars: 11, scienceStars: 25, tankStars: 15 },
    { id: 'peer_6', name: 'Mei Ling Tan', avatar: '🦊', state: 'Sarawak', school: 'SMK Green Road Kuching', ageBand: '13-15', leapXp: 1200, titanXp: 1100, voxelXp: 1300, floraXp: 1250, slugXp: 1180, scienceXp: 1220, tankXp: 1170, leapStars: 18, titanStars: 16, voxelStars: 18, floraStars: 18, slugStars: 10, scienceStars: 21, tankStars: 13 },
    { id: 'peer_7', name: 'Kavitha R.', avatar: '⚡', state: 'Negeri Sembilan', school: 'SMK King George V', ageBand: '16+', leapXp: 950, titanXp: 900, voxelXp: 1100, floraXp: 1050, slugXp: 980, scienceXp: 1040, tankXp: 990, leapStars: 14, titanStars: 13, voxelStars: 15, floraStars: 15, slugStars: 9, scienceStars: 18, tankStars: 11 },
    { id: 'peer_8', name: 'Adam Danial', avatar: '🧑‍🚀', state: 'Kedah', school: 'SK Sultanah Asma', ageBand: '7-9', leapXp: 750, titanXp: 650, voxelXp: 900, floraXp: 820, slugXp: 790, scienceXp: 810, tankXp: 770, leapStars: 11, titanStars: 9, voxelStars: 12, floraStars: 11, slugStars: 8, scienceStars: 14, tankStars: 9 },
    { id: 'peer_9', name: 'Faris Zulkifli', avatar: '🐯', state: 'Pahang', school: 'SK Indera Mahkota', ageBand: '10-12', leapXp: 550, titanXp: 400, voxelXp: 700, floraXp: 640, slugXp: 610, scienceXp: 620, tankXp: 580, leapStars: 8, titanStars: 6, voxelStars: 10, floraStars: 9, slugStars: 6, scienceStars: 11, tankStars: 7 },
    { id: 'peer_10', name: 'Chong Wei Jie', avatar: '🤖', state: 'Melaka', school: 'SMJK Yok Bin', ageBand: '13-15', leapXp: 350, titanXp: 250, voxelXp: 500, floraXp: 450, slugXp: 430, scienceXp: 440, tankXp: 410, leapStars: 5, titanStars: 4, voxelStars: 7, floraStars: 6, slugStars: 5, scienceStars: 8, tankStars: 5 },
    { id: 'peer_11', name: 'Zara Sofea', avatar: '🛡️', state: 'Sabah', school: 'SK Sri Gaya', ageBand: '7-9', leapXp: 250, titanXp: 150, voxelXp: 350, floraXp: 300, slugXp: 290, scienceXp: 310, tankXp: 280, leapStars: 4, titanStars: 2, voxelStars: 5, floraStars: 4, slugStars: 3, scienceStars: 5, tankStars: 3 }
  ];

  // Daily Quests Definition
  const DAILY_QUESTS = [
    {
      id: 'quest_tankmath_missions',
      title: 'Solve 6 Artillery Equations in TankMath',
      subtitle: 'Lock ballistics trajectories and blast enemy tanks across terrain!',
      icon: '🚀',
      color: 'amber',
      xpReward: 250,
      target: 6,
      gameLink: './games/tankmath-armageddon/index.html',
      gameName: 'TankMath Armageddon',
      getValue: (stats) => stats.games['tankmath-armageddon'] ? Math.max(stats.games['tankmath-armageddon'].questionsSolved || 0, (stats.games['tankmath-armageddon'].levelsCompleted || 0) * 3) : 0,
      unit: 'equations solved'
    },
    {
      id: 'quest_science_td',
      title: 'Clear 2 Lab Operations in Science Quest MY',
      subtitle: 'Build Laser, Acid, Cryo & Tesla turrets along winding lab paths!',
      icon: '🔬',
      color: 'cyan',
      xpReward: 250,
      target: 2,
      gameLink: './games/science-quest-my/index.html',
      gameName: 'Science Quest MY',
      getValue: (stats) => stats.games['science-quest-my'] ? Math.max(stats.games['science-quest-my'].levelsCompleted, Math.floor((stats.games['science-quest-my'].questionsSolved || 0) / 3)) : 0,
      unit: 'lab ops cleared'
    },
    {
      id: 'quest_slug_missions',
      title: 'Clear 2 Sectors in Slug Math Command',
      subtitle: 'Command the SV-001 Math Slug tank & rescue POW Scholars!',
      icon: '🪖',
      color: 'amber',
      xpReward: 250,
      target: 2,
      gameLink: './slug-math/index.html',
      gameName: 'Slug Math Command',
      getValue: (stats) => stats.games['slug-math'] ? Math.max(stats.games['slug-math'].levelsCompleted, Math.floor((stats.games['slug-math'].questionsSolved || 0) / 3)) : 0,
      unit: 'sectors or missions cleared'
    },
    {
      id: 'quest_flora_stages',
      title: 'Defend 2 Stages in Flora Scholars',
      subtitle: 'Harvest Solar Quiz Blooms & command native Malaysian flora!',
      icon: '🌻',
      color: 'green',
      xpReward: 250,
      target: 2,
      gameLink: './flora-scholars/index.html',
      gameName: 'Flora Scholars',
      getValue: (stats) => stats.games['flora-scholars'] ? stats.games['flora-scholars'].levelsCompleted : 0,
      unit: 'botanical stages cleared'
    },
    {
      id: 'quest_voxel_blueprints',
      title: 'Craft 2 Blueprints in Voxel Craft MY',
      subtitle: 'Mine knowledge ores & construct 3D Malaysian architecture!',
      icon: '⛏️',
      color: 'emerald',
      xpReward: 250,
      target: 2,
      gameLink: './voxel-craft-my/index.html',
      gameName: 'Voxel Craft MY',
      getValue: (stats) => stats.games['voxel-craft-my'] ? stats.games['voxel-craft-my'].levelsCompleted : 0,
      unit: 'blueprints completed'
    },
    {
      id: 'quest_leap_runes',
      title: 'Awaken 4 Runes in Learn & Leap 3D',
      subtitle: 'Math, English, Science & GK shrines!',
      icon: '✦',
      color: 'cyan',
      xpReward: 250,
      target: 4,
      gameLink: './learn-and-leap/index.html',
      gameName: 'Learn & Leap 3D',
      getValue: (stats) => stats.games['learn-and-leap'] ? stats.games['learn-and-leap'].runesAwakened : 0,
      unit: 'runes awakened'
    },
    {
      id: 'quest_titan_monsters',
      title: 'Defeat 3 Monsters in Titan Academy',
      subtitle: 'Battle academic dungeon monsters & bosses!',
      icon: '⚔️',
      color: 'green',
      xpReward: 200,
      target: 3,
      gameLink: './titan-academy/index.html',
      gameName: 'Titan Academy',
      getValue: (stats) => stats.games['titan-academy'] ? stats.games['titan-academy'].levelsCompleted : 0,
      unit: 'monsters defeated'
    },
    {
      id: 'quest_curriculum_q',
      title: 'Answer 6 Curriculum Questions',
      subtitle: 'Solve questions in Learn & Leap or Titan Academy',
      icon: '🇲🇾',
      color: 'amber',
      xpReward: 150,
      target: 6,
      gameLink: './learn-and-leap/index.html',
      gameName: 'Any Live Game',
      getValue: (stats) => stats.totalQuestionsSolved,
      unit: 'questions answered'
    },
    {
      id: 'quest_total_stars',
      title: 'Collect 6 Victory Stars (★)',
      subtitle: 'Earn stars by clearing levels across any game',
      icon: '⭐',
      color: 'purple',
      xpReward: 200,
      target: 6,
      gameLink: './titan-academy/index.html',
      gameName: 'Any Live Game',
      getValue: (stats) => stats.totalStars,
      unit: 'stars earned'
    }
  ];

  function safeParse(json, fallback) {
    if (!json) return fallback;
    try {
      return JSON.parse(json);
    } catch (_) {
      return fallback;
    }
  }

  function createDefaultAccount(overrides = {}) {
    return Object.assign({
      id: 'guest',
      isGuest: true,
      name: 'Guest Scholar',
      avatar: '🧑‍🎓',
      school: 'OpenAI.com.my Guest',
      state: 'Kuala Lumpur',
      ageBand: '10-12',
      lang: 'en',
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      bonusXp: 0,
      claimedQuests: {},
      dailyBonusClaimed: false,
      customEvents: {
        shrinesAnswered: 0,
        questionsAnswered: 0,
        monstersDefeated: 0
      },
      gameSnapshots: {},
      customGameScores: {}
    }, overrides);
  }

  function loadPortalStore() {
    const raw = safeParse(localStorage.getItem(PORTAL_STORAGE_KEY), null);
    if (raw && raw.accounts && raw.activeAccountId && raw.accounts[raw.activeAccountId]) {
      if (!Array.isArray(raw.customGames)) raw.customGames = [];
      if (!raw.registeredGames || typeof raw.registeredGames !== 'object') raw.registeredGames = {};
      if (!Array.isArray(raw.activityLog)) raw.activityLog = [];
      if (!raw.adminConfig) {
        raw.adminConfig = {
          passwordHash: '92a98eb0d6611bc4abf7424e438cd895e02ba2776547ce5bfd64be41e0b29d2b',
          onlineDisplayMode: 'hybrid', // 'hybrid' or 'strict_real'
          communityBaseCount: 380
        };
      } else {
        delete raw.adminConfig.passcode;
        if (!raw.adminConfig.passwordHash) {
          raw.adminConfig.passwordHash = '92a98eb0d6611bc4abf7424e438cd895e02ba2776547ce5bfd64be41e0b29d2b';
        }
      }
      return raw;
    }

    const guest = createDefaultAccount();
    const existingLeap = localStorage.getItem(LEAP_STORAGE_KEY);
    const existingTitan = localStorage.getItem(TITAN_STORAGE_KEY);
    if (existingLeap) guest.gameSnapshots[LEAP_STORAGE_KEY] = existingLeap;
    if (existingTitan) guest.gameSnapshots[TITAN_STORAGE_KEY] = existingTitan;

    const parsedLeap = safeParse(existingLeap, null);
    const parsedTitan = safeParse(existingTitan, null);
    if (parsedLeap && parsedLeap.age) guest.ageBand = parsedLeap.age;
    else if (parsedTitan && parsedTitan.ageBand) guest.ageBand = parsedTitan.ageBand;

    if (parsedLeap && parsedLeap.lang) guest.lang = parsedLeap.lang;
    else if (parsedTitan && parsedTitan.lang) guest.lang = parsedTitan.lang;

    const store = {
      version: 2.6,
      activeAccountId: 'guest',
      accounts: { guest },
      customGames: [],
      registeredGames: {},
      activityLog: [
        { id: 'init_1', timestamp: new Date().toISOString(), accountName: guest.name, state: guest.state, game: 'portal-hub', title: 'Session initialized on OpenAI.com.my', xpDelta: 0 }
      ],
      adminConfig: {
        passwordHash: '92a98eb0d6611bc4abf7424e438cd895e02ba2776547ce5bfd64be41e0b29d2b',
        onlineDisplayMode: 'hybrid',
        communityBaseCount: 380
      }
    };
    savePortalStore(store);
    return store;
  }

  function savePortalStore(store) {
    try {
      localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(store));
    } catch (_) {}
  }

  function logActivityEvent(store, title, xpDelta = 0, game = 'portal-hub') {
    store = store || loadPortalStore();
    const acc = store.accounts[store.activeAccountId] || { name: 'Guest Scholar', state: 'Malaysia' };
    if (!Array.isArray(store.activityLog)) store.activityLog = [];
    const ev = {
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      accountId: acc.id,
      accountName: acc.name,
      state: acc.state || 'Malaysia',
      game,
      title,
      xpDelta: Number(xpDelta) || 0
    };
    store.activityLog.unshift(ev);
    if (store.activityLog.length > 250) store.activityLog.length = 250;
    return ev;
  }

  function syncLiveStorageToActiveAccount(store) {
    store = store || loadPortalStore();
    const acc = store.accounts[store.activeAccountId];
    if (!acc) return store;
    if (!acc.gameSnapshots) acc.gameSnapshots = {};
    acc.lastActiveAt = Date.now();

    const allGames = getAllGames(store);
    allGames.forEach(g => {
      if (g.storageKey) {
        const val = localStorage.getItem(g.storageKey);
        if (val !== null) {
          acc.gameSnapshots[g.storageKey] = val;
        }
      }
    });

    const leap = safeParse(localStorage.getItem(LEAP_STORAGE_KEY), null);
    const titan = safeParse(localStorage.getItem(TITAN_STORAGE_KEY), null);
    if (window.location.pathname.includes('learn-and-leap') && leap) {
      if (leap.age) acc.ageBand = leap.age;
      if (leap.lang) acc.lang = leap.lang;
    } else if (window.location.pathname.includes('titan-academy') && titan) {
      if (titan.ageBand) acc.ageBand = titan.ageBand;
      if (titan.lang) acc.lang = titan.lang;
    } else if ((window.location.pathname.includes('voxel-craft-my') || window.location.pathname.includes('voxel-craft')) && typeof localStorage !== 'undefined') {
      const voxel = safeParse(localStorage.getItem(VOXEL_STORAGE_KEY), null);
      if (voxel && voxel.ageBand) acc.ageBand = voxel.ageBand;
      if (voxel && voxel.lang) acc.lang = voxel.lang;
    } else if (window.location.pathname.includes('flora-scholars') && typeof localStorage !== 'undefined') {
      const flora = safeParse(localStorage.getItem(FLORA_STORAGE_KEY), null);
      if (flora && flora.ageBand) acc.ageBand = flora.ageBand;
      if (flora && flora.lang) acc.lang = flora.lang;
    } else if (window.location.pathname.includes('slug-math') && typeof localStorage !== 'undefined') {
      const slug = safeParse(localStorage.getItem(SLUG_STORAGE_KEY), null);
      if (slug && slug.ageBand) acc.ageBand = slug.ageBand;
      if (slug && slug.lang) acc.lang = slug.lang;
    } else if (window.location.pathname.includes('science-quest-my') && typeof localStorage !== 'undefined') {
      const sci = safeParse(localStorage.getItem(SCIENCE_STORAGE_KEY), null);
      if (sci && sci.ageBand) acc.ageBand = sci.ageBand;
      if (sci && sci.lang) acc.lang = sci.lang;
    }

    savePortalStore(store);
    return store;
  }

  function applyAccountToLiveStorage(account, store) {
    if (!account) return;
    store = store || loadPortalStore();
    const allGames = getAllGames(store);
    isApplyingStorageSync = true;
    try {
      allGames.forEach(g => {
        if (!g.storageKey) return;
        const snap = account.gameSnapshots && account.gameSnapshots[g.storageKey];
        if (snap) {
          localStorage.setItem(g.storageKey, snap);
        } else {
          localStorage.removeItem(g.storageKey);
        }
      });

    const slugData = safeParse(localStorage.getItem(SLUG_STORAGE_KEY), {
      ageBand: account.ageBand || '10-12',
      lang: account.lang || 'en',
      completed: {},
      bestScores: {},
      questionsSolved: 0,
      bossesDefeated: 0,
      powsRescued: 0,
      xp: 0,
      spentXp: 0,
      weaponUpgrades: { PISTOL: 0, HMG: 0, SHOTGUN: 0, ROCKET: 0 },
      rdGrantClaimed: false
    });
    slugData.ageBand = account.ageBand || slugData.ageBand || '10-12';
    slugData.lang = account.lang || slugData.lang || 'en';
    localStorage.setItem(SLUG_STORAGE_KEY, JSON.stringify(slugData));
    account.gameSnapshots[SLUG_STORAGE_KEY] = JSON.stringify(slugData);

    const floraData = safeParse(localStorage.getItem(FLORA_STORAGE_KEY), {
      ageBand: account.ageBand || '10-12',
      lang: account.lang || 'en',
      completed: {},
      questionsSolved: 0,
      xp: 0,
      evolutions: {},
      spentEvolutionXp: 0
    });
    floraData.ageBand = account.ageBand || floraData.ageBand || '10-12';
    floraData.lang = account.lang || floraData.lang || 'en';
    localStorage.setItem(FLORA_STORAGE_KEY, JSON.stringify(floraData));
    account.gameSnapshots[FLORA_STORAGE_KEY] = JSON.stringify(floraData);

    const scienceData = safeParse(localStorage.getItem(SCIENCE_STORAGE_KEY), {
      ageBand: account.ageBand || '10-12',
      lang: account.lang || 'en',
      completed: {},
      bestScores: {},
      questionsSolved: 0,
      bossesDefeated: 0,
      xp: 0,
      highestStage: 1
    });
    scienceData.ageBand = account.ageBand || scienceData.ageBand || '10-12';
    scienceData.lang = account.lang || scienceData.lang || 'en';
    localStorage.setItem(SCIENCE_STORAGE_KEY, JSON.stringify(scienceData));
    account.gameSnapshots[SCIENCE_STORAGE_KEY] = JSON.stringify(scienceData);

    const leapData = safeParse(localStorage.getItem(LEAP_STORAGE_KEY), {
      age: account.ageBand || '10-12',
      lang: account.lang || 'en',
      sound: false,
      progress: {},
      lastLevels: {}
    });
    leapData.age = account.ageBand || leapData.age || '10-12';
    leapData.lang = account.lang || leapData.lang || 'en';
    localStorage.setItem(LEAP_STORAGE_KEY, JSON.stringify(leapData));
    account.gameSnapshots[LEAP_STORAGE_KEY] = JSON.stringify(leapData);

    const defaultProfiles = {
      '5-6': { current: 1, completed: {} },
      '7-9': { current: 1, completed: {} },
      '10-12': { current: 1, completed: {} },
      '13-15': { current: 1, completed: {} },
      '16+': { current: 1, completed: {} }
    };
    const titanData = safeParse(localStorage.getItem(TITAN_STORAGE_KEY), {
      lang: account.lang || 'en',
      sound: false,
      ageBand: account.ageBand || '10-12',
      ageChosen: true,
      profiles: defaultProfiles
    });
    titanData.ageBand = account.ageBand || titanData.ageBand || '10-12';
    titanData.lang = account.lang || titanData.lang || 'en';
    titanData.ageChosen = true;
    if (!titanData.profiles) titanData.profiles = defaultProfiles;
    localStorage.setItem(TITAN_STORAGE_KEY, JSON.stringify(titanData));
    account.gameSnapshots[TITAN_STORAGE_KEY] = JSON.stringify(titanData);

      const tankRaw = localStorage.getItem(TANKMATH_STORAGE_KEY);
      if (tankRaw) {
        const tankData = safeParse(tankRaw, null);
        if (tankData && typeof tankData === 'object') {
          if (account.name && (!tankData.displayName || tankData.displayName === 'Cadet')) {
            tankData.displayName = account.name;
            localStorage.setItem(TANKMATH_STORAGE_KEY, JSON.stringify(tankData));
          }
          account.gameSnapshots[TANKMATH_STORAGE_KEY] = JSON.stringify(tankData);
        }
      }
    } finally {
      isApplyingStorageSync = false;
    }

    savePortalStore(store);
  }

  let manifestGamesCache = [];

  function normalizeManifestGame(manifest = {}, extraFlags = {}) {
    const cleanId = String(manifest.id || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    return Object.assign({
      id: cleanId,
      title: String(manifest.title || cleanId || 'Educational Game').trim(),
      genre: String(manifest.genre || 'Educational Game').trim(),
      category: String(manifest.category || 'all-subjects').trim(),
      status: manifest.status || 'live',
      path: manifest.path || `./games/${cleanId}/index.html`,
      storageKey: manifest.storageKey || `${cleanId}-v1`,
      maxLevels: Number(manifest.maxLevels) || 100,
      maxStars: Number(manifest.maxStars) || 300,
      icon: manifest.icon || '🎮',
      accentColor: manifest.accentColor || '#38bdf8',
      badgeText: manifest.badgeText || 'LIVE · AI STUDIO + SDK',
      subjects: Array.isArray(manifest.subjects) ? manifest.subjects : ['Mathematics', 'Science', 'English'],
      description: manifest.description || 'Connected to OpenAI.com.my Unified Academic XP & Leaderboard Engine.',
      coverImage: manifest.coverImage || null,
      heroSprite: manifest.heroSprite || null
    }, extraFlags);
  }

  function getAllGames(store) {
    store = store || loadPortalStore();
    const custom = Array.isArray(store.customGames) ? store.customGames : [];
    const map = new Map();
    DEFAULT_GAMES.forEach(g => map.set(g.id, Object.assign({}, g)));
    manifestGamesCache.forEach(g => {
      if (g && g.id) {
        map.set(g.id, Object.assign(map.get(g.id) || {}, g, { fromManifest: true }));
      }
    });
    custom.forEach(g => {
      if (g && g.id) {
        map.set(g.id, Object.assign(map.get(g.id) || {}, g));
      }
    });
    return Array.from(map.values());
  }

  async function loadManifestGames(manifestUrl) {
    if (typeof fetch !== 'function') return manifestGamesCache;
    const isFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
    const isSubdir = typeof window !== 'undefined' && /\/[^/]+\/[^/]*$/.test(window.location.pathname || '');
    const defaultTarget = isFile ? (isSubdir ? '../games-manifest.json' : './games-manifest.json') : '/games-manifest.json';
    const target = manifestUrl || defaultTarget;
    try {
      const res = await fetch(target, { cache: 'no-store' });
      if (!res.ok) return manifestGamesCache;
      const data = await res.json();
      const list = Array.isArray(data) ? data : (Array.isArray(data && data.games) ? data.games : []);
      manifestGamesCache = list
        .filter(item => item && item.id && item.title)
        .map(item => normalizeManifestGame(item, { fromManifest: true }));
      notifyListeners('games-updated', manifestGamesCache);
      return manifestGamesCache;
    } catch (_) {
      return manifestGamesCache;
    }
  }

  function analyzeLeapProgress(rawJson, customEvents) {
    const data = safeParse(rawJson, null);
    let levelsCompleted = 0;
    let totalStars = 0;
    let bossesDefeated = 0;
    let highestLevel = 1;
    const byAge = {};
    const levelRecords = [];

    if (data && data.progress && typeof data.progress === 'object') {
      Object.keys(data.progress).forEach(age => {
        const ageMap = data.progress[age] || {};
        let ageLevels = 0;
        let ageStars = 0;
        Object.keys(ageMap).forEach(lvlKey => {
          const stars = Number(ageMap[lvlKey]) || 0;
          const lvl = Number(lvlKey) || 0;
          if (stars > 0 && lvl >= 1 && lvl <= 100) {
            levelsCompleted++;
            totalStars += stars;
            ageLevels++;
            ageStars += stars;
            if (lvl % 10 === 0) bossesDefeated++;
            if (lvl >= highestLevel) highestLevel = Math.min(100, lvl + 1);
            levelRecords.push({ gameId: 'learn-and-leap', ageBand: age, level: lvl, stars });
          }
        });
        byAge[age] = { levelsCompleted: ageLevels, totalStars: ageStars };
      });
    }

    const extraShrines = (customEvents && Number(customEvents.leapShrinesAnswered)) || 0;
    const runesAwakened = Math.max(levelsCompleted * 4, extraShrines);
    const questionsSolved = runesAwakened;
    const xp = (levelsCompleted * 100) + (totalStars * 50) + (bossesDefeated * 150) + Math.max(0, extraShrines - levelsCompleted * 4) * 25;

    return {
      gameId: 'learn-and-leap',
      levelsCompleted,
      totalStars,
      bossesDefeated,
      runesAwakened,
      questionsSolved,
      highestLevel,
      byAge,
      levelRecords,
      xp
    };
  }

  function analyzeTitanProgress(rawJson, customEvents) {
    const data = safeParse(rawJson, null);
    let levelsCompleted = 0;
    let totalStars = 0;
    let bossesDefeated = 0;
    let highestLevel = 1;
    const byAge = {};
    const levelRecords = [];

    if (data && data.profiles && typeof data.profiles === 'object') {
      Object.keys(data.profiles).forEach(age => {
        const prof = data.profiles[age] || {};
        const comp = prof.completed || {};
        let ageLevels = 0;
        let ageStars = 0;
        Object.keys(comp).forEach(lvlKey => {
          const stars = Number(comp[lvlKey]) || 0;
          const lvl = Number(lvlKey) || 0;
          if (stars > 0 && lvl >= 1 && lvl <= 100) {
            levelsCompleted++;
            totalStars += stars;
            ageLevels++;
            ageStars += stars;
            if (lvl % 10 === 0) bossesDefeated++;
            if (lvl >= highestLevel) highestLevel = Math.min(100, lvl + 1);
            levelRecords.push({ gameId: 'titan-academy', ageBand: age, level: lvl, stars });
          }
        });
        byAge[age] = { levelsCompleted: ageLevels, totalStars: ageStars };
      });
    }

    const extraQuestions = (customEvents && Number(customEvents.titanQuestionsAnswered)) || 0;
    const savedQuestions = (data && Number(data.questionsSolved)) || 0;
    const questionsSolved = Math.max(levelsCompleted * 3, savedQuestions, extraQuestions);
    const xp = (levelsCompleted * 100) + (totalStars * 50) + (bossesDefeated * 150) + Math.max(0, questionsSolved - levelsCompleted * 3) * 15;

    return {
      gameId: 'titan-academy',
      levelsCompleted,
      totalStars,
      bossesDefeated,
      runesAwakened: 0,
      questionsSolved,
      highestLevel,
      byAge,
      levelRecords,
      xp
    };
  }

  function analyzeGenericGameProgress(game, account, isActiveAccount = false) {
    const customScore = (account.customGameScores && account.customGameScores[game.id]) || {};
    const canReadLive = isActiveAccount && typeof localStorage !== 'undefined';
    const liveVal = (canReadLive && game.storageKey) ? localStorage.getItem(game.storageKey) : null;
    const snapJson = liveVal || ((account.gameSnapshots && game.storageKey) ? account.gameSnapshots[game.storageKey] : null);
    const snapData = safeParse(snapJson, null);

    let levelsCompleted = Number(customScore.levelsCompleted) || 0;
    let totalStars = Number(customScore.totalStars) || 0;
    let bossesDefeated = Number(customScore.bossesDefeated) || 0;
    let questionsSolved = Number(customScore.questionsSolved) || 0;
    let xp = Number(customScore.xp) || 0;
    const levelRecords = [];

    if (snapData && typeof snapData === 'object') {
      if (snapData.completed && typeof snapData.completed === 'object') {
        const keys = Object.keys(snapData.completed);
        let snapLevels = 0;
        let snapStars = 0;
        let snapBosses = 0;
        keys.forEach(k => {
          const s = Number(snapData.completed[k]) || 0;
          const lvlNum = Number(k) || 0;
          if (s >= 1) {
            snapLevels++;
            snapStars += Math.min(3, s);
            if (lvlNum > 0 && lvlNum % 10 === 0) snapBosses++;
            levelRecords.push({ gameId: game.id, ageBand: snapData.ageBand || account.ageBand || '10-12', level: lvlNum, stars: Math.min(3, s) });
          }
        });
        levelsCompleted = Math.max(levelsCompleted, snapLevels);
        totalStars = Math.max(totalStars, snapStars);
        bossesDefeated = Math.max(bossesDefeated, snapBosses);
      }
      if (typeof snapData.bossesDefeated === 'number') {
        bossesDefeated = Math.max(bossesDefeated, snapData.bossesDefeated);
      }
      if (typeof snapData.questionsSolved === 'number') {
        questionsSolved = Math.max(questionsSolved, snapData.questionsSolved);
      }
      if (typeof snapData.totalSolved === 'number') {
        questionsSolved = Math.max(questionsSolved, snapData.totalSolved);
      }
      if (typeof snapData.xp === 'number') {
        xp = Math.max(xp, snapData.xp);
      }
      if (typeof snapData.totalXp === 'number') {
        const tankSaveXp = Math.max(0, Math.round(snapData.totalXp));
        const unlockedStage = Number(snapData.unlockedStage) || 1;
        const tankLevels = Math.max(
          unlockedStage > 1 ? unlockedStage - 1 : 0,
          snapData.tutorialCompleted ? 4 : 0
        );
        levelsCompleted = Math.max(levelsCompleted, tankLevels);
        if (tankLevels > 0 || questionsSolved > 0) {
          const derivedStars = Math.min(
            game.maxStars || 30,
            Math.max(totalStars, tankLevels * 2 + (questionsSolved >= 3 ? 1 : 0))
          );
          totalStars = Math.max(totalStars, derivedStars);
        }
        xp = Math.max(xp, tankSaveXp);
      }
    }

    const computedXp = (levelsCompleted * 100) + (totalStars * 50) + (bossesDefeated * 150) + (questionsSolved * 15);
    xp = Math.max(xp, computedXp);

    return {
      gameId: game.id,
      levelsCompleted,
      totalStars,
      bossesDefeated,
      runesAwakened: Number(customScore.runesAwakened) || 0,
      questionsSolved,
      highestLevel: levelsCompleted + 1,
      byAge: {},
      levelRecords,
      xp
    };
  }

  function getRankTitle(level, ageBand) {
    if (level >= 40) return 'Grand Academic Champion';
    if (level >= 25) return 'Titan Slayer Scholar';
    if (level >= 15) return 'SPM High Distinction';
    if (level >= 10) return 'PT3 / KSSM Vanguard';
    if (level >= 6) return 'Rune Portal Master';
    if (level >= 3) return 'Rising KSSR Scholar';
    const bandObj = AGE_BANDS.find(a => a.id === ageBand);
    return bandObj ? bandObj.short : 'Novice Explorer';
  }

  function calculateAccountStats(account, store) {
    store = store || loadPortalStore();
    if (!account) account = store.accounts[store.activeAccountId];
    const snapshots = account.gameSnapshots || {};
    const events = account.customEvents || {};

    const leapRaw = (account.id === store.activeAccountId)
      ? (localStorage.getItem(LEAP_STORAGE_KEY) || snapshots[LEAP_STORAGE_KEY])
      : snapshots[LEAP_STORAGE_KEY];

    const titanRaw = (account.id === store.activeAccountId)
      ? (localStorage.getItem(TITAN_STORAGE_KEY) || snapshots[TITAN_STORAGE_KEY])
      : snapshots[TITAN_STORAGE_KEY];

    const gamesStats = {};
    gamesStats['learn-and-leap'] = analyzeLeapProgress(leapRaw, events);
    gamesStats['titan-academy'] = analyzeTitanProgress(titanRaw, events);

    const isActiveAcc = account.id === store.activeAccountId;
    const allGames = getAllGames(store);
    allGames.forEach(g => {
      if (g.id !== 'learn-and-leap' && g.id !== 'titan-academy') {
        gamesStats[g.id] = analyzeGenericGameProgress(g, account, isActiveAcc);
      }
    });

    let gameXpSum = 0;
    let totalLevelsCompleted = 0;
    let totalStars = 0;
    let totalBossesDefeated = 0;
    let totalQuestionsSolved = 0;

    Object.values(gamesStats).forEach(st => {
      gameXpSum += st.xp;
      totalLevelsCompleted += st.levelsCompleted;
      totalStars += st.totalStars;
      totalBossesDefeated += st.bossesDefeated;
      totalQuestionsSolved += st.questionsSolved;
    });

    const bonusXp = Number(account.bonusXp) || 0;
    const totalXp = gameXpSum + bonusXp;
    const xpPerLevel = 300;
    const level = Math.floor(totalXp / xpPerLevel) + 1;
    const currentLevelXp = totalXp % xpPerLevel;
    const xpProgressPct = Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100));
    const rankTitle = getRankTitle(level, account.ageBand);

    const baseStats = {
      games: gamesStats,
      totalLevelsCompleted,
      totalStars,
      totalBossesDefeated,
      totalQuestionsSolved,
      totalXp,
      bonusXp
    };

    const quests = DAILY_QUESTS.map(q => {
      const current = q.getValue(baseStats);
      const clamped = Math.min(q.target, current);
      const pct = Math.min(100, Math.round((clamped / q.target) * 100));
      const isCompleted = current >= q.target;
      const isClaimed = Boolean(account.claimedQuests && account.claimedQuests[q.id]);
      return Object.assign({}, q, {
        current,
        clamped,
        pct,
        isCompleted,
        isClaimed
      });
    });

    const completedQuestsCount = quests.filter(q => q.isCompleted).length;
    const claimedQuestsCount = quests.filter(q => q.isClaimed).length;

    return {
      accountId: account.id,
      name: account.name,
      avatar: account.avatar,
      isGuest: Boolean(account.isGuest),
      school: account.school || 'Malaysia',
      state: account.state || 'Kuala Lumpur',
      ageBand: account.ageBand || '10-12',
      lang: account.lang || 'en',
      createdAt: account.createdAt || Date.now(),
      lastActiveAt: account.lastActiveAt || Date.now(),
      level,
      rankTitle,
      totalXp,
      gameXpSum,
      bonusXp,
      currentLevelXp,
      xpPerLevel,
      xpProgressPct,
      totalLevelsCompleted,
      totalStars,
      totalBossesDefeated,
      totalQuestionsSolved,
      games: gamesStats,
      quests,
      completedQuestsCount,
      claimedQuestsCount,
      dailyBonusClaimed: Boolean(account.dailyBonusClaimed)
    };
  }

  function getLeaderboard(filter = 'all') {
    const store = syncLiveStorageToActiveAccount();
    const entries = [];

    Object.values(store.accounts).forEach(acc => {
      const st = calculateAccountStats(acc, store);
      const leapXp = (st.games['learn-and-leap'] && st.games['learn-and-leap'].xp) || 0;
      const titanXp = (st.games['titan-academy'] && st.games['titan-academy'].xp) || 0;
      const leapStars = (st.games['learn-and-leap'] && st.games['learn-and-leap'].totalStars) || 0;
      const titanStars = (st.games['titan-academy'] && st.games['titan-academy'].totalStars) || 0;
      const voxelXp = (st.games['voxel-craft-my'] && st.games['voxel-craft-my'].xp) || 0;
      const voxelStars = (st.games['voxel-craft-my'] && st.games['voxel-craft-my'].totalStars) || 0;
      const floraXp = (st.games['flora-scholars'] && st.games['flora-scholars'].xp) || 0;
      const floraStars = (st.games['flora-scholars'] && st.games['flora-scholars'].totalStars) || 0;
      const slugXp = (st.games['slug-math'] && st.games['slug-math'].xp) || 0;
      const slugStars = (st.games['slug-math'] && st.games['slug-math'].totalStars) || 0;
      const scienceXp = (st.games['science-quest-my'] && st.games['science-quest-my'].xp) || 0;
      const scienceStars = (st.games['science-quest-my'] && st.games['science-quest-my'].totalStars) || 0;
      const tankXp = (st.games['tankmath-armageddon'] && st.games['tankmath-armageddon'].xp) || 0;
      const tankStars = (st.games['tankmath-armageddon'] && st.games['tankmath-armageddon'].totalStars) || 0;

      entries.push({
        id: acc.id,
        name: acc.name + (acc.id === store.activeAccountId ? ' (You)' : ''),
        rawName: acc.name,
        avatar: acc.avatar || '🧑‍🎓',
        state: acc.state || 'Malaysia',
        school: acc.school || (acc.isGuest ? 'Guest Session' : 'Malaysian Scholar'),
        ageBand: acc.ageBand || '10-12',
        isCurrentUser: acc.id === store.activeAccountId,
        isLocalAccount: true,
        isGuest: Boolean(acc.isGuest),
        totalXp: st.totalXp,
        leapXp,
        titanXp,
        voxelXp,
        floraXp,
        slugXp,
        scienceXp,
        tankXp,
        totalStars: st.totalStars,
        leapStars,
        titanStars,
        voxelStars,
        floraStars,
        slugStars,
        scienceStars,
        tankStars,
        level: st.level,
        rankTitle: st.rankTitle
      });
    });

    BASE_SCHOLARS.forEach(p => {
      const totalXp = p.leapXp + p.titanXp + (p.voxelXp || 0) + (p.floraXp || 0) + (p.slugXp || 0) + (p.scienceXp || 0) + (p.tankXp || 0);
      const totalStars = p.leapStars + p.titanStars + (p.voxelStars || 0) + (p.floraStars || 0) + (p.slugStars || 0) + (p.scienceStars || 0) + (p.tankStars || 0);
      const level = Math.floor(totalXp / 300) + 1;
      entries.push({
        id: p.id,
        name: p.name,
        rawName: p.name,
        avatar: p.avatar,
        state: p.state,
        school: p.school,
        ageBand: p.ageBand,
        isCurrentUser: false,
        isLocalAccount: false,
        isGuest: false,
        totalXp,
        leapXp: p.leapXp,
        titanXp: p.titanXp,
        voxelXp: p.voxelXp || 0,
        floraXp: p.floraXp || 0,
        slugXp: p.slugXp || 0,
        scienceXp: p.scienceXp || 0,
        tankXp: p.tankXp || 0,
        totalStars,
        leapStars: p.leapStars,
        titanStars: p.titanStars,
        voxelStars: p.voxelStars || 0,
        floraStars: p.floraStars || 0,
        slugStars: p.slugStars || 0,
        scienceStars: p.scienceStars || 0,
        tankStars: p.tankStars || 0,
        level,
        rankTitle: getRankTitle(level, p.ageBand)
      });
    });

    entries.sort((a, b) => {
      if (filter === 'learn-and-leap') {
        return (b.leapXp - a.leapXp) || (b.totalXp - a.totalXp);
      }
      if (filter === 'titan-academy') {
        return (b.titanXp - a.titanXp) || (b.totalXp - a.totalXp);
      }
      if (filter === 'voxel-craft-my') {
        return (b.voxelXp - a.voxelXp) || (b.totalXp - a.totalXp);
      }
      if (filter === 'flora-scholars') {
        return (b.floraXp - a.floraXp) || (b.totalXp - a.totalXp);
      }
      if (filter === 'slug-math') {
        return (b.slugXp - a.slugXp) || (b.totalXp - a.totalXp);
      }
      if (filter === 'science-quest-my') {
        return (b.scienceXp - a.scienceXp) || (b.totalXp - a.totalXp);
      }
      if (filter === 'tankmath-armageddon') {
        return (b.tankXp - a.tankXp) || (b.totalXp - a.totalXp);
      }
      return (b.totalXp - a.totalXp) || (b.totalStars - a.totalStars);
    });

    return entries.map((entry, idx) => {
      const displayXp = filter === 'learn-and-leap'
        ? entry.leapXp
        : filter === 'titan-academy'
          ? entry.titanXp
          : filter === 'voxel-craft-my'
            ? entry.voxelXp
            : filter === 'flora-scholars'
              ? entry.floraXp
              : filter === 'slug-math'
                ? entry.slugXp
                : filter === 'science-quest-my'
                  ? entry.scienceXp
                  : filter === 'tankmath-armageddon'
                    ? entry.tankXp
                    : entry.totalXp;
      const displayStars = filter === 'learn-and-leap'
        ? entry.leapStars
        : filter === 'titan-academy'
          ? entry.titanStars
          : filter === 'voxel-craft-my'
            ? entry.voxelStars
            : filter === 'flora-scholars'
              ? entry.floraStars
              : filter === 'slug-math'
                ? entry.slugStars
                : filter === 'science-quest-my'
                  ? entry.scienceStars
                  : filter === 'tankmath-armageddon'
                    ? entry.tankStars
                    : entry.totalStars;
      return Object.assign({}, entry, {
        rank: idx + 1,
        displayXp,
        displayStars
      });
    });
  }

  // =========================================================================
  // REAL-TIME DYNAMIC ONLINE PRESENCE ENGINE
  // Combines Local Tab Heartbeats + Cloud Edge /api/telemetry + Live Stream
  // =========================================================================
  const SESSION_ID = (function () {
    try {
      let sid = sessionStorage.getItem('openai_tab_session_id');
      if (!sid) {
        sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
        sessionStorage.setItem('openai_tab_session_id', sid);
      }
      return sid;
    } catch (_) {
      return 'sess_' + Math.random().toString(36).slice(2, 9);
    }
  })();

  function detectCurrentGameArea() {
    if (typeof window !== 'undefined' && window.OPENAI_PORTAL_GAME_ID) {
      return String(window.OPENAI_PORTAL_GAME_ID).trim().toLowerCase();
    }
    if (typeof document !== 'undefined' && document.querySelector) {
      const meta = document.querySelector('meta[name="openai-portal-game"]');
      if (meta && meta.getAttribute('content')) {
        return String(meta.getAttribute('content')).trim().toLowerCase();
      }
    }
    const p = (window.location.pathname || '').toLowerCase();
    if (p.includes('learn-and-leap')) return 'learn-and-leap';
    if (p.includes('titan-academy')) return 'titan-academy';
    if (p.includes('voxel-craft-my') || p.includes('voxel-craft')) return 'voxel-craft-my';
    if (p.includes('flora-scholars')) return 'flora-scholars';
    if (p.includes('slug-math')) return 'slug-math';
    if (p.includes('science-quest-my')) return 'science-quest-my';
    if (p.includes('tankmath-armageddon')) return 'tankmath-armageddon';

    const cleanSegs = p.split('/').filter(Boolean);
    const ignoreTop = new Set(['index.html', 'admin.html', 'shared', 'functions', 'checks', 'templates', 'studio-template']);
    if (cleanSegs.length >= 2 && cleanSegs[0] === 'games') {
      return cleanSegs[1].replace(/\.html$/i, '');
    }
    if (cleanSegs.length >= 1 && !ignoreTop.has(cleanSegs[0]) && !cleanSegs[0].endsWith('.html')) {
      return cleanSegs[0];
    }
    return 'portal-hub';
  }

  let liveServerTelemetry = {
    realOnline: { total: 1, byGame: { 'learn-and-leap': 0, 'titan-academy': 0, 'voxel-craft-my': 0, 'flora-scholars': 0, 'slug-math': 0, 'science-quest-my': 0, 'tankmath-armageddon': 0, 'portal-hub': 1 }, sessions: [] },
    scholarsCount: 1,
    recentEvents: []
  };

  // Dynamic micro-fluctuation state so the counter breathes naturally in real time
  let liveStreamDelta = { leap: 0, titan: 0, voxel: 0, flora: 0, slug: 0, science: 0, tank: 0, hub: 0, lastFeedAction: 'Connected to OpenAI.com.my Live Server' };
  const SAMPLE_LIVE_ACTIONS = [
    { game: 'science-quest-my', text: 'Irfan H. (Selangor) shattered Prism Goliath STEM Barrier in Science Quest MY (+180 XP)' },
    { game: 'science-quest-my', text: 'Mei Fang (Penang) built Tier 3 Tesla Coil & Acid Mortar combo in Sector 3 Cryo-Chem (+240 XP)' },
    { game: 'slug-math', text: 'Danial H. (Selangor) deployed SV-001 Math Slug Tank & rescued 3 POW Scholars in Sector 2 (+220 XP)' },
    { game: 'slug-math', text: 'Nurul I. (KL) upgraded Heavy MG to Mk.III in Slug Math R&D Lab & defeated Iron Hermit Crab (+300 XP)' },
    { game: 'flora-scholars', text: 'Aisyah Z. (Selangor) harvested 4 Solar Quiz Blooms & evolved Durian Shield (+150 XP)' },
    { game: 'flora-scholars', text: 'Hafiz M. (Penang) defended Kinabalu Cloud Garden Stage 20 with ★★★ (+250 XP)' },
    { game: 'learn-and-leap', text: 'Nurul A. (Selangor) awakened Math Shrine in World 2 (+25 XP)' },
    { game: 'titan-academy', text: 'Ahmad R. (KL) defeated Crystal Turtle in Sector 1 (+150 XP)' },
    { game: 'voxel-craft-my', text: 'Danish K. (Kedah) crafted 3D Blueprint in Rainforest Biome (+60 XP)' },
    { game: 'voxel-craft-my', text: 'Zhi Ling (Johor) shattered Obsidian Shield on Voxel Boss 2 (+180 XP)' },
    { game: 'learn-and-leap', text: 'Brendan L. (Penang) cleared Whispering Woods 04 with ★★★' },
    { game: 'titan-academy', text: 'Siti H. (Johor) solved 3 KSSM Science questions (+45 XP)' },
    { game: 'learn-and-leap', text: 'Harith I. (Perak) unlocked World 3 Rune Portal (+250 XP)' },
    { game: 'titan-academy', text: 'Mei Ling (Sarawak) charged Mega Bomb in Titan Arena' },
    { game: 'portal-hub', text: 'New Scholar from Kedah joined OpenAI.com.my (+100 Welcome XP)' }
  ];

  function updateLocalTabPresence() {
    try {
      const now = Date.now();
      const map = safeParse(localStorage.getItem(PRESENCE_STORAGE_KEY), {}) || {};
      const stats = getActiveUserStats();
      map[SESSION_ID] = {
        sessionId: SESSION_ID,
        accountId: stats.accountId,
        name: stats.name,
        avatar: stats.avatar,
        state: stats.state,
        ageBand: stats.ageBand,
        game: detectCurrentGameArea(),
        lastSeen: now
      };
      // Prune stale tabs (> 25s)
      Object.keys(map).forEach(k => {
        if (now - (map[k].lastSeen || 0) > 25000) delete map[k];
      });
      localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(map));
      return Object.values(map);
    } catch (_) {
      return [];
    }
  }

  async function sendCloudTelemetryHeartbeat(customEvent = null) {
    try {
      const stats = getActiveUserStats();
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          game: detectCurrentGameArea(),
          stats,
          event: customEvent
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok) {
          liveServerTelemetry = data;
        }
      }
    } catch (_) {
      // Offline or local static server fallback
    }
  }

  function getOnlineStats() {
    const store = loadPortalStore();
    const adminCfg = store.adminConfig || { onlineDisplayMode: 'hybrid', communityBaseCount: 380 };
    const localTabs = updateLocalTabPresence();

    const realByGame = { 'learn-and-leap': 0, 'titan-academy': 0, 'voxel-craft-my': 0, 'flora-scholars': 0, 'slug-math': 0, 'science-quest-my': 0, 'tankmath-armageddon': 0, 'portal-hub': 0 };
    const activeSessions = (liveServerTelemetry.realOnline && liveServerTelemetry.realOnline.sessions && liveServerTelemetry.realOnline.sessions.length > 0)
      ? liveServerTelemetry.realOnline.sessions
      : localTabs;

    activeSessions.forEach(s => {
      const g = s.game || 'portal-hub';
      realByGame[g] = (realByGame[g] || 0) + 1;
    });
    const realTotal = Math.max(1, activeSessions.length);

    if (adminCfg.onlineDisplayMode === 'strict_real') {
      return {
        mode: 'strict_real',
        totalOnline: realTotal,
        realConnectedCount: realTotal,
        activeSessions,
        lastFeedAction: `🟢 ${realTotal} Real Connected Browser Session(s) Active`,
        byGame: {
          'learn-and-leap': realByGame['learn-and-leap'],
          'titan-academy': realByGame['titan-academy'],
          'voxel-craft-my': realByGame['voxel-craft-my'],
          'flora-scholars': realByGame['flora-scholars'],
          'slug-math': realByGame['slug-math'],
          'science-quest-my': realByGame['science-quest-my'],
          'tankmath-armageddon': realByGame['tankmath-armageddon'],
          'portal-hub': realByGame['portal-hub']
        },
        topStates: [
          { state: 'Active Connected Devices', count: realTotal }
        ]
      };
    }

    // Hybrid Mode: Real Connected Sessions + Live Dynamic Malaysian Community Curve (changes every 3.5 seconds!)
    const now = Date.now();
    const secSeed = Math.floor(now / 3500);
    const base = Number(adminCfg.communityBaseCount) || 380;
    const wave1 = Math.round(Math.sin(secSeed * 0.45) * 18 + Math.cos(secSeed * 0.9) * 7);
    const wave2 = Math.round(Math.cos(secSeed * 0.35) * 14 + Math.sin(secSeed * 0.75) * 6);
    const wave3 = Math.round(Math.sin(secSeed * 0.6) * 6);

    const wave4 = Math.round(Math.sin(secSeed * 0.5) * 12 + Math.cos(secSeed * 0.8) * 5);
    const wave5 = Math.round(Math.cos(secSeed * 0.55) * 15 + Math.sin(secSeed * 0.85) * 6);
    const wave6 = Math.round(Math.sin(secSeed * 0.62) * 14 + Math.cos(secSeed * 0.72) * 5);
    const wave7 = Math.round(Math.cos(secSeed * 0.58) * 13 + Math.sin(secSeed * 0.91) * 5);
    const leapOnline = Math.max(1, Math.round(base * 0.46) + wave1 + liveStreamDelta.leap + realByGame['learn-and-leap']);
    const titanOnline = Math.max(1, Math.round(base * 0.36) + wave2 + liveStreamDelta.titan + realByGame['titan-academy']);
    const voxelOnline = Math.max(1, Math.round(base * 0.34) + wave4 + (liveStreamDelta.voxel || 0) + realByGame['voxel-craft-my']);
    const floraOnline = Math.max(1, Math.round(base * 0.41) + wave5 + (liveStreamDelta.flora || 0) + realByGame['flora-scholars']);
    const slugOnline = Math.max(1, Math.round(base * 0.39) + wave6 + (liveStreamDelta.slug || 0) + realByGame['slug-math']);
    const scienceOnline = Math.max(1, Math.round(base * 0.42) + wave7 + (liveStreamDelta.science || 0) + realByGame['science-quest-my']);
    const tankOnline = Math.max(1, Math.round(base * 0.37) + wave4 + (liveStreamDelta.tank || 0) + realByGame['tankmath-armageddon']);
    const hubOnline = Math.max(1, Math.round(base * 0.11) + wave3 + liveStreamDelta.hub + realByGame['portal-hub']);
    const totalOnline = leapOnline + titanOnline + voxelOnline + floraOnline + slugOnline + scienceOnline + tankOnline + hubOnline;

    return {
      mode: 'hybrid',
      totalOnline,
      realConnectedCount: realTotal,
      activeSessions,
      lastFeedAction: liveStreamDelta.lastFeedAction,
      byGame: {
        'learn-and-leap': leapOnline,
        'titan-academy': titanOnline,
        'voxel-craft-my': voxelOnline,
        'flora-scholars': floraOnline,
        'slug-math': slugOnline,
        'science-quest-my': scienceOnline,
        'tankmath-armageddon': tankOnline,
        'portal-hub': hubOnline
      },
      topStates: [
        { state: 'Selangor', count: Math.round(totalOnline * 0.28) },
        { state: 'Kuala Lumpur', count: Math.round(totalOnline * 0.21) },
        { state: 'Johor', count: Math.round(totalOnline * 0.16) },
        { state: 'Penang', count: Math.round(totalOnline * 0.12) },
        { state: 'Sarawak & Sabah', count: Math.round(totalOnline * 0.13) },
        { state: 'Other Malaysian States', count: Math.max(1, totalOnline - Math.round(totalOnline * 0.90)) }
      ]
    };
  }

  // Start Live 3.5-Second Real-Time Ticker so "Online Now" is genuinely dynamic
  function startRealtimePresenceTicker() {
    updateLocalTabPresence();
    sendCloudTelemetryHeartbeat();

    // Every 3.5 seconds, update live stream delta & notify UI
    setInterval(() => {
      const step = () => Math.floor(Math.random() * 5) - 2; // -2 to +2
      liveStreamDelta.leap = Math.max(-15, Math.min(25, liveStreamDelta.leap + step()));
      liveStreamDelta.titan = Math.max(-15, Math.min(25, liveStreamDelta.titan + step()));
      liveStreamDelta.flora = Math.max(-15, Math.min(25, (liveStreamDelta.flora || 0) + step()));
      liveStreamDelta.slug = Math.max(-15, Math.min(25, (liveStreamDelta.slug || 0) + step()));
      liveStreamDelta.science = Math.max(-15, Math.min(25, (liveStreamDelta.science || 0) + step()));
      liveStreamDelta.hub = Math.max(-6, Math.min(12, liveStreamDelta.hub + (Math.random() > 0.5 ? 1 : -1)));
      const pick = SAMPLE_LIVE_ACTIONS[Math.floor(Math.random() * SAMPLE_LIVE_ACTIONS.length)];
      liveStreamDelta.lastFeedAction = pick.text;
      updateLocalTabPresence();
      notifyListeners('presence-tick');
    }, 3500);

    // Every 12 seconds, sync with edge API /api/telemetry
    setInterval(() => {
      sendCloudTelemetryHeartbeat();
    }, 12000);
  }

  // =========================================================================
  // PUBLIC USER ACTIONS (ACCOUNTS, GUEST, QUESTS, SCORE REPORTING)
  // =========================================================================
  function createScholarAccount({ name, avatar, school, state, ageBand, lang, importGuestProgress = true }) {
    const cleanName = String(name || '').trim();
    if (!cleanName) throw new Error('Please enter your Scholar Name.');

    const store = syncLiveStorageToActiveAccount();
    const id = 'scholar_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
    const guestAcc = store.accounts['guest'];

    const newAcc = createDefaultAccount({
      id,
      isGuest: false,
      name: cleanName,
      avatar: avatar || AVATARS[0],
      school: String(school || '').trim() || 'Malaysian Scholar',
      state: state || 'Kuala Lumpur',
      ageBand: ageBand || (guestAcc ? guestAcc.ageBand : '10-12'),
      lang: lang || (guestAcc ? guestAcc.lang : 'en'),
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      bonusXp: 100, // +100 Welcome Scholar Sign-Up Bonus XP!
      claimedQuests: {},
      customEvents: { shrinesAnswered: 0, questionsAnswered: 0, monstersDefeated: 0 },
      gameSnapshots: {},
      customGameScores: {}
    });

    if (importGuestProgress && guestAcc) {
      newAcc.gameSnapshots = Object.assign({}, guestAcc.gameSnapshots || {});
      newAcc.customEvents = Object.assign({}, guestAcc.customEvents || {});
      newAcc.claimedQuests = Object.assign({}, guestAcc.claimedQuests || {});
      newAcc.bonusXp += Number(guestAcc.bonusXp) || 0;
      newAcc.customGameScores = Object.assign({}, guestAcc.customGameScores || {});
    }

    store.accounts[id] = newAcc;
    store.activeAccountId = id;
    const ev = logActivityEvent(store, `New Scholar Account registered: ${cleanName} (${newAcc.state})`, 100, 'portal-hub');
    applyAccountToLiveStorage(newAcc, store);
    sendCloudTelemetryHeartbeat(ev);
    notifyListeners('account-changed');
    return getActiveUserStats();
  }

  function switchAccount(accountId) {
    const store = syncLiveStorageToActiveAccount();
    if (!store.accounts[accountId]) throw new Error('Account not found.');
    store.activeAccountId = accountId;
    const targetAcc = store.accounts[accountId];
    logActivityEvent(store, `Switched active profile to ${targetAcc.name}`, 0, 'portal-hub');
    applyAccountToLiveStorage(targetAcc, store);
    sendCloudTelemetryHeartbeat();
    notifyListeners('account-changed');
    return getActiveUserStats();
  }

  function playAsGuest(resetGuest = false) {
    const store = syncLiveStorageToActiveAccount();
    if (!store.accounts['guest'] || resetGuest) {
      store.accounts['guest'] = createDefaultAccount();
    }
    store.activeAccountId = 'guest';
    applyAccountToLiveStorage(store.accounts['guest'], store);
    sendCloudTelemetryHeartbeat();
    notifyListeners('account-changed');
    return getActiveUserStats();
  }

  function updateActiveProfile(updates = {}) {
    const store = syncLiveStorageToActiveAccount();
    const acc = store.accounts[store.activeAccountId];
    if (!acc) return null;

    if (updates.name !== undefined && String(updates.name).trim()) {
      acc.name = String(updates.name).trim();
    }
    if (updates.avatar) acc.avatar = updates.avatar;
    if (updates.school !== undefined) acc.school = String(updates.school).trim() || 'Malaysia';
    if (updates.state) acc.state = updates.state;
    if (updates.ageBand) acc.ageBand = updates.ageBand;
    if (updates.lang) acc.lang = updates.lang;
    if (updates.isGuest !== undefined) acc.isGuest = Boolean(updates.isGuest);

    applyAccountToLiveStorage(acc, store);
    sendCloudTelemetryHeartbeat();
    notifyListeners('profile-updated');
    return getActiveUserStats();
  }

  function claimQuestReward(questId) {
    const store = syncLiveStorageToActiveAccount();
    const acc = store.accounts[store.activeAccountId];
    if (!acc) return { ok: false, reason: 'No active account' };

    const stats = calculateAccountStats(acc, store);
    const quest = stats.quests.find(q => q.id === questId);
    if (!quest) return { ok: false, reason: 'Quest not found' };
    if (!quest.isCompleted) return { ok: false, reason: 'Quest not yet completed! Play the game to finish it.' };
    if (quest.isClaimed) return { ok: false, reason: 'Quest reward already claimed!' };

    if (!acc.claimedQuests) acc.claimedQuests = {};
    acc.claimedQuests[questId] = Date.now();
    acc.bonusXp = (Number(acc.bonusXp) || 0) + quest.xpReward;

    let allClaimedBonus = 0;
    const allClaimed = DAILY_QUESTS.every(q => Boolean(acc.claimedQuests[q.id]));
    if (allClaimed && !acc.dailyBonusClaimed) {
      acc.dailyBonusClaimed = true;
      allClaimedBonus = 300;
      acc.bonusXp += allClaimedBonus;
    }

    const totalAward = quest.xpReward + allClaimedBonus;
    const ev = logActivityEvent(store, `Claimed Daily Quest: ${quest.title} (+${totalAward} XP)`, totalAward, 'portal-hub');
    savePortalStore(store);
    sendCloudTelemetryHeartbeat(ev);
    notifyListeners('quest-claimed', { questId, xpReward: quest.xpReward, allClaimedBonus });
    return { ok: true, xpReward: quest.xpReward, allClaimedBonus, stats: getActiveUserStats() };
  }

  function reportGameEvent(payload = {}) {
    const store = syncLiveStorageToActiveAccount();
    const acc = store.accounts[store.activeAccountId];
    if (!acc) return null;

    if (!acc.customEvents) acc.customEvents = { shrinesAnswered: 0, questionsAnswered: 0, monstersDefeated: 0 };
    if (!acc.customGameScores) acc.customGameScores = {};

    const gameId = payload.gameId || detectCurrentGameArea();
    if (payload.shrinesDelta) {
      acc.customEvents.shrinesAnswered = (Number(acc.customEvents.shrinesAnswered) || 0) + Number(payload.shrinesDelta);
      if (gameId === 'learn-and-leap') {
        acc.customEvents.leapShrinesAnswered = (Number(acc.customEvents.leapShrinesAnswered) || 0) + Number(payload.shrinesDelta);
      }
      acc.customEvents.questionsAnswered = (Number(acc.customEvents.questionsAnswered) || 0) + Number(payload.shrinesDelta);
    }
    if (payload.questionsDelta) {
      acc.customEvents.questionsAnswered = (Number(acc.customEvents.questionsAnswered) || 0) + Number(payload.questionsDelta);
      if (gameId === 'titan-academy') {
        acc.customEvents.titanQuestionsAnswered = (Number(acc.customEvents.titanQuestionsAnswered) || 0) + Number(payload.questionsDelta);
      }
    }
    if (payload.monstersDelta) {
      acc.customEvents.monstersDefeated = (Number(acc.customEvents.monstersDefeated) || 0) + Number(payload.monstersDelta);
    }
    if (payload.bonusXpDelta) {
      acc.bonusXp = (Number(acc.bonusXp) || 0) + Number(payload.bonusXpDelta);
    }

    if (gameId && gameId !== 'learn-and-leap' && gameId !== 'titan-academy') {
      const prev = acc.customGameScores[gameId] || { levelsCompleted: 0, totalStars: 0, bossesDefeated: 0, questionsSolved: 0, xp: 0 };
      if (payload.levelsDelta) prev.levelsCompleted += Number(payload.levelsDelta);
      if (payload.starsDelta) prev.totalStars += Number(payload.starsDelta);
      if (payload.bossesDelta) prev.bossesDefeated += Number(payload.bossesDelta);
      if (payload.questionsDelta) prev.questionsSolved += Number(payload.questionsDelta);
      if (payload.xpDelta) prev.xp += Number(payload.xpDelta);
      acc.customGameScores[gameId] = prev;
    }

    const ev = logActivityEvent(store, payload.title || `Game score updated in ${gameId}`, payload.xpDelta || 25, gameId);
    savePortalStore(store);
    const updatedStats = calculateAccountStats(acc, store);
    sendCloudTelemetryHeartbeat(ev);
    notifyListeners('score-updated', { payload, stats: updatedStats });
    return updatedStats;
  }

  const PRODUCTION_GEMINI_ENDPOINT = 'https://www.openai.com.my/api/gemini';

  function canUseRemoteGeminiFallback() {
    try {
      const host = typeof window !== 'undefined' && window.location && window.location.hostname ? window.location.hostname : '';
      return host !== 'www.openai.com.my' && host !== 'openai.com.my';
    } catch (_) {
      return false;
    }
  }

  async function fetchGeminiWithFallback(reqInit) {
    const canFallback = canUseRemoteGeminiFallback();
    try {
      const res = await fetch('/api/gemini', reqInit);
      const data = await res.json().catch(() => null);
      if (!canFallback || (res.status !== 404 && res.status !== 503 && data && typeof data === 'object')) {
        return data || { ok: false, error: `HTTP ${res.status}` };
      }
    } catch (err) {
      if (!canFallback) {
        return {
          ok: false,
          error: 'Unable to reach /api/gemini edge endpoint.',
          detail: String(err && err.message ? err.message : err)
        };
      }
    }
    try {
      const remoteRes = await fetch(PRODUCTION_GEMINI_ENDPOINT, reqInit);
      return await remoteRes.json().catch(() => ({ ok: false, error: `HTTP ${remoteRes.status}` }));
    } catch (err) {
      return {
        ok: false,
        error: 'Unable to reach /api/gemini edge endpoint.',
        detail: String(err && err.message ? err.message : err)
      };
    }
  }

  async function checkGeminiStatus() {
    const res = await fetchGeminiWithFallback({ method: 'GET', cache: 'no-store' });
    return res && typeof res === 'object' ? res : { ok: false, configured: false };
  }

  async function askGemini(payload = {}) {
    const stats = getActiveUserStats();
    const requestBody = Object.assign({
      ageBand: stats.ageBand || '10-12',
      lang: stats.lang || 'en'
    }, payload);
    return fetchGeminiWithFallback({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
  }

  function registerFutureGame(manifest = {}) {
    if (!manifest.id || !manifest.title) {
      throw new Error('Game manifest requires at least "id" and "title".');
    }
    const store = loadPortalStore();
    if (!Array.isArray(store.customGames)) store.customGames = [];
    const idx = store.customGames.findIndex(g => g.id === manifest.id);
    const normalized = {
      id: String(manifest.id).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      title: String(manifest.title).trim(),
      genre: String(manifest.genre || 'Educational Game').trim(),
      status: manifest.status || 'live',
      path: manifest.path || `./${manifest.id}/index.html`,
      storageKey: manifest.storageKey || `${manifest.id}-v1`,
      maxLevels: Number(manifest.maxLevels) || 100,
      maxStars: Number(manifest.maxStars) || 300,
      icon: manifest.icon || '🎮',
      accentColor: manifest.accentColor || '#38bdf8',
      badgeText: manifest.badgeText || 'LIVE · SDK CONNECTED',
      subjects: Array.isArray(manifest.subjects) ? manifest.subjects : ['Mathematics', 'Science', 'English'],
      description: manifest.description || 'Connected to OpenAI.com.my Unified Academic XP & Leaderboard Engine.'
    };
    if (idx >= 0) {
      store.customGames[idx] = normalized;
    } else {
      store.customGames.push(normalized);
    }
    logActivityEvent(store, `Admin registered game: ${normalized.title} (${normalized.id})`, 0, 'portal-hub');
    savePortalStore(store);
    notifyListeners('games-updated', normalized);
    return normalized;
  }

  function removeCustomGame(gameId) {
    const store = loadPortalStore();
    if (!Array.isArray(store.customGames)) return;
    store.customGames = store.customGames.filter(g => g.id !== gameId);
    savePortalStore(store);
    notifyListeners('games-updated');
  }

  function getActiveUserStats() {
    const store = syncLiveStorageToActiveAccount();
    const acc = store.accounts[store.activeAccountId];
    return calculateAccountStats(acc, store);
  }

  function getAllAccountsList() {
    const store = syncLiveStorageToActiveAccount();
    return Object.values(store.accounts).map(acc => calculateAccountStats(acc, store));
  }

  // =========================================================================
  // ADMIN PORTAL AUTHENTICATION, MANAGEMENT & FULL DATA EXPORT ENGINE
  // =========================================================================
  const ADMIN_TOKEN_KEY = 'openai-admin-token-v26';
  const DEFAULT_ADMIN_PASSWORD_HASH = '92a98eb0d6611bc4abf7424e438cd895e02ba2776547ce5bfd64be41e0b29d2b';
  const ALLOWED_ADMIN_EMAILS = ['terrywonderful7@gmail.com', 'admin@openai.com.my'];

  async function sha256HexClient(text) {
    const data = new TextEncoder().encode(String(text || ''));
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function getAdminToken() {
    try {
      return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  function isAdminAuthenticated() {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated' && Boolean(sessionStorage.getItem(ADMIN_TOKEN_KEY));
    } catch (_) {
      return false;
    }
  }

  async function adminLogin(username, passcode) {
    const store = loadPortalStore();
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(passcode || '').trim();

    if (!cleanUser || !cleanPass) {
      return { ok: false, error: 'Please enter both Administrator Email and Secret Passcode.' };
    }

    // 1. Primary: Verify via Cloudflare Edge Server (/api/admin-auth) with IP brute-force protection & signed Bearer token
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: cleanUser, password: cleanPass })
      });
      if (res.status === 401 || res.status === 429) {
        const errData = await res.json().catch(() => ({}));
        return { ok: false, error: errData.error || 'Access denied: Invalid administrator credentials.' };
      }
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok && data.token) {
          try {
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
            sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
          } catch (_) {}
          logActivityEvent(store, `Owner (${cleanUser}) authenticated via Edge Security Gateway`, 0, 'admin');
          savePortalStore(store);
          return { ok: true, email: data.email || cleanUser };
        }
      }
    } catch (_) {
      // Fallback to local SHA-256 verification only if offline / local static server without Cloudflare Functions
    }

    // 2. Cryptographic SHA-256 Fallback (Zero plaintext password in code)
    const inputHash = await sha256HexClient(cleanPass);
    const activeHash = (store.adminConfig && store.adminConfig.passwordHash) || DEFAULT_ADMIN_PASSWORD_HASH;
    if (ALLOWED_ADMIN_EMAILS.includes(cleanUser) && inputHash === activeHash) {
      const localToken = btoa(JSON.stringify({ email: cleanUser, role: 'superadmin', exp: Date.now() + 8 * 3600 * 1000 })) + '.local_sha256';
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
        sessionStorage.setItem(ADMIN_TOKEN_KEY, localToken);
      } catch (_) {}
      logActivityEvent(store, `Owner (${cleanUser}) signed in to Admin Portal`, 0, 'admin');
      savePortalStore(store);
      return { ok: true, email: cleanUser };
    }

    return { ok: false, error: 'Access denied: Invalid Administrator Email or Secret Passcode.' };
  }

  function adminLogout() {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch (_) {}
  }

  async function updateAdminSettings(newSettings = {}) {
    const store = loadPortalStore();
    if (!store.adminConfig) {
      store.adminConfig = { passwordHash: DEFAULT_ADMIN_PASSWORD_HASH, onlineDisplayMode: 'hybrid', communityBaseCount: 380 };
    }
    delete store.adminConfig.passcode;
    if (newSettings.onlineDisplayMode) store.adminConfig.onlineDisplayMode = newSettings.onlineDisplayMode;
    if (newSettings.communityBaseCount !== undefined) store.adminConfig.communityBaseCount = Math.max(0, Number(newSettings.communityBaseCount) || 0);
    if (newSettings.passcode && String(newSettings.passcode).trim().length >= 8) {
      const newPass = String(newSettings.passcode).trim();
      store.adminConfig.passwordHash = await sha256HexClient(newPass);
      const token = getAdminToken();
      if (token) {
        try {
          await fetch('/api/admin-auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action: 'change_password', newPassword: newPass })
          });
        } catch (_) {}
      }
    }
    savePortalStore(store);
    notifyListeners('admin-settings-updated');
    return store.adminConfig;
  }

  function adminAwardBonusXp(accountId, xpDelta, reason = 'Admin Award') {
    const store = syncLiveStorageToActiveAccount();
    const acc = store.accounts[accountId];
    if (!acc) throw new Error('Account not found');
    const amount = Number(xpDelta) || 0;
    acc.bonusXp = Math.max(0, (Number(acc.bonusXp) || 0) + amount);
    logActivityEvent(store, `Admin awarded ${amount >= 0 ? '+' : ''}${amount} XP to ${acc.name} (${reason})`, amount, 'admin');
    savePortalStore(store);
    notifyListeners('score-updated');
    return calculateAccountStats(acc, store);
  }

  function adminDeleteAccount(accountId) {
    if (accountId === 'guest') {
      return playAsGuest(true);
    }
    const store = syncLiveStorageToActiveAccount();
    if (!store.accounts[accountId]) return;
    const deletedName = store.accounts[accountId].name;
    delete store.accounts[accountId];
    if (store.activeAccountId === accountId) {
      store.activeAccountId = 'guest';
      applyAccountToLiveStorage(store.accounts['guest'], store);
    }
    logActivityEvent(store, `Admin removed account: ${deletedName}`, 0, 'admin');
    savePortalStore(store);
    notifyListeners('account-changed');
  }

  async function getAdminDashboardData() {
    const store = syncLiveStorageToActiveAccount();
    const localScholars = Object.values(store.accounts).map(acc => calculateAccountStats(acc, store));

    // Also fetch cloud-synced scholars & active sessions from /api/telemetry?export=all using signed Admin Bearer token
    let cloudData = null;
    try {
      const token = getAdminToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/telemetry?export=all', { headers });
      if (res.ok) cloudData = await res.json();
    } catch (_) {}

    // Merge local scholars and cloud scholars by accountId
    const mergedMap = new Map();
    localScholars.forEach(s => {
      const leap = s.games['learn-and-leap'] || { levelsCompleted: 0, totalStars: 0, xp: 0 };
      const titan = s.games['titan-academy'] || { levelsCompleted: 0, totalStars: 0, xp: 0 };
      mergedMap.set(s.accountId, {
        accountId: s.accountId,
        name: s.name,
        avatar: s.avatar,
        isGuest: s.isGuest,
        school: s.school,
        state: s.state,
        ageBand: s.ageBand,
        lang: s.lang,
        level: s.level,
        rankTitle: s.rankTitle,
        totalXp: s.totalXp,
        bonusXp: s.bonusXp,
        totalStars: s.totalStars,
        totalLevelsCompleted: s.totalLevelsCompleted,
        totalQuestionsSolved: s.totalQuestionsSolved,
        claimedQuestsCount: s.claimedQuestsCount,
        leapLevels: leap.levelsCompleted,
        leapStars: leap.totalStars,
        leapXp: leap.xp,
        titanLevels: titan.levelsCompleted,
        titanStars: titan.totalStars,
        titanXp: titan.xp,
        source: 'Local + Cloud Synced',
        lastActiveIso: new Date(s.lastActiveAt || Date.now()).toISOString(),
        rawStats: s
      });
    });

    if (cloudData && Array.isArray(cloudData.allScholars)) {
      cloudData.allScholars.forEach(cs => {
        if (!mergedMap.has(cs.accountId)) {
          mergedMap.set(cs.accountId, Object.assign({ source: 'Cloud Edge Visitor' }, cs));
        }
      });
    }

    const allScholars = Array.from(mergedMap.values()).sort((a, b) => b.totalXp - a.totalXp);
    const events = (cloudData && Array.isArray(cloudData.allEvents) && cloudData.allEvents.length > 0)
      ? cloudData.allEvents
      : (store.activityLog || []);

    const totals = allScholars.reduce((acc, s) => {
      acc.totalXp += Number(s.totalXp) || 0;
      acc.totalStars += Number(s.totalStars) || 0;
      acc.totalLevels += Number(s.totalLevelsCompleted) || 0;
      acc.totalQuestions += Number(s.totalQuestionsSolved) || 0;
      return acc;
    }, { totalXp: 0, totalStars: 0, totalLevels: 0, totalQuestions: 0 });

    return {
      adminConfig: store.adminConfig,
      onlineStats: getOnlineStats(),
      scholarsCount: allScholars.length,
      registeredScholarsCount: allScholars.filter(s => !s.isGuest).length,
      guestCount: allScholars.filter(s => s.isGuest).length,
      totals,
      scholars: allScholars,
      events: events.slice(0, 100),
      games: getAllGames(store)
    };
  }

  function escapeCsvCell(val) {
    const str = String(val === null || val === undefined ? '' : val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function triggerFileDownload(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  async function exportScholarsCsv(includePeers = false) {
    const dash = await getAdminDashboardData();
    const rows = [
      [
        'Account ID', 'Scholar Name', 'Account Type', 'School', 'Malaysian State',
        'Age Group', 'Language', 'Scholar Level', 'Academic Rank', 'Total Academic XP',
        'Bonus / Quest XP', 'Total Stars (★)', 'Total Levels Cleared', 'Questions Solved',
        'Learn & Leap Levels', 'Learn & Leap Stars', 'Learn & Leap XP',
        'Titan Academy Monsters', 'Titan Academy Stars', 'Titan Academy XP',
        'Daily Quests Claimed', 'Data Source', 'Last Active (ISO)'
      ]
    ];

    dash.scholars.forEach(s => {
      rows.push([
        s.accountId,
        s.name,
        s.isGuest ? 'Guest' : 'Registered Scholar',
        s.school,
        s.state,
        s.ageBand,
        s.lang,
        s.level,
        s.rankTitle,
        s.totalXp,
        s.bonusXp,
        s.totalStars,
        s.totalLevelsCompleted,
        s.totalQuestionsSolved,
        s.leapLevels,
        s.leapStars,
        s.leapXp,
        s.titanLevels,
        s.titanStars,
        s.titanXp,
        s.claimedQuestsCount,
        s.source,
        s.lastActiveIso
      ]);
    });

    if (includePeers) {
      BASE_SCHOLARS.forEach(p => {
        const totalXp = p.leapXp + p.titanXp;
        const totalStars = p.leapStars + p.titanStars;
        const lvl = Math.floor(totalXp / 300) + 1;
        rows.push([
          p.id, p.name, 'Leaderboard Seed Scholar', p.school, p.state,
          p.ageBand, 'en', lvl, getRankTitle(lvl, p.ageBand), totalXp,
          0, totalStars, Math.round(totalStars / 2.5), totalStars * 2,
          Math.round(p.leapStars / 2.5), p.leapStars, p.leapXp,
          Math.round(p.titanStars / 2.5), p.titanStars, p.titanXp,
          0, 'National Leaderboard Seed', new Date().toISOString()
        ]);
      });
    }

    const csvContent = '\uFEFF' + rows.map(r => r.map(escapeCsvCell).join(',')).join('\r\n');
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `openai-my-scholars-report-${dateStr}.csv`;
    triggerFileDownload(filename, csvContent, 'text/csv;charset=utf-8;');
    return { filename, rowCount: rows.length - 1 };
  }

  function exportDetailedLevelsCsv() {
    const store = syncLiveStorageToActiveAccount();
    const rows = [
      ['Account ID', 'Scholar Name', 'Account Type', 'State', 'Game ID', 'Age Group', 'Level Number', 'Stars Earned (1-3)', 'XP Contributed']
    ];

    Object.values(store.accounts).forEach(acc => {
      const st = calculateAccountStats(acc, store);
      ['learn-and-leap', 'titan-academy', 'voxel-craft-my', 'flora-scholars', 'slug-math', 'science-quest-my'].forEach(gid => {
        const g = st.games[gid];
        if (g && Array.isArray(g.levelRecords)) {
          g.levelRecords.forEach(rec => {
            const xp = 100 + (rec.stars * 50) + (rec.level % 10 === 0 ? 150 : 0);
            rows.push([
              acc.id, acc.name, acc.isGuest ? 'Guest' : 'Scholar', acc.state,
              rec.gameId, rec.ageBand, rec.level, rec.stars, xp
            ]);
          });
        }
      });
    });

    const csvContent = '\uFEFF' + rows.map(r => r.map(escapeCsvCell).join(',')).join('\r\n');
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `openai-my-detailed-level-progress-${dateStr}.csv`;
    triggerFileDownload(filename, csvContent, 'text/csv;charset=utf-8;');
    return { filename, rowCount: rows.length - 1 };
  }

  async function exportFullBackupJson() {
    const store = syncLiveStorageToActiveAccount();
    const dash = await getAdminDashboardData();
    const backup = {
      exportedAt: new Date().toISOString(),
      portalDomain: 'https://openai.com.my',
      sdkVersion: '2.5.0',
      portalStore: store,
      cloudSyncedSummary: {
        scholarsCount: dash.scholarsCount,
        totals: dash.totals,
        scholars: dash.scholars,
        recentEvents: dash.events
      }
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `openai-my-full-backup-${dateStr}.json`;
    triggerFileDownload(filename, jsonStr, 'application/json;charset=utf-8;');
    return { filename };
  }

  function importBackupJson(jsonString) {
    const parsed = safeParse(jsonString, null);
    if (!parsed) throw new Error('Invalid JSON backup file.');
    const targetStore = parsed.portalStore || (parsed.accounts ? parsed : null);
    if (!targetStore || !targetStore.accounts) {
      throw new Error('Backup JSON does not contain a valid OpenAI.com.my accounts structure.');
    }
    savePortalStore(targetStore);
    const activeAcc = targetStore.accounts[targetStore.activeAccountId] || Object.values(targetStore.accounts)[0];
    if (activeAcc) {
      applyAccountToLiveStorage(activeAcc, targetStore);
    }
    notifyListeners('backup-restored');
    return getActiveUserStats();
  }

  // Event Subscription System
  const listeners = new Set();
  function subscribe(fn) {
    if (typeof fn === 'function') listeners.add(fn);
    return () => listeners.delete(fn);
  }
  function notifyListeners(event, detail) {
    const stats = getActiveUserStats();
    listeners.forEach(fn => {
      try { fn(event, stats, detail); } catch (_) {}
    });
  }

  // =========================================================================
  // UNIFIED O.A.I. STANDARD GAME CONTROLS & FULLSCREEN SYSTEM (v3.1)
  // Standardizes Main Page, Start Game, Full Screen & Exit across ALL games
  // =========================================================================
  let isIosPseudoFullscreen = false;

  const STD_LABELS = {
    en: {
      mainPage: 'Main Page',
      startGame: 'Start Game',
      resume: 'Resume',
      playAgain: 'Play Again',
      restart: 'Restart',
      startWave: 'Start Wave',
      fullScreen: 'Full Screen',
      exitFullScreen: 'Exit Full Screen',
      exit: 'Exit',
      modalBadge: 'O.A.I. MALAYSIA · GAME CONTROLS',
      modalTitle: 'Exit Game & Return to Main Page?',
      modalBody: 'Your academic XP, stars, and level progress are automatically saved to your O.A.I. Malaysia scholar profile.',
      stayBtn: 'Stay & Continue Playing',
      menuBtn: 'Return to Game Menu',
      fsBtn: 'Toggle Full Screen Mode',
      leaveBtn: 'Exit to Main Page'
    },
    ms: {
      mainPage: 'Laman Utama',
      startGame: 'Mula Main',
      resume: 'Sambung',
      playAgain: 'Main Semula',
      restart: 'Ulang',
      startWave: 'Mula Gelombang',
      fullScreen: 'Skrin Penuh',
      exitFullScreen: 'Keluar Skrin',
      exit: 'Keluar',
      modalBadge: 'O.A.I. MALAYSIA · KAWALAN PERMAINAN',
      modalTitle: 'Keluar Permainan & Kembali ke Laman Utama?',
      modalBody: 'XP akademik, bintang dan kemajuan tahap anda telah disimpan secara automatik ke profil O.A.I. Malaysia.',
      stayBtn: 'Teruskan Bermain',
      menuBtn: 'Kembali ke Menu Permainan',
      fsBtn: 'Tukar Mod Skrin Penuh',
      leaveBtn: 'Keluar ke Laman Utama'
    },
    zh: {
      mainPage: '返回主页',
      startGame: '开始游戏',
      resume: '继续游戏',
      playAgain: '再玩一次',
      restart: '重新开始',
      startWave: '开始波次',
      fullScreen: '全屏模式',
      exitFullScreen: '退出全屏',
      exit: '退出',
      modalBadge: 'O.A.I. MALAYSIA · 标准游戏控制',
      modalTitle: '退出游戏并返回主页？',
      modalBody: '您的学术 XP、星星与关卡进度已自动保存至 O.A.I. Malaysia 学者档案。',
      stayBtn: '留下来继续游玩',
      menuBtn: '返回游戏菜单',
      fsBtn: '切换全屏模式',
      leaveBtn: '退出并返回主页'
    }
  };

  const SVG_ICONS = {
    home: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    play: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    restart: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
    maximize: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    minimize: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    exit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
  };

  function getActiveControlLabels() {
    try {
      const stats = getActiveUserStats();
      const lang = stats && stats.lang;
      if (lang === 'ms' || lang === 'zh') return STD_LABELS[lang];
    } catch (_) {}
    return STD_LABELS.en;
  }

  function resolveMainPageHref() {
    if (window.location.protocol !== 'file:') {
      return '/';
    }
    const p = (window.location.pathname || '').replace(/\\/g, '/');
    return p.includes('/games/') ? '../../index.html' : '../index.html';
  }

  function isElementVisible(el) {
    if (!el || el.hidden || el.disabled) return false;
    try {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 4 && rect.height > 4;
    } catch (_) {
      return false;
    }
  }

  function isNativeFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  function isFullscreenActive() {
    return Boolean(
      isNativeFullscreen() ||
      isIosPseudoFullscreen ||
      (document.documentElement && document.documentElement.classList && document.documentElement.classList.contains('openai-fullscreen-mode')) ||
      (document.body && document.body.classList && document.body.classList.contains('openai-fullscreen-mode'))
    );
  }

  function dispatchFullscreenResizeBurst() {
    window.dispatchEvent(new Event('resize'));
    [60, 180, 380, 650].forEach((delay) => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, delay);
    });
  }

  function applyFullscreenClasses(active) {
    if (document.documentElement && document.documentElement.classList) {
      document.documentElement.classList.toggle('openai-fullscreen-mode', active);
      document.documentElement.classList.toggle('openai-portal-fullscreen', active);
    }
    if (document.body && document.body.classList) {
      document.body.classList.toggle('openai-fullscreen-mode', active);
      document.body.classList.toggle('openai-ios-fullscreen', active && !isNativeFullscreen());
    }
  }

  async function toggleFullscreen(forceState) {
    const currentlyFull = isFullscreenActive();
    const targetFull = typeof forceState === 'boolean' ? forceState : !currentlyFull;
    const docEl = document.documentElement;

    if (targetFull && !currentlyFull) {
      let nativeSucceeded = false;
      try {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen({ navigationUI: 'hide' });
          nativeSucceeded = isNativeFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
          nativeSucceeded = true;
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
          nativeSucceeded = true;
        }
        const preferredOrientation = (docEl.dataset && docEl.dataset.portalOrientation) || 'landscape';
        if (screen.orientation && typeof screen.orientation.lock === 'function') {
          screen.orientation.lock(preferredOrientation).catch(() => {});
        }
      } catch (_) {
        nativeSucceeded = false;
      }
      isIosPseudoFullscreen = !nativeSucceeded;
      applyFullscreenClasses(true);
      setTimeout(() => {
        if (!isNativeFullscreen() && isFullscreenActive()) {
          isIosPseudoFullscreen = true;
          if (document.body) document.body.classList.add('openai-ios-fullscreen');
        }
        syncFullscreenButtons();
      }, 90);
    } else if (!targetFull && currentlyFull) {
      try {
        if (document.exitFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
          document.webkitExitFullscreen();
        }
      } catch (_) {}
      if (screen.orientation && typeof screen.orientation.unlock === 'function') {
        try {
          screen.orientation.unlock();
        } catch (_) {}
      }
      isIosPseudoFullscreen = false;
      applyFullscreenClasses(false);
    }
    syncFullscreenButtons();
    dispatchFullscreenResizeBurst();
    return isFullscreenActive();
  }

  function syncFullscreenButtons() {
    const nativeNow = isNativeFullscreen();
    if (!nativeNow && !isIosPseudoFullscreen) {
      applyFullscreenClasses(false);
    } else if (nativeNow) {
      applyFullscreenClasses(true);
    }

    const active = isFullscreenActive();
    const labels = getActiveControlLabels();

    const stdFsBtn = document.getElementById('oai-btn-fullscreen');
    if (stdFsBtn) {
      stdFsBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      stdFsBtn.setAttribute('title', active ? labels.exitFullScreen : labels.fullScreen);
      stdFsBtn.classList.toggle('is-fullscreen', active);
      const iconSlot = stdFsBtn.querySelector('.oai-btn-icon');
      const textSlot = stdFsBtn.querySelector('.oai-btn-label');
      if (iconSlot) iconSlot.innerHTML = active ? SVG_ICONS.minimize : SVG_ICONS.maximize;
      if (textSlot) textSlot.textContent = active ? labels.exitFullScreen : labels.fullScreen;
    }

    document.querySelectorAll('[data-portal-fullscreen-btn], .fs-header-btn').forEach((btn) => {
      if (btn.id === 'oai-btn-fullscreen') return;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      const labelEl = btn.querySelector('.portal-fs-label') || btn;
      if (labelEl) {
        labelEl.textContent = active ? labels.exitFullScreen : labels.fullScreen;
      }
      btn.classList.toggle('is-fullscreen', active);
    });

    dispatchFullscreenResizeBurst();
  }

  // =========================================================================
  // SMART CROSS-GAME START / RESUME / MENU DISPATCHER (ALL 7 GAMES)
  // =========================================================================
  function findVisibleInGameStartButton(detectedId) {
    const insideStdBar = (el) => Boolean(el && el.closest && (el.closest('#oai-std-game-bar') || el.closest('#openai-portal-exit-modal')));

    if (detectedId === 'learn-and-leap') {
      const leapSelectors = [
        '#screen [data-action="start"]',
        '#screen [data-action="resume"]',
        '#screen [data-action="next"]',
        '#screen [data-action="restart"]',
        '#screen .button-primary'
      ];
      for (const sel of leapSelectors) {
        const el = document.querySelector(sel);
        if (isElementVisible(el)) return { el, kind: sel.includes('resume') ? 'resume' : sel.includes('restart') || sel.includes('next') ? 'again' : 'start' };
      }
      return null;
    }

    if (detectedId === 'titan-academy') {
      const overlayBtn = document.querySelector('#battleOverlay button');
      if (isElementVisible(overlayBtn)) {
        const txt = (overlayBtn.textContent || '').toLowerCase();
        if (txt.includes('resume') || txt.includes('继续') || txt.includes('sambung')) return { el: overlayBtn, kind: 'resume' };
        if (txt.includes('again') || txt.includes('retry') || txt.includes('next') || txt.includes('semula')) return { el: overlayBtn, kind: 'again' };
        return { el: overlayBtn, kind: 'start' };
      }
      return null;
    }

    if (detectedId === 'science-quest-my') {
      const resRetry = document.querySelector('#modal-result.open #btn-res-next, #modal-result.open #btn-res-retry');
      if (isElementVisible(resRetry)) return { el: resRetry, kind: 'again' };
      const waveBtn = document.getElementById('btn-next-wave');
      if (isElementVisible(waveBtn)) return { el: waveBtn, kind: 'wave' };
      return null;
    }

    // Compiled React SPAs (Slug Math, TankMath Armageddon, Flora Scholars, Voxel Craft MY) & future games
    const dataStarts = document.querySelectorAll('[data-start="true"], [data-start]');
    for (const el of dataStarts) {
      if (!insideStdBar(el) && isElementVisible(el)) {
        const txt = (el.textContent || '').toLowerCase();
        if (txt.includes('resume')) return { el, kind: 'resume' };
        if (txt.includes('again') || txt.includes('retry') || txt.includes('next')) return { el, kind: 'again' };
        return { el, kind: 'start' };
      }
    }

    // Fallback text matcher for React games whose primary Start/Play/Resume button lacks data-start
    const candidates = document.querySelectorAll('button');
    const priorityPatterns = [
      { re: /\b(resume game|resume battle|resume)\b/i, kind: 'resume' },
      { re: /\b(tap to start|commence mission|start game|start battle|start mission|start defense|start adventure|play world|deploy|begin)\b/i, kind: 'start' },
      { re: /\b(play again|try again|next blueprint|next sector|next level)\b/i, kind: 'again' },
      { re: /^(▶\s*)?(start|play|mula|开始)/i, kind: 'start' }
    ];
    for (const { re, kind } of priorityPatterns) {
      for (const btn of candidates) {
        if (insideStdBar(btn) || !isElementVisible(btn)) continue;
        const txt = (btn.textContent || '').trim();
        if (txt.length > 0 && txt.length <= 44 && re.test(txt)) {
          return { el: btn, kind };
        }
      }
    }
    return null;
  }

  function triggerStandardStartAction(detectedId) {
    const found = findVisibleInGameStartButton(detectedId);
    if (found && found.el) {
      found.el.click();
      setTimeout(() => syncStandardStartButton(detectedId), 120);
      return true;
    }

    // Direct engine hooks when currently in active gameplay (Restart / Resume)
    if (detectedId === 'learn-and-leap' && window.__LEAP_DEBUG__) {
      const dbg = window.__LEAP_DEBUG__;
      if (dbg.state && dbg.state.scene === 'play') {
        dbg.startLevel(dbg.state.level || 1);
      } else if (typeof dbg.startLevel === 'function') {
        dbg.startLevel((dbg.state && dbg.state.level) || 1);
      }
      setTimeout(() => syncStandardStartButton(detectedId), 120);
      return true;
    }

    if (detectedId === 'titan-academy') {
      const pauseBtn = document.getElementById('pauseBtn');
      if (pauseBtn && isElementVisible(pauseBtn)) {
        pauseBtn.click();
        setTimeout(() => syncStandardStartButton(detectedId), 120);
        return true;
      }
    }

    if (detectedId === 'science-quest-my') {
      const waveBtn = document.getElementById('btn-next-wave');
      if (waveBtn && !waveBtn.disabled) {
        waveBtn.click();
        return true;
      }
      const quizBtn = document.getElementById('btn-quiz');
      if (quizBtn && isElementVisible(quizBtn)) {
        quizBtn.click();
        return true;
      }
    }

    // If playing a compiled game with no visible Start/Resume button, press Escape to open Pause/Restart menu or reload cleanly
    const pauseOrRestartBtn = Array.from(document.querySelectorAll('button')).find((b) => {
      if (b.closest('#oai-std-game-bar') || b.closest('#openai-portal-exit-modal') || !isElementVisible(b)) return false;
      const lbl = ((b.getAttribute('aria-label') || '') + ' ' + (b.textContent || '')).toLowerCase();
      return /\b(restart|replay)\b/.test(lbl);
    });
    if (pauseOrRestartBtn) {
      pauseOrRestartBtn.click();
      return true;
    }

    window.location.reload();
    return true;
  }

  function tryReturnToGameMenu(detectedId) {
    if (detectedId === 'learn-and-leap' && window.__LEAP_DEBUG__ && typeof window.__LEAP_DEBUG__.showScreen === 'function') {
      window.__LEAP_DEBUG__.showScreen('title');
      return true;
    }
    const menuBtn = Array.from(document.querySelectorAll('button')).find((b) => {
      if (b.closest('#oai-std-game-bar') || b.closest('#openai-portal-exit-modal') || !isElementVisible(b)) return false;
      const lbl = ((b.getAttribute('aria-label') || '') + ' ' + (b.textContent || '')).toLowerCase();
      return /return to title|title screen|main menu|sector hub|select op/.test(lbl);
    });
    if (menuBtn) {
      menuBtn.click();
      return true;
    }
    if (detectedId === 'titan-academy') {
      const mapBtn = document.getElementById('mapBtn');
      if (mapBtn) {
        mapBtn.click();
        return true;
      }
    }
    if (detectedId === 'science-quest-my') {
      const opsBtn = document.getElementById('btn-open-ops');
      if (opsBtn) {
        opsBtn.click();
        return true;
      }
    }
    return false;
  }

  function syncStandardStartButton(detectedId) {
    const startBtn = document.getElementById('oai-btn-start');
    if (!startBtn) return;
    const labels = getActiveControlLabels();
    const iconSlot = startBtn.querySelector('.oai-btn-icon');
    const textSlot = startBtn.querySelector('.oai-btn-label');

    const found = findVisibleInGameStartButton(detectedId);
    let label = labels.startGame;
    let icon = SVG_ICONS.play;
    let isSecondary = false;

    if (found) {
      if (found.kind === 'resume') {
        label = labels.resume;
      } else if (found.kind === 'again') {
        label = labels.playAgain;
      } else if (found.kind === 'wave') {
        label = labels.startWave;
      } else {
        label = labels.startGame;
      }
    } else {
      // Currently mid-gameplay with no start overlay visible
      label = labels.restart;
      icon = SVG_ICONS.restart;
      isSecondary = true;
    }

    if (iconSlot) iconSlot.innerHTML = icon;
    if (textSlot) textSlot.textContent = label;
    startBtn.setAttribute('title', label);
    startBtn.setAttribute('aria-label', label);
    startBtn.classList.toggle('is-playing', isSecondary);
  }

  // Automatically hide duplicate legacy Hub / Fullscreen buttons inside compiled & source games
  // so every game has ONE unmistakable set of standardized controls.
  function harmonizeLegacyGameButtons(detectedId) {
    const insideStd = (el) => Boolean(el && el.closest && (el.closest('#oai-std-game-bar') || el.closest('#openai-portal-exit-modal')));

    // 1. Hide duplicate legacy Hub / Main Page links inside individual games
    const legacyHubSelectors = [
      '#hubBackBtn',
      '#oai-floating-hub-btn',
      '.hub-header-link',
      '.hub-floating-btn',
      'a[href="../index.html"]',
      'a[href="../../"]',
      'a[href="../../index.html"]',
      'a[title*="Portal Hub"]',
      'a[title*="Return to O.A.I."]',
      'a[title*="Return to OpenAI.com.my"]',
      'a[aria-label*="O.A.I. Malaysia"]'
    ];
    document.querySelectorAll(legacyHubSelectors.join(',')).forEach((el) => {
      if (!insideStd(el)) {
        el.setAttribute('data-oai-deduped', 'hub');
        el.style.setProperty('display', 'none', 'important');
      }
    });

    // 2. Hide duplicate legacy Full Screen buttons inside individual games
    const legacyFsSelectors = [
      '#fsHudBtn',
      '.fs-header-btn',
      'button[title="Toggle Full Screen Mode"]',
      'button[title="Toggle Full Screen"]',
      'button[aria-label="Toggle Full Screen"]',
      'button[aria-label="Enter full screen"]',
      'button[aria-label="Exit full screen"]',
      'button[title="Full Screen"]',
      'button[title="Exit Full Screen"]'
    ];
    document.querySelectorAll(legacyFsSelectors.join(',')).forEach((el) => {
      if (!insideStd(el)) {
        el.setAttribute('data-oai-deduped', 'fullscreen');
        el.style.setProperty('display', 'none', 'important');
      }
    });

    // 3. Harmonize primary in-page Start buttons with unified O.A.I. styling marker
    const found = findVisibleInGameStartButton(detectedId);
    if (found && found.el && found.kind === 'start') {
      found.el.setAttribute('data-oai-start-target', 'true');
    }

    syncStandardStartButton(detectedId);
  }

  function openExitConfirmationModal(targetHref, mode) {
    const destination = (targetHref && targetHref !== '../index.html' && targetHref !== '../../')
      ? targetHref
      : resolveMainPageHref();
    const detectedId = detectCurrentGameArea();
    const labels = getActiveControlLabels();

    let modal = document.getElementById('openai-portal-exit-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'openai-portal-exit-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'openai-exit-modal-title');
      modal.innerHTML = `
        <div class="openai-exit-card">
          <div class="openai-exit-badge" id="openai-exit-badge">${labels.modalBadge}</div>
          <h2 id="openai-exit-modal-title">${labels.modalTitle}</h2>
          <p id="openai-exit-modal-body">${labels.modalBody}</p>
          <div class="openai-exit-actions">
            <button type="button" id="openai-exit-stay-btn" class="openai-exit-btn-stay">
              ${SVG_ICONS.play} <span>${labels.stayBtn}</span>
            </button>
            <button type="button" id="openai-exit-menu-btn" class="openai-exit-btn-menu" style="display:none;">
              ${SVG_ICONS.restart} <span>${labels.menuBtn}</span>
            </button>
            <button type="button" id="openai-exit-fs-btn" class="openai-exit-btn-fs">
              ${SVG_ICONS.maximize} <span>${labels.fsBtn}</span>
            </button>
            <a id="openai-exit-confirm-link" href="${destination}" data-bypass-exit-guard="true" class="openai-exit-btn-leave">
              ${SVG_ICONS.home} <span>${labels.leaveBtn}</span>
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
      document.getElementById('openai-exit-stay-btn').addEventListener('click', () => {
        modal.classList.remove('open');
      });
      document.getElementById('openai-exit-menu-btn').addEventListener('click', () => {
        modal.classList.remove('open');
        tryReturnToGameMenu(detectCurrentGameArea());
      });
      document.getElementById('openai-exit-fs-btn').addEventListener('click', () => {
        toggleFullscreen();
        modal.classList.remove('open');
      });
    } else {
      const link = document.getElementById('openai-exit-confirm-link');
      if (link) link.setAttribute('href', destination);
      const titleEl = document.getElementById('openai-exit-modal-title');
      if (titleEl) titleEl.textContent = labels.modalTitle;
      const bodyEl = document.getElementById('openai-exit-modal-body');
      if (bodyEl) bodyEl.textContent = labels.modalBody;
    }

    // Show "Return to Game Menu" when triggered from Exit mid-game if supported
    const menuBtn = document.getElementById('openai-exit-menu-btn');
    if (menuBtn) {
      const canReturnMenu = mode === 'exit' && (
        (detectedId === 'learn-and-leap' && window.__LEAP_DEBUG__ && window.__LEAP_DEBUG__.state && window.__LEAP_DEBUG__.state.scene === 'play') ||
        detectedId === 'titan-academy' ||
        detectedId === 'science-quest-my'
      );
      menuBtn.style.display = canReturnMenu ? 'inline-flex' : 'none';
    }

    modal.classList.add('open');
  }

  function installTouchAndExitGuards() {
    // Intercept any tap on Return to Main Page / Hub links inside games
    document.addEventListener(
      'click',
      (e) => {
        const anchor = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!anchor) return;
        if (anchor.getAttribute('data-bypass-exit-guard') === 'true') return;
        const href = (anchor.getAttribute('href') || '').trim();
        if (
          href === '/' ||
          href === '../index.html' ||
          href === '/index.html' ||
          href === '../' ||
          href === '../../' ||
          href === '../../index.html' ||
          anchor.id === 'oai-btn-mainpage' ||
          anchor.classList.contains('portal-back-link') ||
          anchor.classList.contains('hub-floating-btn') ||
          anchor.classList.contains('hub-header-link') ||
          anchor.classList.contains('oai-std-mainpage-btn')
        ) {
          e.preventDefault();
          e.stopPropagation();
          openExitConfirmationModal(resolveMainPageHref(), 'main-page');
        }
      },
      true
    );

    // Keep touch responsiveness crisp without swallowing rapid button clicks or touch scrolling
    document.addEventListener(
      'gesturestart',
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    let lastTouchEnd = 0;
    document.addEventListener(
      'touchend',
      (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 280 && e.target && !e.target.closest('input, select, textarea, button, a')) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      },
      { passive: false }
    );

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach((ev) => {
      document.addEventListener(ev, syncFullscreenButtons);
    });
    const handleViewportOrRotationChange = () => {
      dispatchFullscreenResizeBurst();
    };
    window.addEventListener('orientationchange', handleViewportOrRotationChange);
    if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
      window.visualViewport.addEventListener('resize', dispatchFullscreenResizeBurst);
    }

    // Allow Esc to close exit modal or exit fallback pseudo-fullscreen cleanly
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('openai-portal-exit-modal');
        if (modal && modal.classList.contains('open')) {
          modal.classList.remove('open');
          return;
        }
        if (isIosPseudoFullscreen && !isNativeFullscreen()) {
          toggleFullscreen(false);
        }
      }
    });

    // If launched with ?fullscreen=1 from the portal, enter fullscreen immediately and on first user tap
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('fullscreen') === '1') {
        isIosPseudoFullscreen = true;
        applyFullscreenClasses(true);
        syncFullscreenButtons();
        dispatchFullscreenResizeBurst();
        const enterOnFirstTap = () => {
          toggleFullscreen(true);
          window.removeEventListener('pointerdown', enterOnFirstTap);
          window.removeEventListener('keydown', enterOnFirstTap);
        };
        window.addEventListener('pointerdown', enterOnFirstTap, { once: true });
        window.addEventListener('keydown', enterOnFirstTap, { once: true });
      }
    } catch (_) {}
  }

  // =========================================================================
  // IN-GAME STANDARD CONTROL BAR & AUTO-BRIDGE (ALL 7 BUILT-IN & FUTURE GAMES)
  // =========================================================================
  function initInGameBridge() {
    const detectedId = detectCurrentGameArea();
    if (!detectedId || detectedId === 'portal-hub') return;

    const path = window.location.pathname || '';
    const isLeap = detectedId === 'learn-and-leap' || path.includes('learn-and-leap');
    const isTitan = detectedId === 'titan-academy' || path.includes('titan-academy');
    const isVoxel = detectedId === 'voxel-craft-my' || path.includes('voxel-craft-my');
    const isFlora = detectedId === 'flora-scholars' || path.includes('flora-scholars');
    const isSlug = detectedId === 'slug-math' || path.includes('slug-math');
    const isScience = detectedId === 'science-quest-my' || path.includes('science-quest-my');
    const isTank = detectedId === 'tankmath-armageddon' || path.includes('tankmath-armageddon');

    const store = loadPortalStore();
    const matchedGame = getAllGames(store).find(g => g.id === detectedId);
    const customStorageKey = (typeof window !== 'undefined' && window.OPENAI_PORTAL_STORAGE_KEY)
      || (matchedGame && matchedGame.storageKey)
      || `${detectedId}-v1`;

    const activeAcc = store.accounts[store.activeAccountId];
    if (activeAcc) {
      [LEAP_STORAGE_KEY, TITAN_STORAGE_KEY, VOXEL_STORAGE_KEY, FLORA_STORAGE_KEY, SLUG_STORAGE_KEY, SCIENCE_STORAGE_KEY, customStorageKey].forEach((k) => {
        const cur = localStorage.getItem(k);
        if (cur && !activeAcc.gameSnapshots[k]) {
          activeAcc.gameSnapshots[k] = cur;
        }
      });
      applyAccountToLiveStorage(activeAcc, store);
    }

    let lastStats = getActiveUserStats();
    const gameLabel = isLeap
      ? 'Learn & Leap 3D'
      : isTitan
        ? 'Titan Academy'
        : isVoxel
          ? 'Voxel Craft MY'
          : isFlora
            ? 'Flora Scholars TD'
            : isSlug
              ? 'Slug Math Command'
              : isScience
                ? 'Science Quest MY'
                : isTank
                  ? 'TankMath Artillery'
                  : (matchedGame && matchedGame.title) || detectedId;

    const rawSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      rawSetItem.call(this, key, value);
      if (
        key === LEAP_STORAGE_KEY ||
        key === TITAN_STORAGE_KEY ||
        key === VOXEL_STORAGE_KEY ||
        key === FLORA_STORAGE_KEY ||
        key === SLUG_STORAGE_KEY ||
        key === SCIENCE_STORAGE_KEY ||
        key === TANKMATH_STORAGE_KEY ||
        key === customStorageKey
      ) {
        try {
          const updated = getActiveUserStats();
          const xpDiff = updated.totalXp - lastStats.totalXp;
          const starsDiff = updated.totalStars - lastStats.totalStars;
          lastStats = updated;
          updateInGameHud(updated);
          if (xpDiff > 0) {
            sendCloudTelemetryHeartbeat({
              title: `${updated.name} earned +${xpDiff} XP in ${gameLabel}`,
              xpDelta: xpDiff
            });
            showInGameXpToast(
              `+${xpDiff} Academic XP! (${updated.name} · Lvl ${updated.level})`,
              starsDiff > 0 ? `★ +${starsDiff} Stars Earned` : 'Progress synced to O.A.I. Malaysia'
            );
          }
        } catch (_) {}
      }
    };

    const onReady = () => {
      if (document.body && typeof document.body.setAttribute === 'function') {
        document.body.setAttribute('data-portal-game', detectedId);
        document.body.classList.add('oai-has-std-bar');
      }
      mountInGameHud(detectedId, gameLabel);
      installTouchAndExitGuards();

      // Run initial harmonizer + keep synced as React/JS games transition between Title, Play, Pause & Victory
      harmonizeLegacyGameButtons(detectedId);
      setTimeout(() => harmonizeLegacyGameButtons(detectedId), 350);
      setTimeout(() => harmonizeLegacyGameButtons(detectedId), 1200);

      let harmonizeTimer = null;
      const observer = new MutationObserver(() => {
        if (harmonizeTimer) return;
        harmonizeTimer = setTimeout(() => {
          harmonizeTimer = null;
          harmonizeLegacyGameButtons(detectedId);
        }, 140);
      });
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['hidden', 'class', 'data-state']
        });
      }

      if (isLeap) {
        let attempts = 0;
        const hookTimer = setInterval(() => {
          attempts++;
          const dbg = window.__LEAP_DEBUG__;
          if (dbg && typeof dbg.answer === 'function' && !dbg.__portalHooked) {
            const origAnswer = dbg.answer;
            dbg.answer = function (choice, btn) {
              const q = dbg.state && dbg.state.question;
              const wasCorrect = q && choice === q.correct;
              const res = origAnswer.apply(this, arguments);
              if (wasCorrect) {
                const updated = reportGameEvent({
                  gameId: 'learn-and-leap',
                  shrinesDelta: 1,
                  title: `${lastStats.name} awakened a 3D Rune Shrine (+25 XP)`
                });
                if (updated) {
                  lastStats = updated;
                  updateInGameHud(updated);
                  showInGameXpToast('✦ Rune Shrine Awakened! +25 XP', `Synced to ${updated.name}'s Profile`);
                }
              }
              return res;
            };
            dbg.__portalHooked = true;
            clearInterval(hookTimer);
          } else if (attempts > 30) {
            clearInterval(hookTimer);
          }
        }, 250);
      }

      if (isTitan) {
        const qArea = document.getElementById('questionArea');
        if (qArea) {
          qArea.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            setTimeout(() => {
              if (btn.classList.contains('correct')) {
                const updated = reportGameEvent({
                  gameId: 'titan-academy',
                  questionsDelta: 1,
                  title: `${lastStats.name} solved a Titan Academy question (+15 XP)`
                });
                if (updated) {
                  lastStats = updated;
                  updateInGameHud(updated);
                  showInGameXpToast('⚡ Weapon Charged! +15 Academic XP', `Synced to ${updated.name}'s Profile`);
                }
              }
            }, 60);
          });
        }
      }
    };

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  }

  function mountInGameHud(detectedId, gameLabel) {
    const oldBtn = document.getElementById('hubBackBtn');
    if (oldBtn) oldBtn.style.display = 'none';

    if (document.getElementById('oai-std-game-bar')) return;

    const usesRootViewportFrame =
      detectedId === 'slug-math' ||
      detectedId === 'tankmath-armageddon' ||
      detectedId === 'flora-scholars' ||
      detectedId === 'voxel-craft-my';

    const style = document.createElement('style');
    style.id = 'oai-std-game-controls-css';
    style.textContent = `
      :root {
        --oai-bar-h: 48px;
      }
      @media (max-width: 640px) {
        :root {
          --oai-bar-h: 44px;
        }
      }
      @media (max-height: 520px) and (orientation: landscape) {
        :root {
          --oai-bar-h: 36px;
        }
      }
      html, body {
        overscroll-behavior-y: contain;
        -webkit-touch-callout: none !important;
        -webkit-user-select: none;
        user-select: none;
        touch-action: manipulation;
      }
      input, textarea, select {
        -webkit-user-select: auto;
        user-select: auto;
      }

      /* =====================================================================
         UNIFIED VIEWPORT OFFSET BELOW STANDARD TOP BAR (NON-FULLSCREEN)
         Prevents ANY game HUD or fixed overlay from colliding with the bar
         ===================================================================== */
      body.oai-has-std-bar:not(.openai-fullscreen-mode)[data-portal-game="titan-academy"] {
        padding-top: var(--oai-bar-h) !important;
      }
      body.oai-has-std-bar:not(.openai-fullscreen-mode)[data-portal-game="science-quest-my"] .app-shell {
        padding-top: calc(var(--oai-bar-h) + 10px) !important;
      }
      body.oai-has-std-bar:not(.openai-fullscreen-mode)[data-portal-game="learn-and-leap"] .game-shell {
        padding-top: calc(var(--oai-bar-h) + 6px) !important;
        box-sizing: border-box !important;
      }
      ${usesRootViewportFrame ? `
      /* React full-viewport SPAs: contain fixed HUD descendants cleanly below the 48px top bar */
      body.oai-has-std-bar:not(.openai-fullscreen-mode) #root {
        position: fixed !important;
        top: var(--oai-bar-h) !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: calc(100dvh - var(--oai-bar-h)) !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        transform: translateZ(0) !important;
      }
      ` : ''}

      /* Fullscreen locks distraction-free edge-to-edge 100vw x 100dvh */
      body.openai-ios-fullscreen {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        overflow: hidden !important;
      }

      /* =====================================================================
         UNIVERSAL FULLSCREEN FIT & DISTRACTION-FREE RULES FOR ALL GAMES
         ===================================================================== */
      html.openai-fullscreen-mode .outside-note,
      body.openai-fullscreen-mode .outside-note,
      :fullscreen .outside-note,
      :-webkit-full-screen .outside-note {
        display: none !important;
      }
      html.openai-fullscreen-mode .game-shell,
      body.openai-fullscreen-mode .game-shell,
      :fullscreen .game-shell,
      :-webkit-full-screen .game-shell {
        padding: 0 !important;
        margin: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        max-width: 100vw !important;
        max-height: 100dvh !important;
        overflow: hidden !important;
        display: block !important;
      }
      html.openai-fullscreen-mode .game-frame,
      body.openai-fullscreen-mode .game-frame,
      :fullscreen .game-frame,
      :-webkit-full-screen .game-frame {
        width: 100vw !important;
        height: 100dvh !important;
        max-width: 100vw !important;
        max-height: 100dvh !important;
        aspect-ratio: auto !important;
        border-radius: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
      html.openai-fullscreen-mode #world,
      body.openai-fullscreen-mode #world,
      :fullscreen #world,
      :-webkit-full-screen #world {
        width: 100vw !important;
        height: 100dvh !important;
        display: block !important;
      }

      /* TITAN ACADEMY Fullscreen Fit */
      html.openai-fullscreen-mode body[data-portal-game="titan-academy"],
      body.openai-fullscreen-mode[data-portal-game="titan-academy"] {
        padding-top: 0 !important;
        overflow: hidden !important;
        height: 100dvh !important;
        width: 100vw !important;
      }
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] > .app > header,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] > .app > footer,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .journey,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .mission-heading,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .how-card,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .boss-note,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .equipment > .eyebrow,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .equipment > h2,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .ammo-card p,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .loadout-head p {
        display: none !important;
      }
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] > .app {
        max-width: 100vw !important;
        width: 100vw !important;
        height: 100dvh !important;
        margin: 0 !important;
        padding: 44px 12px 8px !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] > .app > main {
        flex: 1 1 auto !important;
        min-height: 0 !important;
        height: 100% !important;
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) 260px !important;
        gap: 12px !important;
        align-items: stretch !important;
      }
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .play-column,
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .stage {
        height: 100% !important;
        min-height: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        padding: 10px !important;
      }
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .arena {
        flex: 1 1 auto !important;
        height: auto !important;
        min-height: 220px !important;
        width: 100% !important;
      }
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .learning-dock {
        margin-top: 0 !important;
        min-height: 0 !important;
        padding: 12px 16px !important;
        flex-shrink: 0 !important;
      }
      html.openai-fullscreen-mode [data-portal-game="titan-academy"] .equipment {
        height: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 10px !important;
        padding: 14px !important;
        overflow-y: auto !important;
      }
      @media (max-width: 900px) {
        html.openai-fullscreen-mode [data-portal-game="titan-academy"] > .app > main {
          grid-template-columns: 1fr !important;
          overflow-y: auto !important;
        }
      }

      @media (orientation: portrait) {
        html.openai-fullscreen-mode #world,
        body.openai-fullscreen-mode #world,
        :fullscreen #world,
        :-webkit-full-screen #world {
          width: 100vw !important;
          height: auto !important;
          max-height: calc(100dvh - 110px) !important;
          aspect-ratio: 16 / 9 !important;
          margin: auto 0 !important;
        }
      }

      /* FLORA SCHOLARS TD Fullscreen & Compact Rotation Fit */
      @media (max-width: 1024px), (max-height: 560px) {
        [data-testid="botanical-advisor-banner"] {
          display: none !important;
        }
        [data-testid="wave-warning-indicator"] {
          opacity: 0.72 !important;
          transform: scale(0.75) !important;
          transform-origin: right center !important;
        }
      }
      html.openai-fullscreen-mode [data-testid="botanical-advisor-banner"],
      body.openai-fullscreen-mode [data-testid="botanical-advisor-banner"] {
        display: none !important;
      }

      /* SCIENCE QUEST MY 3D Fullscreen Fit */
      html.openai-fullscreen-mode .app-shell,
      body.openai-fullscreen-mode .app-shell {
        max-width: 100vw !important;
        width: 100vw !important;
        height: 100dvh !important;
        padding: 42px 10px 6px !important;
        gap: 6px !important;
        overflow: hidden !important;
      }
      html.openai-fullscreen-mode .arena-wrap,
      body.openai-fullscreen-mode .arena-wrap {
        flex: 1 1 auto !important;
        max-height: none !important;
        min-height: 0 !important;
        aspect-ratio: auto !important;
      }

      /* ALL CANVAS / ROOT CONTAINERS: Fit 100vw x 100dvh in Fullscreen */
      html.openai-fullscreen-mode,
      body.openai-fullscreen-mode {
        width: 100vw !important;
        height: 100dvh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      html.openai-fullscreen-mode #root,
      body.openai-fullscreen-mode #root {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        transform: none !important;
      }

      /* =====================================================================
         UNIFIED O.A.I. STANDARD TOP GAME CONTROL BAR (#oai-std-game-bar)
         Consistent Main Page | Start Game | Full Screen | Exit across ALL 7 games
         ===================================================================== */
      #oai-std-game-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--oai-bar-h);
        z-index: 99990;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 12px;
        background: #0F0B24;
        border-bottom: 1px solid rgba(129, 140, 248, 0.28);
        box-shadow: 0 4px 16px rgba(4, 3, 14, 0.55);
        font-family: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #F8FAFC;
        box-sizing: border-box;
      }

      /* In Full Screen: slim translucent floating top-right dock so canvas stays edge-to-edge */
      html.openai-fullscreen-mode #oai-std-game-bar,
      body.openai-fullscreen-mode #oai-std-game-bar,
      :fullscreen #oai-std-game-bar,
      :-webkit-full-screen #oai-std-game-bar {
        left: auto;
        right: 10px;
        top: 8px;
        height: 36px;
        width: auto;
        max-width: calc(100vw - 20px);
        padding: 0 8px;
        border-radius: 10px;
        background: rgba(15, 11, 36, 0.88);
        border: 1px solid rgba(129, 140, 248, 0.42);
        opacity: 0.78;
        transition: opacity 0.16s ease;
      }
      html.openai-fullscreen-mode #oai-std-game-bar:hover,
      body.openai-fullscreen-mode #oai-std-game-bar:hover,
      :fullscreen #oai-std-game-bar:hover,
      :-webkit-full-screen #oai-std-game-bar:hover {
        opacity: 1;
      }
      html.openai-fullscreen-mode #oai-std-game-bar .oai-bar-meta,
      body.openai-fullscreen-mode #oai-std-game-bar .oai-bar-meta,
      :fullscreen #oai-std-game-bar .oai-bar-meta {
        display: none !important;
      }

      #oai-std-game-bar .oai-bar-left,
      #oai-std-game-bar .oai-bar-right {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      #oai-std-game-bar .oai-bar-meta {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-size: 12px;
        color: #C7D2FE;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 6px;
        border-left: 1px solid rgba(129, 140, 248, 0.25);
        font-variant-numeric: tabular-nums;
      }
      #oai-std-game-bar .oai-bar-meta strong {
        color: #FFFFFF;
        font-weight: 700;
      }
      #oai-std-game-bar .oai-bar-xp {
        color: #FBBF24;
        font-family: "JetBrains Mono", ui-monospace, monospace;
        font-size: 11.5px;
        font-weight: 700;
      }

      /* Standardized Button Base */
      #oai-std-game-bar .oai-std-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 32px;
        padding: 0 11px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 0.01em;
        white-space: nowrap;
        flex-shrink: 0;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
        transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.12s ease;
        box-sizing: border-box;
      }
      #oai-std-game-bar .oai-std-btn:focus-visible {
        outline: 2px solid #FBBF24;
        outline-offset: 2px;
      }
      #oai-std-game-bar .oai-std-btn:active {
        transform: translateY(1px);
      }
      #oai-std-game-bar .oai-btn-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      /* 1. Main Page Button (Always Top-Left) */
      #oai-std-game-bar .oai-std-mainpage-btn {
        background: #1B153B;
        border-color: rgba(129, 140, 248, 0.38);
        color: #E0E7FF;
      }
      #oai-std-game-bar .oai-std-mainpage-btn:hover {
        background: #271E54;
        border-color: #818CF8;
        color: #FFFFFF;
      }

      /* 2. Start Game Button (Primary High-Contrast Amber CTA) */
      #oai-std-game-bar .oai-std-start-btn {
        background: #FBBF24;
        border-color: #FDE68A;
        color: #0F172A;
        font-weight: 800;
      }
      #oai-std-game-bar .oai-std-start-btn:hover {
        background: #FCD34D;
        color: #020617;
      }
      #oai-std-game-bar .oai-std-start-btn.is-playing {
        background: #1E1842;
        border-color: rgba(251, 191, 36, 0.48);
        color: #FDE68A;
        font-weight: 700;
      }
      #oai-std-game-bar .oai-std-start-btn.is-playing:hover {
        background: rgba(251, 191, 36, 0.2);
        border-color: #FBBF24;
        color: #FFFFFF;
      }

      /* 3. Full Screen Toggle Button */
      #oai-std-game-bar .oai-std-fs-btn {
        background: #1B153B;
        border-color: rgba(56, 189, 248, 0.45);
        color: #BAE6FD;
      }
      #oai-std-game-bar .oai-std-fs-btn:hover {
        background: #0C4A6E;
        border-color: #38BDF8;
        color: #FFFFFF;
      }
      #oai-std-game-bar .oai-std-fs-btn.is-fullscreen {
        background: rgba(16, 185, 129, 0.22);
        border-color: #34D399;
        color: #A7F3D0;
      }

      /* 4. Exit Button (Always Far Top-Right) */
      #oai-std-game-bar .oai-std-exit-btn {
        background: rgba(136, 19, 55, 0.36);
        border-color: rgba(251, 113, 133, 0.45);
        color: #FECDD3;
      }
      #oai-std-game-bar .oai-std-exit-btn:hover {
        background: #BE123C;
        border-color: #FB7185;
        color: #FFFFFF;
      }

      /* Unified visual cue on each game's primary in-page Start CTA */
      [data-oai-start-target="true"] {
        box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.72), 0 8px 22px rgba(245, 158, 11, 0.35) !important;
      }

      /* Hide deduplicated legacy buttons */
      [data-oai-deduped] {
        display: none !important;
      }

      @media (max-width: 780px) {
        #oai-std-game-bar .oai-bar-meta {
          display: none;
        }
      }
      @media (max-width: 640px) {
        #oai-std-game-bar {
          padding: 0 8px;
          gap: 6px;
        }
        #oai-std-game-bar .oai-bar-left,
        #oai-std-game-bar .oai-bar-right {
          gap: 5px;
        }
        #oai-std-game-bar .oai-std-btn {
          height: 30px;
          padding: 0 8px;
          font-size: 11px;
          gap: 4px;
        }
      }

      @media (max-height: 520px) and (orientation: landscape) {
        #oai-std-game-bar {
          padding: 0 6px;
          gap: 5px;
        }
        #oai-std-game-bar .oai-bar-meta {
          display: none !important;
        }
        #oai-std-game-bar .oai-std-btn {
          height: 26px;
          padding: 0 7px;
          font-size: 11px;
          gap: 4px;
        }
      }

      /* =====================================================================
         STANDARDIZED 2-STEP EXIT & RETURN TO MAIN PAGE MODAL
         ===================================================================== */
      #openai-portal-exit-modal {
        position: fixed;
        inset: 0;
        z-index: 200000;
        background: rgba(7, 5, 20, 0.86);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        overflow-y: auto;
        font-family: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #openai-portal-exit-modal.open {
        display: flex;
      }
      .openai-exit-card {
        width: 100%;
        max-width: 420px;
        max-height: calc(100dvh - 24px);
        overflow-y: auto;
        background: #140F2D;
        border: 1.5px solid rgba(251, 191, 36, 0.65);
        border-radius: 18px;
        padding: 22px 20px;
        text-align: center;
        color: #F8FAFC;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.78);
      }
      .openai-exit-badge {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: #FBBF24;
        margin-bottom: 8px;
      }
      .openai-exit-card h2 {
        font-size: 19px;
        font-weight: 800;
        color: #FFFFFF;
        margin: 0 0 8px;
        line-height: 1.28;
      }
      .openai-exit-card p {
        font-size: 13px;
        color: #CBD5E1;
        line-height: 1.5;
        margin: 0 0 18px;
      }
      .openai-exit-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .openai-exit-actions button,
      .openai-exit-actions a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
        border-radius: 11px;
        font-family: inherit;
        cursor: pointer;
        text-decoration: none;
        transition: filter 0.15s ease, background-color 0.15s ease;
      }
      .openai-exit-btn-stay {
        padding: 12px 16px;
        border: 1px solid #6EE7B7;
        background: #10B981;
        color: #022C22;
        font-size: 14px;
        font-weight: 800;
      }
      .openai-exit-btn-stay:hover { filter: brightness(1.06); }
      .openai-exit-btn-menu {
        padding: 11px 16px;
        border: 1px solid rgba(251, 191, 36, 0.48);
        background: rgba(251, 191, 36, 0.14);
        color: #FDE68A;
        font-size: 13px;
        font-weight: 700;
      }
      .openai-exit-btn-fs {
        padding: 11px 16px;
        border: 1px solid rgba(56, 189, 248, 0.5);
        background: rgba(14, 165, 233, 0.16);
        color: #BAE6FD;
        font-size: 13px;
        font-weight: 700;
      }
      .openai-exit-btn-leave {
        padding: 11px 16px;
        border: 1px solid rgba(251, 113, 133, 0.55);
        background: rgba(136, 19, 55, 0.4);
        color: #FECDD3;
        font-size: 13px;
        font-weight: 700;
      }
      .openai-exit-btn-leave:hover {
        background: #BE123C;
        color: #FFFFFF;
      }

      /* XP Sync Toast (Always positioned cleanly below the 48px Standard Bar) */
      #openai-portal-xp-toast {
        position: fixed;
        top: calc(var(--oai-bar-h) + 10px);
        right: 16px;
        z-index: 100000;
        background: #140F2D;
        border: 1px solid rgba(251, 191, 36, 0.65);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        color: #FFFFFF;
        padding: 10px 14px;
        border-radius: 12px;
        font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-10px) scale(0.97);
        transition: opacity 0.22s ease, transform 0.22s ease;
      }
      #openai-portal-xp-toast.show {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    `;
    document.head.appendChild(style);

    const stats = getActiveUserStats();
    const labels = getActiveControlLabels();
    const hubHref = resolveMainPageHref();

    const bar = document.createElement('nav');
    bar.id = 'oai-std-game-bar';
    bar.setAttribute('aria-label', 'O.A.I. Malaysia Standard Game Controls');
    bar.setAttribute('data-testid', 'oai-std-game-bar');
    bar.innerHTML = `
      <div class="oai-bar-left">
        <a id="oai-btn-mainpage" href="${hubHref}" data-oai-action="main-page" class="oai-std-btn oai-std-mainpage-btn" title="Return to O.A.I. Malaysia Main Page">
          <span class="oai-btn-icon">${SVG_ICONS.home}</span>
          <span class="oai-btn-label">${labels.mainPage}</span>
        </a>
        <div class="oai-bar-meta" aria-label="Active Game and Scholar Stats">
          <strong>${gameLabel || detectedId}</strong>
          <span aria-hidden="true">·</span>
          <span id="portal-hud-name">${stats.name}</span>
          <span aria-hidden="true">·</span>
          <span class="oai-bar-xp" id="portal-hud-xp">Lvl ${stats.level} · ${stats.totalXp.toLocaleString()} XP</span>
        </div>
      </div>
      <div class="oai-bar-right">
        <button type="button" id="oai-btn-start" data-oai-action="start-game" class="oai-std-btn oai-std-start-btn" title="${labels.startGame}">
          <span class="oai-btn-icon">${SVG_ICONS.play}</span>
          <span class="oai-btn-label">${labels.startGame}</span>
        </button>
        <button type="button" id="oai-btn-fullscreen" data-oai-action="fullscreen" data-portal-fullscreen-btn="true" aria-pressed="false" class="oai-std-btn oai-std-fs-btn" title="${labels.fullScreen}">
          <span class="oai-btn-icon">${SVG_ICONS.maximize}</span>
          <span class="oai-btn-label">${labels.fullScreen}</span>
        </button>
        <button type="button" id="oai-btn-exit" data-oai-action="exit-game" class="oai-std-btn oai-std-exit-btn" title="${labels.exit}">
          <span class="oai-btn-icon">${SVG_ICONS.exit}</span>
          <span class="oai-btn-label">${labels.exit}</span>
        </button>
      </div>
    `;
    document.body.appendChild(bar);

    const startBtn = document.getElementById('oai-btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startBtn.blur();
        triggerStandardStartAction(detectedId);
      });
    }

    const fsBtn = document.getElementById('oai-btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fsBtn.blur();
        toggleFullscreen();
      });
    }

    const exitBtn = document.getElementById('oai-btn-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        exitBtn.blur();
        openExitConfirmationModal(hubHref, 'exit');
      });
    }

    const toast = document.createElement('div');
    toast.id = 'openai-portal-xp-toast';
    document.body.appendChild(toast);

    syncFullscreenButtons();
    syncStandardStartButton(detectedId);
  }

  function updateInGameHud(stats) {
    const nameEl = document.getElementById('portal-hud-name');
    const xpEl = document.getElementById('portal-hud-xp');
    if (nameEl) nameEl.textContent = stats.name;
    if (xpEl) xpEl.textContent = `Lvl ${stats.level} · ${stats.totalXp.toLocaleString()} XP`;
  }

  let toastTimer = null;
  function showInGameXpToast(title, subtitle) {
    const toast = document.getElementById('openai-portal-xp-toast');
    if (!toast) return;
    toast.innerHTML = `
      <div style="font-weight:800;font-size:13px;color:#FBBF24;margin-bottom:2px;">${title}</div>
      <div style="font-size:11px;color:#CBD5E1;">${subtitle || ''}</div>
    `;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }


  initInGameBridge();
  startRealtimePresenceTicker();

  window.addEventListener('storage', (e) => {
    if (
      e.key === LEAP_STORAGE_KEY ||
      e.key === TITAN_STORAGE_KEY ||
      e.key === VOXEL_STORAGE_KEY ||
      e.key === FLORA_STORAGE_KEY ||
      e.key === SLUG_STORAGE_KEY ||
      e.key === SCIENCE_STORAGE_KEY ||
      e.key === TANKMATH_STORAGE_KEY ||
      e.key === PORTAL_STORAGE_KEY ||
      e.key === PRESENCE_STORAGE_KEY
    ) {
      notifyListeners('storage-sync');
    }
  });

  function awardBonusXp(xp, reason) {
    const amount = Math.max(0, Number(xp) || 0);
    if (!amount) return getActiveUserStats();
    return reportGameEvent({
      gameId: 'portal-hub',
      bonusXpDelta: amount,
      xpDelta: 0,
      title: reason || `Earned +${amount} Bonus Scholar XP`
    });
  }

  window.OpenAIPortal = {
    version: '3.1.0',
    __isCoreSdk: true,
    BRAND_ARIA_LABEL,
    AVATARS,
    AGE_BANDS,
    LANGUAGES,
    MALAYSIAN_STATES,
    DAILY_QUESTS,
    getBrandLogoSvg,
    getBrandLockupHtml,
    getAllGames: () => getAllGames(loadPortalStore()),
    loadManifestGames,
    getActiveUserStats,
    getAllAccountsList,
    getLeaderboard,
    getOnlineStats,
    createScholarAccount,
    switchAccount,
    playAsGuest,
    updateActiveProfile,
    claimQuestReward,
    awardBonusXp,
    reportGameEvent,
    registerFutureGame,
    removeCustomGame,
    askGemini,
    checkGeminiStatus,
    toggleFullscreen,
    isFullscreenActive,
    openExitConfirmationModal,
    resolveMainPageHref,
    triggerStandardStartAction,
    subscribe,
    admin: {
      isAuthenticated: isAdminAuthenticated,
      login: adminLogin,
      logout: adminLogout,
      getDashboardData: getAdminDashboardData,
      updateSettings: updateAdminSettings,
      awardBonusXp: adminAwardBonusXp,
      deleteAccount: adminDeleteAccount,
      exportScholarsCsv,
      exportDetailedLevelsCsv,
      exportFullBackupJson,
      importBackupJson
    }
  };
  window.__OAI_CORE_PORTAL__ = window.OpenAIPortal;
  window.__OAI_CORE_PORTAL__.syncExternalScore = function (reason) {
    try {
      const store = syncLiveStorageToActiveAccount();
      const acc = store.accounts[store.activeAccountId];
      const stats = calculateAccountStats(acc, store);
      notifyListeners(reason || 'score-updated', { stats });
      return stats;
    } catch (_) {
      return null;
    }
  };
})(window);
