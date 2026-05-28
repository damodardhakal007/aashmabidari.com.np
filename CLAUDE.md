# CLAUDE.md — aashmabidari.com.np

## Repository Overview

This repository hosts two distinct projects under the same Git root:

1. **Portfolio Website** (`/` root) — Aashma Bidari's personal site, deployed to `aashmabidari.com.np` via GitHub Pages.
2. **DAURE Android App** (`damodar dhakal/DAURE/`) — A feature-rich Kotlin/Compose Android application with Firebase backend.

There is no npm/Node.js build system. The website is plain HTML/CSS/JS; the Android app uses Gradle.

---

## Project 1: Portfolio Website

### Structure

```
/
├── index.html           # Homepage — hero section, typing animation, social links
├── about.html           # About page — bio (student, entrepreneur, motivator)
├── contact-me.html      # Contact page — email and location
├── privacy-policy.html  # Privacy policy
├── terms.html           # Terms of service
├── style.css            # All site styles (~10 KB)
├── script.js            # Menu toggle + Typed.js init
├── assets/              # Static images (profile photos)
└── CNAME                # Custom domain: aashmabidari.com.np
```

### Tech Stack

- Pure **HTML5 / CSS3 / Vanilla JavaScript** — no build step, no framework.
- **Boxicons 2.1.4** — icon library loaded from CDN.
- **Typed.js 2.1.0** — text typing animation on the homepage, loaded from CDN.

### Deployment

Automatic via GitHub Actions (`.github/workflows/static.yml`):
- Triggers on every push to `main`.
- Uploads the entire repository root to **GitHub Pages**.
- No build step — files are served as-is.
- Manual trigger available from the Actions tab.

### Conventions

- CSS class names use `kebab-case` (e.g. `.home-content`, `.social-media`).
- CSS custom properties (variables) defined at `:root` for colors/spacing.
- Responsive layout uses a hamburger menu toggle (`script.js`).
- No JavaScript frameworks — keep all JS vanilla.
- Do not introduce npm/bundlers for the portfolio; keep it zero-dependency build-wise.

---

## Project 2: DAURE Android App

### Location

```
damodar dhakal/DAURE/
```

Note the space in the parent directory name (`damodar dhakal`) — quote paths accordingly in shell commands.

### Structure

```
damodar dhakal/DAURE/
├── build.gradle.kts          # Root build config
├── settings.gradle.kts       # Module declarations
├── gradle.properties         # JVM args: -Xmx2048m, UTF-8
├── gradle/
│   ├── wrapper/              # Gradle 9.3.1
│   └── libs.versions.toml   # Centralized version catalog
└── app/
    ├── build.gradle.kts      # App module config
    └── src/main/
        ├── AndroidManifest.xml
        └── java/com/damodar/daure/
            ├── MainActivity.kt            # Entry point, navigation host, update checks
            ├── data/
            │   ├── model/ServiceModels.kt # Data classes for services
            │   ├── pref/UserPreferences.kt # DataStore preferences
            │   └── remote/
            │       ├── WeatherApi.kt      # Retrofit API client
            │       └── WeatherModels.kt   # Weather response models
            └── ui/
                ├── HomeScreen.kt          # Main dashboard
                ├── HomeViewModel.kt       # State & business logic for home
                ├── AuthScreen.kt          # Firebase/Google sign-in
                ├── ProfileScreen.kt       # User profile
                ├── SettingsScreen.kt      # App settings
                ├── InAppBrowserScreen.kt  # WebView-based browser
                ├── BrowserInputScreen.kt  # URL input UI
                ├── GamesScreen.kt         # Games/entertainment section
                ├── ActivityScreen.kt      # Activity log/tracker
                ├── WelcomeScreen.kt       # Onboarding flow
                ├── components/
                │   ├── AnalogueClock.kt
                │   ├── CustomBottomBar.kt
                │   ├── MovingEarth.kt
                │   ├── NepalFlag.kt
                │   ├── PrivacyPolicyDialog.kt
                │   └── RoboticBackground.kt
                └── theme/
                    ├── Color.kt
                    ├── Theme.kt
                    └── Type.kt
```

### Tech Stack & Key Versions

| Area | Library | Version |
|------|---------|---------|
| Language | Kotlin | 2.2.10 |
| UI | Jetpack Compose BOM | 2024.09.00 |
| Navigation | Navigation Compose | 2.8.9 |
| Database | Room (runtime + KTX) | 2.7.0 |
| Networking | Retrofit 2 + Moshi | 2.12.0 / 1.15.2 |
| Image Loading | Coil Compose | 2.7.0 |
| Async | Coroutines | 1.10.2 |
| Preferences | DataStore Preferences | 1.1.7 |
| Camera | AndroidX Camera | 1.5.0 |
| Location | Play Services Location | 21.3.0 |
| Permissions | Accompanist Permissions | 0.37.3 |
| Auth | Firebase Auth | 24.0.1 |
| Realtime DB | Firebase Database | 22.0.1 |
| In-app Messaging | Firebase IAM Display | 22.0.3 |
| App Updates | Play In-App Update | 2.1.0 |
| Credentials | AndroidX Credentials | 1.6.0 |
| Build System | Android Gradle Plugin | 9.1.1 |
| Code Gen | Google KSP | 2.3.5 |

**Target / Min SDK:**
- `compileSdk`: 36 (Android 15)
- `minSdk`: 24 (Android 7.0)
- `targetSdk`: 36
- Java compatibility: 11

### Architecture

- **Pattern:** MVVM (Model–View–ViewModel)
- **UI:** 100% Jetpack Compose — no XML layouts
- **State:** `ViewModel` with `StateFlow` / `collectAsStateWithLifecycle`
- **Navigation:** Single `NavHost` in `MainActivity.kt`; screens are top-level composables
- **Data layer:** Repository pattern not yet formalized — ViewModels currently call data sources directly
- **Preferences:** AndroidX DataStore (`UserPreferences.kt`) — do NOT use `SharedPreferences`
- **JSON:** Moshi with `@JsonClass(generateAdapter = true)` and KSP codegen

### Build Commands

Run all Gradle commands from inside the `damodar dhakal/DAURE/` directory:

```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest

# Clean build
./gradlew clean

# Sync dependencies
./gradlew dependencies
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files / classes | `PascalCase` | `HomeScreen.kt`, `WeatherApi.kt` |
| Functions / variables | `camelCase` | `fetchWeather()`, `userPrefs` |
| Constants | `UPPER_SNAKE_CASE` | `WEATHER_API_KEY` |
| Composables | `PascalCase` function | `@Composable fun HomeScreen(...)` |
| Screen routes | string constants in `MainActivity` | `"home"`, `"auth"` |
| Resource names | `snake_case` | `ic_launcher_foreground.xml` |

### Key Conventions

- All UI is Compose — never add XML-based views.
- Use `@Composable` functions for any new UI; keep composables small and focused.
- `ViewModel` holds UI state; composables observe via `collectAsStateWithLifecycle`.
- New dependencies go in `gradle/libs.versions.toml` (version catalog), not hardcoded in `build.gradle.kts`.
- Room entities need `@Entity`, DAOs need `@Dao`; always compile-time checked via KSP.
- Retrofit interfaces must return `suspend` functions; use `viewModelScope.launch` for calls.
- Permissions are managed via `accompanist-permissions`; always check/request at runtime.
- Firebase config files (`google-services.json`) are already present — do not overwrite them.

---

## Secondary Web Portfolio

```
damodar dhakal/
├── index.html       # Full-featured personal portfolio page
├── main.js          # Advanced animations: preloader, particles, typing effect (~26 KB)
├── stylesheet.css   # Complex styling with particle effects (~40 KB)
├── 1.jpg            # Profile image
└── daure-app/
    └── index.html   # Simple web landing for the DAURE app
```

This is a separate, standalone HTML/CSS/JS portfolio for Damodar Dhakal. Same conventions as the main portfolio (no build step, no framework).

---

## Git Workflow

- **Default branch:** `main` — triggers GitHub Pages deployment automatically.
- **Feature branches:** `claude/<description>` pattern used for AI-assisted work.
- Commit messages are currently informal; prefer short imperative summaries for new commits.
- There is no PR template or branch protection configuration visible in the repo.

---

## Environment Variables / Secrets

| Variable | Used in | Notes |
|----------|---------|-------|
| `WEATHER_API_KEY` | `WeatherApi.kt` | Weather API key — must be set in local `local.properties` or CI secrets |

Do not commit API keys or secrets. `google-services.json` files present are development configurations; treat them as potentially sensitive.

---

## No Test Infrastructure (Website)

The HTML/CSS/JS website has no automated tests. Manual browser testing is required for any changes to the portfolio pages.

The Android app has placeholder test directories (`androidTest/`, `test/`) set up but no tests written yet. New features should include unit tests where logic is testable.

---

## Common Tasks

### Add a new page to the portfolio

1. Create `new-page.html` following the same `<head>` boilerplate as `index.html` (meta tags, CDN links, `style.css`).
2. Add navigation link in every existing page's `<nav>` element.
3. No build step needed — push to `main` to deploy.

### Add a new screen to the Android app

1. Create `NewScreen.kt` in `app/src/main/java/com/damodar/daure/ui/`.
2. Add a corresponding `NewViewModel.kt` if state management is needed.
3. Register the route in `MainActivity.kt`'s `NavHost`.
4. Add a navigation entry in `CustomBottomBar.kt` if it requires bottom-nav access.

### Add a new dependency (Android)

1. Add the version to `[versions]` in `gradle/libs.versions.toml`.
2. Add the library alias to `[libraries]`.
3. Reference via `libs.<alias>` in `app/build.gradle.kts`.
4. Run `./gradlew dependencies` to verify resolution.
