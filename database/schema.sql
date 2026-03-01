-- Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('user'), ('manager'), ('admin');

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productivity Entries
CREATE TABLE productivity_entries (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    date DATE NOT NULL,
    identifier_type VARCHAR(20) NOT NULL,
    identifier_value TEXT NOT NULL,
    reference_number TEXT,
    rica BOOLEAN DEFAULT FALSE,
    cdr BOOLEAN DEFAULT FALSE,
    data_records BOOLEAN DEFAULT FALSE,
    tower_dump BOOLEAN DEFAULT FALSE,
    recharge_history BOOLEAN DEFAULT FALSE,
    imei_mapping BOOLEAN DEFAULT FALSE,
    msisdn_profile BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,    
    record_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);