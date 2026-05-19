"use client"

import { supabase } from "@/lib/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { LearningHistory } from "@/lib/types"
import {
  Mail,
  Flame,
  Star,
  Trophy,
  ChevronRight,
  LogOut,
  Heart,
  BookOpen,
  Lock,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Award,
  TrendingUp,
  HelpCircle,
} from "lucide-react"

// Level system: threshold XP untuk naik level
function getLevelInfo(points: number) {
  // Level 1: 0-99, Level 2: 100-299, Level 3: 300-599, Level 4: 600-999, ...
  // threshold(n) = n*(n+1)/2 * 100 - 100 untuk n>=1
  let level = 1
  let threshold = 100
  let prevThreshold = 0
  while (points >= threshold) {
    prevThreshold = threshold
    level++
    threshold += level * 100
  }
  const xpInLevel = points - prevThreshold
  const xpNeeded = threshold - prevThreshold
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))
  return { level, xpInLevel, xpNeeded, progressPercent }
}

interface Achievement {
  id: string
  label: string
  description: string
  icon: string
  condition: (data: AchievementData) => boolean
  color: string
}

interface AchievementData {
  points: number
  streak: number
  completedCount: number
  historyCount: number
}

const achievements: Achievement[] = [
  {
    id: 'first-course',
    label: 'Langkah Pertama',
    description: 'Selesaikan 1 course',
    icon: '🎯',
    condition: d => d.completedCount >= 1,
    color: 'bg-[#FFDA57]/20',
  },
  {
    id: 'three-courses',
    label: 'Pelajar Rajin',
    description: 'Selesaikan 3 course',
    icon: '📚',
    condition: d => d.completedCount >= 3,
    color: 'bg-[#7DCAF6]/20',
  },
  {
    id: 'streak-3',
    label: 'Konsisten',
    description: 'Raih streak 3 hari',
    icon: '🔥',
    condition: d => d.streak >= 3,
    color: 'bg-[#F47575]/20',
  },
  {
    id: 'streak-7',
    label: 'Seminggu Penuh',
    description: 'Raih streak 7 hari',
    icon: '⚡',
    condition: d => d.streak >= 7,
    color: 'bg-[#A293FF]/20',
  },
  {
    id: 'points-100',
    label: 'Kolektor Poin',
    description: 'Kumpulkan 100 poin',
    icon: '⭐',
    condition: d => d.points >= 100,
    color: 'bg-[#FFDA57]/20',
  },
  {
    id: 'points-500',
    label: 'Master Poin',
    description: 'Kumpulkan 500 poin',
    icon: '💎',
    condition: d => d.points >= 500,
    color: 'bg-[#00917A]/20',
  },
]

const courseColors: Record<string, string> = {
  'bubble-sort': 'bg-[#FFDA57]',
  'selection-sort': 'bg-[#7DCAF6]',
  'insertion-sort': 'bg-[#A293FF]',
  'quick-sort': 'bg-[#FFBBF4]',
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState<'achievements' | 'history'>('achievements')
  const [learningHistory, setLearningHistory] = useState<LearningHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

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

      if (!profile) {
        router.push("/login")
        return
      }

      setUser({
        id: authUser.id,
        name: profile.username,
        email: profile.email,
        points: profile.points || 0,
        streak: profile.streak || 0,
        lives: profile.lives ?? 3,
        completedCourses: profile.completed_courses || [],
        last_activity_date: profile.last_activity_date || null,
      })

      // Sync course_progress dari DB (source of truth)
      const storedProgress = localStorage.getItem("sortify_progress")
      const localProgress = storedProgress ? JSON.parse(storedProgress) : {}
      const dbProgress = profile.course_progress || {}
      const mergedProgress: Record<string, number> = {}
      const allKeys = new Set([...Object.keys(localProgress), ...Object.keys(dbProgress)])
      allKeys.forEach(key => {
        mergedProgress[key] = Math.max(localProgress[key] || 0, dbProgress[key] || 0)
      })
      ;(profile.completed_courses || []).forEach((cId: string) => {
        mergedProgress[cId] = 100
      })
      localStorage.setItem("sortify_progress", JSON.stringify(mergedProgress))
      setCourseProgress(mergedProgress)


      // Fetch riwayat belajar
      setLoadingHistory(true)
      const { data: history } = await supabase
        .from("learning_history")
        .select("*")
        .eq("user_id", authUser.id)
        .order("completed_at", { ascending: false })
        .limit(20)

      if (history) setLearningHistory(history)
      setLoadingHistory(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    // Invalidate token secara menyeluruh (server-side) dengan scope 'global'
    // Ini memastikan refresh token juga dicabut, bukan hanya sesi lokal
    await supabase.auth.signOut({ scope: 'global' })
    // Jangan hapus sortify_progress — sudah persistent di database
    // Hapus hanya data sementara (cooldown & session cache)
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('sortify_cooldown_') ||
        key.startsWith('sb-') ||
        key.includes('supabase')
      )) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    router.push("/login")
  }


  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] flex items-center justify-center">
        <div className="w-10 h-10 bg-[#FFDA57] rounded-xl animate-pulse" />
      </div>
    )
  }

  const completedCourses = Object.values(courseProgress).filter(p => p >= 100).length
  const { level, xpInLevel, xpNeeded, progressPercent } = getLevelInfo(user.points)

  const achievementData: AchievementData = {
    points: user.points,
    streak: user.streak,
    completedCount: completedCourses,
    historyCount: learningHistory.length,
  }

  const unlockedAchievements = achievements.filter(a => a.condition(achievementData))
  const lockedAchievements = achievements.filter(a => !a.condition(achievementData))

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#F5F4ED] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06] mb-6">
          Profil
          <br />
          Saya
        </h1>

        {/* Tabs: Pencapaian | Riwayat */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'achievements'
              ? "bg-[#00917A] text-white"
              : "bg-white text-[#6B6B6B] border-2 border-[#E0DFD8]"
              }`}
          >
            <Trophy className="w-4 h-4" />
            Pencapaian
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'history'
              ? "bg-[#00917A] text-white"
              : "bg-white text-[#6B6B6B] border-2 border-[#E0DFD8]"
              }`}
          >
            <Clock className="w-4 h-4" />
            Riwayat
          </button>
        </div>

        {/* TAB: Pencapaian */}
        {activeTab === 'achievements' && (
          <div className="space-y-2 mb-6">
            {/* Unlocked achievements */}
            {unlockedAchievements.length > 0 && (
              <>
                <p className="text-xs font-semibold text-[#00917A] mb-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Sudah Diraih ({unlockedAchievements.length})
                </p>
                {unlockedAchievements.map(a => (
                  <div
                    key={a.id}
                    className={`${a.color} rounded-2xl p-4 flex items-center gap-3 border-2 border-[#00917A]/20`}
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#100F06] text-sm">{a.label}</p>
                      <p className="text-xs text-[#6B6B6B]">{a.description}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-[#00917A]" />
                  </div>
                ))}
              </>
            )}

            {/* Locked achievements */}
            {lockedAchievements.length > 0 && (
              <>
                <p className="text-xs font-semibold text-[#6B6B6B] mt-4 mb-2 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Belum Diraih ({lockedAchievements.length})
                </p>
                {lockedAchievements.map(a => (
                  <div
                    key={a.id}
                    className="bg-[#E0DFD8]/50 rounded-2xl p-4 flex items-center gap-3 border-2 border-[#E0DFD8]"
                  >
                    <span className="text-2xl opacity-30">{a.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#6B6B6B] text-sm">{a.label}</p>
                      <p className="text-xs text-[#A0A0A0]">{a.description}</p>
                    </div>
                    <Lock className="w-4 h-4 text-[#A0A0A0]" />
                  </div>
                ))}
              </>
            )}

            {unlockedAchievements.length === 0 && (
              <div className="text-center py-8 text-[#6B6B6B]">
                <Award className="w-12 h-12 mx-auto mb-3 text-[#E0DFD8]" />
                <p className="text-sm">Mulai belajar untuk meraih pencapaian!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Riwayat Belajar */}
        {activeTab === 'history' && (
          <div className="space-y-2 mb-6">
            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 bg-[#FFDA57] rounded-xl animate-pulse" />
              </div>
            ) : learningHistory.length === 0 ? (
              <div className="text-center py-8 text-[#6B6B6B]">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-[#E0DFD8]" />
                <p className="text-sm">Belum ada riwayat belajar.</p>
                <p className="text-xs text-[#A0A0A0] mt-1">Selesaikan course pertamamu!</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-[#6B6B6B] mb-2">
                  {learningHistory.length} sesi belajar
                </p>
                {learningHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`${courseColors[item.course_id] || 'bg-[#E0DFD8]'} rounded-2xl p-4 flex items-center gap-3`}
                  >
                    <div className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-[#100F06]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#100F06] text-sm">{item.course_title}</p>
                      <p className="text-xs text-[#100F06]/60">{formatDate(item.completed_at)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#100F06]/60" />
                      <span className="text-sm font-bold text-[#100F06]">+{item.points_earned}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-sm p-5 border-2 border-[#E0DFD8]">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-[#FFDA57] rounded-2xl flex items-center justify-center">
              <span className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06]">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-[var(--font-unbounded)] text-lg font-bold text-[#100F06]">
                {user.name}
              </h2>
              <div className="flex items-center gap-1 text-[#6B6B6B]">
                <span className="text-xs truncate">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#FFDA57]/20 rounded-sm p-3 text-center">
              <Star className="w-5 h-5 text-[#FFDA57] mx-auto mb-1" />
              <p className="font-bold text-[#100F06] text-sm">{user.points}</p>
              <p className="text-[10px] text-[#6B6B6B]">Poin</p>
            </div>
            <div className="bg-[#F47575]/20 rounded-sm p-3 text-center">
              <Flame className="w-5 h-5 text-[#F47575] mx-auto mb-1" />
              <p className="font-bold text-[#100F06] text-sm">{user.streak}</p>
              <p className="text-[10px] text-[#6B6B6B]">Streak</p>
            </div>
            <div className="bg-[#FFBBF4]/30 rounded-sm p-3 text-center">
              <Heart className="w-5 h-5 text-[#F47575] mx-auto mb-1" />
              <p className="font-bold text-[#100F06] text-sm">{user.lives}</p>
              <p className="text-[10px] text-[#6B6B6B]">Nyawa</p>
            </div>
            <div className="bg-[#00917A]/20 rounded-sm p-3 text-center">
              <Trophy className="w-5 h-5 text-[#00917A] mx-auto mb-1" />
              <p className="font-bold text-[#100F06] text-sm">{completedCourses}</p>
              <p className="text-[10px] text-[#6B6B6B]">Course</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-4 pt-4 border-t-2 border-[#E0DFD8]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFDA57]" />
                <span className="text-sm font-bold text-[#100F06]">Level {level}</span>
              </div>
              <span className="text-xs text-[#6B6B6B]">{xpInLevel} / {xpNeeded} XP</span>
            </div>
            <div className="h-3 bg-[#E0DFD8] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00917A] to-[#7DCAF6] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#6B6B6B] mt-1">
              Butuh {xpNeeded - xpInLevel} XP lagi untuk Level {level + 1}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-sm p-5 border-2 border-[#E0DFD8]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#00917A]" />
            <h3 className="font-semibold text-[#100F06]">Analitik Pembelajaran</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#F5F4ED] rounded-xl p-3">
              <p className="font-bold text-[#100F06] text-lg">{learningHistory.length}</p>
              <p className="text-[10px] text-[#6B6B6B]">Sesi Belajar</p>
            </div>
            <div className="bg-[#F5F4ED] rounded-xl p-3">
              <p className="font-bold text-[#100F06] text-lg">{unlockedAchievements.length}</p>
              <p className="text-[10px] text-[#6B6B6B]">Pencapaian</p>
            </div>
            <div className="bg-[#F5F4ED] rounded-xl p-3">
              <p className="font-bold text-[#100F06] text-lg">{completedCourses}</p>
              <p className="text-[10px] text-[#6B6B6B]">Selesai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings & Actions */}
      <div className="px-5 space-y-2">
        {/* Panduan */}
        <button
          onClick={() => router.push('/guide')}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border-2 border-[#E0DFD8] active:bg-[#F5F4ED] transition-colors"
        >
          <div className="w-10 h-10 bg-[#7DCAF6]/20 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#7DCAF6]" />
          </div>
          <span className="flex-1 text-left font-medium text-[#100F06]">
            Panduan Penggunaan
          </span>
          <ChevronRight className="w-4 h-4 text-[#A0A0A0]" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#F47575]/10 rounded-2xl p-4 flex items-center gap-3 border-2 border-[#F47575]/30 active:bg-[#F47575]/20 transition-colors"
        >
          <div className="w-10 h-10 bg-[#F47575]/20 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-[#F47575]" />
          </div>
          <span className="flex-1 text-left font-medium text-[#F47575]">
            Keluar
          </span>
        </button>
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-[#6B6B6B] mt-6">
        Sortify v1.0.0
      </p>

      <BottomNav />
    </div>
  )
}
