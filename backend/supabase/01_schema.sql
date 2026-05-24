-- =============================================================
-- Vekta LMS — Schema v1
-- Execute este arquivo no SQL Editor do Supabase
-- =============================================================

-- Enum de perfis
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'coordinator', 'guardian', 'admin');

-- Tabela de escolas
CREATE TABLE schools (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  city         TEXT,
  state        TEXT,
  plan         TEXT CHECK (plan IN ('basic', 'standard', 'premium')) DEFAULT 'basic',
  status       TEXT CHECK (status IN ('active', 'inactive', 'trial')) DEFAULT 'active',
  primary_color TEXT DEFAULT '#1E3A8A',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de perfis (estende auth.users do Supabase)
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  role         user_role NOT NULL DEFAULT 'student',
  institution  TEXT,
  school_id    UUID REFERENCES schools(id) ON DELETE SET NULL,
  bio          TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Relacionamento responsável ↔ aluno
CREATE TABLE guardian_students (
  guardian_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (guardian_id, student_id)
);

-- =============================================================
-- Trigger: cria perfil automaticamente ao criar usuário no Auth
-- =============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================
-- Row Level Security
-- =============================================================
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools          ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_students ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário lê/edita o próprio perfil
CREATE POLICY "Próprio perfil: leitura" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Próprio perfil: edição" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins leem todos os perfis
CREATE POLICY "Admin: leitura de todos os perfis" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Schools: qualquer autenticado lê
CREATE POLICY "Schools: leitura" ON schools
  FOR SELECT USING (auth.role() = 'authenticated');

-- Guardian-student: responsável lê seus vínculos
CREATE POLICY "Guardian: leitura de vínculos" ON guardian_students
  FOR SELECT USING (guardian_id = auth.uid());
