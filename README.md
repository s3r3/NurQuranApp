# Islamic Mobile App: Quran, Prayer & Fasting Tools
A TypeScript-powered React Native application for daily Islamic practices, built from the components and utilities shared in this repository.

---

## Project Overview
This repository contains reusable UI components, utility functions, hooks, and localization files for a comprehensive Islamic mobile app featuring:
- Quran reader support
- Prayer time tracking
- Fasting & Islamic calendar
- Bookmark management for saved ayahs
- Multi-language (English/Indonesian) localization
- Consistent error/loading state design system

---

## Key Files & Components Breakdown
All provided project files are organized as follows:
### Reusable UI Components
| Component | File Path | Purpose |
|---|---|---|
| StarSVG | `assets/svg/StarSVG.tsx` | Decorative star icon used for splash screen and accent elements |
| BookmarkSectionHeader | `src/components/bookmark/BookmarkSectionHeader.tsx` | Section header for bookmark collection lists |
| ErrorState | `src/components/ErrorState.tsx` | Shared error screen with retry button for failed API/data loads |
| CalendarHeader / CalendarWeekHeader | `src/components/fasting/` | Header and weekday row components for the Islamic fasting calendar |
| LoadingState | `src/components/fasting/LoadingState.tsx` | Standardized loading screen with activity indicator |
| PrayerHeader | `src/components/prayer/PrayerHeader.tsx` | Top header for prayer times screen with refresh and settings controls |
| GreetingSection | `src/components/home/GreetingSection.tsx` | Time-based personalized greeting (Good Morning/Afternoon/Evening) for the home screen |
| SearchStats | `src/components/search/SearchStats.tsx` | Search loading state and results count display |
| DecorativeStars | `src/components/splash/DecorativeStars.tsx` | Animated star background for the app splash screen |

### Utilities & Helpers
| File Path | Purpose |
|---|---|
| `src/utils/bookmarkHelpers.ts` | Functions for sorting, filtering, and managing bookmark collections |
| `src/utils/collectionHelpers.ts` | Helpers for collection item counting and shareable content formatting |
| `src/components/preloadQuranData.ts` | Pre-fetches Quran surah data from the public [equran.id API](https://equran.id/api/v2/) on app launch |

### Custom React Hooks
Located in `src/hooks/`:
1.  `useBookmarkScreen.ts`: Business logic for bookmark screen navigation and management
2.  `useHomeNavigation.ts`: Navigation helpers for home screen actions (surah detail, last read, search)
3.  `useSplashNavigation.ts`: Handles post-splash screen navigation and onboarding completion

### Design & Localization
| Path | Purpose |
|---|---|
| `src/constants/` | Color palettes and static design data split across screen-specific files |
| `src/locales/en.json` / `src/locales/id.json` | English and Indonesian translation strings for app UI text |
| `src/types/` | TypeScript type definitions for Quran content, search results, and bookmarks |
| `src/contexts/ThemeContext.tsx` | App-wide theme and color scheme provider |

---

## Getting Started (For Full App Functionality)
### Prerequisites
1.  Set up your React Native development environment via the [official React Native guide](https://reactnative.dev/docs/environment-setup)
2.  Install Node.js 16+ and a package manager (npm/yarn)

### Required Missing Files
Some critical files are not included in this repository:
1.  `src/store/useAppStore.ts`: Zustand state management store for app state (bookmarks, surah data, onboarding status)
2.  `src/navigation/AppNavigator.ts`: React Native navigation stack definition
3.  `src/constants/colors.ts`: Centralized global color constants imported across most components
4.  Screen-specific constant files like `src/constants/prayer.constants.ts`, `src/constants/search.constants.ts` referenced in component imports

You can create these files using standard React Native + Zustand + React Navigation templates, or reference existing open-source implementations.

### Standard Installation Steps
Once all required files are added:
1.  Clone this repository and navigate to the project folder
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Install iOS pods (for iOS development):
    ```bash
    cd ios && pod install && cd ..
    ```
4.  Run the app:
    ```bash
    # Android
    npm run android

    # iOS
    npm run ios
    ```

---

## Customization Using Existing Files
### Update App Design
Modify the color palettes in the existing `src/constants/` files:
- `home.constants.ts`: Home screen and tab design colors
- `calendar.constants.ts`: Fasting calendar UI colors
- Update `src/contexts/ThemeContext.tsx` to extend global theming support

### Add New Languages
1.  Create a new JSON translation file in `src/locales/` (e.g. `es.json` for Spanish)
2.  Match the key structure from `en.json` or `id.json` and add translated strings
3.  Update your i18next configuration to register the new language

### Modify Splash Screen
Adjust the splash screen's star styling and placement:
1.  Update `assets/svg/StarSVG.tsx` to change the star icon design
2.  Modify `src/components/splash/DecorativeStars.tsx` to adjust star positions and opacity
3.  Add a `src/constants/splash.constants.ts` file to define adjustable star sizing and positioning

### Update Quran Data Source
Change the default Quran API endpoint in `src/components/preloadQuranData.ts` to use a different public Quran API.

---

## License
This project is available under the MIT open-source license. You are free to use, modify, and distribute it for personal or commercial projects.