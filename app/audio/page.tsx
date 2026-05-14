"use client"

import { useRef } from "react"

export default function ButtonSound() {

  const clickSound = useRef<HTMLAudioElement | null>(null)

  const playSound = () => {
    clickSound.current?.play()
  }

  return (
    <>
      <audio
        ref={clickSound}
        src="/sounds/saat-click.wav"
        preload="auto"
      />

      <button
        onClick={playSound}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl"
      >
        Play Sound
      </button>
    </>
  )
}