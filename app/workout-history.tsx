import { router } from 'expo-router';
import { CalendarDays, Check, ChevronDown, ChevronUp, Clock3, Dumbbell } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle as SvgCircle, Line, Path, Rect } from 'react-native-svg';
import { ScreenEntrance } from '../components/ScreenEntrance';
import type { Workout } from '../stores/useAppStore';
import { useAppStore } from '../stores/useAppStore';

function getLocalDateKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatWorkoutDate(value: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString(undefined, options);
}

export default function WorkoutHistoryScreen() {
  const workouts = useAppStore((state) => state.workouts);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

  const days = useMemo(() => {
    const sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const grouped = new Map<string, Workout[]>();

    sortedWorkouts.forEach((workout) => {
      const key = getLocalDateKey(workout.date);
      grouped.set(key, [...(grouped.get(key) ?? []), workout]);
    });

    return [...grouped.entries()].map(([key, sessions]) => ({ key, sessions }));
  }, [workouts]);

  return (
    <ScreenEntrance>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Workout history</Text>
          <Text style={styles.subtitle}>Choose a day to revisit your sessions and sets.</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>YOUR TRAINING LOG</Text>
          <Text style={styles.heroTitle}>Progress, one{'\n'}session at a time.</Text>
          <Text style={styles.heroSubtitle}>Pick any day below to see what you lifted.</Text>
        </View>
        <Svg width={112} height={104} viewBox="0 0 112 104" accessibilityLabel="Dumbbell illustration">
          <SvgCircle cx={56} cy={52} r={43} fill="#202A1B" />
          <SvgCircle cx={56} cy={52} r={34} fill="none" stroke="#394B2A" strokeWidth={1} strokeDasharray="3 5" />
          <Line x1={29} y1={51} x2={83} y2={51} stroke="#A3E635" strokeWidth={7} strokeLinecap="round" />
          <Rect x={21} y={38} width={12} height={27} rx={4} fill="#F5F7F2" />
          <Rect x={12} y={33} width={9} height={37} rx={4} fill="#A3E635" />
          <Rect x={79} y={38} width={12} height={27} rx={4} fill="#F5F7F2" />
          <Rect x={91} y={33} width={9} height={37} rx={4} fill="#A3E635" />
          <Path d="M56 19v-7m0 80v-7m37-33h7M12 52H5" stroke="#779D35" strokeWidth={2} strokeLinecap="round" />
          <SvgCircle cx={56} cy={52} r={3} fill="#090B09" />
        </Svg>
      </View>

      {days.map(({ key, sessions }) => (
        <View key={key} style={styles.daySection}>
          <View style={styles.dayHeading}>
            <CalendarDays size={16} color="#A3E635" />
            <Text style={styles.dayTitle}>
              {formatWorkoutDate(sessions[0].date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>

          {sessions.map((workout) => {
            const expanded = expandedWorkoutId === workout.id;
            return (
              <View key={workout.id} style={styles.workoutCard}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${expanded ? 'Hide' : 'View'} ${workout.name} from ${formatWorkoutDate(workout.date, { month: 'long', day: 'numeric' })}`}
                  accessibilityState={{ expanded }}
                  onPress={() => setExpandedWorkoutId(expanded ? null : workout.id)}
                  style={styles.workoutButton}
                >
                  <View style={styles.workoutIcon}>
                    <Dumbbell size={17} color="#A3E635" />
                  </View>
                  <View style={styles.workoutSummary}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <Text style={styles.workoutMeta}>
                      {workout.exercises.length} exercises · {workout.volume.toLocaleString()} kg
                    </Text>
                    <View style={styles.durationMeta}>
                      <Clock3 size={11} color="#929B91" />
                      <Text style={styles.durationText}>{workout.duration} min</Text>
                    </View>
                  </View>
                  {expanded
                    ? <ChevronUp size={18} color="#929B91" />
                    : <ChevronDown size={18} color="#929B91" />}
                </Pressable>

                {expanded && (
                  <View style={styles.exerciseList}>
                    {workout.exercises.map((exercise) => (
                      <View key={exercise.id} style={styles.exercise}>
                        <View style={styles.exerciseHeading}>
                          <View style={styles.exerciseTitleGroup}>
                            <Dumbbell size={14} color="#A3E635" />
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                          </View>
                          <View style={styles.exerciseBadges}>
                            {exercise.supersetGroupId && (
                              <View style={styles.supersetTag}>
                                <Text style={styles.supersetText}>SUPERSET</Text>
                              </View>
                            )}
                            <View style={styles.muscleTag}>
                              <Text style={styles.exerciseMuscle}>{exercise.muscle}</Text>
                            </View>
                          </View>
                        </View>
                        {exercise.sets.map((set, index) => (
                          <View key={set.id} style={styles.setRow}>
                            <View style={styles.setNumberGroup}>
                              {set.completed
                                ? <Check size={12} color="#A3E635" />
                                : <View style={styles.incompleteMark} />}
                              <Text style={styles.setNumber}>
                                Set {index + 1}{set.dropSet ? ' · Drop' : ''}
                              </Text>
                            </View>
                            <Text style={styles.setValue}>
                              {set.reps} {exercise.muscle === 'Cardio' ? 'min' : 'reps'}
                            </Text>
                            {exercise.muscle !== 'Cardio' && (
                              <Text style={styles.setValue}>{set.weight > 0 ? `${set.weight} kg` : '—'}</Text>
                            )}
                            <Text style={[styles.setStatus, set.completed ? styles.completed : styles.incomplete]}>
                              {set.completed ? 'Done' : 'Not done'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ))}
                    {workout.exercises.length === 0 && (
                      <Text style={styles.emptyText}>No exercises were recorded for this session.</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {workouts.length === 0 && (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIllustration}>
            <Svg width={100} height={76} viewBox="0 0 100 76" accessibilityLabel="Workout history illustration">
              <Rect x={15} y={11} width={70} height={55} rx={12} fill="#1C231C" stroke="#394B2A" />
              <Path d="M28 49l12-12 9 8 15-17 9 8" fill="none" stroke="#A3E635" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              <Line x1={28} y1={55} x2={72} y2={55} stroke="#40502D" strokeWidth={2} strokeLinecap="round" />
              <SvgCircle cx={65} cy={28} r={3} fill="#F5F7F2" />
            </Svg>
          </View>
          <Text style={styles.emptyTitle}>No saved workouts yet</Text>
          <Text style={styles.emptyText}>Once you finish and save a session, you can revisit its exercises and sets here.</Text>
          <Pressable style={styles.startButton} onPress={() => router.push('/workout-setup')}>
            <Text style={styles.startButtonText}>Start a workout</Text>
          </Pressable>
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
  header: {
    marginBottom: 22,
  },
  backText: {
    color: '#A3E635',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  titleWrap: {
    gap: 5,
  },
  title: {
    color: '#F5F7F2',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#929B91',
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: '#111A27',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 15,
    minHeight: 132,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroCopy: {
    flex: 1,
    gap: 5,
  },
  heroEyebrow: {
    color: '#A3E635',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  heroTitle: {
    color: '#F5F7F2',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 23,
  },
  heroSubtitle: {
    color: '#929B91',
    fontSize: 10,
    lineHeight: 15,
    maxWidth: 180,
  },
  daySection: {
    marginBottom: 22,
  },
  dayHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dayTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
  },
  workoutCard: {
    backgroundColor: '#111A27',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#263448',
    marginBottom: 9,
    overflow: 'hidden',
  },
  workoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 14,
  },
  workoutIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172334',
    borderRadius: 12,
  },
  workoutSummary: {
    flex: 1,
  },
  workoutName: {
    color: '#F5F7F2',
    fontSize: 14,
    fontWeight: '700',
  },
  workoutMeta: {
    color: '#929B91',
    fontSize: 11,
    marginTop: 4,
  },
  durationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  durationText: {
    color: '#929B91',
    fontSize: 10,
  },
  exerciseList: {
    borderTopWidth: 1,
    borderTopColor: '#293129',
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  exercise: {
    paddingTop: 12,
    paddingBottom: 9,
  },
  exerciseHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  exerciseTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexShrink: 1,
  },
  exerciseName: {
    color: '#F5F7F2',
    fontSize: 13,
    fontWeight: '700',
  },
  exerciseMuscle: {
    color: '#929B91',
    fontSize: 11,
  },
  exerciseBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  supersetTag: {
    backgroundColor: '#192414',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#49612E',
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  supersetText: {
    color: '#D3FF00',
    fontSize: 9,
    fontWeight: '800',
  },
  muscleTag: {
    backgroundColor: '#202820',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#222922',
  },
  setNumber: {
    color: '#929B91',
    fontSize: 11,
  },
  setNumberGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  incompleteMark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#65705F',
  },
  setValue: {
    flex: 1,
    color: '#F5F7F2',
    fontSize: 11,
    textAlign: 'center',
  },
  setStatus: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
  },
  completed: {
    color: '#A3E635',
  },
  incomplete: {
    color: '#929B91',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 22,
    gap: 9,
  },
  emptyIllustration: {
    width: 100,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  emptyTitle: {
    color: '#F5F7F2',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: '#929B91',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#A3E635',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 4,
  },
  startButtonText: {
    color: '#090B09',
    fontSize: 12,
    fontWeight: '800',
  },
});
