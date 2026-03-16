import { NativeModules, Platform } from 'react-native';

interface WidgetSyncInterface {
  syncWidgetData(quitDate: string, moneyPerDay: number): void;
}

const { WidgetSync } = NativeModules;

export const syncWidgetData = (quitDate: string, moneyPerDay: number): void => {
  if (Platform.OS === 'android' && WidgetSync) {
    try {
      WidgetSync.syncWidgetData(quitDate, moneyPerDay);
    } catch (error) {
      console.error('Error syncing widget data:', error);
    }
  }
};

export default WidgetSync;
