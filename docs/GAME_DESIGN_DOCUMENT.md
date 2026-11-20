# Learn & Leap Adventure v2 --- Official Design & Production Blueprint

**Document type:** Game Design Document (GDD) + Art Direction Bible +
Implementation Roadmap `\n*`{=tex}\*Status:\*\* Proposed production
specification; NOT a claim of a completed or deployed v2 game
`\n*`{=tex}\*Edition:\*\* 2026-10-18 `\n*`{=tex}\*Project:\*\* Learn &
Leap Adventure / Worlds of Wonder

## 1. Executive vision

Rebuild Learn & Leap as an **original, cinematic 2.5D side-scrolling
fantasy platformer** with responsive controls, polished hero/enemy
animation, layered environments, dramatic boss encounters, and
educational shrines that belong naturally to the world. This is a
**AAA-inspired art and presentation target**, not a promise of
console-scale AAA budgets or real-time 3D graphics. The game must be
playable by children and older learners on desktop, tablets, iPhones,
and Android devices.

### Non-negotiable product principles

-   **Not Titan Academy:** no navy dashboard layout, side-panel
    analytics, heavy boxed widgets, fixed crosshairs, or quiz-first
    battle screens.
-   **Gameplay first:** jumping, exploring, secrets, enemies,
    collectibles, checkpoints, physics, abilities, and bosses must
    remain fun even between learning interactions.
-   **Learning feels magical:** answer at a rune shrine, repair a
    bridge, power a machine, decode a map, or solve a guardian's
    clue---not an unrelated school form.
-   **100 meaningfully distinct levels:** no claim of "100 levels" if
    the result is the same short procedural track recolored 100 times.
-   **Inclusive:** 5 age groups; 4 subjects; English, Simplified
    Chinese, Bahasa Melayu; touch, keyboard and controller-friendly
    input; no forced account creation.
-   **Original IP:** no copied Mario/Nintendo character design,
    costumes, music, artwork, level geometry, names, sounds or branded
    UI.
-   **Public web delivery:** serve as an HTTPS website, not an iPhone
    attachment preview; no ChatGPT sign-in required for gameplay.

## 2. Game identity

**Working title:** Learn & Leap Adventure --- Worlds of Wonder.
`\n*`{=tex}\*Tagline:\*\* Every leap unlocks a discovery.
`\n*`{=tex}\*Genre:\*\* Single-player cinematic 2.5D educational
platform adventure. `\n*`{=tex}\*Core audience:\*\* Ages 5+ with
separate educational and motor-skill difficulty settings.
`\n*`{=tex}\*Camera:\*\* Smooth horizontal follow with look-ahead,
controlled zoom, and no sudden movement. `\n*`{=tex}\*Art direction:\*\*
High-quality illustrated/3D-rendered-to-2D assets, painterly depth,
atmospheric lighting, detailed terrain and clear silhouettes.

### Original hero and companion

**Ari, the Starbound Explorer:** an original gender-neutral explorer
with a distinctive short turquoise cape, amber explorer scarf, sturdy
boots, luminous wrist compass and a small star-shaped satchel. The face
is expressive and readable on mobile; there is no red plumber cap or
Nintendo-like silhouette. Ari earns new movement abilities by restoring
lost world constellations.

**Pip:** a tiny floating lantern-sprite companion that delivers
contextual hints, celebrates achievements and indicates hidden shrines.
Pip never obstructs controls or forces dialogue during jumps.

**Animation target:** idle, run, run-start/stop, jump, fall, land, dash,
glide, swim, wall interaction, attack, hurt, victory, defeat, climb,
interact and emotes. Prioritize responsiveness over overlong animations.
Every action must have visible anticipation, impact and recovery where
appropriate.

## 3. World art bible and boss identity

  -----------------------------------------------------------------------------
  World                    Levels Visual identity   Guardian      Earned
                                                                  ability
  ------------- ----------------- ----------------- ------------- -------------
  01\.                      1--10 Sunlit storybook  The           Leaf Glide
  Whispering                      woodland,         Rootkeeper    
  Woods                           moss-covered                    
                                  ruins, giant                    
                                  mushrooms,                      
                                  volumetric                      
                                  sunbeams and                    
                                  drifting                        
                                  fireflies                       

  02\. Crystal             11--20 Translucent       Prism Golem   Prism Dash
  Caverns                         crystal caves,                  
                                  refraction,                     
                                  bioluminescent                  
                                  pools and                       
                                  shimmering                      
                                  gemstone bridges                

  03\. Skybound            21--30 Floating meadows, Storm Roc     Wind Jump
  Isles                           cloud seas,                     
                                  cascading                       
                                  waterfalls and                  
                                  distant sky                     
                                  temples with airy               
                                  parallax                        

  04\. Ember               31--40 Glowing lava      Magma         Heat Shield
  Volcano                         rivers, obsidian  Colossus      
                                  cliffs, heat                    
                                  distortion, smoke               
                                  plumes and molten               
                                  forges                          

  05\. Frozen              41--50 Glittering        Frost Warden  Ice Grip
  Peaks                           snowfields,                     
                                  auroras, ice                    
                                  arches and                      
                                  mountain villages               
                                  under soft winter               
                                  light                           

  06\. Sunken              51--60 Coral palaces,    Abyss         Bubble Swim
  Reef                            sun shafts        Leviathan     
                                  underwater,                     
                                  schools of fish                 
                                  and drifting sea                
                                  grass                           

  07\.                     61--70 Copper gears,     Gear Titan    Magnet Pull
  Clockwork                       kinetic bridges,                
  City                            luminous clock                  
                                  faces and brass                 
                                  factories with                  
                                  layered moving                  
                                  machinery                       

  08\.                     71--80 Silver moonlit    Shade Serpent Lantern Pulse
  Moonshadow                      wetlands, fog,                  
  Marsh                           glowing lilies,                 
                                  shadow lanterns                 
                                  and enchanted                   
                                  tree silhouettes                

  09\. Starfall            81--90 Meteor gardens,   Comet Gryphon Gravity Flip
  Summit                          luminous                        
                                  constellations,                 
                                  celestial bridges               
                                  and a shifting                  
                                  gravity skyline                 

  10\. Crown of           91--100 A monumental      Eclipse       Harmony Burst
  Worlds                          radiant castle    Sovereign     
                                  combining forest,               
                                  crystal, sky and                
                                  cosmic motifs                   
                                  with celebratory                
                                  golden light                    
  -----------------------------------------------------------------------------

### Palette and environment direction

-   **World 01: Whispering Woods** (低语森林 / Hutan Berbisik):
    `#79B96A / #E8C86B / #86D9C4`. Enemies: Moss Sprites, Thorn Beetles,
    Pollen Bats. Boss: Vine sweeps, falling seed pods, glowing root weak
    spots; solve two elemental runes to expose its heart. Science
    anchor: Plants, habitats, pollination.
-   **World 02: Crystal Caverns** (水晶洞窟 / Gua Kristal):
    `#8F78DA / #4DE1D4 / #E9B7FF`. Enemies: Shard Crawlers, Glow Moths,
    Cave Golemlings. Boss: Reflective beam lanes, rotating crystal armor
    and light puzzles; charge prism mirrors to break the shell. Science
    anchor: Light, reflection, minerals.
-   **World 03: Skybound Isles** (天空浮岛 / Pulau Langit):
    `#7EC8ED / #F7E5A5 / #9FDBC5`. Enemies: Cloud Puffs, Sky Wasps, Gale
    Wisps. Boss: Telegraphed dives, crosswinds and thunder nests; align
    wind runes to stun the bird. Science anchor: Weather, wind, flight.
-   **World 04: Ember Volcano** (熔火火山 / Gunung Berapi Bara):
    `#F58B4B / #FFCA75 / #6C3A54`. Enemies: Cinder Imps, Ash Bats, Lava
    Beetles. Boss: Lava waves, rock slams and cooling windows; activate
    water-and-heat valves to expose the core. Science anchor: States of
    matter, heat, volcanoes.
-   **World 05: Frozen Peaks** (冰雪山峰 / Puncak Beku):
    `#A7E5F2 / #DDEBFF / #8C9DDD`. Enemies: Snow Puffers, Icicle Hares,
    Frost Wolves. Boss: Ice spikes, freezing breath and mirror-image
    decoys; melt marked ice sigils to reveal the real guardian. Science
    anchor: Temperature, water cycle, adaptation.
-   **World 06: Sunken Reef** (沉没珊瑚礁 / Terumbu Tenggelam):
    `#35B5BE / #F2AF90 / #6A87D9`. Enemies: Bubble Jellies, Coral Crabs,
    Reef Rays. Boss: Currents, bubble traps and tail sweeps; align
    ocean-current valves to surface its weak point. Science anchor:
    Oceans, ecosystems, buoyancy.
-   **World 07: Clockwork City** (齿轮机械城 / Kota Jam Mekanikal):
    `#E9B96B / #7BB3C3 / #8D7C92`. Enemies: Bolt Bots, Gear Spiders,
    Steam Drones. Boss: Rotating gears, conveyor reversals and laser
    telegraphs; complete circuit sequences to overload armor. Science
    anchor: Machines, energy, circuits.
-   **World 08: Moonshadow Marsh** (月影沼泽 / Paya Bayang Bulan):
    `#8D81B7 / #8BC4A0 / #E8DCA3`. Enemies: Mist Wisps, Shadow Frogs,
    Lantern Moths. Boss: Shadow clones, light-safe zones and sweeping
    tails; use lantern beams and clue runes to reveal the real serpent.
    Science anchor: Nocturnal animals, light and shadow.
-   **World 09: Starfall Summit** (星落之巅 / Puncak Bintang Jatuh):
    `#907CE7 / #E5BDF4 / #F9DB87`. Enemies: Meteor Mites, Orbit Wisps,
    Star Knights. Boss: Gravity swaps, meteor trails and star-ring
    dives; complete constellation circuits to interrupt flight. Science
    anchor: Space, gravity, solar system.
-   **World 10: Crown of Worlds** (万界王冠 / Mahkota Alam):
    `#F6D28A / #A7DCC8 / #B6A5EA`. Enemies: Royal Sentinels, Prism
    Knights, Echo Shades. Boss: Three readable phases mixing previous
    worlds; four subject relics charge Harmony Burst for the finale.
    Science anchor: Integrated inquiry and synthesis.

**Lighting:** per-world time of day and atmosphere; sunbeams,
reflection, auroras, firelight, drifting motes and soft shadows, with a
performance-reduced fallback. **Depth:** at least five parallax layers
and a separate collision-ready foreground. **Legibility:** bright action
platforms against softer scenery, high-contrast hazards, accessible
warning shapes independent of color.

## 4. Gameplay and revised screen architecture

### Core loop

1.  Choose age group, language and subject preference (Balanced or
    Focus). Select a world and level.
2.  Run, jump, glide, climb or swim through a real platforming stage;
    collect coins, find secrets and activate checkpoints.
3.  Encounter four contextual learning opportunities per level (one per
    subject); **two required** to open the exit, **two optional** for
    bonus relics. The required pair rotates so every subject is equally
    represented across a world. The player can choose which optional
    subjects to pursue.
4.  Correct answers activate a world mechanism or charge a special
    ability. Incorrect answers give a meaningful hint and retry, without
    instant death or irreversible softlock.
5.  Clear a distinct platform challenge; every tenth level features a
    cinematic boss with readable attack telegraphs and subject runes.
6.  Earn up to three stars for completion, optional exploration and
    learning mastery; unlock the next level. Never gate the main story
    behind a perfect score.

### Gameplay screen wireframe --- desktop / landscape mobile

``` text
┌─────────────────────────────────────────────────────────────────────┐
│ ♥ ♥ ♥   ✦ 120 coins          WHISPERING WOODS · 01–04      ◇◇◆ Ⅱ  │
│                                                                     │
│  PARALLAX FOREST / DYNAMIC LIGHTING / LIVING PLATFORMS              │
│                                                                     │
│      🍃     ┌─────────┐         [MATH RUNE]       EXIT →            │
│   ARI →    └────┐    └──   ENEMY      BRIDGE     ▣                 │
│ ███████    gap  ████    ███████████    ███████    ██████             │
│                                                                     │
│ ◀ ▶  (touch-only, bottom left)             JUMP   ACTION (right)     │
└─────────────────────────────────────────────────────────────────────┘
```

The world occupies **85--95% of the visible area**. HUD elements float
above it and never create a dashboard grid. On desktop, controls fade
away; on touch screens, large semi-transparent controls remain in safe
areas. The question shrine opens a cinematic overlay with large type and
optional read-aloud, pausing enemies and hazards.

### Screen flow

`Splash → Title → Age / Language / Subject → Hero Intro → Illustrated World Map → Level Brief (3 sec) → Full-screen Gameplay → Shrine Overlay / Boss Intro → Results → Next Level / Map`.
Pause, settings, accessibility and help are reachable from every active
scene. First-time setup is skippable after saving preferences. World map
displays actual monster/guardian portraits and unlock state.

### Controls

-   **Desktop:** A/D or ←/→ to move, Space/W/↑ to jump, E or Enter to
    interact, Shift for earned ability, Esc/P to pause; gamepad mapping
    if supported.
-   **Mobile:** left-side directional pad or optional virtual joystick;
    right-side Jump and Action; ability button appears only when
    unlocked. Buttons ≥44 CSS px, spaced to avoid accidental overlap.
-   **Movement:** coyote time (\~100 ms), jump buffer (\~120 ms),
    variable jump height, smooth acceleration/deceleration, clear
    landing feedback, forgiving ledge collisions for younger players.
-   **Camera:** predictive follow, small look-ahead, optional camera
    shake, shake disabled under Reduced Motion; do not move camera
    during question answering.
-   **Fairness:** hazard/enemy movement pauses during question overlays
    and pause menus. Respawn at checkpoints with invulnerability frames.
    No unavoidable attacks while reading.

## 5. Educational system

  ----------------------------------------------------------------------------
  Age group      Mathematics    English          Science        General
                                                                Knowledge
  -------------- -------------- ---------------- -------------- --------------
  5--6           Counting,      Letters, sounds, Animals,       Directions,
                 shapes, 1--20  sight words      plants,        colors,
                 sums, ordering                  weather        familiar
                                                                places

  7--9           Operations,    Spelling,        Habitats,      Maps, culture,
                 times tables,  sentences,       forces,        everyday facts
                 simple         vocabulary       materials      
                 fractions                                      

  10--12         Fractions,     Grammar,         Ecosystems,    Geography,
                 percentages,   inference, word  energy, matter inventions,
                 ratio,         choice                          world facts
                 geometry                                       

  13--15         Algebra,       Comprehension,   Biology,       Geography,
                 coordinates,   editing, tone    physics,       history,
                 probability,                    chemistry      critical
                 graphs                                         thinking

  16+            Functions,     Inference,       Applied        Data literacy,
                 advanced       argument,        science and    world
                 algebra,       rhetoric         reasoning      knowledge,
                 statistics                                     logic
  ----------------------------------------------------------------------------

**Localization rule:** UI, explanations, instructions, hints and general
subjects translate into English/简体中文/Bahasa Melayu. In the
**English** subject, the actual language skill remains English (with
Chinese or Malay explanatory support when selected). Use fonts with
complete CJK and Malay character coverage, proper line breaking and
large mobile type.

**Question structure:** `id`, `subject`, `ageBand`, `topic`,
`difficulty`, `type`, `localizedPrompt`, `localizedHint`, `answer`,
`acceptedAnswers`, `explanation`, `assets`, `worldTags`, `validator`.
Supported interactions: multiple choice, visual count, tap-to-order,
drag-to-match with accessible tap alternative, short numeric entry, word
construction, reading comprehension and science prediction. Validate
answers using robust numeric normalization, fractions, Unicode and
reasonable alternate phrasing. No ambiguous answers.

**Question-bank target:** at least **500 validated template families**
across 5 ages × 4 subjects, with parameterized variants, 3-language
text/hints, no repeated questions in the same run and difficulty mapping
per world. Content QA must check math correctness, scientific accuracy,
readability, translation quality and age appropriateness. Avoid
unreliable trivia or culturally narrow assumptions.

**Same mechanism, different age challenge --- activating a forest
bridge:** - 5--6: Count 5 glowing seeds. - 7--9: 6 × 4 = ? - 10--12:
Find 25% of 80. - 13--15: Solve 3x + 7 = 28. - 16+: Evaluate a function
or solve a multi-step relation.

**Difficulty is two-dimensional:** educational difficulty follows the
selected age group and performance; motor-skill difficulty is separately
adjustable (Explorer / Adventurer / Challenge). A 5-year-old can use
Explorer controls without limiting a 16-year-old to easier mathematics.
Accessibility and hints do not punish the player.

### Shrine interactions

-   **Math / Crystal Equation Gate:** numbers, ratios, visual groups or
    function puzzles activate bridges, lifts or geometric mechanisms.
-   **English / Living Library:** restore signs, decode story clues,
    complete sentences or read a short scroll to reveal routes.
-   **Science / Discovery Engine:** choose a prediction, sort materials,
    repair a circuit or identify cause-and-effect to operate machinery.
-   **General Knowledge / Explorer Compass:** interpret maps, identify
    landmarks, match inventions or connect contextual facts to reveal
    secrets.

## 6. 100-level blueprint

Every level below has its own stage hook and a primary/secondary subject
encounter. The remaining two subjects appear as optional bonus shrines.
Boss stages offer all four subject runes. Full structured level data is
also supplied as `100_LEVEL_BLUEPRINT.csv`.

### World 01 --- Whispering Woods (Levels 1--10)

**Guardian:** The Rootkeeper. **Power:** Leaf Glide. **Art:** Sunlit
storybook woodland, moss-covered ruins, giant mushrooms, volumetric
sunbeams and drifting fireflies.

  ------------------------------------------------------------------------
                  Level Stage            Distinct         Learning
                                         gameplay hook    encounter
  --------------------- ---------------- ---------------- ----------------
                      1 First Light      Gentle root hops Count lantern
                                         and one safe     seeds to grow a
                                         moving platform  bridge
                                                          (Mathematics +
                                                          Science)

                      2 Mushroom Canopy  Bouncy mushroom  Complete the
                                         roofs and        owl's word sign
                                         floating leaves  (English +
                                                          General
                                                          Knowledge)

                      3 Firefly Trail    Follow fireflies Sort day and
                                         through          night clues at a
                                         alternating      firefly shrine
                                         light paths      (Science +
                                                          English)

                      4 River Stones     Cross timed      Choose compass
                                         stepping stones  directions to
                                         above a stream   find the
                                                          crossing
                                                          (General
                                                          Knowledge +
                                                          Mathematics)

                      5 Owl's Library    Climb            Restore missing
                                         bookshelves and  words on glowing
                                         push a sliding   pages (English +
                                         ladder           Science)

                      6 Root Runner      Ride swaying     Extend a
                                         vine platforms   numerical
                                                          pattern to
                                                          awaken a vine
                                                          (Mathematics +
                                                          General
                                                          Knowledge)

                      7 Honeycomb        Climb honeycomb  Match
                        Heights          towers and dodge pollinators with
                                         bees             flowers to open
                                                          the hive
                                                          (Science +
                                                          English)

                      8 Lost Explorer    Take a branching Read a map
                                         canopy route     legend to locate
                                         with a           the explorer
                                         checkpoint       (General
                                                          Knowledge +
                                                          Mathematics)

                      9 Ancient Grove    Combine vines,   Solve two mixed
                                         mushrooms and a  runes to open
                                         wind tunnel      the ancient gate
                                                          (Mathematics +
                                                          English)

                     10 Rootkeeper's     Boss arena:      Answer two of
                        Heart            dodge roots,     four subject
                                         jump seed pods,  runes to reveal
                                         strike heart     weak point (All
                                                          Four + All Four)
  ------------------------------------------------------------------------

### World 02 --- Crystal Caverns (Levels 11--20)

**Guardian:** Prism Golem. **Power:** Prism Dash. **Art:** Translucent
crystal caves, refraction, bioluminescent pools and shimmering gemstone
bridges.

  --------------------------------------------------------------------------
                  Level Stage            Distinct         Learning encounter
                                         gameplay hook    
  --------------------- ---------------- ---------------- ------------------
                     11 Sparkling        Hop across small Identify
                        Entrance         crystals that    reflective
                                         brighten         materials to light
                                         underfoot        the path
                                                          (Science +
                                                          Mathematics)

                     12 Echo Tunnel      Navigate         Choose the correct
                                         echo-timed       descriptive word
                                         falling          for cave echoes
                                         stalactites      (English +
                                                          Science)

                     13 Gem Bridge       Build a          Calculate missing
                                         temporary        bridge lengths
                                         crystal span in  (Mathematics +
                                         segments         General Knowledge)

                     14 Miner's Map      Follow branching Match rock and
                                         mineral veins    mineral clues to a
                                                          map (General
                                                          Knowledge +
                                                          Science)

                     15 Prism Lift       Ride a lift      Predict where
                                         between colored  reflected light
                                         light chambers   travels (Science +
                                                          English)

                     16 Crystal Choir    Activate musical Complete a word or
                                         crystals in a    sentence sequence
                                         rhythm pattern   (English +
                                                          Mathematics)

                     17 Shard Maze       Redirect small   Solve ratios or
                                         crystal beams to counting clues for
                                         open doors       mirror angles
                                                          (Mathematics +
                                                          Science)

                     18 Underground Lake Cross floating   Read a cave safety
                                         gems above a     and geography clue
                                         dark pool        (General
                                                          Knowledge +
                                                          English)

                     19 Rainbow Fault    Chain dash       Complete mixed
                                         crystals through light-and-number
                                         a collapsing     runes (Science +
                                         corridor         Mathematics)

                     20 Prism Golem      Boss arena:      Answer two subject
                                         rotating prisms  runes to align the
                                         and beam lanes   boss mirrors (All
                                                          Four + All Four)
  --------------------------------------------------------------------------

### World 03 --- Skybound Isles (Levels 21--30)

**Guardian:** Storm Roc. **Power:** Wind Jump. **Art:** Floating
meadows, cloud seas, cascading waterfalls and distant sky temples with
airy parallax.

  ------------------------------------------------------------------------
                  Level Stage            Distinct         Learning
                                         gameplay hook    encounter
  --------------------- ---------------- ---------------- ----------------
                     21 Cloudstep Meadow Jump across      Compare wind
                                         drifting cloud   speeds or
                                         islands          weather icons
                                                          (Science +
                                                          Mathematics)

                     22 Feather Flight   Use feather      Build a sentence
                                         updrafts to      about an aerial
                                         cross long gaps  journey
                                                          (English +
                                                          General
                                                          Knowledge)

                     23 Waterfall Span   Traverse wet     Measure platform
                                         ledges beside a  intervals to
                                         sky waterfall    repair a bridge
                                                          (Mathematics +
                                                          Science)

                     24 Navigator's Nest Follow a sky     Identify
                                         compass and      landmarks from
                                         route flags      map symbols
                                                          (General
                                                          Knowledge +
                                                          English)

                     25 Gust Garden      Ride predictable Explain what
                                         crosswind cycles makes air move
                                                          (Science +
                                                          Mathematics)

                     26 Balloon Bazaar   Bounce between   Read clues to
                                         colorful         select the right
                                         airships         cargo label
                                                          (English +
                                                          General
                                                          Knowledge)

                     27 Temple Thermals  Time upward      Solve altitude
                                         jumps through    or distance
                                         thermal vents    comparisons
                                                          (Mathematics +
                                                          Science)

                     28 Birdsong Ridge   Avoid            Identify bird
                                         dive-bombing sky adaptations and
                                         wasps            habitats
                                                          (Science +
                                                          General
                                                          Knowledge)

                     29 Eye of the Storm Mix wind jumps,  Interpret a
                                         switches and     weather map and
                                         safe shelters    mixed word clues
                                                          (General
                                                          Knowledge +
                                                          English)

                     30 Storm Roc        Boss arena:      Charge two wind
                                         crosswind,       runes to ground
                                         lightning        the guardian
                                         markers and      (All Four + All
                                         dives            Four)
  ------------------------------------------------------------------------

### World 04 --- Ember Volcano (Levels 31--40)

**Guardian:** Magma Colossus. **Power:** Heat Shield. **Art:** Glowing
lava rivers, obsidian cliffs, heat distortion, smoke plumes and molten
forges.

  ------------------------------------------------------------------------
                  Level Stage            Distinct         Learning
                                         gameplay hook    encounter
  --------------------- ---------------- ---------------- ----------------
                     31 Cinder Path      Cross cooling    Identify solid,
                                         rock platforms   liquid and gas
                                         above lava       states
                                                          (Science +
                                                          Mathematics)

                     32 Ashfall Crossing Time jumps       Read a warning
                                         between falling  sign and choose
                                         ash curtains     safe directions
                                                          (English +
                                                          General
                                                          Knowledge)

                     33 Obsidian Steps   Ascend shifting  Calculate a safe
                                         stone columns    sequence of
                                                          stepping
                                                          intervals
                                                          (Mathematics +
                                                          Science)

                     34 Forge Village    Operate bellows  Recognize useful
                                         and lift bridges tools and their
                                                          purposes
                                                          (General
                                                          Knowledge +
                                                          English)

                     35 Steam Chamber    Switch water     Predict heating
                                         valves to create and cooling
                                         steam lifts      changes
                                                          (Science +
                                                          Mathematics)

                     36 Magma Minecart   Ride a fast      Complete an
                                         minecart with    instruction
                                         jump cues        sequence at a
                                                          checkpoint
                                                          (English +
                                                          Science)

                     37 Pressure Gate    Balance two      Solve equivalent
                                         pressure meters  expressions or
                                                          number
                                                          relationships
                                                          (Mathematics +
                                                          General
                                                          Knowledge)

                     38 Firewatch Tower  Climb rotating   Identify volcano
                                         towers above a   parts and safe
                                         magma lake       response choices
                                                          (General
                                                          Knowledge +
                                                          Science)

                     39 Heart of Ember   Combine steam    Solve two mixed
                                         lifts and        heat-and-logic
                                         collapsing       runes (Science +
                                         obsidian         English)

                     40 Magma Colossus   Boss arena: lava Open cooling
                                         waves, boulder   valves using two
                                         slams, cooled    subject runes
                                         armor            (All Four + All
                                                          Four)
  ------------------------------------------------------------------------

### World 05 --- Frozen Peaks (Levels 41--50)

**Guardian:** Frost Warden. **Power:** Ice Grip. **Art:** Glittering
snowfields, auroras, ice arches and mountain villages under soft winter
light.

  -------------------------------------------------------------------------------------
                  Level Stage            Distinct         Learning encounter
                                         gameplay hook    
  --------------------- ---------------- ---------------- -----------------------------
                     41 Snowdrift Trail  Run through deep Compare cold-weather animal
                                         snow and low ice adaptations (Science +
                                         arches           English)

                     42 Icicle Bridge    Cross sliding    Read winter instructions and
                                         ice tiles with   choose the correct route
                                         careful momentum (English + Mathematics)

                     43 Glacier Steps    Climb floating   Calculate step lengths or
                                         ice slabs of     order temperatures
                                         different sizes  (Mathematics + Science)

                     44 Northern Lights  Jump across      Identify sky phenomena and
                                         aurora-lit cloud world regions (General
                                         platforms        Knowledge + English)

                     45 Frozen Falls     Turn water       Explain freezing and melting
                                         wheels to melt a (Science + Mathematics)
                                         small passage    

                     46 Snow Village     Deliver parcels  Decode an address and short
                                         via rooftops and message (English + General
                                         lifts            Knowledge)

                     47 Mirror Ice       Slide to marked  Solve a distance or sequence
                                         stops and avoid  puzzle (Mathematics +
                                         thin ice         Science)

                     48 Mountain Rescue  Use ropes and    Interpret trail symbols and
                                         flags to find a  geography clues (General
                                         lost climber     Knowledge + English)

                     49 Aurora Ascent    Combine slippery Solve a mixed
                                         ramps and ice    temperature-and-measurement
                                         grips            gate (Mathematics + Science)

                     50 Frost Warden     Boss arena: ice  Melt marked sigils by
                                         breath, falling  answering two subject runes
                                         spikes and       (All Four + All Four)
                                         decoys           
  -------------------------------------------------------------------------------------

### World 06 --- Sunken Reef (Levels 51--60)

**Guardian:** Abyss Leviathan. **Power:** Bubble Swim. **Art:** Coral
palaces, sun shafts underwater, schools of fish and drifting sea grass.

  ------------------------------------------------------------------------
                  Level Stage            Distinct         Learning
                                         gameplay hook    encounter
  --------------------- ---------------- ---------------- ----------------
                     51 Coral Welcome    Swim through     Identify living
                                         coral arches     and nonliving
                                         with buoyancy    reef objects
                                         controls         (Science +
                                                          General
                                                          Knowledge)

                     52 Pearl Path       Ride bubbles     Complete
                                         upward between   sea-themed word
                                         shell platforms  clues (English +
                                                          Mathematics)

                     53 Current Crossing Navigate         Compare current
                                         alternating      directions and
                                         currents and     quantities
                                         anchor points    (Mathematics +
                                                          Science)

                     54 Shipwreck Chart  Explore a sunken Read nautical
                                         ship and follow  symbols and
                                         a map            world ocean
                                                          facts (General
                                                          Knowledge +
                                                          English)

                     55 Kelp Forest      Weave through    Match marine
                                         waving kelp and  creatures to
                                         jellyfish        their roles
                                                          (Science +
                                                          Mathematics)

                     56 Seashell Chorus  Activate musical Choose correct
                                         shells in the    sentence
                                         correct order    connectors
                                                          (English +
                                                          General
                                                          Knowledge)

                     57 Tide Machines    Operate buoyant  Solve time, rate
                                         lift chambers    or fraction
                                                          puzzles
                                                          (Mathematics +
                                                          Science)

                     58 Reef Sanctuary   Rescue small sea Recognize
                                         creatures from a habitats and
                                         maze             conservation
                                                          choices (General
                                                          Knowledge +
                                                          Science)

                     59 Deep Blue Gate   Combine          Answer mixed
                                         currents,        ocean and
                                         bubbles and      language runes
                                         coral lifts      (Science +
                                                          English)

                     60 Abyss Leviathan  Boss arena: tail Align ocean
                                         waves, currents  valves using two
                                         and bubble traps subject runes
                                                          (All Four + All
                                                          Four)
  ------------------------------------------------------------------------

### World 07 --- Clockwork City (Levels 61--70)

**Guardian:** Gear Titan. **Power:** Magnet Pull. **Art:** Copper gears,
kinetic bridges, luminous clock faces and brass factories with layered
moving machinery.

  ----------------------------------------------------------------------------
                  Level Stage            Distinct         Learning encounter
                                         gameplay hook    
  --------------------- ---------------- ---------------- --------------------
                     61 Gear Street      Hop across       Match simple
                                         turning cog      machines to their
                                         platforms        uses (Science +
                                                          Mathematics)

                     62 Steam Tram       Ride a moving    Read a transit
                                         tram and dodge   notice to choose the
                                         pistons          correct stop
                                                          (English + General
                                                          Knowledge)

                     63 Clocktower Climb Jump between     Calculate elapsed
                                         clock hands and  time and number
                                         lifts            patterns
                                                          (Mathematics +
                                                          Science)

                     64 Inventor's Alley Push crates onto Identify inventions
                                         switches and     and their functions
                                         explore          (General Knowledge +
                                         workshops        English)

                     65 Circuit Hall     Connect          Predict which simple
                                         low-voltage      circuit lights up
                                         puzzle switches  (Science +
                                                          Mathematics)

                     66 Factory Conveyor Run against      Sequence written
                                         moving belts and instructions for
                                         timed presses    machine startup
                                                          (English + Science)

                     67 Magnet Yard      Pull metal       Solve force or
                                         blocks into      numeric balance
                                         bridge positions puzzles
                                                          (Mathematics +
                                                          General Knowledge)

                     68 Automaton Museum Explore a        Match inventors,
                                         gallery of       tools and
                                         historic devices discoveries (General
                                                          Knowledge + Science)

                     69 Grand Mechanism  Combine gears,   Restore two mixed
                                         lasers and       logic-and-language
                                         magnet blocks    panels
                                                          (Mathematics +
                                                          English)

                     70 Gear Titan       Boss arena:      Overload armor using
                                         laser lanes,     two subject circuit
                                         spinning gears   runes (All Four +
                                         and conveyors    All Four)
  ----------------------------------------------------------------------------

### World 08 --- Moonshadow Marsh (Levels 71--80)

**Guardian:** Shade Serpent. **Power:** Lantern Pulse. **Art:** Silver
moonlit wetlands, fog, glowing lilies, shadow lanterns and enchanted
tree silhouettes.

  ------------------------------------------------------------------------
                  Level Stage            Distinct         Learning
                                         gameplay hook    encounter
  --------------------- ---------------- ---------------- ----------------
                     71 Moonlit Reeds    Cross floating   Identify
                                         lily pads in     nocturnal animal
                                         moonlit fog      behavior
                                                          (Science +
                                                          General
                                                          Knowledge)

                     72 Whisper Lanterns Light lanterns   Interpret a
                                         to reveal hidden riddle to choose
                                         platforms        a safe light
                                                          path (English +
                                                          Mathematics)

                     73 Mirror Marsh     Cross reflection Complete a
                                         platforms that   symmetry or
                                         appear in pairs  number pattern
                                                          (Mathematics +
                                                          Science)

                     74 Forgotten        Follow old       Read map clues
                        Causeway         signposts        and compass
                                         through the mist directions
                                                          (General
                                                          Knowledge +
                                                          English)

                     75 Glowcap Hollow   Jump across      Compare light
                                         mushrooms that   sources and
                                         open under light shadows
                                                          (Science +
                                                          Mathematics)

                     76 Riddle Tree      Climb a talking  Solve vocabulary
                                         tree with        and inference
                                         branching        riddles
                                         dialogue         (English +
                                                          General
                                                          Knowledge)

                     77 Shadow Steps     Switch lantern   Solve geometric
                                         beams to make    mirror patterns
                                         solid bridges    (Mathematics +
                                                          Science)

                     78 Nightwatch       Avoid shadow     Recognize
                        Outpost          frogs and locate wetland habitats
                                         safe houses      and safety clues
                                                          (General
                                                          Knowledge +
                                                          Science)

                     79 Veil of Mist     Combine timed    Solve two mixed
                                         lantern pulses   logic and word
                                         and mirrored     runes (English +
                                         routes           Mathematics)

                     80 Shade Serpent    Boss arena:      Use two clue
                                         shadow doubles,  runes to reveal
                                         safe light zones the real serpent
                                                          (All Four + All
                                                          Four)
  ------------------------------------------------------------------------

### World 09 --- Starfall Summit (Levels 81--90)

**Guardian:** Comet Gryphon. **Power:** Gravity Flip. **Art:** Meteor
gardens, luminous constellations, celestial bridges and a shifting
gravity skyline.

  --------------------------------------------------------------------------
                  Level Stage            Distinct         Learning encounter
                                         gameplay hook    
  --------------------- ---------------- ---------------- ------------------
                     81 Meteor Meadow    Hop across       Recognize basic
                                         low-gravity star solar system facts
                                         rocks            (Science +
                                                          Mathematics)

                     82 Comet Trail      Use comet        Decode a
                                         platforms with   star-chart message
                                         timed            (English + General
                                         trajectories     Knowledge)

                     83 Orbit Garden     Circle floating  Solve orbital
                                         planetoids and   patterns and
                                         timed lifts      number sequences
                                                          (Mathematics +
                                                          Science)

                     84 Observatory Gate Explore a        Identify
                                         telescope        constellations and
                                         station          space exploration
                                                          milestones
                                                          (General
                                                          Knowledge +
                                                          English)

                     85 Gravity Switch   Flip gravity at  Explain forces and
                                         clearly marked   falling motion
                                         safe zones       (Science +
                                                          Mathematics)

                     86 Starlight        Leap between     Interpret an
                        Archive          floating books   astronomy-themed
                                         and glyphs       short passage
                                                          (English + General
                                                          Knowledge)

                     87 Asteroid Circuit Redirect         Calculate time and
                                         asteroid rails   distance
                                         through switches relationships
                                                          (Mathematics +
                                                          Science)

                     88 Celestial        Navigate a       Choose the right
                        Compass          rotating map of  direction from a
                                         stars            sky map (General
                                                          Knowledge +
                                                          English)

                     89 Summit of Stars  Combine low      Complete two mixed
                                         gravity, comets  constellation
                                         and moving       runes (Science +
                                         bridges          Mathematics)

                     90 Comet Gryphon    Boss arena:      Align
                                         gravity swaps,   constellation
                                         meteor lanes and circuits with two
                                         dives            subject runes (All
                                                          Four + All Four)
  --------------------------------------------------------------------------

### World 10 --- Crown of Worlds (Levels 91--100)

**Guardian:** Eclipse Sovereign. **Power:** Harmony Burst. **Art:** A
monumental radiant castle combining forest, crystal, sky and cosmic
motifs with celebratory golden light.

  ----------------------------------------------------------------------------
                  Level Stage            Distinct         Learning encounter
                                         gameplay hook    
  --------------------- ---------------- ---------------- --------------------
                     91 Golden Courtyard Revisit forest   Solve a mixed
                                         roots with       ecology-and-number
                                         crystal dash     relic (Mathematics +
                                         shortcuts        Science)

                     92 Hall of Echoes   Use sky winds    Read and interpret a
                                         and crystal      story clue
                                         reflections      (English + General
                                                          Knowledge)

                     93 Fourfold Garden  Cross terrain    Identify patterns
                                         mixing snow and  across ecosystems
                                         coral platforms  (Science +
                                                          Mathematics)

                     94 Royal Archive    Explore rooms    Match places,
                                         holding relics   inventions and
                                         from nine worlds discoveries (General
                                                          Knowledge + English)

                     95 Chamber of       Use heat shields Balance equations or
                        Balance          to cross         quantities
                                         ice-and-lava     (Mathematics +
                                         puzzles          Science)

                     96 Gallery of Words Unlock rotating  Solve grammar,
                                         doors with       meaning and
                                         written clues    inference challenges
                                                          (English + General
                                                          Knowledge)

                     97 Worlds in Motion Chain magnet     Explain forces and
                                         pull, wind jump  energy in a combined
                                         and gravity flip mechanism (Science +
                                                          Mathematics)

                     98 Hall of Heroes   Traverse         Connect world
                                         branching routes knowledge and
                                         recalling        explorer clues
                                         earlier worlds   (General Knowledge +
                                                          English)

                     99 The Final Ascent Master a long    Complete two
                                         checkpointed     cross-subject
                                         platform         mastery runes (All
                                         sequence         Four + All Four)

                    100 Eclipse          Three-phase      Activate four
                        Sovereign        final boss with  relics, then use
                                         every unlocked   Harmony Burst (All
                                         ability          Four + All Four)
  ----------------------------------------------------------------------------

## 7. Boss battle design --- 10 unique encounters

Every boss has a distinct silhouette, intro, at least two attack
patterns, warning animations, hit states and a fair weak-point window.
Boss phases are **platform combat**, not just a quiz panel. Learning
shrines are integrated into arena mechanisms; a correct answer earns a
temporary ability or exposes the weak spot. Incorrect answers provide
hints, not instant damage.

  ------------------------------------------------------------------------
                    Boss level Boss                  Distinct mechanic
  ---------------------------- --------------------- ---------------------
                            10 The Rootkeeper        Vine sweeps, falling
                                                     seed pods, glowing
                                                     root weak spots;
                                                     solve two elemental
                                                     runes to expose its
                                                     heart

                            20 Prism Golem           Reflective beam
                                                     lanes, rotating
                                                     crystal armor and
                                                     light puzzles; charge
                                                     prism mirrors to
                                                     break the shell

                            30 Storm Roc             Telegraphed dives,
                                                     crosswinds and
                                                     thunder nests; align
                                                     wind runes to stun
                                                     the bird

                            40 Magma Colossus        Lava waves, rock
                                                     slams and cooling
                                                     windows; activate
                                                     water-and-heat valves
                                                     to expose the core

                            50 Frost Warden          Ice spikes, freezing
                                                     breath and
                                                     mirror-image decoys;
                                                     melt marked ice
                                                     sigils to reveal the
                                                     real guardian

                            60 Abyss Leviathan       Currents, bubble
                                                     traps and tail
                                                     sweeps; align
                                                     ocean-current valves
                                                     to surface its weak
                                                     point

                            70 Gear Titan            Rotating gears,
                                                     conveyor reversals
                                                     and laser telegraphs;
                                                     complete circuit
                                                     sequences to overload
                                                     armor

                            80 Shade Serpent         Shadow clones,
                                                     light-safe zones and
                                                     sweeping tails; use
                                                     lantern beams and
                                                     clue runes to reveal
                                                     the real serpent

                            90 Comet Gryphon         Gravity swaps, meteor
                                                     trails and star-ring
                                                     dives; complete
                                                     constellation
                                                     circuits to interrupt
                                                     flight

                           100 Eclipse Sovereign     Three readable phases
                                                     mixing previous
                                                     worlds; four subject
                                                     relics charge Harmony
                                                     Burst for the finale
  ------------------------------------------------------------------------

## 8. HUD, UI and UX visual specification

-   **Title:** full-bleed living environment, Ari and Pip animated in
    foreground, bold adventure logotype, large Play button, World Map,
    Settings, Languages. No website cards.
-   **World map:** hand-painted illustrated continent with 10 regions,
    winding route, guardian silhouettes, star completion and unlock
    effects; zoom/pan by touch or mouse.
-   **Gameplay HUD:** hearts and coins top-left; world/level and rune
    keys top-right; pause at far-right; unobtrusive progress line only
    when needed.
-   **Shrine:** large readable question card visually integrated as a
    rune tablet or floating book; 1 question at a time, large buttons,
    voice/read-aloud where available, hint and retry.
-   **Results:** full-screen victory scene with 1--3 stars, rewards,
    subject summary and Next Level. Show progress positively; no shaming
    on mistakes.
-   **UI language:** fantasy adventure with warm gold, mint/teal
    highlights, rounded sculpted buttons and restrained glass overlays.
    World color palettes change per scene; never reuse Titan Academy's
    dark navy dashboard.
-   **Motion:** elegant 180--350 ms UI transitions; world transitions
    0.6--1.2 s; reduce/disable under accessibility setting.
-   **Mobile:** landscape recommended; portrait shows a polished
    rotate-device prompt or an intentionally redesigned portrait
    layout---never a blank canvas. Account for iOS safe areas and Safari
    browser bars.

## 9. Technical architecture and delivery

**Recommended stack:** TypeScript + Vite + Phaser (stable supported 2D
release at implementation time), WebGL with canvas fallback; responsive
HTML/CSS overlays for menus and accessible questions; asset manifests
per world; modular content in JSON/TypeScript. An equivalent capable 2D
engine is acceptable if all acceptance tests pass.

``` text
src/
  scenes/        Boot, Title, Profile, WorldMap, Level, Shrine, Boss, Results, Pause
  entities/      Ari, Pip, Enemy, Boss, Collectible, MovingPlatform
  systems/       Physics, Camera, Input, Combat, Abilities, Save, Audio, Accessibility
  education/     QuestionBank, Validators, AgeScaler, Localization, QuestionRenderer
  levels/        world-01 ... world-10 (authored geometry, hazards, shrines, checkpoints)
  ui/            HUD, MobileControls, Menus, Subtitles, Settings
  assets/        compressed world packs, sprite atlases, sound and music
tests/           unit, content-validation, progression, input, performance, browser
public/          icons, manifest, fallback
```

**Save model:** per age group + per subject preference + completed
levels, stars, collectibles, unlocked abilities, settings, accessibility
and checkpoints; use versioned local storage / IndexedDB with migration
from v1 where feasible. Never erase existing saves during migration.
Cloud sync is optional later and must be opt-in.

**Public deployment:** produce a static `dist/` folder, deploy via
Google Antigravity workflow to an HTTPS domain, verify no ChatGPT
authentication or app-preview dependency. The URL must work in Safari,
Chrome, Edge and Android browsers. Do not assume a `file://` or
social-media attachment preview executes JavaScript.

**Performance targets (targets, not verified achievements):** responsive
controls and stable 60 fps on typical modern desktops, 30--60 fps on
tested mobile hardware; lazy-load worlds, compressed WebP/AVIF imagery
where supported, sprite atlases, streamed audio, device-tier effect
scaling, capped particles, no full-resolution 4K backgrounds on phones.
Aim for an initial critical download under \~12 MB and load later worlds
on demand, revising targets after device measurements.

**Child privacy:** gameplay should not require names, emails, ads,
public chat or user accounts. Store progress locally by default; only
add analytics/cloud accounts after appropriate child privacy review and
clear consent flows.

## 10. Production milestones and approval gates

  -----------------------------------------------------------------------
  Milestone               Deliverable             Required gate before
                                                  continuing
  ----------------------- ----------------------- -----------------------
  M0 --- Art direction    Original hero, one      Looks unmistakably
                          environment key art, UI unlike Titan Academy;
                          reference sheet, 10     original IP approved
                          world palettes          

  M1 --- Playable         World 1 levels 1, 5 and Responsive movement,
  vertical slice          10 fully playable on    two real shrines,
                          desktop + iPhone Safari checkpoints, real
                                                  Rootkeeper boss; no
                                                  blank screen

  M2 --- Core systems     Save, languages, five   Cross-device smoke
                          age bands, four         tests, valid answers,
                          subjects, map,          pause, progress
                          abilities,              migration
                          accessibility           

  M3 --- Content wave A   Worlds 1--3, 30         All 30 completable;
                          authored levels         unique level hooks, 3
                                                  boss fights

  M4 --- Content wave B   Worlds 4--7, 40 more    70 total completable;
                          authored levels         asset and performance
                                                  budgets met

  M5 --- Content wave C   Worlds 8--10, final 30  100/100 completable,
                          authored levels         all ten unique bosses,
                                                  no softlocks

  M6 --- Polish and       VFX, music, QA,         iPhone Safari +
  launch                  tri-language            Android + desktop
                          proofreading,           signoff; public
                          performance, HTTPS      no-login access
                          deployment              
  -----------------------------------------------------------------------

**Scope discipline:** do not produce 100 placeholder stages before the
first three stages feel excellent. First ship a convincing vertical
slice, then scale content with repeatable tooling and manual level
review.

## 11. Acceptance tests and definition of done

1.  **Visual:** full-screen world dominates the view; no Titan-style
    card dashboard; each of ten worlds has distinct environment,
    palette, enemies and guardian.
2.  **Playable:** movement, jump physics, collisions, moving platforms,
    enemies, checkpoints, collectables, power-ups, victory and defeat
    work with mouse/keyboard/touch.
3.  **Education:** all 4 subjects appear across all worlds; 5 age bands
    genuinely change question difficulty; 3 language packs render
    correctly; English-language learning stays pedagogically valid.
4.  **Content:** 100 distinct authored level files/definitions, unique
    traversal hooks and ten different bosses; automated script confirms
    each level has reachable exit, shrines and checkpoints.
5.  **Fairness:** learning overlay pauses hazards; hints and retries
    work; younger children can finish without speed-reading; motor
    difficulty adjustable separately.
6.  **Save:** age-specific progress, language, settings, stars and
    unlocks survive refresh; reset only selected profile; legacy save
    migration preserves v1 data where available.
7.  **Mobile:** iPhone Safari, Android Chrome, tablets and desktop
    tested on actual browser sessions; orientation behavior intentional;
    no blank canvas, clipped HUD or nonresponsive touch buttons.
8.  **Performance:** fps, startup time, peak memory and network payload
    measured on a defined device matrix; low-effects fallback verified.
9.  **Deployment:** publicly reachable HTTPS URL, no ChatGPT sign-in
    requirement, cache/version strategy, user-friendly error state and
    working offline fallback if enabled.
10. **Safety/IP:** original assets, no third-party copyrighted Nintendo
    content, no unnecessary collection of children's personal data.

## 12. Risks and mitigations

-   **"AAA" visuals vs browser budget:** target premium 2.5D
    presentation, selective animation and lighting, not full 3D ray
    tracing. Budget assets per world and profile on real phones.
-   **100-level monotony:** authored hooks, boss mechanics, environment
    shifts, enemy combinations, branching secrets and manual playtest
    checklists.
-   **Educational fatigue:** two mandatory encounters per level, two
    optional; short readable questions, pause, hints and varied
    interaction types.
-   **Localization mistakes:** native-language proofreading, line-break
    QA, right font fallback and localized number formatting.
-   **Mobile attachment blank screen:** test hosted HTTPS Safari from
    day one; show explicit unsupported-preview message when applicable.
-   **Build regressions:** automated smoke tests, asset-path validation,
    no missing sprites/audio, deployment preview and rollback plan.

## 13. Handoff / next action

Start with **M0 + M1**: build the original hero, cinematic forest world,
three authored levels (1, 5, 10), two contextual shrines per stage,
mobile controls and a genuine Rootkeeper boss. Review the playable
vertical slice on a real iPhone Safari browser before authoring the
remaining 97 levels. This blueprint is a production plan, **not** an
already implemented v2 game.
