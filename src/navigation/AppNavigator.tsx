import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SOSScreen } from '../screens/SOSScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CircleScreen } from '../screens/CircleScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { QuitKitScreen } from '../screens/QuitKitScreen';
import { theme } from '../theme/theme';
import { getUserData } from '../utils/storage';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  SOS: undefined;
  Circle: undefined;
  Tips: undefined;
  QuitKit: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Dashboard': return '🔥';
      case 'SOS': return '🆘';
      case 'Circle': return '👥';
      case 'Tips': return '💡';
      case 'QuitKit': return '🔐';
      case 'Settings': return '⚙️';
      default: return '•';
    }
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{getIcon()}</Text>
    </View>
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="SOS" component={SOSScreen} />
      <Tab.Screen name="Circle" component={CircleScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen name="QuitKit" component={QuitKitScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigatorContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasQuitDate, setHasQuitDate] = useState(false);

  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    try {
      const userData = await getUserData();
      setHasQuitDate(!!userData.quitDate);
    } catch (error) {
      setHasQuitDate(false);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasQuitDate ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <AppNavigatorContent />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 0,
    elevation: 8,
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  iconFocused: {
    transform: [{ scale: 1.1 }],
  },
});
