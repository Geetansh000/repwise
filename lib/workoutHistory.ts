import type { Workout } from '../stores/useAppStore';
import { getExerciseNameKey } from '../data/exercises';

export function getExerciseHistory(workouts: Workout[], exerciseName: string) {
  return workouts
    .flatMap((workout) => workout.exercises
      .filter((exercise) => getExerciseNameKey(exercise.name) === getExerciseNameKey(exerciseName))
      .map((exercise) => ({
        workoutId: workout.id,
        workoutName: workout.name,
        date: workout.date,
        sets: exercise.sets.filter((set) => set.completed),
      })))
    .filter((entry) => entry.sets.length > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
