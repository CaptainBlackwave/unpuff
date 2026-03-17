import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AccessibilityProvider } from './src/hooks/useAccessibility';
import { UserDataProvider } from './src/hooks/useUserData';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

if (isWeb) {
  console.log('Running on web - disabling widget functionality');
}

const prefix = Linking.createURL('/');

export default function App() {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url.includes('sos') || url.includes('craving')) {
        console.log('Deep link triggered: SOS mode');
      }
    };
    
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    Linking.getInitialURL().then(url => {
      if (url && (url.includes('sos') || url.includes('craving'))) {
        console.log('Initial URL: SOS mode');
      }
    });
    
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AccessibilityProvider>
        <UserDataProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </UserDataProvider>
      </AccessibilityProvider>
    </SafeAreaProvider>
  );
}
