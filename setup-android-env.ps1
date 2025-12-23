# Script de configuration de l'environnement Android pour React Native
# Usage: .\setup-android-env.ps1

Write-Host "🔧 Configuration de l'environnement Android..." -ForegroundColor Cyan

# Chemins par défaut communs pour Android SDK sur Windows
$commonAndroidPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk",
    "C:\Android\Sdk",
    "$env:ANDROID_HOME"
)

# Chemins par défaut communs pour Java JDK
$commonJavaPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk\jbr",
    "$env:USERPROFILE\AppData\Local\Android\Sdk\jbr",
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Eclipse Adoptium\jdk-17*",
    "$env:JAVA_HOME"
)

# Fonction pour trouver un chemin valide
function Find-ValidPath {
    param([string[]]$Paths, [string]$RequiredFile)
    
    foreach ($path in $Paths) {
        if ($path -and (Test-Path $path)) {
            $fullPath = (Resolve-Path $path).Path
            if ($RequiredFile) {
                $filePath = Join-Path $fullPath $RequiredFile
                if (Test-Path $filePath) {
                    return $fullPath
                }
            } else {
                return $fullPath
            }
        }
    }
    return $null
}

# Trouver Android SDK
Write-Host "`n📱 Recherche d'Android SDK..." -ForegroundColor Yellow
$androidHome = Find-ValidPath -Paths $commonAndroidPaths -RequiredFile "platform-tools\adb.exe"

if ($androidHome) {
    Write-Host "✅ Android SDK trouvé : $androidHome" -ForegroundColor Green
    $env:ANDROID_HOME = $androidHome
} else {
    Write-Host "❌ Android SDK non trouvé aux emplacements communs." -ForegroundColor Red
    Write-Host "Veuillez installer Android Studio ou spécifier le chemin manuellement." -ForegroundColor Yellow
    $manualAndroid = Read-Host "Entrez le chemin vers Android SDK (ou appuyez sur Entrée pour ignorer)"
    if ($manualAndroid -and (Test-Path $manualAndroid)) {
        $env:ANDROID_HOME = (Resolve-Path $manualAndroid).Path
        Write-Host "✅ Android SDK configuré : $env:ANDROID_HOME" -ForegroundColor Green
    }
}

# Trouver Java JDK
Write-Host "`n☕ Recherche de Java JDK..." -ForegroundColor Yellow
$javaHome = Find-ValidPath -Paths $commonJavaPaths -RequiredFile "bin\java.exe"

if ($javaHome) {
    Write-Host "✅ Java JDK trouvé : $javaHome" -ForegroundColor Green
    $env:JAVA_HOME = $javaHome
} else {
    Write-Host "❌ Java JDK non trouvé aux emplacements communs." -ForegroundColor Red
    Write-Host "Veuillez installer JDK 17 ou spécifier le chemin manuellement." -ForegroundColor Yellow
    $manualJava = Read-Host "Entrez le chemin vers Java JDK (ou appuyez sur Entrée pour ignorer)"
    if ($manualJava -and (Test-Path $manualJava)) {
        $env:JAVA_HOME = (Resolve-Path $manualJava).Path
        Write-Host "✅ Java JDK configuré : $env:JAVA_HOME" -ForegroundColor Green
    }
}

# Configurer le PATH pour cette session
if ($env:ANDROID_HOME) {
    $pathsToAdd = @(
        "$env:ANDROID_HOME\platform-tools",
        "$env:ANDROID_HOME\tools",
        "$env:ANDROID_HOME\tools\bin",
        "$env:ANDROID_HOME\emulator"
    )
    
    foreach ($path in $pathsToAdd) {
        if (Test-Path $path) {
            $env:PATH = "$path;$env:PATH"
        }
    }
}

if ($env:JAVA_HOME) {
    $javaBin = "$env:JAVA_HOME\bin"
    if (Test-Path $javaBin) {
        $env:PATH = "$javaBin;$env:PATH"
    }
}

# Vérifications
Write-Host "`n🔍 Vérification de la configuration..." -ForegroundColor Cyan

if ($env:JAVA_HOME) {
    $javaVersion = & "$env:JAVA_HOME\bin\java.exe" -version 2>&1 | Select-Object -First 1
    Write-Host "✅ Java : $javaVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Java non configuré" -ForegroundColor Red
}

if ($env:ANDROID_HOME) {
    $adbPath = "$env:ANDROID_HOME\platform-tools\adb.exe"
    if (Test-Path $adbPath) {
        $adbVersion = & $adbPath version | Select-Object -First 1
        Write-Host "✅ ADB : $adbVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠️  ADB non trouvé dans $env:ANDROID_HOME\platform-tools" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Android SDK non configuré" -ForegroundColor Red
}

# Vérifier les émulateurs
Write-Host "`n📱 Vérification des émulateurs..." -ForegroundColor Cyan
if ($env:ANDROID_HOME) {
    $emulatorPath = "$env:ANDROID_HOME\emulator\emulator.exe"
    if (Test-Path $emulatorPath) {
        $avds = & $emulatorPath -list-avds 2>&1
        if ($avds -and $avds.Count -gt 0) {
            Write-Host "✅ Émulateurs trouvés :" -ForegroundColor Green
            $avds | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }
        } else {
            Write-Host "⚠️  Aucun émulateur trouvé. Créez-en un via Android Studio." -ForegroundColor Yellow
        }
    }
}

Write-Host "`n📝 Résumé de la configuration (pour cette session PowerShell) :" -ForegroundColor Cyan
Write-Host "   JAVA_HOME = $env:JAVA_HOME" -ForegroundColor Gray
Write-Host "   ANDROID_HOME = $env:ANDROID_HOME" -ForegroundColor Gray

Write-Host "`n⚠️  Note : Ces variables sont définies uniquement pour cette session PowerShell." -ForegroundColor Yellow
Write-Host "Pour les rendre permanentes, configurez-les dans les Variables d'environnement Windows." -ForegroundColor Yellow
Write-Host "Consultez SETUP_ANDROID.md pour les instructions complètes." -ForegroundColor Yellow

Write-Host "`n✅ Configuration terminée ! Vous pouvez maintenant essayer : npm run android" -ForegroundColor Green












