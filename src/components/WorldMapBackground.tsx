import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'
import { worldMapPath } from '../data/worldMapPath'

const LON_MIN = -168
const LON_MAX = 175
const LAT_MAX = 72
const LAT_MIN = -54

function project(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 1000
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 480
  return { x, y }
}

function buildCurve(
  from: { x: number; y: number },
  to: { x: number; y: number },
): string {
  const mx = (from.x + to.x) * 0.5
  const dist = Math.hypot(to.x - from.x, to.y - from.y)
  const my = Math.min(from.y, to.y) - Math.min(120, dist * 0.28)
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

const ORIGIN = { lon: 125.35, lat: 6.75 } // Digos City, Philippines

const DESTINATIONS = [
  { code: 'AUS', lon: 151.2, lat: -33.86, delay: 0.2 },
  { code: 'SGP', lon: 103.82, lat: 1.35, delay: 0.5 },
  { code: 'TYO', lon: 139.69, lat: 35.68, delay: 0.8 },
  { code: 'LDN', lon: -0.12, lat: 51.5, delay: 1.1 },
  { code: 'SFO', lon: -122.41, lat: 37.77, delay: 1.4 },
]

export function WorldMapBackground() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const originPt = useMemo(() => project(ORIGIN.lon, ORIGIN.lat), [])
  const routes = useMemo(
    () =>
      DESTINATIONS.map((d) => {
        const to = project(d.lon, d.lat)
        return {
          ...d,
          to,
          path: buildCurve(originPt, to),
        }
      }),
    [originPt],
  )

  return (
    <div className="world-map" aria-hidden="true">
      <svg
        className="world-map__svg"
        viewBox="0 0 1000 480"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`arc-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--line)" />
            <stop offset="50%" stopColor="var(--fg)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--line)" />
          </linearGradient>
        </defs>

        {/* High-performance single-drawcall world map dot vector */}
        <path d={worldMapPath} fill="var(--fg)" opacity="0.16" />

        {/* Global Connection Arcs */}
        <g className="world-map__routes">
          {routes.map((route) => (
            <g key={route.code}>
              <path
                d={route.path}
                fill="none"
                stroke="var(--line)"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              <motion.path
                d={route.path}
                fill="none"
                stroke={`url(#arc-${uid})`}
                strokeWidth="1.6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  pathLength: {
                    duration: 2.2,
                    delay: route.delay,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  },
                  opacity: { duration: 0.4, delay: route.delay },
                }}
              />
              <circle
                cx={route.to.x}
                cy={route.to.y}
                r="2.5"
                fill="var(--fg)"
                opacity="0.88"
              />
            </g>
          ))}

          {/* Origin: Digos City, Philippines */}
          <circle cx={originPt.x} cy={originPt.y} r="3.4" fill="var(--fg)" />
          <circle
            cx={originPt.x}
            cy={originPt.y}
            r="9.5"
            fill="none"
            stroke="var(--fg)"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            className="world-map__pulse"
          />
        </g>
      </svg>
    </div>
  )
}
