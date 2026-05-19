"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { SortingStep } from "@/lib/types"
import { Play, Pause, RotateCcw, SkipBack, SkipForward, ArrowUp, ArrowDown } from "lucide-react"

interface SortingVisualizerProps {
  steps: SortingStep[]
  onComplete?: () => void
  onSortOrderChange?: (order: "asc" | "desc") => void
  sortOrder?: "asc" | "desc"
  algorithmCode?: string
  activeCodeLine?: number
}

const SPEED_OPTIONS = [
  { label: "1 detik", value: 1000 },
  { label: "2 detik", value: 2000 },
  { label: "3 detik", value: 3000 },
]

export function SortingVisualizer({
  steps,
  onComplete,
  onSortOrderChange,
  sortOrder = "asc",
  algorithmCode,
  activeCodeLine,
}: SortingVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(1000)
  const prevSortedRef = useRef<number[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioKuningRef = useRef<HTMLAudioElement | null>(null)
  const audioMerahRef = useRef<HTMLAudioElement | null>(null)
  const codeContainerRef = useRef<HTMLDivElement | null>(null)

  const step = steps[currentStep]
  const maxHeight = Math.max(...step.array)
  const codeLines = algorithmCode ? algorithmCode.split("\n") : []

  // Compute active line from step index
  const computedActiveLine = activeCodeLine !== undefined ? activeCodeLine : Math.floor(
    (currentStep / Math.max(steps.length - 1, 1)) * Math.max(codeLines.length - 1, 0)
  )

  useEffect(() => {
    audioRef.current = new Audio('/audio/pas-switch.wav')
    audioRef.current.volume = 0.5
    audioKuningRef.current = new Audio('/audio/kuning.wav')
    audioKuningRef.current.volume = 0.5
    audioMerahRef.current = new Audio('/audio/merah.wav')
    audioMerahRef.current.volume = 0.5
  }, [])

  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [steps])

  useEffect(() => {
    const prevSorted = prevSortedRef.current
    const newlySorted = step.sorted.filter(i => !prevSorted.includes(i))
    if (newlySorted.length > 0 && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => { })
    }
    prevSortedRef.current = step.sorted
  }, [step.sorted])

  useEffect(() => {
    if (step.comparing.length > 0 && audioKuningRef.current) {
      audioKuningRef.current.currentTime = 0
      audioKuningRef.current.play().catch(() => { })
    }
  }, [step.comparing])

  useEffect(() => {
    if (step.swapping.length > 0 && audioMerahRef.current) {
      audioMerahRef.current.currentTime = 0
      audioMerahRef.current.play().catch(() => { })
    }
  }, [step.swapping])

  // Auto-scroll code to active line
  useEffect(() => {
    if (codeContainerRef.current && codeLines.length > 0) {
      const lineEl = codeContainerRef.current.querySelector(`[data-line="${computedActiveLine}"]`)
      if (lineEl) {
        lineEl.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [computedActiveLine, codeLines.length])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsPlaying(false)
      onComplete?.()
    }
  }, [currentStep, steps.length, onComplete])

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(nextStep, speedMs)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, speedMs, nextStep])

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const getBarColor = (index: number) => {
    if (step.sorted.includes(index)) return "bg-[#00917A]"
    if (step.swapping.includes(index)) return "bg-[#F47575]"
    if (step.comparing.includes(index)) return "bg-[#FFDA57]"
    return "bg-[#7DCAF6]"
  }

  return (
    <div className="space-y-4">
      {/* Sort Order + Speed Controls */}
      <div className="flex items-center gap-2">
        {/* Ascending / Descending */}
        <div className="flex gap-1 flex-1">
          <button
            onClick={() => onSortOrderChange?.("asc")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${sortOrder === "asc"
              ? "bg-[#100F06] text-white"
              : "bg-[#E0DFD8] text-[#100F06]"
              }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Ascending
          </button>
          <button
            onClick={() => onSortOrderChange?.("desc")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition-all ${sortOrder === "desc"
              ? "bg-[#100F06] text-white"
              : "bg-[#E0DFD8] text-[#100F06]"
              }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            Descending
          </button>
        </div>
      </div>
      <p className="text-[10px] text-[#6B6B6B] -mt-2">
        💡 Pilih urutan sorting: dari terkecil (Ascending) atau terbesar (Descending)
      </p>

      {/* Visualization Area */}
      <div className="p-4 bg-[#F5F4ED] rounded-xl">
        <div className="flex items-end justify-center gap-1.5 h-36">
          {step.array.map((value, index) => (
            <div
              key={index}
              className={`relative flex flex-col items-center transition-all duration-300 ${step.swapping.includes(index) ? "animate-bounce" : ""
                }`}
            >
              <span className="text-[10px] font-bold text-[#100F06] mb-1">
                {value}
              </span>
              <div
                className={`w-8 rounded-t-lg transition-all duration-300 ${getBarColor(index)}`}
                style={{
                  height: `${(value / maxHeight) * 100}px`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Code Panel */}
      {codeLines.length > 0 && (
        <div className="bg-[#1A1A2E] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#100F06]/80 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F47575]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFDA57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00917A]" />
            </div>
            <span className="text-[10px] text-white/50 font-mono">algorithm.js</span>
          </div>
          <div
            ref={codeContainerRef}
            className="p-4 max-h-40 overflow-y-auto font-mono text-[11px] space-y-0.5 scrollbar-thin"
          >
            {codeLines.map((line, i) => (
              <div
                key={i}
                data-line={i}
                className={`flex items-start gap-3 px-2 py-0.5 rounded transition-colors ${i === computedActiveLine
                  ? "bg-[#FFDA57]/20 border-l-2 border-[#FFDA57]"
                  : "border-l-2 border-transparent"
                  }`}
              >
                <span className="text-white/30 w-4 flex-shrink-0 text-right select-none">{i + 1}</span>
                <span className={i === computedActiveLine ? "text-[#FFDA57]" : "text-[#A8B2D8]"}>
                  {line || " "}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full bg-[#E0DFD8] flex items-center justify-center text-[#100F06]"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="w-10 h-10 rounded-full bg-[#E0DFD8] flex items-center justify-center text-[#100F06] disabled:opacity-50"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 rounded-full bg-[#100F06] flex items-center justify-center text-white"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="w-10 h-10 rounded-full bg-[#E0DFD8] flex items-center justify-center text-[#100F06] disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Speed Control - 3 Tombol */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B6B6B]">Kecepatan Iterasi</span>
        </div>
        <div className="flex gap-2">
          {SPEED_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSpeedMs(opt.value)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${speedMs === opt.value
                ? "bg-[#00917A] text-white"
                : "bg-[#E0DFD8] text-[#100F06]"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#6B6B6B]">Langkah</span>
          <span className="font-medium text-[#100F06]">{currentStep + 1} / {steps.length}</span>
        </div>
        <div className="h-2 bg-[#E0DFD8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00917A] transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-[#FFDA57]/20 rounded-sm p-4 border-2 border-[#FFDA57]/30">
        <p className="text-sm leading-relaxed text-[#100F06]">
          {step.explanation}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#7DCAF6]" />
          <span className="text-[#6B6B6B]">Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#FFDA57]" />
          <span className="text-[#6B6B6B]">Dibandingkan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#F47575]" />
          <span className="text-[#6B6B6B]">Ditukar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#00917A]" />
          <span className="text-[#6B6B6B]">Terurut</span>
        </div>
      </div>
    </div>
  )
}
