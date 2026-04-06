'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { subscribeEmail } from '@/app/actions'

interface BubbleData {
  x: number
  y: number
  r: number
  dur: string
  delay: string
  dx: string
  dy: string
}

interface GlitterData {
  left: string
  top: string
  size: number
  color: string
  dur: string
  delay: string
  shadow: string
}

interface AmbientData {
  size: number
  left: string
  color: string
  dur: string
  delay: string
}

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)

  const [bubbles, setBubbles] = useState<BubbleData[]>([])
  const [glitter, setGlitter] = useState<GlitterData[]>([])
  const [ambient, setAmbient] = useState<AmbientData[]>([])

  useEffect(() => {
    // Bubble cluster
    const foundation = [
      { x: 0.18, y: 0.14, r: 130 }, { x: 0.82, y: 0.14, r: 125 }, { x: 0.50, y: 0.10, r: 145 },
      { x: 0.13, y: 0.50, r: 138 }, { x: 0.87, y: 0.50, r: 132 }, { x: 0.50, y: 0.50, r: 160 },
      { x: 0.18, y: 0.86, r: 130 }, { x: 0.82, y: 0.86, r: 128 }, { x: 0.50, y: 0.92, r: 142 },
      { x: 0.35, y: 0.30, r: 122 }, { x: 0.65, y: 0.30, r: 120 }, { x: 0.35, y: 0.70, r: 124 }, { x: 0.65, y: 0.70, r: 122 },
    ]
    const fillers = [
      { x: 0.03, y: 0.32, r: 72 }, { x: 0.97, y: 0.32, r: 68 }, { x: 0.03, y: 0.68, r: 70 }, { x: 0.97, y: 0.68, r: 74 },
      { x: 0.28, y: 0.01, r: 62 }, { x: 0.72, y: 0.01, r: 60 }, { x: 0.28, y: 0.99, r: 64 }, { x: 0.72, y: 0.99, r: 58 },
      { x: 0.50, y: 0.01, r: 52 }, { x: 0.50, y: 0.99, r: 54 }, { x: 0.01, y: 0.50, r: 58 }, { x: 0.99, y: 0.50, r: 52 },
    ]
    const accents: { x: number; y: number; r: number }[] = Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2
      return {
        x: 0.5 + Math.cos(a) * (0.47 + Math.random() * 0.1),
        y: 0.5 + Math.sin(a) * (0.47 + Math.random() * 0.1),
        r: Math.random() * 28 + 18,
      }
    })
    const sparkles: { x: number; y: number; r: number }[] = Array.from({ length: 14 }, () => ({
      x: 0.08 + Math.random() * 0.84,
      y: 0.08 + Math.random() * 0.84,
      r: Math.random() * 14 + 7,
    }))

    setBubbles(
      [...foundation, ...fillers, ...accents, ...sparkles].map(b => ({
        ...b,
        dur: (3 + Math.random() * 4) + 's',
        delay: (Math.random() * 3) + 's',
        dx: (Math.random() * 3 - 1.5) + 'px',
        dy: (Math.random() * 3 - 1.5) + 'px',
      }))
    )

    // Glitter
    const gcols = ['#FF69B4', '#FF8DC7', '#7EB6FF', '#C9A0DC', '#FFB6D9', '#B8D4FF', '#E0C6F0']
    setGlitter(
      Array.from({ length: 55 }, () => {
        const sz = Math.random() * 3 + 1.5
        const color = gcols[Math.floor(Math.random() * gcols.length)]
        return {
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          size: sz,
          color,
          dur: (Math.random() * 3 + 2) + 's',
          delay: (Math.random() * 5) + 's',
          shadow: `0 0 ${Math.random() * 6 + 3}px ${color}`,
        }
      })
    )

    // Ambient bubbles
    const ambCols = ['#FFD6E8', '#D6E8FF', '#E0C6F0', '#FFE0EE', '#C8DEFF']
    setAmbient(
      Array.from({ length: 6 }, () => {
        const sz = Math.random() * 60 + 25
        return {
          size: sz,
          left: Math.random() * 100 + '%',
          color: ambCols[Math.floor(Math.random() * ambCols.length)],
          dur: (Math.random() * 14 + 10) + 's',
          delay: (Math.random() * 8) + 's',
        }
      })
    )
  }, [])

  async function handlePresave() {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    setStatus('loading')
    const result = await subscribeEmail(email)
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Something went wrong.')
    }
  }

  return (
    <>
      <div className="bg-gradient" />

      <div className="glitter-container">
        {glitter.map((g, i) => (
          <div
            key={i}
            className="glitter"
            style={{
              left: g.left,
              top: g.top,
              width: g.size + 'px',
              height: g.size + 'px',
              background: g.color,
              boxShadow: g.shadow,
              ['--dur' as string]: g.dur,
              ['--delay' as string]: g.delay,
            }}
          />
        ))}
      </div>

      {ambient.map((b, i) => (
        <div
          key={i}
          className="ambient-bubble"
          style={{
            width: b.size + 'px',
            height: b.size + 'px',
            left: b.left,
            background: b.color,
            ['--dur' as string]: b.dur,
            ['--delay' as string]: b.delay,
          }}
        />
      ))}

      <div className="page-container">
        <div className="bubble-card-wrap">
          <div className="bubble-cluster">
            {bubbles.map((b, i) => (
              <div
                key={i}
                className="cluster-bubble"
                style={{
                  width: b.r * 2 + 'px',
                  height: b.r * 2 + 'px',
                  left: `calc(${b.x * 100}% - ${b.r}px)`,
                  top: `calc(${b.y * 100}% - ${b.r}px)`,
                  background: '#FFD6E8',
                  ['--dur' as string]: b.dur,
                  ['--delay' as string]: b.delay,
                  ['--dx' as string]: b.dx,
                  ['--dy' as string]: b.dy,
                }}
              />
            ))}
          </div>

          <div className="logo-wrap">
            <Image src="/DruU.png" alt="DRü" width={130} height={130} priority />
          </div>
          <h1 className="artist-name">DRÜ</h1>
          <p className="tagline">Something new is coming</p>

          <div className="card-content">
            <h2 className="card-title">Be the first to hear it</h2>
            <p className="card-subtitle">
              Drop your email to presave <span className="song-title">&ldquo;Trucks Broke Down&rdquo;</span>
              <br />and get early access to everything.
            </p>

            {status !== 'success' ? (
              <div className="input-group">
                <input
                  type="email"
                  className={`email-input${shake ? ' shake' : ''}`}
                  placeholder="your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePresave()}
                  autoComplete="email"
                />
                <button
                  className="presave-btn"
                  onClick={handlePresave}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? '✦ ✦ ✦' : 'PRESAVE NOW ✦'}
                </button>
                {status === 'error' && <p className="error-msg">{errorMsg}</p>}
              </div>
            ) : (
              <div className="success-msg">
                ✦ you&apos;re in, babe. we&apos;ll hit you up when it drops. 💖
              </div>
            )}

            <div className="divider">or</div>

            <a href="https://www.patreon.com/INDRUWORLD" className="patreon-btn" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21 0 3.96-3.22 7.18-7.18 7.18-3.97 0-7.21-3.22-7.21-7.18 0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2V21.6z" />
              </svg>
              Get the song today on Patreon
            </a>
          </div>
        </div>

        <div className="socials">
          <a href="https://www.tiktok.com/@_drumusic" className="social-link" title="TikTok" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
            </svg>
          </a>
          <a href="https://www.instagram.com/_drumusic/" className="social-link" title="Instagram" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85 0-3.2.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.3.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
            </svg>
          </a>
          <a href="https://www.youtube.com/@DRUCRUW" className="social-link" title="YouTube" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href="https://www.facebook.com/Drewellamusic" className="social-link" title="Facebook" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </a>
        </div>

        <div className="footer">
          <p>© 2026 DRü · Built by <a href="https://www.ariasstudio.ca">Arias Studio</a></p>
        </div>
      </div>
    </>
  )
}
