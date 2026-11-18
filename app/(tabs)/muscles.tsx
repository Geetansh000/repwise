import { router } from 'expo-router';
import { Activity, Dumbbell, Flame, Zap } from 'lucide-react-native';
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';
import { useMemo, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { ScreenEntrance } from '../../components/ScreenEntrance';
import { muscleDefinitions, muscleStatusColors } from '../../data/muscleMap';
import { getWorkoutMetrics } from '../../lib/analytics';
import { getExerciseHistory } from '../../lib/workoutHistory';
import { useAppStore } from '../../stores/useAppStore';

const GROUPS = [
  { name: 'Chest', icon: Dumbbell, muscles: ['Chest'] },
  { name: 'Back', icon: Activity, muscles: ['Upper back', 'Lats', 'Traps'] },
  { name: 'Shoulders', icon: Zap, muscles: ['Front deltoids', 'Side deltoids', 'Rear deltoids'] },
  { name: 'Arms', icon: Dumbbell, muscles: ['Biceps', 'Triceps', 'Forearms'] },
  { name: 'Core', icon: Flame, muscles: ['Abs', 'Obliques'] },
  { name: 'Legs', icon: Activity, muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'] },
];

const animateLayout = () => {
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export default function MusclesScreen() {
  const selectedMuscleName = useAppStore((state) => state.selectedMuscle);
  const updateSelectedMuscle = useAppStore((state) => state.updateSelectedMuscle);
  const workouts = useAppStore((state) => state.workouts);
  const metrics = useMemo(() => getWorkoutMetrics(workouts), [workouts]);
  const [view, setView] = useState<'front' | 'back'>('front');
  const [breakdownPeriod, setBreakdownPeriod] = useState<'week' | 'all'>('week');

  const filteredMuscles = muscleDefinitions.filter((muscle) => muscle.side === view);
  const selectedMuscle = filteredMuscles.find((muscle) => muscle.name === selectedMuscleName) || filteredMuscles[0];
  const selectedMetrics = selectedMuscle ? metrics.muscleMetrics(selectedMuscle.name) : null;
  const breakdownData = breakdownPeriod === 'week' ? metrics.muscleBreakdown : metrics.allTimeMuscleBreakdown;
  const selectedBreakdown = selectedMuscle
    ? breakdownData.find((muscle) => muscle.name === selectedMuscle.name)
    : null;
  const selectedHistory = selectedMuscle
    ? getExerciseHistory(workouts, selectedMuscle.name).slice(0, 5)
    : [];
  const totalSets = breakdownData.reduce((total, muscle) => total + muscle.sets, 0);

  return (
    <ScreenEntrance>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <View style={styles.titleIcon}>
          <Activity size={20} color="#A3E635" />
        </View>
        <View>
          <Text style={styles.heading}>Muscle analytics</Text>
          <Text style={styles.subtitle}>Weekly sets, training load and history</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Flame size={18} color="#090B09" />
        </View>
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryValue}>{totalSets}</Text>
          <Text style={styles.summaryLabel}>completed sets {breakdownPeriod === 'week' ? 'this week' : 'all time'}</Text>
        </View>
        <Text style={styles.summaryHint}>{metrics.workoutsThisWeek} sessions</Text>
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>Muscle-wise breakdown</Text>
        <Text style={styles.periodLabel}>THIS WEEK</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Sets are attributed to each exercise’s primary muscle only, so secondary muscles aren’t double-counted.
      </Text>
      <View style={styles.periodToggle}>
        {([
          { key: 'week', label: 'This week' },
          { key: 'all', label: 'All time' },
        ] as const).map((period) => (
          <Pressable
            key={period.key}
            style={[styles.periodButton, breakdownPeriod === period.key && styles.periodButtonActive]}
            onPress={() => {
              animateLayout();
              setBreakdownPeriod(period.key);
            }}
          >
            <Text style={[styles.periodButtonText, breakdownPeriod === period.key && styles.periodButtonTextActive]}>
              {period.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {GROUPS.map((group) => {
        const groupMuscles = group.muscles
          .map((name) => breakdownData.find((muscle) => muscle.name === name))
          .filter((muscle): muscle is (typeof metrics.muscleBreakdown)[number] => Boolean(muscle));
        const groupSets = groupMuscles.reduce((total, muscle) => total + muscle.sets, 0);
        const Icon = group.icon;

        return (
          <View key={group.name} style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <View style={styles.breakdownIcon}>
                <Icon size={16} color={groupSets > 0 ? '#A3E635' : '#929B91'} />
              </View>
              <Text style={styles.breakdownTitle}>{group.name}</Text>
              <View style={styles.groupRule} />
              <Text style={styles.groupSetCount}>{groupSets} sets</Text>
            </View>
            {groupMuscles.map((muscle) => (
              <Pressable
                key={muscle.name}
                accessibilityRole="button"
                accessibilityLabel={`${muscle.name}, ${muscle.sets} completed sets this week`}
                onPress={() => {
                  animateLayout();
                  updateSelectedMuscle(muscle.name);
                  if (muscleDefinitions.find((item) => item.name === muscle.name)?.side) {
                    setView(muscleDefinitions.find((item) => item.name === muscle.name)?.side ?? 'front');
                  }
                }}
                style={styles.breakdownRow}
              >
                <View style={styles.breakdownMuscleInfo}>
                  <Text style={[styles.breakdownMuscle, selectedMuscleName === muscle.name && styles.selectedMuscleText]}>
                    {muscle.name}
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[
                      styles.progressFill,
                      { width: `${muscle.percent}%`, backgroundColor: muscle.color },
                    ]} />
                  </View>
                </View>
                <Text style={styles.breakdownNumbers}>{muscle.sets} <Text style={styles.breakdownMuted}>sets</Text></Text>
              </Pressable>
            ))}
          </View>
        );
      })}

      {workouts.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your breakdown will show here</Text>
          <Text style={styles.emptyText}>Complete and save a workout with at least one set marked done. We’ll show each muscle’s weekly sets, volume, and training history.</Text>
          <Pressable style={styles.emptyAction} onPress={() => router.push('/(tabs)/workout')}>
            <Dumbbell size={15} color="#090B09" />
            <Text style={styles.emptyActionText}>Log a workout</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>Anatomical map</Text>
      </View>
      <View style={styles.segmentedControl}>
        <Pressable
          style={[styles.segmentButton, view === 'front' && styles.segmentActive]}
          onPress={() => {
            animateLayout();
            setView('front');
          }}
        >
          <Text style={[styles.segmentText, view === 'front' && styles.segmentTextActive]}>Front</Text>
        </Pressable>
        <Pressable
          style={[styles.segmentButton, view === 'back' && styles.segmentActive]}
          onPress={() => {
            animateLayout();
            setView('back');
          }}
        >
          <Text style={[styles.segmentText, view === 'back' && styles.segmentTextActive]}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.legendRow}>
        {[
          { label: 'Trained', color: muscleStatusColors.trained },
          { label: 'Moderate', color: muscleStatusColors.moderate },
          { label: 'No recent sets', color: muscleStatusColors.idle },
        ].map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.mapCard}>
        <Svg width="100%" height={440} viewBox="0 0 260 580">
          <Path
            d="M102 40 C 118 26, 140 26, 158 40 L 176 58 C 198 86, 196 124, 190 148 L 192 172 C 194 182, 184 186, 176 188 L 168 220 L 170 250 L 160 308 L 148 430 L 142 520 C 136 542, 110 542, 104 520 L 98 430 L 88 300 L 82 220 L 76 192 C 68 182, 58 178, 60 156 L 66 128 C 68 96, 76 82, 102 40 Z"
            fill="#1C231C"
            stroke="#293129"
            strokeWidth={2}
          />
          {filteredMuscles.map((muscle) => {
            const active = selectedMuscle?.id === muscle.id;
            const training = metrics.muscleMetrics(muscle.name);
            return (
              <Path
                key={muscle.id}
                d={muscle.path}
                fill={active ? '#A3E635' : muscleStatusColors[training.status]}
                stroke={active ? '#F5F7F2' : '#101510'}
                strokeWidth={active ? 2 : 1}
                {...(Platform.OS === 'web' ? {} : { onPress: () => {
                  animateLayout();
                  updateSelectedMuscle(muscle.name);
                } })}
                opacity={active ? 1 : 0.88}
              />
            );
          })}
        </Svg>
      </View>

      {selectedMuscle && selectedMetrics && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailEyebrow}>{selectedMetrics.status.toUpperCase()}</Text>
              <Text style={styles.detailTitle}>{selectedMuscle.name}</Text>
            </View>
            <View style={[styles.detailStatusDot, { backgroundColor: muscleStatusColors[selectedMetrics.status] }]} />
          </View>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Completed sets {breakdownPeriod === 'week' ? 'this week' : 'all time'}</Text>
              <Text style={styles.metricValue}>{selectedBreakdown?.sets ?? 0}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Logged volume</Text>
              <Text style={styles.metricValue}>{(selectedBreakdown?.volume ?? 0).toLocaleString()} kg</Text>
            </View>
          </View>
          <Text style={styles.historySectionTitle}>Exercise history</Text>
          {selectedHistory.length > 0 ? selectedHistory.map((session) => (
            <View key={session.workoutId} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyWorkout}>{session.workoutName}</Text>
                <Text style={styles.historyDate}>
                  {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
              {session.sets.map((set, index) => (
                <View key={`${session.workoutId}-${index}`} style={styles.historySetRow}>
                  <Text style={styles.historySetNumber}>
                    SET {index + 1}{set.dropSet ? ' · DROP' : ''}
                  </Text>
                  <Text style={styles.historySetValue}>{set.reps} reps</Text>
                  <Text style={styles.historySetValue}>{set.weight} kg</Text>
                </View>
              ))}
            </View>
          )) : (
            <View style={styles.noHistory}>
              <Text style={styles.noHistoryText}>No completed sets logged for {selectedMuscle.name} yet.</Text>
              <Pressable onPress={() => router.push('/(tabs)/workout')}>
                <Text style={styles.logLink}>Start a workout →</Text>
              </Pressable>
            </View>
          )}
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
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3FF00',
    borderRadius: 18,
    padding: 14,
    marginBottom: 22,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(9,11,9,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCopy: {
    flex: 1,
    marginLeft: 10,
  },
  summaryValue: {
    color: '#07100B',
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '900',
  },
  summaryLabel: {
    color: '#2D3A00',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryHint: {
    color: '#2D3A00',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#F5F7F2',
    fontSize: 18,
    fontWeight: '800',
  },
  periodLabel: {
    color: '#D3FF00',
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#929B91',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  periodToggle: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#111A27',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 3,
    marginBottom: 10,
  },
  periodButton: {
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  periodButtonActive: {
    backgroundColor: '#D3FF00',
  },
  periodButtonText: {
    color: '#929B91',
    fontSize: 11,
    fontWeight: '700',
  },
  periodButtonTextActive: {
    color: '#07100B',
  },
  breakdownCard: {
    backgroundColor: '#111A27',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 13,
    marginBottom: 9,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  breakdownIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#172334',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownTitle: {
    color: '#F5F7F2',
    fontSize: 14,
    fontWeight: '700',
  },
  groupRule: {
    flex: 1,
    height: 1,
    backgroundColor: '#293129',
  },
  groupSetCount: {
    color: '#A3E635',
    fontSize: 11,
    fontWeight: '700',
  },
  breakdownRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
    paddingLeft: 36,
  },
  breakdownMuscleInfo: {
    flex: 1,
    gap: 5,
  },
  breakdownMuscle: {
    color: '#C6CDC3',
    fontSize: 12,
  },
  selectedMuscleText: {
    color: '#A3E635',
    fontWeight: '700',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#293129',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 3,
  },
  breakdownNumbers: {
    color: '#F5F7F2',
    fontSize: 12,
    fontWeight: '800',
    minWidth: 42,
    textAlign: 'right',
  },
  breakdownMuted: {
    color: '#929B91',
    fontWeight: '400',
    fontSize: 10,
  },
  emptyCard: {
    backgroundColor: '#111A27',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 15,
    marginBottom: 22,
  },
  emptyTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },
  emptyText: {
    color: '#929B91',
    fontSize: 12,
    lineHeight: 18,
  },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: '#D3FF00',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  emptyActionText: {
    color: '#07100B',
    fontSize: 12,
    fontWeight: '800',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#111A27',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#D3FF00',
  },
  segmentText: {
    color: '#929B91',
    fontWeight: '700',
    fontSize: 12,
  },
  segmentTextActive: {
    color: '#07100B',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13,
    marginBottom: 9,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: '#929B91',
    fontSize: 10,
  },
  mapCard: {
    backgroundColor: '#111A27',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 9,
    marginBottom: 12,
    alignItems: 'center',
  },
  detailCard: {
    backgroundColor: '#111A27',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 15,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailEyebrow: {
    color: '#A3E635',
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '800',
    marginBottom: 4,
  },
  detailTitle: {
    color: '#F5F7F2',
    fontSize: 21,
    fontWeight: '800',
  },
  detailStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#172334',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: '#293129',
  },
  metricLabel: {
    color: '#929B91',
    fontSize: 10,
    minHeight: 26,
  },
  metricValue: {
    color: '#F5F7F2',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 3,
  },
  historySectionTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 9,
  },
  historyCard: {
    backgroundColor: '#101510',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#293129',
    padding: 11,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  historyWorkout: {
    color: '#F5F7F2',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  historyDate: {
    color: '#929B91',
    fontSize: 10,
  },
  historySetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#202820',
  },
  historySetNumber: {
    color: '#929B91',
    fontSize: 9,
    fontWeight: '700',
    flex: 1,
  },
  historySetValue: {
    color: '#A3E635',
    fontSize: 11,
    fontWeight: '700',
    minWidth: 46,
    textAlign: 'right',
  },
  noHistory: {
    backgroundColor: '#101510',
    borderRadius: 12,
    padding: 12,
  },
  noHistoryText: {
    color: '#929B91',
    fontSize: 12,
    lineHeight: 18,
  },
  logLink: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 9,
  },
});
