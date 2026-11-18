import { Tabs } from 'expo-router';
import {
  Activity,
  Dumbbell,
  Home,
  Target,
  TrendingUp,
  User,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D3FF00',
        tabBarInactiveTintColor: '#8290A2',
        tabBarStyle: {
          backgroundColor: '#0B121D',
          borderTopColor: '#253244',
          borderTopWidth: 1,
          height: 78,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 18,
          shadowColor: '#000000',
          shadowOpacity: 0.22,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => <TabIcon focused={focused}><Home size={size} color={color} /></TabIcon>,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, size, focused }) => <TabIcon focused={focused}><Dumbbell size={size} color={color} /></TabIcon>,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color, size, focused }) => <TabIcon focused={focused}><Target size={size} color={color} /></TabIcon>,
        }}
      />
      <Tabs.Screen
        name="muscles"
        options={{
          title: 'Muscles',
          tabBarIcon: ({ color, size, focused }) => <TabIcon focused={focused}><Activity size={size} color={color} /></TabIcon>,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size, focused }) => <TabIcon focused={focused}><TrendingUp size={size} color={color} /></TabIcon>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => <TabIcon focused={focused}><User size={size} color={color} /></TabIcon>,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ children, focused }: { children: React.ReactNode; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 34,
    height: 30,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapFocused: {
    backgroundColor: '#1C231C',
    borderWidth: 1,
    borderColor: '#35465B',
  },
});
