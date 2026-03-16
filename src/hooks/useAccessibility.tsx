import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

interface AccessibilitySettings {
  highContrast: boolean;
  hapticFeedback: boolean;
  fontScale: 'normal' | 'large' | 'extraLarge';
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  hapticFeedback: true,
  fontScale: 'normal',
  reducedMotion: false,
};

const STORAGE_KEY = '@unpuff_accessibility';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
    setIsLoading(false);
  };

  const updateSetting = async <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, isLoading }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const getScaledFontSize = (baseSize: number, fontScale: 'normal' | 'large' | 'extraLarge'): number => {
  switch (fontScale) {
    case 'large':
      return baseSize * 1.2;
    case 'extraLarge':
      return baseSize * 1.4;
    default:
      return baseSize;
  }
};

export const getHighContrastColors = (highContrast: boolean, isDark: boolean) => {
  if (!highContrast) return null;
  
  if (isDark) {
    return {
      background: '#000000',
      surface: '#1A1A1A',
      textPrimary: '#FFFFFF',
      textSecondary: '#E0E0E0',
      primary: '#4DA6FF',
      success: '#00FF7F',
      danger: '#FF6B6B',
    };
  }
  
  return {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    textPrimary: '#000000',
    textSecondary: '#333333',
    primary: '#0066CC',
    success: '#008000',
    danger: '#CC0000',
  };
};
