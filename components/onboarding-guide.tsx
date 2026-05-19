"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  ArrowRight,
  ArrowLeft,
  Star,
  Flame,
  Trophy,
  BookOpen,
  User,
  ChevronRight,
  Zap,
  CheckCircle,
} from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  highlight?: string // CSS selector to highlight
  action?: string // what the user should do
  actionLabel?: string
  color: string
  emoji: string
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Selamat datang di Sortify! 🎉",
    description:
      "Sortify adalah platform belajar algoritma sorting yang seru dan interaktif. Kamu akan belajar sambil bermain game! Yuk, kita kenalan dulu sama fitur-fiturnya.",
    icon: <Zap className="w-8 h-8" />,
    color: "#FFDA57",
    emoji: "🚀",
  },
  {
    id: "stats",
    title: "Pantau progresmu",
    description:
      "Di bagian atas dashboard, kamu bisa lihat Streak harian dan jumlah Course yang sudah kamu selesaikan. Streak bertambah setiap kamu belajar hari ini!",
    icon: <Flame className="w-8 h-8" />,
    highlight: "stats-row",
    action: "Lihat statistikmu di atas!",
    color: "#F47575",
    emoji: "🔥",
  },
  {
    id: "daily-challenge",
    title: "Tantangan Harian",
    description:
      "Setiap hari ada Tantangan Harian yang menunggumu! Selesaikan untuk dapat bonus +50 poin. Ini cara terbaik untuk membangun kebiasaan belajar.",
    icon: <Trophy className="w-8 h-8" />,
    highlight: "daily-challenge",
    action: "Coba klik tombol 'Mulai' pada tantangan harian!",
    color: "#00917A",
    emoji: "🏆",
  },
  {
    id: "courses",
    title: "Pilih Game untuk Dimainkan",
    description:
      "Di bagian 'Pick Game To Play', kamu bisa pilih algoritma mana yang mau dipelajari. Mulai dari Bubble Sort, lalu unlock course berikutnya setelah selesai!",
    icon: <BookOpen className="w-8 h-8" />,
    highlight: "course-cards",
    action: "Scroll ke bawah dan klik card Bubble Sort!",
    color: "#7DCAF6",
    emoji: "📚",
  },
  {
    id: "points",
    title: "Kumpulkan Poin & Level Up",
    description:
      "Setiap kali selesai mini-game, kamu dapat poin! Kumpulkan poin untuk naik level. Semakin tinggi levelmu, semakin ahli kamu di algoritma sorting.",
    icon: <Star className="w-8 h-8" />,
    color: "#A293FF",
    emoji: "⭐",
  },
  {
    id: "profile",
    title: "Cek Profil & Pencapaian",
    description:
      "Kunjungi halaman Profil untuk lihat semua pencapaian (achievement) yang sudah kamu raih, riwayat belajar, dan progress levelmu. Ada juga panduan lengkap di sana!",
    icon: <User className="w-8 h-8" />,
    color: "#FFBBF4",
    emoji: "🎖️",
  },
  {
    id: "ready",
    title: "Siap belajar? Yuk mulai! 🎮",
    description:
      "Kamu sudah siap! Ingat, konsistensi adalah kunci. Belajar sedikit setiap hari lebih baik dari belajar banyak tapi jarang. Semangat! 💪",
    icon: <CheckCircle className="w-8 h-8" />,
    color: "#00917A",
    emoji: "✅",
  },
]

export function OnboardingGuide({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")

  const step = steps[currentStep]
  const isLast = currentStep === steps.length - 1

  const goNext = () => {
    if (isAnimating) return
    setDirection("next")
    setIsAnimating(true)
    setTimeout(() => {
      if (isLast) {
        onComplete()
      } else {
        setCurrentStep((s) => s + 1)
        setIsAnimating(false)
      }
    }, 200)
  }

  const goPrev = () => {
    if (isAnimating || currentStep === 0) return
    setDirection("prev")
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep((s) => s - 1)
      setIsAnimating(false)
    }, 200)
  }

  const skip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative w-full max-w-[430px] rounded-t-3xl overflow-hidden"
        style={{
          background: "#FFFEF5",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Color accent bar */}
        <div
          className="h-1.5 w-full transition-all duration-500"
          style={{ background: step.color }}
        />

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-4 pb-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentStep ? 24 : 8,
                height: 8,
                background: i === currentStep ? step.color : "#E0DFD8",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div
          className="px-6 pt-4 pb-8"
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating
              ? direction === "next"
                ? "translateX(-20px)"
                : "translateX(20px)"
              : "translateX(0)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          {/* Emoji icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
            style={{ background: step.color + "33" }}
          >
            {step.emoji}
          </div>

          <h2 className="font-[var(--font-unbounded)] text-xl font-bold text-[#100F06] mb-3 leading-tight">
            {step.title}
          </h2>
          <p className="text-[#4A4A4A] text-sm leading-relaxed mb-2">
            {step.description}
          </p>

          {step.action && (
            <div
              className="mt-4 p-3 rounded-xl border-2 flex items-center gap-2"
              style={{ borderColor: step.color, background: step.color + "20" }}
            >
              <ChevronRight
                className="w-4 h-4 flex-shrink-0"
                style={{ color: step.color }}
              />
              <p className="text-xs font-semibold text-[#100F06]">
                {step.action}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-8 flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            className="w-12 h-12 rounded-full border-2 border-[#E0DFD8] flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
          >
            <ArrowLeft className="w-5 h-5 text-[#6B6B6B]" />
          </button>

          <button
            onClick={skip}
            className="text-xs text-[#A0A0A0] underline underline-offset-2 px-2"
          >
            Lewati panduan
          </button>

          <button
            onClick={goNext}
            className="flex-1 max-w-[160px] h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
            style={{
              background: step.color,
              color: "#100F06",
            }}
          >
            {isLast ? (
              <>
                Mulai Belajar! <Zap className="w-4 h-4" />
              </>
            ) : (
              <>
                Lanjut <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Step counter */}
        <p className="text-center text-xs text-[#A0A0A0] pb-4">
          {currentStep + 1} dari {steps.length}
        </p>
      </div>
    </div>
  )
}
