# Guide de compilation Android

Ce guide vous explique comment compiler l'application pour Android.

## Prérequis

1. **Android Studio** installé avec :
   - Android SDK
   - Android SDK Platform-Tools
   - Android Emulator (optionnel, pour tester)

2. **Java Development Kit (JDK)** version 17 ou supérieure

3. **Variables d'environnement** configurées :
   - `ANDROID_HOME` pointant vers le SDK Android
   - `JAVA_HOME` pointant vers le JDK

## Méthode 1 : Build local avec Expo (Recommandé)

### Étape 1 : Préparer le projet

```bash
cd myapp
npm install
```

### Étape 2 : Générer les fichiers natifs Android

```bash
npx expo prebuild --platform android
```

### Étape 3 : Compiler l'APK de debug

**Option A : Avec Gradle directement**
```bash
cd android
./gradlew assembleDebug
```

**Option B : Avec Expo**
```bash
cd myapp
npx expo run:android
```

L'APK sera généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`

### Étape 4 : Compiler l'APK de release (pour distribution)

**Option A : Avec Gradle**
```bash
cd android
./gradlew assembleRelease
```

**Option B : Avec Expo**
```bash
cd myapp
npx expo run:android --variant release
```

L'APK sera généré dans : `android/app/build/outputs/apk/release/app-release.apk`

⚠️ **Note** : Pour la release, vous devrez configurer un keystore de signature. Voir la section "Signature" ci-dessous.

## Méthode 2 : Build avec EAS (Cloud Build)

### Étape 1 : Installer EAS CLI

```bash
npm install -g eas-cli
```

### Étape 2 : Se connecter à Expo

```bash
eas login
```

### Étape 3 : Configurer EAS

```bash
eas build:configure
```

### Étape 4 : Lancer le build Android

```bash
eas build --platform android
```

Pour un build local avec EAS :
```bash
eas build --platform android --local
```

## Méthode 3 : Build avec Android Studio

### Étape 1 : Ouvrir le projet dans Android Studio

1. Ouvrir Android Studio
2. File → Open → Sélectionner le dossier `myapp/android`
3. Attendre la synchronisation Gradle

### Étape 2 : Compiler

1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Attendre la fin de la compilation
3. L'APK sera dans `app/build/outputs/apk/debug/`

## Installation sur un appareil

### Via ADB (Android Debug Bridge)

```bash
# Vérifier que l'appareil est connecté
adb devices

# Installer l'APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Via USB

1. Activer le mode développeur sur votre appareil Android
2. Activer le débogage USB
3. Connecter l'appareil à votre ordinateur
4. Exécuter : `npx expo run:android`

## Signature pour la release

Pour signer l'APK de release, vous devez créer un keystore :

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Puis configurer dans `android/app/build.gradle` :

```gradle
signingConfigs {
    release {
        storeFile file('my-release-key.keystore')
        storePassword 'votre-mot-de-passe'
        keyAlias 'my-key-alias'
        keyPassword 'votre-mot-de-passe'
    }
}
```

## Dépannage

### Erreur : "SDK location not found"
```bash
# Windows PowerShell
$env:ANDROID_HOME = "C:\Users\VotreNom\AppData\Local\Android\Sdk"
```

### Erreur : "Java version"
Vérifiez que JAVA_HOME pointe vers JDK 17+ :
```bash
java -version
```

### Nettoyer le build
```bash
cd android
./gradlew clean
```

### Réinstaller les dépendances
```bash
cd myapp
rm -rf node_modules
npm install
cd android
./gradlew clean
```

## Commandes utiles

```bash
# Voir les logs Android
adb logcat

# Filtrer les logs React Native
adb logcat | grep -i "react"

# Voir les appareils connectés
adb devices

# Redémarrer l'application
adb shell am force-stop com.myapp
adb shell am start -n com.myapp/.MainActivity
```







