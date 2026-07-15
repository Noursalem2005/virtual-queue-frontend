'use client'

interface SparklineProps {
  data: number[]
  color?: string
  height?: number
}

export const Sparkline = ({ data, color = '#7c6dfa', height = 32 }: SparklineProps) => {
  if (!data.length) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        fill={color}
        opacity="0.08"
      />
    </svg>
  )
}
