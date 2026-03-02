-- Patient's Choice Awards table
CREATE TABLE IF NOT EXISTS patient_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  description TEXT,
  photo_url VARCHAR(500),
  votes INTEGER DEFAULT 0,
  color_theme VARCHAR(50) DEFAULT 'amber',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed with initial data
INSERT INTO patient_awards (title, recipient, description, votes, color_theme, display_order) VALUES
('Most Compassionate Care', 'Department of Pediatrics', 'Recognized by patients for providing the most compassionate and attentive care to children and their families.', 1248, 'rose', 1),
('Excellence in Service', 'Department of Internal Medicine', 'Voted by patients as the department delivering outstanding medical service with professionalism and dedication.', 1105, 'amber', 2),
('Best Patient Experience', 'Department of OB-GYN', 'Honored for creating the best overall patient experience — from warm reception to expert care.', 987, 'emerald', 3);
