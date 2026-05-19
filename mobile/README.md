# Mini Shop - Mobile App

Built with **React Native**, **Expo Router**, and **TypeScript**.

## Overview
The customer-facing mobile application for iOS and Android.

### Features
- **Cross-Platform:** Built natively using Expo SDK.
- **Localization (i18n):** Full English and Arabic translations with automatic Right-To-Left (RTL) layout switching.
- **Theming:** Reactive Dark/Light mode context.
- **State Management:** Zustand for global cart persistence, TanStack React Query for backend synchronization.
- **Auth Flow:** SecureStore JWT management and complete registration/login pipelines.

## Setup
1. Copy `.env.example` to `.env` and map `EXPO_PUBLIC_API_URL` to your backend.
2. Run `npm install`.
3. Run `npx expo start`.
4. Press `i` to open the iOS simulator or `a` for Android.
