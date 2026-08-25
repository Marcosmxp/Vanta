param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^(?:\d{1,3}\.){3}\d{1,3}$')]
    [string]$LanIp
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
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

if (-not (Test-Command docker)) {
    throw 'Docker CLI was not found. Install/start Docker Desktop first.'
}
if (-not (Test-Command pnpm)) {
    throw 'pnpm was not found. Install pnpm 10.15.0 first.'
}

try {
    docker info | Out-Null
}
catch {
    throw 'Docker Desktop is not running or the Docker daemon is unavailable.'
}

Ensure-FirewallRule -DisplayName 'Vanta API Dev 8080' -Port 8080
Ensure-FirewallRule -DisplayName 'Vanta Metro Dev 8081' -Port 8081

$env:VANTA_DEV_API_BIND_ADDRESS = $LanIp
$env:EXPO_PUBLIC_VANTA_ENV = 'development'
$env:EXPO_PUBLIC_VANTA_API_URL = "http://${LanIp}:8080"

Write-Host "Starting Vanta backend on http://${LanIp}:8080 ..."
docker compose -f infrastructure/docker/compose.dev.yml up -d --build

$healthUrl = "http://${LanIp}:8080/health"
$ready = $false
for ($attempt = 1; $attempt -le 30; $attempt++) {
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
    Write-Host ''
    docker compose -f infrastructure/docker/compose.dev.yml ps
    throw "Vanta API did not become reachable at $healthUrl. Check Docker logs with: docker compose -f infrastructure/docker/compose.dev.yml logs api"
}

Write-Host "Vanta API is reachable: $healthUrl"

if (-not (Test-Path (Join-Path $repoRoot 'node_modules'))) {
    Write-Host 'Installing workspace dependencies...'
    pnpm install --no-frozen-lockfile
}

$metroCommand = @"
Set-Location '$repoRoot'
`$env:EXPO_PUBLIC_VANTA_ENV='development'
`$env:EXPO_PUBLIC_VANTA_API_URL='http://${LanIp}:8080'
pnpm --dir apps/mobile start -- --host lan
"@

Start-Process powershell.exe -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $metroCommand

Write-Host ''
Write-Host 'Vanta physical-device development runtime is ready.'
Write-Host "API:   http://${LanIp}:8080"
Write-Host "Health: $healthUrl"
Write-Host 'Metro:  a new PowerShell window was opened on the LAN.'
Write-Host ''
Write-Host 'Keep both PowerShell windows open, keep the PC and phone on the same Wi-Fi, then open the installed Vanta app.'
