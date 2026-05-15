"use client"

import { useState, useEffect, useRef } from "react"
import { CodeBlock } from "@/lib/types"
import { shuffleArray } from "@/lib/sorting-algorithms"
import { CheckCircle, XCircle, GripVertical, AlertTriangle, RotateCcw, Terminal } from "lucide-react"

interface CodeArrangementGameProps {
  blocks: CodeBlock[]
  lives: number
  onWrongAnswer: (errorMessage: string) => void
  onCorrect: () => void
}

// Hitung keseimbangan kurung kurawal dalam susunan blok
function analyzeSyntax(arranged: CodeBlock[]): { valid: boolean; error: string; errorLine: number } {
  let depth = 0
  for (let i = 0; i < arranged.length; i++) {
    const code = arranged[i].code.trim()
    const opens = (code.match(/\{/g) || []).length
    const closes = (code.match(/\}/g) || []).length
    depth += opens - closes
    if (depth < 0) {
      return {
        valid: false,
        error: `SyntaxError: Unexpected token '}' — kurung tutup di baris ${i + 1} tidak memiliki pasangan kurung buka.`,
        errorLine: i
      }
    }
  }
  if (depth !== 0) {
    return {
      valid: false,
      error: `SyntaxError: Missing closing brace '}' — ada ${depth} kurung buka yang tidak ditutup.`,
      errorLine: arranged.length - 1
    }
  }
  return { valid: true, error: "", errorLine: -1 }
}

// Simulasikan apa yang terjadi jika urutan salah (logic error)
function simulateLogicError(arranged: CodeBlock[]): string {
  const codes = arranged.map(b => b.code.trim())

  // Cek apakah swap terjadi sebelum kondisi if
  const swapIdx = codes.findIndex(c => c.includes("temp") || c.includes("[arr[i], arr[minIdx]]"))
  const ifIdx = codes.findIndex(c => c.startsWith("if"))
  if (swapIdx !== -1 && ifIdx !== -1 && swapIdx < ifIdx) {
    return `LogicError: Penukaran (swap) dilakukan sebelum pengecekan kondisi.\n→ Hasil: Semua elemen akan ditukar tanpa dicek, array menjadi acak.\n→ Output: arr = [acak] — bukan urutan yang benar.`
  }

  // Cek loop dalam sebelum loop luar
  const outerLoop = codes.findIndex(c => c.includes("i < n") || c.includes("i = 0"))
  const innerLoop = codes.findIndex(c => c.includes("j = ") || c.includes("j <"))
  if (innerLoop !== -1 && outerLoop !== -1 && innerLoop < outerLoop) {
    return `LogicError: Loop dalam (j) ditempatkan sebelum loop luar (i).\n→ Hasil: Loop dalam akan dieksekusi sekali saja tanpa iterasi yang benar.\n→ Output: Hanya 1 elemen yang diproses, sisanya tidak terurut.`
  }

  // Cek minIdx sebelum loop pencari minimum
  const minIdxSet = codes.findIndex(c => c.includes("minIdx = j"))
  const searchLoop = codes.findIndex(c => c.includes("j = i + 1"))
  if (minIdxSet !== -1 && searchLoop !== -1 && minIdxSet < searchLoop) {
    return `LogicError: 'minIdx = j' dieksekusi sebelum loop pencarian minimum.\n→ Hasil: minIdx akan selalu bernilai dari iterasi sebelumnya.\n→ Output: Elemen minimum tidak terdeteksi dengan benar — array tidak terurut.`
  }

  return `LogicError: Urutan logika tidak sesuai algoritma.\n→ Hasil: Kode mungkin berjalan tanpa error, tapi array tidak akan terurut dengan benar.\n→ Output: arr = [urutan tidak terdefinisi]`
}

export function CodeArrangementGame({ blocks, lives, onWrongAnswer, onCorrect }: CodeArrangementGameProps) {
  const [arrangedBlocks, setArrangedBlocks] = useState<CodeBlock[]>([])
  const [availableBlocks, setAvailableBlocks] = useState<CodeBlock[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null)
  const [errorType, setErrorType] = useState<"syntax" | "logic" | null>(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorLine, setErrorLine] = useState(-1)
  const [draggedBlock, setDraggedBlock] = useState<CodeBlock | null>(null)
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
    setAvailableBlocks(shuffleArray(blocks))
    setArrangedBlocks([])
    setResult(null)
    setErrorMessage("")
    setErrorType(null)
    setErrorLine(-1)
    setIsChecking(false)
  }, [blocks])

  const handleAddBlock = (block: CodeBlock) => {
    if (isChecking) return
    setArrangedBlocks(prev => [...prev, block])
    setAvailableBlocks(prev => prev.filter(b => b.id !== block.id))
  }

  const handleRemoveBlock = (block: CodeBlock) => {
    if (isChecking) return
    setAvailableBlocks(prev => [...prev, block])
    setArrangedBlocks(prev => prev.filter(b => b.id !== block.id))
  }

  const handleDragStart = (block: CodeBlock) => setDraggedBlock(block)

  const handleDragOver = (e: React.DragEvent, targetBlock: CodeBlock) => {
    e.preventDefault()
    if (!draggedBlock || draggedBlock.id === targetBlock.id) return
    const dragIndex = arrangedBlocks.findIndex(b => b.id === draggedBlock.id)
    const targetIndex = arrangedBlocks.findIndex(b => b.id === targetBlock.id)
    if (dragIndex === -1 || targetIndex === -1) return
    const newBlocks = [...arrangedBlocks]
    newBlocks.splice(dragIndex, 1)
    newBlocks.splice(targetIndex, 0, draggedBlock)
    setArrangedBlocks(newBlocks)
  }

  const handleDragEnd = () => setDraggedBlock(null)

  const handleRetry = () => {
    setAvailableBlocks(shuffleArray(blocks))
    setArrangedBlocks([])
    setResult(null)
    setErrorMessage("")
    setErrorType(null)
    setErrorLine(-1)
    setIsChecking(false)
  }

  const checkAnswer = () => {
    setIsChecking(true)

    setTimeout(() => {
      // Validasi berbasis konten teks agar blok duplikat (seperti '}') dapat bertukar posisi dengan bebas
      const isCorrect = arrangedBlocks.length === blocks.length &&
        arrangedBlocks.every((block, index) => {
          const expectedBlock = blocks.find(b => b.order === index + 1)
          return expectedBlock && block.code.trim() === expectedBlock.code.trim()
        })

      if (isCorrect) {
        setResult("correct")
        setTimeout(onCorrect, 1500)
      } else {
        // Cek syntax terlebih dahulu
        const syntaxCheck = analyzeSyntax(arrangedBlocks)
        if (!syntaxCheck.valid) {
          setErrorType("syntax")
          setErrorMessage(syntaxCheck.error)
          setErrorLine(syntaxCheck.errorLine)
        } else {
          // Syntax valid → logic error
          setErrorType("logic")
          setErrorMessage(simulateLogicError(arrangedBlocks))
          setErrorLine(-1)
        }
        setResult("incorrect")
        onWrongAnswer(syntaxCheck.valid ? "LogicError" : "SyntaxError")
      }
    }, 500)
  }

  const allPlaced = availableBlocks.length === 0

  return (
    <div className="space-y-4">
      {/* Code Editor Area */}
      <div className="bg-[#100F06] rounded-sm p-4 min-h-[160px]">
        <div className="text-[10px] text-[#6B6B6B] mb-2 font-mono">// Susun kode di sini</div>
        {arrangedBlocks.length === 0 ? (
          <div className="text-[#6B6B6B] text-xs italic text-center py-6">
            Tap kode di bawah untuk menambahkan
          </div>
        ) : (
          <div className="space-y-1">
            {arrangedBlocks.map((block, index) => {
              const isWrongBlock = result === "incorrect" && errorType === "syntax" && index === errorLine
              const isCorrectBlock = result === "correct"
              const isWrongOrder = result === "incorrect" && (() => {
                const expectedBlock = blocks.find(b => b.order === index + 1)
                return !expectedBlock || block.code.trim() !== expectedBlock.code.trim()
              })()

              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(block)}
                  onDragOver={(e) => handleDragOver(e, block)}
                  onDragEnd={handleDragEnd}
                  onClick={() => !result && handleRemoveBlock(block)}
                  className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${isCorrectBlock
                    ? "bg-[#00917A]/30"
                    : isWrongBlock
                      ? "bg-[#F47575]/50 animate-shake ring-2 ring-[#F47575]"
                      : isWrongOrder
                        ? "bg-[#F47575]/20"
                        : "bg-[#2A2A2A] active:bg-[#3A3A3A]"
                    } ${draggedBlock?.id === block.id ? "opacity-50" : ""}`}
                >
                  <GripVertical className="w-4 h-4 text-[#6B6B6B]" />
                  <code className="text-xs text-white font-mono flex-1">{block.code}</code>
                  {isWrongBlock && (
                    <span className="text-[10px] text-[#F47575] font-mono">← error</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Available Blocks */}
      {!result && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B6B6B]">Potongan kode:</p>
          <div className="space-y-2">
            {availableBlocks.map(block => (
              <button
                key={block.id}
                onClick={() => handleAddBlock(block)}
                disabled={isChecking}
                className="w-full p-3 bg-white rounded-2xl text-left font-mono text-xs border-2 border-[#E0DFD8] active:bg-[#F5F4ED] transition-colors disabled:opacity-50"
              >
                {block.code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result: Correct */}
      {result === "correct" && (
        <div className="p-4 rounded-2xl animate-slide-up bg-[#00917A]/10 border-2 border-[#00917A]/30">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#00917A]" />
            <span className="font-semibold text-[#00917A]">Sempurna! Urutan kode sudah benar.</span>
          </div>
        </div>
      )}

      {/* Result: Syntax Error */}
      {result === "incorrect" && errorType === "syntax" && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-2 p-3 bg-[#F47575]/10 rounded-xl border-2 border-[#F47575]/30">
            <XCircle className="w-5 h-5 text-[#F47575]" />
            <span className="font-semibold text-[#F47575] text-sm">Terjadi Syntax Error!</span>
          </div>
          {/* Terminal output */}
          <div className="bg-[#0D1117] rounded-xl p-4 border border-[#F47575]/40">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#F47575]/20">
              <Terminal className="w-4 h-4 text-[#F47575]" />
              <span className="text-[#F47575] text-xs font-mono font-bold">COMPILER OUTPUT</span>
            </div>
            <div className="space-y-1">
              {errorMessage.split('\n').map((line, i) => (
                <p key={i} className={`font-mono text-xs ${i === 0 ? "text-[#F47575]" : "text-[#6B6B6B]"}`}>
                  {i === 0 ? "✗ " : "  "}{line}
                </p>
              ))}
              {errorLine >= 0 && (
                <p className="font-mono text-xs text-[#FFDA57] mt-2">
                  → Lihat baris {errorLine + 1} pada susunan kode di atas.
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-[#6B6B6B] text-center">
            Sisa {lives} nyawa. Periksa kurung kurawal dan coba lagi!
          </p>
        </div>
      )}

      {/* Result: Logic Error */}
      {result === "incorrect" && errorType === "logic" && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-2 p-3 bg-[#FFDA57]/10 rounded-xl border-2 border-[#FFDA57]/30">
            <AlertTriangle className="w-5 h-5 text-[#FFDA57]" />
            <span className="font-semibold text-[#100F06] text-sm">Terjadi Logic Error!</span>
          </div>
          {/* Simulasi output */}
          <div className="bg-[#0D1117] rounded-xl p-4 border border-[#FFDA57]/40">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#FFDA57]/20">
              <Terminal className="w-4 h-4 text-[#FFDA57]" />
              <span className="text-[#FFDA57] text-xs font-mono font-bold">SIMULASI EKSEKUSI</span>
            </div>
            <div className="space-y-1">
              {errorMessage.split('\n').map((line, i) => (
                <p key={i} className={`font-mono text-xs ${line.startsWith("LogicError") ? "text-[#FFDA57]"
                  : line.startsWith("→ Output") ? "text-[#F47575]"
                    : "text-[#A0A0A0]"
                  }`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <p className="text-xs text-[#6B6B6B] text-center">
            Sisa {lives} nyawa. Perhatikan urutan logika algoritma!
          </p>
        </div>
      )}

      {/* Tombol Coba Lagi */}
      {result === "incorrect" && (
        <button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 bg-[#F47575] text-white font-semibold py-4 rounded-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}

      {/* Check Button */}
      {!result && (
        <button
          className="w-full bg-[#100F06] text-white font-semibold py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!allPlaced || isChecking}
          onClick={checkAnswer}
        >
          {isChecking ? "Memeriksa..." : "Periksa Kode"}
        </button>
      )}
    </div>
  )
}
