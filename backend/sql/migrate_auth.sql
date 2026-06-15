-- Migration: add Email + PasswordHash for SAMS UI email/password login
-- Run AFTER existing schema.sql on databases created without auth columns

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('Students') AND name = 'Email'
)
BEGIN
    ALTER TABLE Students ADD Email VARCHAR(100) NULL;
    ALTER TABLE Students ADD PasswordHash VARCHAR(255) NULL;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('Faculty') AND name = 'Email'
)
BEGIN
    ALTER TABLE Faculty ADD Email VARCHAR(100) NULL;
    ALTER TABLE Faculty ADD PasswordHash VARCHAR(255) NULL;
END;

-- After running seed.sql, Email and PasswordHash will be populated.
-- For existing rows before re-seed, run seed.sql (it clears demo tables).
