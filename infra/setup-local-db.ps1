# Infra/setup-local-db.ps1
# Usage: ./infra/setup-local-db.ps1

Write-Host "🔄 SETTING UP LOCAL DATABASE" -ForegroundColor Cyan

# 1. Get Password
$Password = Read-Host "Enter your local 'postgres' user password"
if (-not $Password) {
    Write-Error "Password cannot be empty!"
    exit 1
}

$env:PGPASSWORD = $Password

# 2. Create User hms_admin
Write-Host "`n1. Creating user hms_admin..." -ForegroundColor Yellow
try {
    # Check if user exists first to avoid error, or just try create and ignore specific error
    # We'll just run CREATE USER. If it exists, it errors but that's fine, we can catch or ignore.
    # Actually, let's use DO block for cleaner "idempotency"
    
    $CreateUserSQL = "
    DO
    `$do`$
    BEGIN
       IF NOT EXISTS (
          SELECT FROM pg_catalog.pg_roles
          WHERE  rolname = 'hms_admin') THEN
          CREATE ROLE hms_admin LOGIN SUPERUSER PASSWORD 'ChangeMe123!';
       ELSE
          ALTER ROLE hms_admin WITH PASSWORD 'ChangeMe123!';
       END IF;
    END
    `$do`$;"
    
    psql -U postgres -h localhost -c $CreateUserSQL
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ User hms_admin created/updated." -ForegroundColor Green
    }
    else {
        Write-Host "❌ Failed to create user. Check password." -ForegroundColor Red
        exit 1
    }

    # 3. Create Database hms_prod
    Write-Host "`n2. Creating database hms_prod..." -ForegroundColor Yellow
    
    # Verify if DB exists
    $CheckDB = psql -U postgres -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='hms_prod'"
    if ($CheckDB -eq "1") {
        Write-Host "✅ Database hms_prod already exists." -ForegroundColor Green
    }
    else {
        psql -U postgres -h localhost -c "CREATE DATABASE hms_prod OWNER hms_admin;"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database hms_prod created." -ForegroundColor Green
        }
        else {
            Write-Host "❌ Failed to create database." -ForegroundColor Red
        }
    }
    
    Write-Host "`n---------------------------------------------------"
    Write-Host "🎉 Setup Complete!" -ForegroundColor Cyan
    Write-Host "You can now run: .\infra\sync-db.ps1"
    Write-Host "---------------------------------------------------"

}
catch {
    Write-Error "An error occurred: $_"
}
finally {
    $env:PGPASSWORD = $null
}
