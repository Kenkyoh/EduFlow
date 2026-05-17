-- =============================================================
-- Vekta LMS — Seed de dados demo
-- Execute APÓS criar os usuários demo no painel Auth do Supabase
-- e APÓS rodar o 01_schema.sql
--
-- Usuários demo a criar no painel (Authentication > Users > Add User):
--   lucas@escola.vekta.app      senha: Demo@2025#
--   ana.lima@escola.vekta.app   senha: Demo@2025#
--   carlos@escola.vekta.app     senha: Demo@2025#
--   fernanda.mendes@gmail.com   senha: Demo@2025#
--   admin@vekta.app             senha: Vekta@2025#Admin
--
-- Após criar, rode este script para preencher os perfis.
-- =============================================================

-- Escola demo
INSERT INTO schools (id, name, city, state, plan, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Colégio Estadual São Paulo',
  'São Paulo',
  'SP',
  'standard',
  'active'
);

-- Atualiza perfis criados automaticamente pelo trigger
-- Substitua os UUIDs pelos IDs reais dos usuários criados no Auth

UPDATE profiles
SET
  name        = 'Lucas Mendes',
  role        = 'student',
  institution = 'Colégio Estadual São Paulo',
  school_id   = '00000000-0000-0000-0000-000000000001'
WHERE id = (SELECT id FROM auth.users WHERE email = 'lucas@escola.vekta.app');

UPDATE profiles
SET
  name        = 'Profa. Ana Lima',
  role        = 'teacher',
  institution = 'Colégio Estadual São Paulo',
  school_id   = '00000000-0000-0000-0000-000000000001'
WHERE id = (SELECT id FROM auth.users WHERE email = 'ana.lima@escola.vekta.app');

UPDATE profiles
SET
  name        = 'Dir. Carlos Santos',
  role        = 'coordinator',
  institution = 'Colégio Estadual São Paulo',
  school_id   = '00000000-0000-0000-0000-000000000001'
WHERE id = (SELECT id FROM auth.users WHERE email = 'carlos@escola.vekta.app');

UPDATE profiles
SET
  name        = 'Fernanda Mendes',
  role        = 'guardian',
  institution = 'Colégio Estadual São Paulo',
  school_id   = '00000000-0000-0000-0000-000000000001'
WHERE id = (SELECT id FROM auth.users WHERE email = 'fernanda.mendes@gmail.com');

UPDATE profiles
SET
  name        = 'Admin Vekta',
  role        = 'admin',
  institution = 'Vekta'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@vekta.app');
