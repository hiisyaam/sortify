"use client"

import { supabase } from "@/lib/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {

      setIsLoading(true)

      setErrors({})

      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {

        setErrors({
          email: "Email atau password salah",
        })

        return
      }

      router.push("/dashboard")

    } catch (error) {

      setErrors({
        email: "Terjadi kesalahan",
      })

    } finally {

      setIsLoading(false)

    }
  }

  return (
    <div className="min-h-screen bg-[#F5F4ED] px-5 py-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white border-2 border-[#E0DFD8] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-[#100F06]" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 bg-[#FFDA57] rounded-xl flex items-center justify-center font-bold">
          S
        </div>
        <span className="font-[var(--font-unbounded)] text-xl font-bold text-[#100F06]">Sortify</span>
      </div>

      {/* Title */}
      <h1 className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06] mb-1">
        Selamat Datang!
      </h1>
      <p className="text-[#6B6B6B] text-sm mb-6">
        Masuk untuk melanjutkan belajar
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#100F06]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="email"
                placeholder="nama@email.com"
                className="w-full h-12 pl-10 pr-4 bg-white rounded-2xl border-2 border-[#E0DFD8] text-[#100F06] placeholder:text-[#A0A0A0] focus:border-[#00917A] focus:outline-none transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-xs text-[#F47575]">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#100F06]">Password</label>
              <button type="button" className="text-xs text-[#00917A] font-medium">
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="w-full h-12 pl-10 pr-12 bg-white rounded-2xl border-2 border-[#E0DFD8] text-[#100F06] placeholder:text-[#A0A0A0] focus:border-[#00917A] focus:outline-none transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#6B6B6B]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#6B6B6B]" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-[#F47575]">{errors.password}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 pb-2 space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#00917A] text-white font-semibold text-base rounded-full shadow-playful active:translate-y-1 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Masuk..." : "Masuk"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-[#E0DFD8]" />
            <span className="text-xs text-[#6B6B6B]">atau</span>
            <div className="flex-1 h-px bg-[#E0DFD8]" />
          </div>

          <p className="text-center text-[#6B6B6B] text-sm mt-4">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#00917A] font-semibold">
              Daftar
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
