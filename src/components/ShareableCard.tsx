import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

interface ShareableCardProps {
  streakDays: number;
  moneySaved: number;
}

export const ShareableCard: React.FC<ShareableCardProps> = ({
  streakDays,
  moneySaved,
}) => {
  const formatStreak = (days: number) => {
    if (days === 1) return '1 Day';
    if (days < 7) return `${days} Days`;
    if (days === 7) return '1 Week';
    if (days < 30) return `${Math.floor(days / 7)} Weeks`;
    if (days === 30) return '1 Month';
    if (days < 365) return `${Math.floor(days / 30)} Months`;
    return `${Math.floor(days / 365)} Year${days >= 730 ? 's' : ''}`;
  };

  const formatMoney = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const getMilestoneTitle = () => {
    if (streakDays === 1) return 'First Day Complete!';
    if (streakDays === 3) return '3 Days Strong!';
    if (streakDays === 7) return 'One Week Milestone!';
    if (streakDays === 14) return 'Two Weeks of Freedom!';
    if (streakDays === 30) return 'One Month Smoke-Free!';
    if (streakDays === 60) return '60 Days of Strength!';
    if (streakDays === 90) return '90 Days - Incredible!';
    if (streakDays === 180) return 'Half a Year!';
    if (streakDays === 365) return 'One Full Year!';
    return `${streakDays} Days Strong!`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2D7DD2', '#1A1A2E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>🌬️</Text>
            <Text style={styles.appName}>Unpuff</Text>
          </View>

          <View style={styles.milestoneSection}>
            <Text style={styles.milestoneTitle}>{getMilestoneTitle()}</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatStreak(streakDays)}</Text>
                <Text style={styles.statLabel}>Smoke-Free</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatMoney(moneySaved)}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Quitting with Unpuff 🌟</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    top: -1000,
    left: 24,
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    marginRight: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  milestoneSection: {
    alignItems: 'center',
  },
  milestoneTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
