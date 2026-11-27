-- create main user table
CREATE TABLE user_main (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_phone VARCHAR(15) DEFAULT NULL UNIQUE,
    user_role VARCHAR(20) NOT NULL CHECK (user_role IN ('superadmin', 'admin', 'supervisor', 'worker')),
    trade VARCHAR(50)  NULL,
    user_password VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
