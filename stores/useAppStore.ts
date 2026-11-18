import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Exercise } from '../data/exercises';

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  dropSet?: boolean;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  muscle: string;
  sets: WorkoutSet[];
  supersetGroupId?: string;
};

export type Workout = {
  id: string;
  name: string;
  date: string;
  duration: number;
  volume: number;
  exercises: WorkoutExercise[];
};

export type BodyWeightEntry = {
  id: string;
  weight: number;
  date: string;
};

export type ActiveWorkoutDraft = {
  id: string;
  name: string;
  startedAt: number;
  elapsedSeconds: number;
  resumedAt: number | null;
  exercises: WorkoutExercise[];
};

type AppState = {
  workouts: Workout[];
  activeWorkoutDraft: ActiveWorkoutDraft | null;
  bodyWeightEntries: BodyWeightEntry[];
  customExercises: Exercise[];
  selectedMuscle: string | null;
  profileName: string;
  addWorkout: (workout: Workout) => void;
  addCustomExercise: (exercise: Exercise) => void;
  updateSelectedMuscle: (muscle: string | null) => void;
  addExerciseToWorkout: (workoutId: string, exercise: WorkoutExercise) => void;
  updateProfileName: (name: string) => void;
  addBodyWeightEntry: (entry: BodyWeightEntry) => void;
  beginActiveWorkoutDraft: (name: string, exercises: WorkoutExercise[]) => void;
  pauseActiveWorkoutDraft: (id: string) => void;
  resumeActiveWorkoutDraft: (id: string) => void;
  updateActiveWorkoutName: (name: string) => void;
  updateActiveWorkoutExercises: (update: (exercises: WorkoutExercise[]) => WorkoutExercise[]) => void;
  clearActiveWorkoutDraft: (id: string) => void;
  logSetFromNotification: (id: string, reps: number, weight: number) => boolean;
};

const defaultWorkouts: Workout[] = [];

const canUseSQLite = Platform.OS !== 'web';

const db = canUseSQLite ? SQLite.openDatabaseSync('repwise.db') : null;
if (db) {
  db.execSync('CREATE TABLE IF NOT EXISTS workouts (id TEXT PRIMARY KEY, data TEXT NOT NULL);');
}

const loadWorkoutsFromSqlite = (): Workout[] => {
  if (!db) {
    return defaultWorkouts;
  }

  try {
    const rows = db.getAllSync('SELECT data FROM workouts ORDER BY rowid DESC') as Array<{ data: string }>;
    return rows
      .map((row) => JSON.parse(row.data) as Workout)
      .filter(Boolean);
  } catch {
    console.error('Unable to load workouts from SQLite.');
    return defaultWorkouts;
  }
};

const saveWorkoutsToSqlite = (workouts: Workout[]) => {
  if (!db) {
    return;
  }

  try {
    db.runSync('DELETE FROM workouts');
    workouts.forEach((workout) => {
      db.runSync('INSERT INTO workouts (id, data) VALUES (?, ?)', [workout.id, JSON.stringify(workout)]);
    });
  } catch {
    console.error('Unable to save workouts to SQLite; AsyncStorage persistence remains enabled.');
  }
};

const removeLegacyBenchPressHistory = (workouts: Workout[]): Workout[] => (
  workouts.flatMap((workout) => {
    let removedVolume = 0;
    const exercises = workout.exercises.filter((exercise) => {
      if (exercise.name.trim().toLowerCase() !== 'bench press') return true;

      removedVolume += exercise.sets.reduce(
        (sum, set) => sum + (set.completed ? set.weight * set.reps : 0),
        0,
      );
      return false;
    });

    if (exercises.length === 0) return [];
    if (exercises.length === workout.exercises.length) return [workout];
    return [{
      ...workout,
      exercises,
      volume: Math.max(0, workout.volume - removedVolume),
    }];
  })
);

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const normalizeActiveWorkoutDraft = (value: unknown): ActiveWorkoutDraft | null => {
  if (!isRecord(value)
    || typeof value.id !== 'string'
    || typeof value.name !== 'string'
    || typeof value.startedAt !== 'number') {
    return null;
  }

  const exercises = Array.isArray(value.exercises) ? value.exercises : [];

  return {
    id: value.id,
    name: value.name,
    startedAt: value.startedAt,
    elapsedSeconds: typeof value.elapsedSeconds === 'number' && Number.isFinite(value.elapsedSeconds)
      ? Math.max(0, value.elapsedSeconds)
      : 0,
    resumedAt: null,
    exercises: exercises.flatMap((exercise): WorkoutExercise[] => {
      if (!isRecord(exercise)
        || typeof exercise.id !== 'string'
        || typeof exercise.name !== 'string'
        || typeof exercise.muscle !== 'string') {
        return [];
      }

      const sets = Array.isArray(exercise.sets) ? exercise.sets : [];
      const setIds = new Set<string>();
      return [{
        id: exercise.id,
        name: exercise.name,
        muscle: exercise.muscle,
        ...(typeof exercise.supersetGroupId === 'string'
          ? { supersetGroupId: exercise.supersetGroupId }
          : {}),
        sets: sets.flatMap((set, index): WorkoutSet[] => {
          if (!isRecord(set)) return [];

          const baseId = typeof set.id === 'string' && set.id.length > 0
            ? set.id
            : `restored-${exercise.id}-set-${index + 1}`;
          let id = baseId;
          let suffix = 1;
          while (setIds.has(id)) {
            id = `${baseId}-${suffix++}`;
          }
          setIds.add(id);

          return [{
            id,
            reps: typeof set.reps === 'number' && Number.isFinite(set.reps) ? set.reps : 0,
            weight: typeof set.weight === 'number' && Number.isFinite(set.weight) ? set.weight : 0,
            completed: set.completed === true,
            dropSet: set.dropSet === true,
          }];
        }),
      }];
    }),
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      workouts: loadWorkoutsFromSqlite(),
      activeWorkoutDraft: null,
      bodyWeightEntries: [],
      customExercises: [],
      selectedMuscle: 'Chest',
      profileName: 'Geetansh Sharma',
      addWorkout: (workout) => {
        const nextWorkouts = [workout, ...get().workouts];
        set({ workouts: nextWorkouts });
        saveWorkoutsToSqlite(nextWorkouts);
      },
      addCustomExercise: (exercise) => {
        const customExercises = get().customExercises;
        if (customExercises.some((item) => item.name.trim().toLowerCase() === exercise.name.trim().toLowerCase())) {
          return;
        }
        set({ customExercises: [...customExercises, exercise] });
      },
      updateSelectedMuscle: (muscle) => set({ selectedMuscle: muscle }),
      updateProfileName: (name) => set({ profileName: name }),
      addBodyWeightEntry: (entry) => set((state) => ({
        bodyWeightEntries: [entry, ...state.bodyWeightEntries],
      })),
      beginActiveWorkoutDraft: (name, exercises) => {
        if (get().activeWorkoutDraft) return;
        set({
          activeWorkoutDraft: {
            id: `active-workout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name,
            startedAt: Date.now(),
            elapsedSeconds: 0,
            resumedAt: Date.now(),
            exercises,
          },
        });
      },
      pauseActiveWorkoutDraft: (id) => {
        const draft = get().activeWorkoutDraft;
        if (!draft || draft.id !== id || draft.resumedAt === null) return;

        set({
          activeWorkoutDraft: {
            ...draft,
            elapsedSeconds: draft.elapsedSeconds + Math.max(0, Math.floor((Date.now() - draft.resumedAt) / 1000)),
            resumedAt: null,
          },
        });
      },
      resumeActiveWorkoutDraft: (id) => {
        const draft = get().activeWorkoutDraft;
        if (!draft || draft.id !== id || draft.resumedAt !== null) return;

        set({ activeWorkoutDraft: { ...draft, resumedAt: Date.now() } });
      },
      updateActiveWorkoutName: (name) => {
        const draft = get().activeWorkoutDraft;
        if (draft) set({ activeWorkoutDraft: { ...draft, name } });
      },
      updateActiveWorkoutExercises: (update) => {
        const draft = get().activeWorkoutDraft;
        if (draft) set({ activeWorkoutDraft: { ...draft, exercises: update(draft.exercises) } });
      },
      clearActiveWorkoutDraft: (id) => {
        if (get().activeWorkoutDraft?.id === id) {
          set({ activeWorkoutDraft: null });
        }
      },
      logSetFromNotification: (id, reps, weight) => {
        const draft = get().activeWorkoutDraft;
        if (!draft || draft.id !== id || draft.exercises.length === 0) return false;

        const exerciseIndex = draft.exercises.findIndex((exercise) => (
          exercise.sets.some((workoutSet) => !workoutSet.completed)
        ));
        const targetExerciseIndex = exerciseIndex >= 0 ? exerciseIndex : 0;
        const exercises = draft.exercises.map((exercise, index) => {
          if (index !== targetExerciseIndex) return exercise;
          const setIndex = exercise.sets.findIndex((workoutSet) => !workoutSet.completed);
          if (setIndex < 0) {
            return {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: `notification-set-${Date.now()}`,
                  reps,
                  weight,
                  completed: true,
                },
              ],
            };
          }

          return {
            ...exercise,
            sets: exercise.sets.map((workoutSet, index) => (
              index === setIndex ? { ...workoutSet, reps, weight, completed: true } : workoutSet
            )),
          };
        });

        set({ activeWorkoutDraft: { ...draft, exercises } });
        return true;
      },
      addExerciseToWorkout: (workoutId, exercise) => {
        const nextWorkouts = get().workouts.map((workout) =>
          workout.id === workoutId
            ? { ...workout, exercises: [...workout.exercises, exercise] }
            : workout,
        );

        set({ workouts: nextWorkouts });
        saveWorkoutsToSqlite(nextWorkouts);
      },
    }),
    {
      name: 'repwise-store',
      version: 6,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.error('Unable to restore saved REPWISE data.', error);
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AppState>;
        const workouts = removeLegacyBenchPressHistory(persisted.workouts ?? currentState.workouts);
        saveWorkoutsToSqlite(workouts);
        return {
          ...currentState,
          ...persisted,
          workouts,
          activeWorkoutDraft: normalizeActiveWorkoutDraft(persisted.activeWorkoutDraft),
        };
      },
      migrate: (persistedState, version) => {
        const persisted = persistedState as Partial<AppState>;
        const workouts = persisted.workouts ?? [];

        return {
          ...persisted,
          bodyWeightEntries: persisted.bodyWeightEntries ?? [],
          activeWorkoutDraft: normalizeActiveWorkoutDraft(persisted.activeWorkoutDraft),
          workouts: removeLegacyBenchPressHistory(version < 2
            ? workouts.filter((workout) => !['workout-1', 'workout-2'].includes(workout.id))
            : workouts),
        } as AppState;
      },
    },
  ),
);
