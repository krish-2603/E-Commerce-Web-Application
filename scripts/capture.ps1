# ====================================================================
# Automated Screenshot Generator (Headless Edge)
# Captures product-listing.png and product-details.png
# ====================================================================

$ErrorActionPreference = "Stop"

$projectRoot = "C:\Users\krish\.gemini\antigravity\scratch\ecommerce-fullstack"
$screenshotsDir = Join-Path $projectRoot "screenshots" 
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Clean temporary test file if present
$testPng = Join-Path $screenshotsDir "test.png"
if (Test-Path $testPng) { Remove-Item $testPng -Force }

Write-Host "[1/4] Starting backend server on port 5000..."
$serverProcess = Start-Process -FilePath "C:\Users\krish\AppData\Local\nvm\v22.14.0\node.exe" `
    -ArgumentList (Join-Path $projectRoot "backend\server.js") `
    -WorkingDirectory $projectRoot `
    -PassThru

Start-Sleep -Seconds 3

try {
    # Test server response
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "[Server Health]:" ($health | ConvertTo-Json -Compress)

    # 1. Product Listing Page Screenshot
    Write-Host "[2/4] Capturing Product Listing Screenshot..."
    $listingPng = Join-Path $screenshotsDir "product-listing.png"
    Start-Process -FilePath $edgePath `
        -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,900", "--screenshot=$listingPng", "http://localhost:5000" `
        -Wait

    Start-Sleep -Seconds 2

    # 2. Product Details Modal / Page Screenshot
    Write-Host "[3/4] Capturing Product Details Screenshot..."
    $detailsPng = Join-Path $screenshotsDir "product-details.png"
    Start-Process -FilePath $edgePath `
        -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,900", "--screenshot=$detailsPng", "http://localhost:5000/#/product/1" `
        -Wait

    Write-Host "[4/4] Screenshots Captured Successfully!"
    Get-ChildItem $screenshotsDir | Select-Object Name, Length, LastWriteTime
}
finally {
    Write-Host "Stopping backend server process..."
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
}
