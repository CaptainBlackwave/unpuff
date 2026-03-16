# Unpuff

A gamified quit-smoking app built with React Native and Expo. Track your smoke-free streak, get instant support during cravings, and watch your progress with XP and achievements.

## Features

### 📊 Dashboard
- **Clean Streak Ring** - Visual progress showing days, hours, and minutes smoke-free
- **Money Saved** - Real-time counter of how much you've saved by not smoking
- **XP & Level System** - Earn XP for every craving you resist and level up
- **Health Milestones** - Track your body's recovery progress

### 🆘 SOS Button
When a craving hits, tap the SOS button for instant support:
1. **Validation** - Acknowledge the craving as a wave that passes
2. **Tip** - Randomized behavioral tip (Physical, Mental, or Emergency)
3. **Hype** - Motivational reminder of what you'd lose by giving in

### 💡 Daily Tips
- Morning Wisdom - Daily trigger alerts and micro-missions
- Categorized Library:
  - Physical (ice trick, breathing exercises, water)
  - Mental (counting, visualization, box breathing)
  - Emergency (call a friend, step outside, chew gum)

### 🏆 Gamification
- **XP System**: +10 XP per craving resisted, +100 XP per 24 hours smoke-free
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

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/CaptainBlackwave/unpuff.git
cd unpuff

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device/Emulator

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start --web
```

## Project Structure

```
unpuff/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── StreakRing.tsx
│   │   ├── SOSButton.tsx
│   │   ├── XPDisplay.tsx
│   │   ├── MoneySaved.tsx
│   │   ├── HealthMilestones.tsx
│   │   └── InterventionModal.tsx
│   ├── screens/          # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── SOSScreen.tsx
│   │   ├── TipsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useStreak.ts
│   │   └── useUserData.ts
│   ├── utils/           # Utility functions
│   │   ├── storage.ts
│   │   └── calculations.ts
│   ├── data/            # Static data
│   │   └── tips.json
│   ├── theme/           # Styling
│   │   └── theme.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── navigation/      # Navigation config
│       └── AppNavigator.tsx
├── App.tsx              # Root component
└── app.json             # Expo configuration
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

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with ❤️ by [CaptainBlackwave](https://github.com/CaptainBlackwave)
