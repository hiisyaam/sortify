"use client"

import { supabase } from "@/lib/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { User } from "@/lib/types"
import {
  Mail,
  Flame,
  Star,
  Trophy,
  Settings,
  ChevronRight,
  LogOut,
  Heart,
  BookOpen
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
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

      const { data: profile } = await supabase
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
        points: 0,
        streak: 0,
        lives: 3,
      })

      const storedProgress = localStorage.getItem("sortify_progress")

      if (storedProgress) {
        setCourseProgress(JSON.parse(storedProgress))
      }
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("sortify_progress")
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
  const level = Math.floor(user.points / 100) + 1
  const levelProgress = user.points % 100

  const menuItems = [
    { icon: Settings, label: "Pengaturan", color: "bg-[#E0DFD8]" },
    { icon: Trophy, label: "Pencapaian", color: "bg-[#FFDA57]" },
    { icon: BookOpen, label: "Riwayat Belajar", color: "bg-[#7DCAF6]" },
  ]

  return (
    <div className="min-h-screen bg-[#F5F4ED] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06] mb-6">
          See Other
          <br />
          People Rank
        </h1>

        {/* Rank Tabs */}
        <div className="flex gap-2 mb-6">
          <button className="flex-1 bg-[#00917A] text-white py-2.5 rounded-full font-semibold text-sm">
            Global Rank
          </button>
          <button className="flex-1 bg-white text-[#6B6B6B] py-2.5 rounded-full font-semibold text-sm border-2 border-[#E0DFD8]">
            Friend Rank
          </button>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2 mb-6">
          {[
            { rank: 1, name: "Jaka Manterna", pts: "5,4 Million", color: "bg-[#FFDA57]" },
            { rank: 2, name: "Hannah Bunny", pts: "5,3 Million", color: "bg-[#E0DFD8]" },
            { rank: 3, name: "Victoria Patricia", pts: "5,2 Million", color: "bg-[#F47575]/30" },
          ].map((item) => (
            <div
              key={item.rank}
              className={`${item.color} rounded-2xl p-4 flex items-center gap-3`}
            >
              <span className="font-[var(--font-unbounded)] text-lg font-bold text-[#100F06]">
                {item.rank}th
              </span>
              <div className="w-10 h-10 bg-white rounded-full" />
              <div className="flex-1">
                <p className="font-semibold text-[#100F06] text-sm">{item.name}</p>
              </div>
              <span className="font-bold text-[#100F06] text-sm">{item.pts}</span>
            </div>
          ))}

          {/* Current User */}
          <div className="bg-[#7DCAF6] rounded-2xl p-4 flex items-center gap-3 border-2 border-[#100F06]">
            <span className="font-[var(--font-unbounded)] text-lg font-bold text-[#100F06]">
              {level}th
            </span>
            <div className="w-10 h-10 bg-[#FFDA57] rounded-full flex items-center justify-center">
              <span className="font-bold text-[#100F06]">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#100F06] text-sm">You</p>
            </div>
            <span className="font-bold text-[#100F06] text-sm">{user.points.toLocaleString()}</span>
          </div>
        </div>
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
              <span className="text-sm font-medium text-[#100F06]">Level {level}</span>
              <span className="text-xs text-[#6B6B6B]">{levelProgress}/100 XP</span>
            </div>
            <div className="h-3 bg-[#E0DFD8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00917A] rounded-full transition-all"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={index}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border-2 border-[#E0DFD8] active:bg-[#F5F4ED] transition-colors"
            >
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-[#100F06]" />
              </div>
              <span className="flex-1 text-left font-medium text-[#100F06]">
                {item.label}
              </span>
              <ChevronRight className="w-5 h-5 text-[#6B6B6B]" />
            </button>
          )
        })}

        {/* Logout Button */}
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
