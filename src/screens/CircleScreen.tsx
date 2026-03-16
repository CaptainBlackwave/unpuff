import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useUserData } from '../hooks/useUserData';
import { useStreak } from '../hooks/useStreak';
import { SHARED_MILESTONES } from '../types';

interface CombinedStats {
  combinedDays: number;
  combinedMoney: number;
  combinedCravings: number;
}

export const CircleScreen: React.FC = () => {
  const { userData } = useUserData();
  const { streakData, moneySaved } = useStreak();
  const [partnerCode, setPartnerCode] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [isLinked, setIsLinked] = useState(false);
  const [combinedStats, setCombinedStats] = useState<CombinedStats>({
    combinedDays: 0,
    combinedMoney: 0,
    combinedCravings: 0,
  });

  useEffect(() => {
    checkLinkedStatus();
  }, []);

  const checkLinkedStatus = async () => {
    setIsLinked(false);
    setCombinedStats({
      combinedDays: streakData.days,
      combinedMoney: moneySaved,
      combinedCravings: userData.totalCravingsResisted,
    });
  };

  const handleLinkPartner = () => {
    if (!partnerName.trim()) {
      Alert.alert('Error', 'Please enter your partner\'s name');
      return;
    }
    
    Alert.alert(
      'Link Partner',
      `Are you sure you want to link with ${partnerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Link',
          onPress: () => {
            setIsLinked(true);
            setPartnerName('');
            Alert.alert('Success!', `You're now linked with ${partnerName}. Support each other on this journey!`);
          },
        },
      ]
    );
  };

  const handleUnlinkPartner = () => {
    Alert.alert(
      'Unlink Partner',
      'Are you sure you want to unlink from your partner?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: () => {
            setIsLinked(false);
            Alert.alert('Unlinked', 'You have unlinked from your partner.');
          },
        },
      ]
    );
  };

  const getMilestoneProgress = (requirement: number, type: 'combinedDays' | 'combinedMoney' | 'combinedCravings') => {
    const current = combinedStats[type];
    return Math.min(current / requirement, 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Puff-Free Circle</Text>
        <Text style={styles.subtitle}>
          Quit smoking together for extra accountability
        </Text>

        {!isLinked ? (
          <View style={styles.linkSection}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Link with a Partner</Text>
              <Text style={styles.cardDesc}>
                Connect with someone who is also trying to quit. When one of you 
                hits the SOS button, the other gets notified to send support!
              </Text>
              
              <Text style={styles.inputLabel}>Your Partner's Name</Text>
              <TextInput
                style={styles.input}
                value={partnerName}
                onChangeText={setPartnerName}
                placeholder="Enter partner's name"
                placeholderTextColor={theme.colors.textSecondary}
              />
              
              <TouchableOpacity style={styles.linkButton} onPress={handleLinkPartner}>
                <Text style={styles.linkButtonText}>Link Partner</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.partnerSection}>
              <View style={styles.partnerCard}>
                <View style={styles.partnerAvatar}>
                  <Text style={styles.partnerEmoji}>💪</Text>
                </View>
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName}>Your Partner</Text>
                  <Text style={styles.partnerStatus}>Linked • Supporting you</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.unlinkButton} 
                onPress={handleUnlinkPartner}
              >
                <Text style={styles.unlinkButtonText}>Unlink</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Combined Progress</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{combinedStats.combinedDays}</Text>
                  <Text style={styles.statLabel}>Days Smoke-Free</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>${combinedStats.combinedMoney.toFixed(0)}</Text>
                  <Text style={styles.statLabel}>Combined Saved</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{combinedStats.combinedCravings}</Text>
                  <Text style={styles.statLabel}>Cravings Resisted</Text>
                </View>
              </View>
            </View>

            <View style={styles.milestonesSection}>
              <Text style={styles.sectionTitle}>Circle Milestones</Text>
              
              {SHARED_MILESTONES.map((milestone) => {
                const progress = getMilestoneProgress(milestone.requirement, milestone.type);
                return (
                  <View key={milestone.id} style={styles.milestoneCard}>
                    <View style={styles.milestoneHeader}>
                      <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                      <Text style={styles.milestoneDesc}>{milestone.description}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                      {Math.round(progress * 100)}% complete
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Circle Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              Check in with your partner daily. A simple "How are you doing?" 
              can make all the difference!
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>🎯</Text>
            <Text style={styles.tipText}>
              Set shared goals together. You're stronger as a team!
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>🏆</Text>
            <Text style={styles.tipText}>
              Celebrate each other's milestones. Every day counts!
            </Text>
          </View>
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  linkSection: {
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  cardDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  linkButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  partnerSection: {
    marginBottom: theme.spacing.lg,
  },
  partnerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  partnerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  partnerEmoji: {
    fontSize: 28,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  partnerStatus: {
    fontSize: 14,
    color: theme.colors.success,
    marginTop: 2,
  },
  unlinkButton: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  unlinkButtonText: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  milestonesSection: {
    marginBottom: theme.spacing.lg,
  },
  milestoneCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  milestoneDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  tipsSection: {
    marginBottom: theme.spacing.lg,
  },
  tipCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
