-- =============================================================
-- Vekta LMS — Tabela de Atividades
-- Execute após 04_classes_seed.sql
-- =============================================================

CREATE TABLE IF NOT EXISTS activities (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id      uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id       uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id     uuid REFERENCES profiles(id) ON DELETE SET NULL,
  subject_id     uuid REFERENCES subjects(id) ON DELETE SET NULL,
  title          text NOT NULL,
  type           text NOT NULL DEFAULT 'trabalho',
  description    text,
  start_date     timestamptz,
  due_date       timestamptz NOT NULL,
  weight         integer NOT NULL DEFAULT 20 CHECK (weight >= 0 AND weight <= 100),
  allow_resubmit boolean NOT NULL DEFAULT false,
  max_attempts   integer NOT NULL DEFAULT 1,
  published      boolean NOT NULL DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teacher sees own activities" ON activities
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Coordinator sees school activities" ON activities
  FOR SELECT USING (
    school_id IN (
      SELECT school_id FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator', 'admin')
    )
  );

CREATE POLICY "Student sees enrolled activities" ON activities
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM public.class_students WHERE student_id = auth.uid())
    AND published = true
  );

CREATE POLICY "Teacher can create activities" ON activities
  FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teacher can update activities" ON activities
  FOR UPDATE USING (teacher_id = auth.uid());

-- =============================================================
-- Seed — atividades de exemplo para as turmas da Ana Lima
-- =============================================================

-- Matemática 3ºA (class_id = 20000000-...-001)
INSERT INTO activities (id, school_id, class_id, teacher_id, subject_id, title, type, description, start_date, due_date, weight, allow_resubmit, published)
SELECT
  '30000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  p.id,
  '10000000-0000-0000-0000-000000000001',
  'Prova Bimestral — Funções do 2º Grau',
  'prova',
  'Conteúdo: funções quadráticas, discriminante, vértice e gráfico. Calculadora não permitida.',
  (NOW() + INTERVAL '3 days')::date + TIME '08:00:00',
  (NOW() + INTERVAL '3 days')::date + TIME '10:00:00',
  40,
  false,
  true
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO activities (id, school_id, class_id, teacher_id, subject_id, title, type, description, start_date, due_date, weight, allow_resubmit, published)
SELECT
  '30000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  p.id,
  '10000000-0000-0000-0000-000000000001',
  'Lista de Exercícios — Progressões Aritméticas',
  'trabalho',
  'Resolva os exercícios da lista e entregue em PDF. Mostre todo o desenvolvimento.',
  NOW()::date,
  (NOW() + INTERVAL '1 day')::date + TIME '23:59:00',
  30,
  true,
  true
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO activities (id, school_id, class_id, teacher_id, subject_id, title, type, description, start_date, due_date, weight, allow_resubmit, published)
SELECT
  '30000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  p.id,
  '10000000-0000-0000-0000-000000000001',
  'Trabalho — Aplicações de Funções no Cotidiano',
  'trabalho',
  'Pesquise e apresente 2 aplicações reais de funções matemáticas em situações cotidianas.',
  NOW()::date,
  (NOW() + INTERVAL '7 days')::date + TIME '23:59:00',
  30,
  false,
  true
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

-- Biologia 3ºA (class_id = 20000000-...-004)
INSERT INTO activities (id, school_id, class_id, teacher_id, subject_id, title, type, description, start_date, due_date, weight, allow_resubmit, published)
SELECT
  '30000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000004',
  p.id,
  '10000000-0000-0000-0000-000000000004',
  'Relatório de Experimento — Mitose',
  'trabalho',
  'Elabore um relatório científico sobre o experimento de observação de mitose em células de cebola.',
  NOW()::date,
  (NOW() + INTERVAL '5 days')::date + TIME '18:00:00',
  25,
  true,
  true
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO activities (id, school_id, class_id, teacher_id, subject_id, title, type, description, start_date, due_date, weight, allow_resubmit, published)
SELECT
  '30000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000004',
  p.id,
  '10000000-0000-0000-0000-000000000004',
  'Questionário — Hereditariedade e Genética',
  'outro',
  'Responda às questões de múltipla escolha sobre hereditariedade mendeliana.',
  (NOW() - INTERVAL '3 days')::date,
  (NOW() - INTERVAL '1 day')::date + TIME '23:59:00',
  20,
  false,
  true
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;
