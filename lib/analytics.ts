import type { Workout } from '../stores/useAppStore';

const MUSCLE_COLORS = ['#A3E635', '#B7F96A', '#5A7D2A', '#B4C686', '#7C8B63', '#81918A'];
const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
const MUSCLE_TARGETS = [
  'Chest',
  'Upper back',
  'Lats',
  'Traps',
  'Front deltoids',
  'Side deltoids',
  'Rear deltoids',
  'Biceps',
  'Triceps',
  'Forearms',
  'Abs',
  'Obliques',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
];

const buildMuscleBreakdown = (workouts: Workout[]) => {
  const muscleTotals = new Map<string, { sets: number; volume: number; lastTrained: string | null }>();
  for (const muscle of MUSCLE_TARGETS) {
    muscleTotals.set(muscle, { sets: 0, volume: 0, lastTrained: null });
  }

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const target = MUSCLE_TARGETS.find((muscle) => muscle.toLowerCase() === exercise.muscle.trim().toLowerCase());
      if (!target) continue;

      const completedSets = exercise.sets.filter((set) => set.completed);
      const current = muscleTotals.get(target);
      if (!current) continue;
      current.sets += completedSets.length;
      current.volume += completedSets.reduce((sum, set) => sum + set.reps * set.weight, 0);
      if (completedSets.length && (!current.lastTrained || new Date(workout.date) > new Date(current.lastTrained))) {
        current.lastTrained = workout.date;
      }
    }
  }

  const totalSets = [...muscleTotals.values()].reduce((total, muscle) => total + muscle.sets, 0);
  return MUSCLE_TARGETS.map((name) => {
    const values = muscleTotals.get(name) ?? { sets: 0, volume: 0, lastTrained: null };
    const group = getMuscleGroup(name) ?? 'Other';
    const groupIndex = Math.max(0, MUSCLE_GROUPS.indexOf(group));
    return {
      name,
      group,
      sets: values.sets,
      volume: values.volume,
      percent: totalSets ? Math.round((values.sets / totalSets) * 100) : 0,
      lastTrained: values.lastTrained,
      color: MUSCLE_COLORS[groupIndex] ?? MUSCLE_COLORS[5],
    };
  });
};

const getMuscleGroup = (primaryMuscle: string) => {
  const muscle = primaryMuscle.toLowerCase();
  if (muscle.includes('chest')) return 'Chest';
  if (muscle.includes('back') || muscle.includes('lat')) return 'Back';
  if (muscle.includes('delt') || muscle.includes('shoulder')) return 'Shoulders';
  if (muscle.includes('bicep') || muscle.includes('tricep') || muscle.includes('forearm')) return 'Arms';
  if (muscle.includes('quad') || muscle.includes('hamstring') || muscle.includes('glute') || muscle.includes('calf')) return 'Legs';
  if (muscle.includes('ab') || muscle.includes('core') || muscle.includes('oblique')) return 'Core';
  return undefined;
};

const isInCurrentWeek = (date: Date, weekStart: Date, now: Date) => date >= weekStart && date <= now;

const isSameLocalDay = (date: Date, other: Date) =>
  date.getFullYear() === other.getFullYear() &&
  date.getMonth() === other.getMonth() &&
  date.getDate() === other.getDate();

export function getWorkoutMetrics(workouts: Workout[], now = new Date()) {
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  const dayOfWeek = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - dayOfWeek);

  const workoutsThisWeek = workouts.filter((workout) => new Date(workout.date) >= weekStart);
  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return workoutsThisWeek.filter((workout) => isSameLocalDay(new Date(workout.date), date)).length;
  });

  const muscleSets = new Map<string, number>();
  for (const workout of workoutsThisWeek) {
    for (const exercise of workout.exercises) {
      const muscle = getMuscleGroup(exercise.muscle);
      if (!muscle) continue;

      const completedSets = exercise.sets.filter((set) => set.completed).length;
      muscleSets.set(muscle, (muscleSets.get(muscle) ?? 0) + completedSets);
    }
  }

  const totalMuscleSets = [...muscleSets.values()].reduce((total, sets) => total + sets, 0);
  const muscleBreakdown = buildMuscleBreakdown(workoutsThisWeek);
  const allTimeMuscleBreakdown = buildMuscleBreakdown(workouts);

  const muscleDistribution = [...muscleSets.entries()]
    .map(([label, sets]) => ({
      label,
      value: totalMuscleSets > 0 ? Math.round((sets / totalMuscleSets) * 100) : 0,
      color: MUSCLE_COLORS[MUSCLE_GROUPS.indexOf(label)] ?? MUSCLE_COLORS[5],
    }))
    .sort((a, b) => b.value - a.value);

  const muscleMetrics = (muscleName: string) => {
    const matchingWorkouts = workouts
      .flatMap((workout) => workout.exercises
        .filter((exercise) => exercise.muscle.toLowerCase() === muscleName.toLowerCase())
        .map((exercise) => ({ workout, exercise })));
    const entries = matchingWorkouts
      .filter(({ workout }) => isInCurrentWeek(new Date(workout.date), weekStart, now))
      .flatMap(({ workout, exercise }) => exercise.sets
      .filter((set) => set.completed)
      .map((set) => ({ workout, exercise, set })));
    const lastTrainedDate = matchingWorkouts
      .map(({ workout }) => new Date(workout.date))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const daysSinceTraining = lastTrainedDate
      ? Math.floor((now.getTime() - lastTrainedDate.getTime()) / (24 * 60 * 60 * 1000))
      : Number.POSITIVE_INFINITY;

    return {
      weeklySets: entries.length,
      weeklyVolume: entries.reduce((sum, entry) => sum + entry.set.reps * entry.set.weight, 0),
      lastTrained: lastTrainedDate
        ? lastTrainedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : 'No logged session',
      status: daysSinceTraining <= 3 ? 'trained' as const : daysSinceTraining <= 7 ? 'moderate' as const : 'idle' as const,
      associatedExercises: [...new Set(matchingWorkouts.map(({ exercise }) => exercise.name))],
    };
  };

  const personalRecords = new Map<string, number>();
  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const best = Math.max(0, ...exercise.sets.filter((set) => set.completed).map((set) => set.weight));
      if (best > (personalRecords.get(exercise.name) ?? 0)) {
        personalRecords.set(exercise.name, best);
      }
    }
  }

  const volumeByMonth = Array.from({ length: 6 }, (_, index) => {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() - 4 + index, 1);
    const monthVolume = workouts
      .filter((workout) => {
        const date = new Date(workout.date);
        return date >= monthStart && date < nextMonthStart;
      })
      .reduce((total, workout) => total + workout.volume, 0);

    return {
      label: monthStart.toLocaleDateString(undefined, { month: 'short' }),
      value: monthVolume,
    };
  });

  return {
    workoutsThisWeek: workoutsThisWeek.length,
    totalVolume: workoutsThisWeek.reduce((total, workout) => total + workout.volume, 0),
    totalMinutes: workoutsThisWeek.reduce((total, workout) => total + workout.duration, 0),
    personalRecords: personalRecords.size,
    weeklyActivity,
    muscleDistribution,
    muscleBreakdown,
    allTimeMuscleBreakdown,
    recentWorkouts: [...workouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map((workout) => ({
        id: workout.id,
        name: workout.name,
        date: new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        volume: workout.volume,
        duration: workout.duration,
      })),
    volumeByMonth,
    bestLifts: [...personalRecords.entries()]
      .map(([name, weight]) => ({ name, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 4),
    muscleMetrics,
  };
}
