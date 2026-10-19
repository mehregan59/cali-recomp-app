const { useState, useEffect, useMemo, useRef } = React;

const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};

// --- FULL-COLOR HUMAN CHARACTER ANIMATOR (UNIQUE MOTION FOR EVERY EXERCISE) ---
function ExerciseVisualCoach({ animType, name, steps }) {
  const canvasRef = useRef(null);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    // Helper to draw a thick, rounded human limb with skin/clothing colors
    const drawLimb = (x1, y1, x2, y2, thickness, color) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const drawHead = (x, y, radius = 9) => {
      // Skin head
      ctx.beginPath();
      ctx.fillStyle = '#f4a261';
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      // Athletic hair/cap
      ctx.beginPath();
      ctx.fillStyle = '#1e293b';
      ctx.arc(x - 1, y - 2, radius, Math.PI, Math.PI * 2.1);
      ctx.fill();
    };

    const render = () => {
      t += 0.045;
      // Smooth 0 -> 1 -> 0 rep cycle
      const rep = (Math.sin(t) + 1) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw studio floor & subtle grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, 118);
      ctx.lineTo(280, 118);
      ctx.stroke();

      const skin = '#f4a261';
      const shirt = '#10b981'; // Emerald athletic top
      const pants = '#38bdf8'; // Sky blue athletic leggings/shorts
      const shoe = '#f8fafc';

      if (animType === 'pushup' || animType === 'diamond_pushup') {
        // FLAT PLANK PUSH-UP: Chest lowers from high plank to grazing the floor
        const drop = rep * 26;
        const shoulderX = 95, shoulderY = 62 + drop;
        const hipX = 165, hipY = 76 + drop * 0.75;
        const footX = 235, footY = 112;
        const handX = animType === 'diamond_pushup' ? 108 : 92;
        const handY = 114;
        const elbowX = animType === 'diamond_pushup' ? 118 : 112 + rep * 10;
        const elbowY = 88 + drop * 0.5;

        // Legs & Shoes
        drawLimb(hipX, hipY, footX, footY, 11, pants);
        drawLimb(footX, footY, footX + 6, footY + 3, 7, shoe);
        // Torso
        drawLimb(shoulderX, shoulderY, hipX, hipY, 15, shirt);
        // Upper Arm & Forearm
        drawLimb(shoulderX, shoulderY, elbowX, elbowY, 9, skin);
        drawLimb(elbowX, elbowY, handX, handY, 8, skin);
        // Head
        drawHead(shoulderX - 16, shoulderY - 4, 9);

      } else if (animType === 'incline_pushup') {
        // INCLINE PUSH-UP: Hands elevated on a box/bench on the left
        ctx.fillStyle = '#475569';
        ctx.fillRect(45, 82, 42, 36); // Bench box
        const drop = rep * 20;
        const shoulderX = 90 - rep * 8, shoulderY = 46 + drop;
        const hipX = 155, hipY = 74 + drop * 0.5;
        const footX = 220, footY = 112;
        const handX = 72, handY = 82;
        const elbowX = 92, elbowY = 68 + drop * 0.4;

        drawLimb(hipX, hipY, footX, footY, 11, pants);
        drawLimb(shoulderX, shoulderY, hipX, hipY, 15, shirt);
        drawLimb(shoulderX, shoulderY, elbowX, elbowY, 9, skin);
        drawLimb(elbowX, elbowY, handX, handY, 8, skin);
        drawHead(shoulderX - 13, shoulderY - 8, 9);

      } else if (animType === 'pike_pushup') {
        // PIKE PUSH-UP: Steep inverted V-shape, hips stay high while head lowers between hands!
        const dip = rep * 24;
        const handX = 95, handY = 114;
        const footX = 215, footY = 114;
        const hipX = 162 - rep * 6, hipY = 38 + dip * 0.25; // Hips stay HIGH in V-shape!
        const shoulderX = 115 - rep * 12, shoulderY = 66 + dip;
        const elbowX = 90 - rep * 6, elbowY = 92 + dip * 0.3;

        // Straight piked legs from floor to high hips
        drawLimb(footX, footY, hipX, hipY, 11, pants);
        // Steep angled torso pointing down toward floor
        drawLimb(hipX, hipY, shoulderX, shoulderY, 15, shirt);
        // Arms bending to lower crown of head toward floor
        drawLimb(shoulderX, shoulderY, elbowX, elbowY, 9, skin);
        drawLimb(elbowX, elbowY, handX, handY, 8, skin);
        drawHead(shoulderX - 10, shoulderY + 11, 9);

      } else if (animType === 'pullup') {
        // STRICT PULL-UP: Overhead bar, body pulls vertically until chin clears bar
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(90, 18); ctx.lineTo(210, 18);
        ctx.stroke();

        const lift = rep * 32;
        const handY = 18;
        const shoulderY = 52 - lift;
        const hipY = 86 - lift;
        const footY = 115 - lift * 0.85;
        const elbowX = 126 - rep * 8, elbowY = 36 - lift * 0.4;

        // Legs hanging straight
        drawLimb(150, hipY, 150, footY, 12, pants);
        // Torso
        drawLimb(150, shoulderY, 150, hipY, 16, shirt);
        // Left & Right Arms pulling to bar
        drawLimb(142, shoulderY, elbowX, elbowY, 8, skin);
        drawLimb(elbowX, elbowY, 130, handY, 7, skin);
        drawLimb(158, shoulderY, 300 - elbowX, elbowY, 8, skin);
        drawLimb(300 - elbowX, elbowY, 170, handY, 7, skin);
        drawHead(150, shoulderY - 14, 9);

      } else if (animType === 'row') {
        // AUSTRALIAN / INVERTED ROW: Hanging under low bar, pulling chest up to bar
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(115, 30); ctx.lineTo(115, 118); // Vertical rack post
        ctx.stroke();

        const pull = rep * 20;
        const handX = 115, handY = 54;
        const footX = 215, footY = 114;
        const shoulderX = 105 + pull * 0.4, shoulderY = 86 - pull;
        const hipX = 160 + pull * 0.2, hipY = 100 - pull * 0.5;
        const elbowX = 95 + pull * 0.2, elbowY = 74 - pull * 0.5;

        drawLimb(hipX, hipY, footX, footY, 11, pants);
        drawLimb(shoulderX, shoulderY, hipX, hipY, 15, shirt);
        drawLimb(shoulderX, shoulderY, elbowX, elbowY, 8, skin);
        drawLimb(elbowX, elbowY, handX, handY, 8, skin);
        drawHead(shoulderX - 12, shoulderY - 8, 9);

      } else if (animType === 'hanging_leg_raise') {
        // HANGING LEG RAISE: Hanging from overhead bar, curling straight legs from vertical to 90° horizontal!
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(90, 14); ctx.lineTo(210, 14);
        ctx.stroke();

        const handX = 140, handY = 14;
        const shoulderX = 140, shoulderY = 42;
        const hipX = 140, hipY = 74;
        // Angle swings from straight down (PI/2) to horizontal (0)
        const angle = (1 - rep) * (Math.PI / 2);
        const legLen = 38;
        const footX = hipX + Math.cos(angle) * legLen;
        const footY = hipY + Math.sin(angle) * legLen;

        // Arms straight up to bar
        drawLimb(shoulderX, shoulderY, handX, handY, 8, skin);
        // Torso
        drawLimb(shoulderX, shoulderY, hipX, hipY, 15, shirt);
        drawHead(shoulderX, shoulderY - 12, 8);
        // Legs raising up to 90 degrees!
        drawLimb(hipX, hipY, footX, footY, 11, pants);
        drawLimb(footX, footY, footX + 5, footY - 3, 7, shoe);

      } else if (animType === 'hollow_hold') {
        // HOLLOW BODY HOLD: Curved banana shape on the floor, shoulders and straight legs lifted
        const rock = Math.sin(t * 1.5) * 4;
        const hipX = 150, hipY = 110;
        const shoulderX = 102, shoulderY = 92 + rock;
        const headX = 88, headY = 82 + rock;
        const footX = 215, footY = 86 - rock;

        drawLimb(shoulderX, shoulderY, hipX, hipY, 14, shirt);
        drawLimb(hipX, hipY, footX, footY, 11, pants);
        drawLimb(shoulderX, shoulderY, 72, 74 + rock, 7, skin); // Arms extended overhead
        drawHead(headX, headY, 8);

      } else if (animType === 'split_squat' || animType === 'squat') {
        // BULGARIAN SPLIT SQUAT / PISTOL SQUAT: Rear foot on bench, deep single-leg knee bend
        ctx.fillStyle = '#475569';
        ctx.fillRect(205, 86, 38, 32); // Rear bench
        const depth = rep * 24;
        const hipX = 145, hipY = 60 + depth;
        const shoulderX = 142, shoulderY = 28 + depth;
        const frontKneeX = 118 - rep * 6, frontKneeY = 86 + depth * 0.3;
        const frontFootX = 120, frontFootY = 114;
        const rearKneeX = 175, rearKneeY = 82 + depth * 0.85;
        const rearFootX = 212, rearFootY = 86;

        // Rear elevated leg
        drawLimb(hipX, hipY, rearKneeX, rearKneeY, 9, '#0284c7');
        drawLimb(rearKneeX, rearKneeY, rearFootX, rearFootY, 8, '#0284c7');
        // Front working leg
        drawLimb(hipX, hipY, frontKneeX, frontKneeY, 11, pants);
        drawLimb(frontKneeX, frontKneeY, frontFootX, frontFootY, 10, pants);
        // Torso & Arms
        drawLimb(shoulderX, shoulderY, hipX, hipY, 15, shirt);
        drawLimb(shoulderX, shoulderY, 122, shoulderY + 18, 8, skin);
        drawHead(shoulderX, shoulderY - 13, 9);

      } else {
        // RUNNING STRIDE ANIMATION
        const stride = Math.sin(t * 2) * 24;
        const bounce = Math.abs(Math.cos(t * 2)) * 6;
        const shoulderX = 152, shoulderY = 38 - bounce;
        const hipX = 145, hipY = 70 - bounce;

        // Back Leg & Front Leg alternating
        drawLimb(hipX, hipY, 145 - stride, 112, 10, '#0284c7');
        drawLimb(hipX, hipY, 145 + stride, 112, 11, pants);
        // Torso
        drawLimb(shoulderX, shoulderY, hipX, hipY, 15, shirt);
        // Pumping Runner Arms
        drawLimb(shoulderX, shoulderY, 150 - stride * 0.7, 62 - bounce, 8, skin);
        drawHead(shoulderX + 3, shoulderY - 13, 9);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [animType]);

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden my-2">
      <div className="relative">
        <canvas ref={canvasRef} width={300} height={128} className="w-full h-32 block" />
        <button
          type="button"
          onClick={() => setShowSteps(!showSteps)}
          className="absolute bottom-2 right-2 text-[10px] font-bold bg-slate-900/90 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg"
        >
          {showSteps ? 'Hide Form Guide ▲' : 'How to Perform ▼'}
        </button>
      </div>
      {showSteps && steps && (
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-1 text-[11px] text-slate-300">
          {steps.map((s, i) => <p key={i}>{s}</p>)}
        </div>
      )}
    </div>
  );
}

// --- MAIN APPLICATION ---
function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');

  const fileInputRef = useRef(null);

  // --- PERSISTENT STATES ---
  const [profile, setProfile] = useState(() => {
    const s = localStorage.getItem('cali_profile_v9');
    return s ? JSON.parse(s) : {
      age: 32, weightKg: 78, heightCm: 178, gender: 'male',
      level: 'intermediate', durationMonths: 2, daysPerWeek: 4,
      equipment: 'pullup_bar', primaryGoal: 'recomp'
    };
  });

  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const s = localStorage.getItem('cali_logs_v9');
    return s ? JSON.parse(s) : {};
  });

  const [biometrics, setBiometrics] = useState(() => {
    const s = localStorage.getItem('cali_bio_v9');
    return s ? JSON.parse(s) : [
      { week: 1, date: new Date().toISOString().slice(0, 10), weightKg: 78, waistCm: 86, maxPullups: 6, maxPushups: 20 }
    ];
  });

  const [foodLogs, setFoodLogs] = useState(() => {
    const s = localStorage.getItem('cali_food_v9');
    return s ? JSON.parse(s) : [];
  });

  const [runLogs, setRunLogs] = useState(() => {
    const s = localStorage.getItem('cali_run_v9');
    return s ? JSON.parse(s) : [];
  });

  // Watch State: Defaults to accurate resting HR (72 BPM) and lets BLE or user update it
  const [watchData, setWatchData] = useState(() => {
    const s = localStorage.getItem('cali_watch_v9');
    return s ? JSON.parse(s) : { connected: false, device: 'Samsung Health / Watch', heartRate: 72, caloriesBurned: 0, steps: 5000 };
  });

  const [searchResults, setSearchResults] = useState([]);
  const [customFoodGrams, setCustomFoodGrams] = useState(100);

  useEffect(() => { localStorage.setItem('cali_profile_v9', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('cali_logs_v9', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('cali_bio_v9', JSON.stringify(biometrics)); }, [biometrics]);
  useEffect(() => { localStorage.setItem('cali_food_v9', JSON.stringify(foodLogs)); }, [foodLogs]);
  useEffect(() => { localStorage.setItem('cali_run_v9', JSON.stringify(runLogs)); }, [runLogs]);
  useEffect(() => { localStorage.setItem('cali_watch_v9', JSON.stringify(watchData)); }, [watchData]);

  // --- REST TIMER ---
  const [timerSec, setTimerSec] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive && timerSec > 0) {
      interval = setInterval(() => setTimerSec((s) => s - 1), 1000);
    } else if (timerSec === 0 && timerActive) {
      setTimerActive(false);
      speakText('Rest finished! Start your next set.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSec]);

  // --- ENGINE COMPUTATIONS ---
  const metrics = useMemo(
    () => calculateMetrics(profile, foodLogs, runLogs, workoutLogs, activeWeek, watchData),
    [profile, foodLogs, runLogs, workoutLogs, activeWeek, watchData]
  );
  const plateauAdvice = useMemo(() => evaluatePlateau(biometrics), [biometrics]);
  const pool = useMemo(() => getExercisePool(profile.level, profile.equipment), [profile.level, profile.equipment]);

  const totalWeeks = profile.durationMonths * 4;
  const isShredPhase = activeWeek > totalWeeks / 2;
  const setsCount = profile.level === 'beginner' ? 3 : 4;
  const targetMin = isShredPhase ? 12 : 8;
  const targetMax = isShredPhase ? 16 : 12;
  const restSec = isShredPhase ? 45 : 70;

  // Base Run Duration scales safely from 10 mins in Week 1 + Food Surplus / Plateau adjustments
  const baseRunMins = activeWeek === 1 ? 10 : activeWeek === 2 ? 12 : activeWeek <= 4 ? 15 : activeWeek <= 6 ? 18 : 22;
  const todayTargetRunMins = baseRunMins + metrics.extraRunMinutesNeeded + (plateauAdvice.extraRunMins || 0);

  const days = useMemo(() => [
    {
      dayNumber: 1, title: 'Run + Push & Core',
      exercises: [
        { ...pool.run, id: 'run_d1', name: `1st Exercise: Zone 2 Run (${todayTargetRunMins} mins)`, sets: 1, min: todayTargetRunMins, max: todayTargetRunMins + 5, unit: 'mins' },
        { ...pool.push[0], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.push[1], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.push[2], sets: setsCount - 1, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.core[0], sets: 3, min: 30, max: 45, unit: 'sec' }
      ]
    },
    {
      dayNumber: 2, title: 'Run + Pull & Core',
      exercises: [
        { ...pool.run, id: 'run_d2', name: `1st Exercise: Fat-Burn Jog (${todayTargetRunMins} mins)`, sets: 1, min: todayTargetRunMins, max: todayTargetRunMins + 5, unit: 'mins' },
        { ...pool.pull[0], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.pull[1], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.core[0], sets: 3, min: 30, max: 45, unit: 'sec' }
      ]
    },
    {
      dayNumber: 3, title: 'Run + Legs & Core',
      exercises: [
        { ...pool.run, id: 'run_d3', name: `1st Exercise: Interval Run (${todayTargetRunMins} mins)`, sets: 1, min: todayTargetRunMins, max: todayTargetRunMins + 5, unit: 'mins' },
        { ...pool.legs[0], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.legs[1], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.core[0], sets: 3, min: 30, max: 45, unit: 'sec' }
      ]
    },
    {
      dayNumber: 4, title: 'Run + Full-Body Supersets',
      exercises: [
        { ...pool.run, id: 'run_d4', name: `1st Exercise: Tempo Run (${todayTargetRunMins} mins)`, sets: 1, min: todayTargetRunMins, max: todayTargetRunMins + 5, unit: 'mins' },
        { ...pool.push[0], id: 'ss_push', name: `A1: ${pool.push[0].name}`, sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.pull[0], id: 'ss_pull', name: `A2: ${pool.pull[0].name}`, sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.legs[0], id: 'ss_leg', name: `B1: ${pool.legs[0].name}`, sets: 3, min: targetMin, max: targetMax, unit: 'reps' }
      ]
    }
  ].slice(0, profile.daysPerWeek), [pool, setsCount, targetMin, targetMax, profile.daysPerWeek, todayTargetRunMins]);

  const activeDay = days[selectedDayIdx] || days[0];
  const logSet = (exId, sIdx, val) => setWorkoutLogs((p) => ({ ...p, [`w${activeWeek}-d${activeDay.dayNumber}-${exId}-s${sIdx}`]: Math.max(0, val) }));
  const getSet = (w, d, exId, sIdx) => workoutLogs[`w${w}-d${d}-${exId}-s${sIdx}`] ?? 0;

  const [newBio, setNewBio] = useState({ weightKg: profile.weightKg, waistCm: 84, maxPullups: 8, maxPushups: 25 });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 select-none">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            🔥 CaliRecomp Pro
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">BMI: {metrics.bmi}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400">❤️ {watchData.heartRate} BPM</span>
          </h1>
          <p className="text-[11px] text-slate-400">
            Eaten: {metrics.todayFoodCalories} / {metrics.baseTargetCalories} kcal • Run Burn: +{metrics.totalRunCalories} kcal
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-xl">
          <span className="font-mono text-xs font-bold w-10 text-center text-emerald-400">
            {Math.floor(timerSec / 60)}:{String(timerSec % 60).padStart(2, '0')}
          </span>
          <button onClick={() => setTimerActive(!timerActive)} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            {timerActive ? '||' : '▶'}
          </button>
          <button onClick={() => { setTimerActive(false); setTimerSec(restSec); }} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">↺</button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        
        {/* DYNAMIC CALORIE-TO-EXERCISE BANNER */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3 text-xs text-slate-300 flex items-center justify-between">
          <span>💡 {metrics.adjustmentMessage}</span>
        </div>

        {/* TAB 1: WORKOUT LOGGER */}
        {activeTab === 'workout' && (
          <>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {Array.from({ length: totalWeeks }).map((_, i) => (
                <button key={i} onClick={() => setActiveWeek(i + 1)} className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border ${activeWeek === i + 1 ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  Wk {i + 1}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {days.map((d, idx) => (
                <button key={d.dayNumber} onClick={() => setSelectedDayIdx(idx)} className={`py-2 rounded-xl text-xs font-bold border ${selectedDayIdx === idx ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  Day {d.dayNumber}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {activeDay.exercises.map((ex) => {
                return (
                  <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md mb-1 inline-block">
                          {ex.category === 'Run' ? '🏃‍♂️ Step 1: Progressive Running Block' : `🏋️ Calisthenics (${ex.category})`}
                        </span>
                        <h3 className="text-sm font-bold text-white">{ex.name}</h3>
                        <p className="text-[11px] text-slate-400">{ex.cue}</p>
                      </div>
                      <button
                        onClick={() => { setTimerSec(ex.category === 'Run' ? ex.min * 60 : restSec); setTimerActive(true); }}
                        className="shrink-0 text-[11px] bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-emerald-400 font-bold"
                      >
                        {ex.category === 'Run' ? `⏱️ Start ${ex.min}m Run` : `Target: ${ex.min}–${ex.max} ${ex.unit}`}
                      </button>
                    </div>

                    {/* UNIQUE ANIMATED HUMAN CHARACTER + STEP-BY-STEP FORM GUIDE */}
                    <ExerciseVisualCoach animType={ex.animType || 'pushup'} name={ex.name} steps={ex.steps} />

                    {/* CLEARLY EXPLAINED SET INPUT BOXES */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <p className="text-[10px] text-slate-400">
                        {ex.category === 'Run'
                          ? `👇 Enter how many minutes you ran below (Target: ${ex.min} mins). Calories burned update automatically:`
                          : `👇 Enter the exact ${ex.unit} you completed in each set (turns green when you hit ${ex.min}+ ${ex.unit}):`}
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: ex.sets }).map((_, sIdx) => {
                          const val = getSet(activeWeek, activeDay.dayNumber, ex.id, sIdx);
                          return (
                            <div key={sIdx} className="flex flex-col">
                              <span className="text-[10px] text-slate-300 font-semibold mb-1 text-center">
                                {ex.category === 'Run' ? 'Minutes Ran' : `Set ${sIdx + 1} (${ex.unit})`}
                              </span>
                              <input
                                type="number"
                                inputMode="numeric"
                                placeholder="0"
                                value={val || ''}
                                onChange={(e) => logSet(ex.id, sIdx, Number(e.target.value))}
                                className={`w-full text-center py-2 rounded-xl text-sm font-bold border outline-none ${
                                  val >= ex.min ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-white'
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* TAB 2: NUTRITION & FOOD SEARCH */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-amber-400 flex justify-between">
                <span>🍏 Daily Calorie & Macro Summary</span>
                <span className="text-white font-mono">{metrics.todayFoodCalories} / {metrics.baseTargetCalories} kcal</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                To lose fat while building muscle, stay near <strong>{metrics.baseTargetCalories} kcal/day</strong> and hit <strong>{metrics.proteinGrams}g protein</strong>. If you eat over target, the app automatically adds minutes to your Run block.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400 block">Maintenance TDEE</span><strong className="text-white">{metrics.tdee} kcal</strong></div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400 block">Exercise Burn</span><strong className="text-sky-400">+{metrics.totalRunCalories} kcal</strong></div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400 block">Protein Eaten</span><strong className="text-emerald-400">{metrics.todayFoodProtein} / {metrics.proteinGrams}g</strong></div>
              </div>
            </div>

            {/* OpenFoodFacts Live Search */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase text-emerald-400">1. Search Supermarket Food (OpenFoodFacts)</h3>
              <p className="text-[11px] text-slate-400">Set your portion size in grams first, then search and tap any food to log its exact calories:</p>
              
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <label className="text-xs text-slate-300 font-semibold">Portion Weight (Grams):</label>
                <input type="number" value={customFoodGrams} onChange={(e) => setCustomFoodGrams(Number(e.target.value))} className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-center text-emerald-400" />
                <span className="text-[10px] text-slate-500">g</span>
              </div>

              <input
                type="text"
                placeholder="Type food name (e.g., Skyr, Haferflocken, Chicken, Rice)..."
                onChange={async (e) => {
                  const q = e.target.value;
                  if (q.length > 2) setSearchResults(await searchOpenFoodFacts(q));
                  else setSearchResults([]);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
              />

              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {searchResults.map((item, idx) => {
                  const kcal = Math.round((item.calories * customFoodGrams) / 100);
                  const prot = Math.round((item.protein * customFoodGrams) / 100);
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setFoodLogs(prev => [{ date: new Date().toISOString().slice(0, 10), name: `${item.name} (${customFoodGrams}g)`, calories: kcal, protein: prot }, ...prev]);
                        setSearchResults([]);
                      }}
                      className="bg-slate-950 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs cursor-pointer"
                    >
                      <span className="font-semibold text-slate-200">{item.name}</span>
                      <span className="text-emerald-400 font-mono shrink-0 ml-2">+{kcal} kcal ({prot}g P)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Common Foods 1-Tap */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h3 className="text-xs font-bold uppercase text-slate-300">2. Quick-Add Everyday Foods (1 Tap)</h3>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_FOODS.map((cf, i) => (
                  <button
                    key={i}
                    onClick={() => setFoodLogs(prev => [{ date: new Date().toISOString().slice(0, 10), name: cf.name, calories: cf.calories, protein: cf.protein }, ...prev])}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs"
                  >
                    <div className="font-bold text-slate-200">{cf.name}</div>
                    <div className="text-[10px] text-emerald-400">+{cf.calories} kcal • {cf.protein}g protein</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROGRESS, WATCH SYNC & BIOMETRICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            {/* Accurate Galaxy Watch Sync Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-emerald-400 flex justify-between">
                <span>⌚ Samsung Galaxy Watch Sync</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Live HR: {watchData.heartRate} BPM
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Pair via Bluetooth GATT below, or adjust the sliders to match your Samsung Health Watch screen at any time (no fake numbers!):
              </p>

              <div className="space-y-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Current Watch Heart Rate (BPM):</span>
                    <strong className="text-rose-400">{watchData.heartRate} BPM</strong>
                  </div>
                  <input type="range" min="45" max="195" value={watchData.heartRate} onChange={(e) => setWatchData({ ...watchData, heartRate: Number(e.target.value) })} className="w-full accent-rose-500" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Watch Steps Today</label>
                    <input type="number" value={watchData.steps} onChange={(e) => setWatchData({ ...watchData, steps: Number(e.target.value) })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-sky-400" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Watch Active Kcal Burned</label>
                    <input type="number" value={watchData.caloriesBurned} onChange={(e) => setWatchData({ ...watchData, caloriesBurned: Number(e.target.value) })} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-400" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => connectRealWatchBLE(
                  (liveBpm, devName) => setWatchData(w => ({ ...w, connected: true, device: devName, heartRate: liveBpm })),
                  (msg) => setSyncStatus(msg)
                )}
                className="w-full py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl"
              >
                🔗 Connect Live Bluetooth GATT Heart Rate
              </button>
              {syncStatus && <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30">{syncStatus}</p>}
            </div>

            {/* Clearly Labeled Weekly Body Check-In */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const entry = { week: activeWeek, date: new Date().toISOString().slice(0, 10), ...newBio };
                setBiometrics((prev) => [...prev.filter((b) => b.week !== activeWeek), entry].sort((a, b) => a.week - b.week));
                setProfile(p => ({ ...p, weightKg: newBio.weightKg }));
              }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
            >
              <h2 className="text-xs font-bold uppercase text-emerald-400">Log Week {activeWeek} Body & Strength Check-In</h2>
              <p className="text-[11px] text-slate-400">Measure once a week in the morning. Used by the Plateau Engine to adjust your workouts:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block">Body Weight (kg)</label>
                  <span className="text-[10px] text-slate-500 block mb-1">Morning weight before food</span>
                  <input type="number" step="0.1" value={newBio.weightKg} onChange={(e) => setNewBio({ ...newBio, weightKg: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block">Waist Size (cm)</label>
                  <span className="text-[10px] text-slate-500 block mb-1">Measured around belly button</span>
                  <input type="number" step="0.5" value={newBio.waistCm} onChange={(e) => setNewBio({ ...newBio, waistCm: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block">Max Pull-ups (Reps)</label>
                  <span className="text-[10px] text-slate-500 block mb-1">Unbroken strict reps in 1 set</span>
                  <input type="number" value={newBio.maxPullups} onChange={(e) => setNewBio({ ...newBio, maxPullups: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block">Max Push-ups (Reps)</label>
                  <span className="text-[10px] text-slate-500 block mb-1">Unbroken strict reps in 1 set</span>
                  <input type="number" value={newBio.maxPushups} onChange={(e) => setNewBio({ ...newBio, maxPushups: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl">Save Week {activeWeek} Check-In</button>
            </form>
          </div>
        )}

        {/* TAB 4: SETUP & SETTINGS */}
        {activeTab === 'setup' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-sm font-bold text-white flex justify-between">
                <span>🧮 BMI & BMR Biometrics</span>
                <span className="text-xs text-emerald-400 font-mono">BMI: {metrics.bmi} ({metrics.bmiCategory})</span>
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <div><label className="text-[10px] text-slate-400 block mb-1">Age (Years)</label><input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" /></div>
                <div><label className="text-[10px] text-slate-400 block mb-1">Biological Sex</label><select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold"><option value="male">Male</option><option value="female">Female</option></select></div>
                <div><label className="text-[10px] text-slate-400 block mb-1">Weight (kg)</label><input type="number" step="0.5" value={profile.weightKg} onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" /></div>
                <div><label className="text-[10px] text-slate-400 block mb-1">Height (cm)</label><input type="number" value={profile.heightCm} onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" /></div>
              </div>
            </div>
          </div>
        )}

      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 bg-slate-900/95 border-t border-slate-800 px-2 py-2">
        <div className="max-w-lg mx-auto grid grid-cols-4 gap-1">
          {[
            { id: 'workout', label: '⚡ Workout' },
            { id: 'nutrition', label: '🍏 Nutrition' },
            { id: 'analytics', label: '📈 Progress' },
            { id: 'setup', label: '⚙️ Setup' }
          ].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`py-2 rounded-xl text-xs font-bold ${activeTab === t.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
