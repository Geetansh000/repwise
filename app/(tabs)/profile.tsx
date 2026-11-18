import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Award, Dumbbell, Pencil, Scale, TrendingDown, TrendingUp, UserRound, X } from 'lucide-react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { ScreenEntrance } from '../../components/ScreenEntrance';
import { getWorkoutMetrics } from '../../lib/analytics';
import { useAppStore } from '../../stores/useAppStore';

export default function ProfileScreen() {
  const workouts = useAppStore((state) => state.workouts);
  const bodyWeightEntries = useAppStore((state) => state.bodyWeightEntries);
  const addBodyWeightEntry = useAppStore((state) => state.addBodyWeightEntry);
  const profileName = useAppStore((state) => state.profileName);
  const updateProfileName = useAppStore((state) => state.updateProfileName);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profileName);
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const metrics = getWorkoutMetrics(workouts);
  const totalVolume = workouts.reduce((total, workout) => total + workout.volume, 0);
  const exercisesTracked = new Set(workouts.flatMap((workout) => workout.exercises.map((exercise) => exercise.name)).values()).size;
  const recentWeights = [...bodyWeightEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  const latestWeight = recentWeights[0];
  const previousWeight = recentWeights[1];
  const parsedWeight = Number(weightInput);
  const validWeight = Number.isFinite(parsedWeight) && parsedWeight > 0;

  const openEditor = () => {
    setEditedName(profileName);
    setIsEditing(true);
  };

  const saveProfile = () => {
    const name = editedName.trim();
    if (!name) return;
    updateProfileName(name);
    setIsEditing(false);
  };

  const openWeightLogger = () => {
    setWeightInput(latestWeight ? String(latestWeight.weight) : '');
    setIsLoggingWeight(true);
  };

  const saveWeight = () => {
    if (!validWeight) return;
    addBodyWeightEntry({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      weight: parsedWeight,
      date: new Date().toISOString(),
    });
    setIsLoggingWeight(false);
  };

  return (
    <ScreenEntrance>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headingRow}>
        <View style={styles.headingIcon}><UserRound size={19} color="#A3E635" /></View>
        <View>
          <Text style={styles.heading}>Profile</Text>
          <Text style={styles.headingSubtitle}>Your training identity</Text>
        </View>
      </View>

      <View style={styles.profileHero}>
        <View style={styles.profileGraphic}>
          <Svg width={106} height={94} viewBox="0 0 106 94" accessibilityLabel="Athlete profile illustration">
            <Circle cx={53} cy={47} r={42} fill="#202A1B" />
            <Circle cx={53} cy={35} r={13} fill="#A3E635" />
            <Path d="M27 77c3-16 12-24 26-24s23 8 26 24" fill="#779D35" />
            <Path d="M17 47a36 36 0 0 1 11-27M89 47a36 36 0 0 0-11-27" fill="none" stroke="#F5F7F2" strokeOpacity={0.45} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={styles.name}>{profileName}</Text>
        <Text style={styles.subtitle}>Train smart. Track every rep.</Text>
        <View style={styles.profileBadge}><Award size={13} color="#A3E635" /><Text style={styles.profileBadgeText}>CONSISTENCY IN MOTION</Text></View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit profile name"
          style={styles.editButton}
          onPress={openEditor}
        >
          <Pencil size={15} color="#A3E635" />
          <Text style={styles.editButtonText}>Edit profile</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.weightHeading}>
          <View style={styles.weightTitleWrap}>
            <Scale size={17} color="#A3E635" />
            <Text style={styles.cardTitle}>Body weight</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={openWeightLogger}
            style={styles.logWeightButton}
          >
            <Text style={styles.logWeightButtonText}>+ Log weight</Text>
          </Pressable>
        </View>
        {latestWeight ? (
          <>
            <View style={styles.currentWeightRow}>
              <Text style={styles.currentWeight}>{latestWeight.weight} <Text style={styles.weightUnit}>kg</Text></Text>
              {previousWeight && (
                <View style={styles.weightChange}>
                  {latestWeight.weight > previousWeight.weight
                    ? <TrendingUp size={14} color="#F6A66A" />
                    : latestWeight.weight < previousWeight.weight
                      ? <TrendingDown size={14} color="#A3E635" />
                      : null}
                  <Text style={[
                    styles.weightChangeText,
                    latestWeight.weight > previousWeight.weight && styles.weightChangeUp,
                  ]}>
                    {latestWeight.weight === previousWeight.weight
                      ? 'No change'
                      : `${latestWeight.weight > previousWeight.weight ? '+' : ''}${(latestWeight.weight - previousWeight.weight).toFixed(1)} kg`}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.weightDate}>
              Latest entry · {new Date(latestWeight.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
            {recentWeights.length > 1 && (
              <View style={styles.weightHistory}>
                <Text style={styles.weightHistoryTitle}>Recent entries</Text>
                {recentWeights.slice(0, 4).map((entry) => (
                  <View key={entry.id} style={styles.historyRow}>
                    <Text style={styles.listText}>
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    <Text style={styles.listValue}>{entry.weight} kg</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>Log your first weigh-in to start tracking your progress.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Training history</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Dumbbell size={14} color="#A3E635" />
            <Text style={styles.statNumber}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{metrics.workoutsThisWeek}</Text>
            <Text style={styles.statLabel}>This week</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{exercisesTracked}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
        </View>
        <View style={styles.historyRow}>
          <Text style={styles.listText}>Lifetime logged volume</Text>
          <Text style={styles.listValue}>{totalVolume.toLocaleString()} kg</Text>
        </View>
        <View style={styles.historyRow}>
          <Text style={styles.listText}>Tracked personal records</Text>
          <Text style={styles.listValue}>{metrics.personalRecords}</Text>
        </View>
        {workouts.length === 0 && (
          <Text style={styles.emptyText}>Your training totals will update as you save workouts.</Text>
        )}
      </View>
    </ScrollView>
    <Modal
      animationType="fade"
      transparent
      visible={isEditing}
      onRequestClose={() => setIsEditing(false)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.editCard}>
          <View style={styles.modalHeading}>
            <Text style={styles.modalTitle}>Edit profile</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close edit profile"
              onPress={() => setIsEditing(false)}
              hitSlop={10}
            >
              <X size={20} color="#929B91" />
            </Pressable>
          </View>
          <Text style={styles.inputLabel}>Display name</Text>
          <TextInput
            accessibilityLabel="Display name"
            autoCapitalize="words"
            maxLength={40}
            onChangeText={setEditedName}
            onSubmitEditing={saveProfile}
            placeholder="Your name"
            placeholderTextColor="#687383"
            returnKeyType="done"
            style={styles.nameInput}
            value={editedName}
          />
          <View style={styles.modalActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!editedName.trim()}
              onPress={saveProfile}
              style={[styles.saveButton, !editedName.trim() && styles.saveButtonDisabled]}
            >
              <Text style={styles.saveButtonText}>Save changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      animationType="fade"
      transparent
      visible={isLoggingWeight}
      onRequestClose={() => setIsLoggingWeight(false)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.editCard}>
          <View style={styles.modalHeading}>
            <Text style={styles.modalTitle}>Log body weight</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close body weight logger"
              onPress={() => setIsLoggingWeight(false)}
              hitSlop={10}
            >
              <X size={20} color="#929B91" />
            </Pressable>
          </View>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            accessibilityLabel="Body weight in kilograms"
            autoFocus
            keyboardType="decimal-pad"
            maxLength={6}
            onChangeText={setWeightInput}
            onSubmitEditing={saveWeight}
            placeholder="e.g. 72.5"
            placeholderTextColor="#687383"
            returnKeyType="done"
            style={styles.nameInput}
            value={weightInput}
          />
          <View style={styles.modalActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsLoggingWeight(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!validWeight}
              onPress={saveWeight}
              style={[styles.saveButton, !validWeight && styles.saveButtonDisabled]}
            >
              <Text style={styles.saveButtonText}>Save weight</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  headingSubtitle: {
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
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#D3FF00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileHero: {
    alignItems: 'center',
    backgroundColor: '#111A27',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 20,
    marginBottom: 18,
  },
  profileGraphic: {
    height: 94,
    marginBottom: 10,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#172334',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12,
  },
  profileBadgeText: {
    color: '#A3E635',
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#36452A',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  editButtonText: {
    color: '#A3E635',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  editCard: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#111A27',
    borderWidth: 1,
    borderColor: '#263448',
  },
  modalHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  modalTitle: {
    color: '#F5F7F2',
    fontSize: 20,
    fontWeight: '800',
  },
  inputLabel: {
    color: '#929B91',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  nameInput: {
    color: '#F5F7F2',
    backgroundColor: '#172334',
    borderWidth: 1,
    borderColor: '#36452A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 22,
  },
  cancelButton: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#364253',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  cancelButtonText: {
    color: '#D5DBE5',
    fontWeight: '700',
  },
  saveButton: {
    justifyContent: 'center',
    backgroundColor: '#A3E635',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  saveButtonDisabled: {
    opacity: 0.45,
  },
  saveButtonText: {
    color: '#10170A',
    fontWeight: '800',
  },
  avatar: {
    color: '#090B09',
    fontWeight: '800',
    fontSize: 22,
  },
  name: {
    color: '#F5F7F2',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#929B91',
    marginTop: 4,
  },
  cardTitle: {
    color: '#F5F7F2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  weightHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weightTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logWeightButton: {
    borderRadius: 10,
    backgroundColor: '#25351D',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  logWeightButtonText: {
    color: '#A3E635',
    fontSize: 12,
    fontWeight: '800',
  },
  currentWeightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  currentWeight: {
    color: '#F5F7F2',
    fontSize: 32,
    fontWeight: '800',
  },
  weightUnit: {
    color: '#929B91',
    fontSize: 15,
    fontWeight: '600',
  },
  weightChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  weightChangeText: {
    color: '#A3E635',
    fontWeight: '700',
    fontSize: 12,
  },
  weightChangeUp: {
    color: '#F6A66A',
  },
  weightDate: {
    color: '#929B91',
    fontSize: 11,
    marginTop: 1,
  },
  weightHistory: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#263448',
    paddingTop: 11,
  },
  weightHistoryTitle: {
    color: '#929B91',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#293129',
  },
  listText: {
    color: '#F5F7F2',
  },
  listValue: {
    color: '#A3E635',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  emptyText: {
    color: '#929B91',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#172334',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    color: '#F5F7F2',
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: '#929B91',
    fontSize: 11,
    marginTop: 4,
  },
});
