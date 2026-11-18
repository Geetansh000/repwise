import * as Notifications from 'expo-notifications';
import { router, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  LOG_SET_ACTION,
  OPEN_WORKOUT_ACTION,
  parseNotificationSetInput,
  registerWorkoutNotificationActions,
  updateWorkoutNotification,
} from '../lib/workoutNotifications';
import { useAppStore } from '../stores/useAppStore';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isActiveWorkout = typeof notification.request.content.data?.activeWorkoutId === 'string';
    return {
      shouldShowBanner: !isActiveWorkout,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

export default function RootLayout() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let active = true;
    const handledResponses = new Set<string>();

    const handleResponse = async (response: Notifications.NotificationResponse) => {
      if (!useAppStore.persist.hasHydrated()) {
        await new Promise<void>((resolve) => {
          let unsubscribe = () => {};
          unsubscribe = useAppStore.persist.onFinishHydration(() => {
            unsubscribe();
            resolve();
          });
        });
      }

      const { actionIdentifier, notification, userText } = response;
      const responseKey = `${notification.date}:${actionIdentifier}:${userText ?? ''}`;
      if (handledResponses.has(responseKey)) return;
      handledResponses.add(responseKey);

      const activeWorkoutId = notification.request.content.data?.activeWorkoutId;
      if (typeof activeWorkoutId !== 'string') return;

      if (
        actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        || actionIdentifier === OPEN_WORKOUT_ACTION
      ) {
        if (pathnameRef.current !== '/workout-session') router.push('/workout-session');
        return;
      }

      if (actionIdentifier !== LOG_SET_ACTION) return;

      const state = useAppStore.getState();
      const draft = state.activeWorkoutDraft;
      if (!draft || draft.id !== activeWorkoutId) {
        Alert.alert('Workout not found', 'Start or resume a workout before logging a set.');
        return;
      }

      const nextExercise = draft.exercises.find((exercise) => (
        exercise.sets.some((set) => !set.completed)
      )) ?? draft.exercises[0];
      const parsedSets = userText && nextExercise
        ? parseNotificationSetInput(userText, nextExercise.muscle === 'Cardio')
        : null;
      if (!parsedSets) {
        Alert.alert(
          'Set not logged',
          nextExercise?.muscle === 'Cardio'
            ? 'Enter the duration in minutes, for example: 20'
            : 'For each set, enter reps and weight separated by a space. Separate sets with commas, for example: 15 22.5, 12 30.',
        );
        return;
      }

      for (const set of parsedSets) {
        const logged = useAppStore.getState().logSetFromNotification(
          activeWorkoutId,
          set.reps,
          set.weight,
        );
        if (!logged) {
          Alert.alert('Set not logged', 'Add an exercise to your active workout first.');
          return;
        }
      }

      const updatedDraft = useAppStore.getState().activeWorkoutDraft;
      if (updatedDraft) {
        try {
          await updateWorkoutNotification(updatedDraft);
        } catch (error) {
          console.error('Unable to refresh the active workout notification.', error);
        }
      }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      void handleResponse(response).catch((error) => {
        console.error('Unable to process workout notification response.', error);
        Alert.alert('Workout update failed', 'Open RepWise and log the set in your workout.');
      });
    });

    void registerWorkoutNotificationActions().catch((error) => {
      console.error('Unable to register workout notification actions.', error);
    });
    void Notifications.getLastNotificationResponseAsync()
      .then(async (response) => {
        if (active && response) await handleResponse(response);
        await Notifications.clearLastNotificationResponseAsync();
      })
      .catch((error) => {
        console.error('Unable to read the last workout notification response.', error);
      });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#080D16' }} edges={['top']}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#080D16' },
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
