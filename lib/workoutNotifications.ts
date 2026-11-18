import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { ActiveWorkoutDraft } from '../stores/useAppStore';

export const WORKOUT_NOTIFICATION_CATEGORY = 'repwise-active-workout';
export const WORKOUT_NOTIFICATION_ID = 'repwise-active-workout';
export const LOG_SET_ACTION = 'LOG_WORKOUT_SET';
export const OPEN_WORKOUT_ACTION = 'OPEN_WORKOUT';

export async function registerWorkoutNotificationActions() {
  if (Platform.OS === 'web') return;

  await Notifications.setNotificationCategoryAsync(WORKOUT_NOTIFICATION_CATEGORY, [
    {
      identifier: LOG_SET_ACTION,
      buttonTitle: 'Add reps + kg',
      textInput: {
        submitButtonTitle: 'Log set',
        placeholder: 'Type reps, weight kg (e.g. 8, 60)',
      },
      options: { opensAppToForeground: false },
    },
    {
      identifier: OPEN_WORKOUT_ACTION,
      buttonTitle: 'Open workout',
      options: { opensAppToForeground: true },
    },
  ]);
}

export async function requestWorkoutNotificationPermission() {
  if (Platform.OS === 'web') return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function updateWorkoutNotification(draft: ActiveWorkoutDraft) {
  if (Platform.OS === 'web') return;

  const granted = await requestWorkoutNotificationPermission();
  if (!granted) return;

  await registerWorkoutNotificationActions();
  const nextExercise = draft.exercises.find((exercise) => (
    exercise.sets.some((workoutSet) => !workoutSet.completed)
  ));
  const completedSets = draft.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter((workoutSet) => workoutSet.completed).length,
    0,
  );
  const plannedSets = draft.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const nextSetIndex = nextExercise
    ? nextExercise.sets.findIndex((workoutSet) => !workoutSet.completed) + 1
    : 0;
  const nextSet = nextExercise?.sets[nextSetIndex - 1];
  const isCardio = nextExercise?.muscle === 'Cardio';
  const body = nextExercise
    ? `${completedSets}/${plannedSets} sets · ${nextExercise.name} · Set ${nextSetIndex}/${nextExercise.sets.length}. ${
        isCardio
          ? `Enter minutes (e.g. ${nextSet?.reps || 20}).`
          : `Enter reps, kg (e.g. ${nextSet?.reps || 8}, ${nextSet?.weight || 0}).`
      }`
    : `${completedSets} sets logged. All planned sets are done — open REPWISE to add more.`;

  await Notifications.dismissNotificationAsync(WORKOUT_NOTIFICATION_ID);
  await Notifications.scheduleNotificationAsync({
    identifier: WORKOUT_NOTIFICATION_ID,
    content: {
      title: `${draft.name || 'Workout'} · in progress`,
      body,
      data: { activeWorkoutId: draft.id },
      categoryIdentifier: WORKOUT_NOTIFICATION_CATEGORY,
      sound: false,
      priority: 'low',
      sticky: true,
      autoDismiss: false,
    },
    trigger: null,
  });
}

export async function dismissWorkoutNotification() {
  if (Platform.OS === 'web') return;
  await Notifications.dismissNotificationAsync(WORKOUT_NOTIFICATION_ID);
}

export function parseNotificationSetInput(
  input: string,
  isCardio: boolean,
): { reps: number; weight: number } | null {
  if (isCardio) {
    const match = input.trim().match(/^(\d+(?:\.\d+)?)\s*(?:min(?:utes?)?)?$/i);
    if (!match) return null;
    const minutes = Number(match[1]);
    return Number.isFinite(minutes) && minutes > 0
      ? { reps: minutes, weight: 0 }
      : null;
  }

  const match = input.trim().match(
    /^(\d+)\s*(?:reps?)?\s*[,x×]\s*(\d+(?:\.\d+)?)\s*(?:kg)?$/i,
  );
  if (!match) return null;
  const reps = Number(match[1]);
  const weight = Number(match[2]);
  return Number.isSafeInteger(reps) && reps > 0 && Number.isFinite(weight) && weight >= 0
    ? { reps, weight }
    : null;
}
