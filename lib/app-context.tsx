'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { User, Course, GameState } from './types'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  courses: Course[]
  setCourses: (courses: Course[]) => void
  gameState: GameState
  setGameState: (state: GameState) => void
  updatePoints: (points: number) => void
  updateStreak: () => void
  loseLife: () => void
  resetLives: () => void
  completeCourse: (courseId: string) => void
}

const defaultCourses: Course[] = [
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    description: 'Algoritma sorting sederhana yang berulang kali menukar elemen berdekatan jika urutannya salah.',
    icon: '🫧',
    difficulty: 'beginner',
    isLocked: false,
    progress: 0,
    totalModules: 3,
    completedModules: 0,
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    description: 'Algoritma yang memilih elemen terkecil dan menempatkannya di posisi yang benar.',
    icon: '🎯',
    difficulty: 'beginner',
    isLocked: true,
    progress: 0,
    totalModules: 3,
    completedModules: 0,
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    description: 'Algoritma yang membangun array terurut satu elemen pada satu waktu.',
    icon: '📥',
    difficulty: 'intermediate',
    isLocked: true,
    progress: 0,
    totalModules: 3,
    completedModules: 0,
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'Algoritma divide-and-conquer yang efisien dengan memilih pivot.',
    icon: '⚡',
    difficulty: 'advanced',
    isLocked: true,
    progress: 0,
    totalModules: 3,
    completedModules: 0,
  },
]

const defaultGameState: GameState = {
  currentLevel: 1,
  score: 0,
  lives: 3,
  isPlaying: false,
  isPaused: false,
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>(defaultCourses)
  const [gameState, setGameState] = useState<GameState>(defaultGameState)

  const updatePoints = (points: number) => {
    if (user) {
      setUser({ ...user, points: user.points + points })
    }
  }

  const updateStreak = () => {
    if (user) {
      setUser({ ...user, streak: user.streak + 1 })
    }
  }

  const loseLife = () => {
    if (user && user.lives > 0) {
      setUser({ ...user, lives: user.lives - 1 })
    }
    setGameState({ ...gameState, lives: Math.max(0, gameState.lives - 1) })
  }

  const resetLives = () => {
    if (user) {
      setUser({ ...user, lives: 3 })
    }
    setGameState({ ...gameState, lives: 3 })
  }

  const completeCourse = (courseId: string) => {
    if (user && !user.completedCourses.includes(courseId)) {
      setUser({
        ...user,
        completedCourses: [...user.completedCourses, courseId],
        points: user.points + 100,
      })

      // Unlock next course
      const courseIndex = courses.findIndex(c => c.id === courseId)
      if (courseIndex < courses.length - 1) {
        const updatedCourses = [...courses]
        updatedCourses[courseIndex + 1].isLocked = false
        setCourses(updatedCourses)
      }
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        courses,
        setCourses,
        gameState,
        setGameState,
        updatePoints,
        updateStreak,
        loseLife,
        resetLives,
        completeCourse,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
