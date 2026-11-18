import { ArrowUpRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export function TrainingHero({ eyebrow, title, subtitle, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
    >
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Svg width={118} height={106} viewBox="0 0 118 106" accessibilityLabel="Barbell illustration">
        <Circle cx={60} cy={53} r={45} fill="#1C2A3A" />
        <Circle cx={60} cy={53} r={35} fill="none" stroke="#35465B" strokeWidth={1} strokeDasharray="3 5" />
        <Path d="M37 78c5-12 11-18 23-18s18 6 23 18" fill="none" stroke="#82910B" strokeWidth={2} strokeLinecap="round" />
        <Line x1={31} y1={49} x2={89} y2={49} stroke="#D3FF00" strokeWidth={7} strokeLinecap="round" />
        <Rect x={23} y={37} width={12} height={25} rx={4} fill="#F5F7F2" />
        <Rect x={14} y={32} width={9} height={35} rx={4} fill="#82910B" />
        <Rect x={83} y={37} width={12} height={25} rx={4} fill="#F5F7F2" />
        <Rect x={95} y={32} width={9} height={35} rx={4} fill="#82910B" />
        <Circle cx={60} cy={49} r={3} fill="#090B09" />
      </Svg>
      {onPress ? <ArrowUpRight size={16} color="#D3FF00" style={styles.actionIcon} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111A27',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#263448',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 18,
    overflow: 'hidden',
  },
  copy: {
    flex: 1,
    gap: 5,
    paddingRight: 4,
  },
  eyebrow: {
    color: '#D3FF00',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: '#F5F7F2',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#929B91',
    fontSize: 10,
    lineHeight: 15,
  },
  actionIcon: {
    position: 'absolute',
    right: 12,
    top: 10,
  },
});
