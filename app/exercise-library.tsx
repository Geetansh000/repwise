import { router } from 'expo-router';
import { Dumbbell, Plus, Search, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExerciseInfoButton } from '../components/ExerciseInfoButton';
import { ScreenEntrance } from '../components/ScreenEntrance';
import { exerciseLibrary, type Exercise } from '../data/exercises';
import { useAppStore } from '../stores/useAppStore';
import { getExerciseHistory } from '../lib/workoutHistory';

const categories: Exercise['category'][] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];

export default function ExerciseLibraryScreen() {
  const workouts = useAppStore((state) => state.workouts);
  const customExercises = useAppStore((state) => state.customExercises);
  const addCustomExercise = useAppStore((state) => state.addCustomExercise);
  const exercises = useMemo(() => [...exerciseLibrary, ...customExercises], [customExercises]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Exercise['category']>('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMuscle, setNewMuscle] = useState<Exercise['category']>('Chest');
  const [newEquipment, setNewEquipment] = useState('Dumbbells');
  const [formError, setFormError] = useState('');

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesQuery = exercise.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [exercises, query, selectedCategory]);

  const groupedExercises = selectedCategory === 'All'
    ? categories.map((category) => ({
        category,
        exercises: filteredExercises.filter((exercise) => exercise.category === category),
      })).filter((group) => group.exercises.length > 0)
    : [{ category: selectedCategory, exercises: filteredExercises }];

  const saveCustomExercise = () => {
    const name = newName.trim();
    if (!name) {
      setFormError('Enter an exercise name.');
      return;
    }

    if (exercises.some((exercise) => exercise.name.trim().toLowerCase() === name.toLowerCase())) {
      setFormError('An exercise with this name already exists.');
      return;
    }

    const exercise: Exercise = {
      id: `custom-${Date.now()}`,
      name,
      muscle: newMuscle,
      secondaryMuscles: [],
      equipment: newEquipment.trim() || 'Bodyweight',
      difficulty: 'Beginner',
      category: newMuscle,
      instructions: 'Custom exercise added to your personal library.',
    };

    addCustomExercise(exercise);
    setNewName('');
    setNewEquipment('Dumbbells');
    setFormError('');
    setShowCreateForm(false);
    setSelectedCategory('All');
    setQuery('');
  };

  const toggleCreateForm = () => {
    setShowCreateForm((open) => {
      if (!open) {
        setNewName(query.trim());
        setFormError('');
      }
      return !open;
    });
  };

  return (
    <ScreenEntrance>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.titleGroup}>
          <View style={styles.titleIcon}><Dumbbell size={17} color="#A3E635" /></View>
          <Text style={styles.heading}>Exercise library</Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color="#929B91" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercises"
          placeholderTextColor="#929B91"
          style={styles.searchInput}
        />
      </View>

      <Pressable style={styles.createToggle} onPress={toggleCreateForm}>
        {showCreateForm ? <X size={17} color="#A3E635" /> : <Plus size={17} color="#A3E635" />}
        <Text style={styles.createToggleText}>{showCreateForm ? 'Close form' : 'Create custom exercise'}</Text>
      </Pressable>

      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>Add a personal exercise</Text>
          <TextInput
            value={newName}
            onChangeText={(value) => {
              setNewName(value);
              setFormError('');
            }}
            placeholder="e.g. Dumbbell Bench Press"
            placeholderTextColor="#929B91"
            style={styles.formInput}
            maxLength={60}
          />
          <Text style={styles.formLabel}>Primary muscle group</Text>
          <View style={styles.formCategories}>
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setNewMuscle(category)}
                style={[styles.formCategory, newMuscle === category && styles.formCategoryActive]}
              >
                <Text style={[styles.formCategoryText, newMuscle === category && styles.formCategoryTextActive]}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={newEquipment}
            onChangeText={setNewEquipment}
            placeholder="Equipment"
            placeholderTextColor="#929B91"
            style={styles.formInput}
            maxLength={40}
          />
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          <Pressable style={styles.saveCustomButton} onPress={saveCustomExercise}>
            <Text style={styles.saveCustomText}>Save to my library</Text>
          </Pressable>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroller}>
        {(['All', ...categories] as const).map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>{category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {groupedExercises.map((group) => (
        <View key={group.category} style={styles.groupSection}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{group.category}</Text>
            <View style={styles.groupRule} />
            <Text style={styles.groupCount}>{group.exercises.length}</Text>
          </View>
          <View style={styles.exerciseList}>
            {group.exercises.map((exercise) => {
              const history = getExerciseHistory(workouts, exercise.name);
              const bestWeight = Math.max(
                0,
                ...history.flatMap((session) => session.sets.map((set) => set.weight)),
              );
              const bestSet = history
                .flatMap((session) => session.sets)
                .reduce(
                  (best, set) => set.weight > best.weight ? set : best,
                  { reps: 0, weight: 0, completed: false },
                );
              const bestDuration = Math.max(
                0,
                ...history.flatMap((session) => session.sets.map((set) => set.reps)),
              );

              return (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <View>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.metaText}>Primary: {exercise.muscle}</Text>
                    </View>
                    <View style={styles.exerciseHeaderActions}>
                      <ExerciseInfoButton exercise={exercise} />
                      <Text style={styles.level}>{exercise.difficulty}</Text>
                    </View>
                  </View>
                  <Text style={styles.metaText}>Equipment: {exercise.equipment}</Text>
                  <Text style={styles.metaText}>
                    Best logged set: {exercise.category === 'Cardio'
                      ? bestDuration > 0 ? `${bestDuration} min` : 'Not logged yet'
                      : bestWeight > 0 ? `${bestSet.reps} reps × ${bestWeight} kg` : 'Not logged yet'}
                  </Text>
                  <Text style={styles.instructions}>{exercise.instructions}</Text>
                  {history.length > 0 && (
                    <View style={styles.exerciseHistory}>
                      <Text style={styles.historyTitle}>Recent set history</Text>
                      {history.slice(0, 3).map((session) => (
                        <View key={session.workoutId} style={styles.historyRow}>
                          <Text style={styles.historyDate}>
                            {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </Text>
                          <Text style={styles.historyValues}>
                            {session.sets.map((set) => [
                              set.dropSet ? 'DROP' : '',
                              exercise.category === 'Cardio'
                                ? `${set.reps} min`
                                : `${set.reps} × ${set.weight}kg`,
                            ].filter(Boolean).join(' ')).join('  ·  ')}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {exercise.id.startsWith('custom-') && (
                    <Text style={styles.customTag}>MY EXERCISE</Text>
                  )}
                  <Pressable
                    style={styles.addButton}
                    onPress={() => router.push(`/workout-setup?exercise=${encodeURIComponent(exercise.id)}`)}
                  >
                    <Text style={styles.addText}>Start with this exercise</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      ))}
      {filteredExercises.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No matching exercises</Text>
          <Text style={styles.emptyText}>Try another name or choose a different category.</Text>
        </View>
      )}
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
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: '#172334',
    borderWidth: 1,
    borderColor: '#263448',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#A3E635',
    fontWeight: '700',
  },
  heading: {
    color: '#F5F7F2',
    fontSize: 24,
    fontWeight: '800',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111A27',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: '#F5F7F2',
    paddingVertical: 12,
    marginLeft: 8,
  },
  categoryScroller: {
    marginBottom: 16,
  },
  createToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 12,
  },
  createToggleText: {
    color: '#A3E635',
    fontSize: 13,
    fontWeight: '700',
  },
  createForm: {
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#35465B',
    padding: 16,
    marginBottom: 18,
    gap: 10,
  },
  formTitle: {
    color: '#F5F7F2',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  formLabel: {
    color: '#929B91',
    fontSize: 12,
  },
  formInput: {
    color: '#F5F7F2',
    backgroundColor: '#172334',
    borderWidth: 1,
    borderColor: '#263448',
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  formCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  formCategory: {
    backgroundColor: '#172334',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  formCategoryActive: {
    backgroundColor: '#D3FF00',
    borderColor: '#D3FF00',
  },
  formCategoryText: {
    color: '#F5F7F2',
    fontSize: 11,
    fontWeight: '600',
  },
  formCategoryTextActive: {
    color: '#090B09',
  },
  formError: {
    color: '#FF9E9E',
    fontSize: 12,
  },
  saveCustomButton: {
    backgroundColor: '#A3E635',
    borderRadius: 11,
    alignItems: 'center',
    paddingVertical: 11,
  },
  saveCustomText: {
    color: '#090B09',
    fontWeight: '800',
  },
  groupSection: {
    marginBottom: 18,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  groupTitle: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  groupRule: {
    flex: 1,
    height: 1,
    backgroundColor: '#293129',
  },
  groupCount: {
    color: '#929B91',
    fontSize: 11,
  },
  categoryChip: {
    backgroundColor: '#111A27',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#D3FF00',
    borderColor: '#D3FF00',
  },
  categoryText: {
    color: '#F5F7F2',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#07100B',
  },
  exerciseList: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseName: {
    color: '#F5F7F2',
    fontSize: 18,
    fontWeight: '700',
  },
  metaText: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 4,
  },
  level: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '700',
  },
  instructions: {
    color: '#F5F7F2',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  exerciseHistory: {
    backgroundColor: '#0D1420',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 11,
    marginBottom: 12,
  },
  historyTitle: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  historyRow: {
    paddingVertical: 4,
  },
  historyDate: {
    color: '#929B91',
    fontSize: 11,
  },
  historyValues: {
    color: '#F5F7F2',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 18,
  },
  customTag: {
    color: '#A3E635',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#D3FF00',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addText: {
    color: '#07100B',
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#111A27',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 18,
  },
  emptyTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    color: '#929B91',
    fontSize: 13,
    marginTop: 6,
  },
});
