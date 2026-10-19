// --- 100% ZERO-EQUIPMENT (NO TOOLS) CALISTHENICS & RUNNING LIBRARY ---

const EXERCISE_LIBRARY = {
  run_zone2: {
    id: 'run_zone2',
    name: 'Progressive Fat-Burn Run / Brisk Jog',
    category: 'Run',
    animType: 'run',
    next: 'Tempo Interval Run',
    cue: 'Start easy. Breathe through your nose (Zone 2 heart rate: 65–75% Max HR).',
    steps: [
      '1. Keep torso tall with a slight forward lean from the ankles.',
      '2. Land mid-foot directly under your hips (avoid heavy heel striking).',
      '3. Maintain a steady pace where you can speak full sentences without gasping.'
    ]
  },
  knee_pushup: {
    id: 'knee_pushup',
    name: 'Strict Knee / Tempo Floor Push-ups',
    category: 'Push',
    animType: 'tempo_pushup',
    next: 'Tempo Push-ups (3-1-1)',
    cue: 'Zero equipment needed. Keep hips in a straight line from knees/feet to shoulders.',
    steps: [
      '1. Place hands slightly wider than shoulder-width flat on the floor.',
      '2. Lower your chest slowly (3 seconds) until it grazes the floor.',
      '3. Press firmly through your palms back to full arm extension.'
    ]
  },
  tempo_pushup: {
    id: 'tempo_pushup',
    name: 'Tempo Push-ups (3-1-1)',
    category: 'Push',
    animType: 'tempo_pushup',
    next: 'Archer Push-ups',
    cue: 'Wide shoulder-width stance. 3s slow descent, 1s bottom hold, 1s press.',
    steps: [
      '1. High plank on the floor: hands shoulder-width, abs and glutes braced.',
      '2. Take a full 3 seconds to lower your chest to 2cm above the floor.',
      '3. Hold 1 second at the bottom without touching the ground, then drive up.'
    ]
  },
  pike_pushup: {
    id: 'pike_pushup',
    name: 'Floor Pike Push-ups (Shoulder Press)',
    category: 'Push',
    animType: 'pike_pushup',
    next: 'Deep Deficit Pike Push-up',
    cue: 'Hips high in an upside-down V-shape on the floor. Lower crown of head forward.',
    steps: [
      '1. From a push-up position, walk your feet forward so your hips form a steep inverted "V".',
      '2. Bend elbows and lower the top of your head toward the floor slightly in front of your fingers.',
      '3. Push through your shoulders to press your torso back up to the starting V-shape.'
    ]
  },
  diamond_pushup: {
    id: 'diamond_pushup',
    name: 'Diamond Push-ups (Triceps Focus)',
    category: 'Push',
    animType: 'diamond_pushup',
    next: 'Pseudo Planche Push-ups',
    cue: 'Thumbs and index fingers touch to form a ♦ diamond shape directly under your chest.',
    steps: [
      '1. Place both hands close together under your sternum so index fingers and thumbs form a diamond ♦.',
      '2. Tuck your elbows tightly against your ribs as you lower your chest onto the back of your hands.',
      '3. Press straight up, squeezing the triceps hard at the top lockout.'
    ]
  },
  archer_pushup: {
    id: 'archer_pushup',
    name: 'Side-to-Side Archer Push-ups',
    category: 'Push',
    animType: 'archer_pushup',
    next: 'One-Arm Push-up Progression',
    cue: 'Extra-wide hands on floor. Shift 80% weight onto one arm while the other arm stays straight.',
    steps: [
      '1. Place hands twice as wide as shoulder-width on the floor.',
      '2. Shift your torso over your left hand, bending the left elbow while keeping your right arm locked straight.',
      '3. Push back to the center and repeat on the right arm.'
    ]
  },
  sliding_floor_pulldown: {
    id: 'sliding_floor_pulldown',
    name: 'Prone Floor Lat Pull-Downs (No Bar)',
    category: 'Pull',
    animType: 'floor_pulldown',
    next: 'Single-Arm Floor Pulls',
    cue: 'Lie face down on the floor. Press forearms/palms down and slide/pull your chest forward.',
    steps: [
      '1. Lie face down on a smooth floor with arms extended overhead like Superman.',
      '2. Drive your elbows down toward your back pockets and squeeze your lats to lift and slide your chest forward.',
      '3. Hold the peak back contraction for 2 seconds, then slowly extend arms back overhead.'
    ]
  },
  prone_cobra: {
    id: 'prone_cobra',
    name: 'Prone Floor Y-T-W Back Extensions',
    category: 'Pull',
    animType: 'prone_cobra',
    next: 'Prone Floor Lat Pull-Downs',
    cue: 'Lie face down on the floor. Lift chest and sweep arms from Y to T to W, squeezing upper back.',
    steps: [
      '1. Lie face down on the floor, toes touching the ground, glutes tight.',
      '2. Lift your chest off the floor and pull your shoulder blades together and down.',
      '3. Sweep your arms from overhead (Y) out to the sides (T) and elbows tucked (W), pausing 2s each.'
    ]
  },
  reverse_snow_angel: {
    id: 'reverse_snow_angel',
    name: 'Reverse Floor Snow Angels (Rear Delts & Lats)',
    category: 'Pull',
    animType: 'prone_cobra',
    next: 'Isometric Towel / Floor Row',
    cue: 'Hover hands above the floor while lying face down; sweep arms in a full arc from hips to overhead.',
    steps: [
      '1. Lie face down, forehead hovering just above the floor, hands by your hips with palms facing up.',
      '2. Keep elbows locked straight and sweep your arms in a wide circle all the way overhead without touching the ground.',
      '3. Reverse the motion slowly over 3 seconds while pinching your shoulder blades.'
    ]
  },
  reverse_lunge: {
    id: 'reverse_lunge',
    name: 'Slow Tempo Floor Split Squats (No Bench)',
    category: 'Legs',
    animType: 'floor_lunge',
    next: 'Assisted Pistol Squats',
    cue: 'Split stance on the floor. Lower back knee until it hovers 1cm above the ground.',
    steps: [
      '1. Take a long step backward on the floor so both feet are hip-width apart in a split stance.',
      '2. Lower your hips straight down over 3 seconds until your back knee lightly kisses the floor.',
      '3. Drive through your front heel to stand tall. Complete all reps on Left leg, then switch to Right.'
    ]
  },
  glute_bridge: {
    id: 'glute_bridge',
    name: 'Single-Leg Floor Hamstring Walkouts / Bridges',
    category: 'Legs',
    animType: 'glute_bridge',
    next: 'Pistol Squats',
    cue: 'Lie on your back on the floor. Drive one heel into the ground and lift hips high.',
    steps: [
      '1. Lie on your back with knees bent and feet flat on the floor. Lift one leg straight up in the air.',
      '2. Drive through your grounded heel to bridge your hips up until your torso and thigh form a straight line.',
      '3. Pause 2 seconds squeezing hamstrings and glutes, then lower slowly.'
    ]
  },
  pistol_squat: {
    id: 'pistol_squat',
    name: 'Floor Single-Leg Squat (Pistol Progression)',
    category: 'Legs',
    animType: 'pistol_squat',
    next: 'Explosive Jump Squats',
    cue: 'Stand on one leg on the floor, other leg extended forward. Squat as deep as control allows.',
    steps: [
      '1. Stand on one foot and extend your non-working leg straight out in front of you.',
      '2. Reach your arms forward as a counterbalance and sit your hips back and down over 3 seconds.',
      '3. Press through your mid-foot to return to standing while keeping your knee aligned with your toes.'
    ]
  },
  hollow_hold: {
    id: 'hollow_hold',
    name: 'Floor Hollow Body Core Hold',
    category: 'Core',
    animType: 'hollow_hold',
    next: 'Lying Floor Leg Raises',
    cue: 'Lie on your back on the floor. Glue lower spine to the ground and lift shoulders & legs.',
    steps: [
      '1. Lie flat on your back and tuck your tailbone so your lower back presses firmly into the floor.',
      '2. Lift your head, shoulders, and straight legs ~15cm off the floor.',
      '3. Hold completely still for the target seconds without letting your lower back arch.'
    ]
  },
  floor_leg_raise: {
    id: 'floor_leg_raise',
    name: 'Lying Floor Leg Raises & Reverse Crunch (No Bar)',
    category: 'Core',
    animType: 'floor_leg_raise',
    next: 'Floor V-Up Compression',
    cue: 'Lie flat on your back on the floor. Raise straight legs to 90° and curl hips off the ground.',
    steps: [
      '1. Lie flat on your back on the floor with palms pressed into the ground beside your hips.',
      '2. Keeping legs straight and together, raise them up to 90° and curl your tailbone 5cm off the floor at the top.',
      '3. Lower your legs slowly over 3 seconds until heels hover 2cm above the floor—never let your lower back arch.'
    ]
  },
  floor_v_up: {
    id: 'floor_v_up',
    name: 'Floor V-Ups / Seated L-Sit Lifts (No Bar)',
    category: 'Core',
    animType: 'floor_v_up',
    next: 'Full Floor L-Sit Hold',
    cue: 'Fold torso and straight legs up simultaneously on the floor to touch your toes.',
    steps: [
      '1. Lie flat on the floor with arms extended overhead and legs straight.',
      '2. Explosively crunch your torso and straight legs up at the same time so your body forms a "V" and hands touch shins/toes.',
      '3. Control the descent back to a hollow position without dropping your feet to the floor.'
    ]
  }
};

// Returns 100% Zero-Equipment Exercises for All Levels
const getExercisePool = (level) => {
  const push = {
    beginner: [EXERCISE_LIBRARY.knee_pushup, EXERCISE_LIBRARY.pike_pushup, EXERCISE_LIBRARY.diamond_pushup],
    intermediate: [EXERCISE_LIBRARY.tempo_pushup, EXERCISE_LIBRARY.pike_pushup, EXERCISE_LIBRARY.diamond_pushup],
    advanced: [EXERCISE_LIBRARY.archer_pushup, EXERCISE_LIBRARY.pike_pushup, EXERCISE_LIBRARY.diamond_pushup]
  };
  const pull = {
    beginner: [EXERCISE_LIBRARY.prone_cobra, EXERCISE_LIBRARY.reverse_snow_angel],
    intermediate: [EXERCISE_LIBRARY.sliding_floor_pulldown, EXERCISE_LIBRARY.prone_cobra],
    advanced: [EXERCISE_LIBRARY.sliding_floor_pulldown, EXERCISE_LIBRARY.reverse_snow_angel]
  };
  const legs = {
    beginner: [EXERCISE_LIBRARY.reverse_lunge, EXERCISE_LIBRARY.glute_bridge],
    intermediate: [EXERCISE_LIBRARY.reverse_lunge, EXERCISE_LIBRARY.pistol_squat],
    advanced: [EXERCISE_LIBRARY.pistol_squat, EXERCISE_LIBRARY.glute_bridge]
  };
  const core = {
    beginner: [EXERCISE_LIBRARY.hollow_hold],
    intermediate: [EXERCISE_LIBRARY.floor_leg_raise],
    advanced: [EXERCISE_LIBRARY.floor_v_up]
  };
  return { push: push[level], pull: pull[level], legs: legs[level], core: core[level], run: EXERCISE_LIBRARY.run_zone2 };
};

const COMMON_FOODS = [
  { name: 'Chicken Breast (cooked, 100g)', calories: 165, protein: 31 },
  { name: 'Cooked Rice (100g)', calories: 130, protein: 2.7 },
  { name: 'Rolled Oats / Haferflocken (50g)', calories: 190, protein: 6.5 },
  { name: 'Whole Eggs (2 large)', calories: 144, protein: 12.6 },
  { name: 'Low-Fat Quark / Skyr (250g)', calories: 160, protein: 28 },
  { name: 'Banana (1 medium)', calories: 105, protein: 1.3 },
  { name: 'Wholegrain Bread (1 slice)', calories: 85, protein: 4 },
  { name: 'Olive Oil (1 tbsp / 10g)', calories: 88, protein: 0 },
  { name: 'Whey Protein Shake (1 scoop)', calories: 120, protein: 24 },
  { name: 'Döner Kebab (1 whole)', calories: 650, protein: 35 },
  { name: 'Cooked Pasta (150g)', calories: 220, protein: 8 }
];
