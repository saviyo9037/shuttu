import { useMemo } from 'react'

const EMOJI = ['😂', '🎉', '🤣', '🥳', '😜', '🎈']

export default function RevealScreen({ onRestart }) {
  const confetti = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({
      id: i,
      icon: EMOJI[i % EMOJI.length],
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      dur: 3 + Math.random() * 3,
      size: 20 + Math.random() * 20,
    })),
    []
  )

  return (
    <main className="screen center reveal">
      <div className="confetti" aria-hidden="true">
        {confetti.map((c) => (
          <span key={c.id} style={{ left: `${c.left}%`, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s`, fontSize: c.size }}>
            {c.icon}
          </span>
        ))}
      </div>

      <h1 className="reveal-title">😂 RELAX! IT'S JUST A PRANK!</h1>
      <p className="lead">This was only a visual simulation. Your phone was never hacked.</p>

      <div className="safe" role="status">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
          <path className="check" d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
        You're Safe
      </div>

      <button className="btn primary" onClick={onRestart}>Run it again</button>
    </main>
  )
}
