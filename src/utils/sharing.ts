import { Alert, Linking, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';

export const shareMilestone = async (
  viewRef: React.RefObject<any>,
  streakDays: number,
  moneySaved: number
): Promise<boolean> => {
  try {
    if (!viewRef.current) {
      Alert.alert('Error', 'Unable to capture image. Please try again.');
      return false;
    }

    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    });

    if (!uri) {
      Alert.alert('Error', 'Failed to capture image.');
      return false;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      const message = `I'm ${streakDays} days smoke-free and saved $${moneySaved.toFixed(0)}! Quitting with Unpuff 🌟`;
      if (Platform.OS === 'ios') {
        const twitterUrl = `twitter://post?text=${encodeURIComponent(message)}`;
        const canOpen = await Linking.canOpenURL(twitterUrl);
        if (canOpen) {
          await Linking.openURL(twitterUrl);
        } else {
          Alert.alert('Share', message);
        }
      } else {
        Alert.alert('Share', message);
      }
      return false;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: 'Share Your Milestone',
      UTI: 'public.png',
    });

    return true;
  } catch (error) {
    console.error('Error sharing milestone:', error);
    Alert.alert('Error', 'Failed to share. Please try again.');
    return false;
  }
};

export const MILESTONES = [
  { days: 1, name: 'First Day' },
  { days: 3, name: '3 Days' },
  { days: 7, name: '1 Week' },
  { days: 14, name: '2 Weeks' },
  { days: 30, name: '1 Month' },
  { days: 60, name: '60 Days' },
  { days: 90, name: '90 Days' },
  { days: 180, name: '6 Months' },
  { days: 365, name: '1 Year' },
];

export const checkForNewMilestone = (
  currentStreak: number,
  previousMilestones: number[]
): { isNew: boolean; milestone: typeof MILESTONES[0] | null } => {
  for (const milestone of MILESTONES) {
    if (currentStreak >= milestone.days && !previousMilestones.includes(milestone.days)) {
      return { isNew: true, milestone };
    }
  }
  return { isNew: false, milestone: null };
};
