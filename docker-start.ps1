# ============================================
# SCRIPT DE INICIO RÁPIDO - AguiAI Docker
# Versión Windows (PowerShell)
# ============================================

Write-Host "🚀 Iniciando AguiAI con Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Docker no está instalado" -ForegroundColor Red
    Write-Host "   Descarga Docker desde: https://www.docker.com/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker está instalado" -ForegroundColor Green
Write-Host ""

# Detener contenedores existentes
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Blue
docker compose down 2>$null

# Construir e iniciar servicios
Write-Host ""
Write-Host "🏗️  Construyendo imágenes..." -ForegroundColor Blue
docker compose build

Write-Host ""
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Blue
docker compose up -d

Write-Host ""
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Write-Host ""

# Esperar a que Ollama esté listo
Write-Host "   Esperando Ollama..."
$timeout = 120
$elapsed = 0
while ($elapsed -lt $timeout) {
    try {
        $response = docker exec aguiai-ollama curl -sf http://localhost:11434/api/tags 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Ollama está listo" -ForegroundColor Green
            break
        }
    } catch {}
    Start-Sleep -Seconds 2
    $elapsed += 2
}

if ($elapsed -ge $timeout) {
    Write-Host "   ⚠️  Ollama tardó más de lo esperado" -ForegroundColor Yellow
}

# Esperar a que el backend esté listo
Write-Host "   Esperando Backend API..."
$timeout = 60
$elapsed = 0
while ($elapsed -lt $timeout) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Backend API está listo" -ForegroundColor Green
            break
        }
    } catch {}
    Start-Sleep -Seconds 2
    $elapsed += 2
}

if ($elapsed -ge $timeout) {
    Write-Host "   ⚠️  Backend API tardó más de lo esperado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
Write-Host "🎉 AguiAI está listo para usar!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs de acceso:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   🌐 Frontend:    http://localhost:5173"
Write-Host "   🔌 Backend API: http://localhost:3000"
Write-Host "   🤖 Ollama:      http://localhost:11434"
Write-Host ""
Write-Host "📊 Ver logs:" -ForegroundColor Cyan
Write-Host "   docker compose logs -f"
Write-Host ""
Write-Host "🛑 Detener servicios:" -ForegroundColor Cyan
Write-Host "   docker compose down"
Write-Host ""
Write-Host "📋 Ver estado de contenedores:" -ForegroundColor Cyan
Write-Host "   docker compose ps"
Write-Host ""
