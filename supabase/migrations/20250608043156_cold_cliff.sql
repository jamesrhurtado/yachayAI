/*
  # Initial Schema for YachayAI Platform

  1. New Tables
    - `grades` - Academic grades (5th, 6th)
    - `subjects` - Academic subjects (Ciencia y Tecnología, etc.)
    - `topics` - Curriculum topics by grade and subject
    - `questions` - AI-generated questions linked to topics
    - `study_sessions` - AI-generated study sessions
    - `user_profiles` - Extended user information
    - `user_progress` - Track student progress by topic
    - `question_attempts` - Track individual question attempts

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure students can only see their own data
*/

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text DEFAULT 'book',
  color text DEFAULT '#3B82F6',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  curriculum_code text,
  difficulty_level int DEFAULT 1,
  estimated_duration int DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice',
  options jsonb DEFAULT '[]'::jsonb,
  correct_answer text NOT NULL,
  explanation text,
  difficulty int DEFAULT 1,
  points int DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  audio_url text,
  duration int DEFAULT 0,
  script_generated_at timestamptz DEFAULT now(),
  audio_generated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  grade_id uuid REFERENCES grades(id),
  total_points int DEFAULT 0,
  level int DEFAULT 1,
  streak_days int DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  questions_answered int DEFAULT 0,
  questions_correct int DEFAULT 0,
  total_points int DEFAULT 0,
  completion_percentage int DEFAULT 0,
  last_studied_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create question_attempts table
CREATE TABLE IF NOT EXISTS question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  user_answer text NOT NULL,
  is_correct boolean NOT NULL,
  points_earned int DEFAULT 0,
  time_taken int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for grades (public read)
CREATE POLICY "Anyone can view grades"
  ON grades FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for topics (public read)
CREATE POLICY "Anyone can view topics"
  ON topics FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for questions (public read)
CREATE POLICY "Anyone can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for study_sessions (public read)
CREATE POLICY "Anyone can view study sessions"
  ON study_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_profiles
CREATE POLICY "Users can view and update own profile"
  ON user_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for user_progress
CREATE POLICY "Users can view and update own progress"
  ON user_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for question_attempts
CREATE POLICY "Users can view and create own attempts"
  ON question_attempts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial data
INSERT INTO grades (name, display_name, order_index) VALUES
  ('5th', '5to Grado', 1),
  ('6th', '6to Grado', 2);

INSERT INTO subjects (name, slug, icon, color, description) VALUES
  ('Ciencia y Tecnología', 'ciencia-tecnologia', 'microscope', '#10B981', 'Explora el mundo de la ciencia y tecnología');

-- Insert sample topics for Science and Technology
INSERT INTO topics (title, description, grade_id, subject_id, curriculum_code, difficulty_level)
SELECT 
  topic_data.title,
  topic_data.description,
  g.id,
  s.id,
  topic_data.code,
  topic_data.difficulty
FROM subjects s
CROSS JOIN grades g
CROSS JOIN (
  VALUES
    ('Partes de la célula', 'Aprende sobre las estructuras básicas de las células', 'CT-5-01', 1),
    ('Reino Animal', 'Descubre la diversidad del reino animal', 'CT-5-02', 2),
    ('Estados de la materia', 'Explora sólidos, líquidos y gases', 'CT-5-03', 1),
    ('Energía y movimiento', 'Comprende las fuerzas y el movimiento', 'CT-5-04', 2),
    ('Ecosistemas', 'Conoce los diferentes ecosistemas', 'CT-5-05', 3),
    ('Plantas y fotosíntesis', 'Aprende cómo las plantas producen alimento', 'CT-6-01', 2),
    ('Sistema solar', 'Explora planetas y estrellas', 'CT-6-02', 3),
    ('Mezclas y soluciones', 'Diferencia tipos de mezclas', 'CT-6-03', 2),
    ('Máquinas simples', 'Comprende palancas, poleas y planos', 'CT-6-04', 3),
    ('Cambios climáticos', 'Estudia el clima y sus variaciones', 'CT-6-05', 4)
) AS topic_data(title, description, code, difficulty)
WHERE s.slug = 'ciencia-tecnologia';