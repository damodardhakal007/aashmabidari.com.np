# Project Plan

Refine the DAURE super app by implementing an in-app browser for all links and updating the header image with the user-provided Swyambhu photo.

## Project Brief

# DAURE (दाउरे) Refinement Brief

## New Requirements
1. **In-App Browser**: All service links (Documents, Banks, AI, News, Radio) must open inside the app using a `WebView` component instead of an external browser.
2. **Header Image Update**: Use the provided image `image_2.jpeg` for the "Nepal Swyambhu view" in the header card.
3. **Consistency**: Ensure the In-App Browser follows the Black and White Material 3 theme (e.g., top bar with title and close button).

## Technical
- `WebView` implementation for in-app browsing.
- Resource update for the header background image.

## Implementation Steps

### Task_5_Icon_Styling_and_Social_Media: Update icon styling with blue shadow/background. Implement Social Media section (Facebook, X, YouTube) with official logos. Implement real-time weather and location updates.
- **Status:** IN_PROGRESS
- **Acceptance Criteria:**
  - Service icons feature blue shadow/background
  - Social Media section added with Facebook, X, YouTube logos
  - Weather and location update dynamically based on device data

### Task_6_Media_Notification_and_Landscape_Video: Implement MediaSession and notifications for media playback (Pause, Stop, Time) in lock screen. Ensure video/YouTube links support full-screen and landscape mode.
- **Status:** PENDING
- **Acceptance Criteria:**
  - Media controls (Pause, Stop) appear in notification/lock screen during video playback
  - Videos open in full-screen and support landscape rotation

### Task_7_Final_Verification: Perform a final check of all features: In-App Browser, Settings, Clocks, Floating Timer, Weather, Location, Social Media, and Media Notifications.
- **Status:** PENDING
- **Acceptance Criteria:**
  - App is in full-screen mode
  - Videos support landscape and lock screen controls
  - Default theme is Black Mode
  - Final build passes assembleDebug

