"use client"
import { supabase } from "@/lib/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { User } from "@/lib/types"
import { Flame, Star, Heart, ChevronRight, Lock, Trophy, Search } from "lucide-react"

const courses = [
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    description: "Algoritma sorting sederhana",
    color: "bg-[#FFDA57]",
    textColor: "text-[#100F06]",
    difficulty: "Pemula",
    isLocked: false,
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    description: "Pilih dan tempatkan elemen",
    color: "bg-[#7DCAF6]",
    textColor: "text-[#100F06]",
    difficulty: "Pemula",
    isLocked: true,
  },
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    description: "Sisipkan di posisi yang benar",
    color: "bg-[#A293FF]",
    textColor: "text-[#100F06]",
    difficulty: "Menengah",
    isLocked: true,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({})

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
      console.log(error)
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

    const storedProgress = localStorage.getItem("sortify_progress")

    if (storedProgress) {
      setCourseProgress(JSON.parse(storedProgress))
    }
  }

  getUser()

}, [router])

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
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FFDA57] rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-[#100F06]">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs text-[#6B6B6B]">Selamat datang</p>
              <h1 className="font-[var(--font-unbounded)] text-base font-bold text-[#100F06]">{user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border-2 border-[#E0DFD8]">
            <Star className="w-4 h-4 text-[#FFDA57]" />
            <span className="text-sm font-bold text-[#100F06]">{user.points}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Cari course..."
            className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl border-2 border-[#E0DFD8] text-[#100F06] placeholder:text-[#A0A0A0] focus:border-[#00917A] focus:outline-none"
          />
        </div>

        {/* Stats Row */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-sm p-4 border-2">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-[#F47575]" />
              <span className="text-xs text-[#6B6B6B]">Streak</span>
            </div>
            <p className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06]">{user.streak}</p>
          </div>
          <div className="flex-1 bg-white rounded-sm p-4 border-2 border-[#E0DFD8]">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-[#F47575]" />
              <span className="text-xs text-[#6B6B6B]">Nyawa</span>
            </div>
            <p className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06]">{user.lives}</p>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="px-5 mb-6">
        <div className="bg-[#00917A] rounded-sm p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[#FFDA57]" />
              <span className="text-sm font-medium text-white/80">Tantangan Harian</span>
            </div>
            <p className="font-[var(--font-unbounded)] text-lg font-bold text-white mb-3">
              Selesaikan 1 modul
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Bonus: +50 poin</span>
              <button className="bg-white text-[#00917A] font-semibold text-sm px-4 py-2 rounded-full">
                Mulai
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pick Game Section */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[var(--font-unbounded)] text-xl font-bold text-[#100F06]">
            Pick Game
            <br />
            To Play
          </h2>
          <button
            onClick={() => router.push("/courses")}
            className="w-10 h-10 bg-white rounded-full border-2 border-[#E0DFD8] flex items-center justify-center"
          >
            <Search className="w-5 h-5 text-[#6B6B6B]" />
          </button>
        </div>

        {/* Course Cards */}
        <div className="space-y-3">
          {courses.map((course, index) => {
            const progress = courseProgress[course.id] || 0
            const isUnlocked = !course.isLocked || (index > 0 && (courseProgress[courses[index - 1].id] || 0) >= 100)

            return (
              <button
                key={course.id}
                onClick={() => isUnlocked && router.push(`/courses/${course.id}`)}
                disabled={!isUnlocked}
                className={`w-full ${course.color} rounded-sm p-5 text-left transition-all active:scale-[0.98] ${!isUnlocked ? "opacity-60" : ""
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${course.textColor} opacity-70`}>
                        {course.difficulty}
                      </span>
                      {progress > 0 && isUnlocked && (
                        <span className="text-xs font-bold text-[#00917A] bg-white/50 px-2 py-0.5 rounded-full">
                          {progress}%
                        </span>
                      )}
                    </div>
                    <h3 className={`font-[var(--font-unbounded)] text-xl font-bold ${course.textColor} mb-1`}>
                      {course.title}
                    </h3>
                    <p className={`text-sm ${course.textColor} opacity-70`}>
                      {course.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isUnlocked ? "bg-[#100F06]" : "bg-[#100F06]/30"
                    }`}>
                    {isUnlocked ? (
                      <ChevronRight className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
