import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme/theme';

interface SOSButtonProps {
  onPress: () => void;
  hapticEnabled?: boolean;
}

const triggerHeartbeatHaptic = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  await new Promise(resolve => setTimeout(resolve, 150));
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  await new Promise(resolve => setTimeout(resolve, 150));
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

export const SOSButton: React.FC<SOSButtonProps> = ({ onPress, hapticEnabled = true }) => {
  const pulseAnim = useRef(new Animated.Value(1));
  const glowAnim = useRef(new Animated.Value(0));

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim.current, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim.current, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim.current, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim.current, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
    };
  }, [pulseAnim, glowAnim]);

  const handlePress = useCallback(async () => {
    if (hapticEnabled) {
      await triggerHeartbeatHaptic();
    }
    onPress();
  }, [hapticEnabled, onPress]);

  const glowColor = glowAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(230, 57, 70, 0.3)', 'rgba(230, 57, 70, 0.8)'],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.glow, 
          { backgroundColor: glowColor, transform: [{ scale: pulseAnim.current }] }
        ]}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityLabel="SOS - I'm having a craving"
        accessibilityHint="Press to get help with your craving"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>I'm Crushing It</Text>
        <Text style={styles.subtitleText}>Tap when a craving hits</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
