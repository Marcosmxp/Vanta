param(
    [ValidateRange(30, 600)]
    [int]$TimeoutSeconds = 180,

    [ValidateRange(1, 10)]
    [int]$PollSeconds = 2
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$composeFile = 'infrastructure/docker/compose.dev.yml'
Set-Location $repoRoot

function Invoke-PsqlLines {
    param([Parameter(Mandatory = $true)][string]$Sql)

    $output = @(& docker compose -f $composeFile exec -T postgres psql -U vanta -d vanta -At -F '|' -c $Sql)
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not query the local Vanta PostgreSQL session metadata.'
    }
    return @($output | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function ConvertFrom-UnixMilliseconds {
    param([Parameter(Mandatory = $true)][string]$Value)

    $milliseconds = 0L
    if (-not [int64]::TryParse($Value, [ref]$milliseconds)) {
        throw "PostgreSQL returned an invalid Unix timestamp: $Value"
    }
    return [DateTimeOffset]::FromUnixTimeMilliseconds($milliseconds)
}

function Mask-SessionId {
    param([Parameter(Mandatory = $true)][string]$SessionId)
    if ($SessionId.Length -lt 13) {
        return '***'
    }
    return $SessionId.Substring(0, 8) + '...' + $SessionId.Substring($SessionId.Length - 4)
}

function Get-AndroidSessions {
    $sql = @"
SELECT session_id,
       refresh_generation,
       (EXTRACT(EPOCH FROM access_expires_at) * 1000)::bigint,
       (EXTRACT(EPOCH FROM refresh_expires_at) * 1000)::bigint,
       (EXTRACT(EPOCH FROM last_seen_at) * 1000)::bigint,
       device_label
FROM sessions
WHERE platform = 'android' AND revoked_at IS NULL
ORDER BY last_seen_at DESC
LIMIT 10;
"@

    $sessions = @()
    foreach ($line in Invoke-PsqlLines -Sql $sql) {
        $parts = $line -split '\|', 6
        if ($parts.Count -ne 6) {
            continue
        }
        $sessions += [pscustomobject]@{
            SessionId        = $parts[0]
            Generation       = [int64]$parts[1]
            AccessExpiresAt  = ConvertFrom-UnixMilliseconds $parts[2]
            RefreshExpiresAt = ConvertFrom-UnixMilliseconds $parts[3]
            LastSeenAt       = ConvertFrom-UnixMilliseconds $parts[4]
            DeviceLabel      = $parts[5]
        }
    }
    return $sessions
}

function Get-SessionState {
    param([Parameter(Mandatory = $true)][string]$SessionId)

    $escaped = $SessionId.Replace("'", "''")
    $sql = @"
SELECT refresh_generation,
       (EXTRACT(EPOCH FROM access_expires_at) * 1000)::bigint,
       (EXTRACT(EPOCH FROM refresh_expires_at) * 1000)::bigint,
       (EXTRACT(EPOCH FROM last_seen_at) * 1000)::bigint,
       revoked_at IS NOT NULL
FROM sessions
WHERE session_id = '$escaped';
"@

    $lines = @(Invoke-PsqlLines -Sql $sql)
    if ($lines.Count -eq 0) {
        return $null
    }

    $parts = $lines[0] -split '\|', 5
    if ($parts.Count -ne 5) {
        throw 'Unexpected session metadata shape returned by PostgreSQL.'
    }

    return [pscustomobject]@{
        Generation       = [int64]$parts[0]
        AccessExpiresAt  = ConvertFrom-UnixMilliseconds $parts[1]
        RefreshExpiresAt = ConvertFrom-UnixMilliseconds $parts[2]
        LastSeenAt       = ConvertFrom-UnixMilliseconds $parts[3]
        Revoked          = $parts[4] -eq 't'
    }
}

docker info *> $null
if ($LASTEXITCODE -ne 0) {
    throw 'Docker Desktop is not running or the Docker daemon is unavailable.'
}

$sessions = @(Get-AndroidSessions)
if ($sessions.Count -eq 0) {
    throw 'No active Android session was found. Start the physical-device runtime and sign in on the phone first.'
}

$selected = $null
if ($sessions.Count -eq 1) {
    $selected = $sessions[0]
}
else {
    Write-Host 'Active Android sessions:' -ForegroundColor Cyan
    for ($index = 0; $index -lt $sessions.Count; $index++) {
        $candidate = $sessions[$index]
        Write-Host ("[{0}] {1}  {2}  last seen {3:u}" -f ($index + 1), (Mask-SessionId $candidate.SessionId), $candidate.DeviceLabel, $candidate.LastSeenAt.UtcDateTime)
    }
    $choice = Read-Host 'Choose the physical Android session number'
    $parsedChoice = 0
    if (-not [int]::TryParse($choice, [ref]$parsedChoice) -or $parsedChoice -lt 1 -or $parsedChoice -gt $sessions.Count) {
        throw 'Invalid session selection.'
    }
    $selected = $sessions[$parsedChoice - 1]
}

$initial = Get-SessionState -SessionId $selected.SessionId
if ($null -eq $initial -or $initial.Revoked) {
    throw 'The selected Android session is no longer active.'
}

$maskedId = Mask-SessionId $selected.SessionId
Write-Host ''
Write-Host 'AUTH-REFRESH-001 physical runtime evidence' -ForegroundColor Cyan
Write-Host "Session:             $maskedId"
Write-Host "Refresh generation:  $($initial.Generation)"
Write-Host "Access expires UTC:  $($initial.AccessExpiresAt.UtcDateTime.ToString('u'))"
Write-Host "Refresh expires UTC: $($initial.RefreshExpiresAt.UtcDateTime.ToString('u'))"
Write-Host 'No token values or token hashes are queried by this script.'

$refreshWindow = $initial.AccessExpiresAt.AddSeconds(-30)
$secondsUntilWindow = [math]::Ceiling(($refreshWindow - [DateTimeOffset]::UtcNow).TotalSeconds)
if ($secondsUntilWindow -gt 90) {
    Write-Host ''
    Write-Warning "The access token is still about $secondsUntilWindow seconds from the mobile refresh window."
    Write-Host 'For a fast controlled test, restart the runtime with:'
    Write-Host '.\scripts\start-physical-device-dev.ps1 -LanIp <YOUR_LAN_IP> -AccessTokenTtl 1m'
    Write-Host 'Then sign in again on Android so the new short TTL applies to a newly issued session.'
    exit 2
}

if ($secondsUntilWindow -gt 0) {
    Write-Host "Waiting $secondsUntilWindow seconds for the 30-second refresh window to open..."
    Start-Sleep -Seconds $secondsUntilWindow
}

Write-Host ''
Write-Host 'Refresh window is open.' -ForegroundColor Green
Write-Host 'On the Android device, open or refresh a protected screen such as Wallet, Profile or Security.'
Write-Host "Watching refresh_generation for up to $TimeoutSeconds seconds..."

$deadline = [DateTimeOffset]::UtcNow.AddSeconds($TimeoutSeconds)
while ([DateTimeOffset]::UtcNow -lt $deadline) {
    Start-Sleep -Seconds $PollSeconds
    $current = Get-SessionState -SessionId $selected.SessionId
    if ($null -eq $current) {
        throw 'The selected session disappeared while waiting for refresh evidence.'
    }
    if ($current.Revoked) {
        throw 'The selected session was revoked instead of refreshed.'
    }
    if ($current.Generation -gt $initial.Generation) {
        if ($current.AccessExpiresAt -le $initial.AccessExpiresAt) {
            throw 'Refresh generation advanced but access expiry did not advance; evidence is inconsistent.'
        }

        Write-Host ''
        Write-Host 'PASS — silent refresh rotation observed.' -ForegroundColor Green
        Write-Host "Generation:           $($initial.Generation) -> $($current.Generation)"
        Write-Host "Access expiry before: $($initial.AccessExpiresAt.UtcDateTime.ToString('u'))"
        Write-Host "Access expiry after:  $($current.AccessExpiresAt.UtcDateTime.ToString('u'))"
        Write-Host "Last seen UTC:        $($current.LastSeenAt.UtcDateTime.ToString('u'))"
        exit 0
    }
}

throw 'Timed out without observing refresh rotation. Confirm the phone made a protected API request while connected to this local runtime.'
