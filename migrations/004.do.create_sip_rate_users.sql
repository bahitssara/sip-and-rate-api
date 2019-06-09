ALTER TABLE sip_rate_users 
    ADD COLUMN
        user_name TEXT NOT NULL UNIQUE
