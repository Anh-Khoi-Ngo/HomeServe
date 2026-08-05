export default function StarRating({ rating, size = 16, showValue = false }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100))

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative inline-block leading-none" aria-label={`${rating} out of 5 stars`}>
        <span className="text-gray-300" style={{ fontSize: size }}>
          ★★★★★
        </span>
        <span
          className="absolute inset-0 overflow-hidden whitespace-nowrap text-warning"
          style={{ fontSize: size, width: `${pct}%` }}
        >
          ★★★★★
        </span>
      </span>
      {showValue && <span className="text-sm font-semibold text-ink-soft">{rating.toFixed(1)}</span>}
    </span>
  )
}
