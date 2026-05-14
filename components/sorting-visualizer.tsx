"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { SortingStep } from "@/lib/types"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from "lucide-react"

interface SortingVisualizerProps {
  steps: SortingStep[]
  onComplete?: () => void
}

export function SortingVisualizer({ steps, onComplete }: SortingVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState([500])
  const prevSortedRef = useRef<number[]>([])
  const prevComparingRef = useRef<number[]>([])
  const prevSwappingRef = useRef<number[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioKuningRef = useRef<HTMLAudioElement | null>(null)
  const audioMerahRef = useRef<HTMLAudioElement | null>(null)

  const step = steps[currentStep]
  const maxHeight = Math.max(...step.array)

  useEffect(() => {
    audioRef.current = new Audio('/audio/pas-switch.wav')
    audioRef.current.volume = 0.5
    audioKuningRef.current = new Audio('/audio/kuning.wav')
    audioKuningRef.current.volume = 0.5
    audioMerahRef.current = new Audio('/audio/merah.wav')
    audioMerahRef.current.volume = 0.5
  }, [])

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
    prevComparingRef.current = step.comparing
  }, [step.comparing])

  useEffect(() => {
    if (step.swapping.length > 0 && audioMerahRef.current) {
      audioMerahRef.current.currentTime = 0
      audioMerahRef.current.play().catch(() => { })
    }
    prevSwappingRef.current = step.swapping
  }, [step.swapping])

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
      const timer = setTimeout(nextStep, speed[0])
      return () => clearTimeout(timer)
    }
  }, [isPlaying, speed, nextStep])

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
    if (step.sorted.includes(index)) {
      return "bg-[#00917A]"
    }
    if (step.swapping.includes(index)) {
      return "bg-[#F47575]"
    }
    if (step.comparing.includes(index)) {
      return "bg-[#FFDA57]"
    }
    return "bg-[#7DCAF6]"
  }

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="p-4">
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

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B6B6B]">Kecepatan</span>
          <span className="font-medium text-[#100F06]">{1000 - speed[0]}ms</span>
        </div>
        <Slider
          value={speed}
          onValueChange={setSpeed}
          min={100}
          max={900}
          step={100}
          className="w-full"
        />
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
