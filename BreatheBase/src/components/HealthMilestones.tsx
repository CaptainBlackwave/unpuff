import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { HealthMilestone } from '../types';

interface HealthMilestonesProps {
  milestones: HealthMilestone[];
}

export const HealthMilestones: React.FC<HealthMilestonesProps> = ({ milestones }) => {
  const achieved = milestones.filter(m => m.achieved);
  const nextMilestone = milestones.find(m => !m.achieved);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Progress</Text>
      
      {achieved.length > 0 && (
        <View style={styles.achievedSection}>
          {achieved.map((milestone) => (
            <View key={milestone.id} style={styles.milestoneItem}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.milestoneDesc}>{milestone.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {nextMilestone && (
        <View style={styles.nextSection}>
          <Text style={styles.nextLabel}>Next milestone:</Text>
          <Text style={styles.nextTitle}>{nextMilestone.title}</Text>
          <Text style={styles.nextDesc}>{nextMilestone.description}</Text>
        </View>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  achievedSection: {
    marginBottom: theme.spacing.md,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  milestoneDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  nextSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
  },
  nextLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 4,
  },
  nextDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
