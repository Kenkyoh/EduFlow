# Vekta

Plataforma educacional unificada construída com React + TypeScript + Node.js + Supabase. Reúne alunos, professores, coordenadores, responsáveis e administradores em um único sistema — cada perfil com sua própria visão e funcionalidades.

---

## Demonstração rápida

Acesse os perfis de demonstração com um clique na tela de login (senha: `Demo@2025#`):

| Perfil | E-mail | Acesso a |
|---|---|---|
| Aluno | `lucas@escola.vekta.app` | Turmas, atividades, boletim, calendário |
| Professor | `ana.lima@escola.vekta.app` | Turmas, lançamento de notas, correção |
| Coordenador | `carlos@escola.vekta.app` | Analytics, visão geral das turmas |
| Responsável | `fernanda.mendes@gmail.com` | Desempenho, frequência e atividades dos filhos |

### Acesso Administrativo

O administrador **não aparece no acesso rápido** e requer credenciais específicas no formulário de login:

| Campo | Valor |
|---|---|
| E-mail | `admin@vekta.app` |
| Senha | `Demo@2025#` |

---

## Funcionalidades

### Aluno
- Dashboard com resumo de notas, atividades pendentes e calendário
- Visualização de turmas e mural de avisos
- Entrega de atividades com upload de arquivos
- Boletim completo (notas numéricas e por menção)
- Calendário de provas e entregas

### Professor
- Gerenciamento de turmas
- Criação e publicação de atividades com múltiplas turmas
- Lançamento de notas (sistema numérico e por menção/objetivos)
- Correção de entregas com feedback
- Publicação de avisos e materiais no mural

### Coordenador
- Analytics de desempenho por turma e disciplina
- Distribuição de notas, frequência e alunos em risco
- Visão consolidada de todas as turmas

### Responsável
- Acompanhamento em tempo real do desempenho dos filhos
- Boletim detalhado por disciplina com histórico bimestral
- Frequência por matéria com alertas de mínimo
- Lista de atividades pendentes, próximas e atrasadas

### Administrador do Site
- Gerenciamento de múltiplas escolas (multi-tenant)
- Cadastro de novas escolas com plano e status
- Detalhes de cada escola: usuários, turmas, configurações
- Dashboard com KPIs consolidados de toda a plataforma

### Geral
- Autenticação real via Supabase Auth com JWT
- Sistema de notificações em tempo real (painel lateral)
- Mensagens diretas entre usuários
- Personalização de perfil: foto, cor do avatar, senha
- Barra lateral colapsável com navegação por papel
- Internacionalização: Português, Inglês e Espanhol
- Design responsivo

---

## Stack

### Frontend

| Categoria | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Estilização | Tailwind CSS 3 |
| Roteamento | React Router v6 |
| Estado global | Zustand |
| Data fetching | TanStack Query (React Query) |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Utilitários | clsx, date-fns |

### Backend

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js + Express |
| Linguagem | TypeScript (tsx) |
| Banco de dados | PostgreSQL via Supabase |
| Autenticação | Supabase Auth + JWT |
| ORM | Supabase JS Client |

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) com projeto criado

### 1. Clone o repositório

```bash
git clone https://github.com/Kenkyoh/Vekta.git
cd Vekta
```

### 2. Configure o frontend

```bash
# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite .env e defina VITE_API_URL=http://localhost:3001
```

### 3. Configure o backend

```bash
cd backend
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite .env com sua URL e service_role key do Supabase
```

### 4. Configure o banco de dados

Execute os arquivos SQL na ordem no **SQL Editor** do Supabase:

```
backend/supabase/01_schema.sql          # Tabelas e triggers
backend/supabase/02_demo_seed.sql       # Usuários de demonstração
backend/supabase/03_classes_subjects.sql # Turmas e disciplinas
backend/supabase/04_classes_seed.sql    # Dados de exemplo
backend/supabase/05_activities.sql      # Atividades
```

### 5. Inicie os servidores

```bash
# Terminal 1 — backend (porta 3001)
cd backend
npm run dev

# Terminal 2 — frontend (porta 5173)
cd ..
npm run dev
```

Acesse **http://localhost:5173** no navegador.

### Outros comandos

```bash
npm run build    # Build de produção (frontend)
npm run preview  # Prévia do build
```

---

## Estrutura do projeto

```
├── backend/
│   ├── src/
│   │   ├── config/        # Cliente Supabase (admin + auth)
│   │   ├── middleware/    # Autenticação JWT
│   │   ├── routes/        # auth, subjects, classes, activities
│   │   ├── types/         # Tipos TypeScript
│   │   └── server.ts      # Entry point Express
│   └── supabase/          # Migrations SQL (01–05)
│
└── src/
    ├── components/        # Componentes compartilhados
    ├── hooks/             # React Query hooks (useClasses, useActivities…)
    ├── lib/               # Cliente HTTP (api.ts)
    ├── pages/
    │   ├── student/       # Páginas do aluno
    │   ├── teacher/       # Páginas do professor
    │   ├── coordinator/   # Páginas do coordenador
    │   ├── guardian/      # Páginas do responsável
    │   └── admin/         # Páginas do administrador
    ├── store/             # Estado global Zustand (auth, grades…)
    ├── types/             # Tipos TypeScript
    └── utils/             # Formatação de notas, labels de papéis
```

---

## Licença

MIT © [Luiz Felipe Scaramuzza](https://github.com/Kenkyoh)
