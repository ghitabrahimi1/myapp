# Script pour télécharger et installer Java 17 portable
Write-Host "Téléchargement de Java 17..." -ForegroundColor Cyan

$javaDir = "$env:USERPROFILE\java\jdk-17"
$zipFile = "$env:TEMP\openjdk-17_windows-x64_bin.zip"
$javaUrl = "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse"

# Créer le répertoire si nécessaire
if (-not (Test-Path $javaDir)) {
    New-Item -ItemType Directory -Path $javaDir -Force | Out-Null
}

# Télécharger Java 17
Write-Host "Téléchargement depuis Adoptium..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $javaUrl -OutFile $zipFile -UseBasicParsing
    Write-Host "Téléchargement terminé" -ForegroundColor Green
} catch {
    Write-Host "Erreur lors du téléchargement: $_" -ForegroundColor Red
    Write-Host "Téléchargement manuel requis depuis: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Yellow
    exit 1
}

# Extraire l'archive
Write-Host "Extraction de l'archive..." -ForegroundColor Yellow
try {
    Expand-Archive -Path $zipFile -DestinationPath "$env:TEMP\java17" -Force
    $extractedDir = Get-ChildItem "$env:TEMP\java17" -Directory | Select-Object -First 1
    Move-Item -Path $extractedDir.FullName -Destination $javaDir -Force
    Write-Host "Extraction terminée" -ForegroundColor Green
} catch {
    Write-Host "Erreur lors de l'extraction: $_" -ForegroundColor Red
    exit 1
}

# Nettoyer
Remove-Item $zipFile -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\java17" -Recurse -ErrorAction SilentlyContinue

# Configurer JAVA_HOME pour cette session
$env:JAVA_HOME = $javaDir
$env:PATH = "$javaDir\bin;$env:PATH"

Write-Host "`nJava 17 installé dans: $javaDir" -ForegroundColor Green
Write-Host "JAVA_HOME configuré pour cette session" -ForegroundColor Green
Write-Host "`nPour configurer de manière permanente, exécutez:" -ForegroundColor Yellow
Write-Host "  [System.Environment]::SetEnvironmentVariable('JAVA_HOME', '$javaDir', 'User')" -ForegroundColor Cyan
Write-Host "  `$env:PATH = [System.Environment]::GetEnvironmentVariable('Path', 'User') + ';$javaDir\bin'" -ForegroundColor Cyan
Write-Host "  [System.Environment]::SetEnvironmentVariable('Path', `$env:PATH, 'User')" -ForegroundColor Cyan

# Vérifier l'installation
Write-Host "`nVérification de l'installation..." -ForegroundColor Yellow
& "$javaDir\bin\java.exe" -version









