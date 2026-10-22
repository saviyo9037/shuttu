export default function ProgressBar({ value, danger }) {
  const pct = Math.min(100, Math.max(0, value * 100))
  return (
    <div className={`bar ${danger ? 'danger' : ''}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="bar-fill" style={{ width: `${pct}%` }} />
      <span className="bar-label">{Math.round(pct)}%</span>
    </div>
  )
}
