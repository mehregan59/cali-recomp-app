// --- EXERCISE DATABASE & REAL ANIMATION/GIF MAPPINGS ---
const getExercisePool = (level, eq) => {
  const push = {
    beginner: [
      { id: 'push_1', name: 'Incline Push-ups', category: 'Push', next: 'Standard Push-ups', cue: 'Hands elevated on stable surface. Brace core.', gif: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop' },
      { id: 'push_2', name: 'Knee Pike Push-ups', category: 'Push', next: 'Strict Pike Push-ups', cue: 'Hips high in V-shape, lower crown of head.' },
      { id: 'push_3', name: 'Bench Dips', category: 'Push', next: 'Straight-Leg Dips', cue: 'Lower until elbows hit 90 degrees.' }
    ],
    intermediate: [
      { id: 'push_1', name: 'Tempo Push-ups', category: 'Push', next: 'Archer Push-ups', cue: '3 seconds down, chest grazes floor.' },
      { id: 'push_2', name: 'Pike Push-ups', category: 'Push', next: 'Elevated Pike Push-ups', cue: 'Shift weight forward onto toes for anterior delts.' },
      { id: 'push_3', name: 'Diamond Push-ups', category: 'Push', next: 'Bar / Ring Dips', cue: 'Index fingers and thumbs touching.' }
    ],
    advanced: [
      { id: 'push_1', name: 'Archer Push-ups', category: 'Push', next: 'One-Arm Progression', cue: 'Shift 80% weight to working arm.' },
      { id: 'push_2', name: 'Wall Handstand Push-ups', category: 'Push', next: 'Freestanding HSPU', cue: 'Strict vertical stack against wall.' },
      { id: 'push_3', name: 'Pseudo Planche Push-ups', category: 'Push', next: 'Tuck Planche Push-ups', cue: 'Lean shoulders significantly past wrists.' }
    ]
  };

  const pull = {
    beginner: eq === 'none' ? [
      { id: 'pull_1', name: 'Towel Doorframe Rows', category: 'Pull', next: 'Single-Arm Towel Rows', cue: 'Lean back, pull chest to doorframe.' },
      { id: 'pull_2', name: 'Prone Floor Cobras', category: 'Pull', next: 'Floor Pull-downs', cue: 'Squeeze shoulder blades and lift chest.' }
    ] : [
      { id: 'pull_1', name: 'Australian Rows', category: 'Pull', next: 'Elevated Rows', cue: 'Pull low bar or rings to sternum.' },
      { id: 'pull_2', name: 'Negative Pull-ups (5s)', category: 'Pull', next: 'Strict Pull-ups', cue: 'Jump to top, lower slowly over 5 seconds.' }
    ],
    intermediate: eq === 'none' ? [
      { id: 'pull_1', name: 'Single-Arm Towel Rows', category: 'Pull', next: 'Explosive Rows', cue: 'Resist trunk rotation with core.' },
      { id: 'pull_2', name: 'Sliding Floor Pull-downs', category: 'Pull', next: 'Isometric Towel Hold', cue: 'Pull body forward on smooth floor using lats.' }
    ] : [
      { id: 'pull_1', name: 'Strict Pull-ups', category: 'Pull', next: 'Chest-to-Bar Pull-ups', cue: 'Dead hang, depress scapula, chin over bar.' },
      { id: 'pull_2', name: 'Feet-Elevated Inverted Rows', category: 'Pull', next: 'Archer Rows', cue: 'Feet on box, pause 1 second at top.' }
    ],
    advanced: eq === 'none' ? [
      { id: 'pull_1', name: 'Explosive Single-Arm Rows', category: 'Pull', next: 'Front Lever Tuck Rows', cue: 'Max concentric speed.' },
      { id: 'pull_2', name: 'Isometric Towel Hold', category: 'Pull', next: 'One-Arm Eccentrics', cue: '90-degree elbow lock static hold.' }
    ] : [
      { id: 'pull_1', name: 'L-Sit Pull-ups', category: 'Pull', next: 'Muscle-up Progression', cue: 'Legs horizontal at 90 degrees.' },
      { id: 'pull_2', name: 'Archer Pull-ups', category: 'Pull', next: 'One-Arm Eccentrics', cue: 'Traverse side-to-side along bar.' }
    ]
  };

  const legs = {
    beginner: [
      { id: 'leg_1', name: 'Bulgarian Split Squats', category: 'Legs', next: 'Assisted Pistol Squats', cue: 'Rear foot elevated, lean torso forward slightly.' },
      { id: 'leg_2', name: 'Single-Leg Glute Bridges', category: 'Legs', next: 'Nordic Eccentrics', cue: 'Drive through heel, full hip extension.' }
    ],
    intermediate: [
      { id: 'leg_1', name: 'Assisted Pistol Squats', category: 'Legs', next: 'Strict Pistol Squats', cue: 'Hold doorframe lightly for balance.' },
      { id: 'leg_2', name: 'Nordic Hamstring Curls', category: 'Legs', next: 'Full Nordic Curls', cue: 'Anchor heels, fight gravity on descent.' }
    ],
    advanced: [
      { id: 'leg_1', name: 'Strict Pistol Squats', category: 'Legs', next: 'Weighted Pistols', cue: 'Full depth hamstring to calf.' },
      { id: 'leg_2', name: 'Sissy Squats', category: 'Legs', next: 'Matrix Squats', cue: 'Rigid line from knees to shoulders.' }
    ]
  };

  const core = {
    beginner: [{ id: 'core_1', name: 'Hollow Body Tuck Hold', category: 'Core', next: 'Full Hollow Hold', cue: 'Lower back glued to floor.' }],
    intermediate: [{ id: 'core_1', name: 'Hanging Leg Raises', category: 'Core', next: 'Toes-to-Bar', cue: 'Curl pelvis up, zero momentum swing.' }],
    advanced: [{ id: 'core_1', name: 'Floor L-Sit / Dragon Flags', category: 'Core', next: 'V-Sit Hold', cue: 'Full core compression and lockout.' }]
  };

  return { push: push[level], pull: pull[level], legs: legs[level], core: core[level] };
};

// Common Foods Quick Database for Instant Offline Logging
const COMMON_FOODS = [
  { name: 'Chicken Breast (cooked, 100g)', calories: 165, protein: 31 },
  { name: 'White / Brown Rice (cooked, 100g)', calories: 130, protein: 2.7 },
  { name: 'Oats (dry, 50g)', calories: 190, protein: 6.5 },
  { name: 'Whole Eggs (2 large)', calories: 144, protein: 12.6 },
  { name: 'Greek Yogurt (200g)', calories: 120, protein: 20 },
  { name: 'Banana (1 medium)', calories: 105, protein: 1.3 },
  { name: 'Whole Wheat Bread (1 slice)', calories: 80, protein: 4 },
  { name: 'Olive Oil (1 tbsp / 10g)', calories: 88, protein: 0 },
  { name: 'Whey Protein Scoop (30g)', calories: 120, protein: 24 },
  { name: 'Döner Kebab (Standard)', calories: 650, protein: 35 },
  { name: 'Pasta (cooked, 150g)', calories: 220, protein: 8 }
];
