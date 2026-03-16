import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import tipsData from '../data/tips.json';
import { Tip, TipCategory } from '../types';

const CATEGORIES: (TipCategory | 'All')[] = ['All', 'Physical', 'Mental', 'Emergency'];

export const TipsScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | 'All'>('All');

  const filteredTips = selectedCategory === 'All'
    ? tipsData.tips
    : tipsData.tips.filter(tip => tip.category === selectedCategory);

  const tips: Tip[] = filteredTips.map(t => ({
    ...t,
    category: t.category as TipCategory,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Daily Tips</Text>
        <Text style={styles.subtitle}>
          Micro-missions to help you stay smoke-free
        </Text>
        
        <View style={styles.morningWisdom}>
          <Text style={styles.wisdomLabel}>🌅 Morning Wisdom</Text>
          <Text style={styles.wisdomText}>
            Trigger Alert: If you usually smoke with coffee, try drinking it with 
            your non-dominant hand today. Break the muscle memory!
          </Text>
        </View>
        
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.tipsList}>
          {tips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipCategory}>{tip.category}</Text>
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipContent}>{tip.content}</Text>
            </View>
          ))}
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  morningWisdom: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  wisdomLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  wisdomText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.background,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  tipsList: {
    gap: theme.spacing.md,
  },
  tipCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  tipHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  tipCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  tipContent: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
