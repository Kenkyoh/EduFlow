<div align="center">

# Vekta — Plataforma Educacional Completa

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)

**Sistema de gestão escolar full-stack com autenticação real, multi-perfil e internacionalização.**  
Alunos, professores, coordenadores, responsáveis e administradores — tudo em um só lugar.

</div>

---

## Por que Vekta?

| | Diferencial |
|---|---|
| 👥 **Multi-perfil nativo** | 5 painéis completamente distintos (aluno, professor, coordenador, responsável, admin) — cada um com sua própria navegação, rotas e regras de acesso |
| 🌍 **Internacionalização completa** | Interface disponível em Português, Inglês e Espanhol, com troca de idioma em tempo real — pronto para mercados internacionais |
| 🔐 **Autenticação real** | Login com Supabase Auth + JWT, sessão persistente, Row Level Security no banco — não é demo, é produção |
| 🏫 **Multi-tenant** | Suporte a múltiplas escolas desde a arquitetura — cada escola isolada, com seu próprio conjunto de turmas, usuários e dados |
| ⚡ **Stack moderna e escalável** | React 18 + TypeScript + Node.js + PostgreSQL. Código limpo, sem dependências pesadas, fácil de customizar e estender |

---

## Screenshots

> **Para compradores:** substitua os placeholders abaixo pelos prints reais do sistema.  
> Consulte [`docs/screenshots/README.md`](docs/screenshots/README.md) para instruções detalhadas.

### 🎓 Dashboard do Aluno
![Dashboard do Aluno](docs/screenshots/student-dashboard.png)

### 👩‍🏫 Dashboard do Professor
![Dashboard do Professor](docs/screenshots/teacher-dashboard.png)

### 📊 Dashboard do Coordenador
![Dashboard do Coordenador](docs/screenshots/coordinator-dashboard.png)

### 👨‍👩‍👧 Painel do Responsável
![Painel do Responsável](docs/screenshots/guardian-dashboard.png)

### ⚙️ Painel Administrativo
![Painel Administrativo](docs/screenshots/admin-dashboard.png)

---

## Demonstração rápida

Acesse os perfis de demonstração com um clique na tela de login (senha: `Demo@2025#`):

| Perfil | E-mail | O que pode ver |
|---|---|---|
| 🎓 Aluno | `lucas@escola.vekta.app` | Turmas, atividades, boletim, calendário |
| 👩‍🏫 Professor | `ana.lima@escola.vekta.app` | Turmas, lançamento de notas, correção |
| 📊 Coordenador | `carlos@escola.vekta.app` | Analytics, visão geral das turmas |
| 👨‍👩‍👧 Responsável | `fernanda.mendes@gmail.com` | Desempenho e atividades dos filhos |

**Acesso administrativo** (formulário de login):

| Campo | Valor |
|---|---|
| E-mail | `admin@vekta.app` |
| Senha | `Vekta@2025#Admin` |

---

## Funcionalidades

### 🎓 Aluno

| | Funcionalidade |
|---|---|
| 📋 | Dashboard com resumo de notas, atividades pendentes e calendário |
| 🏫 | Visualização de turmas matriculadas e mural de avisos |
| 📤 | Entrega de atividades com upload de arquivos |
| 📊 | Boletim completo (notas numéricas e por menção) |
| 📅 | Calendário de provas e entregas com contagem regressiva |

### 👩‍🏫 Professor

| | Funcionalidade |
|---|---|
| 🏫 | Gerenciamento de turmas com visão de desempenho |
| ➕ | Criação e publicação de atividades para múltiplas turmas |
| 🔢 | Lançamento de notas: sistema numérico e por menção/objetivos |
| ✅ | Fila de correção de entregas com feedback por aluno |
| 📢 | Publicação de avisos e materiais no mural da turma |

### 📊 Coordenador

| | Funcionalidade |
|---|---|
| 📈 | Analytics de desempenho por turma e disciplina |
| ⚠️ | Lista de alunos em risco com acesso rápido |
| 📉 | Gráficos de distribuição de notas e evolução mensal |
| 🏫 | Visão consolidada de todas as turmas da escola |

### 👨‍👩‍👧 Responsável

| | Funcionalidade |
|---|---|
| 👀 | Acompanhamento em tempo real do desempenho dos filhos |
| 📊 | Boletim detalhado por disciplina com histórico bimestral |
| 📅 | Frequência por matéria com alertas de mínimo |
| 📋 | Lista de atividades pendentes, próximas e atrasadas |

### ⚙️ Administrador

| | Funcionalidade |
|---|---|
| 🏫 | Gerenciamento de múltiplas escolas (multi-tenant) |
| ➕ | Cadastro de novas escolas com plano e status |
| 📊 | Dashboard com KPIs consolidados de toda a plataforma |
| 👥 | Visão de usuários e turmas por escola |

### 🌐 Recursos Gerais

| | Funcionalidade |
|---|---|
| 🔐 | Autenticação real via Supabase Auth + JWT com sessão persistente |
| 🌍 | Internacionalização: Português, Inglês e Espanhol |
| 🔔 | Sistema de notificações em tempo real (painel lateral) |
| 💬 | Mensagens diretas entre usuários |
| 🎨 | Personalização de perfil: foto, cor do avatar, senha |
| 📱 | Design responsivo (mobile-first) |
| 🌙 | Barra lateral colapsável com navegação por papel |

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
| Runtime | Node.js 18+ + Express |
| Linguagem | TypeScript (tsx) |
| Banco de dados | PostgreSQL via Supabase |
| Autenticação | Supabase Auth + JWT |
| Cliente DB | Supabase JS Client |

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- Conta gratuita no [Supabase](https://supabase.com)

### 1. Clone o repositório

```bash
git clone https://github.com/Kenkyoh/Vekta.git
cd Vekta
```

### 2. Configure o frontend

```bash
npm install
cp .env.example .env
# Edite .env → VITE_API_URL=http://localhost:3001
```

### 3. Configure o backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com sua URL e service_role key do Supabase
```

> As variáveis necessárias estão documentadas em `backend/.env.example`.

### 4. Configure o banco de dados

Execute os arquivos SQL **em ordem** no SQL Editor do Supabase:

```
backend/supabase/01_schema.sql           # Tabelas, enums e triggers
backend/supabase/02_demo_seed.sql        # Usuários de demonstração
backend/supabase/03_classes_subjects.sql # Estrutura de turmas e disciplinas
backend/supabase/04_classes_seed.sql     # Dados de exemplo
backend/supabase/05_activities.sql       # Atividades
```

### 5. Inicie os servidores

```bash
# Terminal 1 — backend (porta 3001)
cd backend && npm run dev

# Terminal 2 — frontend (porta 5173)
npm run dev
```

Acesse **http://localhost:5173**.

### Comandos úteis

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
│   │   ├── types/         # Interfaces TypeScript
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
    ├── i18n/              # Traduções PT / EN / ES
    ├── types/             # Tipos TypeScript globais
    └── utils/             # Formatação de notas, labels de papéis
```

---

## Suporte e Customização

Adquiriu o Vekta e precisa de ajuda com a instalação, configuração ou customização?

Entre em contato pelo e-mail de suporte:

📧 **suporte@vekta.app**

O suporte cobre:

- ✅ Dúvidas de instalação e configuração do ambiente
- ✅ Orientação para conexão com o Supabase
- ✅ Esclarecimentos sobre a estrutura do código
- ✅ Pequenas customizações de texto, cores e layout

> Customizações avançadas (novas funcionalidades, integrações externas, white-label) são orçadas separadamente.

---

## Licença

MIT © [Luiz Felipe Scaramuzza](https://github.com/Kenkyoh)
