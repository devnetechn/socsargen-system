-- ===========================================
-- SOCSARGEN HOSPITAL SYSTEM - FULL DATABASE SETUP FOR RENDER
-- Run this entire script on your Render PostgreSQL database
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- USERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin', 'hr')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    session_token TEXT,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_failed_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- DOCTORS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    license_number VARCHAR(50) NOT NULL,
    bio TEXT,
    photo_url VARCHAR(500),
    consultation_fee DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- DOCTOR SCHEDULES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_patients INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(doctor_id, day_of_week)
);

-- ===========================================
-- APPOINTMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- NEWS/ANNOUNCEMENTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SERVICES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'General',
    icon VARCHAR(50),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- CONSENT LOGS TABLE (DPO Compliance)
-- ===========================================
CREATE TABLE IF NOT EXISTS consent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    consented BOOLEAN NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- CHAT MESSAGES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    sender VARCHAR(20) CHECK (sender IN ('user', 'bot', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- JOBS/HIRING TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) DEFAULT 'Full-time' CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Temporary')),
    location VARCHAR(255) DEFAULT 'General Santos City',
    description TEXT NOT NULL,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- JOB APPLICATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interviewed', 'accepted', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, user_id)
);

-- ===========================================
-- PATIENT AWARDS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS patient_awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    description TEXT,
    photo_url VARCHAR(500),
    votes INTEGER DEFAULT 0,
    color_theme VARCHAR(50) DEFAULT 'amber',
    display_order INTEGER DEFAULT 0,
    award_month DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- REFRESH TOKENS TABLE (Security)
-- ===========================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SECURITY AUDIT LOG TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS security_audit_log (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON security_audit_log(created_at);

-- ===========================================
-- SEED DATA: Admin Account
-- Password: admin123
-- ===========================================
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@socsargen-hospital.com', '$2a$10$oM774grA8t87pYuFyc.SROTLVax1iyFvLjMqRuZA2vUDS5Fvx/18q', 'Super', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- SEED DATA: HR Account
-- Password: hr123
-- ===========================================
INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES
('hr@socsargen-hospital.com', '$2a$10$Ws0Wc7f8yDcbup92dAHnBeJhtbqtZhj79WM71HvE6sGp.7Op8wraO', 'Test', 'HR', '09171111111', 'hr')
ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- SEED DATA: Test Patient
-- Password: patient123
-- ===========================================
INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES
('patient@socsargen-hospital.com', '$2a$10$jEMvIxklWvJds6LNo7agSO9KXCISU3Vo6HbnZIwQmhgcqnpLXHSxC', 'Test', 'Patient', '09174444444', 'patient')
ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- SEED DATA: Doctor Accounts
-- Password: doctor123
-- ===========================================
INSERT INTO users (id, email, password, first_name, last_name, phone, role) VALUES
('d1111111-1111-1111-1111-111111111111', 'doctor.santos@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Maria', 'Santos', '09171000001', 'doctor'),
('d2222222-2222-2222-2222-222222222222', 'doctor.reyes@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Juan', 'Reyes', '09171000002', 'doctor'),
('d3333333-3333-3333-3333-333333333333', 'doctor.cruz@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Ana', 'Cruz', '09171000003', 'doctor'),
('d4444444-4444-4444-4444-444444444444', 'doctor.garcia@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Carlos', 'Garcia', '09171000004', 'doctor'),
('d5555555-5555-5555-5555-555555555555', 'doctor.mendoza@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Elena', 'Mendoza', '09171000005', 'doctor'),
('d6666666-6666-6666-6666-666666666666', 'doctor.villanueva@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Roberto', 'Villanueva', '09171000006', 'doctor'),
('d7777777-7777-7777-7777-777777777777', 'doctor.torres@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Patricia', 'Torres', '09171000007', 'doctor'),
('d8888888-8888-8888-8888-888888888888', 'doctor.bautista@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Miguel', 'Bautista', '09171000008', 'doctor'),
('d9999999-9999-9999-9999-999999999999', 'doctor.fernandez@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Isabel', 'Fernandez', '09171000009', 'doctor'),
('da111111-1111-1111-1111-111111111111', 'doctor.ramos@socsargen-hospital.com', '$2a$10$Yb8LBpD7Go8Ca2DWuRaPh.g0B6U5l2jjPiM2WmEWGqpMM8.6o0RwW', 'Antonio', 'Ramos', '09171000010', 'doctor')
ON CONFLICT (email) DO NOTHING;

-- Doctor profiles
INSERT INTO doctors (user_id, specialization, department, license_number, bio, consultation_fee, is_available) VALUES
('d1111111-1111-1111-1111-111111111111', 'Internal Medicine', 'Department of Internal Medicine', 'PRC-00001', 'Board-certified internist specializing in adult diseases and preventive care.', 500.00, true),
('d2222222-2222-2222-2222-222222222222', 'Pediatrics', 'Department of Pediatrics', 'PRC-00002', 'Child healthcare specialist with expertise in childhood diseases and immunization.', 600.00, true),
('d3333333-3333-3333-3333-333333333333', 'OB-Gynecology', 'Department of OB-GYN', 'PRC-00003', 'OB-GYN specialist focused on womens health, prenatal care, and reproductive medicine.', 700.00, true),
('d4444444-4444-4444-4444-444444444444', 'Cardiology', 'Department of Cardiology', 'PRC-00004', 'Board-certified cardiologist specializing in heart disease diagnosis and treatment.', 800.00, true),
('d5555555-5555-5555-5555-555555555555', 'Orthopedics', 'Department of Orthopedics', 'PRC-00005', 'Specialist in bone and joint disorders, sports injuries, and orthopedic surgery.', 750.00, true),
('d6666666-6666-6666-6666-666666666666', 'General Surgery', 'Department of Surgery', 'PRC-00006', 'Experienced general surgeon performing various surgical procedures.', 800.00, true),
('d7777777-7777-7777-7777-777777777777', 'Neurology', 'Department of Neurology', 'PRC-00007', 'Expert in diagnosing and treating disorders of the nervous system.', 850.00, true),
('d8888888-8888-8888-8888-888888888888', 'Dermatology', 'Department of Dermatology', 'PRC-00008', 'Specialist in skin conditions, cosmetic dermatology, and skin cancer screening.', 650.00, true),
('d9999999-9999-9999-9999-999999999999', 'Ophthalmology', 'Department of Ophthalmology', 'PRC-00009', 'Eye care specialist for vision correction, cataract surgery, and eye disease treatment.', 700.00, true),
('da111111-1111-1111-1111-111111111111', 'Dental Medicine', 'Department of Dental Medicine', 'PRC-00010', 'Comprehensive dental care including preventive, restorative, and cosmetic dentistry.', 450.00, true)
ON CONFLICT DO NOTHING;

-- Doctor schedules (Monday to Friday)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, max_patients)
SELECT d.id, day_num, '08:00:00', '17:00:00', 20
FROM doctors d
CROSS JOIN generate_series(1, 5) as day_num
ON CONFLICT DO NOTHING;

-- ===========================================
-- SEED DATA: Hospital Services (31 Services)
-- ===========================================
INSERT INTO services (name, description, category, icon, is_featured, display_order) VALUES
('Catheterization Laboratory', 'Advanced cardiac catheterization procedures for diagnosis and treatment of heart conditions.', 'Cardiac', 'heart', false, 1),
('Open-Heart Surgeries', 'Complex cardiac surgical procedures performed by experienced cardiac surgeons with state-of-the-art equipment.', 'Cardiac', 'heart', false, 2),
('Bypass Surgery', 'Coronary artery bypass grafting (CABG) for patients with coronary artery disease.', 'Cardiac', 'heart', false, 3),
('Endovascular Aneurysm Repair', 'Minimally invasive aneurysm treatment using advanced endovascular techniques.', 'Cardiac', 'heart', false, 4),
('MRI', 'Magnetic Resonance Imaging for detailed internal body imaging without radiation.', 'Diagnostic', 'radiology', false, 5),
('Cancer Care Center', 'Comprehensive cancer treatment and care with multidisciplinary approach.', 'Specialty', 'medical', false, 6),
('Chemotherapy', 'Cancer treatment using chemical agents administered by specialized oncology staff.', 'Specialty', 'medical', false, 7),
('OR/DR', 'Operating Room and Delivery Room facilities with modern surgical and birthing equipment.', 'Surgical', 'surgery', false, 8),
('NICU', 'Neonatal Intensive Care Unit providing specialized care for critically ill newborns.', 'Specialty', 'baby', false, 9),
('ICU', 'Intensive Care Unit providing optimum healthcare service for patients needing special 24-hour care.', 'Emergency', 'emergency', true, 10),
('Outpatient Emergency Care', 'Emergency services for outpatients requiring immediate medical attention.', 'Emergency', 'emergency', false, 11),
('Urgent Care Center', 'Immediate care for non-life-threatening conditions without the need for an appointment.', 'Emergency', 'emergency', false, 12),
('Outpatient Services', 'Medical services without overnight stay, including consultations and minor procedures.', 'Outpatient', 'outpatient', false, 13),
('Express Care Center', 'Quick consultations and treatments for minor health concerns.', 'Outpatient', 'outpatient', false, 14),
('Satellite Clinic (Alabel)', 'Branch clinic in Alabel providing accessible healthcare services to the community.', 'Outpatient', 'clinic', false, 15),
('Medical Arts Tower', 'Specialist consultations with various medical specialists in one convenient location.', 'Outpatient', 'building', false, 16),
('Laboratory', 'Comprehensive and advanced laboratory services with highly competent medical technologists.', 'Diagnostic', 'lab', true, 17),
('Radiology / Imaging', 'Diagnostic X-ray, General Ultrasonography, CT, and Mammography with advanced equipment.', 'Diagnostic', 'radiology', true, 18),
('Cardio-Pulmonary', 'Heart and lung diagnostics including ECG, stress tests, and pulmonary function tests.', 'Diagnostic', 'heart', false, 19),
('Sleep Studies', 'Sleep disorder diagnosis through comprehensive sleep monitoring and analysis.', 'Diagnostic', 'sleep', false, 20),
('Physical Therapy', 'Physical rehabilitation services to help patients recover mobility and function.', 'Rehabilitation', 'therapy', false, 21),
('Occupational Therapy', 'Daily activities therapy to help patients regain independence in everyday tasks.', 'Rehabilitation', 'therapy', false, 22),
('Speech Therapy', 'Speech and language treatment for patients with communication disorders.', 'Rehabilitation', 'speech', false, 23),
('Educational Therapy', 'Learning support therapy for patients with educational and developmental needs.', 'Rehabilitation', 'education', false, 24),
('Dental Services', 'State-of-the-art facility for all dental needs including preventive, restorative, and cosmetic dentistry.', 'Specialty', 'dental', true, 25),
('Hemodialysis', 'Comfortable hemodialysis service with top of the line machines and well trained staff.', 'Specialty', 'kidney', true, 26),
('Nutrition & Dietetics', 'Nutritional counseling and dietary planning for patients with various health conditions.', 'Specialty', 'nutrition', false, 27),
('Heart Station', 'Cardiovascular diagnostic service with excellent facilities and highly skilled personnel.', 'Cardiac', 'heart', true, 28),
('Rehabilitation Medicine Department', 'Experienced Physical Therapists and Physiatrists with first EMG-NCV machine in the area.', 'Rehabilitation', 'therapy', true, 29),
('Digestive Endoscopy Unit', 'Fast, safe, and effective diagnosis of gastrointestinal diseases.', 'Diagnostic', 'medical', true, 30),
('Emergency Services', 'Expert emergency physicians with 24 hours a day service.', 'Emergency', 'emergency', true, 31),
('OFW Clinic', 'Only clinic of its kind in Region 12. Accredited by DOH, DOLE/POEA, and MARINA.', 'Specialty', 'clinic', true, 32)
ON CONFLICT DO NOTHING;

-- ===========================================
-- SEED DATA: Sample News
-- ===========================================
INSERT INTO news (title, slug, content, excerpt, is_published, published_at, author_id) VALUES
(
  'Welcome to Socsargen Hospital Online Services',
  'welcome-to-socsargen-hospital-online-services',
  'We are excited to announce the launch of our new online appointment booking system.',
  'We are excited to announce the launch of our new online appointment booking system.',
  true,
  CURRENT_TIMESTAMP,
  (SELECT id FROM users WHERE email = 'admin@socsargen-hospital.com' LIMIT 1)
),
(
  'New Pediatric Wing Now Open',
  'new-pediatric-wing-now-open',
  'We are proud to announce the opening of our new Pediatric Wing, designed specifically with children in mind.',
  'We are proud to announce the opening of our new Pediatric Wing.',
  true,
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  (SELECT id FROM users WHERE email = 'admin@socsargen-hospital.com' LIMIT 1)
)
ON CONFLICT (slug) DO NOTHING;

-- ===========================================
-- SEED DATA: Sample Awards
-- ===========================================
INSERT INTO patient_awards (title, recipient, description, votes, color_theme, display_order) VALUES
('Most Compassionate Care', 'Department of Pediatrics', 'Recognized by patients for providing the most compassionate and attentive care to children and their families.', 1248, 'rose', 1),
('Excellence in Service', 'Department of Internal Medicine', 'Voted by patients as the department delivering outstanding medical service with professionalism and dedication.', 1105, 'amber', 2),
('Best Patient Experience', 'Department of OB-GYN', 'Honored for creating the best overall patient experience — from warm reception to expert care.', 987, 'emerald', 3)
ON CONFLICT DO NOTHING;

-- ===========================================
-- SEED DATA: Sample Jobs
-- ===========================================
INSERT INTO jobs (title, department, job_type, location, description, requirements, is_active) VALUES
('Registered Nurse', 'Nursing Department', 'Full-time', 'General Santos City', 'We are looking for compassionate and skilled registered nurses.', 'BSN, Valid PRC License, BLS/ACLS Certification', true),
('Medical Technologist', 'Laboratory Department', 'Full-time', 'General Santos City', 'Join our laboratory team and help provide accurate diagnostic results.', 'BS Medical Technology, Valid PRC License', true),
('Pharmacist', 'Pharmacy Department', 'Full-time', 'General Santos City', 'We need licensed pharmacists to ensure safe medication management.', 'BS Pharmacy, Valid PRC License', true)
ON CONFLICT DO NOTHING;

SELECT 'Database setup complete!' as status;
