import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Platform } from 'react-native';
import { theme } from '../theme/theme';
import { TriggerType, TRIGGERS } from '../types';

interface TriggerPickerProps {
  visible: boolean;
  onSelect: (trigger: TriggerType) => void;
  onSkip: () => void;
}

export const TriggerPicker: React.FC<TriggerPickerProps> = ({
  visible,
  onSelect,
  onSkip,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onSkip}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Text style={styles.title}>What triggered this craving?</Text>
          <Text style={styles.subtitle}>
            Tap to log your trigger and get personalized tips
          </Text>
          
          <View style={styles.triggersGrid}>
            {TRIGGERS.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={styles.triggerButton}
                onPress={() => onSelect(item.type)}
              >
                <Text style={styles.triggerEmoji}>{item.emoji}</Text>
                <Text style={styles.triggerText}>{item.type}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  triggersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  triggerButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    width: '30%',
    minWidth: 90,
  },
  triggerEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  triggerText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  skipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
