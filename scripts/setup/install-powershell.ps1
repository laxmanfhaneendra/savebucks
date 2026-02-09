# Install PowerShell 7+ (attempt via winget, otherwise open releases page)
# Run as Administrator: Run PowerShell as Admin, then execute this script.

$psId = 'Microsoft.PowerShell'

if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Output "winget found — installing PowerShell via winget..."
    winget install --id $psId -e --source winget --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -eq 0) {
        Write-Output "winget install finished. You can run 'pwsh' to start PowerShell 7+."
    } else {
        Write-Output "winget reported a non-zero exit code ($LASTEXITCODE). Check winget output above." 
    }
} else {
    Write-Output "winget not found. Opening PowerShell GitHub releases page for manual download..."
    Start-Process "https://github.com/PowerShell/PowerShell/releases"
}
