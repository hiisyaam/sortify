"use client"
import { supabase } from "@/lib/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { User } from "@/lib/types"
import { Flame, Star, Trophy, ChevronRight, Lock, Search, X, BookOpen } from "lucide-react"
import { OnboardingGuide } from "@/components/onboarding-guide"

const allCourses = [
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
  {
    id: "quick-sort",
    title: "Quick Sort",
    description: "Algoritma divide and conquer",
    color: "bg-[#FFBBF4]",
    textColor: "text-[#100F06]",
    difficulty: "Lanjutan",
    isLocked: true,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof allCourses>([])
  const [isSearching, setIsSearching] = useState(false)
  const [dailyChallenge, setDailyChallenge] = useState<{ courseId: string; title: string } | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

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

      const userData: User = {
        id: authUser.id,
        name: profile.username,
        email: profile.email,
        points: profile.points || 0,
        streak: profile.streak || 0,
        lives: profile.lives ?? 3,
        completedCourses: profile.completed_courses || [],
        last_activity_date: profile.last_activity_date || null,
      }
      setUser(userData)

      // Source of truth: DB → localStorage
      // Merge DB progress dengan localStorage (ambil yang lebih tinggi)
      let progress: Record<string, number> = {}
      const storedProgress = localStorage.getItem("sortify_progress")
      const localProgress = storedProgress ? JSON.parse(storedProgress) : {}
      const dbProgress = profile.course_progress || {}

      // Merge: ambil nilai tertinggi dari keduanya
      const allKeys = new Set([...Object.keys(localProgress), ...Object.keys(dbProgress)])
      allKeys.forEach(key => {
        progress[key] = Math.max(localProgress[key] || 0, dbProgress[key] || 0)
      })

      // Pastikan completed_courses juga tercermin dalam progress
      ;(profile.completed_courses || []).forEach((cId: string) => {
        progress[cId] = 100
      })

      // Simpan hasil merge ke localStorage
      localStorage.setItem("sortify_progress", JSON.stringify(progress))
      setCourseProgress(progress)

      // Tentukan tantangan harian: course pertama yang belum 100%
      const nextCourse = allCourses.find(c => (progress[c.id] || 0) < 100)
      if (nextCourse) {
        setDailyChallenge({ courseId: nextCourse.id, title: nextCourse.title })
      } else {
        setDailyChallenge(null)
      }

      // Cek apakah user baru (belum pernah lihat onboarding)
      const hasSeenOnboarding = localStorage.getItem(`sortify_onboarding_done_${authUser.id}`)
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
    }


    getUser()
  }, [router])

  // Search realtime
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const filtered = allCourses.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.difficulty.toLowerCase().includes(q)
    )
    setSearchResults(filtered)
  }, [searchQuery])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] flex items-center justify-center">
        <div className="w-10 h-10 bg-[#FFDA57] rounded-xl animate-pulse" />
      </div>
    )
  }

  const courses = allCourses
  const displayCourses = isSearching ? [] : courses

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`sortify_onboarding_done_${user.id}`, "true")
    }
    setShowOnboarding(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F4ED] pb-24">
      {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
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
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Cari course..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-10 bg-white rounded-2xl border-2 border-[#E0DFD8] text-[#100F06] placeholder:text-[#A0A0A0] focus:border-[#00917A] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-[#6B6B6B]" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearching && (
          <div className="bg-white rounded-2xl border-2 border-[#E0DFD8] mb-4 overflow-hidden shadow-lg">
            {searchResults.length === 0 ? (
              <div className="px-4 py-6 text-center text-[#6B6B6B] text-sm">
                Course tidak ditemukan
              </div>
            ) : (
              searchResults.map((course, index) => {
                const progress = courseProgress[course.id] || 0
                const isUnlocked = !course.isLocked || (index > 0 && (courseProgress[allCourses[allCourses.indexOf(course) - 1]?.id] || 0) >= 100)
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setSearchQuery("")
                        router.push(`/courses/${course.id}`)
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-[#E0DFD8] last:border-0 transition-colors ${isUnlocked ? "active:bg-[#F5F4ED]" : "opacity-50"}`}
                  >
                    <div className={`w-10 h-10 ${course.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {isUnlocked ? (
                        <ChevronRight className="w-5 h-5 text-[#100F06]" />
                      ) : (
                        <Lock className="w-4 h-4 text-[#100F06]" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-[#100F06] text-sm">{course.title}</p>
                      <p className="text-xs text-[#6B6B6B]">{course.difficulty} • {course.description}</p>
                      {progress > 0 && (
                        <div className="mt-1 h-1 bg-[#E0DFD8] rounded-full overflow-hidden w-24">
                          <div className="h-full bg-[#00917A] rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                    {progress >= 100 && (
                      <span className="text-xs font-bold text-[#00917A] bg-[#00917A]/10 px-2 py-0.5 rounded-full">Selesai</span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-sm p-4 border-2 border-[#E0DFD8]">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-[#F47575]" />
              <span className="text-xs text-[#6B6B6B]">Streak</span>
            </div>
            <p className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06]">{user.streak}</p>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5">hari berturut</p>
          </div>
          <div className="flex-1 bg-white rounded-sm p-4 border-2 border-[#E0DFD8]">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-[#00917A]" />
              <span className="text-xs text-[#6B6B6B]">Course Selesai</span>
            </div>
            <p className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06]">
              {Object.values(courseProgress).filter(p => p >= 100).length}
            </p>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5">dari {allCourses.length} course</p>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="px-5 mb-6">
        {dailyChallenge ? (
          <div className="bg-[#00917A] rounded-sm p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-[#FFDA57]" />
                <span className="text-sm font-medium text-white/80">Tantangan Harian</span>
              </div>
              <p className="font-[var(--font-unbounded)] text-base font-bold text-white mb-1">
                Selesaikan {dailyChallenge.title}
              </p>
              <p className="text-xs text-white/70 mb-3">
                Lanjutkan progress belajarmu hari ini!
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Bonus: +50 poin</span>
                <button
                  onClick={() => router.push(`/courses/${dailyChallenge.courseId}`)}
                  className="bg-white text-[#00917A] font-semibold text-sm px-4 py-2 rounded-full active:scale-95 transition-transform"
                >
                  Mulai
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#00917A]/10 rounded-sm p-5 border-2 border-[#00917A]/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[#00917A]" />
              <span className="text-sm font-medium text-[#00917A]">Tantangan Harian</span>
            </div>
            <p className="font-[var(--font-unbounded)] text-base font-bold text-[#100F06]">
              Semua course selesai! 🎉
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Kamu sudah menyelesaikan semua tantangan. Luar biasa!
            </p>
          </div>
        )}
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
          {displayCourses.map((course, index) => {
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
                          {progress >= 100 ? "Selesai ✓" : `${progress}%`}
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
