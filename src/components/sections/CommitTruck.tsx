import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import fallbackData from '../../data/githubCommits.json'
import { easeOut } from '../../lib/motion'
import { SectionHeader } from '../SectionHeader'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface CommitData {
  total: {
    lastYear: number
  }
  contributions: ContributionDay[]
}

const GITHUB_USERNAME = 'Dranyl-23'
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CommitTruck() {
  const [data, setData] = useState<CommitData>(fallbackData as CommitData)
  const [activeDay, setActiveDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null)

  // Fetch live contributions on client mount, gracefully fallback to bundled JSON
  useEffect(() => {
    let mounted = true
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((fresh) => {
        if (mounted && fresh?.contributions?.length) {
          setData(fresh)
        }
      })
      .catch(() => {
        // Fallback data is already loaded
      })
    return () => {
      mounted = false
    }
  }, [])

  // Calculate metrics
  const stats = useMemo(() => {
    const days = data.contributions || []
    let activeDays = 0
    let maxDay = { count: 0, date: '' }
    let longestStreak = 0
    let tempStreak = 0

    for (let i = 0; i < days.length; i++) {
      const day = days[i]
      if (day.count > 0) {
        activeDays++
        tempStreak++
        if (tempStreak > longestStreak) longestStreak = tempStreak
        if (day.count > maxDay.count) maxDay = day
      } else {
        tempStreak = 0
      }
    }

    return {
      total: data.total?.lastYear ?? 1437,
      activeDays,
      longestStreak,
      maxDay,
    }
  }, [data])

  // Group contributions into 53 weeks (columns)
  const weeks = useMemo(() => {
    const res: ContributionDay[][] = []
    let currentWeek: ContributionDay[] = []

    data.contributions.forEach((day, index) => {
      currentWeek.push(day)
      const dayOfWeek = new Date(day.date).getDay()
      if (dayOfWeek === 6 || index === data.contributions.length - 1) {
        res.push(currentWeek)
        currentWeek = []
      }
    })
    return res
  }, [data.contributions])

  // Format date readable
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso)
      const dayName = DAYS[d.getDay()]
      const month = MONTHS[d.getMonth()]
      return `${dayName}, ${month} ${d.getDate()}, ${d.getFullYear()}`
    } catch {
      return iso
    }
  }

  return (
    <section className="section commit-truck-section" id="activity">
      <SectionHeader index="06" title="Activity" />

      {/* Industrial Manifest Card Header */}
      <div className="truck-manifest">
        <div className="truck-manifest__left">
          <div className="truck-manifest__total">
            <span className="truck-manifest__num mono">{stats.total.toLocaleString()}</span>
            <span className="truck-manifest__label mono">
              Commits Shipped / Year
            </span>
          </div>
          <p className="truck-manifest__desc muted">
            Continuous deployment activity and code shipments on GitHub across web, mobile, and Web3 systems.
          </p>
        </div>

        <div className="truck-manifest__stats mono">
          <div className="truck-manifest__pill">
            <span className="truck-manifest__pill-val">{stats.activeDays}</span>
            <span className="truck-manifest__pill-lbl muted">Active Days</span>
          </div>
          <div className="truck-manifest__pill">
            <span className="truck-manifest__pill-val">{stats.longestStreak}d</span>
            <span className="truck-manifest__pill-lbl muted">Longest Streak</span>
          </div>
          <div className="truck-manifest__pill">
            <span className="truck-manifest__pill-val">{stats.maxDay.count}</span>
            <span className="truck-manifest__pill-lbl muted">Peak in 1 Day</span>
          </div>
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="truck-manifest__btn"
          >
            <span>@{GITHUB_USERNAME} ↗</span>
          </a>
        </div>
      </div>

      {/* Truck & Cargo Heatmap Container Track */}
      <motion.div
        className="truck-track"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <div className="truck-stage">
          <svg
            className="truck-svg"
            viewBox="0 0 1180 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="GitHub Commits Cargo Truck"
          >
            <defs>
              {/* Headlight beam linear gradient */}
              <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.45" />
                <stop offset="35%" stopColor="var(--fg)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--fg)" stopOpacity="0" />
              </linearGradient>

              {/* Container subtle metallic shadow */}
              <linearGradient id="containerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--surface-hover)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--surface)" stopOpacity="0.95" />
              </linearGradient>

              {/* Cab Metallic Gradient */}
              <linearGradient id="cabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--surface-hover)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--surface)" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* 1. ASPHALT ROADWAY WITH ANIMATED ROAD STRIPES */}
            <g className="truck-road">
              {/* Road bed */}
              <rect x="0" y="300" width="1180" height="38" fill="var(--bg-subtle)" />
              <line x1="0" y1="300" x2="1180" y2="300" stroke="var(--line)" strokeWidth="1.5" />
              {/* Dashed center lane markings */}
              <line
                x1="0"
                y1="320"
                x2="1180"
                y2="320"
                stroke="var(--line)"
                strokeWidth="2.5"
                strokeDasharray="22 18"
                className="truck-road__stripes"
              />
            </g>

            {/* 2. HEADLIGHT LIGHT BEAM PROJECTING FORWARD */}
            <polygon
              points="1132,230 1180,210 1180,300 1132,246"
              fill="url(#headlightBeam)"
              className="truck-headlight-cone"
            />

            {/* 3. TRACTOR UNIT (SEMI TRUCK CAB ON RIGHT) */}
            <g className="truck-cab">
              {/* Exhaust Stack */}
              <rect x="898" y="24" width="8" height="180" rx="3" fill="var(--muted)" opacity="0.4" />
              <path d="M906 32 C914 32, 918 26, 922 20" stroke="var(--muted)" strokeWidth="2.5" fill="none" opacity="0.6" />

              {/* Cab Main Body */}
              <path
                d="M 886 68
                   L 950 42
                   Q 975 32 1010 65
                   L 1055 95
                   Q 1065 102 1075 125
                   L 1102 170
                   L 1132 175
                   L 1132 254
                   L 886 254
                   Z"
                fill="url(#cabGrad)"
                stroke="var(--line)"
                strokeWidth="1.8"
              />

              {/* Aerodynamic roof deflector lines */}
              <line x1="905" y1="62" x2="975" y2="40" stroke="var(--line)" strokeWidth="1.2" />
              <line x1="945" y1="46" x2="1005" y2="70" stroke="var(--line)" strokeWidth="1.2" />

              {/* Windshield */}
              <path
                d="M 1032 98
                   L 1070 125
                   L 1092 168
                   L 1045 168
                   L 1018 108
                   Z"
                fill="var(--bg)"
                stroke="var(--line)"
                strokeWidth="1.5"
                opacity="0.85"
              />
              {/* Windshield reflection accent */}
              <line x1="1040" y1="108" x2="1075" y2="160" stroke="var(--line)" strokeWidth="1" opacity="0.4" />

              {/* Side Window */}
              <path
                d="M 985 98
                   L 1012 106
                   L 1040 168
                   L 985 168
                   Z"
                fill="var(--bg)"
                stroke="var(--line)"
                strokeWidth="1.5"
                opacity="0.85"
              />

              {/* Driver Door Outline */}
              <rect x="978" y="90" width="70" height="145" rx="3" fill="none" stroke="var(--line)" strokeWidth="1.2" />
              <rect x="1034" y="174" width="9" height="3" rx="1.5" fill="var(--fg)" />

              {/* Driver Stencil Decal */}
              <text x="986" y="202" fill="var(--muted)" fontSize="7" fontFamily="var(--mono)" letterSpacing="0.08em">
                OPR // DRANYL-23
              </text>
              <text x="986" y="214" fill="var(--muted)" fontSize="6" fontFamily="var(--mono)" letterSpacing="0.08em" opacity="0.75">
                DISP: PROD-READY
              </text>

              {/* Front Chrome Bumper */}
              <rect x="1120" y="238" width="16" height="24" rx="3" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.5" />
              {/* Headlight unit */}
              <rect x="1126" y="232" width="6" height="12" rx="2" fill="var(--fg)" className="truck-headlight-bulb" />

              {/* Chrome Front Grille */}
              <rect x="1108" y="180" width="22" height="52" rx="2" fill="var(--bg-subtle)" stroke="var(--line)" strokeWidth="1.2" />
              <line x1="1112" y1="190" x2="1126" y2="190" stroke="var(--line)" strokeWidth="1.5" />
              <line x1="1112" y1="198" x2="1126" y2="198" stroke="var(--line)" strokeWidth="1.5" />
              <line x1="1112" y1="206" x2="1126" y2="206" stroke="var(--line)" strokeWidth="1.5" />
              <line x1="1112" y1="214" x2="1126" y2="214" stroke="var(--line)" strokeWidth="1.5" />
              <line x1="1112" y1="222" x2="1126" y2="222" stroke="var(--line)" strokeWidth="1.5" />

              {/* Cylindrical Aluminum Fuel Tank */}
              <rect x="912" y="250" width="90" height="24" rx="8" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.5" />
              <line x1="935" y1="250" x2="935" y2="274" stroke="var(--line)" strokeWidth="1.5" />
              <line x1="978" y1="250" x2="978" y2="274" stroke="var(--line)" strokeWidth="1.5" />

              {/* Cab Steps */}
              <rect x="1038" y="240" width="18" height="3" fill="var(--fg)" opacity="0.6" />
              <rect x="1038" y="246" width="18" height="3" fill="var(--fg)" opacity="0.6" />
            </g>

            {/* 4. TRAILER HITCH & AIR BRAKE CONNECTIONS */}
            <g className="truck-hitch">
              <rect x="866" y="246" width="26" height="8" rx="2" fill="var(--fg)" opacity="0.4" />
              {/* Coiled air lines */}
              <path d="M 868 210 Q 876 220 882 214 T 894 225" fill="none" stroke="var(--muted)" strokeWidth="1.8" />
            </g>

            {/* 5. CARGO CONTAINER (THE COMMIT HEATMAP TRAILER) */}
            <g className="truck-container">
              {/* Chassis Base Beam */}
              <rect x="22" y="248" width="852" height="8" rx="1" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.2" />

              {/* Container Outer Box */}
              <rect
                x="24"
                y="32"
                width="844"
                height="216"
                rx="6"
                fill="url(#containerGrad)"
                stroke="var(--line)"
                strokeWidth="2"
              />

              {/* Container 4 ISO Corner Castings */}
              <rect x="24" y="32" width="22" height="20" rx="3" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.5" />
              <circle cx="35" cy="42" r="4.5" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />

              <rect x="846" y="32" width="22" height="20" rx="3" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.5" />
              <circle cx="857" cy="42" r="4.5" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />

              <rect x="24" y="228" width="22" height="20" rx="3" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.5" />
              <circle cx="35" cy="238" r="4.5" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />

              <rect x="846" y="228" width="22" height="20" rx="3" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.5" />
              <circle cx="857" cy="238" r="4.5" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />

              {/* Vertical Corrugated Panel Seam Lines */}
              {[120, 215, 310, 405, 500, 595, 690, 785].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="34"
                  x2={x}
                  y2="246"
                  stroke="var(--line)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.35"
                />
              ))}

              {/* Container Top Stencil Bar */}
              <text x="56" y="49" fill="var(--muted)" fontSize="8" fontFamily="var(--mono)" letterSpacing="0.1em">
                CONT_ID // GH-2026-DRANYL
              </text>
              <text x="430" y="49" fill="var(--fg)" fontSize="8" fontFamily="var(--mono)" letterSpacing="0.12em" opacity="0.9">
                CARGO: 1,437 COMMITS SHIPPED
              </text>
              <text x="735" y="49" fill="var(--muted)" fontSize="8" fontFamily="var(--mono)" letterSpacing="0.08em">
                ISO 6346 // 53FT HQ
              </text>

              {/* Inner Heatmap Enclosure */}
              <rect
                x="44"
                y="62"
                width="804"
                height="124"
                rx="4"
                fill="var(--bg)"
                stroke="var(--line)"
                strokeWidth="1.2"
                opacity="0.9"
              />

              {/* Day of Week Labels (Mon, Wed, Fri) on the left */}
              <g className="truck-grid__days">
                <text x="36" y="93" fill="var(--muted)" fontSize="6.5" fontFamily="var(--mono)" textAnchor="end">
                  M
                </text>
                <text x="36" y="125" fill="var(--muted)" fontSize="6.5" fontFamily="var(--mono)" textAnchor="end">
                  W
                </text>
                <text x="36" y="157" fill="var(--muted)" fontSize="6.5" fontFamily="var(--mono)" textAnchor="end">
                  F
                </text>
              </g>

              {/* 53 WEEKS x 7 DAYS COMMIT SQUARES */}
              <g className="truck-grid__cells">
                {weeks.map((week, wIdx) => {
                  const x = 50 + wIdx * 14.8
                  return (
                    <g key={wIdx}>
                      {week.map((day) => {
                        const dayOfWeek = new Date(day.date).getDay()
                        const y = 67 + dayOfWeek * 16.5
                        const isHovered = activeDay?.day.date === day.date

                        return (
                          <rect
                            key={day.date}
                            x={x}
                            y={y}
                            width="11"
                            height="11"
                            rx="2"
                            className={`truck-cell truck-cell--lvl-${day.level} ${isHovered ? 'is-active' : ''}`}
                            data-date={day.date}
                            data-count={day.count}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect()
                              setActiveDay({ day, x: rect.left + rect.width / 2, y: rect.top })
                            }}
                            onMouseLeave={() => setActiveDay(null)}
                          />
                        )
                      })}
                    </g>
                  )
                })}
              </g>

              {/* Container Bottom Stencil Bar */}
              <text x="56" y="210" fill="var(--muted)" fontSize="7" fontFamily="var(--mono)" letterSpacing="0.08em">
                ORIGIN: COR JESU COLLEGE // DEST: PRODUCTION (GMT+8)
              </text>
              <text x="560" y="210" fill="var(--muted)" fontSize="7" fontFamily="var(--mono)" letterSpacing="0.08em">
                TARE: 0 DEFECT // STATUS: CONTINUOUS DELIVERY
              </text>

              {/* Container Door Lock Bars on Far Left */}
              <line x1="28" y1="56" x2="28" y2="222" stroke="var(--line)" strokeWidth="2.5" />
              <line x1="32" y1="56" x2="32" y2="222" stroke="var(--line)" strokeWidth="2.5" />
              <rect x="26" y="130" width="8" height="18" rx="1.5" fill="var(--fg)" opacity="0.6" />

              {/* Landing Gear Support Legs */}
              <rect x="230" y="254" width="7" height="42" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1" />
              <rect x="245" y="254" width="7" height="42" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1" />
              <rect x="225" y="294" width="32" height="6" rx="2" fill="var(--fg)" opacity="0.7" />
              <line x1="230" y1="262" x2="252" y2="288" stroke="var(--line)" strokeWidth="1.2" />
            </g>

            {/* 6. WHEELS & SUSPENSION AXLES (ALL WITH TIRE TREAD & SPOKES) */}
            <g className="truck-wheels">
              {/* Trailer Rear Mudguard */}
              <path
                d="M 50 280
                   Q 55 242 100 242
                   L 155 242
                   Q 200 242 205 280"
                fill="none"
                stroke="var(--line)"
                strokeWidth="2"
              />

              {/* Cab Drive Axle Mudguard */}
              <path
                d="M 885 280
                   Q 890 242 935 242
                   L 990 242
                   Q 1035 242 1040 280"
                fill="none"
                stroke="var(--line)"
                strokeWidth="2"
              />

              {/* Wheel Centers:
                  Trailer: x = 95, 160
                  Cab Drive: x = 930, 995
                  Cab Steer: x = 1075
              */}
              {[95, 160, 930, 995, 1075].map((cx) => (
                <g key={cx} className="truck-wheel">
                  {/* Outer Tire */}
                  <circle cx={cx} cy="276" r="23" fill="#141414" stroke="var(--line)" strokeWidth="1.8" />
                  {/* Tire Tread Accent */}
                  <circle cx={cx} cy="276" r="19" fill="none" stroke="rgba(245, 245, 243, 0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Steel Rim */}
                  <circle cx={cx} cy="276" r="14" fill="var(--surface-hover)" stroke="var(--line)" strokeWidth="1.4" />
                  {/* Lug Nuts Circle */}
                  <circle cx={cx} cy="276" r="9.5" fill="none" stroke="var(--fg)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                  {/* Center Hub */}
                  <circle cx={cx} cy="276" r="5" fill="var(--bg)" stroke="var(--line)" strokeWidth="1.2" />
                  {/* Hub Dot */}
                  <circle cx={cx} cy="276" r="2" fill="var(--fg)" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Floating Cargo Manifest Tooltip */}
      {activeDay && (
        <div
          className="truck-tooltip mono"
          style={{
            left: `${activeDay.x}px`,
            top: `${activeDay.y - 12}px`,
          }}
        >
          <div className="truck-tooltip__header">
            <span className="truck-tooltip__badge">
              {activeDay.day.count > 0 ? `Level ${activeDay.day.level}` : 'Idle'}
            </span>
            <span className="truck-tooltip__date">{formatDate(activeDay.day.date)}</span>
          </div>
          <div className="truck-tooltip__count">
            <strong>{activeDay.day.count}</strong> {activeDay.day.count === 1 ? 'commit' : 'commits'} shipped
          </div>
        </div>
      )}

      {/* Legend & Pipeline Info */}
      <div className="truck-footer mono">
        <div className="truck-legend">
          <span className="muted">Less</span>
          <span className="truck-legend__box truck-cell--lvl-0" title="0 commits" />
          <span className="truck-legend__box truck-cell--lvl-1" title="1-3 commits" />
          <span className="truck-legend__box truck-cell--lvl-2" title="4-9 commits" />
          <span className="truck-legend__box truck-cell--lvl-3" title="10-19 commits" />
          <span className="truck-legend__box truck-cell--lvl-4" title="20+ commits" />
          <span className="muted">More</span>
        </div>

        <div className="truck-footer__note muted">
          Monochrome telemetry synced from GitHub API · Production deployment log
        </div>
      </div>
    </section>
  )
}
