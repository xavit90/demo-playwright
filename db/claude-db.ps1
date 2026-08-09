# ============================================================
#  Lanzador de Claude Code con las variables de db/.env cargadas
# ------------------------------------------------------------
#  Claude Code NO lee .env por sí solo: este script carga las
#  variables al entorno del proceso y luego arranca `claude`,
#  para que .mcp.json pueda resolver los ${MSSQL_CONNSTR_*}.
#
#  Uso (desde la raíz del repo):
#      .\db\claude-db.ps1
# ============================================================

$ErrorActionPreference = 'Stop'

# Raíz del repo = carpeta padre de este script
$repoRoot = Split-Path -Parent $PSScriptRoot
$envFile  = Join-Path $PSScriptRoot '.env'

if (-not (Test-Path $envFile)) {
    Write-Error "No existe db\.env. Copia db\.env.example a db\.env y complétalo."
    exit 1
}

# Cargar KEY=VALUE (ignora comentarios y líneas vacías)
$loaded = 0
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { return }
    $idx = $line.IndexOf('=')
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $val = $line.Substring($idx + 1).Trim()
    # quita comillas envolventes si las hubiera
    if ($val.Length -ge 2 -and $val.StartsWith('"') -and $val.EndsWith('"')) {
        $val = $val.Substring(1, $val.Length - 2)
    }
    Set-Item -Path "Env:$key" -Value $val
    $loaded++
}

Write-Host "Cargadas $loaded variables desde db\.env. Iniciando Claude Code..." -ForegroundColor Green

Set-Location $repoRoot
claude @args
