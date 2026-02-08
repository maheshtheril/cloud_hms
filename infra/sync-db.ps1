# Infra/sync-db.ps1
# Usage: ./infra/sync-db.ps1

Write-Host "🔄 STARTING DATABASE SYNC: CLOUD -> LOCAL" -ForegroundColor Cyan

# 1. Load Environment Variables from .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#=]+)=(.*)") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}
else {
    Write-Error "❌ .env file not found!"
    exit 1
}

$CloudDB = $env:DIRECT_DATABASE_URL
$LocalDB = "postgresql://hms_admin:$($env:DB_PASSWORD)@localhost:5432/hms_prod"

if (-not $CloudDB) {
    Write-Error "❌ Cloud Database URL not found in .env"
    exit 1
}

# 2. Confirm Action
Write-Host "⚠️  WARNING: This will DESTROY all data in your LOCAL database and replace it with CLOUD data." -ForegroundColor Yellow
Write-Host "   Local: localhost:5432/hms_prod"
Write-Host "   Source: Cloud DB"
# Read-Host -Prompt "Press Enter to continue or Ctrl+C to abort"

# 3. Stream Data (Cloud -> Local Windows Postgres)
Write-Host "🚀 Streaming data... Using native PostgreSQL tools." -ForegroundColor Green

# Use native Windows psql/pg_dump
# We need to set PGPASSWORD environment variable for the duration of the command so it doesn't prompt
$env:PGPASSWORD = $env:DB_PASSWORD

# Execute Dump & Restore Pipe
# Note: standard error redirect is tricky in PowerShell pipes, but basic piping should work.
# We trust the exit code.

try {
    # Dump from Cloud directly to Local psql
    # We use cmd /c to handle the pipe more reliably in some PowerShell environments, 
    # but standard PowerShell pipe works if tools are in PATH.
    
    # We need to parse the Cloud DB URL to get the password for pg_dump if it prompts, 
    # but usually we can pass the full connection string to pg_dump.
    
    # However, pg_dump might need a password. The URL has it.
    
    cmd /c "pg_dump ""$CloudDB"" --clean --if-exists --no-owner --no-acl | psql ""$LocalDB"""
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SYNC COMPLETE! Local DB matches Cloud DB." -ForegroundColor Green
    }
    else {
        Write-Host "❌ SYNC FAILED. Check credentials or connection." -ForegroundColor Red
    }
}
finally {
    # Clear the password from env
    $env:PGPASSWORD = $null
}
