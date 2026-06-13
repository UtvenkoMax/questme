# QuestMe

Expo SDK 54 app with onboarding, PIN/biometric login, local quests, profile, and security settings.

## Run

```bash
npm install
npm run start
```

Platform shortcuts:

```bash
npm run android
npm run ios
npm run web
```

## Backend auth

Registration uses a backend adapter when `EXPO_PUBLIC_AUTH_API_URL` is set. The app sends `POST /register` with `{ name, email, password }` and stores the returned profile/session token when present. Without this variable, the app runs in local mode for development.

## Firebase env

Firebase is optional. If you use it, configure it through Expo public env variables instead of editing source code:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

## SDK compatibility

The app currently runs on Expo SDK 54. The project instructions require reading the Expo v56 docs before code changes, but Expo v56 targets React Native 0.85, React 19.2.3, and Node 22.13.x. Use `npm run verify` to check lint, TypeScript, and SDK-compatible dependency versions before upgrading.
