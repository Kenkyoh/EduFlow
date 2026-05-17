export type UserRole = 'student' | 'teacher' | 'coordinator' | 'guardian' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  institution: string
  schoolId: string | null
  avatar: string | null
  bio: string | null
}
