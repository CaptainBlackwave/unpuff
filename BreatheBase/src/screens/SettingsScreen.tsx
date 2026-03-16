import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useUserData } from '../hooks/useUserData';
import { useStreak } from '../hooks/useStreak';

export const SettingsScreen: React.FC = () => {
  const { userData, updateDate, updateCost, reset } = useUserData();
  const { quitDate } = useStreak();
  const [costInput, setCostInput] = useState(userData.moneySavedPerDay.toString());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveCost = async () => {
    const cost = parseFloat(costInput);
    if (isNaN(cost) || cost < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number');
      return;
    }
    await updateCost(cost);
    Alert.alert('Saved', 'Your daily cost has been updated');
  };

  const handleReset = () => {
    if (showResetConfirm) {
      Alert.alert(
        'Reset Progress?',
        'This will erase ALL your progress. This cannot be undone. Are you absolutely sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Yes, Reset Everything', 
            style: 'destructive',
            onPress: async () => {
              await reset();
              setShowResetConfirm(false);
              Alert.alert('Reset Complete', 'Your progress has been reset');
            }
          },
        ]
      );
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Quit Date</Text>
          <View style={styles.card}>
            <Text style={styles.quitDateText}>{formatDate(quitDate)}</Text>
            <Text style={styles.quitDateSubtext}>
              This is when your smoke-free journey began
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Cigarette Cost</Text>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>
              How much do you spend on cigarettes per day?
            </Text>
            <View style={styles.inputRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.input}
                value={costInput}
                onChangeText={setCostInput}
                keyboardType="decimal-pad"
                placeholder="8.00"
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCost}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Cravings Resisted</Text>
              <Text style={styles.statValue}>{userData.totalCravingsResisted}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Current Level</Text>
              <Text style={styles.statValue}>{userData.level}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total XP</Text>
              <Text style={styles.statValue}>{userData.xp}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reset</Text>
          <TouchableOpacity
            style={[
              styles.resetButton,
              showResetConfirm && styles.resetButtonActive,
            ]}
            onPress={handleReset}
          >
            <Text
              style={[
                styles.resetButtonText,
                showResetConfirm && styles.resetButtonTextActive,
              ]}
            >
              {showResetConfirm ? 'Tap Again to Confirm' : 'Reset All Progress'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.resetWarning}>
            Warning: This action cannot be undone. Your streak and all data will be lost.
          </Text>
        </View>
      </ScrollView>
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
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  quitDateText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  quitDateSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dollarSign: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  resetButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.danger,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  resetButtonActive: {
    backgroundColor: theme.colors.danger,
  },
  resetButtonText: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonTextActive: {
    color: '#fff',
  },
  resetWarning: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
