# BreatheBase - Specification Document

## 1. Project Overview

**Project Name:** BreatheBase  
**Type:** React Native Mobile App (Expo)  
**Core Functionality:** A gamified quit-smoking app with a persistent streak counter, real-time money saved tracker, and an SOS craving button with intervention tips.  
**Target Users:** People trying to quit smoking who need motivation, real-time tracking, and immediate support during cravings.

---

## 2. Memory Bank

### App Identity
- **Name:** BreatheBase
- **Type:** React Native (Expo)
- **Purpose:** Help users quit smoking through gamification, streak tracking, and immediate craving intervention

### SOS Logic (Prioritized Intervention)
The SOS system follows a three-phase intervention flow:
1. **Validation:** Acknowledge the craving as a wave that peaks and subsides
2. **Tip:** Suggest a physical/mental distraction (the "Tip")
3. **Hype:** Show "Cost of Relapse" warning to motivate staying strong

### Tech Stack
- **Framework:** React Native with Expo
- **Storage:** AsyncStorage for local persistence
- **Date Handling:** date-fns for precise calculations
- **Navigation:** React Navigation (native stack)
- **Animations:** React Native Reanimated

---

## 3. User Data Schema

```typescript
interface UserData {
  quitDate: string;           // ISO string
  moneySavedPerDay: number;   // User's daily cigarette cost
  totalCravingsResisted: number;
  xp: number;
  level: number;
  cravingsHistory: CravingEvent[];
}

interface CravingEvent {
  id: string;
  timestamp: string;
  tipUsed: string;
  resisted: boolean;
}
```

---

## 4. UI/UX Specification

### Color Palette (Minimalist Calming)
- **Primary:** #2D7DD2 (Calming Blue)
- **Secondary:** #45B69C (Soothing Green)
- **Accent:** #F7B538 (Gold/Yellow for achievements)
- **Background:** #F8F9FA (Light gray)
- **Surface:** #FFFFFF (White cards)
- **Text Primary:** #1A1A2E (Dark navy)
- **Text Secondary:** #6C757D (Gray)
- **Danger:** #E63946 (Red for reset/warnings)
- **Success:** #2ECC71 (Green for streaks)

### Typography
- **Font Family:** System default (San Francisco on iOS, Roboto on Android)
- **Heading 1:** 32px, Bold (Dashboard title)
- **Heading 2:** 24px, SemiBold (Section headers)
- **Body:** 16px, Regular
- **Caption:** 14px, Regular
- **XP Display:** 20px, Bold

### Layout
- **Bottom Tab Navigation:** Dashboard, SOS, Tips, Settings
- **Safe Area:** Proper handling for notch devices
- **Card-based UI:** Rounded corners (16px), subtle shadows

---

## 5. Screen Specifications

### 5.1 Dashboard Screen
- **Streak Ring:** Large circular progress ring (centered)
  - Shows days/hours/minutes smoke-free
  - Fills gradually throughout the day
  - Color: Primary blue transitioning to Success green
- **Money Saved:** Real-time counter below streak
  - Format: "$X.XX saved"
  - Updates every minute
- **XP Display:** Current XP and level indicator
- **Health Milestones:** Small icons that light up based on time
  - 20 minutes: Heart rate drops
  - 48 hours: Taste buds recovering
  - 2 weeks: Lung function improving
- **Quick Stats:** Cravings resisted today

### 5.2 SOS Screen (Craving Trigger)
- **Large SOS Button:** Glowing button at bottom
  - Label: "I'm Crushing It" or "Help!"
  - Pulsing animation to draw attention
- **Intervention Flow (Modal):**
  1. **Validation:** "The craving is a wave. It peaks at 3 minutes..."
  2. **Tip:** Random tip from tips.json
  3. **Hype:** "Don't let a 5-minute craving steal X days of work!"
- **Tip Categories:**
  - Physical: Ice trick, water, deep breathing
  - Mental: Count backwards, visualization
  - Emergency: Call a friend, step outside

### 5.3 Tips Screen (Daily Micro-Missions)
- **Morning Wisdom:** Featured tip at top (push notification at 8AM)
- **Categorized Library:**
  - Physical: 4-7-8 breathing
  - Oral Fixation: Cinnamon sticks, straws
  - Environmental: Smoke-proof spaces

### 5.4 Settings Screen
- **Edit Daily Cost:** Input for money saved per day
- **Reset Progress:** Tucked away, requires confirmation
- **Start Quit Date:** Date picker (defaults to now)

---

## 6. Gamification

### XP System
- +100 XP per 24 hours smoke-free
- +10 XP each craving resisted
- Level up every 500 XP

### Badges
- **Day 1:** The Newbie
- **Day 3:** The Taste-Tester
- **Week 2:** The Iron Lung
- **$100 Saved:** The Bank Vault

### Health Milestones Timeline
- 20 min: Heart rate normalizes
- 8 hrs: Oxygen levels recover
- 48 hrs: Taste buds recover
- 2 weeks: Circulation improves
- 1 month: Lung function increases
- 1 year: Heart disease risk halved

---

## 7. Technical Architecture

```
BreatheBase/
├── src/
│   ├── components/
│   │   ├── StreakRing.tsx
│   │   ├── SOSButton.tsx
│   │   ├── XPDisplay.tsx
│   │   ├── HealthMilestones.tsx
│   │   ├── MoneySaved.tsx
│   │   └── InterventionModal.tsx
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── SOSScreen.tsx
│   │   ├── TipsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── hooks/
│   │   ├── useStreak.ts
│   │   └── useUserData.ts
│   ├── data/
│   │   └── tips.json
│   ├── theme/
│   │   └── theme.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   └── calculations.ts
│   ├── types/
│   │   └── index.ts
│   └── navigation/
│       └── AppNavigator.tsx
├── App.tsx
└── package.json
```

---

## 8. Edge Cases

- **First Launch:** Initialize with current timestamp as quitDate
- **Leap Years:** Handle Feb 29 correctly with date-fns
- **Timezone Changes:** Store quitDate as UTC, display in local time
- **App Background:** Recalculate streak on app foreground
- **Reset:** Require double confirmation to prevent accidental reset

---

## 9. Success Criteria

1. Streak calculates accurately in real-time
2. Money saved updates continuously
3. SOS button provides randomized tips from each category
4. XP and levels work correctly
5. Health milestones display based on time elapsed
6. Data persists between app sessions
7. All screens are navigable via bottom tabs
