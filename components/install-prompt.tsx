"use client"

import { useState, useEffect } from "react"
import { Download, X, Share } from "lucide-react"

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        // Check if device is iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        setIsIOS(isIOSDevice)

        // Check if the app is already installed or has been dismissed
        const standsAlone = window.matchMedia("(display-mode: standalone)").matches
        const isDismissed = localStorage.getItem("sortify_install_dismissed") === "true"
        setIsStandalone(standsAlone)

        if (standsAlone || isDismissed) return

        // Show custom prompt on iOS after few seconds since it does not fire beforeinstallprompt
        if (isIOSDevice) {
            const timer = setTimeout(() => setShowPrompt(true), 3000)
            return () => clearTimeout(timer)
        }

        // For Android/Other, listen for the event
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowPrompt(true)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        }
    }, [])

    if (isStandalone || !showPrompt) return null

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === "accepted") {
            setShowPrompt(false)
        }
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        localStorage.setItem("sortify_install_dismissed", "true")
        setShowPrompt(false)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-slide-up">
            <div className="bg-[#100F06] text-white p-4 rounded-sm shadow-playful-lg border-2 border-[#100F06] flex flex-row items-center justify-between gap-3 relative overflow-hidden">

                {isIOS ? (
                    <div className="flex-1 text-xs leading-relaxed pr-2 font-medium">
                        Install Sortify di iOS Anda!<br />
                        Tap <Share className="inline w-3 h-3 mx-0.5 text-blue-400" /> (Share) di browser lalu tekan <span className="font-bold text-[#FFDA57]">"Add to Home Screen"</span> untuk memainkannya luring layaknya Aplikasi Asli.
                    </div>
                ) : (
                    <>
                        <div className="bg-[#FFDA57]/20 p-2.5 rounded-xl border border-[#FFDA57]/30">
                            <Download className="w-5 h-5 text-[#FFDA57] animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-[var(--font-unbounded)] font-bold text-[#FFDA57] text-sm">Install App</h3>
                            <p className="text-[10px] text-[#A0A0A0]">Akses di layar Beranda HP</p>
                        </div>
                        <button
                            onClick={handleInstallClick}
                            className="bg-[#00917A] text-white font-bold text-xs py-2 px-5 rounded-full shadow-lg active:translate-y-0.5 transition-all"
                        >
                            Install
                        </button>
                    </>
                )}

                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/5 active:bg-white/20"
                >
                    <X className="w-3 h-3 text-white/50" />
                </button>
            </div>
        </div>
    )
}
