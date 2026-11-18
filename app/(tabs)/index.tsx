import { Link, router } from 'expo-router';
import { ArrowRight, Bell, CalendarDays, ChevronRight, ClipboardList, Dumbbell, Flame, TrendingUp } from 'lucide-react-native';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WorkoutBarChart } from '../../components/Charts';
import { WeeklyProgress, WorkoutSpotlight } from '../../components/DashboardVisuals';
import { ScreenEntrance } from '../../components/ScreenEntrance';
import { SectionCard } from '../../components/SectionCard';
import { recommendedTemplates } from '../../data/exercises';
import { getWorkoutMetrics } from '../../lib/analytics';
import { useAppStore } from '../../stores/useAppStore';

export default function HomeScreen() {
  const workouts = useAppStore((state) => state.workouts);
  const activeWorkoutDraft = useAppStore((state) => state.activeWorkoutDraft);
  const metrics = getWorkoutMetrics(workouts);
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const workoutOfDay = recommendedTemplates[0];
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => ({
    label,
    workouts: metrics.weeklyActivity[index] ?? 0,
  }));
  const activeDays = weekDays.filter((day) => day.workouts > 0).length;

  return (
    <ScreenEntrance>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.brandHeader}>
        <Image
          source={require('../../assets/repwise-logo.png')}
          style={styles.brandLogo}
          accessibilityLabel="RepWise logo"
        />
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>RepWise</Text>
          <Text style={styles.brandTagline}>Track Every Rep. Build Every Gain. 💪</Text>
        </View>
      </View>
      <View style={styles.topRow}>
        <View style={styles.profileWrap}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatar}>GS</Text>
          </View>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.name}>Geetansh</Text>
          </View>
        </View>
        <Pressable style={styles.bellBtn}>
          <Bell size={20} color="#F5F7F2" />
        </Pressable>
      </View>

      <Text style={styles.dateText}>{today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>

      {activeWorkoutDraft && (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/workout-session')}
          style={styles.activeSessionCard}
        >
          <View style={styles.activeSessionIcon}>
            <Dumbbell size={19} color="#090B09" />
          </View>
          <View style={styles.activeSessionCopy}>
            <Text style={styles.activeSessionEyebrow}>SESSION IN PROGRESS</Text>
            <Text style={styles.activeSessionTitle}>Continue session</Text>
            <Text style={styles.activeSessionSubtitle}>
              {activeWorkoutDraft.name} · {activeWorkoutDraft.exercises.length} exercises
            </Text>
          </View>
          <ArrowRight size={19} color="#A3E635" />
        </Pressable>
      )}

      <WeeklyProgress days={weekDays} activeDays={activeDays} />
      {workoutOfDay && (
        <WorkoutSpotlight
          title={workoutOfDay.title}
          focus={workoutOfDay.focus}
          duration={workoutOfDay.duration}
          onPress={() => router.push(`/workout-setup?template=${encodeURIComponent(workoutOfDay.title)}`)}
        />
      )}

      <View style={styles.quickActionsHeader}>
        <Text style={styles.quickActionsTitle}>Quick actions</Text>
      </View>
      <View style={styles.quickActions}>
        <Pressable style={styles.quickActionCard} onPress={() => router.push('/(tabs)/workout')}>
          <View style={styles.quickActionIcon}><Dumbbell size={19} color="#D3FF00" /></View>
          <Text style={styles.quickActionLabel}>Workouts</Text>
        </Pressable>
        <Pressable style={styles.quickActionCard} onPress={() => router.push('/exercise-library')}>
          <View style={styles.quickActionIcon}><ClipboardList size={19} color="#D3FF00" /></View>
          <Text style={styles.quickActionLabel}>Exercises</Text>
        </Pressable>
        <Pressable style={styles.quickActionCard} onPress={() => router.push('/workout-history')}>
          <View style={styles.quickActionIcon}><CalendarDays size={19} color="#D3FF00" /></View>
          <Text style={styles.quickActionLabel}>History</Text>
        </Pressable>
        <Pressable style={styles.quickActionCard} onPress={() => router.push('/(tabs)/progress')}>
          <View style={styles.quickActionIcon}><TrendingUp size={19} color="#D3FF00" /></View>
          <Text style={styles.quickActionLabel}>Progress</Text>
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.label}>This week</Text>
          <Text style={styles.statValue}>{metrics.workoutsThisWeek}</Text>
          <Text style={styles.statCaption}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Volume</Text>
          <Text style={styles.statValue}>{metrics.totalVolume.toLocaleString()}</Text>
          <Text style={styles.statCaption}>kg total volume</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.statValue}>{metrics.totalMinutes}</Text>
          <Text style={styles.statCaption}>minutes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>PRs</Text>
          <Text style={styles.statValue}>{metrics.personalRecords}</Text>
          <Text style={styles.statCaption}>this month</Text>
        </View>
      </View>

      <SectionCard title="Weekly activity" action={<CalendarDays size={18} color="#A3E635" />}>
        {metrics.workoutsThisWeek > 0 ? (
          <WorkoutBarChart
            labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
            data={metrics.weeklyActivity}
            width={Math.min(Dimensions.get('window').width - 64, 700)}
            height={210}
          />
        ) : (
          <Text style={styles.emptyText}>Complete a workout to start your weekly activity chart.</Text>
        )}
      </SectionCard>

      <SectionCard title="Muscle training distribution" action={<Flame size={18} color="#A3E635" />}>
        <View style={styles.distributionWrap}>
          {metrics.muscleDistribution.map((muscle) => (
            <View key={muscle.label} style={styles.distributionRow}>
              <View style={styles.rowMeta}>
                <View style={[styles.dot, { backgroundColor: muscle.color }]} />
                <Text style={styles.distributionLabel}>{muscle.label}</Text>
              </View>
              <Text style={styles.distributionValue}>{muscle.value}%</Text>
            </View>
          ))}
          {metrics.muscleDistribution.length === 0 && (
            <Text style={styles.emptyText}>Your muscle breakdown will appear after your first workout.</Text>
          )}
        </View>
      </SectionCard>

      <SectionCard title="Recent workout history" action={<ChevronRight size={18} color="#A3E635" />}>
        {metrics.recentWorkouts.map((workout) => (
          <View key={workout.id} style={styles.historyRow}>
            <View>
              <Text style={styles.historyTitle}>{workout.name}</Text>
              <Text style={styles.historyMeta}>{workout.date}</Text>
            </View>
            <View style={styles.historyNumbers}>
              <Text style={styles.historyVolume}>{workout.volume.toLocaleString()} kg</Text>
              <Text style={styles.historyMeta}>{workout.duration} min</Text>
            </View>
          </View>
        ))}
        {metrics.recentWorkouts.length === 0 && (
          <Text style={styles.emptyText}>No sessions yet. Start your first workout when you’re ready.</Text>
        )}
      </SectionCard>

      <SectionCard
        title="Recommended templates"
        action={
          <Link href="/exercise-library" asChild>
            <Pressable>
              <Text style={styles.linkText}>View all</Text>
            </Pressable>
          </Link>
        }
      >
        {recommendedTemplates.map((template) => (
          <Pressable
            key={template.id}
            style={styles.templateRow}
            onPress={() => router.push(`/workout-setup?template=${encodeURIComponent(template.title)}`)}
          >
            <View>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.historyMeta}>{template.focus}</Text>
            </View>
            <Text style={styles.duration}>{template.duration}</Text>
          </Pressable>
        ))}
      </SectionCard>

      <SectionCard title="Quick access" action={<ArrowRight size={18} color="#A3E635" />}>
        <Link href="/exercise-library" asChild>
          <Pressable style={styles.quickAction}>
            <Text style={styles.quickActionText}>Exercise library</Text>
          </Pressable>
        </Link>
      </SectionCard>
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
    paddingBottom: 32,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  brandLogo: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#050505',
  },
  brandCopy: {
    flex: 1,
  },
  brandName: {
    color: '#F5F7F2',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  brandTagline: {
    color: '#F28A1A',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  profileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    backgroundColor: '#D3FF00',
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    color: '#090B09',
    fontWeight: '700',
    fontSize: 16,
  },
  greeting: {
    color: '#929B91',
    fontSize: 13,
  },
  name: {
    color: '#F5F7F2',
    fontSize: 20,
    fontWeight: '700',
  },
  bellBtn: {
    width: 42,
    height: 42,
    backgroundColor: '#111A27',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#263448',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: '#929B91',
    fontSize: 15,
    marginBottom: 18,
  },
  activeSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#172334',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A3E635',
    padding: 14,
    marginBottom: 16,
  },
  activeSessionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3FF00',
  },
  activeSessionCopy: {
    flex: 1,
  },
  activeSessionEyebrow: {
    color: '#A3E635',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  activeSessionTitle: {
    color: '#F5F7F2',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  activeSessionSubtitle: {
    color: '#929B91',
    fontSize: 11,
    marginTop: 3,
  },
  primaryCta: {
    backgroundColor: '#A3E635',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 18,
    gap: 10,
  },
  primaryCtaText: {
    color: '#090B09',
    fontSize: 17,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#111A27',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 14,
    marginBottom: 10,
  },
  label: {
    color: '#A8B5C7',
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: '#F5F7F2',
    fontSize: 28,
    fontWeight: '800',
  },
  statCaption: {
    color: '#A8B5C7',
    fontSize: 12,
    marginTop: 6,
  },
  distributionWrap: {
    gap: 8,
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  distributionLabel: {
    color: '#F5F7F2',
    fontSize: 13,
  },
  distributionValue: {
    color: '#F5F7F2',
    fontSize: 13,
    fontWeight: '700',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#293129',
  },
  historyTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '600',
  },
  historyMeta: {
    color: '#A8B5C7',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#929B91',
    fontSize: 13,
    lineHeight: 20,
  },
  historyNumbers: {
    alignItems: 'flex-end',
  },
  historyVolume: {
    color: '#A3E635',
    fontSize: 13,
    fontWeight: '700',
  },
  templateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#293129',
  },
  templateTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
  },
  duration: {
    color: '#A3E635',
    fontWeight: '700',
  },
  linkText: {
    color: '#A3E635',
    fontWeight: '700',
  },
  quickAction: {
    backgroundColor: '#1C231C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#293129',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  quickActionText: {
    color: '#F5F7F2',
    fontWeight: '700',
  },
  quickActionsHeader: {
    marginBottom: 10,
  },
  quickActionsTitle: {
    color: '#F3F6FB',
    fontSize: 17,
    fontWeight: '800',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 18,
  },
  quickActionCard: {
    flex: 1,
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#111A27',
    borderWidth: 1,
    borderColor: '#263448',
    borderRadius: 15,
    paddingVertical: 9,
  },
  quickActionIcon: {
    width: 34,
    height: 34,
    backgroundColor: '#1C2A3A',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    color: '#C4CEDA',
    fontSize: 10,
    fontWeight: '700',
  },
});
