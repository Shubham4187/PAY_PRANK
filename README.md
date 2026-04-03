# 💸 PayPrank — Fest Fun Payment Simulator

> **A React Native prank app for college fests. Simulates a digital wallet payment experience — no real payments, no real data.**

---

## 🎭 Features

| Screen | Description |
|--------|-------------|
| **Splash Screen** | App logo, tagline, and safety disclaimer |
| **Home Screen** | Fake wallet balance (editable/randomizable), quick actions, prank stats, transaction history |
| **QR Scanner** | Fake camera UI with animated scan line; tap to simulate scanning → random merchant detected |
| **Payment Screen** | Enter amount, quick amount chips, note field |
| **Success Screen** | Loading animation with steps, then success checkmark |
| **Prank Reveal** | Confetti explosion, "YOU'VE BEEN PRANKED!" reveal, share button |
| **Transaction History** | List of all prank transactions |
| **Leaderboard** | Podium view for top 3, full rankings, prank count tracking |

---

## 🛠️ Tech Stack

- **React Native** 0.73
- **React Navigation** (Stack) — screen navigation
- **React Native Reanimated** — animations
- **AsyncStorage** — local prank count & leaderboard persistence
- **React Native Linear Gradient** — UI gradients
- **React Native Safe Area Context** — safe area insets
- Custom JS confetti animation (no external library needed)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)
- JDK 17

### Steps

```bash
# 1. Clone / extract this project
cd PayPrank

# 2. Install dependencies
npm install

# 3. For iOS (Mac only)
cd ios && pod install && cd ..

# 4. Run on Android
npx react-native run-android

# 5. Run on iOS
npx react-native run-ios
```

### Android Permissions
No special permissions required. The QR scanner is simulated — no camera access needed.

---

## 📁 Project Structure

```
PayPrank/
├── App.js                          # Root navigator
├── index.js                        # Entry point
├── app.json                        # App name config
├── package.json
├── babel.config.js
├── metro.config.js
└── src/
    ├── screens/
    │   ├── SplashScreen.js         # Splash with disclaimer
    │   ├── HomeScreen.js           # Wallet + quick actions
    │   ├── QRScannerScreen.js      # Fake camera + scan simulation
    │   ├── PaymentScreen.js        # Amount entry
    │   ├── SuccessScreen.js        # Loading → success animation
    │   ├── PrankRevealScreen.js    # Confetti + prank message
    │   ├── TransactionHistoryScreen.js
    │   └── LeaderboardScreen.js    # Prank rankings
    ├── components/
    │   └── Confetti.js             # Custom confetti animation
    └── utils/
        ├── theme.js                # Colors, constants, fake data
        └── storage.js              # AsyncStorage helpers
```

---

## ⚠️ Safety & Ethics

- ✅ **No real payments** — purely simulated UI
- ✅ **No personal data** collected or transmitted
- ✅ **No camera permissions** — QR scan is simulated
- ✅ **No contact/phone permissions**
- ✅ **No network calls** — fully offline
- ✅ Disclaimer shown on every launch
- ✅ Does **not** impersonate Paytm, Google Pay, PhonePe, or any real app
- ✅ Original "PayPrank" branding throughout

---

## 🎨 Design Highlights

- **Dark fintech aesthetic** — deep navy (#0A0E1A) base
- **Accent green** (#00C48C) — primary brand color
- **Red accent** (#FF6B6B) — secondary / prank reveal
- **Yellow** (#FFD93D) — warnings and confetti
- Smooth spring animations throughout
- Custom confetti with 60 animated pieces
- QR scanner with animated scan line + corner brackets
- Payment loading simulation with progress bar and status steps

---

## 🏆 Leaderboard

Tracks how many pranks each "player" has done. Data stored locally via AsyncStorage. Default leaderboard includes sample players — your count updates live as you prank.

---

## 📝 License

Built for entertainment purposes only. Free to use at college fests. Not for commercial use.

---

*Made with 😂 for college fests. Prank responsibly!*
