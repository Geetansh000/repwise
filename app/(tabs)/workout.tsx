import { router } from 'expo-router';
import { ArrowRight, BookOpen, Clock3, Dumbbell, Play } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenEntrance } from '../../components/ScreenEntrance';
import { TrainingHero } from '../../components/TrainingHero';
import { recommendedTemplates } from '../../data/exercises';
import { useAppStore } from '../../stores/useAppStore';

export default function WorkoutScreen() {
  const workouts = useAppStore((state) => state.workouts);
  const activeWorkoutDraft = useAppStore((state) => state.activeWorkoutDraft);

  return (
    <ScreenEntrance>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Workout</Text>
      <Text style={styles.subtitle}>Build a session and log every set.</Text>

      <TrainingHero
        eyebrow="READY WHEN YOU ARE"
        title="Make today count."
        subtitle="Start fresh or choose a focused training template."
        onPress={() => router.push('/workout-setup')}
      />

      {activeWorkoutDraft && (
        <Pressable
          accessibilityRole="button"
          style={styles.resumeCard}
          onPress={() => router.push('/workout-session')}
        >
          <View style={styles.startIcon}>
            <Play size={19} color="#090B09" fill="#090B09" />
          </View>
          <View style={styles.startCopy}>
            <Text style={styles.startTitle}>Continue session</Text>
            <Text style={styles.startSubtitle}>
              {activeWorkoutDraft.name} · {activeWorkoutDraft.exercises.length} exercises saved
            </Text>
          </View>
          <ArrowRight size={18} color="#A3E635" />
        </Pressable>
      )}

      <Pressable style={styles.startCard} onPress={() => router.push('/workout-setup')}>
        <View style={styles.startIcon}>
          <Dumbbell size={22} color="#090B09" />
        </View>
        <View style={styles.startCopy}>
          <Text style={styles.startTitle}>Start an empty workout</Text>
          <Text style={styles.startSubtitle}>Choose exercises as you go</Text>
        </View>
        <Play size={20} color="#A3E635" />
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Workout templates</Text>
        <Pressable style={styles.textAction} onPress={() => router.push('/exercise-library')}>
          <BookOpen size={16} color="#A3E635" />
          <Text style={styles.textActionLabel}>Exercises</Text>
        </Pressable>
      </View>

      {recommendedTemplates.map((template) => (
        <Pressable
          key={template.id}
          style={styles.templateCard}
          onPress={() => router.push(`/workout-setup?template=${encodeURIComponent(template.title)}`)}
        >
          <View style={styles.templateIcon}>
            <Dumbbell size={18} color="#A3E635" />
          </View>
          <View style={styles.templateCopy}>
            <Text style={styles.templateTitle}>{template.title}</Text>
            <Text style={styles.templateFocus}>{template.focus}</Text>
          </View>
          <View style={styles.templateDuration}>
            <Clock3 size={13} color="#929B91" />
            <Text style={styles.templateDurationText}>{template.duration}</Text>
          </View>
        </Pressable>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent sessions</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/workout-history')}
          style={styles.textAction}
        >
          <Text style={styles.textActionLabel}>View history</Text>
          <ArrowRight size={16} color="#A3E635" />
        </Pressable>
      </View>
      {workouts.slice(0, 4).map((workout) => (
        <View key={workout.id} style={styles.historyCard}>
          <View style={styles.historyTopRow}>
            <Text style={styles.historyTitle}>{workout.name}</Text>
            <Text style={styles.historyDate}>
              {new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <Text style={styles.historyMeta}>
            {workout.exercises.length} exercises · {workout.duration} min · {workout.volume.toLocaleString()} kg
          </Text>
        </View>
      ))}
      {workouts.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your training log starts here</Text>
          <Text style={styles.emptyText}>Finished workouts will be saved here for you to revisit.</Text>
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
  heading: {
    color: '#F5F7F2',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#929B91',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  startCard: {
    backgroundColor: '#111A27',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#35465B',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 26,
  },
  resumeCard: {
    backgroundColor: '#172334',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A3E635',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  startIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D3FF00',
  },
  startCopy: {
    flex: 1,
  },
  startTitle: {
    color: '#F5F7F2',
    fontSize: 16,
    fontWeight: '700',
  },
  startSubtitle: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F5F7F2',
    fontSize: 18,
    fontWeight: '700',
  },
  textAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textActionLabel: {
    color: '#A3E635',
    fontSize: 13,
    fontWeight: '700',
  },
  templateCard: {
    backgroundColor: '#111A27',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 9,
  },
  templateIcon: {
    backgroundColor: '#172334',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateCopy: {
    flex: 1,
  },
  templateTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
  },
  templateFocus: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 4,
  },
  templateDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  templateDurationText: {
    color: '#929B91',
    fontSize: 11,
  },
  historyCard: {
    backgroundColor: '#111A27',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 14,
    marginBottom: 9,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    color: '#F5F7F2',
    fontSize: 15,
    fontWeight: '700',
  },
  historyDate: {
    color: '#929B91',
    fontSize: 12,
  },
  historyMeta: {
    color: '#929B91',
    fontSize: 12,
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: '#111A27',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 16,
  },
  emptyTitle: {
    color: '#F5F7F2',
    fontWeight: '700',
    marginBottom: 5,
  },
  emptyText: {
    color: '#929B91',
    fontSize: 13,
    lineHeight: 19,
  },
});
