# Pomodoro App (Capacitor + Android)

This project was created to explore how to use **native Android features** from a web application using Capacitor.

## 🧠 Overview

The app is built with a web stack (Vite + JavaScript) and then wrapped into a native Android app using Capacitor. This allows the use of device features such as camera, storage, and more.

---

## ⚙️ Setup

### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli --save
```

---

### 2. Initialize Capacitor

```bash
npx cap init
```

This links your web project to a native app and creates the base Capacitor configuration.

---

## 📁 Project Structure

After setup, your project should look like this:

```text
capacitor_app/
  ├── src/           # Web app source code
  ├── index.html
  ├── package.json
  ├── dist/          # Production build (generated)
  ├── android/       # Native Android project (generated)
```

---

## 🚀 Build and Add Android Platform

First, build your web app:

```bash
npm run build
```

Then add the Android platform:

```bash
npx cap add android
```

This will generate the native Android project inside the `android/` folder.

---

## 📱 Run in Android Studio

To open the project in Android Studio:

```bash
npx cap open android
```

From there:

* Select an emulator or device
* Click ▶️ Run to launch the app

---

## 🔄 Development Workflow

Whenever you make changes to your web app:

```bash
npm run build
npx cap copy
```

Then re-run the app from Android Studio.

---

## 🎯 Goal

The goal of this project is to build a Pomodoro timer and extend it with native mobile capabilities using Capacitor.

---
