<#
.SYNOPSIS
    Guru Netra Backend — Build ZIP for Hostinger Upload

.DESCRIPTION
    Creates a deployment-ready ZIP from backend-ci4 folder.
    Usage:
      1. Open PowerShell in project root
      2. Run: .\build-backend.ps1
    Output: backend-ci4\hostinger-deploy.zip
#>

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot
$backendDir  = Join-Path $projectRoot "backend-ci4"
$outputZip   = Join-Path $backendDir "hostinger-deploy.zip"

# Items to EXCLUDE from the ZIP
$excludeFolders = @(".git", ".vscode", ".idea", "nbproject", "node_modules", "tests")
$excludeFiles   = @(".env", "hostinger-deploy.zip", "build-backend.ps1", "phpunit.xml", "phpunit.dist.xml")
$excludeExt     = @(".log")

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Guru Netra -- Backend ZIP Builder" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Remove old ZIP if exists
if (Test-Path $outputZip) {
    Remove-Item $outputZip -Force
    Write-Host "[i] Old ZIP removed." -ForegroundColor Yellow
}

Write-Host "[+] Collecting files from: $backendDir" -ForegroundColor White

$allFiles = Get-ChildItem -Path $backendDir -Recurse -File

$filesToInclude = $allFiles | Where-Object {
    $file = $_
    $relativePath = $file.FullName.Substring($backendDir.Length + 1)
    $pathParts    = $relativePath -split '\\'

    # Exclude by folder name anywhere in path
    $inExcludedFolder = $false
    foreach ($folder in $excludeFolders) {
        if ($pathParts -contains $folder) {
            $inExcludedFolder = $true
            break
        }
    }

    # Exclude by filename
    $isExcludedFile = $excludeFiles -contains $file.Name

    # Exclude by extension
    $isExcludedExt = $excludeExt -contains $file.Extension

    -not ($inExcludedFolder -or $isExcludedFile -or $isExcludedExt)
}

Write-Host "[+] Files to include: $($filesToInclude.Count)" -ForegroundColor White
Write-Host ""
Write-Host "[~] Creating ZIP..." -ForegroundColor White

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($outputZip, 'Create')

foreach ($file in $filesToInclude) {
    $relativePath = $file.FullName.Substring($backendDir.Length + 1)
    $zipEntryName = $relativePath -replace '\\', '/'
    try {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip, $file.FullName, $zipEntryName,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    } catch {
        Write-Host "  [!] Skipped (locked): $relativePath" -ForegroundColor Yellow
    }
}

$zip.Dispose()

$zipSizeMB = [math]::Round((Get-Item $outputZip).Length / 1MB, 2)

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  [OK] ZIP Created Successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  File : backend-ci4\hostinger-deploy.zip" -ForegroundColor White
Write-Host "  Size : $zipSizeMB MB" -ForegroundColor White
Write-Host ""
Write-Host "  NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Upload hostinger-deploy.zip to Hostinger File Manager" -ForegroundColor White
Write-Host "     Path: /public_html/gurunetra/" -ForegroundColor Gray
Write-Host "  2. Extract the ZIP in that folder" -ForegroundColor White
Write-Host "  3. Create .env file (see .env.hostinger.example)" -ForegroundColor White
Write-Host "  4. Import database-setup.sql via phpMyAdmin" -ForegroundColor White
Write-Host "  5. Set writable/ folder permissions to 755" -ForegroundColor White
Write-Host ""
