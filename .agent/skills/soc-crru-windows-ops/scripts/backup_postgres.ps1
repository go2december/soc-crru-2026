<#
.SYNOPSIS
    Automated PostgreSQL Backup for SOC-CRRU on Windows Server.
.DESCRIPTION
    Dumps PostgreSQL database, compresses it into a .zip archive, and purges backups older than retention days.
#>

[CmdletBinding()]
param (
    [string]$BackupDir = "E:\web2026\soc-crru-web\database\backups",
    [string]$ContainerName = "postgres",
    [string]$DbUser = "postgres",
    [string]$DbName = "soc_crru_db",
    [int]$RetentionDays = 7
)

$ErrorActionPreference = "Stop"

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$SqlFile = Join-Path $BackupDir "$($DbName)_$Timestamp.sql"
$ZipFile = Join-Path $BackupDir "$($DbName)_$Timestamp.zip"

Write-Host "=== [1/4] Starting Backup: $DbName at $(Get-Date) ===" -ForegroundColor Cyan

# 1. Ensure directory exists
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

# 2. Dump Database (Handles both Docker and direct pg_dump)
try {
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        Write-Host "Running pg_dump via Docker container ($ContainerName)..." -ForegroundColor Yellow
        docker exec -t $ContainerName pg_dump -U $DbUser $DbName > $SqlFile
    } else {
        Write-Host "Running local pg_dump..." -ForegroundColor Yellow
        pg_dump -U $DbUser -d $DbName -f $SqlFile
    }

    if (-not (Test-Path $SqlFile) -or (Get-Item $SqlFile).Length -eq 0) {
        throw "Backup SQL file was not generated or is empty."
    }

    Write-Host "Database dumped successfully ($((Get-Item $SqlFile).Length / 1MB | ForEach-Object { '{0:N2} MB' -f $_ }))." -ForegroundColor Green
} catch {
    Write-Error "Backup Failed: $_"
    exit 1
}

# 3. Compress to ZIP
Write-Host "=== [2/4] Compressing to $ZipFile ===" -ForegroundColor Cyan
Compress-Archive -Path $SqlFile -DestinationPath $ZipFile -CompressionLevel Optimal
Remove-Item -Path $SqlFile -Force
Write-Host "Compressed successfully ($((Get-Item $ZipFile).Length / 1MB | ForEach-Object { '{0:N2} MB' -f $_ }))." -ForegroundColor Green

# 4. Purge old backups
Write-Host "=== [3/4] Purging backups older than $RetentionDays days ===" -ForegroundColor Cyan
$CutoffDate = (Get-Date).AddDays(-$RetentionDays)
$OldBackups = Get-ChildItem -Path $BackupDir -Filter "$($DbName)_*.zip" | Where-Object { $_.CreationTime -lt $CutoffDate }

foreach ($Old in $OldBackups) {
    Write-Host "Deleting old backup: $($Old.Name)" -ForegroundColor DarkGray
    Remove-Item $Old.FullName -Force
}

Write-Host "=== [4/4] Backup routine completed successfully at $(Get-Date) ===" -ForegroundColor Green
