import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';

interface ForgivenessModalProps {
  visible: boolean;
  onClose: () => void;
  onLogLapse: () => void;
  onRelapse: () => void;
}

export const ForgivenessModal: React.FC<ForgivenessModalProps> = ({
  visible,
  onClose,
  onLogLapse,
  onRelapse,
}) => {
  const handleLogLapse = () => {
    Alert.alert(
      'Lapse Logged',
      'Your streak is preserved. Learn from this moment and keep going!',
      [{ text: 'OK', onPress: onLogLapse }]
    );
  };

  const handleRelapse = () => {
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to reset everything? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Reset Everything', 
          style: 'destructive',
          onPress: onRelapse 
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={styles.title}>Progress, Not Perfection.</Text>
          
          <Text style={styles.body}>
            You had a cigarette. It happens.{'\n\n'}
            A lapse is a slip on the stairs; a relapse is falling all the way to the bottom.{'\n\n'}
            Don't throw away your hard work over one moment.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogLapse}
          >
            <Text style={styles.primaryButtonText}>
              Log a Lapse (Keep My Streak)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleRelapse}
          >
            <Text style={styles.dangerButtonText}>
              I Relapsed (Reset Everything)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
    maxWidth: 340,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.danger,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  dangerButtonText: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: theme.spacing.sm,
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
