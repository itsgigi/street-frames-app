# Development Build Guide

To see the map in your app, you need to create a development build since `react-native-maps` requires native code that isn't available in Expo Go.

## Option 1: EAS Build (Recommended - Cloud Builds)

### Prerequisites
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

### Build Steps

#### For iOS Simulator:
```bash
eas build --profile development --platform ios
```

After the build completes, download and install it on your simulator, then run:
```bash
npx expo start --dev-client
```

#### For iOS Device:
```bash
eas build --profile development --platform ios
```

Install the build on your device via TestFlight or direct download, then run:
```bash
npx expo start --dev-client
```

#### For Android:
```bash
eas build --profile development --platform android
```

After the build completes, download the APK and install it on your device/emulator, then run:
```bash
npx expo start --dev-client
```

---

## Option 2: Local Development Build

### For iOS (requires macOS + Xcode)

1. Install CocoaPods dependencies:
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. Generate native code:
   ```bash
   npx expo prebuild
   ```

3. Open in Xcode and run:
   ```bash
   npx expo run:ios
   ```

### For Android (requires Android Studio)

1. Generate native code:
   ```bash
   npx expo prebuild
   ```

2. Run on Android:
   ```bash
   npx expo run:android
   ```

---

## After Building

Once you have the development build installed:

1. Start the development server:
   ```bash
   npx expo start --dev-client
   ```

2. Open the app on your device/simulator - it will connect to the dev server automatically.

3. The map should now work! 🗺️

---

## Notes

- **Google Maps API Key**: For production, you'll need to add your Google Maps API key in `app.json`:
  ```json
  "react-native-maps": {
    "googleMapsApiKey": "YOUR_API_KEY_HERE"
  }
  ```

- **iOS**: Maps work out of the box with Apple Maps
- **Android**: Requires Google Maps API key for full functionality
