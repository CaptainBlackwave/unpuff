import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { useUserData } from '../hooks/useUserData';
import { TriggerStats } from '../types';

export const TriggerHeatMap: React.FC = () => {
  const { getHeatMapData, getTriggerStats, userData } = useUserData();
  const [heatMapData, setHeatMapData] = useState<number[]>([]);
  const [triggerStats, setTriggerStats] = useState<TriggerStats[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getHeatMapData();
      const stats = await getTriggerStats();
      setHeatMapData(data);
      setTriggerStats(stats);
    };
    loadData();
  }, [userData.cravingsHistory]);

  const maxCount = Math.max(...heatMapData, 1);
  
  const getColor = (count: number) => {
    if (count === 0) return theme.colors.background;
    const intensity = count / maxCount;
    if (intensity < 0.25) return '#E8F5E9';
    if (intensity < 0.5) return '#A5D6A7';
    if (intensity < 0.75) return '#66BB6A';
    return '#2ECC71';
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
  };

  const totalCravings = heatMapData.reduce((a, b) => a + b, 0);

  if (totalCravings === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🔥 Danger Zones</Text>
        <Text style={styles.emptyText}>
          Log your cravings to see your trigger patterns
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Danger Zones</Text>
      <Text style={styles.subtitle}>Your peak craving times</Text>
      
      <View style={styles.heatmap}>
        {heatMapData.map((count, hour) => (
          <View
            key={hour}
            style={[styles.hourCell, { backgroundColor: getColor(count) }]}
          >
            <Text style={styles.hourText}>{formatHour(hour)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E8F5E9' }]} />
          <Text style={styles.legendText}>Low</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#66BB6A' }]} />
          <Text style={styles.legendText}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2ECC71' }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
      </View>

      {triggerStats.length > 0 && (
        <View style={styles.topTriggers}>
          <Text style={styles.topTriggersTitle}>Top Triggers</Text>
          {triggerStats.slice(0, 3).map((stat, index) => (
            <View key={stat.trigger} style={styles.triggerRow}>
              <Text style={styles.triggerRank}>#{index + 1}</Text>
              <Text style={styles.triggerName}>{stat.trigger}</Text>
              <Text style={styles.triggerCount}>{stat.count}x</Text>
            </View>
          ))}
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
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: theme.spacing.md,
  },
  hourCell: {
    width: '10.5%',
    aspectRatio: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourText: {
    fontSize: 8,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  topTriggers: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
    paddingTop: theme.spacing.md,
  },
  topTriggersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  triggerRank: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    width: 24,
  },
  triggerName: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  triggerCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
