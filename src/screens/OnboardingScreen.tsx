import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';
import { saveUserData } from '../utils/storage';
import { RootStackParamList } from '../navigation/AppNavigator';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

interface ChecklistItem {
  id: string;
  title: string;
  emoji: string;
  checked: boolean;
}

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', title: 'Threw away all cigarettes and lighters', emoji: '🗑️', checked: false },
    { id: '2', title: 'Stocked up on oral substitutes (gum, mints, toothpicks)', emoji: '🍬', checked: false },
    { id: '3', title: 'Told at least one friend I am quitting today', emoji: '👥', checked: false },
    { id: '4', title: 'Mentally prepared to crush my cravings', emoji: '💪', checked: false },
  ]);
  const [isStarting, setIsStarting] = useState(false);

  const allChecked = checklist.every(item => item.checked);

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleStartJourney = async () => {
    if (!allChecked) return;
    
    setIsStarting(true);
    try {
      await saveUserData({
        quitDate: new Date().toISOString(),
        moneySavedPerDay: 8,
        totalCravingsResisted: 0,
        xp: 0,
        level: 1,
        cravingsHistory: [],
        lapses: 0,
        lapseDates: [],
        motivationImageUri: null,
        personalMantra: null,
      });
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to start journey. Please try again.');
      setIsStarting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🚀</Text>
          <Text style={styles.title}>Mission: Clean House</Text>
          <Text style={styles.subtitle}>
            Prepare yourself for a smoke-free life. Complete these steps to get started:
          </Text>
        </View>

        <View style={styles.checklistContainer}>
          {checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.checklistItem, item.checked && styles.checklistItemChecked]}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checklistEmoji}>{item.emoji}</Text>
              <Text style={[styles.checklistText, item.checked && styles.checklistTextChecked]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>💡 Why this matters</Text>
          <Text style={styles.infoText}>
            Setting up your environment before quitting dramatically increases your success rate. 
            Every item you check off is one less trigger you'll face.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, !allChecked && styles.startButtonDisabled]}
          onPress={handleStartJourney}
          disabled={!allChecked || isStarting}
          activeOpacity={0.8}
        >
          <Text style={[styles.startButtonText, !allChecked && styles.startButtonTextDisabled]}>
            {isStarting ? 'Starting...' : 'Start My Quit Journey'}
          </Text>
        </TouchableOpacity>
        
        {!allChecked && (
          <Text style={styles.hintText}>
            Complete all items to unlock
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  checklistContainer: {
    marginBottom: theme.spacing.xl,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  checklistItemChecked: {
    backgroundColor: '#E8F5E9',
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  checklistEmoji: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  checklistTextChecked: {
    color: theme.colors.success,
    textDecorationLine: 'line-through',
  },
  infoContainer: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  startButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  startButtonDisabled: {
    backgroundColor: theme.colors.textSecondary + '40',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  startButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  hintText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
