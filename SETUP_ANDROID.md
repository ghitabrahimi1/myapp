# Configuration de l'environnement Android pour React Native

## Problèmes identifiés

1. ❌ **JAVA_HOME n'est pas défini** - Java JDK requis
2. ❌ **ADB non trouvé** - Android SDK Platform Tools manquant
3. ❌ **Aucun émulateur Android** - AVD non configuré

## Solutions étape par étape

### 1. Installer Java JDK (JDK 17 recommandé pour React Native 0.82)

#### Option A : Installation via Android Studio (Recommandé)
1. Téléchargez Android Studio : https://developer.android.com/studio
2. Installez Android Studio
3. Ouvrez Android Studio → **More Actions** → **SDK Manager**
4. Allez dans l'onglet **SDK Tools**
5. Cochez **Android SDK Command-line Tools (latest)**
6. Installez

#### Option B : Installation manuelle de JDK
1. Téléchargez JDK 17 depuis :
   - Oracle : https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
   - Ou OpenJDK : https://adoptium.net/temurin/releases/?version=17
2. Installez le JDK (par défaut : `C:\Program Files\Java\jdk-17`)

### 2. Configurer les variables d'environnement Windows

#### Étape 1 : Trouver les chemins d'installation

**Pour Java JDK :**
- Si installé via Android Studio : `C:\Users\<VotreNom>\AppData\Local\Android\Sdk\jbr`
- Si installé manuellement : `C:\Program Files\Java\jdk-17` (ou votre version)

**Pour Android SDK :**
- Par défaut : `C:\Users\<VotreNom>\AppData\Local\Android\Sdk`
- Vérifiez dans Android Studio : **File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**

#### Étape 2 : Configurer les variables d'environnement

##### Option A : Configuration automatique via script PowerShell (Recommandé)

1. Ouvrez PowerShell **en tant qu'administrateur**
2. Exécutez le script de configuration :
```powershell
.\set-java-home.ps1
```
Le script cherchera automatiquement Java JDK et configurera JAVA_HOME de manière permanente.

Si vous connaissez le chemin exact de votre JDK :
```powershell
.\set-java-home.ps1 "C:\Program Files\Java\jdk-17"
```

##### Option B : Configuration manuelle via l'interface Windows

1. Ouvrez **Paramètres Windows** → **Système** → **À propos** → **Paramètres système avancés**
2. Cliquez sur **Variables d'environnement**
3. Dans **Variables système**, ajoutez/modifiez :

**JAVA_HOME :**
```
Variable : JAVA_HOME
Valeur : C:\Users\<VotreNom>\AppData\Local\Android\Sdk\jbr
```
(ou le chemin de votre installation JDK)

**ANDROID_HOME :**
```
Variable : ANDROID_HOME
Valeur : C:\Users\<VotreNom>\AppData\Local\Android\Sdk
```

**PATH :** Ajoutez ces chemins (séparés par des points-virgules) :
```
%JAVA_HOME%\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\emulator
```

### 3. Vérifier l'installation

Ouvrez un **nouveau** PowerShell (important pour charger les nouvelles variables) et exécutez :

```powershell
# Vérifier Java
java -version

# Vérifier JAVA_HOME
echo $env:JAVA_HOME

# Vérifier ADB
adb version

# Vérifier Android SDK
echo $env:ANDROID_HOME
```

### 4. Créer un émulateur Android

#### Via Android Studio (Recommandé)
1. Ouvrez Android Studio
2. **More Actions** → **Virtual Device Manager**
3. Cliquez sur **Create Device**
4. Choisissez un appareil (ex: Pixel 5)
5. Téléchargez une image système (ex: API 33 ou 34)
6. Terminez la création

#### Via ligne de commande
```powershell
# Lister les images système disponibles
sdkmanager --list

# Installer une image système (ex: API 33)
sdkmanager "system-images;android-33;google_apis;x86_64"

# Créer un AVD
avdmanager create avd -n Pixel_5_API_33 -k "system-images;android-33;google_apis;x86_64"

# Lister les AVD créés
emulator -list-avds
```

### 5. Lancer l'émulateur

```powershell
# Lancer l'émulateur
emulator -avd Pixel_5_API_33
```

Ou via Android Studio : **Virtual Device Manager** → Cliquez sur ▶️

### 6. Vérifier avec React Native Doctor

```powershell
npx react-native doctor
```

Cela vérifiera automatiquement votre configuration.

### 7. Relancer votre application

Une fois tout configuré, dans un nouveau PowerShell :

```powershell
npm run android
```

## Configuration rapide PowerShell (temporaire pour la session)

Si vous voulez tester rapidement sans redémarrer :

```powershell
# Remplacez les chemins par vos chemins réels
$env:JAVA_HOME = "C:\Users\<VotreNom>\AppData\Local\Android\Sdk\jbr"
$env:ANDROID_HOME = "C:\Users\<VotreNom>\AppData\Local\Android\Sdk"
$env:PATH += ";$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator"
```

## Notes importantes

- ⚠️ **Redémarrez PowerShell** après avoir modifié les variables d'environnement système
- ⚠️ React Native 0.82 nécessite **JDK 17** (pas JDK 21)
- ⚠️ Assurez-vous que l'émulateur est lancé **avant** d'exécuter `npm run android`
- ⚠️ Si vous utilisez un appareil physique, activez le **mode développeur** et le **débogage USB**

## Dépannage

### Si JAVA_HOME n'est toujours pas reconnu :
```powershell
# Vérifier que le chemin existe
Test-Path $env:JAVA_HOME

# Vérifier que java.exe existe
Test-Path "$env:JAVA_HOME\bin\java.exe"
```

### Si ADB n'est toujours pas trouvé :
```powershell
# Vérifier que platform-tools existe
Test-Path "$env:ANDROID_HOME\platform-tools\adb.exe"
```

### Si l'émulateur ne démarre pas :
- Vérifiez que **Hyper-V** ou **Virtualization** est activé dans le BIOS
- Essayez un émulateur x86_64 au lieu de arm64



