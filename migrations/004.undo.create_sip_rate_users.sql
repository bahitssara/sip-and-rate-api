ALTER TABLE sip_rate_users 
    DROP COLUMN IF EXISTS user_name;

DROP TABLE IF EXISTS sip_rate_users;