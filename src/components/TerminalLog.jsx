import { useEffect, useState } from 'react'

const MODULES = ['kernel_sim', 'net_probe', 'sandbox_core', 'cache_walker', 'fake_firewall', 'ghost_proxy', 'null_vault', 'pixel_guard']
const VERBS = ['Probing', 'Mapping', 'Decrypting (fictional)', 'Handshaking with', 'Sweeping', 'Indexing']
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const hex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('')

function makeLine() {
  const r = Math.random()
  if (r < 0.3) return { tone: 'ok', text: `[ OK ] ${pick(MODULES)} responded in ${Math.floor(Math.random() * 90 + 5)}ms` }
  if (r < 0.55) return { tone: 'dim', text: `0x${hex(8)}  ${hex(4)} ${hex(4)} ${hex(4)} ${hex(4)}` }
  if (r < 0.8) return { tone: 'dim', text: `${pick(VERBS)} node ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.x.x` }
  if (r < 0.92) return { tone: 'warn', text: `[WARN] simulated anomaly in ${pick(MODULES)}` }
  return { tone: 'err', text: `[FAIL] ${pick(MODULES)} pretend-compromised` }
}

export default function TerminalLog({ speed = 220, maxLines = 14 }) {
  const [lines, setLines] = useState(() => Array.from({ length: 6 }, makeLine))

  useEffect(() => {
    const id = setInterval(() => {
      setLines((prev) => [...prev.slice(-(maxLines - 1)), makeLine()])
    }, speed)
    return () => clearInterval(id)
  }, [speed, maxLines])

  return (
    <div className="terminal" role="log" aria-live="off">
      {lines.map((l, i) => (
        <div key={`${i}-${l.text}`} className={`log ${l.tone}`}>
          <span className="prompt">&gt;</span> {l.text}
        </div>
      ))}
      <span className="cursor">█</span>
    </div>
  )
}
