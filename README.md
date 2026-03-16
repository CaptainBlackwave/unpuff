# Unpuff

A gamified quit-smoking app built with React Native and Expo. Track your smoke-free streak, get instant support during cravings, and watch your progress with XP and achievements.

## Features

### 📊 Dashboard
- **Clean Streak Ring** - Visual progress showing days, hours, and minutes smoke-free
- **Money Saved** - Real-time counter of how much you've saved by not smoking
- **XP & Level System** - Earn XP for every craving you resist and level up
- **Health Milestones** - Track your body's recovery progress
- **Trigger Heat Map** - Visual calendar showing peak craving times

### 🆘 SOS Button
When a craving hits, tap the SOS button for instant support:
1. **Trigger Selection** - Log what triggered the craving (☕ Morning Coffee, 🚗 Driving, 💼 Work Stress, etc.)
2. **Validation** - Acknowledge the craving as a wave that passes
3. **Tip** - Personalized tip based on your trigger + randomized behavioral tip
4. **Hype** - Motivational reminder of what you'd lose by giving in
- **Haptic Feedback** - Heartbeat vibration pattern to help ground you physically

### 🗺️ Trigger Map (Data-Driven Insights)
- **Contextual Logging** - Track what triggers your cravings
- **Heat Map** - Visual calendar showing your "Danger Zones" by time of day
- **Top Triggers** - See which situations cause the most cravings
- **Smart Tips** - Trigger-specific advice (e.g., "Drink coffee with non-dominant hand")

### 💡 Daily Tips
- Morning Wisdom - Daily trigger alerts and micro-missions
- Categorized Library:
  - Physical (ice trick, breathing exercises, water)
  - Mental (counting, visualization, box breathing)
  - Emergency (call a friend, step outside, chew gum)

### ♿ Accessibility
- **High Contrast Mode** - Enhanced visibility toggle
- **Dynamic Type** - Normal, Large, and Extra Large text sizes
- **Haptic Feedback** - Heartbeat vibration on SOS button
- **Reduced Motion** - Option to minimize animations
- **Voice Activation** - Deep link support (`unpuff://sos`)

### 📱 Home Screen Widget (Android)
- Displays your current streak directly on the home screen
- Shows days smoke-free, hours, and money saved
- Auto-updates every 30 minutes

### 🏆 Gamification
- **XP System**: +10 XP per craving resisted, +100 XP per 24 hours smoke-free
- **Levels**: Progress through levels as you earn XP
- **Badges**:
  - The Newbie (Day 1)
  - The Taste-Tester (Day 3)
  - The Iron Lung (Week 2)
  - The Bank Vault ($100 Saved)

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage for local persistence
- **Date Handling**: date-fns
- **Graphics**: react-native-svg
- **Haptics**: expo-haptics

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or yarn)
- Expo CLI
- For Android: Java JDK 17+
- For iOS: Xcode (macOS only)

### Installation

```bash
# Clone the repository
git clone https://github.com/CaptainBlackwave/unpuff.git
cd unpuff

# Install dependencies (includes web support)
npm install

# Start the development server
npx expo start
```

### Running the App

#### Development (Expo Go on mobile)
```bash
npx expo start
# Scan QR code with Expo Go on your phone
```

#### Web Browser
```bash
npx expo start --web
```

#### Android (Emulator/Device)
```bash
# Generate native Android project (first time only)
npx expo prebuild --platform android

# Run on connected device or emulator
npx expo run:android
```

Or build a debug APK:
```bash
cd android
./gradlew assembleDebug
# APK will be at android/app/build/outputs/apk/debug/app-debug.apk
```

#### iOS (macOS only)
```bash
# Generate native iOS project (first time only)
npx expo prebuild --platform ios

# Run on iOS Simulator
npx expo run:ios
```

## Building for Production

### Android APK
```bash
# Clean and build release APK
cd android
./gradlew assembleRelease
# APK will be at android/app/build/outputs/apk/release/app-release.apk
```

### iOS (Requires macOS)
```bash
# Build for iOS Simulator
xcodebuild -workspace ios/Unpuff.xcworkspace \
  -scheme Unpuff \
  -configuration Debug \
  -destination "platform=iOS Simulator,name=iPhone 15" \
  build

# Or use Archive for App Store
xcodebuild -workspace ios/Unpuff.xcworkspace \
  -scheme Unpuff \
  -configuration Release \
  -archivePath Unpuff.xcarchive \
  archive
```

### Web (Production Build)
```bash
npx expo export --platform web
# Output will be in dist/ folder
```

## Project Structure

```
unpuff/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── StreakRing.tsx
│   │   ├── SOSButton.tsx
│   │   ├── XPDisplay.tsx
│   │   ├── MoneySaved.tsx
│   │   ├── HealthMilestones.tsx
│   │   ├── InterventionModal.tsx
│   │   ├── TriggerPicker.tsx
│   │   ├── TriggerHeatMap.tsx
│   │   └── StreakDisplay.tsx
│   ├── screens/             # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── SOSScreen.tsx
│   │   ├── TipsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useStreak.ts
│   │   ├── useUserData.tsx
│   │   └── useAccessibility.tsx
│   ├── utils/               # Utility functions
│   │   ├── storage.ts
│   │   ├── calculations.ts
│   │   ├── widgetService.ts
│   │   └── widgetSync.ts
│   ├── data/                # Static data
│   │   └── tips.json
│   ├── theme/               # Styling
│   │   └── theme.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── navigation/          # Navigation config
│       └── AppNavigator.tsx
├── android/                  # Native Android project
│   └── app/src/main/
│       ├── java/com/unpuff/
│       │   ├── widget/      # Android widget
│       │   └── WidgetSyncModule.kt
│       └── res/             # Android resources
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
└── package.json
```

## Data Schema

User data is stored locally with the following structure:

```typescript
interface UserData {
  quitDate: string;           // ISO timestamp
  moneySavedPerDay: number;  // Daily cigarette cost
  totalCravingsResisted: number;
  xp: number;
  level: number;
  cravingsHistory: CravingEvent[];
}

interface CravingEvent {
  id: string;
  timestamp: string;
  tipUsed: string;
  category: 'Physical' | 'Mental' | 'Emergency';
  trigger?: TriggerType;
  resisted: boolean;
}

type TriggerType = 
  | 'Morning Coffee'
  | 'Driving'
  | 'Work Stress'
  | 'Social'
  | 'Alcohol'
  | 'After Meal'
  | 'Boredom'
  | 'Phone Break'
  | 'Evening Relax'
  | 'Other';
```

## Health Milestones

| Time | Milestone |
|------|-----------|
| 20 min | Heart rate normalizes |
| 8 hrs | Oxygen levels recover |
| 48 hrs | Taste buds recover |
| 2 weeks | Circulation improves |
| 1 month | Lung function increases |
| 1 year | Heart disease risk halved |

## Voice Commands

### Android
```bash
# Trigger SOS mode via deep link
adb shell am start -d "unpuff://sos"
```

### iOS
```
"Hey Siri, open unpuff://sos"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with ❤️ by [CaptainBlackwave](https://github.com/CaptainBlackwave)
