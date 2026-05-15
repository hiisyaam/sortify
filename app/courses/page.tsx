"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/client"
import { BottomNav } from "@/components/bottom-nav"
import { User } from "@/lib/types"
import { ChevronRight, Lock, CheckCircle, ArrowLeft, Star } from "lucide-react"

const allCourses = [
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    description: "Algoritma sorting paling dasar",
    color: "bg-[#FFDA57]",
    difficulty: "Pemula",
    modules: 3,
    time: "15 min",
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    description: "Pilih elemen terkecil berulang",
    color: "bg-[#7DCAF6]",
    difficulty: "Pemula",
    modules: 3,
    time: "15 min",
  },
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    description: "Sisipkan di posisi yang tepat",
    color: "bg-[#A293FF]",
    difficulty: "Menengah",
    modules: 3,
    time: "20 min",
  },
  {
    id: "quick-sort",
    title: "Quick Sort",
    description: "Algoritma divide and conquer",
    color: "bg-[#FFBBF4]",
    difficulty: "Lanjutan",
    modules: 4,
    time: "30 min",
  },
]

export default function CoursesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<"games" | "product">("games")

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/login")
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()

      if (error || !profile) {
        router.push("/login")
        return
      }

      setUser({
        id: authUser.id,
        name: profile.username,
        email: profile.email,
        points: profile.points || 0,
        streak: profile.streak || 0,
        lives: profile.lives || 3,
        completedCourses: profile.completedCourses || [],
      })
    }

    getUser()

    const storedProgress = localStorage.getItem("sortify_progress")
    if (storedProgress) {
      setCourseProgress(JSON.parse(storedProgress))
    }
  }, [router])

  const isUnlocked = (index: number) => {
    if (index === 0) return true
    const prevCourseId = allCourses[index - 1].id
    const prevProgress = courseProgress[prevCourseId] || 0
    return prevProgress >= 100
  }

  const getStatus = (courseId: string) => {
    const progress = courseProgress[courseId] || 0
    if (progress >= 100) return "completed"
    if (progress > 0) return "in-progress"
    return "not-started"
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] flex items-center justify-center">
        <div className="w-10 h-10 bg-[#FFDA57] rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F4ED] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full border-2 border-[#E0DFD8] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#100F06]" />
          </button>
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border-2 border-[#E0DFD8]">
            <Star className="w-4 h-4 text-[#FFDA57]" />
            <span className="text-sm font-bold text-[#100F06]">{user.points}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("games")}
            className={`flex-1 py-3 rounded-full font-semibold text-sm transition-all ${activeTab === "games"
                ? "bg-[#00917A] text-white"
                : "bg-white text-[#6B6B6B] border-2 border-[#E0DFD8]"
              }`}
          >
            Games
          </button>
          <button
            onClick={() => setActiveTab("product")}
            className={`flex-1 py-3 rounded-full font-semibold text-sm transition-all ${activeTab === "product"
                ? "bg-[#00917A] text-white"
                : "bg-white text-[#6B6B6B] border-2 border-[#E0DFD8]"
              }`}
          >
            Progress
          </button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {allCourses.map((course, index) => {
            const unlocked = isUnlocked(index)
            const status = getStatus(course.id)
            const progress = courseProgress[course.id] || 0

            return (
              <button
                key={course.id}
                onClick={() => unlocked && router.push(`/courses/${course.id}`)}
                disabled={!unlocked}
                className={`${course.color} rounded-sm p-4 text-left transition-all active:scale-[0.98] relative overflow-hidden ${!unlocked ? "opacity-50" : ""
                  }`}
              >
                {status === "completed" && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-[#00917A]" />
                  </div>
                )}

                {!unlocked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-5 h-5 text-[#100F06]/50" />
                  </div>
                )}

                <div className="mb-8">
                  <span className="text-xs font-medium text-[#100F06]/60">
                    {course.difficulty}
                  </span>
                </div>

                <h3 className="font-[var(--font-unbounded)] text-base font-bold text-[#100F06] mb-1 leading-tight">
                  {course.title}
                </h3>

                <p className="text-xs text-[#100F06]/60 mb-3">
                  {course.time}
                </p>

                {unlocked && progress > 0 && (
                  <div className="h-1.5 bg-[#100F06]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00917A] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {!unlocked && (
                  <p className="text-xs text-[#100F06]/50 font-medium">
                    Selesaikan sebelumnya
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
