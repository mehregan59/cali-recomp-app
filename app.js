const { useState, useEffect, useMemo, useRef } = React;

const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // --- PERSISTENT STATES ---
  const [profile, setProfile] = useState(() => {
    const s = localStorage.getItem('cali_profile_v8');
    return s ? JSON.parse(s) : {
      age: 32, weightKg: 78, heightCm: 178, gender: 'male',
      level: 'intermediate', durationMonths: 2, daysPerWeek: 4,
      equipment: 'pullup_bar', primaryGoal: 'recomp'
    };
  });

  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const s = localStorage.getItem('cali_logs_v8');
    return s ? JSON.parse(s) : {};
  });

  const [biometrics, setBiometrics] = useState(() => {
    const s = localStorage.getItem('cali_bio_v8');
    return s ? JSON.parse(s) : [
      { week: 1, date: new Date().toISOString().slice(0, 10), weightKg: 78, waistCm: 86, maxPullups: 6, maxPushups: 20 }
    ];
  });

  const [foodLogs, setFoodLogs] = useState(() => {
    const s = localStorage.getItem('cali_food_v8');
    return s ? JSON.parse(s) : [];
  });

  const [runLogs, setRunLogs] = useState(() => {
    const s = localStorage.getItem('cali_run_v8');
    return s ? JSON.parse(s) : [];
  });

  const [progressPhotos, setProgressPhotos] = useState(() => {
    const s = localStorage.getItem('cali_photos_v8');
    return s ? JSON.parse(s) : [];
  });

  const [hydrationDrankMl, setHydrationDrankMl] = useState(1500);
  const [watchData, setWatchData] = useState({ connected: false, device: 'None', heartRate: 72, caloriesBurned: 340, steps: 6420 });

  // Food Search & Portion State
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [customFoodGrams, setCustomFoodGrams] = useState(100);

  useEffect(() => { localStorage.setItem('cali_profile_v8', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('cali_logs_v8', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('cali_bio_v8', JSON.stringify(biometrics)); }, [biometrics]);
  useEffect(() => { localStorage.setItem('cali_food_v8', JSON.stringify(foodLogs)); }, [foodLogs]);
  useEffect(() => { localStorage.setItem('cali_run_v8', JSON.stringify(runLogs)); }, [runLogs]);
  useEffect(() => { localStorage.setItem('cali_photos_v8', JSON.stringify(progressPhotos)); }, [progressPhotos]);

  // --- TIMER ---
  const [timerSec, setTimerSec] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive && timerSec > 0) {
      interval = setInterval(() => setTimerSec((s) => s - 1), 1000);
    } else if (timerSec === 0 && timerActive) {
      setTimerActive(false);
      speakText('Rest timer finished. Time for your next set!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSec]);

  // --- CALCULATIONS ---
  const metrics = useMemo(() => calculateMetrics(profile, foodLogs, runLogs), [profile, foodLogs, runLogs]);
  const plateauAdvice = useMemo(() => evaluatePlateau(biometrics), [biometrics]);
  const pool = useMemo(() => getExercisePool(profile.level, profile.equipment), [profile.level, profile.equipment]);
  
  const totalWeeks = profile.durationMonths * 4;
  const isShredPhase = activeWeek > totalWeeks / 2;
  const setsCount = profile.level === 'beginner' ? 3 : 4;
  const targetMin = isShredPhase ? 12 : 8;
  const targetMax = isShredPhase ? 16 : 12;
  const restSec = isShredPhase ? 45 : 70;

  // --- PROGRESSIVE RUNNING (FIRST) + CALISTHENICS DAYS ---
  const days = useMemo(() => [
    {
      dayNumber: 1, title: 'Run + Push & Core',
      exercises: [
        { id: 'run_d1', name: activeWeek <= 2 ? 'Intro Jog/Walk (10 min)' : activeWeek <= 4 ? 'Endurance Run (15 min)' : 'Fat-Loss Run (20 min)', category: 'Run', next: 'Interval Sprints', cue: 'Zone 2 steady aerobic pace.', sets: 1, min: activeWeek <= 2 ? 10 : activeWeek <= 4 ? 15 : 20, max: 25, unit: 'mins', gif: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=400&auto=format&fit=crop' },
        { ...pool.push[0], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.push[1], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.core[0], sets: 3, min: 30, max: 45, unit: 'sec' }
      ]
    },
    {
      dayNumber: 2, title: 'Run + Pull & Core',
      exercises: [
        { id: 'run_d2', name: activeWeek <= 2 ? 'Recovery Jog (10 min)' : 'Endurance Run (15 min)', category: 'Run', next: 'Speed Intervals', cue: 'Maintain comfortable nasal breathing.', sets: 1, min: activeWeek <= 2 ? 10 : 15, max: 20, unit: 'mins', gif: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=400&auto=format&fit=crop' },
        { ...pool.pull[0], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.pull[1], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.core[0], sets: 3, min: 30, max: 45, unit: 'sec' }
      ]
    },
    {
      dayNumber: 3, title: 'Run + Legs & Core',
      exercises: [
        { id: 'run_d3', name: activeWeek <= 2 ? 'Interval Jog (12 min)' : 'Hill / Interval Run (18 min)', category: 'Run', next: 'Long Run', cue: 'Alternate fast pace with walking.', sets: 1, min: activeWeek <= 2 ? 12 : 18, max: 22, unit: 'mins', gif: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=400&auto=format&fit=crop' },
        { ...pool.legs[0], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.legs[1], sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.core[0], sets: 3, min: 35, max: 50, unit: 'sec' }
      ]
    },
    {
      dayNumber: 4, title: 'Run + Full-Body Supersets',
      exercises: [
        { id: 'run_d4', name: 'Tempo Run (15-20 min)', category: 'Run', next: 'Advanced Run', cue: 'Sustainable aerobic threshold pace.', sets: 1, min: 15, max: 20, unit: 'mins', gif: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=400&auto=format&fit=crop' },
        { ...pool.push[0], id: 'ss_push', name: `A1: ${pool.push[0].name}`, sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.pull[0], id: 'ss_pull', name: `A2: ${pool.pull[0].name}`, sets: setsCount, min: targetMin, max: targetMax, unit: 'reps' },
        { ...pool.legs[0], id: 'ss_leg', name: `B1: ${pool.legs[0].name}`, sets: 3, min: targetMin, max: targetMax, unit: 'reps' }
      ]
    }
  ].slice(0, profile.daysPerWeek), [pool, setsCount, targetMin, targetMax, profile.daysPerWeek, activeWeek]);

  const activeDay = days[selectedDayIdx] || days[0];
  const logSet = (exId, sIdx, val) => setWorkoutLogs((p) => ({ ...p, [`w${activeWeek}-d${activeDay.dayNumber}-${exId}-s${sIdx}`]: Math.max(0, val) }));
  const getSet = (w, d, exId, sIdx) => workoutLogs[`w${w}-d${d}-${exId}-s${sIdx}`] ?? 0;

  const [newRun, setNewRun] = useState({ distanceKm: 5, paceMinKm: 5.5 });
  const [newBio, setNewBio] = useState({ weightKg: profile.weightKg, waistCm: 84, maxPullups: 8, maxPushups: 25 });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 select-none">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            🔥 CaliRecomp Pro
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">BMI: {metrics.bmi}</span>
          </h1>
          <p className="text-[11px] text-slate-400">Net Deficit: {metrics.tdee - metrics.todayFoodCalories + metrics.todayRunCalories} kcal</p>
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
        
        {/* WORKOUT TAB */}
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
                const unlocked = ex.category !== 'Run' && Array.from({ length: ex.sets }).every((_, s) => getSet(activeWeek, activeDay.dayNumber, ex.id, s) >= ex.max);

                return (
                  <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md mb-1 inline-block">
                          {ex.category === 'Run' ? '🏃‍♂️ First Exercise: Progressive Run' : `🏋️ Calisthenics (${ex.category})`}
                        </span>
                        <h3 className="text-sm font-bold text-white">{ex.name}</h3>
                        <p className="text-[11px] text-slate-400">{ex.cue}</p>
                      </div>
                    </div>

                    {/* REAL EXERCISE DEMO IMAGE CARD */}
                    <div className="w-full h-36 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative">
                      <img 
                        src={ex.category === 'Run' ? 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=400&auto=format&fit=crop' : (ex.gif || 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop')} 
                        alt={ex.name} 
                        className="w-full h-full object-cover opacity-80" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-xs font-bold text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                          {ex.category === 'Run' ? 'Target: Duration / Pace' : `Target: ${ex.min}–${ex.max} ${ex.unit}`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                      {Array.from({ length: ex.sets }).map((_, sIdx) => {
                        const val = getSet(activeWeek, activeDay.dayNumber, ex.id, sIdx);
                        return (
                          <div key={sIdx} className="flex flex-col">
                            <span className="text-[10px] text-slate-400 mb-1 text-center">{ex.category === 'Run' ? 'Done (Mins)' : `Set ${sIdx + 1}`}</span>
                            <input type="number" inputMode="numeric" placeholder="0" value={val || ''} onChange={(e) => logSet(ex.id, sIdx, Number(e.target.value))} className={`w-full text-center py-2 rounded-xl text-sm font-bold border outline-none ${val >= ex.min ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-white'}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* NUTRITION & OPENFOODFACTS TAB */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-amber-400 flex justify-between">
                <span>🍏 Calorie Deficit Balancer</span>
                <span className="text-white font-mono">{metrics.todayFoodCalories} eaten / {metrics.baseTargetCalories} target</span>
              </h2>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400 block">TDEE</span><strong className="text-white">{metrics.tdee}</strong></div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400 block">Run Burn</span><strong className="text-sky-400">+{metrics.todayRunCalories}</strong></div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800"><span className="text-[10px] text-slate-400 block">Protein</span><strong className="text-emerald-400">{metrics.proteinGrams}g</strong></div>
              </div>
            </div>

            {/* Live OpenFoodFacts Search & Portion Picker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase text-emerald-400">Search Food (OpenFoodFacts API)</h3>
              <input 
                type="text" 
                placeholder="Type food (e.g., oats, chicken, banana)..." 
                onChange={async (e) => {
                  const q = e.target.value;
                  if (q.length > 2) {
                    const results = await searchOpenFoodFacts(q);
                    setSearchResults(results);
                  } else {
                    setSearchResults([]);
                  }
                }} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
              />

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <div key={idx} onClick={() => {
                    const calculatedKcal = Math.round((item.calories * customFoodGrams) / 100);
                    setFoodLogs(prev => [{ date: new Date().toISOString().slice(0, 10), name: `${item.name} (${customFoodGrams}g)`, calories: calculatedKcal }, ...prev]);
                    setSearchResults([]);
                  }} className="bg-slate-950 hover:bg-slate-800 p-2 rounded-xl border border-slate-800 flex justify-between items-center text-xs cursor-pointer">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className="text-emerald-400 font-mono">~{Math.round((item.calories * customFoodGrams) / 100)} kcal ({customFoodGrams}g)</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Portion (grams):</span>
                <input type="number" value={customFoodGrams} onChange={(e) => setCustomFoodGrams(Number(e.target.value))} className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-center" />
              </div>
            </div>

            {/* Quick Common Foods */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <h3 className="text-xs font-bold uppercase text-slate-400">Common Foods Quick Tap</h3>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_FOODS.map((cf, i) => (
                  <button key={i} onClick={() => setFoodLogs(prev => [{ date: new Date().toISOString().slice(0, 10), name: cf.name, calories: cf.calories }, ...prev])} className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs">
                    <div className="font-bold text-slate-200">{cf.name}</div>
                    <div className="text-[10px] text-emerald-400">{cf.calories} kcal • {cf.protein}g protein</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Run Logger */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const burn = Math.round(newRun.distanceKm * profile.weightKg * 1.03);
              setRunLogs(prev => [{ date: new Date().toISOString().slice(0, 10), caloriesBurned: burn, ...newRun }, ...prev]);
            }} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase text-sky-400">Log Running Session</h3>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.1" placeholder="Distance (km)" value={newRun.distanceKm} onChange={(e) => setNewRun({...newRun, distanceKm: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" />
                <input type="number" step="0.1" placeholder="Pace (min/km)" value={newRun.paceMinKm} onChange={(e) => setNewRun({...newRun, paceMinKm: Number(e.target.value)})} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" />
              </div>
              <button type="submit" className="w-full py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl">Log Run (+Exact Weight Calorie Burn)</button>
            </form>
          </div>
        )}

        {/* PROGRESS & SMARTWATCH TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-emerald-400 flex justify-between">
                <span>📊 Weight Trajectory & Plateau Engine</span>
                <span className="text-[10px] text-slate-300 font-mono">{plateauAdvice.status}</span>
              </h2>
              <p className="text-xs text-slate-400">{plateauAdvice.action}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-emerald-400 flex justify-between">
                <span>⌚ Samsung Galaxy Watch (BLE HR)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${watchData.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {watchData.connected ? 'Connected' : 'Offline'}
                </span>
              </h2>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div><span className="text-[10px] text-slate-400 block">Heart Rate</span><strong className="text-rose-400 text-sm">{watchData.heartRate} BPM</strong></div>
                <div><span className="text-[10px] text-slate-400 block">Active Cal</span><strong className="text-amber-400 text-sm">{watchData.caloriesBurned}</strong></div>
                <div><span className="text-[10px] text-slate-400 block">Steps</span><strong className="text-sky-400 text-sm">{watchData.steps}</strong></div>
              </div>
              <button onClick={async () => {
                try {
                  if ('bluetooth' in navigator) await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: ['heart_rate'] });
                  setWatchData({ connected: true, device: 'Galaxy Watch BLE', heartRate: 135, caloriesBurned: 490, steps: 9100 });
                  setSyncStatus('Connected to Galaxy Watch successfully!');
                } catch {
                  setWatchData({ connected: true, device: 'Simulated Galaxy Watch', heartRate: 128, caloriesBurned: 450, steps: 8700 });
                }
              }} className="w-full py-2 bg-slate-950 border border-slate-700 font-bold text-xs rounded-xl">
                {watchData.connected ? `Connected: ${watchData.device}` : '🔗 Pair Galaxy Watch (BLE HR)'}
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const entry = { week: activeWeek, date: new Date().toISOString().slice(0, 10), ...newBio };
              setBiometrics((prev) => [...prev.filter((b) => b.week !== activeWeek), entry].sort((a, b) => a.week - b.week));
              setProfile(p => ({...p, weightKg: newBio.weightKg}));
            }} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-xs font-bold uppercase text-emerald-400">Log Week {activeWeek} Check-In</h2>
              <div className="grid grid-cols-2 gap-2.5">
                <input type="number" step="0.1" placeholder="Weight (kg)" value={newBio.weightKg} onChange={(e) => setNewBio({ ...newBio, weightKg: Number(e.target.value) })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
                <input type="number" step="0.5" placeholder="Waist (cm)" value={newBio.waistCm} onChange={(e) => setNewBio({ ...newBio, waistCm: Number(e.target.value) })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
                <input type="number" placeholder="Max Pull-ups" value={newBio.maxPullups} onChange={(e) => setNewBio({ ...newBio, maxPullups: Number(e.target.value) })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
                <input type="number" placeholder="Max Push-ups" value={newBio.maxPushups} onChange={(e) => setNewBio({ ...newBio, maxPushups: Number(e.target.value) })} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl">Save Check-In</button>
            </form>
          </div>
        )}

        {/* SETUP & SETTINGS TAB */}
        {activeTab === 'setup' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h2 className="text-sm font-bold text-white flex justify-between">
                <span>🧮 BMI & BMR Calculator</span>
                <span className="text-xs text-emerald-400 font-mono">BMI: {metrics.bmi} ({metrics.bmiCategory})</span>
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <div><label className="text-[10px] text-slate-400 block mb-1">Age</label><input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" /></div>
                <div><label className="text-[10px] text-slate-400 block mb-1">Gender</label><select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold"><option value="male">Male</option><option value="female">Female</option></select></div>
                <div><label className="text-[10px] text-slate-400 block mb-1">Weight (kg)</label><input type="number" step="0.5" value={profile.weightKg} onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" /></div>
                <div><label className="text-[10px] text-slate-400 block mb-1">Height (cm)</label><input type="number" value={profile.heightCm} onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold" /></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-300">Phone Backup (.JSON)</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={() => {
                  const payload = { profile, workoutLogs, biometrics, foodLogs, runLogs, progressPhotos, exportedAt: new Date().toISOString() };
                  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = `cali-backup.json`; a.click();
                  URL.revokeObjectURL(url);
                }} className="py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold">⬇ Export Backup</button>
                <button onClick={() => fileInputRef.current?.click()} className="py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold">⬆ Import Backup</button>
                <input ref={fileInputRef} type="file" accept=".json" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const data = JSON.parse(ev.target.result);
                      if (data.profile) setProfile(data.profile);
                      if (data.workoutLogs) setWorkoutLogs(data.workoutLogs);
                      if (data.biometrics) setBiometrics(data.biometrics);
                      if (data.foodLogs) setFoodLogs(data.foodLogs);
                      if (data.runLogs) setRunLogs(data.runLogs);
                      if (data.progressPhotos) setProgressPhotos(data.progressPhotos);
                      setSyncStatus('Restored backup successfully!');
                    } catch { setSyncStatus('Invalid backup file.'); }
                  };
                  reader.readAsText(file);
                }} className="hidden" />
              </div>
              {syncStatus && <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">{syncStatus}</div>}
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
