import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GradeScale = 'numeric' | 'percentage' | 'conceptual' | 'mencao'

interface SettingsStore {
  gradeScale: GradeScale
  approvalGrade: number
  recoveryMin: number
  recoveryMax: number
  minAttendance: number
  setGradeScale: (s: GradeScale) => void
  setApprovalGrade: (v: number) => void
  setRecoveryRange: (min: number, max: number) => void
  setMinAttendance: (v: number) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      gradeScale: 'numeric',
      approvalGrade: 6,
      recoveryMin: 4,
      recoveryMax: 5.9,
      minAttendance: 75,
      setGradeScale: (gradeScale) => set({ gradeScale }),
      setApprovalGrade: (approvalGrade) => set({ approvalGrade }),
      setRecoveryRange: (recoveryMin, recoveryMax) => set({ recoveryMin, recoveryMax }),
      setMinAttendance: (minAttendance) => set({ minAttendance }),
    }),
    { name: 'vekta-settings' }
  )
)
