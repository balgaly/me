param(
    [string]$ArtifactRepoPath = "C:\DEV\.wt\me-site-public",
    [switch]$SkipPush
)

$ErrorActionPreference = "Stop"

$SourceRoot = Split-Path -Parent $PSScriptRoot
$TargetRoot = (Resolve-Path $ArtifactRepoPath).Path
$ExpectedRemote = "https://github.com/balgaly/me-site-public.git"

function Run-Git {
    param(
        [string]$Repo,
        [string[]]$GitArgs
    )

    & git -C $Repo @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArgs -join ' ') failed in $Repo"
    }
}

$RemoteUrl = (git -C $TargetRoot remote get-url origin).Trim()
if ($RemoteUrl -ne $ExpectedRemote) {
    throw "artifact repo mismatch: expected $ExpectedRemote, got $RemoteUrl"
}

$DirtyOutput = git -C $TargetRoot status --porcelain
$Dirty = if ($DirtyOutput) { ($DirtyOutput | Out-String).Trim() } else { "" }
if ($Dirty) {
    throw "artifact repo is dirty: $TargetRoot"
}

Remove-Item -Recurse -Force (Join-Path $TargetRoot "data") -ErrorAction SilentlyContinue
Copy-Item (Join-Path $SourceRoot "index.html") $TargetRoot -Force
Copy-Item (Join-Path $SourceRoot "CNAME") $TargetRoot -Force
Copy-Item -Recurse (Join-Path $SourceRoot "data") $TargetRoot

Run-Git -Repo $TargetRoot -GitArgs @("add", "index.html", "CNAME", "data")
$PendingOutput = git -C $TargetRoot status --porcelain
$Pending = if ($PendingOutput) { ($PendingOutput | Out-String).Trim() } else { "" }
if (-not $Pending) {
    Write-Output "No public artifact changes."
    exit 0
}

Run-Git -Repo $TargetRoot -GitArgs @("commit", "-m", "chore: sync me.balgaly.com artifact")
if (-not $SkipPush) {
    Run-Git -Repo $TargetRoot -GitArgs @("push", "origin", "main")
}

Run-Git -Repo $TargetRoot -GitArgs @("rev-parse", "--short", "HEAD")
