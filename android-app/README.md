# Aashma Bidari - Android App

An Android WebView application for [aashmabidari.com.np](https://aashmabidari.com.np) built for publishing on the Google Play Store.

## 📱 Features

- **WebView-based app** that loads the aashmabidari.com.np website
- **Splash screen** with app branding
- **Swipe-to-refresh** functionality
- **Offline error handling** with retry button
- **External link handling** (opens in browser)
- **Back navigation** support within WebView
- **Progress bar** showing page loading progress
- **Material Design** theming matching the website colors

## 🏗️ Project Structure

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/aashmabidari/app/
│   │   │   ├── MainActivity.java        # Main WebView activity
│   │   │   └── SplashActivity.java      # Splash screen
│   │   ├── res/
│   │   │   ├── layout/                  # Activity layouts
│   │   │   ├── drawable/                # Vector drawables & icons
│   │   │   ├── mipmap-anydpi-v26/       # Adaptive icons
│   │   │   ├── values/                  # Colors, strings, themes
│   │   │   └── xml/                     # Network & backup configs
│   │   └── AndroidManifest.xml
│   ├── build.gradle                     # App-level build config
│   └── proguard-rules.pro
├── build.gradle                         # Project-level build config
├── settings.gradle
├── gradle.properties
└── gradle/wrapper/
    └── gradle-wrapper.properties
```

## 🚀 Build Instructions

### Prerequisites

1. **Android Studio** (latest stable version recommended - Hedgehog or newer)
2. **JDK 8+** (bundled with Android Studio)
3. **Android SDK** with:
   - SDK Platform 34 (Android 14)
   - Build-Tools 34.0.0
   - Android SDK Platform-Tools

### Steps to Build

1. **Open in Android Studio:**
   - Open Android Studio
   - Select "Open an Existing Project"
   - Navigate to the `android-app` folder and select it
   - Wait for Gradle sync to complete

2. **Build Debug APK:**
   ```bash
   cd android-app
   ./gradlew assembleDebug
   ```
   The APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

3. **Build Release APK/AAB (for Play Store):**
   ```bash
   cd android-app
   ./gradlew bundleRelease
   ```
   The AAB will be at: `app/build/outputs/bundle/release/app-release.aab`

## 🔐 Signing for Play Store

### Generate a Keystore

```bash
keytool -genkey -v -keystore aashma-bidari-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias aashmabidari
```

### Configure Signing in `app/build.gradle`

Add the following inside the `android {}` block:

```groovy
signingConfigs {
    release {
        storeFile file('../aashma-bidari-release.jks')
        storePassword 'YOUR_STORE_PASSWORD'
        keyAlias 'aashmabidari'
        keyPassword 'YOUR_KEY_PASSWORD'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

> ⚠️ **IMPORTANT:** Never commit your keystore passwords to version control. Use environment variables or a local `keystore.properties` file.

## 📋 Play Store Publishing Checklist

### Required Assets

| Asset | Specification |
|-------|--------------|
| App Icon | 512x512 PNG (no transparency) |
| Feature Graphic | 1024x500 PNG |
| Screenshots | Min 2, Max 8 (phone: 16:9 or 9:16) |
| Short Description | Max 80 characters |
| Full Description | Max 4000 characters |

### Suggested Store Listing

**App Name:** Aashma Bidari

**Short Description:**
Official app of Aashma Bidari - Student, Entrepreneur & Motivator.

**Full Description:**
Aashma Bidari is the official app for Aashma Bidari's personal portfolio and services.

Discover:
• About Aashma Bidari - Student, Entrepreneur, and Motivator
• Services offered including education, entrepreneurship, and motivation
• Connect via social media (Facebook, Instagram)
• Contact information and direct communication

Features:
• Fast loading with optimized WebView
• Pull-to-refresh for latest content
• Offline detection with retry option
• Smooth navigation experience
• Material Design interface

Stay connected with Aashma Bidari and get inspired!

**Category:** Lifestyle or Education

**Content Rating:** Everyone

### Publishing Steps

1. **Create a Google Play Developer Account** ($25 one-time fee) at [play.google.com/console](https://play.google.com/console)
2. **Create a new app** in Play Console
3. **Fill in the Store Listing** with the information above
4. **Upload the signed AAB** (Android App Bundle)
5. **Set content rating** (fill questionnaire)
6. **Set pricing & distribution** (Free, all countries)
7. **Complete the Data Safety form**
8. **Submit for review**

## 🔧 Customization

### Change Website URL
Edit `WEBSITE_URL` in [`MainActivity.java`](android-app/app/src/main/java/com/aashmabidari/app/MainActivity.java:30):
```java
private static final String WEBSITE_URL = "https://aashmabidari.com.np";
```

### Change App Colors
Edit [`colors.xml`](android-app/app/src/main/res/values/colors.xml) to match your brand.

### Replace App Icon
Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) to generate all density icons from your logo image. Replace files in the `mipmap-*` directories.

## 📄 Data Safety Declaration

For the Play Store Data Safety form, this app:
- **Does NOT collect** personal data
- **Does NOT share** data with third parties
- Uses Internet permission **only** to load the website
- Does NOT use tracking or analytics SDKs

## 📝 License

© Aashma Bidari - All Rights Reserved
