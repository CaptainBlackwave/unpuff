import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface XPDisplayProps {
  xp: number;
  level: number;
  xpPerLevel?: number;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({
  xp,
  level,
  xpPerLevel = 500,
}) => {
  const xpInCurrentLevel = xp % xpPerLevel;
  const progress = xpInCurrentLevel / xpPerLevel;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>LVL {level}</Text>
        </View>
        <Text style={styles.xpText}>{xp} XP</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xpRemaining}>
        {xpPerLevel - xpInCurrentLevel} XP to next level
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  levelBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  levelText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  xpText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  xpRemaining: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
});
