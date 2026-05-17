-- =============================================================
-- Vekta LMS — Seed de Turmas e Disciplinas
-- Execute após 03_classes_subjects.sql e após 02_demo_seed.sql
-- =============================================================

-- Disciplinas da escola demo
INSERT INTO subjects (id, school_id, name, color, color_light) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Matemática',  '#1E3A8A', '#EFF6FF'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Português',   '#7C3AED', '#F5F3FF'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'História',    '#DC2626', '#FEF2F2'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Biologia',    '#059669', '#ECFDF5'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Física',      '#D97706', '#FFFBEB'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Química',     '#0891B2', '#ECFEFF'),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Geografia',   '#65A30D', '#F7FEE7'),
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Inglês',      '#DB2777', '#FDF2F8');

-- Turmas da Profa. Ana Lima (Matemática)
INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  p.id, '3º Ano A', '2024', '2º Bimestre', 'numeric', 28, 82, 7.8, 3
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app';

INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT
  '20000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  p.id, '3º Ano B', '2024', '2º Bimestre', 'numeric', 31, 71, 7.0, 4
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app';

INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT
  '20000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  p.id, '2º Ano A', '2024', '2º Bimestre', 'numeric', 25, 91, 7.4, 1
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app';

-- Turma de Biologia (menção) — Profa. Ana Lima como placeholder
INSERT INTO classes (id, school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT
  '20000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000004',
  p.id, '3º Ano A', '2024', '2º Bimestre', 'mencao', 28, 88, 7.6, 2
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app';

-- Turmas extras para visão do coordenador
INSERT INTO classes (school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', p.id, '1º Ano A', '2024', '2º Bimestre', 'numeric', 32, 83, 7.1, 2
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app';

INSERT INTO classes (school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', p.id, '1º Ano B', '2024', '2º Bimestre', 'numeric', 29, 76, 6.8, 4
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'ana.lima@escola.vekta.app';

INSERT INTO classes (school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', p.id, '2º Ano A', '2024', '2º Bimestre', 'numeric', 25, 91, 7.4, 1
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app';

INSERT INTO classes (school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', p.id, '2º Ano B', '2024', '2º Bimestre', 'numeric', 30, 69, 6.5, 6
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app';

INSERT INTO classes (school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', p.id, '1º Ano C', '2024', '2º Bimestre', 'numeric', 27, 88, 7.6, 2
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app';

INSERT INTO classes (school_id, subject_id, teacher_id, name, year, period, grading_type, students_count, delivery_rate, average, at_risk)
SELECT '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008', p.id, '2º Ano C', '2024', '2º Bimestre', 'numeric', 24, 95, 8.2, 0
FROM profiles p JOIN auth.users u ON u.id = p.id WHERE u.email = 'carlos@escola.vekta.app';

-- Matricula Lucas nas turmas da Ana Lima (Matemática)
INSERT INTO class_students (class_id, student_id)
SELECT c.id, p.id
FROM classes c, profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'lucas@escola.vekta.app'
  AND c.id IN (
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000004'
  );
