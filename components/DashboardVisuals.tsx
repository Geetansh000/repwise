import { Dumbbell, Play } from 'lucide-react-native';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type ActivityDay = {
  label: string;
  workouts: number;
};

type WeeklyProgressProps = {
  days: ActivityDay[];
  activeDays: number;
};

export function WeeklyProgress({ days, activeDays }: WeeklyProgressProps) {
  const circumference = 2 * Math.PI * 31;
  const progress = (activeDays / Math.max(days.length, 1)) * circumference;

  return (
    <View style={styles.weekCard}>
      <View style={styles.weekCopy}>
        <Text style={styles.cardEyebrow}>WEEKLY PROGRESS</Text>
        <Text style={styles.weekCount}>{activeDays}<Text style={styles.weekGoal}> / {days.length}</Text></Text>
        <Text style={styles.weekCaption}>active training days</Text>
        <View style={styles.dayRow}>
          {days.map((day, index) => {
            const active = day.workouts > 0;
            return (
              <View key={`${day.label}-${index}`} style={styles.dayItem}>
                <View style={[styles.dayDot, active && styles.dayDotActive]}>
                  {active ? <Dumbbell size={9} color="#07100B" /> : null}
                </View>
                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{day.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.ringWrap}>
        <Svg width={92} height={92} viewBox="0 0 92 92" accessibilityLabel={`${activeDays} of ${days.length} active days this week`}>
          <Circle cx={46} cy={46} r={31} fill="none" stroke="#283342" strokeWidth={8} />
          {activeDays > 0 && (
            <Circle
              cx={46}
              cy={46}
              r={31}
              fill="none"
              stroke="#D3FF00"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              rotation={-90}
              origin="46, 46"
            />
          )}
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.ringValue}>{Math.round((activeDays / Math.max(days.length, 1)) * 100)}%</Text>
        </View>
      </View>
    </View>
  );
}

type WorkoutSpotlightProps = {
  title: string;
  focus: string;
  duration: string;
  onPress: () => void;
};

export function WorkoutSpotlight({ title, focus, duration, onPress }: WorkoutSpotlightProps) {
  return (
    <View style={styles.spotlight}>
      <ImageBackground
        source={require('../assets/images/workout-athlete.jpg')}
        style={styles.spotlightArt}
        imageStyle={styles.spotlightImage}
        resizeMode="cover"
        accessibilityLabel="Athlete doing pull-ups in a gym"
      >
        <View pointerEvents="none" style={styles.photoShade} />
        <View style={styles.artLabel}>
          <Dumbbell size={13} color="#D3FF00" />
          <Text style={styles.artLabelText}>TRAINING SPOTLIGHT</Text>
        </View>
      </ImageBackground>
      <View style={styles.spotlightBody}>
        <View style={styles.spotlightTitleRow}>
          <View style={styles.spotlightCopy}>
            <Text style={styles.cardEyebrow}>TODAY’S WORKOUT</Text>
            <Text style={styles.spotlightTitle}>{title}</Text>
            <Text style={styles.spotlightFocus}>{focus}</Text>
          </View>
          <View style={styles.durationPill}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" onPress={onPress} style={styles.startButton}>
          <Text style={styles.startButtonText}>Start workout</Text>
          <Play size={14} color="#07100B" fill="#07100B" />
        </Pressable>
      </View>
    </View>
  );
}

type MuscleSegment = {
  label: string;
  value: number;
  color: string;
};

type MuscleDonutProps = {
  segments: MuscleSegment[];
};

export function MuscleDonut({ segments }: MuscleDonutProps) {
  const radius = 37;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let offset = 0;

  return (
    <View style={styles.donutLayout}>
      <View style={styles.donutWrap}>
        <Svg width={112} height={112} viewBox="0 0 112 112" accessibilityLabel="Muscle training distribution">
          <Circle cx={56} cy={56} r={radius} fill="none" stroke="#273344" strokeWidth={14} />
          {total > 0 && segments.map((segment) => {
            const length = (segment.value / total) * circumference;
            const dashOffset = -offset;
            offset += length;
            return (
              <Circle
                key={segment.label}
                cx={56}
                cy={56}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={14}
                strokeDasharray={`${length} ${circumference}`}
                strokeDashoffset={dashOffset}
                rotation={-90}
                origin="56, 56"
              />
            );
          })}
        </Svg>
        <View style={styles.donutCenter}>
          <Text style={styles.donutCenterValue}>{segments.length}</Text>
          <Text style={styles.donutCenterLabel}>GROUPS</Text>
        </View>
      </View>
      <View style={styles.legend}>
        {segments.length > 0 ? segments.map((segment) => (
          <View key={segment.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
            <Text style={styles.legendName}>{segment.label}</Text>
            <Text style={styles.legendValue}>{segment.value}%</Text>
          </View>
        )) : (
          <Text style={styles.noData}>Log completed sets to see your muscle focus.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111A27',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#263448',
    padding: 16,
    marginBottom: 16,
  },
  weekCopy: {
    flex: 1,
  },
  cardEyebrow: {
    color: '#A8B5C7',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  weekCount: {
    color: '#F3F6FB',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    marginTop: 4,
  },
  weekGoal: {
    color: '#8794A5',
    fontWeight: '600',
  },
  weekCaption: {
    color: '#A8B5C7',
    fontSize: 11,
  },
  dayRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 13,
  },
  dayItem: {
    alignItems: 'center',
    gap: 4,
  },
  dayDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#526174',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotActive: {
    backgroundColor: '#D3FF00',
    borderColor: '#D3FF00',
  },
  dayLabel: {
    color: '#778599',
    fontSize: 9,
    fontWeight: '600',
  },
  dayLabelActive: {
    color: '#E6F3C1',
  },
  ringWrap: {
    width: 92,
    height: 92,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringValue: {
    color: '#D3FF00',
    fontSize: 17,
    fontWeight: '800',
  },
  spotlight: {
    overflow: 'hidden',
    backgroundColor: '#111A27',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#263448',
    marginBottom: 18,
  },
  spotlightArt: {
    height: 190,
    backgroundColor: '#0E1622',
    justifyContent: 'flex-start',
  },
  spotlightImage: {
    resizeMode: 'cover',
  },
  photoShade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(5, 11, 19, 0.18)',
  },
  artLabel: {
    position: 'absolute',
    left: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0A111BCC',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  artLabelText: {
    color: '#F3F6FB',
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  spotlightBody: {
    padding: 14,
  },
  spotlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  spotlightCopy: {
    flex: 1,
  },
  spotlightTitle: {
    color: '#F3F6FB',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
  },
  spotlightFocus: {
    color: '#A8B5C7',
    fontSize: 11,
    marginTop: 3,
  },
  durationPill: {
    backgroundColor: '#1C2A3A',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  durationText: {
    color: '#DDE6F0',
    fontSize: 10,
    fontWeight: '700',
  },
  startButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D3FF00',
    borderRadius: 12,
  },
  startButtonText: {
    color: '#07100B',
    fontSize: 12,
    fontWeight: '800',
  },
  donutLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  donutWrap: {
    width: 112,
    height: 112,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  donutCenterValue: {
    color: '#F3F6FB',
    fontSize: 20,
    fontWeight: '800',
  },
  donutCenterLabel: {
    color: '#8794A5',
    fontSize: 8,
    letterSpacing: 0.8,
    fontWeight: '800',
  },
  legend: {
    flex: 1,
    gap: 9,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    flex: 1,
    color: '#C4CEDA',
    fontSize: 10,
  },
  legendValue: {
    color: '#F3F6FB',
    fontSize: 10,
    fontWeight: '700',
  },
  noData: {
    color: '#A8B5C7',
    fontSize: 11,
    lineHeight: 17,
  },
});
