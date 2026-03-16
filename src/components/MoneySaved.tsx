import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface MoneySavedProps {
  amount: number;
}

export const MoneySaved: React.FC<MoneySavedProps> = ({ amount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Money Saved</Text>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
      <Text style={styles.sublabel}>Keep going!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.secondary,
    marginVertical: theme.spacing.xs,
  },
  sublabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
