"use client"

import { useState, useEffect, useRef } from "react"
import { CodePuzzle } from "@/lib/types"
import { CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface CodePuzzleGameProps {
  puzzle: CodePuzzle
  lives: number
  onWrongAnswer: () => void
  onCorrect: () => void
}

export function CodePuzzleGame({ puzzle, lives, onWrongAnswer, onCorrect }: CodePuzzleGameProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const audioSuksesRef = useRef<HTMLAudioElement | null>(null)
  const audioSalahRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioSuksesRef.current = new Audio('/audio/sukses.mp3')
    audioSuksesRef.current.volume = 0.6
    audioSalahRef.current = new Audio('/audio/salah.wav')
    audioSalahRef.current.volume = 0.6
  }, [])

  useEffect(() => {
    if (result === 'correct' && audioSuksesRef.current) {
      audioSuksesRef.current.currentTime = 0
      audioSuksesRef.current.play().catch(() => { })
    } else if (result === 'incorrect' && audioSalahRef.current) {
      audioSalahRef.current.currentTime = 0
      audioSalahRef.current.play().catch(() => { })
    }
  }, [result])

  useEffect(() => {
    setSelectedAnswers({})
    setResult(null)
    setIsChecking(false)
  }, [puzzle])

  const handleSelectOption = (blankId: string, option: string) => {
    if (isChecking) return
    setSelectedAnswers(prev => ({ ...prev, [blankId]: option }))
  }

  const handleCheck = () => {
    setIsChecking(true)

    const allCorrect = puzzle.blanks.every(
      blank => selectedAnswers[blank.id] === blank.correctAnswer
    )

    setTimeout(() => {
      setResult(allCorrect ? "correct" : "incorrect")

      if (allCorrect) {
        setTimeout(() => onCorrect(), 1500)
      } else {
        // Kurangi nyawa di parent
        onWrongAnswer()
      }
    }, 500)
  }

  const handleRetry = () => {
    setSelectedAnswers({})
    setResult(null)
    setIsChecking(false)
  }

  const allAnswered = puzzle.blanks.every(blank => selectedAnswers[blank.id])

  const renderCode = () => {
    const lines = puzzle.codeTemplate.split("\n")
    let blankIndex = 0

    return lines.map((line, lineIndex) => {
      if (line.includes("_BLANK_")) {
        const blank = puzzle.blanks[blankIndex]
        blankIndex++
        const parts = line.split("_BLANK_")
        const selected = selectedAnswers[blank.id]
        const isCorrect = result === "correct" || (result === "incorrect" && selected === blank.correctAnswer)
        const isWrong = result === "incorrect" && selected !== blank.correctAnswer

        return (
          <div key={lineIndex} className="font-mono text-xs">
            <span className="text-[#A0A0A0]">{parts[0]}</span>
            <span
              className={`inline-block min-w-[60px] px-2 py-0.5 mx-1 rounded text-center transition-colors ${selected
                ? isCorrect
                  ? "bg-[#00917A] text-white"
                  : isWrong
                    ? "bg-[#F47575] text-white"
                    : "bg-[#FFDA57] text-[#100F06]"
                : "bg-[#E0DFD8] border border-dashed border-[#6B6B6B]"
                }`}
            >
              {selected || "???"}
            </span>
            <span className="text-[#A0A0A0]">{parts[1]}</span>
          </div>
        )
      }
      return (
        <div key={lineIndex} className="font-mono text-xs text-[#A0A0A0]">
          {line || " "}
        </div>
      )
    })
  }

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="bg-[#FFDA57]/20 rounded-sm p-4 border-2 border-[#FFDA57]/30">
        <p className="text-sm text-[#100F06] font-medium">{puzzle.question}</p>
      </div>

      {/* Code Template */}
      <div className="bg-[#100F06] rounded-sm p-4 overflow-x-auto">
        <div className="space-y-1">
          {renderCode()}
        </div>
      </div>

      {/* Options — sembunyikan saat hasil sudah muncul */}
      {!result && puzzle.blanks.map((blank, index) => (
        <div key={blank.id} className="space-y-2">
          <p className="text-xs font-medium text-[#6B6B6B]">
            Pilih untuk kotak {index + 1}:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {blank.options.map(option => {
              const isSelected = selectedAnswers[blank.id] === option
              return (
                <button
                  key={option}
                  onClick={() => handleSelectOption(blank.id, option)}
                  disabled={isChecking}
                  className={`p-3 rounded-2xl font-mono text-xs text-center transition-all ${isSelected
                    ? "bg-[#FFDA57] text-[#100F06] ring-2 ring-[#FFDA57]"
                    : "bg-white text-[#100F06] border-2 border-[#E0DFD8] hover:border-[#FFDA57]"
                    }`}
                >
                  {option}
                </button>
              )
            })}</div>
        </div>
      ))}

      {/* Opsi saat hasil incorrect — tampilkan dengan warna */}
      {result === "incorrect" && puzzle.blanks.map((blank, index) => (
        <div key={blank.id} className="space-y-2">
          <p className="text-xs font-medium text-[#6B6B6B]">
            Pilih untuk kotak {index + 1}:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {blank.options.map(option => {
              const isSelected = selectedAnswers[blank.id] === option
              const isCorrectOption = option === blank.correctAnswer
              const isWrongSelected = isSelected && !isCorrectOption

              return (
                <button
                  key={option}
                  disabled
                  className={`p-3 rounded-2xl font-mono text-xs text-center transition-all ${isWrongSelected
                    ? "bg-[#F47575] text-white ring-2 ring-[#F47575] animate-shake"
                    : "bg-white text-[#100F06] border-2 border-[#E0DFD8] opacity-50"
                    }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Result */}
      {result && (
        <div
          className={`flex items-center gap-3 p-4 rounded-sm animate-slide-up ${result === "correct"
            ? "bg-[#00917A]/10 border-2 border-[#00917A]/30"
            : "bg-[#F47575]/10 border-2 border-[#F47575]/30"
            }`}
        >
          {result === "correct" ? (
            <>
              <CheckCircle className="w-6 h-6 text-[#00917A]" />
              <span className="font-semibold text-[#00917A]">Benar!</span>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-[#F47575]" />
              <div className="flex-1">
                <span className="font-semibold text-[#F47575]">Salah!</span>
                <p className="text-xs text-[#F47575]/80 mt-0.5">
                  Sisa {lives} nyawa. Coba lagi!
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tombol Coba Lagi saat salah */}
      {result === "incorrect" && (
        <button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 bg-[#F47575] text-white font-semibold py-4 rounded-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}

      {/* Tombol Periksa */}
      {!result && (
        <button
          className="w-full bg-[#100F06] text-white font-semibold py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!allAnswered || isChecking}
          onClick={handleCheck}
        >
          {isChecking ? "Memeriksa..." : "Periksa Jawaban"}
        </button>
      )}
    </div>
  )
}
