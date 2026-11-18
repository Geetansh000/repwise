import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Activity, Award, Clock3, Dumbbell, Flame, TrendingUp } from 'lucide-react-native';
import { WorkoutLineChart } from '../../components/Charts';
import { MuscleDonut } from '../../components/DashboardVisuals';
import { ScreenEntrance } from '../../components/ScreenEntrance';
import { getWorkoutMetrics } from '../../lib/analytics';
import { useAppStore } from '../../stores/useAppStore';

export default function ProgressScreen() {
  const workouts = useAppStore((state) => state.workouts);
  const metrics = getWorkoutMetrics(workouts);
  const hasHistory = workouts.length > 0;

  return (
    <ScreenEntrance>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headingRow}>
        <View style={styles.headingIcon}><TrendingUp size={19} color="#A3E635" /></View>
        <View>
          <Text style={styles.heading}>Progress</Text>
          <Text style={styles.subheading}>Small wins. Stronger weeks.</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Workout summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryStat}>
            <Dumbbell size={16} color="#A3E635" />
            <Text style={styles.summaryValue}>{metrics.workoutsThisWeek}</Text>
            <Text style={styles.summaryLabel}>Workouts</Text>
          </View>
          <View style={styles.summaryStat}>
            <Clock3 size={16} color="#A3E635" />
            <Text style={styles.summaryValue}>{metrics.totalMinutes}m</Text>
            <Text style={styles.summaryLabel}>Time</Text>
          </View>
          <View style={styles.summaryStat}>
            <Activity size={16} color="#A3E635" />
            <Text style={styles.summaryValue}>{metrics.totalVolume.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Volume kg</Text>
          </View>
          <View style={styles.summaryStat}>
            <Award size={16} color="#A3E635" />
            <Text style={styles.summaryValue}>{metrics.personalRecords}</Text>
            <Text style={styles.summaryLabel}>PRs</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.title}>Muscle focus</Text>
            <Text style={styles.cardSubtitle}>Training distribution this week</Text>
          </View>
          <Flame size={18} color="#D3FF00" />
        </View>
        <MuscleDonut segments={metrics.muscleDistribution.slice(0, 5)} />
      </View>

      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.title}>Monthly volume</Text>
            <Text style={styles.cardSubtitle}>Logged weight × reps</Text>
          </View>
          <TrendingUp size={18} color="#D3FF00" />
        </View>
        {hasHistory ? (
          <WorkoutLineChart
            labels={metrics.volumeByMonth.map((month) => month.label)}
            data={metrics.volumeByMonth.map((month) => month.value)}
            width={Math.min(Dimensions.get('window').width - 52, 700)}
            height={220}
          />
        ) : (
          <Text style={styles.emptyText}>Your volume trend will appear after you log a workout.</Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.title}>Best logged lifts</Text>
          <Award size={18} color="#D3FF00" />
        </View>
        {metrics.bestLifts.map((lift) => (
          <View key={lift.name} style={styles.listItem}>
            <Text style={styles.listText}>{lift.name}</Text>
            <Text style={styles.listValue}>{lift.weight} kg</Text>
          </View>
        ))}
        {metrics.bestLifts.length === 0 && (
          <Text style={styles.emptyText}>Mark a set complete to start tracking your best lifts.</Text>
        )}
      </View>
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
  heading: {
    color: '#F5F7F2',
    fontSize: 27,
    fontWeight: '800',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 20,
  },
  headingIcon: {
    width: 42,
    height: 42,
    backgroundColor: '#172334',
    borderWidth: 1,
    borderColor: '#263448',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subheading: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 3,
  },
  card: {
    backgroundColor: '#111A27',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 18,
    marginBottom: 18,
  },
  title: {
    color: '#F3F6FB',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardSubtitle: {
    color: '#8794A5',
    fontSize: 10,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 82,
    backgroundColor: '#172334',
    borderRadius: 13,
    paddingHorizontal: 3,
    paddingVertical: 9,
    gap: 4,
  },
  summaryValue: {
    color: '#F3F6FB',
    fontSize: 14,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#A8B5C7',
    fontSize: 9,
  },
  emptyText: {
    color: '#929B91',
    fontSize: 13,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#293129',
  },
  listText: {
    color: '#F5F7F2',
    fontWeight: '600',
  },
  listValue: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '700',
  },
});
