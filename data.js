// --- EXERCISE DATABASE WITH UNIQUE MOTION KEYFRAMES & STEP-BY-STEP GUIDES ---

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
      '3. Maintain a conversational pace where you can speak full sentences.'
    ]
  },
  incline_pushup: {
    id: 'incline_pushup',
    name: 'Incline Push-ups',
    category: 'Push',
    animType: 'incline_pushup',
    next: 'Tempo Push-ups',
    cue: 'Hands elevated on a bench, box, or sturdy table. Body in one straight line.',
    steps: [
      '1. Place hands slightly wider than shoulder-width on an elevated surface.',
      '2. Lower your chest slowly (3 seconds) toward the edge with elbows at 45°.',
      '3. Press explosively back to full arm lockout while squeezing your core.'
    ]
  },
  tempo_pushup: {
    id: 'tempo_pushup',
    name: 'Tempo Push-ups (3-1-1)',
    category: 'Push',
    animType: 'pushup',
    next: 'Archer Push-ups',
    cue: '3 seconds down, 1 second pause just above floor, 1 second explosive push.',
    steps: [
      '1. High plank position: hands under shoulders, glutes and abs locked tight.',
      '2. Lower your whole body as one rigid unit over 3 full seconds until chest grazes floor.',
      '3. Pause 1 second at the bottom without resting on the ground, then push up.'
    ]
  },
  pike_pushup: {
    id: 'pike_pushup',
    name: 'Pike Push-ups (Shoulder Focus)',
    category: 'Push',
    animType: 'pike_pushup',
    next: 'Elevated Pike / Wall HSPU',
    cue: 'Hips high in an inverted V-shape. Lower the top of your head forward between hands.',
    steps: [
      '1. Walk feet forward so your body forms a steep upside-down "V" (hips high).',
      '2. Bend elbows and lower the crown of your head forward in front of your hands (forming a triangle).',
      '3. Press your head and torso back up and slightly backward toward your feet.'
    ]
  },
  diamond_pushup: {
    id: 'diamond_pushup',
    name: 'Diamond / Close-Grip Push-ups',
    category: 'Push',
    animType: 'diamond_pushup',
    next: 'Ring / Bar Dips',
    cue: 'Index fingers and thumbs form a diamond under your chest. Triceps overload.',
    steps: [
      '1. Bring hands together directly beneath your sternum so thumbs and index fingers touch.',
      '2. Keep elbows tucked close to your ribs as you lower your chest to your hands.',
      '3. Drive up to full elbow extension to maximally contract the triceps.'
    ]
  },
  archer_pushup: {
    id: 'archer_pushup',
    name: 'Archer Push-ups',
    category: 'Push',
    animType: 'pushup',
    next: 'One-Arm Push-up Prog.',
    cue: 'Wide hands. Shift 80% of your bodyweight onto one working arm; other arm stays straight.',
    steps: [
      '1. Place hands twice as wide as shoulder-width, fingers angled outward.',
      '2. Lower your chest directly over your left hand while keeping your right arm completely straight.',
      '3. Push back to center and repeat on the right side.'
    ]
  },
  australian_row: {
    id: 'australian_row',
    name: 'Australian Bodyweight Rows',
    category: 'Pull',
    animType: 'row',
    next: 'Strict Pull-ups',
    cue: 'Hang underneath a low bar, rings, or sturdy table. Pull chest to the bar.',
    steps: [
      '1. Grip a waist-high bar with arms straight, heels on the floor, and body straight.',
      '2. Pull your shoulder blades together and drive elbows back until your chest touches the bar.',
      '3. Pause 1 second squeezing your upper back, then lower slowly over 3 seconds.'
    ]
  },
  strict_pullup: {
    id: 'strict_pullup',
    name: 'Strict Pull-ups (Overhand)',
    category: 'Pull',
    animType: 'pullup',
    next: 'Chest-to-Bar / L-Sit Pull-ups',
    cue: 'Start from a full dead hang. Pull chin cleanly over the bar without kicking legs.',
    steps: [
      '1. Grip the bar slightly wider than shoulders in a full dead hang (arms straight).',
      '2. Depress your shoulder blades down away from your ears, then drive elbows toward your ribs.',
      '3. Pull until your chin clears the bar, then lower all the way down over 3 seconds.'
    ]
  },
  towel_row: {
    id: 'towel_row',
    name: 'Doorframe / Towel Rows (No Bar)',
    category: 'Pull',
    animType: 'row',
    next: 'Single-Arm Towel Rows',
    cue: 'Loop a strong towel around a doorframe/post, lean back, and row chest to hands.',
    steps: [
      '1. Anchor a towel around a solid handle/pillar, feet close to the base, leaning back.',
      '2. Keep body straight and pull yourself forward using your lats and biceps.',
      '3. Control the lowering phase for 3 full seconds.'
    ]
  },
  split_squat: {
    id: 'split_squat',
    name: 'Bulgarian Split Squats',
    category: 'Legs',
    animType: 'split_squat',
    next: 'Assisted Pistol Squats',
    cue: 'Rear foot elevated on a chair/bench. Lower back knee toward the floor.',
    steps: [
      '1. Stand 2 feet in front of a chair/bench and rest the top of your back foot on it.',
      '2. Lower your hips straight down over 3 seconds until your front thigh is parallel to the floor.',
      '3. Drive through your front heel to stand back up. Complete all reps on Left, then Right.'
    ]
  },
  nordic_curl: {
    id: 'nordic_curl',
    name: 'Hamstring Bridges / Nordic Eccentrics',
    category: 'Legs',
    animType: 'squat',
    next: 'Full Nordic Curls',
    cue: 'Drive heels into the ground or anchor feet under a couch to isolate hamstrings.',
    steps: [
      '1. Anchor heels firmly and keep hips extended in a straight line with your torso.',
      '2. Slowly lower your torso (or hips in single-leg bridge) over 4 seconds fighting gravity.',
      '3. Contract hamstrings and glutes hard to return to the top.'
    ]
  },
  pistol_squat: {
    id: 'pistol_squat',
    name: 'Single-Leg Assisted Pistol Squats',
    category: 'Legs',
    animType: 'squat',
    next: 'Strict Unassisted Pistol Squat',
    cue: 'Extend one leg straight in front while squatting deep on the standing leg.',
    steps: [
      '1. Stand on one leg, extending your non-working leg straight out in front of you.',
      '2. Lightly touch a doorframe/pole for balance as you sit all the way down (hamstring to calf).',
      '3. Drive through your whole foot to stand back up without collapsing the knee inward.'
    ]
  },
  hollow_hold: {
    id: 'hollow_hold',
    name: 'Hollow Body Core Hold',
    category: 'Core',
    animType: 'hollow_hold',
    next: 'Hanging Leg Raises',
    cue: 'Lie on your back, press lower spine flat into the floor, lift shoulders and legs.',
    steps: [
      '1. Lie flat on your back and tuck your pelvis so there is ZERO gap under your lower back.',
      '2. Lift your shoulder blades and extended legs ~20cm off the floor in a banana shape.',
      '3. Hold rock-solid tension while breathing shallowly for the target seconds.'
    ]
  },
  hanging_leg_raise: {
    id: 'hanging_leg_raise',
    name: 'Hanging Knee / Leg Raises',
    category: 'Core',
    animType: 'hanging_leg_raise',
    next: 'Strict Toes-to-Bar',
    cue: 'Hang from a bar (or lie flat on floor) and curl your legs & pelvis upward to 90°.',
    steps: [
      '1. Hang from the pull-up bar with active shoulders (do not sag into your joints).',
      '2. Without swinging, exhale and raise your legs until parallel to the ground (or higher), curling your tailbone up.',
      '3. Lower your legs slowly over 3 seconds so you do not swing back and forth.'
    ]
  }
};

const getExercisePool = (level, eq) => {
  const push = {
    beginner: [EXERCISE_LIBRARY.incline_pushup, EXERCISE_LIBRARY.pike_pushup, EXERCISE_LIBRARY.diamond_pushup],
    intermediate: [EXERCISE_LIBRARY.tempo_pushup, EXERCISE_LIBRARY.pike_pushup, EXERCISE_LIBRARY.diamond_pushup],
    advanced: [EXERCISE_LIBRARY.archer_pushup, EXERCISE_LIBRARY.pike_pushup, EXERCISE_LIBRARY.diamond_pushup]
  };
  const pull = {
    beginner: eq === 'none' ? [EXERCISE_LIBRARY.towel_row, EXERCISE_LIBRARY.australian_row] : [EXERCISE_LIBRARY.australian_row, EXERCISE_LIBRARY.strict_pullup],
    intermediate: eq === 'none' ? [EXERCISE_LIBRARY.towel_row, EXERCISE_LIBRARY.australian_row] : [EXERCISE_LIBRARY.strict_pullup, EXERCISE_LIBRARY.australian_row],
    advanced: eq === 'none' ? [EXERCISE_LIBRARY.towel_row, EXERCISE_LIBRARY.australian_row] : [EXERCISE_LIBRARY.strict_pullup, EXERCISE_LIBRARY.australian_row]
  };
  const legs = {
    beginner: [EXERCISE_LIBRARY.split_squat, EXERCISE_LIBRARY.nordic_curl],
    intermediate: [EXERCISE_LIBRARY.split_squat, EXERCISE_LIBRARY.pistol_squat],
    advanced: [EXERCISE_LIBRARY.pistol_squat, EXERCISE_LIBRARY.split_squat]
  };
  const core = {
    beginner: [EXERCISE_LIBRARY.hollow_hold],
    intermediate: [EXERCISE_LIBRARY.hanging_leg_raise],
    advanced: [EXERCISE_LIBRARY.hanging_leg_raise]
  };
  return { push: push[level], pull: pull[level], legs: legs[level], core: core[level], run: EXERCISE_LIBRARY.run_zone2 };
};

const COMMON_FOODS = [
  { name: 'Chicken Breast (cooked, 100g)', calories: 165, protein: 31 },
  { name: 'Cooked Rice (100g)', calories: 130, protein: 2.7 },
  { name: 'Rolled Oats (50g)', calories: 190, protein: 6.5 },
  { name: 'Whole Eggs (2 large)', calories: 144, protein: 12.6 },
  { name: 'Low-Fat Quark / Skyr (250g)', calories: 160, protein: 28 },
  { name: 'Banana (1 medium)', calories: 105, protein: 1.3 },
  { name: 'Wholegrain Bread (1 slice)', calories: 85, protein: 4 },
  { name: 'Olive Oil (1 tbsp / 10g)', calories: 88, protein: 0 },
  { name: 'Whey Protein Shake (1 scoop)', calories: 120, protein: 24 },
  { name: 'Döner Kebab (1 whole)', calories: 650, protein: 35 },
  { name: 'Cooked Pasta (150g)', calories: 220, protein: 8 }
];
