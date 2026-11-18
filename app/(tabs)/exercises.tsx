import { router } from 'expo-router';
import { Dumbbell, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ExerciseInfoButton } from '../../components/ExerciseInfoButton';
import { ScreenEntrance } from '../../components/ScreenEntrance';
import { exerciseLibrary, type Exercise } from '../../data/exercises';
import { muscleDefinitions } from '../../data/muscleMap';
import { useAppStore } from '../../stores/useAppStore';

type MuscleView = 'front' | 'back' | 'other';

const viewOptions: { key: MuscleView; label: string }[] = [
  { key: 'front', label: 'Front' },
  { key: 'back', label: 'Back' },
  { key: 'other', label: 'Other' },
];

const extraMuscleSides: Record<string, MuscleView> = {
  'Lower back': 'back',
  Adductors: 'front',
};

const bodyOutline = 'M102 40 C 118 26, 140 26, 158 40 L 176 58 C 198 86, 196 124, 190 148 L 192 172 C 194 182, 184 186, 176 188 L 168 220 L 170 250 L 160 308 L 148 430 L 142 520 C 136 542, 110 542, 104 520 L 98 430 L 88 300 L 82 220 L 76 192 C 68 182, 58 178, 60 156 L 66 128 C 68 96, 76 82, 102 40 Z';

export default function ExercisesScreen() {
  const customExercises = useAppStore((state) => state.customExercises);
  const exercises = useMemo(() => [...exerciseLibrary, ...customExercises], [customExercises]);
  const [view, setView] = useState<MuscleView>('front');
  const [selectedMuscle, setSelectedMuscle] = useState('Chest');
  const [query, setQuery] = useState('');

  const availableMuscles = useMemo(() => {
    const catalogMuscles = [...new Set(exercises.map((exercise) => exercise.muscle))];
    if (view === 'other') return catalogMuscles.filter((muscle) => muscle === 'Cardio');

    const anatomyMuscles = muscleDefinitions
      .filter((muscle) => muscle.side === view)
      .map((muscle) => muscle.name);
    return [...new Set([...anatomyMuscles, ...catalogMuscles.filter((muscle) => (
      extraMuscleSides[muscle] === view
    ))])].filter((muscle) => catalogMuscles.includes(muscle));
  }, [exercises, view]);

  const visibleMuscles = view === 'other'
    ? []
    : muscleDefinitions.filter((muscle) => muscle.side === view && availableMuscles.includes(muscle.name));
  const selectedMuscleName = availableMuscles.includes(selectedMuscle)
    ? selectedMuscle
    : availableMuscles[0] ?? '';

  const matchingExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return exercises.filter((exercise) => (
      exercise.muscle === selectedMuscleName
      && (!normalizedQuery || exercise.name.toLowerCase().includes(normalizedQuery))
    ));
  }, [exercises, query, selectedMuscleName]);

  const selectView = (nextView: MuscleView) => {
    setView(nextView);
    setQuery('');
    if (nextView === 'other') {
      setSelectedMuscle('Cardio');
      return;
    }

    const nextMuscles = muscleDefinitions
      .filter((muscle) => muscle.side === nextView)
      .map((muscle) => muscle.name);
    const catalogMuscles = [...new Set(exercises.map((exercise) => exercise.muscle))];
    const firstMuscle = [...new Set([...nextMuscles, ...catalogMuscles.filter((muscle) => (
      extraMuscleSides[muscle] === nextView
    ))])].find((muscle) => catalogMuscles.includes(muscle));
    setSelectedMuscle(firstMuscle ?? '');
  };

  const selectMuscle = (muscle: string) => {
    setSelectedMuscle(muscle);
    setQuery('');
  };

  return (
    <ScreenEntrance>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Dumbbell size={20} color="#A3E635" />
          </View>
          <View>
            <Text style={styles.heading}>Exercises</Text>
            <Text style={styles.subtitle}>Choose a muscle group to explore exercises</Text>
          </View>
        </View>

        <View style={styles.viewToggle}>
          {viewOptions.map((option) => (
            <Pressable
              key={option.key}
              accessibilityRole="button"
              accessibilityState={{ selected: view === option.key }}
              onPress={() => selectView(option.key)}
              style={[styles.viewButton, view === option.key && styles.viewButtonActive]}
            >
              <Text style={[styles.viewButtonText, view === option.key && styles.viewButtonTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {view === 'other' ? (
          <View style={styles.otherGroup}>
            <Text style={styles.otherTitle}>Cardio</Text>
            <Text style={styles.otherSubtitle}>Browse cardio exercises and conditioning.</Text>
          </View>
        ) : (
          <View style={styles.mapCard}>
            <Svg width="100%" height={280} viewBox="0 0 260 580" accessibilityLabel={`${view} muscle map`}>
              <Path d={bodyOutline} fill="#1C2736" stroke="#35465B" strokeWidth={2} />
              {visibleMuscles.map((muscle) => {
                const active = selectedMuscleName === muscle.name;
                return (
                  <Path
                    key={muscle.id}
                    d={muscle.path}
                    fill={active ? '#A3E635' : '#405166'}
                    stroke={active ? '#F5F7F2' : '#111A27'}
                    strokeWidth={active ? 2 : 1}
                    {...(Platform.OS === 'web' ? {} : { onPress: () => selectMuscle(muscle.name) })}
                  />
                );
              })}
            </Svg>
            <Text style={styles.mapHint}>Tap a muscle or select it below</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Select a muscle</Text>
        <View style={styles.muscleGrid}>
          {availableMuscles.map((muscle) => {
            const count = exercises.filter((exercise) => exercise.muscle === muscle).length;
            const selected = muscle === selectedMuscleName;
            return (
              <Pressable
                key={muscle}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => selectMuscle(muscle)}
                style={[styles.muscleCard, selected && styles.muscleCardActive]}
              >
                <Text style={[styles.muscleName, selected && styles.muscleNameActive]}>{muscle}</Text>
                <Text style={[styles.muscleCount, selected && styles.muscleCountActive]}>
                  {count} {count === 1 ? 'exercise' : 'exercises'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.exerciseHeading}>
          <View>
            <Text style={styles.sectionTitle}>{selectedMuscleName || 'Exercises'}</Text>
            <Text style={styles.sectionSubtitle}>{matchingExercises.length} exercises</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Search size={17} color="#929B91" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${selectedMuscleName.toLowerCase()} exercises`}
            placeholderTextColor="#8290A2"
            style={styles.searchInput}
            accessibilityLabel={`Search ${selectedMuscleName.toLowerCase()} exercises`}
          />
        </View>

        {matchingExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
        {matchingExercises.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No matching exercises</Text>
            <Text style={styles.emptyText}>Try a different search or select another muscle group.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenEntrance>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseCopy}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseMeta}>{exercise.equipment} · {exercise.difficulty}</Text>
        </View>
        <ExerciseInfoButton exercise={exercise} />
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(`/workout-setup?exercise=${encodeURIComponent(exercise.id)}`)}
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>Start with this exercise</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#080D16',
  },
  content: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 44,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  titleIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#172334',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: '#F5F7F2',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 3,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#111A27',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 4,
    marginBottom: 14,
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 9,
    paddingVertical: 9,
  },
  viewButtonActive: {
    backgroundColor: '#D3FF00',
  },
  viewButtonText: {
    color: '#929B91',
    fontSize: 12,
    fontWeight: '700',
  },
  viewButtonTextActive: {
    color: '#07100B',
  },
  mapCard: {
    alignItems: 'center',
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 13,
    marginBottom: 20,
  },
  mapHint: {
    color: '#8290A2',
    fontSize: 10,
    marginTop: 2,
  },
  otherGroup: {
    backgroundColor: '#111A27',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 16,
    marginBottom: 20,
  },
  otherTitle: {
    color: '#F5F7F2',
    fontSize: 16,
    fontWeight: '800',
  },
  otherSubtitle: {
    color: '#929B91',
    fontSize: 11,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#F5F7F2',
    fontSize: 17,
    fontWeight: '800',
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 22,
  },
  muscleCard: {
    width: '48%',
    flexGrow: 1,
    minHeight: 58,
    justifyContent: 'center',
    backgroundColor: '#111A27',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  muscleCardActive: {
    backgroundColor: '#192414',
    borderColor: '#A3E635',
  },
  muscleName: {
    color: '#E4EAF2',
    fontSize: 12,
    fontWeight: '700',
  },
  muscleNameActive: {
    color: '#D3FF00',
  },
  muscleCount: {
    color: '#8290A2',
    fontSize: 10,
    marginTop: 3,
  },
  muscleCountActive: {
    color: '#B9C9A1',
  },
  exerciseHeading: {
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#8290A2',
    fontSize: 10,
    marginTop: 3,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A27',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 11,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F5F7F2',
    paddingVertical: 11,
    marginLeft: 8,
    fontSize: 12,
  },
  exerciseCard: {
    backgroundColor: '#111A27',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 13,
    marginBottom: 9,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 11,
  },
  exerciseCopy: {
    flex: 1,
  },
  exerciseName: {
    color: '#F5F7F2',
    fontSize: 14,
    fontWeight: '800',
  },
  exerciseMeta: {
    color: '#929B91',
    fontSize: 10,
    marginTop: 4,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: '#D3FF00',
    borderRadius: 10,
    paddingVertical: 10,
  },
  startButtonText: {
    color: '#07100B',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#111A27',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 16,
  },
  emptyTitle: {
    color: '#F5F7F2',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyText: {
    color: '#929B91',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
});
