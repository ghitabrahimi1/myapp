# Script pour configurer JAVA_HOME de maniere permanente sur Windows
# Usage: .\set-java-home.ps1 [chemin_vers_jdk]
# Exemple: .\set-java-home.ps1 "C:\Program Files\Java\jdk-17"

param(
    [string]$JavaPath = ""
)

Write-Host "Configuration de JAVA_HOME..." -ForegroundColor Cyan

# Verifier les privileges administrateur
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ATTENTION: Ce script necessite des privileges administrateur pour modifier les variables d'environnement systeme." -ForegroundColor Yellow
    Write-Host "Relancez PowerShell en tant qu'administrateur et reexecutez ce script." -ForegroundColor Yellow
    exit 1
}

# Si aucun chemin n'est fourni, chercher Java automatiquement
if ([string]::IsNullOrEmpty($JavaPath)) {
    Write-Host "`nRecherche automatique de Java JDK..." -ForegroundColor Yellow
    
    $commonJavaPaths = @(
        "$env:LOCALAPPDATA\Android\Sdk\jbr",
        "$env:USERPROFILE\AppData\Local\Android\Sdk\jbr",
        "C:\Program Files\Java\jdk-17",
        "C:\Program Files\Java\jdk-21",
        "C:\Program Files\Eclipse Adoptium\jdk-17*",
        "C:\Program Files\Eclipse Adoptium\jdk-21*",
        "C:\Program Files\Microsoft\jdk-17*",
        "C:\Program Files\Microsoft\jdk-21*"
    )
    
    $foundJava = $null
    foreach ($path in $commonJavaPaths) {
        # Gerer les chemins avec wildcards
        if ($path -match '\*') {
            $parentDir = Split-Path $path -Parent
            if (Test-Path $parentDir) {
                $matchingDirs = Get-ChildItem -Path $parentDir -Directory -Filter (Split-Path $path -Leaf) -ErrorAction SilentlyContinue
                if ($matchingDirs) {
                    $path = $matchingDirs[0].FullName
                }
            }
        }
        
        if ($path -and (Test-Path $path)) {
            $javaExe = Join-Path $path "bin\java.exe"
            if (Test-Path $javaExe) {
                $foundJava = (Resolve-Path $path).Path
                Write-Host "OK - Java JDK trouve : $foundJava" -ForegroundColor Green
                break
            }
        }
    }
    
    if (-not $foundJava) {
        Write-Host "ERREUR: Java JDK non trouve aux emplacements communs." -ForegroundColor Red
        Write-Host "`nEmplacements verifies :" -ForegroundColor Yellow
        foreach ($path in $commonJavaPaths) {
            Write-Host "   - $path" -ForegroundColor Gray
        }
        Write-Host "`nVeuillez specifier le chemin manuellement :" -ForegroundColor Yellow
        Write-Host "   .\set-java-home.ps1 `"C:\Program Files\Java\jdk-17`"" -ForegroundColor Cyan
        exit 1
    }
    
    $JavaPath = $foundJava
} else {
    # Verifier que le chemin fourni est valide
    if (-not (Test-Path $JavaPath)) {
        Write-Host "ERREUR: Le chemin specifie n'existe pas : $JavaPath" -ForegroundColor Red
        exit 1
    }
    
    $javaExe = Join-Path $JavaPath "bin\java.exe"
    if (-not (Test-Path $javaExe)) {
        Write-Host "ERREUR: Le chemin specifie ne contient pas un JDK valide (java.exe non trouve dans bin\)" -ForegroundColor Red
        Write-Host "   Chemin verifie : $javaExe" -ForegroundColor Yellow
        exit 1
    }
    
    $JavaPath = (Resolve-Path $JavaPath).Path
}

# Verifier la version de Java
Write-Host "`nVerification de la version Java..." -ForegroundColor Yellow
try {
    $javaVersion = & "$JavaPath\bin\java.exe" -version 2>&1 | Select-Object -First 1
    Write-Host "   Version trouvee : $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "ATTENTION: Impossible de verifier la version de Java" -ForegroundColor Yellow
}

# Configurer JAVA_HOME dans les variables d'environnement systeme
Write-Host "`nConfiguration de JAVA_HOME dans les variables d'environnement systeme..." -ForegroundColor Yellow

try {
    # Definir JAVA_HOME pour l'utilisateur actuel
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaPath, [System.EnvironmentVariableTarget]::User)
    Write-Host "OK - JAVA_HOME configure pour l'utilisateur : $JavaPath" -ForegroundColor Green
    
    # Definir JAVA_HOME pour le systeme (necessite admin)
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaPath, [System.EnvironmentVariableTarget]::Machine)
    Write-Host "OK - JAVA_HOME configure pour le systeme : $JavaPath" -ForegroundColor Green
    
    # Ajouter JAVA_HOME\bin au PATH si ce n'est pas deja fait
    $javaBin = "$JavaPath\bin"
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
    
    if ($currentPath -notlike "*$javaBin*") {
        $newPath = "$currentPath;$javaBin"
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::User)
        Write-Host "OK - $javaBin ajoute au PATH utilisateur" -ForegroundColor Green
    } else {
        Write-Host "INFO - $javaBin est deja dans le PATH utilisateur" -ForegroundColor Cyan
    }
    
    # Faire de meme pour le PATH systeme
    $systemPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
    if ($systemPath -notlike "*$javaBin*") {
        $newSystemPath = "$systemPath;$javaBin"
        [System.Environment]::SetEnvironmentVariable("Path", $newSystemPath, [System.EnvironmentVariableTarget]::Machine)
        Write-Host "OK - $javaBin ajoute au PATH systeme" -ForegroundColor Green
    } else {
        Write-Host "INFO - $javaBin est deja dans le PATH systeme" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "ERREUR lors de la configuration : $_" -ForegroundColor Red
    exit 1
}

# Afficher la configuration actuelle
Write-Host "`nConfiguration actuelle :" -ForegroundColor Cyan
$envJAVA_HOME = [System.Environment]::GetEnvironmentVariable("JAVA_HOME", [System.EnvironmentVariableTarget]::User)
Write-Host "   JAVA_HOME (utilisateur) : $envJAVA_HOME" -ForegroundColor Gray
$envJAVA_HOME_Sys = [System.Environment]::GetEnvironmentVariable("JAVA_HOME", [System.EnvironmentVariableTarget]::Machine)
Write-Host "   JAVA_HOME (systeme) : $envJAVA_HOME_Sys" -ForegroundColor Gray

Write-Host "`nConfiguration terminee avec succes !" -ForegroundColor Green
Write-Host "`nIMPORTANT :" -ForegroundColor Yellow
Write-Host "   - Fermez et rouvrez PowerShell pour que les changements prennent effet" -ForegroundColor Yellow
Write-Host "   - Ou executez : refreshenv (si Chocolatey est installe)" -ForegroundColor Yellow
Write-Host "   - Ou redemarrez votre ordinateur" -ForegroundColor Yellow
Write-Host "`nPour verifier dans un nouveau PowerShell :" -ForegroundColor Cyan
Write-Host "   echo `$env:JAVA_HOME" -ForegroundColor Gray
Write-Host "   java -version" -ForegroundColor Gray
