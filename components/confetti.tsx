"use client"

import { useEffect, useState } from "react"

interface ConfettiProps {
  isActive: boolean
}

export function Confetti({ isActive }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([])

  useEffect(() => {
    if (isActive) {
      const colors = ["#FFDA57", "#00917A", "#7DCAF6", "#A293FF", "#FFBBF4", "#F47575"]
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => setParticles([]), 3000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${particle.left}%`,
            top: "-10px",
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
