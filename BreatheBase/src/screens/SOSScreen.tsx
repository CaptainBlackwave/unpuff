import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useUserData } from '../hooks/useUserData';
import { useStreak } from '../hooks/useStreak';
import { SOSButton } from '../components/SOSButton';
import { InterventionModal } from '../components/InterventionModal';
import { Tip } from '../types';

export const SOSScreen: React.FC = () => {
  const { getRandomTip, getValidation, getHype, logCraving, addExperience } = useUserData();
  const { streakData, moneySaved } = useStreak();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<Tip>(getRandomTip());
  const [validationText, setValidationText] = useState('');
  const [hypeText, setHypeText] = useState('');

  const handleSOSPress = () => {
    const tip = getRandomTip();
    const validation = getValidation();
    const hype = getHype(streakData.days, moneySaved);
    
    setCurrentTip(tip);
    setValidationText(validation);
    setHypeText(hype);
    setModalVisible(true);
  };

  const handleComplete = async () => {
    await logCraving(currentTip);
    await addExperience(10);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Craving Support</Text>
        <Text style={styles.subtitle}>
          Need help? Tap the button below for immediate support.
        </Text>
        
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Quick Tips</Text>
            <Text style={styles.infoText}>
              • Cravings peak at 3 minutes{'\n'}
              • Cold water can help reset{'\n'}
              • Deep breathing works{'\n'}
              • Change your environment
            </Text>
          </View>
        </View>
        
        <SOSButton onPress={handleSOSPress} />
        
        <View style={styles.reminderSection}>
          <Text style={styles.reminderText}>
            Remember: Every craving you resist makes you stronger. 
            You&apos;re not fighting alone!
          </Text>
        </View>
      </ScrollView>
      
      <InterventionModal
        visible={modalVisible}
        validation={validationText}
        tip={currentTip}
        hype={hypeText}
        onComplete={handleComplete}
      />
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  infoSection: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  reminderSection: {
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  reminderText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
