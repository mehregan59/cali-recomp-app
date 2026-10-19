// --- MATHEMATICAL ENGINES & REAL BLUETOOTH GATT HEART RATE PARSER ---

const parseHeartRatePacket = (valueDataView) => {
  const flags = valueDataView.getUint8(0);
  const is16Bit = (flags & 0x01) !== 0;
  return is16Bit ? valueDataView.getUint16(1, true) : valueDataView.getUint8(1);
};

const connectRealWatchBLE = async (onHeartRateUpdate, onStatusChange) => {
  if (!('bluetooth' in navigator)) {
    onStatusChange('Web Bluetooth not supported. Use Samsung Health manual sync below.');
    return null;
  }
  try {
    onStatusChange('Searching for Galaxy Watch / BLE Heart Rate...');
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['heart_rate', 0x180d]
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('heart_rate');
    const characteristic = await service.getCharacteristic('heart_rate_measurement');
    await characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const liveBpm = parseHeartRatePacket(event.target.value);
      if (liveBpm > 30 && liveBpm < 240) {
        onHeartRateUpdate(liveBpm, device.name || 'Galaxy Watch');
      }
    });
    onStatusChange('Live HR streaming active!');
    return device;
  } catch {
    onStatusChange('Watch paired. Ensure HR Broadcast is active on your watch.');
    return null;
  }
};

const calculateMetrics = (profile, foodLogs, runLogs, workoutLogs, activeWeek, watchData) => {
  const heightM = profile.heightCm / 100;
  const bmi = heightM > 0 ? Number((profile.weightKg / (heightM * heightM)).toFixed(1)) : 0;

  let bmiCategory = 'Normal weight';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
  else if (bmi >= 30) bmiCategory = 'Obese';

  const bmr = profile.gender === 'male'
    ? (10 * profile.weightKg) + (6.25 * profile.heightCm) - (5 * profile.age) + 5
    : (10 * profile.weightKg) + (6.25 * profile.heightCm) - (5 * profile.age) - 161;

  const stepCalories = Math.round((watchData?.steps || 0) * 0.04);
  const tdee = Math.round(bmr * 1.35) + stepCalories;
  const targetDeficit = profile.primaryGoal === 'fat_loss' ? 500 : 350;
  const baseTargetCalories = Math.max(1300, tdee - targetDeficit);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayFoodCalories = foodLogs.filter(f => f.date === todayStr).reduce((a, b) => a + b.calories, 0);
  const todayFoodProtein = foodLogs.filter(f => f.date === todayStr).reduce((a, b) => a + (b.protein || 0), 0);

  let workoutRunMins = 0;
  Object.keys(workoutLogs || {}).forEach((key) => {
    if (key.startsWith(`w${activeWeek}-`) && key.includes('run_')) {
      workoutRunMins += Number(workoutLogs[key] || 0);
    }
  });
  const workoutRunCalories = Math.round(workoutRunMins * (8.0 * 3.5 * profile.weightKg) / 200);
  const extraRunCalories = runLogs.filter(r => r.date === todayStr).reduce((a, b) => a + b.caloriesBurned, 0);
  const totalRunCalories = workoutRunCalories + extraRunCalories + (watchData?.caloriesBurned || 0);

  const calorieDelta = todayFoodCalories - baseTargetCalories;
  let extraRunMinutesNeeded = 0;
  let adjustmentMessage = 'On track! Perform your scheduled run and calisthenics sets.';
  if (calorieDelta > 100) {
    const kcalPerMinRun = (8.0 * 3.5 * profile.weightKg) / 200;
    extraRunMinutesNeeded = Math.min(15, Math.round(calorieDelta / kcalPerMinRun));
    adjustmentMessage = `+${calorieDelta} kcal surplus today. Added +${extraRunMinutesNeeded} mins to your Run block!`;
  }

  const proteinGrams = Math.round(profile.weightKg * 2.1);
  const fatGrams = Math.round((baseTargetCalories * 0.25) / 9);
  const carbGrams = Math.max(50, Math.round((baseTargetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));
  const waterTargetMl = Math.round(profile.weightKg * 35);
  const netDeficitToday = (tdee + workoutRunCalories + extraRunCalories) - todayFoodCalories;

  return {
    bmi, bmiCategory, bmr: Math.round(bmr), tdee, baseTargetCalories,
    todayFoodCalories, todayFoodProtein, totalRunCalories, workoutRunCalories,
    proteinGrams, fatGrams, carbGrams, waterTargetMl,
    calorieDelta, extraRunMinutesNeeded, adjustmentMessage, netDeficitToday
  };
};

const searchOpenFoodFacts = async (query) => {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=6`);
    const data = await res.json();
    if (!data.products) return [];
    return data.products
      .filter(p => p.product_name)
      .map(p => ({
        name: p.product_name,
        calories: Math.round(p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal'] || 140),
        protein: Math.round(p.nutriments?.proteins_100g || 5)
      }));
  } catch {
    return [];
  }
};

const evaluatePlateau = (biometrics) => {
  if (biometrics.length < 2) {
    return { status: 'Baseline Logged', action: 'Log your weight & waist weekly to track recomp progress.', extraRunMins: 0 };
  }
  const latest = biometrics[biometrics.length - 1];
  const prev = biometrics[biometrics.length - 2];
  const weightDelta = Number((latest.weightKg - prev.weightKg).toFixed(1));
  const waistDelta = Number((latest.waistCm - prev.waistCm).toFixed(1));

  if (weightDelta >= -0.1 && waistDelta >= 0) {
    return { status: 'Plateau Detected ⚠️', action: 'Auto-added +5 mins to your Run to break the stall.', extraRunMins: 5 };
  } else if (weightDelta >= -0.1 && waistDelta < 0) {
    return { status: 'Prime Body Recomp! 🏆', action: `Weight steady (${weightDelta}kg), waist down (${waistDelta}cm)! Fat loss + muscle gain active.`, extraRunMins: 0 };
  }
  return { status: `On Track (${weightDelta} kg) 🎯`, action: 'Steady recomposition progress.', extraRunMins: 0 };
};
