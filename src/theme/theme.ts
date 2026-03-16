import { getScaledFontSize } from '../hooks/useAccessibility';

export const baseTheme = {
  colors: {
    primary: '#2D7DD2',
    secondary: '#45B69C',
    accent: '#F7B538',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6C757D',
    danger: '#E63946',
    success: '#2ECC71',
    streak: '#2D7DD2',
    streakFill: '#2ECC71',
  },
  highContrast: {
    primary: '#0066CC',
    secondary: '#008000',
    accent: '#FF8C00',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    textPrimary: '#000000',
    textSecondary: '#333333',
    danger: '#CC0000',
    success: '#008000',
    streak: '#0066CC',
    streakFill: '#008000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const getTypography = (fontScale: 'normal' | 'large' | 'extraLarge') => ({
  h1: {
    fontSize: getScaledFontSize(32, fontScale),
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: getScaledFontSize(24, fontScale),
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: getScaledFontSize(20, fontScale),
    fontWeight: '600' as const,
  },
  body: {
    fontSize: getScaledFontSize(16, fontScale),
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: getScaledFontSize(14, fontScale),
    fontWeight: '400' as const,
  },
  xp: {
    fontSize: getScaledFontSize(20, fontScale),
    fontWeight: '700' as const,
  },
});

export const createTheme = (highContrast: boolean, fontScale: 'normal' | 'large' | 'extraLarge') => {
  const colors = highContrast ? baseTheme.highContrast : baseTheme.colors;
  const typography = getTypography(fontScale);
  
  return {
    colors,
    highContrast: baseTheme.highContrast,
    spacing: baseTheme.spacing,
    borderRadius: baseTheme.borderRadius,
    typography,
    shadows: baseTheme.shadows,
  };
};

export const theme = baseTheme;
export type Theme = typeof theme;
