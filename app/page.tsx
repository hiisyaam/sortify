"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#F5F4ED] px-6 py-8 flex flex-col">
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-[#100F06] rounded-full opacity-20" />
      <div className="absolute top-12 right-8 w-4 h-4 bg-[#FFDA57] rounded-full" />
      <div className="absolute top-24 left-12 text-2xl opacity-30 font-display">~</div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Mascot Area */}
        <div className="flex items-end justify-center gap-2 h-24 my-6">
          <div className="w-6 h-10 bg-[#6C63FF] rounded-t-xl animate-pulse" />

          <div className="w-6 h-20 bg-[#FF6B6B] rounded-t-xl -translate-y-2 transition-all duration-500" />

          <div className="w-6 h-14 bg-[#4ECDC4] rounded-t-xl" />

          <div className="w-6 h-24 bg-[#FFD166] rounded-t-xl animate-bounce" />

          <div className="w-6 h-16 bg-[#A78BFA] rounded-t-xl" />
        </div>

        {/* Title */}
        <h1 className="font-[var(--font-unbounded)] text-[28px] font-bold text-[#100F06] leading-tight text-center mb-3">
          Belajar Sorting
          <br />
          Jadi Seru!
        </h1>

        {/* Description */}
        <p className="text-[#6B6B6B] text-center text-sm leading-relaxed max-w-[260px]">
          Pahami algoritma sorting dengan visualisasi interaktif dan game puzzle yang menyenangkan
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pb-4">
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 w-full bg-[#00917A] text-white font-semibold text-base py-4 rounded-full shadow-playful active:translate-y-1 active:shadow-none transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link
          href="/login"
          className="flex items-center justify-center w-full bg-white text-[#100F06] font-medium text-base py-4 rounded-full border-2 border-[#E0DFD8] active:bg-[#F5F4ED] transition-all"
        >
          Sudah punya akun? Masuk
        </Link>
      </div>
    </div>
  )
}
