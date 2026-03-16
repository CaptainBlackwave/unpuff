import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../theme/theme';

interface StreakRingProps {
  days: number;
  hours: number;
  minutes: number;
  progress: number;
  size?: number;
}

export const StreakRing: React.FC<StreakRingProps> = ({
  days,
  hours,
  minutes,
  progress,
  size = 250,
}) => {
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          stroke={theme.colors.background}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={progress >= 1 ? theme.colors.streakFill : theme.colors.streak}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.content}>
        <Text style={styles.daysText}>{days}</Text>
        <Text style={styles.labelText}>days</Text>
        <Text style={styles.timeText}>
          {hours}h {minutes}m
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
  },
  daysText: {
    fontSize: 64,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  labelText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginTop: -4,
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
});
