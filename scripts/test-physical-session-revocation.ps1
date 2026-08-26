param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^(?:\d{1,3}\.){3}\d{1,3}$')]
    [string]$LanIp
)

$ErrorActionPreference = 'Stop'
$apiBase = "http://${LanIp}:8080"
$helperAccessToken = $null
$helperSessionId = $null

function Mask-SessionId {
    param([Parameter(Mandatory = $true)][string]$SessionId)
    if ($SessionId.Length -lt 13) {
        return '***'
    }
    return $SessionId.Substring(0, 8) + '...' + $SessionId.Substring($SessionId.Length - 4)
}

function New-AuthHeaders {
    param([Parameter(Mandatory = $true)][string]$AccessToken)
    return @{ Authorization = "Bearer $AccessToken" }
}

try {
    $health = Invoke-WebRequest -Uri "$apiBase/health" -UseBasicParsing -TimeoutSec 3
    if ($health.StatusCode -lt 200 -or $health.StatusCode -ge 300) {
        throw "Unexpected health status $($health.StatusCode)."
    }
}
catch {
    throw "Vanta API is not reachable at $apiBase. Start the physical-device development runtime first."
}

$email = Read-Host 'Account email for the temporary revocation helper session'
$securePassword = Read-Host 'Account password (input is hidden and is not stored)' -AsSecureString
$credential = New-Object System.Management.Automation.PSCredential('vanta-helper', $securePassword)
$passwordPlain = $credential.GetNetworkCredential().Password

try {
    $loginPayload = @{
        email       = $email
        password    = $passwordPlain
        deviceLabel = 'Vanta PowerShell revocation probe'
        platform    = 'windows'
    } | ConvertTo-Json -Compress

    $helper = Invoke-RestMethod `
        -Uri "$apiBase/v1/auth/login" `
        -Method Post `
        -ContentType 'application/json' `
        -Body $loginPayload `
        -TimeoutSec 10

    $helperAccessToken = [string]$helper.accessToken
    $helperSessionId = [string]$helper.sessionId
    if ([string]::IsNullOrWhiteSpace($helperAccessToken) -or [string]::IsNullOrWhiteSpace($helperSessionId)) {
        throw 'The helper login did not return a valid session.'
    }

    # Remove plaintext credential material from script variables immediately after login.
    $passwordPlain = $null
    $loginPayload = $null
    $credential = $null
    $securePassword = $null

    $headers = New-AuthHeaders -AccessToken $helperAccessToken
    $snapshot = Invoke-RestMethod -Uri "$apiBase/v1/security" -Method Get -Headers $headers -TimeoutSec 10
    $targets = @($snapshot.sessions | Where-Object {
        $_.sessionId -ne $helperSessionId -and
        $_.status -eq 'active' -and
        $_.platform -eq 'android'
    })

    if ($targets.Count -eq 0) {
        throw 'No other active Android session was found. Keep the physical-device app signed in before running this test.'
    }

    Write-Host ''
    Write-Host 'AUTH-REVOCATION-002 physical runtime evidence' -ForegroundColor Cyan
    Write-Host 'Temporary helper session authenticated. Tokens are kept only in memory and are never printed.'
    Write-Host ''
    Write-Host 'Active Android sessions eligible for remote revocation:' -ForegroundColor Cyan

    for ($index = 0; $index -lt $targets.Count; $index++) {
        $target = $targets[$index]
        $lastSeen = [DateTimeOffset]::Parse([string]$target.lastSeenAt)
        Write-Host ("[{0}] {1}  {2}  last seen {3:u}" -f ($index + 1), (Mask-SessionId ([string]$target.sessionId)), $target.deviceLabel, $lastSeen.UtcDateTime)
    }

    $selected = $null
    if ($targets.Count -eq 1) {
        $selected = $targets[0]
    }
    else {
        $choice = Read-Host 'Choose the physical Android session number to revoke'
        $parsedChoice = 0
        if (-not [int]::TryParse($choice, [ref]$parsedChoice) -or $parsedChoice -lt 1 -or $parsedChoice -gt $targets.Count) {
            throw 'Invalid session selection.'
        }
        $selected = $targets[$parsedChoice - 1]
    }

    $targetSessionId = [string]$selected.sessionId
    $maskedTarget = Mask-SessionId $targetSessionId
    Write-Host "Revoking Android session $maskedTarget through DELETE /v1/security/sessions/{sessionID} ..."

    $encodedSessionId = [Uri]::EscapeDataString($targetSessionId)
    $revokeResponse = Invoke-WebRequest `
        -Uri "$apiBase/v1/security/sessions/$encodedSessionId" `
        -Method Delete `
        -Headers $headers `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($revokeResponse.StatusCode -ne 204) {
        throw "Expected HTTP 204 from remote revocation, received $($revokeResponse.StatusCode)."
    }

    $after = Invoke-RestMethod -Uri "$apiBase/v1/security" -Method Get -Headers $headers -TimeoutSec 10
    $revoked = @($after.sessions | Where-Object { $_.sessionId -eq $targetSessionId }) | Select-Object -First 1
    if ($null -eq $revoked -or $revoked.status -ne 'revoked') {
        throw 'The API returned 204 but the security snapshot did not confirm the session as revoked.'
    }

    Write-Host ''
    Write-Host 'PASS — server-side remote revocation confirmed by the authenticated security API.' -ForegroundColor Green
    Write-Host "Session: $maskedTarget"
    Write-Host 'Server status: revoked'
    Write-Host ''
    Write-Host 'Now use the Android app and open a protected screen such as Wallet, Profile or Security.' -ForegroundColor Yellow
    Write-Host 'Expected mobile behavior: protected request gets 401, refresh also fails, local SecureStore session is cleared, and the app returns to authentication.'
    Write-Host 'Do not count this test complete until that physical-device behavior is observed.'
}
finally {
    $passwordPlain = $null
    $credential = $null
    $securePassword = $null

    if (-not [string]::IsNullOrWhiteSpace($helperAccessToken)) {
        try {
            $logoutHeaders = New-AuthHeaders -AccessToken $helperAccessToken
            Invoke-WebRequest `
                -Uri "$apiBase/v1/auth/logout" `
                -Method Post `
                -Headers $logoutHeaders `
                -UseBasicParsing `
                -TimeoutSec 5 | Out-Null
        }
        catch {
            Write-Warning 'The temporary helper session could not be explicitly logged out. It will remain subject to normal server expiry/revocation controls.'
        }
    }

    $helperAccessToken = $null
    $helperSessionId = $null
}
