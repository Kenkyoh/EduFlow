import { create } from 'zustand'
import type { StudentGrades } from '../types'
import { mockStudentGrades, mockAssessments, calcAverage } from '../data/mock'

interface GradesStore {
  grades: StudentGrades[]
  flashCells: Record<string, boolean>
  updateGrade: (studentId: string, assessmentId: string, score: number | null) => void
  setFlash: (key: string, value: boolean) => void
}

function recalcStatus(avg: number | null): StudentGrades['status'] {
  if (avg === null) return 'pending'
  if (avg >= 6) return 'approved'
  if (avg >= 4) return 'recovery'
  return 'failed'
}

export const useGradesStore = create<GradesStore>((set, get) => ({
  grades: mockStudentGrades,
  flashCells: {},
  updateGrade: (studentId, assessmentId, score) => {
    set(state => {
      const grades = state.grades.map(sg => {
        if (sg.studentId !== studentId) return sg
        const updatedGrades = sg.grades.map(g =>
          g.assessmentId === assessmentId ? { ...g, score } : g
        )
        const gradesWithWeights = updatedGrades.map(g => {
          const assessment = mockAssessments.find(a => a.id === g.assessmentId)
          return { score: g.score, weight: assessment?.weight ?? 0 }
        })
        const average = calcAverage(gradesWithWeights)
        return {
          ...sg,
          grades: updatedGrades,
          average: average ?? undefined,
          status: recalcStatus(average),
        }
      })
      return { grades }
    })

    const flashKey = `${studentId}-${assessmentId}`
    set(state => ({ flashCells: { ...state.flashCells, [flashKey]: true } }))
    setTimeout(() => {
      set(state => ({ flashCells: { ...state.flashCells, [flashKey]: false } }))
    }, 800)
  },
  setFlash: (key, value) =>
    set(state => ({ flashCells: { ...state.flashCells, [key]: value } })),
}))
