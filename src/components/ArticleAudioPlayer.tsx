'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Headphones, Gauge } from 'lucide-react'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

export default function ArticleAudioPlayer({ text }: { text: string }) {
  const [supported, setSupported] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1)
  const [idx, setIdx] = useState(0)

  const chunksRef = useRef<string[]>([])
  const idxRef = useRef(0)
  const rateRef = useRef(1)
  const seqRef = useRef(0)
  const playingRef = useRef(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false)
      return
    }
    chunksRef.current = (text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [text])
      .map((s) => s.trim())
      .filter(Boolean)

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      voiceRef.current =
        voices.find((v) => /pt[-_]?br/i.test(v.lang)) ||
        voices.find((v) => /^pt/i.test(v.lang)) ||
        null
    }
    pickVoice()
    window.speechSynthesis.onvoiceschanged = pickVoice

    return () => {
      seqRef.current++
      window.speechSynthesis.cancel()
    }
  }, [text])

  const speakFrom = useCallback((start: number) => {
    const synth = window.speechSynthesis
    const mySeq = ++seqRef.current
    synth.cancel()

    const go = (j: number) => {
      if (mySeq !== seqRef.current) return
      if (j >= chunksRef.current.length) {
        playingRef.current = false
        setPlaying(false)
        idxRef.current = 0
        setIdx(0)
        return
      }
      const u = new SpeechSynthesisUtterance(chunksRef.current[j])
      u.lang = 'pt-BR'
      u.rate = rateRef.current
      if (voiceRef.current) u.voice = voiceRef.current
      u.onend = () => {
        if (mySeq !== seqRef.current) return
        idxRef.current = j + 1
        setIdx(j + 1)
        go(j + 1)
      }
      synth.speak(u)
    }
    // pequeno atraso evita bug do Chrome ao chamar speak logo após cancel
    setTimeout(() => go(start), 60)
  }, [])

  function play() {
    playingRef.current = true
    setPlaying(true)
    speakFrom(idxRef.current)
  }
  function pause() {
    playingRef.current = false
    setPlaying(false)
    seqRef.current++
    window.speechSynthesis.cancel()
  }
  function reiniciar() {
    seqRef.current++
    window.speechSynthesis.cancel()
    idxRef.current = 0
    setIdx(0)
    if (playingRef.current) speakFrom(0)
  }
  function changeRate(r: number) {
    setRate(r)
    rateRef.current = r
    if (playingRef.current) speakFrom(idxRef.current)
  }

  if (!supported) return null

  const total = chunksRef.current.length || 1
  const progress = Math.min(100, Math.round((idx / total) * 100))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => (playing ? pause() : play())}
          className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity shrink-0"
          aria-label={playing ? 'Pausar áudio' : 'Ouvir o artigo'}
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-text">
            <Headphones className="w-4 h-4 text-primary" />
            {playing ? 'Ouvindo o artigo...' : 'Ouça este artigo'}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full gradient-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {idx > 0 && (
          <button
            onClick={reiniciar}
            className="w-9 h-9 rounded-lg bg-bg-alt text-gray-500 hover:text-primary flex items-center justify-center shrink-0"
            aria-label="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Controle de velocidade */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
          <Gauge className="w-3.5 h-3.5" /> Velocidade
        </span>
        <div className="flex gap-1.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => changeRate(s)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                rate === s ? 'bg-primary text-white' : 'bg-bg-alt text-gray-600 hover:bg-primary/10'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
