import type {
  User, Subject, Assessment, StudentGrades, Activity,
  Conversation, Notification, CalendarEvent, ClassInfo,
  Submission, AnnouncementPost, MencaoValue, ObjetivoBimestral,
  StudentMencaoGrade, ReportCardSubjectData, School,
} from '../types'

export const MENCAO_SCORES: Record<MencaoValue, number> = { PA: 2, AC: 1.5, A: 1, P: 0.5, N: 0 }
export const MENCAO_ORDER: MencaoValue[] = ['PA', 'AC', 'A', 'P', 'N']

export const MENCAO_COLORS: Record<MencaoValue, { bg: string; text: string; label: string }> = {
  PA: { bg: '#DCFCE7', text: '#166534', label: 'Plenamente Atingido' },
  AC: { bg: '#DBEAFE', text: '#1E40AF', label: 'Atingido Com Apoio' },
  A:  { bg: '#FEF9C3', text: '#854D0E', label: 'Atingido' },
  P:  { bg: '#FFEDD5', text: '#9A3412', label: 'Parcialmente Atingido' },
  N:  { bg: '#FEE2E2', text: '#991B1B', label: 'Não Atingido' },
}

export const SUBJECT_COLORS: { color: string; colorLight: string; name: string }[] = [
  { color: '#1E3A8A', colorLight: '#EFF6FF', name: 'Azul' },
  { color: '#7C3AED', colorLight: '#F5F3FF', name: 'Roxo' },
  { color: '#059669', colorLight: '#ECFDF5', name: 'Verde' },
  { color: '#DC2626', colorLight: '#FEF2F2', name: 'Vermelho' },
  { color: '#D97706', colorLight: '#FFFBEB', name: 'Âmbar' },
  { color: '#0891B2', colorLight: '#ECFEFF', name: 'Ciano' },
  { color: '#DB2777', colorLight: '#FDF2F8', name: 'Rosa' },
  { color: '#65A30D', colorLight: '#F7FEE7', name: 'Lima' },
  { color: '#EA580C', colorLight: '#FFF7ED', name: 'Laranja' },
  { color: '#0284C7', colorLight: '#F0F9FF', name: 'Azul-claro' },
  { color: '#9333EA', colorLight: '#FAF5FF', name: 'Violeta' },
  { color: '#047857', colorLight: '#ECFDF5', name: 'Esmeralda' },
]

export const mockUsers: User[] = [
  {
    id: 'student-1',
    name: 'Lucas Mendes',
    email: 'lucas@escola.vekta.app',
    role: 'student',
    institution: 'Colégio Estadual São Paulo',
    schoolId: 'school-1',
  },
  {
    id: 'teacher-1',
    name: 'Profa. Ana Lima',
    email: 'ana.lima@escola.vekta.app',
    role: 'teacher',
    institution: 'Colégio Estadual São Paulo',
    schoolId: 'school-1',
  },
  {
    id: 'coordinator-1',
    name: 'Dir. Carlos Santos',
    email: 'carlos.santos@escola.vekta.app',
    role: 'coordinator',
    institution: 'Colégio Estadual São Paulo',
    schoolId: 'school-1',
  },
  {
    id: 'student-2',
    name: 'Maria Silva',
    email: 'maria@escola.vekta.app',
    role: 'student',
    institution: 'Colégio Estadual São Paulo',
    schoolId: 'school-1',
  },
  {
    id: 'guardian-1',
    name: 'Sra. Fernanda Mendes',
    email: 'fernanda.mendes@gmail.com',
    role: 'guardian',
    institution: 'Colégio Estadual São Paulo',
    schoolId: 'school-1',
    studentIds: ['student-1'],
  },
  {
    id: 'admin-1',
    name: 'Admin Vekta',
    email: 'admin@vekta.app',
    role: 'admin',
    institution: 'Vekta',
  },
]

export const mockSchools: School[] = [
  {
    id: 'school-1',
    name: 'Colégio Estadual São Paulo',
    city: 'São Paulo',
    state: 'SP',
    plan: 'premium',
    status: 'active',
    createdAt: '2023-02-15',
    studentsCount: 420,
    teachersCount: 32,
    classesCount: 18,
    coordinatorName: 'Dir. Carlos Santos',
    coordinatorEmail: 'carlos.santos@escola.vekta.app',
  },
  {
    id: 'school-2',
    name: 'Escola Municipal Rio de Janeiro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    plan: 'standard',
    status: 'active',
    createdAt: '2023-08-20',
    studentsCount: 285,
    teachersCount: 21,
    classesCount: 12,
    coordinatorName: 'Dir. Fernanda Costa',
    coordinatorEmail: 'fernanda.costa@rj.vekta.app',
  },
  {
    id: 'school-3',
    name: 'Colégio Particular Belo Horizonte',
    city: 'Belo Horizonte',
    state: 'MG',
    plan: 'premium',
    status: 'active',
    createdAt: '2024-01-10',
    studentsCount: 560,
    teachersCount: 45,
    classesCount: 24,
    coordinatorName: 'Dir. Ricardo Alves',
    coordinatorEmail: 'ricardo.alves@bh.vekta.app',
  },
  {
    id: 'school-4',
    name: 'Centro Educacional Curitiba',
    city: 'Curitiba',
    state: 'PR',
    plan: 'basic',
    status: 'trial',
    createdAt: '2024-04-01',
    studentsCount: 95,
    teachersCount: 8,
    classesCount: 4,
    coordinatorName: 'Dir. Patricia Lima',
    coordinatorEmail: 'patricia.lima@cwb.vekta.app',
  },
  {
    id: 'school-5',
    name: 'Instituto Educacional Salvador',
    city: 'Salvador',
    state: 'BA',
    plan: 'standard',
    status: 'inactive',
    createdAt: '2023-05-12',
    studentsCount: 0,
    teachersCount: 0,
    classesCount: 0,
  },
]

export const mockSubjects: Subject[] = [
  { id: 'mat', name: 'Matemática', color: '#1E3A8A', colorLight: '#EFF6FF', teacher: 'Profa. Ana Lima', teacherId: 'teacher-1' },
  { id: 'port', name: 'Português', color: '#7C3AED', colorLight: '#F5F3FF', teacher: 'Prof. Roberto Souza', teacherId: 'teacher-2' },
  { id: 'hist', name: 'História', color: '#DC2626', colorLight: '#FEF2F2', teacher: 'Profa. Juliana Costa', teacherId: 'teacher-3' },
  { id: 'bio', name: 'Biologia', color: '#059669', colorLight: '#ECFDF5', teacher: 'Prof. Felipe Alves', teacherId: 'teacher-4' },
  { id: 'fis', name: 'Física', color: '#D97706', colorLight: '#FFFBEB', teacher: 'Prof. Eduardo Nunes', teacherId: 'teacher-5' },
  { id: 'quim', name: 'Química', color: '#0891B2', colorLight: '#ECFEFF', teacher: 'Profa. Carla Mendes', teacherId: 'teacher-6' },
  { id: 'geo', name: 'Geografia', color: '#65A30D', colorLight: '#F7FEE7', teacher: 'Prof. Thiago Rocha', teacherId: 'teacher-7' },
  { id: 'ing', name: 'Inglês', color: '#DB2777', colorLight: '#FDF2F8', teacher: 'Profa. Sandra Lima', teacherId: 'teacher-8' },
]

export const mockAssessments: Assessment[] = [
  { id: 'p1', name: 'Prova 1', weight: 40, maxScore: 10, type: 'prova' },
  { id: 'trab1', name: 'Trabalho', weight: 30, maxScore: 10, type: 'trabalho' },
  { id: 'part', name: 'Participação', weight: 30, maxScore: 10, type: 'participacao' },
]

export const mockStudentGrades: StudentGrades[] = [
  {
    studentId: 'student-1',
    studentName: 'Lucas Mendes',
    grades: [
      { assessmentId: 'p1', score: 8.0 },
      { assessmentId: 'trab1', score: 7.5 },
      { assessmentId: 'part', score: 9.0 },
    ],
    average: 8.1,
    status: 'approved',
  },
  {
    studentId: 'student-2',
    studentName: 'Maria Silva',
    grades: [
      { assessmentId: 'p1', score: 5.5 },
      { assessmentId: 'trab1', score: 6.0 },
      { assessmentId: 'part', score: 7.0 },
    ],
    average: 6.1,
    status: 'approved',
  },
  {
    studentId: 'student-3',
    studentName: 'Pedro Oliveira',
    grades: [
      { assessmentId: 'p1', score: 4.0 },
      { assessmentId: 'trab1', score: 5.0 },
      { assessmentId: 'part', score: 5.5 },
    ],
    average: 4.7,
    status: 'recovery',
  },
  {
    studentId: 'student-4',
    studentName: 'Ana Rodrigues',
    grades: [
      { assessmentId: 'p1', score: 9.5 },
      { assessmentId: 'trab1', score: 9.0 },
      { assessmentId: 'part', score: 10.0 },
    ],
    average: 9.5,
    status: 'approved',
  },
  {
    studentId: 'student-5',
    studentName: 'Bruno Santos',
    grades: [
      { assessmentId: 'p1', score: 3.0 },
      { assessmentId: 'trab1', score: null },
      { assessmentId: 'part', score: 4.0 },
    ],
    average: 3.5,
    status: 'failed',
  },
  {
    studentId: 'student-6',
    studentName: 'Carla Ferreira',
    grades: [
      { assessmentId: 'p1', score: 7.5 },
      { assessmentId: 'trab1', score: 8.0 },
      { assessmentId: 'part', score: null },
    ],
    average: 7.7,
    status: 'pending',
    inactive: true,
  },
  {
    studentId: 'student-7',
    studentName: 'Diego Nascimento',
    grades: [
      { assessmentId: 'p1', score: 6.0 },
      { assessmentId: 'trab1', score: 7.0 },
      { assessmentId: 'part', score: 8.0 },
    ],
    average: 6.9,
    status: 'approved',
  },
  {
    studentId: 'student-8',
    studentName: 'Elisa Pinto',
    grades: [
      { assessmentId: 'p1', score: 8.5 },
      { assessmentId: 'trab1', score: 7.0 },
      { assessmentId: 'part', score: 9.0 },
    ],
    average: 8.2,
    status: 'approved',
  },
]

const today = new Date()
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
const in3Days = new Date(today); in3Days.setDate(today.getDate() + 3)
const in7Days = new Date(today); in7Days.setDate(today.getDate() + 7)
const in14Days = new Date(today); in14Days.setDate(today.getDate() + 14)
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
const in2Days = new Date(today); in2Days.setDate(today.getDate() + 2)

const fmt = (d: Date) => d.toISOString().split('T')[0]

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Prova Bimestral — Funções do 2º Grau',
    subjectId: 'mat',
    subjectName: 'Matemática',
    subjectColor: '#1E3A8A',
    type: 'prova',
    dueDate: `${fmt(in3Days)}T10:00:00`,
    startDate: `${fmt(in3Days)}T08:00:00`,
    weight: 40,
    classIds: ['turma-a'],
    classNames: ['3º Ano A'],
    status: 'upcoming',
    submissionsCount: 0,
    totalStudents: 28,
    published: true,
  },
  {
    id: 'act-2',
    title: 'Trabalho — Análise Literária: Machado de Assis',
    subjectId: 'port',
    subjectName: 'Português',
    subjectColor: '#7C3AED',
    type: 'trabalho',
    dueDate: `${fmt(tomorrow)}T23:59:00`,
    startDate: `${fmt(yesterday)}T00:00:00`,
    weight: 30,
    classIds: ['turma-a'],
    classNames: ['3º Ano A'],
    status: 'pending',
    submissionsCount: 12,
    totalStudents: 28,
    allowResubmit: true,
    maxAttempts: 2,
    published: true,
  },
  {
    id: 'act-3',
    title: 'Relatório de Experimento — Mitose',
    subjectId: 'bio',
    subjectName: 'Biologia',
    subjectColor: '#059669',
    type: 'trabalho',
    dueDate: `${fmt(in7Days)}T18:00:00`,
    startDate: `${fmt(today)}T00:00:00`,
    weight: 25,
    classIds: ['turma-a'],
    classNames: ['3º Ano A'],
    status: 'upcoming',
    submissionsCount: 0,
    totalStudents: 28,
    published: true,
  },
  {
    id: 'act-4',
    title: 'Apresentação — Revolução Industrial',
    subjectId: 'hist',
    subjectName: 'História',
    subjectColor: '#DC2626',
    type: 'apresentacao',
    dueDate: `${fmt(in14Days)}T14:00:00`,
    startDate: `${fmt(in7Days)}T00:00:00`,
    weight: 35,
    classIds: ['turma-a'],
    classNames: ['3º Ano A'],
    status: 'upcoming',
    submissionsCount: 0,
    totalStudents: 28,
    published: true,
  },
  {
    id: 'act-5',
    title: 'Lista de Exercícios — Termodinâmica',
    subjectId: 'fis',
    subjectName: 'Física',
    subjectColor: '#D97706',
    type: 'trabalho',
    dueDate: `${fmt(yesterday)}T23:59:00`,
    startDate: `${fmt(yesterday)}T00:00:00`,
    weight: 20,
    classIds: ['turma-a'],
    classNames: ['3º Ano A'],
    status: 'late',
    submissionsCount: 20,
    totalStudents: 28,
    published: true,
  },
  {
    id: 'act-6',
    title: 'Questionário Online — Estequiometria',
    subjectId: 'quim',
    subjectName: 'Química',
    subjectColor: '#0891B2',
    type: 'outro',
    dueDate: `${fmt(in2Days)}T20:00:00`,
    startDate: `${fmt(today)}T00:00:00`,
    weight: 15,
    classIds: ['turma-a', 'turma-b'],
    classNames: ['3º Ano A', '3º Ano B'],
    status: 'pending',
    submissionsCount: 5,
    totalStudents: 28,
    published: true,
  },
]

export const mockMencaoObjetivos: ObjetivoBimestral[] = [
  { id: 'obj-1', subjectId: 'bio', order: 1, title: 'Identificar estruturas celulares', description: 'Reconhecer e nomear as principais organelas e suas funções nas células eucarióticas e procarióticas' },
  { id: 'obj-2', subjectId: 'bio', order: 2, title: 'Compreender o processo de mitose', description: 'Descrever as fases da mitose e explicar a importância da divisão celular para crescimento e reparo dos organismos' },
  { id: 'obj-3', subjectId: 'bio', order: 3, title: 'Relacionar DNA e síntese proteica', description: 'Explicar o fluxo da informação genética do DNA até a produção de proteínas (transcrição e tradução)' },
  { id: 'obj-4', subjectId: 'bio', order: 4, title: 'Aplicar genética mendeliana', description: 'Resolver problemas de cruzamentos genéticos utilizando as Leis de Mendel (dominância, segregação e combinação independente)' },
  { id: 'obj-5', subjectId: 'bio', order: 5, title: 'Analisar relações ecológicas', description: 'Identificar e classificar as principais relações intra e interespecíficas nos ecossistemas e seus impactos' },
]

function calcMencaoTotal(grades: { objectiveId: string; value: MencaoValue | null }[]): number {
  return Math.round(grades.reduce((acc, g) => acc + (g.value !== null ? MENCAO_SCORES[g.value!] : 0), 0) * 10) / 10
}

function mencaoStatus(total: number, hasNull: boolean): StudentMencaoGrade['status'] {
  if (hasNull && total === 0) return 'pending'
  if (total >= 6) return 'approved'
  if (total >= 4) return 'recovery'
  return 'failed'
}

function makeMencaoGrades(
  studentId: string,
  studentName: string,
  values: (MencaoValue | null)[],
  inactive?: boolean
): StudentMencaoGrade {
  const grades = mockMencaoObjetivos.map((obj, i) => ({ objectiveId: obj.id, value: values[i] ?? null }))
  const total = calcMencaoTotal(grades)
  const hasNull = values.some(v => v === null)
  return { studentId, studentName, grades, total, status: mencaoStatus(total, hasNull), inactive }
}

export const mockMencaoStudentGrades: StudentMencaoGrade[] = [
  makeMencaoGrades('student-1', 'Lucas Mendes',     ['PA', 'AC', 'PA', 'A',  'AC']),       // 2+1.5+2+1+1.5 = 8.0
  makeMencaoGrades('student-2', 'Maria Silva',      ['A',  'AC', 'A',  'P',  'A' ]),       // 1+1.5+1+0.5+1 = 5.0
  makeMencaoGrades('student-3', 'Pedro Oliveira',   ['P',  'N',  'P',  'N',  'P' ]),       // 0.5+0+0.5+0+0.5 = 1.5
  makeMencaoGrades('student-4', 'Ana Rodrigues',    ['PA', 'PA', 'PA', 'AC', 'PA']),       // 2+2+2+1.5+2 = 9.5
  makeMencaoGrades('student-5', 'Bruno Santos',     ['N',  'P',  'N',  'N',  'P' ]),       // 0+0.5+0+0+0.5 = 1.0
  makeMencaoGrades('student-6', 'Carla Ferreira',   ['AC', 'A',  'AC', 'A',  null], true), // pending (inactive)
  makeMencaoGrades('student-7', 'Diego Nascimento', ['A',  'AC', 'A',  'AC', 'A' ]),       // 1+1.5+1+1.5+1 = 6.0
  makeMencaoGrades('student-8', 'Elisa Pinto',      ['PA', 'AC', 'PA', 'A',  'A' ]),       // 2+1.5+2+1+1 = 7.5
]

export const mockClasses: ClassInfo[] = [
  {
    id: 'turma-a',
    name: '3º Ano A',
    subjectId: 'mat',
    subjectName: 'Matemática',
    color: '#1E3A8A',
    colorLight: '#EFF6FF',
    teacher: 'Profa. Ana Lima',
    teacherId: 'teacher-1',
    studentsCount: 28,
    year: '2024',
    period: '2º Bimestre',
    deliveryRate: 82,
  },
  {
    id: 'turma-b',
    name: '3º Ano B',
    subjectId: 'mat',
    subjectName: 'Matemática',
    color: '#1E3A8A',
    colorLight: '#EFF6FF',
    teacher: 'Profa. Ana Lima',
    teacherId: 'teacher-1',
    studentsCount: 31,
    year: '2024',
    period: '2º Bimestre',
    deliveryRate: 71,
  },
  {
    id: 'turma-c',
    name: '2º Ano A',
    subjectId: 'mat',
    subjectName: 'Matemática',
    color: '#1E3A8A',
    colorLight: '#EFF6FF',
    teacher: 'Profa. Ana Lima',
    teacherId: 'teacher-1',
    studentsCount: 25,
    year: '2024',
    period: '2º Bimestre',
    deliveryRate: 91,
  },
  {
    id: 'turma-d',
    name: '3º Ano A',
    subjectId: 'bio',
    subjectName: 'Biologia',
    color: '#059669',
    colorLight: '#ECFDF5',
    teacher: 'Prof. Felipe Alves',
    teacherId: 'teacher-4',
    studentsCount: 28,
    year: '2024',
    period: '2º Bimestre',
    deliveryRate: 88,
    gradingType: 'mencao',
  },
]

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Prova — Funções do 2º Grau',
    subjectId: 'mat',
    subjectName: 'Matemática',
    color: '#1E3A8A',
    colorLight: '#EFF6FF',
    type: 'prova',
    date: fmt(in3Days),
  },
  {
    id: 'ev-2',
    title: 'Entrega — Análise Literária',
    subjectId: 'port',
    subjectName: 'Português',
    color: '#7C3AED',
    colorLight: '#F5F3FF',
    type: 'trabalho',
    date: fmt(tomorrow),
  },
  {
    id: 'ev-3',
    title: 'Relatório — Mitose',
    subjectId: 'bio',
    subjectName: 'Biologia',
    color: '#059669',
    colorLight: '#ECFDF5',
    type: 'trabalho',
    date: fmt(in7Days),
  },
  {
    id: 'ev-4',
    title: 'Apresentação — Rev. Industrial',
    subjectId: 'hist',
    subjectName: 'História',
    color: '#DC2626',
    colorLight: '#FEF2F2',
    type: 'apresentacao',
    date: fmt(in14Days),
  },
  {
    id: 'ev-5',
    title: 'Questionário — Estequiometria',
    subjectId: 'quim',
    subjectName: 'Química',
    color: '#0891B2',
    colorLight: '#ECFEFF',
    type: 'outro',
    date: fmt(in2Days),
  },
  {
    id: 'ev-6',
    title: 'Aula ao Vivo — Geometria Espacial',
    subjectId: 'mat',
    subjectName: 'Matemática',
    color: '#1E3A8A',
    colorLight: '#EFF6FF',
    type: 'aula_ao_vivo',
    date: fmt(today),
  },
]

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'teacher-1',
    participantName: 'Profa. Ana Lima',
    participantRole: 'teacher',
    lastMessage: 'Sua nota da prova foi lançada. Qualquer dúvida sobre o feedback, pode perguntar.',
    lastMessageTime: '10:42',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        senderId: 'student-1',
        senderName: 'Lucas Mendes',
        content: 'Professora, quando sai o resultado da P1?',
        timestamp: '2024-05-10T09:30:00',
        read: true,
      },
      {
        id: 'msg-2',
        senderId: 'teacher-1',
        senderName: 'Profa. Ana Lima',
        content: 'Sua nota da prova foi lançada. Qualquer dúvida sobre o feedback, pode perguntar.',
        timestamp: '2024-05-10T10:42:00',
        read: false,
      },
    ],
  },
  {
    id: 'conv-2',
    participantId: 'teacher-2',
    participantName: 'Prof. Roberto Souza',
    participantRole: 'teacher',
    lastMessage: 'O trabalho foi recebido. Obrigado!',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-3',
        senderId: 'student-1',
        senderName: 'Lucas Mendes',
        content: 'Prof, enviei o trabalho. Chegou tudo certo?',
        timestamp: '2024-05-09T18:00:00',
        read: true,
      },
      {
        id: 'msg-4',
        senderId: 'teacher-2',
        senderName: 'Prof. Roberto Souza',
        content: 'O trabalho foi recebido. Obrigado!',
        timestamp: '2024-05-09T19:15:00',
        read: true,
      },
    ],
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'grade',
    title: 'Nota lançada',
    body: 'Sua nota da Prova 1 de Matemática foi lançada: 8,0',
    source: 'Matemática — 3º Ano A',
    timestamp: '10 min atrás',
    read: false,
    actionLabel: 'Ver boletim',
    actionPath: '/student/report-card',
  },
  {
    id: 'notif-2',
    type: 'deadline',
    title: 'Entrega amanhã',
    body: 'Trabalho de Português — Análise Literária vence amanhã às 23h59',
    source: 'Português — 3º Ano A',
    timestamp: '1 hora atrás',
    read: false,
    actionLabel: 'Entregar',
    actionPath: '/student/submit/act-2',
  },
  {
    id: 'notif-3',
    type: 'announcement',
    title: 'Novo aviso no mural',
    body: 'Profa. Ana Lima publicou um aviso em Matemática: "Material de apoio para a prova"',
    source: 'Matemática — 3º Ano A',
    timestamp: '3 horas atrás',
    read: false,
    actionLabel: 'Ver aviso',
    actionPath: '/class/turma-a',
  },
  {
    id: 'notif-4',
    type: 'message',
    title: 'Nova mensagem',
    body: 'Profa. Ana Lima enviou uma mensagem para você',
    source: 'Mensagens diretas',
    timestamp: 'Ontem',
    read: true,
    actionLabel: 'Responder',
    actionPath: '/messages',
  },
  {
    id: 'notif-5',
    type: 'deadline',
    title: 'Atividade atrasada',
    body: 'A Lista de Exercícios de Física não foi entregue no prazo',
    source: 'Física — 3º Ano A',
    timestamp: '2 dias atrás',
    read: true,
  },
]

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    activityId: 'act-2',
    activityTitle: 'Trabalho — Análise Literária: Machado de Assis',
    studentId: 'student-2',
    studentName: 'Maria Silva',
    submittedAt: '2024-05-10T14:30:00',
    attempt: 1,
    files: [
      { name: 'analise_literaria_maria.pdf', size: '2.4 MB', type: 'pdf' },
    ],
    status: 'submitted',
  },
  {
    id: 'sub-2',
    activityId: 'act-2',
    activityTitle: 'Trabalho — Análise Literária: Machado de Assis',
    studentId: 'student-3',
    studentName: 'Pedro Oliveira',
    submittedAt: '2024-05-09T22:45:00',
    attempt: 1,
    content: 'Nesta análise, examino a obra Dom Casmurro de Machado de Assis, com foco na narrativa em primeira pessoa e a questão da confiabilidade do narrador Bentinho...',
    status: 'submitted',
  },
  {
    id: 'sub-3',
    activityId: 'act-2',
    activityTitle: 'Trabalho — Análise Literária: Machado de Assis',
    studentId: 'student-4',
    studentName: 'Ana Rodrigues',
    submittedAt: '2024-05-08T16:20:00',
    attempt: 2,
    files: [
      { name: 'ana_machado_assis_v2.docx', size: '1.8 MB', type: 'docx' },
    ],
    grade: 9.5,
    feedback: 'Excelente análise! Argumentação muito bem estruturada. Destaque para a seção sobre ironia machadiana.',
    status: 'graded',
  },
]

export const mockAnnouncements: AnnouncementPost[] = [
  {
    id: 'ann-1',
    type: 'aviso',
    title: 'Material de apoio para a Prova 1',
    content: 'Disponibilizei um resumo completo dos tópicos cobrados na prova: funções quadráticas, discriminante, gráfico da parábola e aplicações. Acesse na aba Materiais.',
    author: 'Profa. Ana Lima',
    authorRole: 'teacher',
    timestamp: '3 horas atrás',
    viewCount: 18,
    attachments: [{ name: 'resumo_funcoes.pdf', size: '1.2 MB' }],
  },
  {
    id: 'ann-2',
    type: 'enquete',
    title: 'Qual horário preferem para revisão?',
    content: 'Vou agendar uma aula de revisão antes da prova. Qual horário fica melhor?',
    author: 'Profa. Ana Lima',
    authorRole: 'teacher',
    timestamp: '1 dia atrás',
    pollOptions: [
      { text: 'Sexta às 14h', votes: 12 },
      { text: 'Sábado às 9h', votes: 8 },
      { text: 'Segunda às 7h', votes: 5 },
      { text: 'Não preciso de revisão', votes: 3 },
    ],
  },
  {
    id: 'ann-3',
    type: 'urgente',
    title: 'ATENÇÃO: Sala de prova alterada',
    content: 'A Prova 1 de Matemática será realizada no Laboratório de Informática (Sala 12) e não na sala de aula habitual. Tragam os materiais permitidos.',
    author: 'Profa. Ana Lima',
    authorRole: 'teacher',
    timestamp: '2 horas atrás',
    urgent: true,
  },
  {
    id: 'ann-4',
    type: 'material',
    title: 'Videoaula: Discriminante e Natureza das Raízes',
    content: 'Postei uma videoaula explicando o discriminante (Δ) e como usá-lo para determinar a natureza das raízes. Duração: 22 minutos.',
    author: 'Profa. Ana Lima',
    authorRole: 'teacher',
    timestamp: '3 dias atrás',
    estimatedTime: '22 min',
    viewCount: 24,
  },
]

export const mockReportCardData: ReportCardSubjectData[] = [
  {
    subjectId: 'mat',
    subjectName: 'Matemática',
    teacher: 'Profa. Ana Lima',
    color: '#1E3A8A',
    colorLight: '#EFF6FF',
    assessments: [
      { name: 'Prova 1', weight: 40, score: 8.0 },
      { name: 'Trabalho', weight: 30, score: 7.5 },
      { name: 'Participação', weight: 30, score: 9.0 },
    ],
    average: 8.1,
    status: 'approved' as const,
    attendance: 92,
    history: [6.5, 7.0, 8.1],
  },
  {
    subjectId: 'port',
    subjectName: 'Português',
    teacher: 'Prof. Roberto Souza',
    color: '#7C3AED',
    colorLight: '#F5F3FF',
    assessments: [
      { name: 'Prova 1', weight: 40, score: 7.0 },
      { name: 'Trabalho', weight: 30, score: 8.5 },
      { name: 'Participação', weight: 30, score: 7.5 },
    ],
    average: 7.6,
    status: 'approved' as const,
    attendance: 88,
    history: [6.0, 7.0, 7.6],
  },
  {
    subjectId: 'hist',
    subjectName: 'História',
    teacher: 'Profa. Juliana Costa',
    color: '#DC2626',
    colorLight: '#FEF2F2',
    assessments: [
      { name: 'Prova 1', weight: 40, score: 5.5 },
      { name: 'Apresentação', weight: 40, score: 6.0 },
      { name: 'Participação', weight: 20, score: 7.0 },
    ],
    average: 6.0,
    status: 'recovery' as const,
    attendance: 75,
    history: [4.5, 5.5, 6.0],
  },
  {
    subjectId: 'bio',
    subjectName: 'Biologia',
    teacher: 'Prof. Felipe Alves',
    color: '#059669',
    colorLight: '#ECFDF5',
    gradingType: 'mencao',
    mencaoObjectives: [
      { id: 'obj-1', title: 'Identificar estruturas celulares', value: 'PA' },
      { id: 'obj-2', title: 'Compreender o processo de mitose', value: 'AC' },
      { id: 'obj-3', title: 'Relacionar DNA e síntese proteica', value: 'PA' },
      { id: 'obj-4', title: 'Aplicar genética mendeliana', value: 'A' },
      { id: 'obj-5', title: 'Analisar relações ecológicas', value: 'AC' },
    ],
    average: 8.0,
    status: 'approved',
    attendance: 96,
    history: [7.5, 8.0, 8.0],
  },
  {
    subjectId: 'fis',
    subjectName: 'Física',
    teacher: 'Prof. Eduardo Nunes',
    color: '#D97706',
    colorLight: '#FFFBEB',
    assessments: [
      { name: 'Prova 1', weight: 40, score: 4.0 },
      { name: 'Lista', weight: 30, score: 5.0 },
      { name: 'Participação', weight: 30, score: 6.0 },
    ],
    average: 4.9,
    status: 'recovery' as const,
    attendance: 80,
    history: [5.5, 4.5, 4.9],
  },
]

export const mockCoordinatorClasses = [
  {
    id: 'coord-turma-1a',
    name: '1º Ano A',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Prof. Eduardo Nunes',
    subject: 'Física',
    color: '#D97706',
    colorLight: '#FFFBEB',
    studentsCount: 32,
    deliveryRate: 83,
    average: 7.1,
    atRisk: 2,
  },
  {
    id: 'coord-turma-1b',
    name: '1º Ano B',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Prof. Eduardo Nunes',
    subject: 'Física',
    color: '#D97706',
    colorLight: '#FFFBEB',
    studentsCount: 29,
    deliveryRate: 76,
    average: 6.8,
    atRisk: 4,
  },
  {
    id: 'coord-turma-2a',
    name: '2º Ano A',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Profa. Juliana Costa',
    subject: 'História',
    color: '#DC2626',
    colorLight: '#FEF2F2',
    studentsCount: 25,
    deliveryRate: 91,
    average: 7.4,
    atRisk: 1,
  },
  {
    id: 'coord-turma-2b',
    name: '2º Ano B',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Prof. Thiago Rocha',
    subject: 'Geografia',
    color: '#65A30D',
    colorLight: '#F7FEE7',
    studentsCount: 30,
    deliveryRate: 69,
    average: 6.5,
    atRisk: 6,
  },
  {
    id: 'coord-turma-3a',
    name: '3º Ano A',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Profa. Ana Lima',
    subject: 'Matemática',
    color: '#1E3A8A',
    colorLight: '#EFF6FF',
    studentsCount: 28,
    deliveryRate: 82,
    average: 7.8,
    atRisk: 3,
  },
  {
    id: 'coord-turma-3b',
    name: '3º Ano B',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Prof. Roberto Souza',
    subject: 'Português',
    color: '#7C3AED',
    colorLight: '#F5F3FF',
    studentsCount: 31,
    deliveryRate: 71,
    average: 7.0,
    atRisk: 4,
  },
  {
    id: 'coord-turma-1c',
    name: '1º Ano C',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Profa. Carla Mendes',
    subject: 'Química',
    color: '#0891B2',
    colorLight: '#ECFEFF',
    studentsCount: 27,
    deliveryRate: 88,
    average: 7.6,
    atRisk: 2,
  },
  {
    id: 'coord-turma-2c',
    name: '2º Ano C',
    year: '2024',
    period: '2º Bimestre',
    teacher: 'Profa. Sandra Lima',
    subject: 'Inglês',
    color: '#DB2777',
    colorLight: '#FDF2F8',
    studentsCount: 24,
    deliveryRate: 95,
    average: 8.2,
    atRisk: 0,
  },
]

export const mockCoordinatorData = {
  kpis: {
    generalAverage: 7.2,
    deliveryRate: 78,
    atRiskStudents: 14,
    attendance: 86,
    changes: {
      generalAverage: +0.3,
      deliveryRate: -2,
      atRiskStudents: +2,
      attendance: +1,
    },
  },
  gradeDistribution: [
    { range: '0–3', count: 8 },
    { range: '3–5', count: 22 },
    { range: '5–6', count: 35 },
    { range: '6–7', count: 68 },
    { range: '7–8', count: 95 },
    { range: '8–9', count: 82 },
    { range: '9–10', count: 40 },
  ],
  monthlyEvolution: [
    { month: 'Fev', average: 6.8, attendance: 84, deliveryRate: 74 },
    { month: 'Mar', average: 7.0, attendance: 85, deliveryRate: 76 },
    { month: 'Abr', average: 7.1, attendance: 86, deliveryRate: 79 },
    { month: 'Mai', average: 7.2, attendance: 86, deliveryRate: 78 },
  ],
  atRisk: [
    { name: 'Bruno Santos', class: '3º Ano A', subjects: 3, lastAccess: '5 dias' },
    { name: 'Carla Ferreira', class: '3º Ano B', subjects: 2, lastAccess: '12 dias' },
    { name: 'Pedro Oliveira', class: '2º Ano A', subjects: 2, lastAccess: '3 dias' },
    { name: 'Fernanda Luz', class: '1º Ano A', subjects: 4, lastAccess: '8 dias' },
    { name: 'Ricardo Melo', class: '3º Ano A', subjects: 1, lastAccess: '1 dia' },
  ],
  subjectPerformance: [
    { subject: 'Inglês', average: 8.2, deliveryRate: 95, color: '#DB2777' },
    { subject: 'Matemática', average: 7.8, deliveryRate: 82, color: '#1E3A8A' },
    { subject: 'Biologia', average: 7.6, deliveryRate: 88, color: '#059669' },
    { subject: 'Química', average: 7.6, deliveryRate: 88, color: '#0891B2' },
    { subject: 'Português', average: 7.0, deliveryRate: 71, color: '#7C3AED' },
    { subject: 'Física', average: 6.9, deliveryRate: 79, color: '#D97706' },
    { subject: 'História', average: 7.4, deliveryRate: 91, color: '#DC2626' },
    { subject: 'Geografia', average: 6.5, deliveryRate: 69, color: '#65A30D' },
  ],
  classPerformance: [
    { class: '2º C', average: 8.2, deliveryRate: 95, atRisk: 0, studentsCount: 24 },
    { class: '3º A', average: 7.8, deliveryRate: 82, atRisk: 3, studentsCount: 28 },
    { class: '1º C', average: 7.6, deliveryRate: 88, atRisk: 2, studentsCount: 27 },
    { class: '2º A', average: 7.4, deliveryRate: 91, atRisk: 1, studentsCount: 25 },
    { class: '1º A', average: 7.1, deliveryRate: 83, atRisk: 2, studentsCount: 32 },
    { class: '3º B', average: 7.0, deliveryRate: 71, atRisk: 4, studentsCount: 31 },
    { class: '1º B', average: 6.8, deliveryRate: 76, atRisk: 4, studentsCount: 29 },
    { class: '2º B', average: 6.5, deliveryRate: 69, atRisk: 6, studentsCount: 30 },
  ],
  attendanceByClass: [
    { class: '2º C', attendance: 96 },
    { class: '2º A', attendance: 93 },
    { class: '1º C', attendance: 91 },
    { class: '3º A', attendance: 89 },
    { class: '1º A', attendance: 87 },
    { class: '3º B', attendance: 85 },
    { class: '1º B', attendance: 82 },
    { class: '2º B', attendance: 78 },
  ],
}

export function calcAverage(grades: Array<{ score: number | null; weight: number }>): number | null {
  const valid = grades.filter(g => g.score !== null) as Array<{ score: number; weight: number }>
  if (valid.length === 0) return null
  const sumWeighted = valid.reduce((acc, g) => acc + g.score * g.weight, 0)
  const sumWeights = valid.reduce((acc, g) => acc + g.weight, 0)
  return Math.round((sumWeighted / sumWeights) * 10) / 10
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'approved': return { label: 'Aprovado', className: 'badge-success' }
    case 'recovery': return { label: 'Recuperação', className: 'badge-warning' }
    case 'failed': return { label: 'Reprovado', className: 'badge-danger' }
    default: return { label: 'Aguardando', className: 'badge-neutral' }
  }
}

export function getActivityTypeLabel(type: string) {
  const map: Record<string, string> = {
    prova: 'Prova',
    trabalho: 'Trabalho',
    apresentacao: 'Apresentação',
    leitura: 'Leitura',
    aula_ao_vivo: 'Aula ao Vivo',
    outro: 'Outro',
  }
  return map[type] ?? type
}

export function getDaysUntil(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diff = due.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatDueDate(dueDate: string): string {
  const days = getDaysUntil(dueDate)
  if (days < 0) return `Atrasado ${Math.abs(days)}d`
  if (days === 0) return 'Vence hoje'
  if (days === 1) return 'Vence amanhã'
  return `${days} dias`
}

export interface GuardianStudent {
  id: string
  name: string
  class: string
  year: string
  avatar?: string
  overallAverage: number
  attendance: number
  pendingActivities: number
  lateActivities: number
  subjects: {
    id: string
    name: string
    color: string
    average: number
    status: 'approved' | 'recovery' | 'failed' | 'pending'
    attendance: number
  }[]
  recentEvents: {
    id: string
    type: 'grade' | 'activity' | 'attendance' | 'message'
    title: string
    detail: string
    date: string
  }[]
}

export const mockGuardianStudents: Record<string, GuardianStudent> = {
  'student-1': {
    id: 'student-1',
    name: 'Lucas Mendes',
    class: '3º Ano A',
    year: '2024',
    overallAverage: 7.1,
    attendance: 88,
    pendingActivities: 2,
    lateActivities: 1,
    subjects: [
      { id: 'mat',  name: 'Matemática', color: '#1E3A8A', average: 8.1, status: 'approved',  attendance: 92 },
      { id: 'port', name: 'Português',  color: '#7C3AED', average: 7.6, status: 'approved',  attendance: 88 },
      { id: 'hist', name: 'História',   color: '#DC2626', average: 6.0, status: 'recovery',  attendance: 75 },
      { id: 'bio',  name: 'Biologia',   color: '#059669', average: 8.0, status: 'approved',  attendance: 96 },
      { id: 'fis',  name: 'Física',     color: '#D97706', average: 4.9, status: 'recovery',  attendance: 80 },
    ],
    recentEvents: [
      { id: 're-1', type: 'grade',      title: 'Nota lançada — Matemática',  detail: 'Prova 1: 8,0', date: 'Hoje, 10:42' },
      { id: 're-2', type: 'activity',   title: 'Entrega pendente — Português', detail: 'Análise Literária: vence amanhã', date: 'Hoje' },
      { id: 're-3', type: 'attendance', title: 'Falta registrada — História',  detail: '75% de frequência (-alerta)',    date: 'Ontem' },
      { id: 're-4', type: 'activity',   title: 'Atividade atrasada — Física',  detail: 'Lista de Exercícios não entregue', date: '2 dias atrás' },
    ],
  },
}
