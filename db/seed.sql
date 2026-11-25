INSERT INTO user_main (
    user_name,
    user_phone,
    user_role,
    trade
)
VALUES
    -- Super Admin
    ('Shubham Kanojiya', '9000000000', 'superadmin', NULL),

    -- 3 Workers
    ('Rahul Sharma', '9000000001', 'worker', 'Electrician'),
    ('Amit Patil', '9000000002', 'worker', 'Plumber'),
    ('Priya Deshmukh', '9000000003', 'worker', 'Carpenter'),

    -- 1 Supervisor
    ('Sneha Joshi', '9000000004', 'supervisor', NULL);
