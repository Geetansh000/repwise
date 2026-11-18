import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, Check, Dumbbell, Target } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenEntrance } from '../components/ScreenEntrance';
import { exerciseLibrary, getExerciseFocusGroup, workoutFocusGroups, type WorkoutFocusGroup } from '../data/exercises';
import { useAppStore } from '../stores/useAppStore';

export default function WorkoutSetupScreen() {
  const params = useLocalSearchParams<{ template?: string; exercise?: string }>();
  const customExercises = useAppStore((state) => state.customExercises);
  const initialGroup = useMemo(() => {
    if (typeof params.exercise !== 'string') return null;
    const exercise = [...exerciseLibrary, ...customExercises].find((item) => item.id === params.exercise);
    return exercise ? getExerciseFocusGroup(exercise) : null;
  }, [customExercises, params.exercise]);
  const [selectedMuscles, setSelectedMuscles] = useState<WorkoutFocusGroup[]>(
    initialGroup ? [initialGroup] : [],
  );
  const template = typeof params.template === 'string' ? params.template : undefined;

  const toggleMuscle = (muscle: WorkoutFocusGroup) => {
    setSelectedMuscles((current) => current.includes(muscle)
      ? current.filter((item) => item !== muscle)
      : [...current, muscle]);
  };

  const startWorkout = () => {
    if (selectedMuscles.length === 0) return;
    const search = new URLSearchParams({
      muscles: selectedMuscles.join(','),
      ...(template ? { template } : {}),
      ...(typeof params.exercise === 'string' ? { exercise: params.exercise } : {}),
    });
    router.push(`/workout-session?${search.toString()}`);
  };

  return (
    <ScreenEntrance>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={17} color="#A3E635" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.headingIcon}><Target size={21} color="#A3E635" /></View>
        <Text style={styles.heading}>What are you training?</Text>
        <Text style={styles.subtitle}>
          Choose one or more muscle groups. We’ll use them to filter the exercises in your workout.
        </Text>

        {template && (
          <View style={styles.templateCard}>
            <Dumbbell size={17} color="#A3E635" />
            <View>
              <Text style={styles.templateEyebrow}>WORKOUT TEMPLATE</Text>
              <Text style={styles.templateName}>{template}</Text>
            </View>
          </View>
        )}

        <View style={styles.muscleGrid}>
          {workoutFocusGroups.map((muscle) => {
            const selected = selectedMuscles.includes(muscle);
            return (
              <Pressable
                key={muscle}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                onPress={() => toggleMuscle(muscle)}
                style={[styles.muscleCard, selected && styles.muscleCardSelected]}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && <Check size={14} color="#10170A" strokeWidth={3} />}
                </View>
                <Text style={[styles.muscleName, selected && styles.muscleNameSelected]}>{muscle}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.selectionHint}>
          {selectedMuscles.length
            ? `${selectedMuscles.length} muscle group${selectedMuscles.length === 1 ? '' : 's'} selected`
            : 'Select at least one muscle group to continue'}
        </Text>

        <Pressable
          accessibilityRole="button"
          disabled={selectedMuscles.length === 0}
          onPress={startWorkout}
          style={[styles.continueButton, selectedMuscles.length === 0 && styles.continueButtonDisabled]}
        >
          <Text style={styles.continueText}>Continue to workout</Text>
          <ArrowRight size={17} color="#10170A" />
        </Pressable>
      </ScrollView>
    </ScreenEntrance>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#080D16',
  },
  content: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 25,
  },
  backText: {
    color: '#A3E635',
    fontSize: 14,
    fontWeight: '700',
  },
  headingIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#172334',
    borderWidth: 1,
    borderColor: '#263448',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  heading: {
    color: '#F5F7F2',
    fontSize: 27,
    fontWeight: '800',
  },
  subtitle: {
    color: '#929B91',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111A27',
    borderWidth: 1,
    borderColor: '#263448',
    borderRadius: 15,
    padding: 14,
    marginBottom: 18,
  },
  templateEyebrow: {
    color: '#929B91',
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  templateName: {
    color: '#F5F7F2',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  muscleCard: {
    width: '48%',
    minHeight: 64,
    flexGrow: 1,
    flexBasis: 140,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    borderRadius: 15,
    backgroundColor: '#111A27',
    borderWidth: 1,
    borderColor: '#263448',
  },
  muscleCardSelected: {
    backgroundColor: '#202D1A',
    borderColor: '#A3E635',
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#526174',
  },
  checkboxSelected: {
    backgroundColor: '#A3E635',
    borderColor: '#A3E635',
  },
  muscleName: {
    color: '#D5DBE5',
    fontSize: 14,
    fontWeight: '700',
  },
  muscleNameSelected: {
    color: '#F5F7F2',
  },
  selectionHint: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 20,
  },
  continueButton: {
    minHeight: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    borderRadius: 15,
    backgroundColor: '#A3E635',
  },
  continueButtonDisabled: {
    opacity: 0.45,
  },
  continueText: {
    color: '#10170A',
    fontSize: 14,
    fontWeight: '800',
  },
});
