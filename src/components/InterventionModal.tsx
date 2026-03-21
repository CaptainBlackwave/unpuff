import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Image, Dimensions, Platform } from 'react-native';
import { theme } from '../theme/theme';
import { Tip, TipCategory } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface InterventionModalProps {
  visible: boolean;
  validation: string;
  tip: Tip;
  hype: string;
  onComplete: () => void;
  motivationImageUri?: string | null;
  personalMantra?: string | null;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  visible,
  validation,
  tip,
  hype,
  onComplete,
  motivationImageUri,
  personalMantra,
}) => {
  const [phase, setPhase] = useState<'personal' | 'validation' | 'tip' | 'hype'>('personal');
  const [fadeAnim] = useState(new Animated.Value(0));
  const hasPersonalContent = motivationImageUri || personalMantra;

  useEffect(() => {
    if (visible) {
      setPhase(hasPersonalContent ? 'personal' : 'validation');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim, hasPersonalContent]);

  const handlePersonalOkay = async () => {
    onComplete();
  };

  const handlePersonalNeedHelp = () => {
    setPhase('validation');
  };

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
      case 'personal': return theme.colors.primary;
      case 'validation': return theme.colors.primary;
      case 'tip': return theme.colors.secondary;
      case 'hype': return theme.colors.accent;
    }
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'personal': return 'Your Why';
      case 'validation': return 'Breathe';
      case 'tip': return tip.title;
      case 'hype': return 'Stay Strong';
    }
  };

  const getContent = () => {
    switch (phase) {
      case 'personal': return personalMantra || '';
      case 'validation': return validation;
      case 'tip': return tip.content;
      case 'hype': return hype;
    }
  };

  const renderPersonalPhase = () => (
    <View style={styles.personalContainer}>
      {motivationImageUri && (
        <Image 
          source={{ uri: motivationImageUri }} 
          style={styles.motivationImage} 
          resizeMode="cover" 
        />
      )}
      {personalMantra && (
        <Text style={styles.mantraText}>{personalMantra}</Text>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onComplete}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {phase === 'personal' ? (
            <>
              <Text style={styles.phaseTitle}>Your Why</Text>
              {renderPersonalPhase()}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.success }]}
                onPress={handlePersonalOkay}
              >
                <Text style={styles.buttonText}>I remember now. I'm okay.</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.primary }]}
                onPress={handlePersonalNeedHelp}
              >
                <Text style={[styles.buttonText, { color: theme.colors.primary }]}>I'm still struggling. Help.</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
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
            </>
          )}
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
  personalContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  motivationImage: {
    width: screenWidth - 80,
    height: screenWidth - 80,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  mantraText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
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
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
