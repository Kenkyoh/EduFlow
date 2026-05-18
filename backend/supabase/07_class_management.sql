-- =============================================================
-- Vekta LMS — Gestão de Turmas (Coordenador e Professor)
-- Execute no SQL Editor do Supabase após os arquivos anteriores
-- =============================================================

-- ── Adiciona coluna email em profiles (para busca por e-mail) ──
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Função para sincronizar emails dos usuários já cadastrados
CREATE OR REPLACE FUNCTION backfill_profile_emails()
RETURNS void AS $$
BEGIN
  UPDATE profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.id = u.id AND p.email IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT backfill_profile_emails();

-- Atualiza trigger para salvar email ao criar novos usuários
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================
-- RLS: Profiles — leitura de perfis da mesma escola
-- =============================================================

-- Coordenadores e professores podem buscar perfis da mesma escola
-- (necessário para busca por e-mail ao criar turma / matricular aluno)
CREATE POLICY "Mesma escola: leitura de perfis"
  ON profiles FOR SELECT
  USING (
    school_id IS NOT NULL
    AND school_id = (
      SELECT school_id FROM profiles WHERE id = auth.uid() LIMIT 1
    )
  );

-- =============================================================
-- RLS: Subjects — coordenador cria disciplinas
-- =============================================================

CREATE POLICY "Coordenador: criar disciplinas"
  ON subjects FOR INSERT
  WITH CHECK (
    school_id = (
      SELECT school_id FROM profiles
      WHERE id = auth.uid() AND role = 'coordinator'
      LIMIT 1
    )
  );

-- =============================================================
-- RLS: Classes — coordenador cria e atualiza turmas
-- =============================================================

CREATE POLICY "Coordenador: criar turmas"
  ON classes FOR INSERT
  WITH CHECK (
    school_id = (
      SELECT school_id FROM profiles
      WHERE id = auth.uid() AND role = 'coordinator'
      LIMIT 1
    )
  );

CREATE POLICY "Coordenador/Professor: atualizar turma"
  ON classes FOR UPDATE
  USING (
    teacher_id = auth.uid()
    OR school_id = (
      SELECT school_id FROM profiles
      WHERE id = auth.uid() AND role = 'coordinator'
      LIMIT 1
    )
  );

-- =============================================================
-- RLS: Class students — professor e coordenador gerenciam alunos
-- =============================================================

-- Substitui a política restritiva original (só o próprio aluno)
DROP POLICY IF EXISTS "class_students_select" ON class_students;

-- Professor e coordenador veem todos os alunos das suas turmas
CREATE POLICY "class_students_select"
  ON class_students FOR SELECT
  USING (
    student_id = auth.uid()
    OR class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      JOIN classes c ON c.school_id = p.school_id
      WHERE p.id = auth.uid()
        AND p.role = 'coordinator'
        AND c.id = class_students.class_id
    )
  );

-- Professor matricula alunos nas suas turmas; coordenador em qualquer turma da escola
CREATE POLICY "Professor/Coordenador: matricular alunos"
  ON class_students FOR INSERT
  WITH CHECK (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()
    )
    OR class_id IN (
      SELECT c.id FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE p.id = auth.uid() AND p.role = 'coordinator'
    )
  );

-- Professor e coordenador removem alunos
CREATE POLICY "Professor/Coordenador: remover alunos"
  ON class_students FOR DELETE
  USING (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()
    )
    OR class_id IN (
      SELECT c.id FROM classes c
      JOIN profiles p ON p.school_id = c.school_id
      WHERE p.id = auth.uid() AND p.role = 'coordinator'
    )
  );
