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
Every time you change code:

You MUST do: (this is what I am doing)

`npm run build`
`npx cap sync android`

Then re-run the app from Android Studio.

press run again
- top bar -> green button
- make sure the emulator is selected

---

## Running the App on Android Emulator

This project uses **Vite + Capacitor + Android Studio**. Follow these steps to run the app on an Android emulator.

### 1. Install dependencies

```bash
npm install
```

---

### 2. Build the web app

```bash
npm run build
```

This generates the production files in the `dist/` folder.

---

### 3. Sync with Android

```bash
npx cap sync android
```

This copies the built web app into the Android project.

---

### 4. Open in Android Studio

```bash
npx cap open android
```

---

### 5. Create and start an emulator

In Android Studio:

1. Go to **Tools → Device Manager**
2. Click **Create Device**
3. Choose a device (e.g. Pixel 5)
4. Select a system image (recommended: API 33 or API 34 with Google APIs)
5. Download the image if prompted
6. Click **Finish**
7. Press ▶️ to start the emulator

---

### 6. Run the app

* Select the emulator at the top of Android Studio
* Click the green **▶️ Run** button

The app will install and open on the emulator.

---

### 7. Updating the app

Every time you make changes, run:

```bash
npm run build
npx cap sync android
```

Then re-run the app from Android Studio.

---

### Notes

* Haptic feedback only works on a real device or emulator
* First emulator launch may take a few minutes
* If the app shows a blank screen, ensure you ran `npm run build` before syncing

---

