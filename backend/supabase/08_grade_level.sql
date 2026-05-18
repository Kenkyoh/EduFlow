-- =============================================================
-- Vekta LMS — Série escolar nas turmas
-- Execute no SQL Editor do Supabase
-- =============================================================

ALTER TABLE classes ADD COLUMN IF NOT EXISTS grade_level TEXT NOT NULL DEFAULT '';
