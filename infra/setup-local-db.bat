@echo off
set /p PGPASSWORD="Enter your local 'postgres' user password: "

echo.
echo 1. Creating user hms_admin...
psql -U postgres -h localhost -c "CREATE USER hms_admin WITH SUPERUSER PASSWORD 'ChangeMe123!';"

echo.
echo 2. Creating database hms_prod...
psql -U postgres -h localhost -c "CREATE DATABASE hms_prod OWNER hms_admin;"

echo.
echo ---------------------------------------------------
echo Setup Complete!
echo You can now run: .\infra\sync-db.ps1
echo ---------------------------------------------------
pause
