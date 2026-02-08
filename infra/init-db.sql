-- Initial Setup for Hospital Edge Database
-- This runs only on first container start

-- Enable logical replication
ALTER SYSTEM SET wal_level = 'logical';

-- Create a replication user if needed, or grant it to the admin
-- ALTER USER hms_admin WITH REPLICATION;

-- Create Publication for cloud sync
-- This identifies which tables should be synced to the cloud
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'hms_cloud_publication') THEN
        CREATE PUBLICATION hms_cloud_publication FOR ALL TABLES;
    END IF;
END
$$;
