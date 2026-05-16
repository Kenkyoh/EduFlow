# EduFlow

Plataforma educacional unificada construída com React + TypeScript. Reúne alunos, professores, coordenadores, responsáveis e administradores em um único sistema — cada perfil com sua própria visão e funcionalidades.

> Projeto de portfólio / protótipo front-end com dados mockados.

---

## Demonstração rápida

Acesse qualquer perfil com um clique na tela de login:

| Perfil | E-mail | Acesso a |
|---|---|---|
| Aluno | `lucas@escola.eduflow.app` | Turmas, atividades, boletim, calendário |
| Professor | `ana.lima@escola.eduflow.app` | Turmas, lançamento de notas, correção |
| Coordenador | `carlos.santos@escola.eduflow.app` | Analytics, visão geral das turmas |
| Responsável | `fernanda.mendes@gmail.com` | Desempenho, frequência e atividades dos filhos |
| Admin | `admin@eduflow.app` | Gerenciar todas as escolas da plataforma |

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
- Sistema de notificações em tempo real (painel lateral)
- Mensagens diretas entre usuários
- Personalização de perfil: foto, cor do avatar, senha
- Barra lateral colapsável com navegação por papel
- Design responsivo

---

## Stack

| Categoria | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Estilização | Tailwind CSS 3 |
| Roteamento | React Router v6 |
| Estado global | Zustand |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Utilitários | clsx, date-fns |

---

## Rodando localmente

```bash
# 1. Clone o repositório
git clone https://github.com/Kenkyoh/EduFlow.git
cd EduFlow

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** no navegador.

### Outros comandos

```bash
npm run build    # Build de produção
npm run preview  # Prévia do build
```

---

## Estrutura do projeto

```
src/
├── components/        # Componentes compartilhados
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Layout.tsx
│   ├── UserAvatar.tsx
│   ├── Toast.tsx
│   └── NotificationsPanel.tsx
├── pages/
│   ├── student/       # Páginas do aluno
│   ├── teacher/       # Páginas do professor
│   ├── coordinator/   # Páginas do coordenador
│   ├── guardian/      # Páginas do responsável
│   ├── admin/         # Páginas do administrador
│   ├── Login.tsx
│   ├── Profile.tsx
│   ├── Messages.tsx
│   ├── Calendar.tsx
│   └── Settings.tsx
├── store/             # Estado global (Zustand)
│   ├── auth.ts
│   ├── grades.ts
│   └── notifications.ts
├── data/
│   └── mock.ts        # Dados simulados
├── types/
│   └── index.ts       # Tipos TypeScript
└── utils/
    ├── roleLabels.ts
    └── gradeFormat.ts
```

---

## Licença

MIT © [Luiz Felipe Scaramuzza](https://github.com/Kenkyoh)
