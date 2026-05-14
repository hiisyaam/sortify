export interface User {
  id: string
  name: string
  email: string
  points: number
  streak: number
  lives: number
  completedCourses: string[]
  currentCourse?: string
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isLocked: boolean
  progress: number
  totalModules: number
  completedModules: number
}

export interface SortingStep {
  array: number[]
  comparing: number[]
  swapping: number[]
  sorted: number[]
  explanation: string
}

export interface CodePuzzle {
  id: string
  question: string
  codeTemplate: string
  blanks: CodeBlank[]
  correctOrder?: string[]
}

export interface CodeBlank {
  id: string
  position: number
  options: string[]
  correctAnswer: string
}

export interface CodeBlock {
  id: string
  code: string
  order: number
}

export interface GameState {
  currentLevel: number
  score: number
  lives: number
  isPlaying: boolean
  isPaused: boolean
}
