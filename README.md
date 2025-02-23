# React Native Timer App

A simple timer app built with React Native that allows users to create timers, add categories, play/pause, and reset timers.

## Features

- Create multiple timers
- Assign categories to timers
- Play, pause, and reset timers
- Check completed history

## Setup Instructions

### Clone the repository

```sh
git clone https://github.com/Suhas-17/timer.git
cd timer-app
```

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm start
```

### Run on Android

```sh
npx react-native run-android
```

## Assumptions Made During Development

- The app is built for Android devices.
- React Navigation Stack is used for screen navigation.
- Timers are made to persist with AsyncStorage.
- The UI is styled with basic React Native components and may require further customization.

## Dependencies

- React Native
- React Navigation (Stack Navigator)
- State management (useState, useEffect)
