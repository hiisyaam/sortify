"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { SortingVisualizer } from "@/components/sorting-visualizer"
import { CodePuzzleGame } from "@/components/code-puzzle-game"
import { CodeArrangementGame } from "@/components/code-arrangement-game"
import { Confetti } from "@/components/confetti"
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateRandomArray,
  bubbleSortPuzzles,
  selectionSortPuzzles,
  bubbleSortCodeBlocks,
  selectionSortCodeBlocks
} from "@/lib/sorting-algorithms"
import { User, SortingStep, CodePuzzle, CodeBlock } from "@/lib/types"
import {
  ArrowLeft,
  Heart,
  Play,
  Code,
  Puzzle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trophy,
  Star,
  BookOpen,
  Target
} from "lucide-react"

type ModuleType = "intro" | "visualization" | "puzzle" | "arrangement" | "success"

interface CourseData {
  id: string
  title: string
  color: string
  generateSteps: (arr: number[]) => SortingStep[]
  puzzles: CodePuzzle[]
  codeBlocks: CodeBlock[]
  introDescription: string
}

const courseDataMap: Record<string, CourseData> = {
  "bubble-sort": {
    id: "bubble-sort",
    title: "Bubble Sort",
    color: "bg-[#FFDA57]",
    generateSteps: generateBubbleSortSteps,
    puzzles: bubbleSortPuzzles,
    codeBlocks: bubbleSortCodeBlocks,
    introDescription: "Bubble Sort adalah algoritma pengurutan sederhana yang membandingkan setiap pasangan elemen yang berdekatan dan menukarnya jika posisinya salah. Proses ini diulang sampai tidak ada lagi pertukaran yang terjadi, seolah-olah elemen terkecil/terbesar 'menggelembung' ke posisi yang benar.",
  },
  "selection-sort": {
    id: "selection-sort",
    title: "Selection Sort",
    color: "bg-[#7DCAF6]",
    generateSteps: generateSelectionSortSteps,
    puzzles: selectionSortPuzzles,
    codeBlocks: selectionSortCodeBlocks,
    introDescription: "Selection Sort adalah algoritma pengurutan yang mencari elemen terkecil dalam bagian array yang belum terurut, lalu menukarnya dengan elemen pertama dari bagian itu. Proses ini diulang dengan menggeser batas bagian yang terurut hingga seluruh array berhasil diurus berurutan.",
  },
}

export default function CoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string

  const [user, setUser] = useState<User | null>(null)
  const [currentModule, setCurrentModule] = useState<ModuleType>("intro")
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [sortingArray, setSortingArray] = useState<number[]>([])
  const [sortingSteps, setSortingSteps] = useState<SortingStep[]>([])
  const [livesDepletedAt, setLivesDepletedAt] = useState<number | null>(null)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const audioLanjutRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioLanjutRef.current = new Audio('/audio/sukses.mp3')
    audioLanjutRef.current.volume = 0.5
  }, [])

  // Cek cooldown dari localStorage saat pertama load
  useEffect(() => {
    if (!courseId) return
    const stored = localStorage.getItem(`sortify_cooldown_${courseId}`)
    if (stored) {
      const ts = parseInt(stored, 10)
      const elapsed = Date.now() - ts
      const COOLDOWN_MS = 3 * 60 * 1000
      if (elapsed < COOLDOWN_MS) {
        setLivesDepletedAt(ts)
        setLives(0)
      } else {
        localStorage.removeItem(`sortify_cooldown_${courseId}`)
        setLives(3)
      }
    }
  }, [courseId])

  // Countdown timer
  useEffect(() => {
    if (!livesDepletedAt) return
    const COOLDOWN_MS = 3 * 60 * 1000
    const interval = setInterval(() => {
      const elapsed = Date.now() - livesDepletedAt
      const remaining = Math.max(0, COOLDOWN_MS - elapsed)
      setCooldownRemaining(Math.ceil(remaining / 1000))
      if (remaining <= 0) {
        clearInterval(interval)
        setLivesDepletedAt(null)
        setCooldownRemaining(0)
        setLives(3)
        if (courseId) localStorage.removeItem(`sortify_cooldown_${courseId}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [livesDepletedAt, courseId])

  const depleteLives = useCallback(() => {
    if (!courseId) return
    const now = Date.now()
    setLives(0)
    setLivesDepletedAt(now)
    localStorage.setItem(`sortify_cooldown_${courseId}`, now.toString())
  }, [courseId])

  const handleLanjutPuzzle = () => {
    if (audioLanjutRef.current) {
      audioLanjutRef.current.currentTime = 0
      audioLanjutRef.current.play().catch(() => { })
    }
    const isArrangementReady = currentPuzzleIndex >= courseDataMap[courseId]?.puzzles.length
    setCurrentModule(isArrangementReady ? "arrangement" : "puzzle")
  }

  const courseData = courseDataMap[courseId]

  useEffect(() => {
    const storedUser = localStorage.getItem("sortify_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
      return
    }

    if (!courseData) {
      router.push("/courses")
      return
    }

    const arr = generateRandomArray(6, 50)
    setSortingArray(arr)
    setSortingSteps(courseData.generateSteps(arr))
  }, [router, courseData])

  const handlePuzzleCorrect = () => {
    setScore(prev => prev + 25)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)

    if (currentPuzzleIndex < courseData.puzzles.length - 1) {
      setTimeout(() => {
        setCurrentPuzzleIndex(prev => prev + 1)
      }, 1500)
    } else {
      setTimeout(() => {
        setCurrentModule("arrangement")
      }, 1500)
    }
  }

  // Kurangi nyawa tapi tetap di puzzle yang sama
  const handlePuzzleWrongAnswer = () => {
    if (lives > 1) {
      setLives(prev => prev - 1)
    } else {
      depleteLives()
    }
  }

  const handleArrangementCorrect = () => {
    setScore(prev => prev + 50)
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setCurrentModule("success")
      saveProgress()
    }, 1500)
  }

  // Kurangi nyawa tapi tetap di arrangement yang sama
  const handleArrangementWrongAnswer = (_error: string) => {
    if (lives > 1) {
      setLives(prev => prev - 1)
    } else {
      depleteLives()
    }
  }

  const saveProgress = () => {
    if (user) {
      const updatedUser = {
        ...user,
        points: user.points + score + 50,
        streak: user.streak + 1,
      }
      localStorage.setItem("sortify_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }

    const storedProgress = localStorage.getItem("sortify_progress")
    const progress = storedProgress ? JSON.parse(storedProgress) : {}
    progress[courseId] = 100
    localStorage.setItem("sortify_progress", JSON.stringify(progress))
  }

  const resetGame = () => {
    setLives(3)
    setLivesDepletedAt(null)
    setCooldownRemaining(0)
    localStorage.removeItem(`sortify_cooldown_${courseId}`)
    setScore(0)
    setCurrentPuzzleIndex(0)
    setCurrentModule("intro")
    const arr = generateRandomArray(6, 50)
    setSortingArray(arr)
    setSortingSteps(courseData.generateSteps(arr))
  }

  const generateNewArray = () => {
    const arr = generateRandomArray(6, 50)
    setSortingArray(arr)
    setSortingSteps(courseData.generateSteps(arr))
  }

  if (!courseData || !user) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] flex items-center justify-center">
        <div className="w-10 h-10 bg-[#FFDA57] rounded-xl animate-pulse" />
      </div>
    )
  }

  const modules = [
    { id: "intro", icon: BookOpen, label: "Intro" },
    { id: "visualization", icon: Play, label: "Visual" },
    { id: "challenge", icon: Target, label: "Challenge" }
  ]

  const handleTabClick = (moduleId: string) => {
    if (moduleId === "challenge") {
      const isArrangementReady = currentPuzzleIndex >= courseData.puzzles.length
      setCurrentModule(isArrangementReady ? "arrangement" : "puzzle")
    } else {
      setCurrentModule(moduleId as ModuleType)
    }
  }

  const getModuleStatus = (moduleId: string) => {
    const currentStage = (currentModule === "puzzle" || currentModule === "arrangement") ? "challenge" : currentModule
    const stages = ["intro", "visualization", "challenge", "success"]
    const currentIndex = stages.indexOf(currentStage)
    const moduleIndex = stages.indexOf(moduleId)

    return {
      isActive: currentStage === moduleId,
      isPast: moduleIndex < currentIndex
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4ED]">
      <Confetti isActive={showConfetti} />

      {/* Header */}
      <div className="px-5 pt-6 pb-4 sticky top-0 z-40 bg-[#F5F4ED]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border-2 border-[#E0DFD8] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#100F06]" />
          </button>

          <div className={`${courseData.color} px-4 py-2 rounded-full`}>
            <h1 className="font-[var(--font-unbounded)] text-sm font-bold text-[#100F06]">
              {courseData.title}
            </h1>
          </div>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${i < lives ? "fill-[#F47575] text-[#F47575]" : "text-[#E0DFD8]"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Module Progress */}
        {currentModule !== "success" && (
          <div className="flex items-center gap-2">
            {modules.map((module) => {
              const Icon = module.icon
              const { isActive, isPast } = getModuleStatus(module.id)

              return (
                <button
                  key={module.id}
                  onClick={() => handleTabClick(module.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full transition-all cursor-pointer active:scale-95 ${isActive
                      ? "bg-[#100F06] text-white"
                      : isPast
                        ? "bg-[#00917A] text-white"
                        : "bg-white border-2 border-[#E0DFD8] text-[#6B6B6B]"
                    }`}
                >
                  {isPast ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">{module.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Score Bar */}
      {currentModule !== "success" && (
        <div className="px-5 py-3">
          <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between border-2 border-[#E0DFD8]">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FFDA57]" />
              <span className="font-bold text-[#100F06]">{score} Poin</span>
            </div>
            {currentModule === "visualization" && (
              <button
                onClick={generateNewArray}
                className="flex items-center gap-1 text-[#00917A] text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Acak
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-5 pb-8">
        {/* Game Over / Cooldown State */}
        {lives === 0 && (currentModule === "puzzle" || currentModule === "arrangement") && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#FFDA57]/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-[#FFDA57]/30">
              <RefreshCw className="w-10 h-10 text-[#FFDA57] animate-spin-slow" />
            </div>
            <h2 className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06] mb-2">
              Lagi Cooldown Nih!
            </h2>
            <p className="text-[#6B6B6B] text-sm mb-6">
              Pelajari ulang visualisasi materi sebelum lanjut coba lagi. Tunggu sebentar ya!
            </p>
            <div className="bg-[#100F06] text-white font-[var(--font-unbounded)] text-4xl p-6 rounded-2xl mb-6 flex justify-center items-center gap-2">
              <span>{Math.floor(cooldownRemaining / 60).toString().padStart(2, '0')}</span>
              <span className="animate-pulse">:</span>
              <span>{(cooldownRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
            <button
              onClick={() => setCurrentModule("visualization")}
              className="w-full bg-[#00917A] text-white font-semibold py-4 rounded-full shadow-playful active:translate-y-1 active:shadow-none transition-all"
            >
              Lihat Visualisasi Lagi
            </button>
          </div>
        )}

        {/* Intro Module */}
        {currentModule === "intro" && (
          <div className="space-y-4">
            <div className="bg-white rounded-sm p-5 border-2 border-[#E0DFD8] animate-slide-up stagger-1 opacity-0">
              <h2 className="font-[var(--font-unbounded)] text-xl font-bold text-[#100F06] mb-3">
                Pengenalan Singkat
              </h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-4">
                {courseData.introDescription}
              </p>
            </div>
            <button
              className="w-full bg-[#00917A] text-white font-semibold py-4 rounded-full shadow-playful active:translate-y-1 active:shadow-none transition-all animate-slide-up stagger-2 opacity-0"
              onClick={() => handleTabClick("visualization")}
            >
              Mulai Visualisasi
            </button>
          </div>
        )}

        {/* Visualization Module */}
        {currentModule === "visualization" && (
          <div className="space-y-4">
            <div className="bg-white rounded-sm p-5 border-2 border-[#E0DFD8] animate-slide-up stagger-1 opacity-0">
              <h2 className="font-[var(--font-unbounded)] text-lg font-bold text-[#100F06] mb-2">
                Visualisasi
              </h2>
              <p className="text-[#6B6B6B] text-sm mb-4">
                Perhatikan cara kerja {courseData.title}. Atur kecepatan sesuai keinginanmu.
              </p>

              <SortingVisualizer
                steps={sortingSteps}
                onComplete={() => { }}
              />
            </div>

            <button
              className="w-full bg-[#00917A] text-white font-semibold py-4 rounded-full shadow-playful active:translate-y-1 active:shadow-none transition-all animate-slide-up stagger-2 opacity-0"
              onClick={handleLanjutPuzzle}
            >
              Lanjut ke Challenge
            </button>
          </div>
        )}

        {/* Puzzle Module */}
        {currentModule === "puzzle" && lives > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-sm p-5 border-2 border-[#E0DFD8] animate-slide-up stagger-1 opacity-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[var(--font-unbounded)] text-lg font-bold text-[#100F06]">
                  Puzzle Code
                </h2>
                <span className="bg-[#00917A] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {currentPuzzleIndex + 1}/{courseData.puzzles.length}
                </span>
              </div>
              <p className="text-[#6B6B6B] text-sm mb-4">
                Pilih jawaban yang benar untuk melengkapi kode.
              </p>

              <CodePuzzleGame
                puzzle={courseData.puzzles[currentPuzzleIndex]}
                lives={lives}
                onCorrect={handlePuzzleCorrect}
                onWrongAnswer={handlePuzzleWrongAnswer}
              />
            </div>
          </div>
        )}

        {/* Arrangement Module */}
        {currentModule === "arrangement" && lives > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-sm p-5 border-2 border-[#E0DFD8] animate-slide-up stagger-1 opacity-0">
              <h2 className="font-[var(--font-unbounded)] text-lg font-bold text-[#100F06] mb-2">
                Susun Kode
              </h2>
              <p className="text-[#6B6B6B] text-sm mb-4">
                Susun potongan kode dengan urutan yang benar.
              </p>

              <CodeArrangementGame
                blocks={courseData.codeBlocks}
                lives={lives}
                onCorrect={handleArrangementCorrect}
                onWrongAnswer={handleArrangementWrongAnswer}
              />
            </div>
          </div>
        )}

        {/* Success Module */}
        {currentModule === "success" && (
          <div className="text-center py-6">
            <div className="w-24 h-24 bg-[#00917A] rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <Trophy className="w-12 h-12 text-white" />
            </div>

            <h2 className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06] mb-2">
              Selamat!
            </h2>
            <p className="text-[#6B6B6B] mb-6">
              Kamu menyelesaikan {courseData.title}!
            </p>

            <div className="bg-white rounded-sm p-5 border-2 border-[#E0DFD8] mb-6">
              <h3 className="font-semibold text-[#100F06] mb-4">Reward</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FFDA57]/20 rounded-sm p-4 text-center">
                  <Star className="w-8 h-8 text-[#FFDA57] mx-auto mb-2" />
                  <p className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06]">
                    +{score + 50}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">Poin</p>
                </div>
                <div className="bg-[#F47575]/20 rounded-sm p-4 text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <p className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06]">
                    +1
                  </p>
                  <p className="text-xs text-[#6B6B6B]">Streak</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                className="w-full bg-[#00917A] text-white font-semibold py-4 rounded-full shadow-playful"
                onClick={() => router.push("/courses")}
              >
                Lanjut Belajar
              </button>
              <button
                className="w-full bg-white text-[#100F06] font-semibold py-4 rounded-full border-2 border-[#E0DFD8]"
                onClick={() => router.push("/dashboard")}
              >
                Kembali ke Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
