# Script pour trouver l'installation Java JDK sur Windows
# Usage: .\find-java.ps1

Write-Host "Recherche de Java JDK sur votre systeme..." -ForegroundColor Cyan
Write-Host ""

$foundJava = @()

# Chemins communs a verifier
$searchPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk",
    "C:\Program Files\Java",
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Microsoft",
    "C:\Program Files (x86)\Java",
    "C:\Program Files\Amazon Corretto",
    "C:\Program Files\OpenJDK",
    "$env:ProgramFiles\Java",
    "$env:ProgramFiles\Eclipse Adoptium",
    "$env:ProgramFiles\Microsoft"
)

Write-Host "Recherche dans les chemins standards..." -ForegroundColor Yellow
foreach ($basePath in $searchPaths) {
    if (Test-Path $basePath) {
        Write-Host "  Verification de : $basePath" -ForegroundColor Gray
        # Chercher recursivement java.exe
        $javaFiles = Get-ChildItem -Path $basePath -Filter "java.exe" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Directory.Name -eq "bin" }
        
        foreach ($javaFile in $javaFiles) {
            $javaDir = $javaFile.Directory.Parent.FullName
            if ($javaDir -notin $foundJava) {
                $foundJava += $javaDir
                Write-Host "    TROUVE : $javaDir" -ForegroundColor Green
            }
        }
    }
}

# Chercher dans le registre Windows
Write-Host "`nRecherche dans le registre Windows..." -ForegroundColor Yellow
try {
    $regPaths = @(
        "HKLM:\SOFTWARE\JavaSoft\Java Development Kit",
        "HKLM:\SOFTWARE\JavaSoft\JDK",
        "HKLM:\SOFTWARE\Eclipse Adoptium\JDK",
        "HKLM:\SOFTWARE\Microsoft\JDK"
    )
    
    foreach ($regPath in $regPaths) {
        if (Test-Path $regPath) {
            Write-Host "  Verification de : $regPath" -ForegroundColor Gray
            $versions = Get-ChildItem -Path $regPath -ErrorAction SilentlyContinue
            foreach ($version in $versions) {
                $javaHome = (Get-ItemProperty -Path $version.PSPath -Name "JavaHome" -ErrorAction SilentlyContinue).JavaHome
                if ($javaHome -and (Test-Path "$javaHome\bin\java.exe")) {
                    if ($javaHome -notin $foundJava) {
                        $foundJava += $javaHome
                        Write-Host "    TROUVE : $javaHome" -ForegroundColor Green
                    }
                }
            }
        }
    }
} catch {
    Write-Host "  Erreur lors de la recherche dans le registre : $_" -ForegroundColor Yellow
}

# Chercher via la commande java si disponible
Write-Host "`nVerification de la commande java dans le PATH..." -ForegroundColor Yellow
try {
    $javaCmd = Get-Command java -ErrorAction SilentlyContinue
    if ($javaCmd) {
        $javaPath = $javaCmd.Source
        $javaDir = Split-Path (Split-Path $javaPath -Parent) -Parent
        if ($javaDir -and (Test-Path "$javaDir\bin\java.exe")) {
            if ($javaDir -notin $foundJava) {
                $foundJava += $javaDir
                Write-Host "  TROUVE via PATH : $javaDir" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "  Java non trouve dans le PATH" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Java non disponible dans le PATH" -ForegroundColor Gray
}

# Afficher les resultats
Write-Host "`n" + "="*60 -ForegroundColor Cyan
if ($foundJava.Count -eq 0) {
    Write-Host "AUCUNE installation Java JDK trouvee." -ForegroundColor Red
    Write-Host "`nVous devez installer Java JDK 17 pour React Native." -ForegroundColor Yellow
    Write-Host "Options d'installation :" -ForegroundColor Yellow
    Write-Host "  1. Via Android Studio (recommandé)" -ForegroundColor Cyan
    Write-Host "     - Installez Android Studio" -ForegroundColor Gray
    Write-Host "     - Java sera installe dans : $env:LOCALAPPDATA\Android\Sdk\jbr" -ForegroundColor Gray
    Write-Host "`n  2. Téléchargement manuel :" -ForegroundColor Cyan
    Write-Host "     - Eclipse Adoptium : https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Gray
    Write-Host "     - Oracle JDK : https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html" -ForegroundColor Gray
} else {
    Write-Host "Installations Java JDK trouvees :" -ForegroundColor Green
    Write-Host ""
    for ($i = 0; $i -lt $foundJava.Count; $i++) {
        $javaPath = $foundJava[$i]
        Write-Host "[$($i+1)] $javaPath" -ForegroundColor Cyan
        
        # Verifier la version
        try {
            $versionOutput = & "$javaPath\bin\java.exe" -version 2>&1
            $versionLine = $versionOutput | Select-Object -First 1
            Write-Host "     Version : $versionLine" -ForegroundColor Gray
        } catch {
            Write-Host "     (Impossible de verifier la version)" -ForegroundColor Gray
        }
        Write-Host ""
    }
    
    Write-Host "Pour configurer JAVA_HOME, utilisez :" -ForegroundColor Yellow
    Write-Host "  .\set-java-home.ps1 `"$($foundJava[0])`"" -ForegroundColor Cyan
    if ($foundJava.Count -gt 1) {
        Write-Host "`nOu pour choisir une autre installation :" -ForegroundColor Yellow
        for ($i = 1; $i -lt $foundJava.Count; $i++) {
            Write-Host "  .\set-java-home.ps1 `"$($foundJava[$i])`"" -ForegroundColor Cyan
        }
    }
}

Write-Host "`n" + "="*60 -ForegroundColor Cyan










