import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/theme';
import { useUserData } from '../hooks/useUserData';
import { useAccessibility } from '../hooks/useAccessibility';
import { updateQuitKit } from '../utils/storage';

export const QuitKitScreen: React.FC = () => {
  const { userData, refresh } = useUserData();
  const { settings } = useAccessibility();
  const [mantra, setMantra] = useState(userData.personalMantra || '');
  const [imageUri, setImageUri] = useState<string | null>(userData.motivationImageUri);
  const [isSaving, setIsSaving] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      return true;
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Photo Access Permission',
          message: 'Unpuff needs access to your photos to set your motivation image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please allow access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!imageUri && !mantra.trim()) {
      Alert.alert('Empty Vault', 'Please add a photo or mantra to your vault.');
      return;
    }

    setIsSaving(true);
    try {
      await updateQuitKit(imageUri, mantra.trim());
      await refresh();
      Alert.alert('Saved!', 'Your Quit Kit has been updated.');
    } catch (error) {
      console.error('Error saving quit kit:', error);
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const colors = settings.highContrast ? theme.highContrast : theme.colors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Your Vault</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          What are you fighting for?
        </Text>

        <TouchableOpacity
          style={[
            styles.imageArea,
            { backgroundColor: colors.surface, borderColor: colors.primary },
          ]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.motivationImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderIcon}>📷</Text>
              <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                Tap to add your "Why"
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.mantraSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Your Personal Mantra
          </Text>
          <TextInput
            style={[
              styles.mantraInput,
              {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                borderColor: colors.textSecondary,
              },
            ]}
            placeholder="Write a promise to yourself... (e.g., 'I am doing this so I can run with my daughter without losing my breath.')"
            placeholderTextColor={colors.textSecondary}
            value={mantra}
            onChangeText={setMantra}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            isSaving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save to Vault'}
          </Text>
        </TouchableOpacity>

        {(!imageUri || !mantra) && (
          <View style={[styles.hintBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.hintText, { color: colors.textSecondary }]}>
              💡 Tip: Add both a photo and mantra for maximum SOS power!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: theme.spacing.lg,
  },
  imageArea: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  motivationImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mantraSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  mantraInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    lineHeight: 24,
  },
  saveButton: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  hintBox: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
