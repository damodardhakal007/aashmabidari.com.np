# DAURE iOS App

The iOS version of DAURE - Nepal's all-in-one digital services hub.

## Overview

This is a native SwiftUI iOS app that mirrors the Android version's functionality, providing access to Nepal's government services, finance tools, AI platforms, news, radio, games, and more through an elegant mobile interface.

## Project Structure

```
ios-app/
├── DAURE.xcodeproj/          # Xcode project file
├── DAURE/
│   ├── DAUREApp.swift         # App entry point
│   ├── ContentView.swift      # Main navigation controller
│   ├── Info.plist             # App configuration
│   ├── Assets.xcassets/       # App icons & colors
│   ├── Views/
│   │   ├── HomeView.swift         # Main home screen with services
│   │   ├── WelcomeView.swift      # Onboarding/welcome screen
│   │   ├── BrowserView.swift      # In-app web browser
│   │   ├── BrowserInputView.swift # URL input screen
│   │   ├── GamesView.swift        # Games section
│   │   ├── ActivityView.swift     # Usage analytics
│   │   ├── SettingsView.swift     # App settings
│   │   └── ProfileView.swift      # User profile
│   ├── ViewModels/
│   │   └── HomeViewModel.swift    # Main view model
│   ├── Models/
│   │   └── ServiceModels.swift    # Service data models
│   ├── Services/
│   │   ├── UserPreferences.swift  # Local storage
│   │   ├── NetworkMonitor.swift   # Connectivity monitoring
│   │   └── WeatherService.swift   # Weather API integration
│   └── Components/
│       └── CustomBottomBar.swift  # Custom tab bar
├── APPSTORE_METADATA.md       # App Store listing content
├── PUBLISHING_GUIDE.md        # Step-by-step publishing guide
└── README.md                  # This file
```

## Features

- 🏛️ Government Services Portal
- 📄 Document Verification (PAN, License, Voter ID)
- 💰 Finance & Stock Market (TMS, Mero Share, NEPSE)
- 🤖 AI Platforms (ChatGPT, Gemini, Claude, DeepSeek)
- 📻 Radio Stations
- 📰 News (National & International)
- 🎮 Browser Games
- 📺 TV Channels
- 🌐 Built-in Browser with Session Timer
- 🌙 Dark/Light Mode
- 🇳🇵 Bilingual (English/Nepali)
- 📊 Activity Tracking
- 🌤️ Weather Information
- ⏰ Analogue & Digital Clock

## Requirements

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+
- No external dependencies (uses only Apple frameworks)

## Getting Started

1. Open `DAURE.xcodeproj` in Xcode on macOS
2. Select your development team in Signing & Capabilities
3. Add your 1024x1024 app icon to `Assets.xcassets/AppIcon.appiconset/`
4. Build and run on simulator or device

## Publishing

See [PUBLISHING_GUIDE.md](./PUBLISHING_GUIDE.md) for complete Apple App Store submission instructions.

## Configuration

### Weather API
Add your OpenWeatherMap API key to `Info.plist`:
```xml
<key>WEATHER_API_KEY</key>
<string>YOUR_API_KEY_HERE</string>
```

## License

Proprietary - © 2026 Damodar. All rights reserved.
