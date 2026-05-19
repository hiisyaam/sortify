export interface User {
  id: string
  name: string
  email: string
  points: number
  streak: number
  lives: number
  completedCourses: string[]
  currentCourse?: string
  last_activity_date?: string | null
}

export interface Challenge {
  id: string
  course_id: string
  type: 'puzzle' | 'arrangement'
  question: string
  code_template?: string
  options?: string[]
  correct_answer: string
}

export interface LearningHistory {
  id: string
  user_id: string
  course_id: string
  course_title: string
  points_earned: number
  completed_at: string
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
