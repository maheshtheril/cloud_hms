
# Hardcoded credentials for reliability
$SourceRender = "postgresql://threeg:ihIIz42wgUOR78ePsiXD83jZgZGoYIzs@dpg-d3j94d95pdvs739pk6a0-a.singapore-postgres.render.com/threegdb"
$TargetNeon = "postgresql://neondb_owner:npg_t3GQCEaDsY5M@ep-tiny-lab-a1hzd77s.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

Write-Host "1. Backing up data from Render..." -ForegroundColor Cyan
# --no-owner --no-acl ensures we don't get permission errors
# --clean --if-exists ensures we overwrite any existing default tables cleanly
$env:PGPASSWORD = "ihIIz42wgUOR78ePsiXD83jZgZGoYIzs" 
# pg_dump sometimes struggles with URL passwords in older versions, so setting env var for source just in case
# But passing URL typically works.

pg_dump $SourceRender --no-owner --no-acl --clean --if-exists -f "render_backup.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Backup failed! Check Render connection."
    exit 1
}
Write-Host "   Backup saved to render_backup.sql" -ForegroundColor Green

Write-Host "2. Restoring data to Neon..." -ForegroundColor Cyan
# Psql restore
psql $TargetNeon -f "render_backup.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Restore failed!"
    exit 1
}

Write-Host "3. Migration Complete! 🚀" -ForegroundColor Green
