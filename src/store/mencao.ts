import { create } from 'zustand'
import type { MencaoValue, StudentMencaoGrade, ObjetivoBimestral } from '../types'
import { mockMencaoStudentGrades, mockMencaoObjetivos, MENCAO_SCORES } from '../data/mock'

function calcTotal(grades: { objectiveId: string; value: MencaoValue | null }[]): number {
  return Math.round(grades.reduce((acc, g) => acc + (g.value !== null ? MENCAO_SCORES[g.value!] : 0), 0) * 10) / 10
}

function recalcStatus(total: number, grades: { value: MencaoValue | null }[]): StudentMencaoGrade['status'] {
  const allNull = grades.every(g => g.value === null)
  if (allNull) return 'pending'
  if (total >= 6) return 'approved'
  if (total >= 4) return 'recovery'
  return 'failed'
}

interface MencaoStore {
  grades: StudentMencaoGrade[]
  objectives: ObjetivoBimestral[]
  updateGrade: (studentId: string, objectiveId: string, value: MencaoValue | null) => void
  updateObjective: (objectiveId: string, title: string, description?: string) => void
}

export const useMencaoStore = create<MencaoStore>((set) => ({
  grades: mockMencaoStudentGrades,
  objectives: mockMencaoObjetivos,

  updateGrade: (studentId, objectiveId, value) =>
    set(state => ({
      grades: state.grades.map(sg => {
        if (sg.studentId !== studentId) return sg
        const updated = sg.grades.map(g => g.objectiveId === objectiveId ? { ...g, value } : g)
        const total = calcTotal(updated)
        return { ...sg, grades: updated, total, status: recalcStatus(total, updated) }
      }),
    })),

  updateObjective: (objectiveId, title, description) =>
    set(state => {
      const exists = state.objectives.some(o => o.id === objectiveId)
      if (exists) {
        return { objectives: state.objectives.map(o => o.id === objectiveId ? { ...o, title, description } : o) }
      }
      // Generic objective being named for the first time
      const order = parseInt(objectiveId.replace('gen-obj-', '')) || 0
      return {
        objectives: [...state.objectives, { id: objectiveId, title, description, subjectId: 'generic', order }],
      }
    }),
}))
