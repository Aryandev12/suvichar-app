

---

# Suvichar – Quote Poster App

A modern React Native app to create, edit, and share beautiful Hindi quote posters with your name and photo.
Built using React Native CLI, Firebase, Cloudinary, and Zustand.

---

## Features

* Phone OTP Authentication (Firebase)
* Profile Setup (Name, Photo, Purpose)
* Quote Templates and Custom Background Upload
* Edit Quote Text
* Glow Animation on Profile Photo
* Share Poster as Image (WhatsApp, Instagram, etc.)
* Download Poster to Gallery
* Image Upload via Cloudinary
* Quote History Saved in Firestore
* Auto Login and Persistence (Zustand + AsyncStorage)
* Secure Logout
* Premium UI with Locked Features

---

## Tech Stack

* React Native CLI
* Firebase Authentication and Firestore
* Cloudinary (Image Hosting)
* Zustand (State Management)
* React Navigation
* ViewShot (Poster Capture)
* React Native Share

---

## Setup

```bash
npm install
npx react-native run-android
```

---

## Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK Path:

```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Project Structure

```
src/
 ├── screens/
 ├── components/
 ├── store/        (Zustand)
 ├── theme/
 └── services/     (Firebase)
```

---

## Future Improvements

* Premium subscription integration
* Cloud based quote templates
* Multi-language support
* Business branding packs
* Play Store release

---

## Author

Aryan Dev Chaurasia
Final Year CSE Student | Full Stack Developer
Built as a production-ready MVP.
