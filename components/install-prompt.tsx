"use client"

import { useState, useEffect } from "react"
import { Download, X, Share, Smartphone } from "lucide-react"

const DISMISSED_KEY = "sortify_install_dismissed_at"
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000 // 3 hari, bukan selamanya

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Cek apakah sudah berjalan sebagai standalone (sudah diinstall)
    const standsAlone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    setIsStandalone(standsAlone)
    if (standsAlone) return

    // Cek apakah dismiss masih berlaku (3 hari)
    const dismissedAt = localStorage.getItem(DISMISSED_KEY)
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10)
      if (elapsed < DISMISS_COOLDOWN_MS) return
      // Cooldown habis → hapus flag agar bisa muncul lagi
      localStorage.removeItem(DISMISSED_KEY)
    }

    // Deteksi iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      // iOS tidak punya beforeinstallprompt → tampilkan manual setelah 4 detik
      const timer = setTimeout(() => setShowPrompt(true), 4000)
      return () => clearTimeout(timer)
    }

    // Untuk Chrome/Android: tangkap event beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Tampilkan setelah 3 detik supaya tidak mengganggu saat pertama buka
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Fallback: jika setelah 8 detik event belum muncul di non-iOS,
    // kemungkinan browser sudah mendeteksi PWA tapi event tertunda.
    // Tampilkan prompt manual sebagai fallback.
    const fallbackTimer = setTimeout(() => {
      setShowPrompt((current) => {
        // Hanya tampilkan fallback jika belum ada prompt dari event
        if (!current) return true
        return current
      })
    }, 8000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      clearTimeout(fallbackTimer)
    }
  }, [])

  if (isStandalone || !showPrompt) return null

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setShowPrompt(false)
        setDeferredPrompt(null)
        return
      }
      setDeferredPrompt(null)
    }
    // Jika tidak ada deferredPrompt (fallback / iOS), dismiss saja
    handleDismiss()
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString())
    setShowPrompt(false)
  }

  return (
    <div
      className="fixed bottom-20 left-0 right-0 px-4 z-50"
      style={{ animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="bg-[#100F06] text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex flex-row items-center gap-3 relative overflow-hidden max-w-[430px] mx-auto">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFDA57]/5 rounded-full -translate-y-1/2 translate-x-1/2" />

        {isIOS ? (
          <>
            <div className="bg-[#FFDA57]/20 p-2.5 rounded-xl border border-[#FFDA57]/30 flex-shrink-0">
              <Share className="w-5 h-5 text-[#FFDA57]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-[var(--font-unbounded)] font-bold text-[#FFDA57] text-sm">
                Install App
              </h3>
              <p className="text-[10px] text-white/60 leading-tight mt-0.5">
                Tap{" "}
                <Share className="inline w-3 h-3 mx-0.5 text-blue-400" />{" "}
                lalu <span className="font-bold text-white">&quot;Add to Home Screen&quot;</span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#FFDA57]/20 p-2.5 rounded-xl border border-[#FFDA57]/30 flex-shrink-0">
              <Smartphone className="w-5 h-5 text-[#FFDA57]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-[var(--font-unbounded)] font-bold text-[#FFDA57] text-sm">
                Install Sortify
              </h3>
              <p className="text-[10px] text-white/60 mt-0.5">
                Mainkan luring di layar HP
              </p>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-[#00917A] text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg active:translate-y-0.5 transition-all flex-shrink-0"
            >
              Install
            </button>
          </>
        )}

        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/10 active:bg-white/20 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-3 h-3 text-white/60" />
        </button>
      </div>
    </div>
  )
}
