-- =============================================================
-- Vekta LMS — Turmas e Disciplinas
-- Execute no SQL Editor do Supabase após 01_schema.sql
-- =============================================================

-- Disciplinas (independentes de professor — o vínculo é na turma)
CREATE TABLE subjects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#1E3A8A',
  color_light TEXT NOT NULL DEFAULT '#EFF6FF',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Turmas (seção = disciplina + professor + grupo de alunos)
CREATE TABLE classes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id      UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject_id     UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  year           TEXT NOT NULL DEFAULT extract(year from now())::text,
  period         TEXT NOT NULL DEFAULT '1º Bimestre',
  grading_type   TEXT CHECK (grading_type IN ('numeric', 'mencao')) DEFAULT 'numeric',
  students_count INT NOT NULL DEFAULT 0,
  delivery_rate  INT NOT NULL DEFAULT 0,
  average        DECIMAL(4,2),
  at_risk        INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Matrícula aluno ↔ turma
CREATE TABLE class_students (
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (class_id, student_id)
);

-- =============================================================
-- Row Level Security
-- =============================================================
ALTER TABLE subjects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subjects_select" ON subjects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "classes_select" ON classes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "class_students_select" ON class_students
  FOR SELECT USING (student_id = auth.uid());
