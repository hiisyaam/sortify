"use client"

import {
  BookOpen,
  ChevronRight,
  Flame,
  Star,
  Trophy,
  User,
  Zap,
  Target,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  MessageCircle,
  Lock,
  Heart,
  BarChart2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"

interface GuideSection {
  id: string
  emoji: string
  title: string
  color: string
  items: { title: string; desc: string }[]
}

const sections: GuideSection[] = [
  {
    id: "dashboard",
    emoji: "🏠",
    title: "Dashboard",
    color: "#FFDA57",
    items: [
      {
        title: "Statistik Streak & Course",
        desc: "Di bagian atas, kamu bisa lihat berapa hari kamu belajar berturut-turut (streak) dan berapa course yang sudah selesai.",
      },
      {
        title: "Tantangan Harian",
        desc: "Setiap hari ada tantangan harian. Selesaikan untuk dapat bonus +50 poin ekstra!",
      },
      {
        title: "Pick Game To Play",
        desc: "Scroll ke bawah untuk melihat daftar course. Klik card course untuk mulai belajar. Course terkunci akan terbuka otomatis setelah kamu selesaikan course sebelumnya.",
      },
      {
        title: "Pencarian Course",
        desc: "Gunakan kotak pencarian untuk mencari course berdasarkan nama, tingkat kesulitan, atau deskripsi.",
      },
    ],
  },
  {
    id: "courses",
    emoji: "📚",
    title: "Cara Belajar Course",
    color: "#7DCAF6",
    items: [
      {
        title: "1. Intro — Kenalan dulu",
        desc: "Baca penjelasan singkat tentang algoritma. Pahami konsep dasarnya sebelum lanjut.",
      },
      {
        title: "2. Visualisasi — Lihat cara kerjanya",
        desc: "Tonton animasi visual bagaimana algoritma bekerja langkah demi langkah. Kamu bisa atur kecepatan animasi.",
      },
      {
        title: "3. Challenge — Uji kemampuanmu",
        desc: "Selesaikan mini-game: susun elemen sesuai urutan yang benar. Kamu punya 3 nyawa — hati-hati!",
      },
    ],
  },
  {
    id: "points",
    emoji: "⭐",
    title: "Sistem Poin & Level",
    color: "#A293FF",
    items: [
      {
        title: "Cara Dapat Poin",
        desc: "Selesaikan mini-game challenge untuk dapat poin. Semakin cepat dan tepat, semakin besar poinmu.",
      },
      {
        title: "Sistem Level",
        desc: "Poin yang terkumpul menentukan levelmu. Level 1: 0-99 poin, Level 2: 100-299 poin, dan seterusnya.",
      },
      {
        title: "Tantangan Harian",
        desc: "Selesaikan tantangan harian untuk bonus +50 poin tambahan di atas poin normal.",
      },
    ],
  },
  {
    id: "streak",
    emoji: "🔥",
    title: "Streak Harian",
    color: "#F47575",
    items: [
      {
        title: "Apa itu Streak?",
        desc: "Streak adalah jumlah hari berturut-turut kamu belajar di Sortify. Misalnya streak 7 artinya kamu sudah belajar 7 hari berturut-turut.",
      },
      {
        title: "Cara Jaga Streak",
        desc: "Selesaikan minimal 1 sesi belajar setiap hari. Streak akan bertambah otomatis ketika kamu aktif belajar.",
      },
      {
        title: "Achievement Streak",
        desc: "Raih streak 3 hari untuk dapat badge 'Konsisten', dan streak 7 hari untuk badge 'Seminggu Penuh'!",
      },
    ],
  },
  {
    id: "lives",
    emoji: "❤️",
    title: "Sistem Nyawa",
    color: "#FFBBF4",
    items: [
      {
        title: "Nyawa dalam Challenge",
        desc: "Saat bermain mini-game, kamu punya 3 nyawa. Setiap jawaban salah mengurangi 1 nyawa.",
      },
      {
        title: "Habis Nyawa",
        desc: "Jika nyawa habis, kamu harus menunggu cooldown sebelum bisa coba lagi. Tenang, ini bukan akhir!",
      },
      {
        title: "Regenerasi Nyawa",
        desc: "Nyawa akan pulih seiring waktu. Gunakan nyawamu dengan bijak!",
      },
    ],
  },
  {
    id: "achievements",
    emoji: "🏆",
    title: "Pencapaian (Achievement)",
    color: "#00917A",
    items: [
      {
        title: "Lihat Pencapaian",
        desc: "Buka tab 'Pencapaian' di halaman Profil untuk lihat semua badge yang sudah kamu raih dan yang belum.",
      },
      {
        title: "Daftar Achievement",
        desc: "Ada 6 achievement: Langkah Pertama, Pelajar Rajin, Konsisten, Seminggu Penuh, Kolektor Poin, dan Master Poin.",
      },
    ],
  },
]

export default function GuidePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F5F4ED] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full border-2 border-[#E0DFD8] flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#100F06]" />
          </button>
          <div>
            <h1 className="font-[var(--font-unbounded)] text-xl font-bold text-[#100F06]">
              Panduan
            </h1>
            <p className="text-xs text-[#6B6B6B]">Cara menggunakan Sortify</p>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-[#100F06] rounded-2xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDA57]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="text-3xl mb-2">📖</div>
            <h2 className="font-[var(--font-unbounded)] text-base font-bold text-white mb-1">
              Panduan Lengkap Sortify
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Semua yang perlu kamu tahu untuk memaksimalkan pengalaman belajar di Sortify.
            </p>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
              }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-[#100F06] border-2 border-[#E0DFD8] bg-white active:scale-95 transition-transform"
            >
              <span>{s.emoji}</span>
              {s.title}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} id={section.id}>
              {/* Section Header */}
              <div
                className="rounded-2xl p-4 mb-3 flex items-center gap-3"
                style={{ background: section.color + "30" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: section.color }}
                >
                  {section.emoji}
                </div>
                <h2 className="font-[var(--font-unbounded)] font-bold text-[#100F06] text-base">
                  {section.title}
                </h2>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border-2 border-[#E0DFD8]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: section.color }}
                      />
                      <div>
                        <p className="font-semibold text-[#100F06] text-sm mb-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#6B6B6B] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-[#00917A]/10 border-2 border-[#00917A]/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="font-semibold text-[#100F06]">Tips Belajar Efektif</h3>
          </div>
          <ul className="space-y-2">
            {[
              "Belajar konsisten setiap hari meski hanya 10–15 menit",
              "Mulai dari Bubble Sort sebelum lanjut ke yang lebih sulit",
              "Tonton visualisasi dulu sebelum mencoba challenge",
              "Jangan takut salah — nyawa bisa dipulihkan!",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#00917A] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#4A4A4A] leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-[#A0A0A0] mt-6">Sortify v1.0.0</p>
      </div>

      <BottomNav />
    </div>
  )
}
