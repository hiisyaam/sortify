"use client"

import { supabase } from "@/lib/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Username harus diisi"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok"
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

      // cek username
      const { data: existingUsername } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", formData.name)
        .single()

      if (existingUsername) {
        setErrors({
          name: "Username sudah ada yang punya",
        })

        setIsLoading(false)
        return
      }

      // cek email
      const { data: existingEmail } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", formData.email)
        .single()

      if (existingEmail) {
        setErrors({
          email: "Email sudah terdaftar",
        })

        setIsLoading(false)
        return
      }

      // register auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setErrors({
          email: error.message,
        })

        setIsLoading(false)
        return
      }

      // insert profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user?.id,
          username: formData.name,
          email: formData.email,
        })

      if (profileError) {
        setErrors({
          email: profileError.message,
        })

        setIsLoading(false)
        return
      }

      router.push("/login")

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
        Buat Akun Baru
      </h1>
      <p className="text-[#6B6B6B] text-sm mb-6">
        Mulai perjalanan belajarmu
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#100F06]">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Masukkan nama"
                className="w-full h-12 pl-10 pr-4 bg-white rounded-2xl border-2 border-[#E0DFD8] text-[#100F06] placeholder:text-[#A0A0A0] focus:border-[#00917A] focus:outline-none transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {errors.name && <p className="text-xs text-[#F47575]">{errors.name}</p>}
          </div>

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
            <label className="text-sm font-medium text-[#100F06]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#100F06]">Konfirmasi Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ulangi password"
                className="w-full h-12 pl-10 pr-4 bg-white rounded-2xl border-2 border-[#E0DFD8] text-[#100F06] placeholder:text-[#A0A0A0] focus:border-[#00917A] focus:outline-none transition-colors"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-[#F47575]">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 pb-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#00917A] text-white font-semibold text-base rounded-full shadow-playful active:translate-y-1 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>

          <p className="text-center text-[#6B6B6B] text-sm mt-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#00917A] font-semibold">
              Masuk
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
