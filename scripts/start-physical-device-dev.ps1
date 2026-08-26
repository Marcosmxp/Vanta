param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^(?:\d{1,3}\.){3}\d{1,3}$')]
    [string]$LanIp,

    [ValidatePattern('^\d+(?:ms|s|m|h)$')]
    [string]$AccessTokenTtl = '15m',

    [ValidatePattern('^\d+(?:ms|s|m|h)$')]
    [string]$RefreshTokenTtl = '720h'
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$composeFile = 'infrastructure/docker/compose.dev.yml'
Set-Location $repoRoot

function Test-Command {
    param([Parameter(Mandatory = $true)][string]$Name)
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Test-IsAdministrator {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Ensure-FirewallRule {
    param(
        [Parameter(Mandatory = $true)][string]$DisplayName,
        [Parameter(Mandatory = $true)][int]$Port
    )

    if (-not (Test-IsAdministrator)) {
        Write-Warning "PowerShell is not elevated. Firewall rule '$DisplayName' was not changed. Run this script as Administrator if the phone cannot reach the PC."
        return
    }

    $existing = Get-NetFirewallRule -DisplayName $DisplayName -ErrorAction SilentlyContinue
    if ($null -eq $existing) {
        New-NetFirewallRule `
            -DisplayName $DisplayName `
            -Direction Inbound `
            -Action Allow `
            -Protocol TCP `
            -LocalPort $Port `
            -Profile Private `
            -RemoteAddress LocalSubnet | Out-Null
        Write-Host "Created firewall rule: $DisplayName"
    }
    else {
        Write-Host "Firewall rule already exists: $DisplayName"
    }
}

function Show-DockerDiagnostics {
    Write-Host ''
    Write-Host 'Docker service status:' -ForegroundColor Yellow
    docker compose -f $composeFile ps

    Write-Host ''
    Write-Host 'PostgreSQL logs:' -ForegroundColor Yellow
    docker compose -f $composeFile logs --no-color --tail 120 postgres

    Write-Host ''
    Write-Host 'Redis logs:' -ForegroundColor Yellow
    docker compose -f $composeFile logs --no-color --tail 80 redis

    Write-Host ''
    Write-Host 'API logs:' -ForegroundColor Yellow
    docker compose -f $composeFile logs --no-color --tail 120 api
}

if (-not (Test-Command docker)) {
    throw 'Docker CLI was not found. Install/start Docker Desktop first.'
}
if (-not (Test-Command pnpm.cmd)) {
    throw 'pnpm.cmd was not found. Install pnpm 10.15.0 first.'
}

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    throw 'Docker Desktop is not running or the Docker daemon is unavailable. Start Docker Desktop, wait until its engine reports ready, then run this command again.'
}

Ensure-FirewallRule -DisplayName 'Vanta API Dev 8080' -Port 8080
Ensure-FirewallRule -DisplayName 'Vanta Metro Dev 8081' -Port 8081

$env:VANTA_DEV_API_BIND_ADDRESS = $LanIp
$env:VANTA_AUTH_ACCESS_TTL = $AccessTokenTtl
$env:VANTA_AUTH_REFRESH_TTL = $RefreshTokenTtl
$env:EXPO_PUBLIC_VANTA_ENV = 'development'
$env:EXPO_PUBLIC_VANTA_API_URL = "http://${LanIp}:8080"

Write-Host "Starting Vanta backend on http://${LanIp}:8080 ..."
Write-Host "Auth TTLs: access=${AccessTokenTtl}, refresh=${RefreshTokenTtl}"
docker compose -f $composeFile up -d --build
if ($LASTEXITCODE -ne 0) {
    Show-DockerDiagnostics
    throw 'Docker Compose could not start the Vanta development runtime. The diagnostics above identify the failing service.'
}

$healthUrl = "http://${LanIp}:8080/health"
$ready = $false
for ($attempt = 1; $attempt -le 45; $attempt++) {
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            $ready = $true
            break
        }
    }
    catch {
        Start-Sleep -Seconds 1
    }
}

if (-not $ready) {
    Show-DockerDiagnostics
    throw "Vanta API did not become reachable at $healthUrl."
}

Write-Host "Vanta API is reachable: $healthUrl"

if (-not (Test-Path (Join-Path $repoRoot 'node_modules'))) {
    Write-Host 'Installing workspace dependencies from the committed lockfile...'
    pnpm.cmd install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) {
        throw 'Workspace dependency installation failed.'
    }
}

$metroCommand = @"
Set-Location '$repoRoot'
`$env:EXPO_PUBLIC_VANTA_ENV='development'
`$env:EXPO_PUBLIC_VANTA_API_URL='http://${LanIp}:8080'
`$env:REACT_NATIVE_PACKAGER_HOSTNAME='${LanIp}'
`$env:EXPO_PACKAGER_PROXY_URL='http://${LanIp}:8081'
Write-Host 'Starting Metro for physical device at ${LanIp}:8081 ...'
pnpm.cmd --dir apps/mobile exec expo start --dev-client --lan --port 8081
"@

Start-Process powershell.exe -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $metroCommand

Write-Host ''
Write-Host 'Vanta physical-device development runtime is ready.'
Write-Host "API:   http://${LanIp}:8080"
Write-Host "Health: $healthUrl"
Write-Host "Metro: http://${LanIp}:8081"
Write-Host "Access TTL:  $AccessTokenTtl"
Write-Host "Refresh TTL: $RefreshTokenTtl"
Write-Host ''
Write-Host 'Keep both PowerShell windows open, keep the PC and phone on the same Wi-Fi, then open the installed Vanta app.'
Write-Host 'For this debug APK, set the device Dev Settings debug server host to the Metro address above if the app still points to localhost.'
