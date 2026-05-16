# 🍎 Publishing DAURE to the Apple App Store

## Complete Step-by-Step Guide

---

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Enroll at: https://developer.apple.com/programs/enroll/
   - You need an Apple ID and payment method
   - Individual or Organization enrollment

2. **Mac with Xcode 15+** installed
   - Download from Mac App Store
   - Or from https://developer.apple.com/xcode/

3. **App Icon** (1024x1024 PNG, no transparency, no rounded corners)
   - Use the existing Android app icon (`android-app/app/src/main/ic_launcher-playstore.png`)
   - Convert it to proper iOS format if needed

---

## Step 1: Set Up the Project on Mac

1. Copy the `ios-app/` folder to your Mac
2. Open `DAURE.xcodeproj` in Xcode
3. Select your **Team** in Signing & Capabilities:
   - Go to Project > DAURE target > Signing & Capabilities
   - Select your Apple Developer Team
   - Xcode will auto-create provisioning profiles

---

## Step 2: Configure Bundle ID

1. In Xcode, go to the target settings
2. Set **Bundle Identifier**: `com.damodar.daure`
3. Set **Version**: `1.0.0`
4. Set **Build**: `1`

---

## Step 3: Add App Icon

1. Open `Assets.xcassets` in Xcode
2. Click on `AppIcon`
3. Drag your 1024x1024 PNG icon into the slot
4. Xcode will auto-generate all required sizes

---

## Step 4: Test on Device/Simulator

1. Select an iPhone simulator (iPhone 15 Pro recommended)
2. Press `Cmd + R` to build and run
3. Test all features:
   - Welcome screen flow
   - Home screen with services
   - In-app browser
   - Games section
   - Activity tracking
   - Settings (language, theme, timer)
   - Offline handling

---

## Step 5: Create App Store Connect Record

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps** > **+** > **New App**
3. Fill in:
   - **Platform**: iOS
   - **Name**: DAURE
   - **Primary Language**: English
   - **Bundle ID**: com.damodar.daure
   - **SKU**: DAURE2026
4. Click **Create**

---

## Step 6: Fill App Store Listing

Use the information from `APPSTORE_METADATA.md`:

1. **App Information** tab:
   - Category: Utilities
   - Privacy Policy URL: https://aashmabidari.com.np/privacy-policy.html

2. **Pricing and Availability** tab:
   - Price: Free
   - Availability: All territories (or select specific)

3. **App Privacy** tab:
   - Data Types collected: Location (used for weather)
   - Mark as "Data Not Linked to User"

4. **Version Information**:
   - Screenshots (see sizes in metadata)
   - Description, keywords, support URL
   - Age Rating: 4+

---

## Step 7: Archive and Upload

1. In Xcode, select **Any iOS Device (arm64)** as build target
2. Go to **Product > Archive**
3. Wait for archive to complete
4. In the Organizer window, click **Distribute App**
5. Choose **App Store Connect**
6. Click **Upload**
7. Wait for processing (takes ~15-30 minutes)

---

## Step 8: Submit for Review

1. Go back to App Store Connect
2. Select your app > Version 1.0.0
3. Under **Build**, select the uploaded build
4. Fill in **App Review Information**:
   - Contact information
   - Notes: "This app is a web browser and services aggregator. No login required."
5. Click **Submit for Review**

---

## Step 9: Wait for Review

- First review typically takes 24-48 hours
- You may receive rejection feedback - fix and resubmit
- Common rejection reasons:
  - Missing privacy policy
  - App is just a web wrapper (add more native features)
  - Broken links
  - Missing screenshots

---

## Tips to Avoid Rejection

1. ✅ **Native UI elements** - App has SwiftUI native navigation, settings, activity tracking
2. ✅ **Privacy Policy** - Already included in-app and online
3. ✅ **Location usage description** - Added in Info.plist
4. ✅ **No login required** - App works without authentication
5. ✅ **Offline handling** - Shows proper offline dialogs
6. ✅ **App adds value** - Activity tracking, weather, clock, multi-service aggregation

---

## App Review Guidelines Compliance

| Guideline | Status |
|-----------|--------|
| 4.2 Minimum Functionality | ✅ Has native features (clock, weather, activity tracking, settings) |
| 5.1 Privacy | ✅ Privacy policy included, location only for weather |
| 2.1 App Completeness | ✅ All features functional |
| 4.0 Design | ✅ Native SwiftUI design |
| 2.5.6 Apps that browse web | ✅ Adds significant native functionality |

---

## Updating the App

1. Increment version/build in Xcode
2. Make code changes
3. Archive and upload new build
4. Create new version in App Store Connect
5. Submit for review

---

## Useful Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications)
