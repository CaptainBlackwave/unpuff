import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../theme/theme';
import { Tip, TipCategory } from '../types';

interface InterventionModalProps {
  visible: boolean;
  validation: string;
  tip: Tip;
  hype: string;
  onComplete: () => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  visible,
  validation,
  tip,
  hype,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'validation' | 'tip' | 'hype'>('validation');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setPhase('validation');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  const handleNext = () => {
    if (phase === 'validation') {
      setPhase('tip');
    } else if (phase === 'tip') {
      setPhase('hype');
    } else {
      onComplete();
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'validation': return theme.colors.primary;
      case 'tip': return theme.colors.secondary;
      case 'hype': return theme.colors.accent;
    }
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'validation': return 'Breathe';
      case 'tip': return tip.title;
      case 'hype': return 'Stay Strong';
    }
  };

  const getContent = () => {
    switch (phase) {
      case 'validation': return validation;
      case 'tip': return tip.content;
      case 'hype': return hype;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onComplete}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={[styles.indicator, { backgroundColor: getPhaseColor() }]} />
          
          <Text style={styles.phaseTitle}>{getPhaseTitle()}</Text>
          
          <Text style={styles.content}>{getContent()}</Text>
          
          {phase === 'tip' && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{tip.category}</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: getPhaseColor() }]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {phase === 'hype' ? 'I\'ve Got This' : 'Next'}
            </Text>
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
    padding: theme.spacing.lg,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  indicator: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: theme.spacing.lg,
  },
  phaseTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  categoryBadge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.lg,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
