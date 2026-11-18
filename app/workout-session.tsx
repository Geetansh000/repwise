import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown, ChevronUp, CirclePlus, Minus, Play, Plus, Search, Sparkles, Trash2, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Alert, AppState, findNodeHandle, ImageBackground, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseInfoButton } from '../components/ExerciseInfoButton';
import { ScreenEntrance } from '../components/ScreenEntrance';
import { exerciseLibrary, exerciseMatchesPrimaryFocus, getExerciseNameKey, getFocusGroupForMuscle, recommendedTemplates, type Exercise } from '../data/exercises';
import { getExerciseHistory } from '../lib/workoutHistory';
import {
  dismissWorkoutNotification,
  registerWorkoutNotificationActions,
  requestWorkoutNotificationPermission,
  updateWorkoutNotification,
} from '../lib/workoutNotifications';
import { useAppStore, type Workout, type WorkoutExercise, type WorkoutSet } from '../stores/useAppStore';

let nextLocalId = 0;
const makeLocalId = (prefix: string) => `${prefix}-${Date.now()}-${++nextLocalId}`;
const getDefaultSetReps = (setIndex: number, isCardio: boolean) => (
  isCardio ? 20 : [15, 12, 8, 8][setIndex] ?? 8
);

export default function WorkoutSessionScreen() {
  const params = useLocalSearchParams<{ exercise?: string; template?: string; muscles?: string }>();
  const addWorkout = useAppStore((state) => state.addWorkout);
  const addCustomExercise = useAppStore((state) => state.addCustomExercise);
  const customExercises = useAppStore((state) => state.customExercises);
  const workouts = useAppStore((state) => state.workouts);
  const activeWorkoutDraft = useAppStore((state) => state.activeWorkoutDraft);
  const beginActiveWorkoutDraft = useAppStore((state) => state.beginActiveWorkoutDraft);
  const pauseActiveWorkoutDraft = useAppStore((state) => state.pauseActiveWorkoutDraft);
  const resumeActiveWorkoutDraft = useAppStore((state) => state.resumeActiveWorkoutDraft);
  const updateActiveWorkoutName = useAppStore((state) => state.updateActiveWorkoutName);
  const updateActiveWorkoutExercises = useAppStore((state) => state.updateActiveWorkoutExercises);
  const clearActiveWorkoutDraft = useAppStore((state) => state.clearActiveWorkoutDraft);
  const isFinishing = useRef(false);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const focusedInputRef = useRef<number | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const availableExercises = useMemo(() => [...exerciseLibrary, ...customExercises], [customExercises]);
  const selectedMuscles = useMemo(
    () => new Set(typeof params.muscles === 'string' ? params.muscles.split(',').filter(Boolean) : []),
    [params.muscles],
  );
  const completedThisWeek = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

    return workouts
      .filter((workout) => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= weekStart && workoutDate <= now;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .flatMap((workout) => workout.exercises
        .filter((exercise) => exercise.sets.some((set) => set.completed))
        .map((exercise) => ({
          name: exercise.name,
          focus: getFocusGroupForMuscle(exercise.muscle),
          date: workout.date,
        })))
      .filter((entry) => selectedMuscles.size === 0 || selectedMuscles.has(entry.focus ?? ''))
      .filter((entry, index, entries) => entries.findIndex(
        (candidate) => getExerciseNameKey(candidate.name) === getExerciseNameKey(entry.name),
      ) === index);
  }, [selectedMuscles, workouts]);
  const completedThisWeekNames = useMemo(
    () => new Set(completedThisWeek.map((entry) => getExerciseNameKey(entry.name))),
    [completedThisWeek],
  );
  const defaultWorkoutName = typeof params.template === 'string' ? params.template : 'New workout';
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [weightInputs, setWeightInputs] = useState<Record<string, string>>({});
  const [pendingSupersetExerciseId, setPendingSupersetExerciseId] = useState<string | null>(null);
  const [notificationAvailable, setNotificationAvailable] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const initialExercise = typeof params.exercise === 'string'
    ? availableExercises.find((exercise) => exercise.id === params.exercise || exercise.name === params.exercise)
    : undefined;
  const initialTemplate = typeof params.template === 'string'
    ? recommendedTemplates.find((template) => template.title === params.template)
    : undefined;
  const initialDraftExercises = useMemo<WorkoutExercise[]>(() => {
    if (initialExercise) {
      const exerciseId = `exercise-${initialExercise.id}`;
      return exerciseMatchesPrimaryFocus(initialExercise, selectedMuscles) ? [{
        id: exerciseId,
        name: initialExercise.name,
        muscle: initialExercise.muscle,
        sets: [{ id: `set-${initialExercise.id}`, reps: getDefaultSetReps(0, initialExercise.category === 'Cardio'), weight: 0, completed: false }],
      }] : [];
    }

    return (initialTemplate?.exercises ?? []).flatMap((name, index) => {
      const exercise = exerciseLibrary.find((item) => item.name === name);
      return exercise
        && exerciseMatchesPrimaryFocus(exercise, selectedMuscles)
        && !completedThisWeekNames.has(getExerciseNameKey(exercise.name))
        ? [{
            id: `exercise-${exercise.id}-${index}`,
            name: exercise.name,
            muscle: exercise.muscle,
            sets: [{ id: `set-${exercise.id}-${index}`, reps: getDefaultSetReps(0, exercise.category === 'Cardio'), weight: 0, completed: false }],
          }]
        : [];
    });
  }, [completedThisWeekNames, initialExercise, initialTemplate, selectedMuscles]);
  const draftExercises = activeWorkoutDraft?.exercises ?? initialDraftExercises;
  const workoutName = activeWorkoutDraft?.name ?? defaultWorkoutName;
  const activeWorkoutId = activeWorkoutDraft?.id;
  const savedElapsedSeconds = activeWorkoutDraft?.elapsedSeconds ?? 0;
  const resumedAt = activeWorkoutDraft?.resumedAt ?? null;
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<Exercise['category']>('Chest');
  const [customEquipment, setCustomEquipment] = useState('Dumbbells');
  const [customError, setCustomError] = useState('');
  const [editingCompletedExercises, setEditingCompletedExercises] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!activeWorkoutId) {
      if (!isFinishing.current) beginActiveWorkoutDraft(defaultWorkoutName, initialDraftExercises);
      return;
    }

    const updateElapsedTime = () => {
      const resumedSeconds = resumedAt === null
        ? 0
        : Math.max(0, Math.floor((Date.now() - resumedAt) / 1000));
      setElapsedSeconds(savedElapsedSeconds + resumedSeconds);
    };

    updateElapsedTime();
    if (resumedAt === null) return;

    const timer = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(timer);
  }, [
    activeWorkoutId,
    resumedAt,
    savedElapsedSeconds,
    beginActiveWorkoutDraft,
    defaultWorkoutName,
    initialDraftExercises,
  ]);

  useFocusEffect(useCallback(() => {
    const draftId = activeWorkoutId;
    if (!draftId) return undefined;

    if (AppState.currentState === 'active') resumeActiveWorkoutDraft(draftId);
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        resumeActiveWorkoutDraft(draftId);
      } else {
        pauseActiveWorkoutDraft(draftId);
      }
    });

    return () => {
      subscription.remove();
      pauseActiveWorkoutDraft(draftId);
    };
  }, [activeWorkoutId, pauseActiveWorkoutDraft, resumeActiveWorkoutDraft]));

  const scrollFocusedInputIntoView = useCallback(() => {
    const inputHandle = focusedInputRef.current;
    if (Platform.OS === 'web' || inputHandle === null) return;

    setTimeout(() => {
      scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(inputHandle, 100, true);
    }, 100);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(Platform.OS === 'android' ? event.endCoordinates.height : 0);
      scrollFocusedInputIntoView();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [scrollFocusedInputIntoView]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let active = true;
    void requestWorkoutNotificationPermission()
      .then(async (granted) => {
        if (!active) return;
        if (!granted) {
          setNotificationMessage('Allow notifications to log sets from your notification panel.');
          return;
        }
        await registerWorkoutNotificationActions();
        if (active) setNotificationAvailable(true);
      })
      .catch((error) => {
        console.error('Unable to enable workout notifications.', error);
        if (active) setNotificationMessage('Workout notification controls are unavailable.');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notificationAvailable || !activeWorkoutDraft) return;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'background') return;
      const currentDraft = useAppStore.getState().activeWorkoutDraft;
      if (!currentDraft) return;
      void updateWorkoutNotification(currentDraft).catch((error) => {
        console.error('Unable to update the active workout notification.', error);
        setNotificationMessage('Could not update the workout notification.');
      });
    });

    return () => subscription.remove();
  }, [activeWorkoutDraft, notificationAvailable]);

  const totalVolume = useMemo(
    () => draftExercises.reduce(
      (sum, exercise) => sum + exercise.sets.reduce(
        (exerciseSum, set) => exerciseSum + (set.completed ? set.weight * set.reps : 0),
        0,
      ),
      0,
    ),
    [draftExercises],
  );

  const completedSets = draftExercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length,
    0,
  );
  const updateDraftExercises = (update: (current: WorkoutExercise[]) => WorkoutExercise[]) => {
    updateActiveWorkoutExercises(update);
  };
  const nextExerciseSuggestion = useMemo(
    () => availableExercises
      .filter((exercise) => exerciseMatchesPrimaryFocus(exercise, selectedMuscles))
      .filter((exercise) => !draftExercises.some(
        (draftExercise) => getExerciseNameKey(draftExercise.name) === getExerciseNameKey(exercise.name),
      ))
      .sort((a, b) => Number(completedThisWeekNames.has(getExerciseNameKey(a.name)))
        - Number(completedThisWeekNames.has(getExerciseNameKey(b.name))))[0],
    [availableExercises, completedThisWeekNames, draftExercises, selectedMuscles],
  );
  const filteredExercises = exerciseLibrary
    .concat(customExercises)
    .filter((exercise) => exerciseMatchesPrimaryFocus(exercise, selectedMuscles))
    .filter((exercise) => exercise.name.toLowerCase().includes(exerciseSearch.trim().toLowerCase()))
    .filter((exercise) => !draftExercises.some(
      (draftExercise) => getExerciseNameKey(draftExercise.name) === getExerciseNameKey(exercise.name),
    ))
    .sort((a, b) => Number(completedThisWeekNames.has(getExerciseNameKey(a.name)))
      - Number(completedThisWeekNames.has(getExerciseNameKey(b.name))))
    .slice(0, 8);

  const addExercise = (exerciseName: string) => {
    const selected = availableExercises.find((exercise) => exercise.name === exerciseName);
    if (!selected) return;

    updateDraftExercises((current) => {
      if (current.some((exercise) => getExerciseNameKey(exercise.name) === getExerciseNameKey(selected.name))) {
        return current;
      }

      return [...current, {
        id: makeLocalId('exercise'),
        name: selected.name,
        muscle: selected.muscle,
        sets: [{ id: makeLocalId('set'), reps: getDefaultSetReps(0, selected.category === 'Cardio'), weight: 0, completed: false }],
      }];
    });
    setExerciseSearch('');
  };

  const createCustomExercise = () => {
    const name = customName.trim();
    if (!name) {
      setCustomError('Enter an exercise name.');
      return;
    }

    if (availableExercises.some((exercise) => getExerciseNameKey(exercise.name) === getExerciseNameKey(name))) {
      setCustomError('An exercise with this name already exists in your library.');
      return;
    }

    const exercise: Exercise = {
      id: makeLocalId('custom'),
      name,
      muscle: customCategory,
      secondaryMuscles: [],
      equipment: customEquipment.trim() || 'Bodyweight',
      difficulty: 'Beginner',
      category: customCategory,
      instructions: 'Custom exercise added to your personal library.',
    };

    addCustomExercise(exercise);
    updateDraftExercises((current) => current.some(
      (item) => getExerciseNameKey(item.name) === getExerciseNameKey(exercise.name),
    )
      ? current
      : [...current, {
          id: makeLocalId('exercise'),
          name: exercise.name,
          muscle: exercise.muscle,
          sets: [{ id: makeLocalId('set'), reps: getDefaultSetReps(0, exercise.category === 'Cardio'), weight: 0, completed: false }],
        }]);
    setCustomName('');
    setCustomEquipment('Dumbbells');
    setCustomError('');
    setShowCustomForm(false);
  };

  const toggleCustomForm = () => {
    setShowCustomForm((open) => {
      if (!open) {
        setCustomName(exerciseSearch.trim());
        setCustomError('');
      }
      return !open;
    });
  };

  const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => {
    const numberValue = Number(value);
    const sanitizedValue = Number.isFinite(numberValue) ? Math.max(0, numberValue) : 0;
    updateDraftExercises((current) => current.map((exercise) => (
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set) => (
              set.id === setId ? { ...set, [field]: sanitizedValue } : set
            )),
          }
        : exercise
    )));
  };

  const updateWeight = (exerciseId: string, setId: string, value: string) => {
    const normalized = value.replace(',', '.').replace(/[^\d.]/g, '');
    const decimalIndex = normalized.indexOf('.');
    const sanitized = decimalIndex < 0
      ? normalized
      : `${normalized.slice(0, decimalIndex + 1)}${normalized.slice(decimalIndex + 1).replace(/\./g, '')}`;
    setWeightInputs((current) => ({ ...current, [setId]: sanitized }));

    const numberValue = Number(sanitized);
    if (sanitized === '' || Number.isFinite(numberValue)) {
      updateDraftExercises((current) => current.map((exercise) => (
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) => (
                set.id === setId ? { ...set, weight: sanitized === '' ? 0 : numberValue } : set
              )),
            }
          : exercise
      )));
    }
  };

  const finishWeightInput = (setId: string) => {
    setWeightInputs((current) => {
      const next = { ...current };
      delete next[setId];
      return next;
    });
  };

  const toggleSuperset = (exerciseId: string) => {
    const exercise = draftExercises.find((item) => item.id === exerciseId);
    if (!exercise) return;

    if (exercise.supersetGroupId) {
      const groupId = exercise.supersetGroupId;
      updateDraftExercises((current) => current.map((item) => (
        item.supersetGroupId === groupId
          ? { ...item, supersetGroupId: undefined }
          : item
      )));
      setPendingSupersetExerciseId(null);
      return;
    }

    if (!pendingSupersetExerciseId) {
      setPendingSupersetExerciseId(exerciseId);
      return;
    }

    if (pendingSupersetExerciseId === exerciseId) {
      setPendingSupersetExerciseId(null);
      return;
    }

    const groupId = makeLocalId('superset');
    updateDraftExercises((current) => {
      const firstIndex = current.findIndex((item) => item.id === pendingSupersetExerciseId);
      const secondIndex = current.findIndex((item) => item.id === exerciseId);
      if (firstIndex < 0 || secondIndex < 0) return current;

      const next = [...current];
      next[firstIndex] = { ...next[firstIndex], supersetGroupId: groupId };
      next[secondIndex] = { ...next[secondIndex], supersetGroupId: groupId };
      const [pairedExercise] = next.splice(secondIndex, 1);
      const adjustedFirstIndex = secondIndex < firstIndex ? firstIndex - 1 : firstIndex;
      next.splice(adjustedFirstIndex + 1, 0, pairedExercise);
      return next;
    });
    setPendingSupersetExerciseId(null);
  };

  const removeExercise = (exerciseId: string) => {
    const exercise = draftExercises.find((item) => item.id === exerciseId);
    updateDraftExercises((current) => current
      .filter((item) => item.id !== exerciseId)
      .map((item) => exercise?.supersetGroupId && item.supersetGroupId === exercise.supersetGroupId
        ? { ...item, supersetGroupId: undefined }
        : item));
    if (pendingSupersetExerciseId === exerciseId) setPendingSupersetExerciseId(null);
  };

  const toggleSet = (exerciseId: string, setId: string) => {
    updateDraftExercises((current) => current.map((exercise) => (
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set) => (
              set.id === setId ? { ...set, completed: !set.completed } : set
            )),
          }
        : exercise
    )));
  };

  const toggleDropSet = (exerciseId: string, setId: string) => {
    updateDraftExercises((current) => current.map((exercise) => (
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set) => (
              set.id === setId ? { ...set, dropSet: !set.dropSet } : set
            )),
          }
        : exercise
    )));
  };

  const toggleExerciseCompletion = (exerciseId: string) => {
    updateDraftExercises((current) => current.map((exercise) => {
      if (exercise.id !== exerciseId || exercise.sets.length === 0) return exercise;

      return {
        ...exercise,
        sets: exercise.sets.map((set) => ({ ...set, completed: true })),
      };
    }));
    setEditingCompletedExercises((current) => {
      const next = new Set(current);
      next.delete(exerciseId);
      return next;
    });
  };

  const addSet = (exerciseId: string) => {
    updateDraftExercises((current) => current.map((exercise) => (
      exercise.id === exerciseId
        ? {
            ...exercise,
            sets: [...exercise.sets, {
              id: makeLocalId('set'),
              reps: getDefaultSetReps(exercise.sets.length, exercise.muscle === 'Cardio'),
              weight: 0,
              completed: false,
            }],
          }
        : exercise
    )));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    updateDraftExercises((current) => current.map((exercise) => (
      exercise.id === exerciseId
        ? { ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) }
        : exercise
    )));
  };

  const moveExercise = (exerciseId: string, direction: -1 | 1) => {
    updateDraftExercises((current) => {
      const currentIndex = current.findIndex((exercise) => exercise.id === exerciseId);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
      return next;
    });
  };

  const discardWorkout = () => {
    if (!activeWorkoutDraft) return;

    setShowDiscardConfirmation(true);
  };

  const confirmDiscardWorkout = () => {
    if (!activeWorkoutDraft) return;

    setShowDiscardConfirmation(false);
    isFinishing.current = true;
    clearActiveWorkoutDraft(activeWorkoutDraft.id);
    void dismissWorkoutNotification().catch((error) => {
      console.error('Unable to dismiss the active workout notification.', error);
    });
    router.replace('/(tabs)/workout');
  };

  const saveWorkout = () => {
    if (!activeWorkoutDraft) return;
    if (completedSets === 0) {
      Alert.alert('No completed sets', 'Complete at least one set before saving this workout.');
      return;
    }

    const nextWorkout: Workout = {
      id: makeLocalId('workout'),
      name: workoutName.trim() || 'Workout',
      date: new Date().toISOString(),
      duration: Math.max(1, Math.floor((
        activeWorkoutDraft.elapsedSeconds
        + (activeWorkoutDraft.resumedAt === null
          ? 0
          : Math.max(0, Math.floor((Date.now() - activeWorkoutDraft.resumedAt) / 1000)))
      ) / 60)),
      volume: totalVolume,
      exercises: draftExercises,
    };

    addWorkout(nextWorkout);
    isFinishing.current = true;
    clearActiveWorkoutDraft(activeWorkoutDraft.id);
    void dismissWorkoutNotification().catch((error) => {
      console.error('Unable to dismiss the active workout notification.', error);
    });
    router.replace('/(tabs)/workout');
  };

  const clock = `${Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0')}:${Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`;

  return (
    <ScreenEntrance>
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: 40 + keyboardHeight }]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.heading}>Workout session</Text>
        <View style={styles.headerActions}>
          <Pressable accessibilityRole="button" onPress={discardWorkout} hitSlop={6}>
            <Text style={styles.discardText}>Discard</Text>
          </Pressable>
          <View style={styles.timerPill}>
            <View style={styles.timerDot} />
            <Text style={styles.timerText}>{clock}</Text>
          </View>
        </View>
      </View>

      <ImageBackground
        source={require('../assets/images/workout-athlete.jpg')}
        style={styles.sessionArtCard}
        imageStyle={styles.sessionArtImage}
        resizeMode="cover"
        accessibilityLabel="Athlete doing pull-ups in a gym"
      >
        <View style={styles.sessionArtShade}>
          <Text style={styles.sessionArtEyebrow}>SESSION IN PROGRESS</Text>
          <Text style={styles.sessionArtTitle}>Every rep moves you forward.</Text>
          <Text style={styles.sessionArtCaption}>Stay focused. Own the set.</Text>
        </View>
      </ImageBackground>
      {Platform.OS === 'web' ? (
        <Text style={styles.notificationMessage}>
          Notification set logging is available in the Android and iOS apps.
        </Text>
      ) : notificationMessage ? (
        <Text style={styles.notificationMessage}>{notificationMessage}</Text>
      ) : notificationAvailable ? (
        <Text style={styles.notificationMessage}>
          Background controls are ready. Open the notification to resume or log a set.
        </Text>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.label}>Workout name</Text>
        <TextInput
          value={workoutName}
          onChangeText={updateActiveWorkoutName}
          placeholder="Name this workout"
          placeholderTextColor="#929B91"
          style={styles.input}
          maxLength={50}
        />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{draftExercises.length}</Text>
          <Text style={styles.summaryLabel}>Exercises</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{completedSets}</Text>
          <Text style={styles.summaryLabel}>Sets done</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>{totalVolume.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>kg volume</Text>
        </View>
      </View>

      <View style={styles.rotationCard}>
        <View style={styles.rotationHeading}>
          <Sparkles size={16} color="#A3E635" />
          <Text style={styles.rotationTitle}>This week’s rotation</Text>
        </View>
        <Text style={styles.rotationSubtitle}>
          Completed exercises for {selectedMuscles.size > 0 ? [...selectedMuscles].join(' + ') : 'your selected focus'}
        </Text>
        {completedThisWeek.length > 0 ? (
          <View style={styles.rotationList}>
            {initialTemplate?.exercises.some((name) => completedThisWeekNames.has(getExerciseNameKey(name))) && (
              <Text style={styles.rotationNote}>
                Template exercises already completed this week were left out to help you rotate.
              </Text>
            )}
            {completedThisWeek.slice(0, 6).map((entry) => (
              <View key={entry.name.toLowerCase()} style={styles.rotationItem}>
                <View style={styles.rotationItemCopy}>
                  <Text style={styles.rotationExercise}>{entry.name}</Text>
                  {entry.focus && <Text style={styles.rotationFocus}>{entry.focus}</Text>}
                </View>
                <Text style={styles.rotationDate}>
                  {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' })}
                </Text>
              </View>
            ))}
            {completedThisWeek.length > 6 && (
              <Text style={styles.rotationMore}>+{completedThisWeek.length - 6} more completed this week</Text>
            )}
          </View>
        ) : (
          <Text style={styles.rotationEmpty}>No completed exercises for these muscles yet this week.</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Add exercise</Text>
      {nextExerciseSuggestion && (
        <View style={styles.nextExerciseCard}>
          <View style={styles.nextExerciseCopy}>
            <Text style={styles.nextExerciseEyebrow}>UP NEXT</Text>
            <Text style={styles.nextExerciseName}>{nextExerciseSuggestion.name}</Text>
            <Text style={styles.nextExerciseMeta}>
              {nextExerciseSuggestion.muscle} · {nextExerciseSuggestion.equipment}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add suggested exercise ${nextExerciseSuggestion.name}`}
            onPress={() => addExercise(nextExerciseSuggestion.name)}
            style={styles.nextExerciseButton}
          >
            <Plus size={16} color="#07100B" />
            <Text style={styles.nextExerciseButtonText}>Add</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.searchBox}>
        <Search size={17} color="#929B91" />
        <TextInput
          value={exerciseSearch}
          onChangeText={setExerciseSearch}
          placeholder="Search exercise library"
          placeholderTextColor="#929B91"
          style={styles.searchInput}
        />
      </View>
      <Pressable style={styles.customToggle} onPress={toggleCustomForm}>
        {showCustomForm ? <X size={15} color="#A3E635" /> : <Plus size={15} color="#A3E635" />}
        <Text style={styles.customToggleText}>{showCustomForm ? 'Cancel custom exercise' : 'Create a custom exercise'}</Text>
      </Pressable>
      {showCustomForm && (
        <View style={styles.customForm}>
          <TextInput
            value={customName}
            onChangeText={(value) => {
              setCustomName(value);
              setCustomError('');
            }}
            placeholder="e.g. Dumbbell Bench Press"
            placeholderTextColor="#929B91"
            style={styles.input}
            maxLength={60}
          />
          <Text style={styles.formLabel}>Primary muscle</Text>
          <View style={styles.categoryChoices}>
            {(['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'] as const).map((category) => (
              <Pressable
                key={category}
                style={[styles.categoryChoice, customCategory === category && styles.categoryChoiceActive]}
                onPress={() => setCustomCategory(category)}
              >
                <Text style={[styles.categoryChoiceText, customCategory === category && styles.categoryChoiceTextActive]}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={customEquipment}
            onChangeText={setCustomEquipment}
            placeholder="Equipment"
            placeholderTextColor="#929B91"
            style={styles.input}
            maxLength={40}
          />
          {customError ? <Text style={styles.formError}>{customError}</Text> : null}
          <Pressable style={styles.saveCustomButton} onPress={createCustomExercise}>
            <Text style={styles.saveCustomText}>Save and add to workout</Text>
          </Pressable>
        </View>
      )}
      {filteredExercises.length > 0 && (
        <View style={styles.quickAddList}>
          {filteredExercises.map((exercise) => (
            <Pressable key={exercise.id} style={styles.quickAdd} onPress={() => addExercise(exercise.name)}>
              <CirclePlus size={14} color="#A3E635" />
              <Text style={styles.quickAddText} numberOfLines={1}>{exercise.name}</Text>
              {completedThisWeekNames.has(getExerciseNameKey(exercise.name)) && (
                <Text style={styles.repeatedBadge}>DONE THIS WEEK</Text>
              )}
            </Pressable>
          ))}
        </View>
      )}
      {exerciseSearch.trim().length > 0 && filteredExercises.length === 0 && (
        <Text style={styles.noMatchesText}>No available matches. An exercise already in this workout can’t be added twice.</Text>
      )}

      {pendingSupersetExerciseId && (
        <View style={styles.supersetPrompt}>
          <Text style={styles.supersetPromptText}>Choose another exercise to pair, or cancel.</Text>
          <Pressable onPress={() => setPendingSupersetExerciseId(null)}>
            <Text style={styles.supersetCancelText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.exerciseList}>
        {draftExercises.map((exercise, exerciseIndex) => {
          const isComplete = exercise.sets.length > 0 && exercise.sets.every((set) => set.completed);
          const isViewingCompleted = isComplete && !editingCompletedExercises.has(exercise.id);
          const completedExerciseSets = exercise.sets.filter((set) => set.completed).length;
          const exerciseDefinition = availableExercises.find(
            (item) => getExerciseNameKey(item.name) === getExerciseNameKey(exercise.name),
          );

          return (
          <View key={exercise.id} style={[styles.exerciseCard, isViewingCompleted && styles.exerciseCardCompact]}>
            <View style={[styles.exerciseHeader, isViewingCompleted && styles.exerciseCardCompactHeader]}>
              <View style={styles.exerciseTitleWrap}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {exercise.muscle}
                  {exercise.supersetGroupId ? ' · SUPERSET' : ''}
                  {isViewingCompleted ? ` · Completed · ${completedExerciseSets}/${exercise.sets.length} sets` : ''}
                </Text>
              </View>
              <View style={styles.exerciseActions}>
                {exerciseDefinition && <ExerciseInfoButton exercise={exerciseDefinition} />}
                {isViewingCompleted && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${exercise.name}`}
                    onPress={() => setEditingCompletedExercises((current) => new Set(current).add(exercise.id))}
                    style={styles.editExerciseButton}
                  >
                    <Text style={styles.editExerciseButtonText}>Edit</Text>
                  </Pressable>
                )}
                {!isViewingCompleted && (
                  <>
                    <Pressable
                      accessibilityLabel="Move exercise up"
                      disabled={exerciseIndex === 0}
                      onPress={() => moveExercise(exercise.id, -1)}
                      style={styles.iconButton}
                    >
                      <ChevronUp size={18} color={exerciseIndex === 0 ? '#4F594F' : '#F5F7F2'} />
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Move exercise down"
                      disabled={exerciseIndex === draftExercises.length - 1}
                      onPress={() => moveExercise(exercise.id, 1)}
                      style={styles.iconButton}
                    >
                      <ChevronDown size={18} color={exerciseIndex === draftExercises.length - 1 ? '#4F594F' : '#F5F7F2'} />
                    </Pressable>
                    <Pressable
                      accessibilityLabel={`Remove ${exercise.name}`}
                      onPress={() => removeExercise(exercise.id)}
                      style={styles.iconButton}
                    >
                      <Trash2 size={17} color="#FF9E9E" />
                    </Pressable>
                  </>
                )}
              </View>
            </View>
            {!isViewingCompleted && (
              <View style={styles.exerciseCompletionRow}>
                <Text style={styles.exerciseCompletionCount}>
                  {completedExerciseSets}/{exercise.sets.length} sets
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={exercise.supersetGroupId
                    ? `Unpair ${exercise.name} from superset`
                    : `Pair ${exercise.name} as a superset`}
                  onPress={() => toggleSuperset(exercise.id)}
                  style={[
                    styles.supersetButton,
                    (exercise.supersetGroupId || pendingSupersetExerciseId === exercise.id)
                    && styles.supersetButtonActive,
                  ]}
                >
                  <Text style={[
                    styles.supersetButtonText,
                    (exercise.supersetGroupId || pendingSupersetExerciseId === exercise.id)
                    && styles.supersetButtonTextActive,
                  ]}>
                    {exercise.supersetGroupId
                      ? 'Unpair'
                      : pendingSupersetExerciseId === exercise.id ? 'Selected' : 'Superset'}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Mark ${exercise.name} complete`}
                  accessibilityState={{ disabled: exercise.sets.length === 0 }}
                  disabled={exercise.sets.length === 0}
                  onPress={() => toggleExerciseCompletion(exercise.id)}
                  style={styles.exerciseCompleteButton}
                >
                  <Check size={14} color="#A3E635" />
                  <Text style={styles.exerciseCompleteText}>Mark exercise complete</Text>
                </Pressable>
              </View>
            )}

            {!isViewingCompleted && (
              <View style={styles.setColumnHeader}>
                <Text style={[styles.setColumnIndex, exercise.muscle !== 'Cardio' && styles.setColumnIndexDrop]}>SET</Text>
                <Text style={styles.setColumnLabel}>{exercise.muscle === 'Cardio' ? 'MINUTES' : 'REPS'}</Text>
                {exercise.muscle !== 'Cardio' && <Text style={styles.setColumnLabel}>WEIGHT</Text>}
                {exercise.muscle !== 'Cardio' && <View style={styles.setColumnDrop} />}
                <View style={styles.setColumnAction} />
              </View>
            )}
            {exercise.sets.map((set: WorkoutSet, setIndex) => (
              <View key={set.id} style={[styles.setRow, isViewingCompleted && styles.setRowCompact, set.completed && !isViewingCompleted && styles.setRowComplete]}>
                <View style={[
                  styles.setCellSet,
                  isViewingCompleted && styles.setCellSetCompact,
                  exercise.muscle !== 'Cardio' && (isViewingCompleted ? styles.setCellSetCompactDrop : styles.setCellSetDrop),
                ]}>
                  {!isViewingCompleted && (
                    <Pressable
                      accessibilityLabel={`Mark set ${setIndex + 1} ${set.completed ? 'incomplete' : 'complete'}`}
                      onPress={() => toggleSet(exercise.id, set.id)}
                      style={[styles.setCheck, set.completed && styles.setCheckComplete]}
                    >
                      {set.completed && <Check size={14} color="#07100B" />}
                    </Pressable>
                  )}
                  <Text style={[styles.setLabel, isViewingCompleted && styles.setLabelCompact]}>{setIndex + 1}</Text>
                  {set.dropSet && isViewingCompleted ? (
                    <Text style={styles.dropSetBadgeCompact}>DROP</Text>
                  ) : null}
                </View>
                {exercise.muscle === 'Cardio' ? (
                  isViewingCompleted ? (
                    <Text style={[styles.setValue, isViewingCompleted && styles.setValueCompact]}>{set.reps}</Text>
                  ) : (
                    <TextInput
                      accessibilityLabel={`Set ${setIndex + 1} minutes`}
                      value={String(set.reps)}
                      onChangeText={(text) => updateSet(exercise.id, set.id, 'reps', text)}
                      keyboardType="numeric"
                      style={styles.setTableInput}
                      onFocus={(event) => {
                        focusedInputRef.current = findNodeHandle(event.target) ?? null;
                        scrollFocusedInputIntoView();
                      }}
                    />
                  )
                ) : (
                  isViewingCompleted ? (
                    <Text style={[styles.setValue, isViewingCompleted && styles.setValueCompact]}>{set.reps}</Text>
                  ) : (
                    <View style={styles.repsControl}>
                      <Pressable
                        accessibilityLabel={`Decrease set ${setIndex + 1} reps`}
                        onPress={() => updateSet(exercise.id, set.id, 'reps', String(Math.max(0, set.reps - 1)))}
                        style={styles.repAdjustButton}
                      >
                        <Minus size={13} color="#F3F6FB" />
                      </Pressable>
                      <TextInput
                        accessibilityLabel={`Set ${setIndex + 1} reps`}
                        value={String(set.reps)}
                        onChangeText={(text) => updateSet(exercise.id, set.id, 'reps', text)}
                        keyboardType="numeric"
                        style={styles.setTableInput}
                        onFocus={(event) => {
                          focusedInputRef.current = findNodeHandle(event.target) ?? null;
                          scrollFocusedInputIntoView();
                        }}
                      />
                      <Pressable
                        accessibilityLabel={`Increase set ${setIndex + 1} reps`}
                        onPress={() => updateSet(exercise.id, set.id, 'reps', String(set.reps + 1))}
                        style={styles.repAdjustButton}
                      >
                        <Plus size={13} color="#F3F6FB" />
                      </Pressable>
                    </View>
                  )
                )}
                {exercise.muscle !== 'Cardio' && (
                  isViewingCompleted ? (
                    <Text style={[styles.setValue, isViewingCompleted && styles.setValueCompact]}>
                      {set.weight > 0 ? `${set.weight} kg` : '—'}
                    </Text>
                  ) : (
                    <TextInput
                      accessibilityLabel={`Set ${setIndex + 1} weight in kilograms`}
                      value={weightInputs[set.id] ?? (set.weight > 0 ? String(set.weight) : '')}
                      onChangeText={(text) => updateWeight(exercise.id, set.id, text)}
                      onBlur={() => finishWeightInput(set.id)}
                      keyboardType="decimal-pad"
                      style={styles.setTableInput}
                      onFocus={(event) => {
                        focusedInputRef.current = findNodeHandle(event.target) ?? null;
                        scrollFocusedInputIntoView();
                      }}
                    />
                  )
                )}
                {!isViewingCompleted && exercise.muscle !== 'Cardio' && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${set.dropSet ? 'Remove drop set from' : 'Mark'} set ${setIndex + 1}${set.dropSet ? '' : ' as a drop set'}`}
                    accessibilityState={{ selected: set.dropSet === true }}
                    onPress={() => toggleDropSet(exercise.id, set.id)}
                    style={[styles.dropSetButton, set.dropSet && styles.dropSetButtonActive]}
                  >
                    <Text style={[styles.dropSetButtonText, set.dropSet && styles.dropSetButtonTextActive]}>
                      DROP
                    </Text>
                  </Pressable>
                )}
                {!isViewingCompleted && (
                  <Pressable accessibilityLabel={`Remove set ${setIndex + 1}`} onPress={() => removeSet(exercise.id, set.id)}>
                    <Trash2 size={15} color="#929B91" />
                  </Pressable>
                )}
              </View>
            ))}

            {!isViewingCompleted && (
              <Pressable style={styles.secondaryAction} onPress={() => addSet(exercise.id)}>
                <CirclePlus size={15} color="#A3E635" />
                <Text style={styles.secondaryActionText}>Add set</Text>
              </Pressable>
            )}
            {!isViewingCompleted && (() => {
              const previousSession = getExerciseHistory(workouts, exercise.name)[0];

              return previousSession ? (
                <View style={styles.historyBox}>
                  <Text style={styles.historyTitle}>Last time · {previousSession.workoutName}</Text>
                  <Text style={styles.historyDate}>
                    {new Date(previousSession.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                  <View style={styles.historySetHeader}>
                    <Text style={styles.historyColumnLabel}>SET</Text>
                    <Text style={styles.historyColumnLabel}>REPS</Text>
                    <Text style={styles.historyColumnLabel}>WEIGHT</Text>
                  </View>
                  {previousSession.sets.map((set, index) => (
                    <View key={`${previousSession.workoutId}-${index}`} style={styles.historySetRow}>
                      <Text style={styles.historySetValue}>{index + 1}</Text>
                      {set.dropSet && <Text style={styles.dropSetBadgeCompact}>DROP</Text>}
                      <Text style={styles.historySetValue}>{set.reps}</Text>
                      <Text style={styles.historySetValue}>{set.weight} kg</Text>
                    </View>
                  ))}
                </View>
              ) : null;
            })()}
          </View>
          );
        })}
      </View>

      {draftExercises.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Build your workout</Text>
          <Text style={styles.emptyText}>Search above and add an exercise to start logging sets.</Text>
        </View>
      )}
      <Pressable
        accessibilityRole="button"
        disabled={completedSets === 0}
        style={[styles.primaryAction, completedSets === 0 && styles.primaryActionDisabled]}
        onPress={saveWorkout}
      >
        <Play size={17} color="#090B09" />
        <Text style={styles.primaryActionText}>Finish workout</Text>
      </Pressable>
    </ScrollView>
    </KeyboardAvoidingView>
    <Modal
      visible={showDiscardConfirmation}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDiscardConfirmation(false)}
    >
      <View style={styles.discardBackdrop}>
        <View
          accessibilityViewIsModal
          style={styles.discardDialog}
        >
          <View style={styles.discardDialogTop}>
            <View style={styles.discardIcon}>
              <Trash2 size={21} color="#FF7777" />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Keep workout"
              onPress={() => setShowDiscardConfirmation(false)}
              style={styles.discardCloseButton}
            >
              <X size={18} color="#A8B5C7" />
            </Pressable>
          </View>
          <Text style={styles.discardEyebrow}>END SESSION</Text>
          <Text style={styles.discardTitle}>Discard this workout?</Text>
          <Text style={styles.discardDescription}>
            Your session and all logged sets will be permanently removed. This can’t be undone.
          </Text>
          <View style={styles.discardActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowDiscardConfirmation(false)}
              style={styles.keepWorkoutButton}
            >
              <Text style={styles.keepWorkoutButtonText}>Keep workout</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={confirmDiscardWorkout}
              style={styles.confirmDiscardButton}
            >
              <Trash2 size={16} color="#FF8A8A" />
              <Text style={styles.confirmDiscardButtonText}>Discard workout</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    </ScreenEntrance>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#080D16',
  },
  content: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  backText: {
    color: '#A3E635',
    fontWeight: '700',
    minWidth: 42,
  },
  discardText: {
    color: '#FF9E9E',
    fontSize: 10,
    fontWeight: '700',
  },
  discardBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: 'rgba(3, 7, 13, 0.78)',
  },
  discardDialog: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#344153',
    backgroundColor: '#111A27',
  },
  discardDialogTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  discardIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 119, 119, 0.28)',
    backgroundColor: 'rgba(255, 119, 119, 0.1)',
  },
  discardCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#202C3B',
  },
  discardEyebrow: {
    color: '#FF8A8A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  discardTitle: {
    color: '#F5F7F2',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    marginTop: 7,
  },
  discardDescription: {
    color: '#A8B5C7',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
  },
  discardActions: {
    gap: 10,
    marginTop: 24,
  },
  keepWorkoutButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#D3FF00',
  },
  keepWorkoutButtonText: {
    color: '#090B09',
    fontSize: 14,
    fontWeight: '800',
  },
  confirmDiscardButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 119, 119, 0.3)',
    backgroundColor: 'rgba(255, 119, 119, 0.08)',
  },
  confirmDiscardButtonText: {
    color: '#FF8A8A',
    fontSize: 13,
    fontWeight: '700',
  },
  heading: {
    color: '#F5F7F2',
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#35465B',
    backgroundColor: '#111A27',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  timerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D3FF00',
  },
  timerText: {
    color: '#D3FF00',
    fontVariant: ['tabular-nums'],
    fontSize: 12,
    fontWeight: '700',
  },
  sessionArtCard: {
    height: 138,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: '#111A27',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#263448',
    marginBottom: 14,
  },
  sessionArtImage: {
    resizeMode: 'cover',
  },
  sessionArtShade: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
    backgroundColor: 'rgba(5, 11, 19, 0.48)',
    gap: 5,
  },
  sessionArtEyebrow: {
    color: '#D3FF00',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sessionArtTitle: {
    color: '#F3F6FB',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '800',
  },
  sessionArtCaption: {
    color: '#A8B5C7',
    fontSize: 10,
  },
  notificationMessage: {
    color: '#A3E635',
    fontSize: 11,
    lineHeight: 16,
    marginTop: -7,
    marginBottom: 13,
  },
  card: {
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 16,
    marginBottom: 12,
  },
  label: {
    color: '#929B91',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#172334',
    borderColor: '#263448',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#F5F7F2',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#111A27',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 12,
  },
  summaryValue: {
    color: '#F5F7F2',
    fontSize: 19,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#929B91',
    fontSize: 10,
    marginTop: 4,
  },
  rotationCard: {
    backgroundColor: '#111A27',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#35465B',
    padding: 14,
    marginBottom: 20,
  },
  rotationHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rotationTitle: {
    color: '#F5F7F2',
    fontSize: 14,
    fontWeight: '800',
  },
  rotationSubtitle: {
    color: '#929B91',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  rotationList: {
    marginTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#263448',
  },
  rotationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#202D3D',
  },
  rotationItemCopy: {
    flex: 1,
  },
  rotationExercise: {
    color: '#E8EDF4',
    fontSize: 12,
    fontWeight: '700',
  },
  rotationFocus: {
    color: '#929B91',
    fontSize: 10,
    marginTop: 2,
  },
  rotationDate: {
    color: '#A3E635',
    fontSize: 10,
    fontWeight: '700',
  },
  rotationMore: {
    color: '#929B91',
    fontSize: 10,
    paddingTop: 8,
  },
  rotationNote: {
    color: '#A3E635',
    fontSize: 10,
    lineHeight: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#202D3D',
  },
  rotationEmpty: {
    color: '#A3E635',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 9,
  },
  sectionTitle: {
    color: '#F5F7F2',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 9,
  },
  nextExerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#172334',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#35465B',
    padding: 12,
    marginBottom: 12,
  },
  nextExerciseCopy: {
    flex: 1,
  },
  nextExerciseEyebrow: {
    color: '#A3E635',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  nextExerciseName: {
    color: '#F5F7F2',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  nextExerciseMeta: {
    color: '#929B91',
    fontSize: 10,
    marginTop: 3,
  },
  nextExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 9,
    backgroundColor: '#A3E635',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  nextExerciseButtonText: {
    color: '#07100B',
    fontSize: 12,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A27',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 12,
    marginBottom: 9,
  },
  searchInput: {
    flex: 1,
    color: '#F5F7F2',
    paddingVertical: 11,
    marginLeft: 8,
  },
  customToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    marginBottom: 9,
  },
  customToggleText: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '700',
  },
  customForm: {
    backgroundColor: '#111A27',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#35465B',
    padding: 12,
    gap: 9,
    marginBottom: 12,
  },
  formLabel: {
    color: '#929B91',
    fontSize: 11,
  },
  categoryChoices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChoice: {
    backgroundColor: '#172334',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  categoryChoiceActive: {
    backgroundColor: '#D3FF00',
    borderColor: '#D3FF00',
  },
  categoryChoiceText: {
    color: '#F5F7F2',
    fontSize: 10,
    fontWeight: '600',
  },
  categoryChoiceTextActive: {
    color: '#07100B',
  },
  formError: {
    color: '#FF9E9E',
    fontSize: 11,
  },
  saveCustomButton: {
    backgroundColor: '#D3FF00',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  saveCustomText: {
    color: '#07100B',
    fontWeight: '800',
    fontSize: 12,
  },
  noMatchesText: {
    color: '#929B91',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  quickAddList: {
    gap: 7,
    marginBottom: 18,
  },
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#172334',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  quickAddText: {
    flex: 1,
    color: '#F5F7F2',
    fontSize: 13,
  },
  repeatedBadge: {
    color: '#F6A66A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  exerciseList: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 14,
    marginBottom: 12,
  },
  exerciseCardCompact: {
    padding: 10,
    borderRadius: 13,
    marginBottom: 8,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseCardCompactHeader: {
    marginBottom: 4,
  },
  exerciseCompletionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  exerciseCompletionCount: {
    color: '#929B91',
    fontSize: 11,
    fontWeight: '600',
  },
  supersetButton: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#526174',
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  supersetButtonActive: {
    borderColor: '#A3E635',
    backgroundColor: '#192414',
  },
  supersetButtonText: {
    color: '#A8B5C7',
    fontSize: 10,
    fontWeight: '700',
  },
  supersetButtonTextActive: {
    color: '#D3FF00',
  },
  supersetPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#192414',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#49612E',
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 10,
  },
  supersetPromptText: {
    color: '#D5DBE5',
    fontSize: 11,
  },
  supersetCancelText: {
    color: '#D3FF00',
    fontSize: 11,
    fontWeight: '700',
  },
  exerciseCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#526174',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  exerciseCompleteButtonActive: {
    borderColor: '#A3E635',
    backgroundColor: '#A3E635',
  },
  exerciseCompleteText: {
    color: '#D5DBE5',
    fontSize: 11,
    fontWeight: '700',
  },
  exerciseCompleteTextActive: {
    color: '#07100B',
  },
  exerciseTitleWrap: {
    flex: 1,
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  editExerciseButton: {
    borderRadius: 8,
    backgroundColor: '#253244',
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginRight: 4,
  },
  editExerciseButtonText: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '800',
  },
  iconButton: {
    padding: 6,
  },
  exerciseName: {
    color: '#F5F7F2',
    fontSize: 17,
    fontWeight: '700',
  },
  exerciseMeta: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    gap: 6,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#253244',
  },
  setRowCompact: {
    minHeight: 28,
    paddingVertical: 1,
    borderBottomWidth: 0,
  },
  setRowComplete: {
    borderRadius: 10,
    backgroundColor: '#222E1B',
  },
  setColumnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3748',
    paddingBottom: 7,
    marginBottom: 7,
  },
  setColumnIndex: {
    color: '#8290A2',
    fontSize: 9,
    width: 41,
    fontWeight: '800',
  },
  setColumnIndexDrop: {
    width: 84,
  },
  setColumnLabel: {
    flex: 1,
    color: '#8290A2',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  setColumnAction: {
    width: 15,
  },
  setColumnDrop: {
    width: 44,
  },
  setCellSet: {
    width: 41,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setCellSetDrop: {
    width: 84,
  },
  setCellSetCompact: {
    width: 22,
    justifyContent: 'center',
  },
  setCellSetCompactDrop: {
    width: 48,
    flexDirection: 'row',
    gap: 4,
  },
  setCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#596451',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setCheckComplete: {
    backgroundColor: '#D3FF00',
    borderColor: '#D3FF00',
  },
  setLabel: {
    color: '#929B91',
    fontSize: 12,
    width: 15,
  },
  setLabelCompact: {
    width: 18,
    color: '#A3E635',
    fontSize: 11,
    fontWeight: '700',
  },
  dropSetButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#526174',
    paddingVertical: 5,
  },
  dropSetButtonActive: {
    borderColor: '#F6A66A',
    backgroundColor: '#3A2B20',
  },
  dropSetButtonText: {
    color: '#929B91',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dropSetButtonTextActive: {
    color: '#F6A66A',
  },
  dropSetBadgeCompact: {
    color: '#F6A66A',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  repsControl: {
    width: 100,
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  repAdjustButton: {
    width: 26,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#253244',
  },
  setInput: {
    flex: 1,
    minWidth: 40,
    backgroundColor: '#172334',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#263448',
    color: '#F5F7F2',
    paddingHorizontal: 7,
    paddingVertical: 8,
    textAlign: 'center',
  },
  setTableInput: {
    flex: 1,
    minWidth: 40,
    backgroundColor: '#172334',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263448',
    color: '#F3F6FB',
    paddingHorizontal: 6,
    paddingVertical: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  setValue: {
    flex: 1,
    minWidth: 40,
    color: '#F3F6FB',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 8,
  },
  setValueCompact: {
    paddingVertical: 2,
    fontSize: 12,
  },
  setUnit: {
    color: '#929B91',
    fontSize: 10,
    width: 23,
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#172334',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  secondaryActionText: {
    color: '#F5F7F2',
    fontSize: 12,
    fontWeight: '600',
  },
  historyBox: {
    backgroundColor: '#0D1420',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 11,
    marginTop: 12,
  },
  historyTitle: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  historyDate: {
    color: '#929B91',
    fontSize: 11,
    marginBottom: 8,
  },
  historySetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#293129',
    paddingBottom: 5,
    marginBottom: 3,
  },
  historyColumnLabel: {
    color: '#929B91',
    fontSize: 10,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  historySetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  historySetValue: {
    color: '#F5F7F2',
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 16,
    marginBottom: 18,
  },
  emptyTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },
  emptyText: {
    color: '#929B91',
    fontSize: 13,
    lineHeight: 19,
  },
  primaryAction: {
    backgroundColor: '#D3FF00',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 8,
    marginTop: 8,
  },
  primaryActionDisabled: {
    opacity: 0.45,
  },
  primaryActionText: {
    color: '#07100B',
    fontSize: 16,
    fontWeight: '800',
  },
});
