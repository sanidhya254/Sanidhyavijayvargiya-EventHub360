CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(30) DEFAULT 'employee',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  skill_name VARCHAR(100) NOT NULL
);

CREATE TABLE employee_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  department_id INT REFERENCES departments(id),
  phone VARCHAR(20),
  city VARCHAR(100),
  address TEXT,
  designation VARCHAR(100),
  salary NUMERIC(12,2),
  work_mode VARCHAR(30),
  semester VARCHAR(30),
  domain VARCHAR(100),
  attendance_status VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_images (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  document_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_skills (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee_profiles(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE leave_types (
  id SERIAL PRIMARY KEY,
  leave_name VARCHAR(100) NOT NULL,
  total_days INT NOT NULL
);

CREATE TABLE leave_balance (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee_profiles(id),
  leave_type_id INT REFERENCES leave_types(id),
  available_days INT NOT NULL
);

CREATE TABLE leave_applications (
  id SERIAL PRIMARY KEY,
  employee_id INT REFERENCES employee_profiles(id),
  leave_type_id INT REFERENCES leave_types(id),
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  total_days INT NOT NULL,
  reason TEXT,
  manager_status VARCHAR(30) DEFAULT 'Pending',
  hr_status VARCHAR(30) DEFAULT 'Pending',
  final_status VARCHAR(30) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE approval_history (
  id SERIAL PRIMARY KEY,
  leave_id INT REFERENCES leave_applications(id) ON DELETE CASCADE,
  approved_by INT REFERENCES users(id),
  action VARCHAR(50),
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  asset_code VARCHAR(50) UNIQUE NOT NULL,
  asset_name VARCHAR(200) NOT NULL,
  asset_type VARCHAR(100),
  purchase_date DATE,
  purchase_cost NUMERIC(12,2),
  status VARCHAR(50)
);

CREATE TABLE asset_allocations (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  employee_id INT REFERENCES employee_profiles(id),
  allocated_by INT REFERENCES users(id),
  allocated_date DATE,
  return_date DATE,
  status VARCHAR(50)
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(200),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100),
  action_type VARCHAR(50),
  record_id INT,
  old_data JSONB,
  new_data JSONB,
  performed_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  semester VARCHAR(30),
  city VARCHAR(100),
  domain VARCHAR(100),
  mode VARCHAR(30)
);

CREATE VIEW employee_summary AS
SELECT
  ep.id,
  u.name,
  u.email,
  d.department_name,
  ep.designation,
  ep.salary,
  ep.city,
  ep.work_mode,
  ep.attendance_status
FROM employee_profiles ep
JOIN users u ON u.id = ep.user_id
JOIN departments d ON d.id = ep.department_id;
