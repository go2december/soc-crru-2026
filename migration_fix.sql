-- อัปเดต Enum Values (Postgres ไม่รองรับ ALTER TYPE ... ADD VALUE ใน Transaction ต่อนึงง่ายๆ แต่เราจะลองวิธีที่ปลอดภัย)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'EDITOR';

-- ปรับปรุงตาราง users
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id varchar(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name varchar(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar varchar(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at timestamp;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
