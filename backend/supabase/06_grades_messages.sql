-- =============================================================
-- Vekta LMS — Notas, Objetivos e Mensagens
-- Execute após 05_activities.sql
-- =============================================================

-- Notas por avaliação (disciplinas numéricas)
CREATE TABLE IF NOT EXISTS student_grades (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id     uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  bimester     integer NOT NULL DEFAULT 2 CHECK (bimester BETWEEN 1 AND 4),
  assessment   text NOT NULL,
  weight       integer NOT NULL DEFAULT 25,
  score        decimal(5,2),
  attendance   integer NOT NULL DEFAULT 100,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id, bimester, assessment)
);

ALTER TABLE student_grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Student reads own grades" ON student_grades
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teacher reads class grades" ON student_grades
  FOR SELECT USING (
    class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
  );

-- Objetivos bimestrais (disciplinas por menção)
CREATE TABLE IF NOT EXISTS student_objectives (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id         uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  bimester         integer NOT NULL DEFAULT 2,
  objective_index  integer NOT NULL,
  title            text NOT NULL,
  value            text CHECK (value IN ('PA', 'AC', 'A', 'P', 'N')),
  attendance       integer NOT NULL DEFAULT 100,
  UNIQUE(student_id, class_id, bimester, objective_index)
);

ALTER TABLE student_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Student reads own objectives" ON student_objectives
  FOR SELECT USING (student_id = auth.uid());

-- Conversas
CREATE TABLE IF NOT EXISTS conversations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     uuid REFERENCES schools(id) ON DELETE SET NULL,
  participant_a uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_b uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participant reads conversation" ON conversations
  FOR SELECT USING (participant_a = auth.uid() OR participant_b = auth.uid());

CREATE POLICY "Participant creates conversation" ON conversations
  FOR INSERT WITH CHECK (participant_a = auth.uid() OR participant_b = auth.uid());

CREATE POLICY "Participant updates conversation" ON conversations
  FOR UPDATE USING (participant_a = auth.uid() OR participant_b = auth.uid());

-- Mensagens
CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         text NOT NULL,
  read            boolean NOT NULL DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participant reads messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_a = auth.uid() OR participant_b = auth.uid()
    )
  );

CREATE POLICY "Sender creates message" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipient marks read" ON messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_a = auth.uid() OR participant_b = auth.uid()
    )
  );

-- =============================================================
-- Turmas extras para o boletim de Lucas
-- =============================================================

INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002', p.id,
  '3º Ano A', '2024', '2º Bimestre', 'numeric', 28, 85, 7.2, 2
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000005', p.id,
  '3º Ano A', '2024', '2º Bimestre', 'numeric', 28, 79, 6.4, 4
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000003', p.id,
  '3º Ano A', '2024', '2º Bimestre', 'numeric', 28, 90, 7.8, 1
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000008', p.id,
  '3º Ano A', '2024', '2º Bimestre', 'numeric', 28, 88, 6.8, 3
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

-- Matricula Lucas nas novas turmas
INSERT INTO class_students (class_id, student_id)
SELECT c.id, p.id
FROM classes c
CROSS JOIN (
  SELECT profiles.id FROM profiles JOIN auth.users u ON u.id = profiles.id
  WHERE u.email = 'lucas@escola.vekta.app'
) p
WHERE c.id IN (
  '20000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000006',
  '20000000-0000-0000-0000-000000000007',
  '20000000-0000-0000-0000-000000000008'
)
ON CONFLICT DO NOTHING;

-- =============================================================
-- Notas do Lucas — 1º Bimestre (histórico)
-- =============================================================

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 1, 'Prova 1',     25, 7.0, 90 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 1, 'Prova 2',     25, 6.5, 90 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 1, 'Trabalho',    25, 8.0, 90 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 1, 'Participação',25, 7.5, 90 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000005', 1, 'Redação',  40, 6.5, 82 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000005', 1, 'Gramática',30, 5.5, 82 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000005', 1, 'Leitura',  30, 7.0, 82 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000006', 1, 'Prova 1', 40, 5.0, 75 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000006', 1, 'Lab',     30, 6.5, 75 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000006', 1, 'Quiz',    30, 6.0, 75 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000007', 1, 'Prova 1',    40, 7.5, 80 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000007', 1, 'Trabalho',   40, 7.0, 80 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000007', 1, 'Participação',20, 8.0, 80 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000008', 1, 'Prova',    40, 4.0, 72 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000008', 1, 'Oral',     30, 4.5, 72 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000008', 1, 'Atividade',30, 5.5, 72 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

-- =============================================================
-- Notas do Lucas — 2º Bimestre
-- =============================================================

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 2, 'Prova 1',     25, 8.5, 95 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 2, 'Prova 2',     25, 7.0, 95 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 2, 'Trabalho',    25, 9.0, 95 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000001', 2, 'Participação',25, 8.0, 95 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000005', 2, 'Redação',  40, 7.5, 88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000005', 2, 'Gramática',30, 6.0, 88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000005', 2, 'Leitura',  30, 8.0, 88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000006', 2, 'Prova 1', 40, 5.5, 80 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000006', 2, 'Lab',     30, 7.0, 80 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000006', 2, 'Quiz',    30, 6.5, 80 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000007', 2, 'Prova 1',    40, 8.0, 85 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000007', 2, 'Trabalho',   40, 7.5, 85 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000007', 2, 'Participação',20, 8.5, 85 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000008', 2, 'Prova',    40, 4.5, 78 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000008', 2, 'Oral',     30, 5.0, 78 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_grades (student_id, class_id, bimester, assessment, weight, score, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000008', 2, 'Atividade',30, 6.0, 78 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

-- Biologia — objetivos por menção, 1º bimestre
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 1, 1, 'Identificar estruturas celulares em microscopia', 'A',  88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 1, 2, 'Compreender processos de divisão celular', 'AC', 88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 1, 3, 'Analisar experimentos de hereditariedade',     'A',  88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 1, 4, 'Relacionar genótipo e fenótipo',               'P',  88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 1, 5, 'Discutir aplicações da biotecnologia',         'A',  88 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

-- Biologia — objetivos por menção, 2º bimestre
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 2, 1, 'Identificar estruturas celulares em microscopia', 'PA', 92 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 2, 2, 'Compreender processos de divisão celular',        'AC', 92 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 2, 3, 'Analisar experimentos de hereditariedade',        'A',  92 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 2, 4, 'Relacionar genótipo e fenótipo',                  'PA', 92 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;
INSERT INTO student_objectives (student_id, class_id, bimester, objective_index, title, value, attendance)
SELECT p.id, '20000000-0000-0000-0000-000000000004', 2, 5, 'Discutir aplicações da biotecnologia',            'AC', 92 FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app' ON CONFLICT DO NOTHING;

-- =============================================================
-- Mensagens de demonstração
-- =============================================================

-- Conversa: Lucas ↔ Profa. Ana Lima
INSERT INTO conversations (id, school_id, participant_a, participant_b, updated_at)
SELECT
  'f0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  lucas.id, ana.id,
  NOW() - INTERVAL '20 hours'
FROM
  (SELECT p.id FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app') lucas,
  (SELECT p.id FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app') ana
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, read, created_at)
SELECT 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', p.id,
  'Olá Lucas! Queria avisar que a prova bimestral vai cobrir funções quadráticas e progressões. Prepare-se bem!',
  true, NOW() - INTERVAL '3 days'
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, read, created_at)
SELECT 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', p.id,
  'Obrigada professora! Tenho estudado bastante. Posso tirar dúvidas antes da prova?',
  true, NOW() - INTERVAL '2 days' - INTERVAL '18 hours'
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, read, created_at)
SELECT 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', p.id,
  'Claro! Me chame amanhã antes da aula, estarei na sala dos professores das 7h30 às 8h.',
  true, NOW() - INTERVAL '2 days' - INTERVAL '17 hours'
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, read, created_at)
SELECT 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', p.id,
  'Professora, tirei 8,5 na Prova 1! Muito obrigado pelo apoio. 🎉',
  true, NOW() - INTERVAL '1 day'
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, read, created_at)
SELECT 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', p.id,
  'Parabéns Lucas! Você se dedicou muito. Continue assim para o 3º bimestre!',
  false, NOW() - INTERVAL '20 hours'
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;

-- Conversa: Lucas ↔ Coordenador Carlos
INSERT INTO conversations (id, school_id, participant_a, participant_b, updated_at)
SELECT
  'f0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  lucas.id, carlos.id,
  NOW() - INTERVAL '5 hours'
FROM
  (SELECT p.id FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'lucas@escola.vekta.app') lucas,
  (SELECT p.id FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app') carlos
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, content, read, created_at)
SELECT 'e0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000002', p.id,
  'Olá Lucas, sua frequência em Inglês está abaixo do mínimo. Regularize até o final do bimestre para evitar retenção.',
  false, NOW() - INTERVAL '5 hours'
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app'
ON CONFLICT (id) DO NOTHING;
