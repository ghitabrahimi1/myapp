# Script PowerShell pour tester l'API

$API_URL = "http://localhost:8001"

Write-Host "🧪 Test de l'API de login" -ForegroundColor Cyan
Write-Host ""

# 1. Créer un utilisateur
Write-Host "1️⃣ Création d'un utilisateur..." -ForegroundColor Yellow
$registerBody = @{
    email = "test@atline.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Utilisateur créé: $($registerResponse.email)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "ℹ️  Utilisateur existe déjà" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# 2. Login
Write-Host "2️⃣ Test du login..." -ForegroundColor Yellow
$loginBody = @{
    username = "test@atline.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/token" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "✅ Login réussi!" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""
    
    # 3. Tester le profil
    Write-Host "3️⃣ Test du profil utilisateur..." -ForegroundColor Yellow
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "$API_URL/auth/me" -Method Get -Headers $headers
    Write-Host "✅ Profil récupéré:" -ForegroundColor Green
    Write-Host "   Email: $($profileResponse.email)" -ForegroundColor Gray
    Write-Host "   ID: $($profileResponse.id)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Tests terminés!" -ForegroundColor Cyan

