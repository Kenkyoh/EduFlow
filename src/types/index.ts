export type UserRole = 'student' | 'teacher' | 'coordinator' | 'guardian' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  institution: string
  schoolId?: string
  studentIds?: string[]
}

export interface School {
  id: string
  name: string
  city: string
  state: string
  plan: 'basic' | 'standard' | 'premium'
  status: 'active' | 'inactive' | 'trial'
  createdAt: string
  studentsCount: number
  teachersCount: number
  classesCount: number
  coordinatorName?: string
  coordinatorEmail?: string
  primaryColor?: string
}

export interface Subject {
  id: string
  name: string
  color: string
  colorLight: string
  teacher?: string
  teacherId?: string
  credits?: number
}

export interface Assessment {
  id: string
  name: string
  weight: number
  maxScore: number
  type: 'prova' | 'trabalho' | 'apresentacao' | 'participacao' | 'outro'
}

export interface Grade {
  assessmentId: string
  score: number | null
  isRecovery?: boolean
}

export interface StudentGrades {
  studentId: string
  studentName: string
  studentAvatar?: string
  grades: Grade[]
  average?: number
  status: 'approved' | 'recovery' | 'failed' | 'pending'
  inactive?: boolean
}

export type MencaoValue = 'PA' | 'AC' | 'A' | 'P' | 'N'

export interface ObjetivoBimestral {
  id: string
  title: string
  description?: string
  subjectId: string
  order: number
}

export interface StudentMencaoGrade {
  studentId: string
  studentName: string
  grades: { objectiveId: string; value: MencaoValue | null }[]
  total: number
  status: 'approved' | 'recovery' | 'failed' | 'pending'
  inactive?: boolean
}

export interface ReportCardAssessment {
  name: string
  weight: number
  score: number | null
}

export interface ReportCardMencaoObjective {
  id: string
  title: string
  value: MencaoValue | null
}

type ReportCardBase = {
  subjectId: string
  subjectName: string
  teacher: string
  color: string
  colorLight: string
  attendance: number
  average: number
  status: 'approved' | 'recovery' | 'failed' | 'pending'
  history: number[]
}

export type ReportCardSubjectData =
  | (ReportCardBase & { gradingType?: 'numeric'; assessments: ReportCardAssessment[] })
  | (ReportCardBase & { gradingType: 'mencao'; mencaoObjectives: ReportCardMencaoObjective[] })

export interface Activity {
  id: string
  title: string
  subjectId: string
  subjectName: string
  subjectColor: string
  type: 'prova' | 'trabalho' | 'apresentacao' | 'leitura' | 'aula_ao_vivo' | 'outro'
  dueDate: string
  startDate: string
  weight: number
  description?: string
  classIds: string[]
  classNames: string[]
  status: 'pending' | 'submitted' | 'late' | 'graded' | 'upcoming'
  submissionsCount?: number
  totalStudents?: number
  allowResubmit?: boolean
  maxAttempts?: number
  published: boolean
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  read: boolean
  attachment?: { name: string; size: string }
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantRole: UserRole
  participantAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
}

export interface Notification {
  id: string
  type: 'grade' | 'deadline' | 'message' | 'announcement' | 'system'
  title: string
  body: string
  source: string
  timestamp: string
  read: boolean
  actionLabel?: string
  actionPath?: string
}

export interface CalendarEvent {
  id: string
  title: string
  subjectId: string
  subjectName: string
  color: string
  colorLight: string
  type: Activity['type']
  date: string
  dueDate?: string
  allDay?: boolean
  description?: string
}

export interface ClassInfo {
  id: string
  name: string
  subjectId: string
  subjectName: string
  color: string
  colorLight: string
  teacher: string
  teacherId: string
  studentsCount: number
  year: string
  period: string
  deliveryRate?: number
  gradingType?: 'numeric' | 'mencao'
}

export interface Submission {
  id: string
  activityId: string
  activityTitle: string
  studentId: string
  studentName: string
  studentAvatar?: string
  submittedAt: string
  attempt: number
  content?: string
  files?: { name: string; size: string; type: string }[]
  grade?: number
  feedback?: string
  status: 'submitted' | 'graded' | 'late'
}

export interface AnnouncementPost {
  id: string
  type: 'aviso' | 'material' | 'enquete' | 'urgente'
  title: string
  content: string
  author: string
  authorRole: UserRole
  timestamp: string
  urgent?: boolean
  attachments?: { name: string; size: string }[]
  viewCount?: number
  pollOptions?: { text: string; votes: number }[]
  estimatedTime?: string
}

export interface InstitutionSettings {
  name: string
  logo?: string
  primaryColor: string
  academicYear: string
  periods: { name: string; start: string; end: string }[]
  approvalGrade: number
  minAttendance: number
}
