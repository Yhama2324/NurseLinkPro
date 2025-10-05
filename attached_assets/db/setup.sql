-- ===== Ensure base table exists/has the right columns =====
-- If you already created `subjects` in Railway UI, this will only add missing pieces.

-- Add missing columns & unique key safely
ALTER TABLE IF EXISTS subjects
  ADD COLUMN IF NOT EXISTS year_level INT,
  ADD COLUMN IF NOT EXISTS semester INT,
  ALTER COLUMN subject_code TYPE VARCHAR(20);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'subjects_subject_code_key'
  ) THEN
    ALTER TABLE subjects ADD CONSTRAINT subjects_subject_code_key UNIQUE (subject_code);
  END IF;
END $$;

-- If you do NOT have the subjects table yet, uncomment this block:
-- CREATE TABLE IF NOT EXISTS subjects (
--   id SERIAL PRIMARY KEY,
--   subject_name TEXT,
--   subject_code VARCHAR(20) UNIQUE,
--   year_level INT,
--   semester INT
-- );

-- ===== Learning outcomes per subject =====
CREATE TABLE IF NOT EXISTS subject_outcomes (
  id SERIAL PRIMARY KEY,
  subject_code VARCHAR(20) NOT NULL REFERENCES subjects(subject_code) ON DELETE CASCADE,
  outcome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (subject_code, outcome)
);

-- ===== Topics with subtopics + tags =====
CREATE TABLE IF NOT EXISTS subject_topics (
  id SERIAL PRIMARY KEY,
  subject_code VARCHAR(20) NOT NULL REFERENCES subjects(subject_code) ON DELETE CASCADE,
  topic_name TEXT NOT NULL,
  subtopics JSONB NOT NULL DEFAULT '[]'::JSONB,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (subject_code, topic_name)
);

CREATE INDEX IF NOT EXISTS subject_topics_code_idx ON subject_topics(subject_code);
CREATE INDEX IF NOT EXISTS subject_topics_tags_gin ON subject_topics USING GIN(tags);

-- ===== Quiz bank (multiple-choice) =====
CREATE TABLE IF NOT EXISTS quiz_items (
  id SERIAL PRIMARY KEY,
  subject_code VARCHAR(20) NOT NULL REFERENCES subjects(subject_code) ON DELETE CASCADE,
  topic_name TEXT,
  question TEXT NOT NULL,
  choices JSONB NOT NULL,               -- ["A","B","C","D"]
  correct_index INT NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  difficulty TEXT DEFAULT 'medium',     -- easy|medium|hard
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_items_code_idx ON quiz_items(subject_code);
CREATE INDEX IF NOT EXISTS quiz_items_tags_gin ON quiz_items USING GIN(tags);

-- ===== Enrollee Mode support =====
CREATE TABLE IF NOT EXISTS semesters (
  id SERIAL PRIMARY KEY,
  ay VARCHAR(20) NOT NULL,   -- e.g. '2025-2026'
  term INT NOT NULL CHECK (term IN (1,2))
);

CREATE TABLE IF NOT EXISTS users_min (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users_min(id) ON DELETE CASCADE,
  subject_code VARCHAR(20) NOT NULL REFERENCES subjects(subject_code) ON DELETE CASCADE,
  semester_id INT NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  units INT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, subject_code, semester_id)
);

-- ===== Seed a few sample rows so you can see data right away =====
INSERT INTO subjects (subject_name, subject_code, year_level, semester)
VALUES
('Fundamentals of Nursing Practice','NCM6103',1,1),
('Anatomy and Physiology','NURS6101',1,1),
('Health Assessment','NCM6101',1,2)
ON CONFLICT (subject_code) DO NOTHING;

INSERT INTO subject_outcomes (subject_code, outcome) VALUES
('NCM6103','Demonstrate safe basic nursing skills following infection control protocols'),
('NCM6103','Document care using SBAR and accepted charting methods'),
('NCM6101','Perform head-to-toe assessment and recognize deviations from normal')
ON CONFLICT DO NOTHING;

INSERT INTO subject_topics (subject_code, topic_name, subtopics, tags) VALUES
('NCM6103','Safety & Infection Control','["Hand hygiene","PPE","Isolation"]', ARRAY['infection_control','ppe']),
('NCM6103','Documentation','["DAR/SOAPIE","SBAR handoff"]', ARRAY['documentation','sbar']),
('NCM6101','Vital Signs','["BP","HR","RR","Temp","Pain"]', ARRAY['vitals'])
ON CONFLICT DO NOTHING;

INSERT INTO quiz_items (subject_code, topic_name, question, choices, correct_index, tags)
VALUES (
  'NCM6103',
  'Safety & Infection Control',
  'Which action breaks the chain of infection at the portal of exit?',
  '["Applying a mask to a coughing patient","Disinfecting the stethoscope","Performing hand hygiene before donning gloves","Placing used needles in regular trash"]'::jsonb,
  0,
  ARRAY['infection_control','fundamentals','pnle']
);
