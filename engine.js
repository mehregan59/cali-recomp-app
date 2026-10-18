// --- MATHEMATICAL ENGINES & ALGORITHMS ---

// 1. BMR (Mifflin-St Jeor) & TDEE Calculator
const calculateMetrics = (profile, foodLogs, runLogs) => {
  const heightM = profile.heightCm / 100;
  const bmi = heightM > 0 ? (profile.weightKg / (heightM * heightM)).toFixed(1) : 0;
  
  let bmiCategory = 'Normal weight';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
  else if (bmi >= 30) bmiCategory = 'Obese';

  const bmr = profile.gender === 'male'
    ? (10 * profile.weightKg) + (6.25 * profile.heightCm) - (5 * profile.age) + 5
    : (10 * profile.weightKg) + (6.25 * profile.heightCm) - (5 * profile.age) - 161;

  const activityMultiplier = profile.daysPerWeek === 3 ? 1.45 : profile.daysPerWeek === 4 ? 1.55 : 1.65;
  const tdee = Math.round(bmr * activityMultiplier);
  const baseTargetCalories = Math.round(tdee * (profile.primaryGoal === 'fat_loss' ? 0.78 : 0.85));

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayFoodCalories = foodLogs.filter(f => f.date === todayStr).reduce((a, b) => a + b.calories, 0);
  const todayRunCalories = runLogs.filter(r => r.date === todayStr).reduce((a, b) => a + b.caloriesBurned, 0);

  const proteinGrams = Math.round(profile.weightKg * 2.1);
  const fatGrams = Math.round((baseTargetCalories * 0.25) / 9);
  const carbGrams = Math.max(50, Math.round((baseTargetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4));
  const waterTargetMl = Math.round(profile.weightKg * 35);

  return {
    bmi, bmiCategory, bmr: Math.round(bmr), tdee, baseTargetCalories,
    todayFoodCalories, todayRunCalories, proteinGrams, fatGrams, carbGrams, waterTargetMl
  };
};

// 2. Galaxy Watch Keytel Live Heart Rate Calorie Burn Formula
const calculateKeytelCalories = (hr, weightKg, age, gender, durationMin) => {
  if (!hr || hr < 40) return Math.round(durationMin * 8); // Fallback estimate
  const factor = gender === 'male' ? -55.0969 + (0.6309 * hr) + (0.1988 * weightKg) + (0.2017 * age)
                                   : -20.4022 + (0.4472 * hr) - (0.1263 * weightKg) + (0.074 * age);
  const kcalPerMin = Math.max(2, factor / 4.184);
  return Math.round(kcalPerMin * durationMin);
};

// 3. OpenFoodFacts Live API Search
const searchOpenFoodFacts = async (query) => {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`);
    const data = await res.json();
    if (!data.products) return [];
    return data.products.map(p => ({
      name: p.product_name || 'Unknown Item',
      calories: Math.round(p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal'] || 150),
      protein: Math.round(p.nutriments?.proteins_100g || 5)
    }));
  } catch {
    return [];
  }
};

// 4. Weight-Loss Plateau & Trajectory Engine
const evaluatePlateau = (biometrics) => {
  if (biometrics.length < 2) return { status: 'Normal tracking', action: 'Keep consistent.' };
  const latest = biometrics[biometrics.length - 1];
  const first = biometrics[0];
  const weekDiff = latest.week - first.week;
  if (weekDiff <= 0) return { status: 'Active', action: 'Good progress.' };

  const weightDelta = latest.weightKg - first.weightKg;
  const expectedLoss = weekDiff * 0.5; // 0.5 kg per week target

  if (weightDelta >= -0.2 && weekDiff >= 2) {
    return {
      status: 'Plateau Detected ⚠️',
      action: 'Add +5 mins to your daily Run block and +1,500 watch steps.'
    };
  } else if (weightDelta < -(weekDiff * 1.2)) {
    return {
      status: 'Losing Weight Too Fast ⚡',
      action: 'Increase daily calories by +200 kcal to protect muscle mass.'
    };
  }
  return { status: 'Optimal Recomp Trajectory 🎯', action: 'Keep protein high and weights moving.' };
};
