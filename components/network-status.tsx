"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function NetworkStatus({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        // Check initial status
        setIsOnline(navigator.onLine)

        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    if (!isOnline) {
        return (
            <div className="fixed inset-0 z-[9999] bg-[#100F06] flex items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-[#F5F4ED] max-w-sm w-full p-8 rounded-3xl border-4 border-[#F47575] flex flex-col items-center">
                    <div className="w-20 h-20 bg-[#F47575]/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <WifiOff className="w-10 h-10 text-[#F47575]" />
                    </div>
                    <h2 className="font-[var(--font-unbounded)] text-2xl font-bold text-[#100F06] mb-3">
                        Koneksi Terputus
                    </h2>
                    <p className="text-[#6B6B6B] text-sm leading-relaxed mb-8">
                        Aplikasi Sortify membutuhkan koneksi internet (Online) untuk mensinkronisasi progres belajar Anda. Silakan hubungkan kembali.
                    </p>
                    <div className="w-full bg-[#100F06] text-white p-4 rounded-full font-bold opacity-50 flex justify-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
