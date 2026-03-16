import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ViewShot from 'react-native-view-shot';
import { theme } from '../theme/theme';
import { useStreak } from '../hooks/useStreak';
import { useUserData } from '../hooks/useUserData';
import { StreakRing } from '../components/StreakRing';
import { XPDisplay } from '../components/XPDisplay';
import { MoneySaved } from '../components/MoneySaved';
import { HealthMilestones } from '../components/HealthMilestones';
import { TriggerHeatMap } from '../components/TriggerHeatMap';
import { ForgivenessModal } from '../components/ForgivenessModal';
import { ShareableCard } from '../components/ShareableCard';
import { getHealthMilestones } from '../utils/calculations';
import { logLapse, resetProgress, markMilestoneShared } from '../utils/storage';
import { checkForNewMilestone, shareMilestone, MILESTONES } from '../utils/sharing';
import { RootStackParamList } from '../navigation/AppNavigator';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { streakData, moneySaved, dayProgress, quitDate, refreshStreak } = useStreak();
  const { userData, getTodayCravingsResisted, refresh } = useUserData();
  const [refreshing, setRefreshing] = useState(false);
  const [milestones, setMilestones] = useState(getHealthMilestones(quitDate));
  const [showForgivenessModal, setShowForgivenessModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const [hasCheckedMilestones, setHasCheckedMilestones] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    setMilestones(getHealthMilestones(quitDate));
  }, [quitDate]);

  useEffect(() => {
    if (!hasCheckedMilestones && userData.sharedMilestones) {
      const { isNew, milestone } = checkForNewMilestone(
        streakData.days,
        userData.sharedMilestones
      );
      if (isNew && milestone) {
        setCurrentMilestone(milestone);
        setShowShareModal(true);
      }
      setHasCheckedMilestones(true);
    }
  }, [streakData.days, userData.sharedMilestones, hasCheckedMilestones]);

  const onRefresh = async () => {
    setRefreshing(true);
    setMilestones(getHealthMilestones(quitDate));
    setRefreshing(false);
  };

  const handleLogLapse = async () => {
    await logLapse();
    await refresh();
    await refreshStreak();
    setShowForgivenessModal(false);
  };

  const handleRelapse = async () => {
    await resetProgress();
    setShowForgivenessModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const handleShare = async () => {
    if (currentMilestone) {
      await markMilestoneShared(currentMilestone.days);
      await refresh();
    }
    if (viewShotRef.current) {
      await shareMilestone(viewShotRef, streakData.days, moneySaved);
    }
    setShowShareModal(false);
    setCurrentMilestone(null);
  };

  const handleSkipShare = async () => {
    if (currentMilestone) {
      await markMilestoneShared(currentMilestone.days);
      await refresh();
    }
    setShowShareModal(false);
    setCurrentMilestone(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Unpuff</Text>
        
        <View style={styles.ringContainer}>
          <StreakRing
            days={streakData.days}
            hours={streakData.hours}
            minutes={streakData.minutes}
            progress={dayProgress}
            size={250}
          />
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MoneySaved amount={moneySaved} />
          </View>
        </View>
        
        <XPDisplay xp={userData.xp} level={userData.level} />
        
        <View style={styles.cravingsRow}>
          <View style={styles.cravingCard}>
            <Text style={styles.cravingNumber}>{getTodayCravingsResisted()}</Text>
            <Text style={styles.cravingLabel}>Cravings Resisted Today</Text>
            {userData.lapses > 0 && (
              <Text style={styles.lapseText}>{userData.lapses} lapse{userData.lapses > 1 ? 's' : ''} logged</Text>
            )}
          </View>
        </View>
        
        <HealthMilestones milestones={milestones} />
        
        <View style={styles.heatmapRow}>
          <TriggerHeatMap />
        </View>

        <TouchableOpacity 
          style={styles.slipButton}
          onPress={() => setShowForgivenessModal(true)}
        >
          <Text style={styles.slipButtonText}>I slipped up</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <ForgivenessModal
        visible={showForgivenessModal}
        onClose={() => setShowForgivenessModal(false)}
        onLogLapse={handleLogLapse}
        onRelapse={handleRelapse}
      />

      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <ShareableCard streakDays={streakData.days} moneySaved={moneySaved} />
      </ViewShot>

      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        onRequestClose={handleSkipShare}
      >
        <View style={styles.shareModalOverlay}>
          <View style={styles.shareModalContent}>
            <Text style={styles.shareModalEmoji}>🎉</Text>
            <Text style={styles.shareModalTitle}>Congratulations!</Text>
            <Text style={styles.shareModalText}>
              You've reached {currentMilestone?.days} days smoke-free!
            </Text>
            <Text style={styles.shareModalSubtext}>
              Want to share your progress and inspire others?
            </Text>
            <TouchableOpacity
              style={styles.shareModalButton}
              onPress={handleShare}
            >
              <Text style={styles.shareModalButtonText}>Share Milestone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareModalSkipButton}
              onPress={handleSkipShare}
            >
              <Text style={styles.shareModalSkipText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: theme.spacing.lg,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    maxWidth: 300,
  },
  cravingsRow: {
    marginBottom: theme.spacing.md,
  },
  cravingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  cravingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cravingLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  lapseText: {
    fontSize: 12,
    color: theme.colors.accent,
    marginTop: 4,
    fontWeight: '600',
  },
  heatmapRow: {
    marginTop: theme.spacing.md,
  },
  slipButton: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  slipButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
  shareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  shareModalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  shareModalEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  shareModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  shareModalText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  shareModalSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  shareModalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  shareModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareModalSkipButton: {
    paddingVertical: theme.spacing.sm,
  },
  shareModalSkipText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
