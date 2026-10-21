import { useEffect, useState } from 'react'

type ApiState = 'checking' | 'online' | 'offline'

export default function App() {
  const [status, setStatus] = useState<ApiState>('checking')

  useEffect(() => {
    let ignore = false

    async function checkHealth() {
      try {
        const res = await fetch('/api/health')
        if (!res.ok) {
          if (!ignore) {
            setStatus('offline')
          }
          return
        }
        const data = (await res.json()) as { ok?: boolean }
        if (!ignore) {
          if (data && data.ok === true) {
            setStatus('online')
          } else {
            setStatus('offline')
          }
        }
      } catch {
        if (!ignore) {
          setStatus('offline')
        }
      }
    }

    checkHealth()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="hdr h-16 flex items-center">
        <div className="wrap w-full flex items-center">
          <a href="/" aria-label="LucidHire home" className="logo">
            <svg className="logo-mark" viewBox="0 0 26 26" aria-hidden="true">
              <rect width="26" height="26" rx="6" fill="var(--ink)" />
              <path
                d="M6.5 7.5h9"
                stroke="var(--paper)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M5.5 13h15" stroke="var(--marker)" strokeWidth="5.5" />
              <path
                d="M6.5 18.5h11"
                stroke="var(--paper)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>
              Lucid<span className="mk">Hire</span>
            </span>
          </a>
        </div>
      </header>

      <main className="flex-1 overflow-x-clip">
        <section className="wrap py-12 md:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">CV screening for small hiring teams</p>
            <h1 data-testid="hero-heading" className="hero-heading mt-5">
              <span>
                We read{' '}
                <span className="mk sweep hl-pen" style={{ '--d': '0.35s' } as React.CSSProperties}>
                  every CV.
                  <span className="pen-track" aria-hidden="true">
                    <svg className="pen" viewBox="0 0 160 46">
                      <path
                        d="M30 32 10 26.5 4 15h26z"
                        fill="var(--marker)"
                        stroke="var(--ink)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="28"
                        y="11"
                        width="16"
                        height="25"
                        rx="2"
                        fill="var(--paper)"
                        stroke="var(--ink)"
                        strokeWidth="3"
                      />
                      <rect
                        x="42"
                        y="7"
                        width="112"
                        height="33"
                        rx="9"
                        fill="var(--marker)"
                        stroke="var(--ink)"
                        strokeWidth="3"
                      />
                      <rect x="110" y="7" width="44" height="33" rx="9" fill="var(--ink)" />
                      <path
                        d="M58 17h38"
                        stroke="var(--ink)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.28"
                      />
                    </svg>
                  </span>
                </span>
              </span>
              <span>
                You meet the{' '}
                <span className="mk sweep" style={{ '--d': '1.45s' } as React.CSSProperties}>
                  best ones.
                </span>
              </span>
            </h1>
            <p className="lede mt-7">
              LucidHire reads every application against your requirements, marks what
              matches and what&apos;s missing, and keeps one ranked shortlist with the evidence
              behind every score.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3">
              <div
                role="status"
                data-testid="api-status"
                data-state={status}
                className="status-pill"
              >
                {status === 'checking' && (
                  <>
                    <span className="live-dot" aria-hidden="true" />
                    <span>Checking the API…</span>
                  </>
                )}
                {status === 'online' && (
                  <>
                    <span className="live-dot live-dot-blink" aria-hidden="true" />
                    <span>API online</span>
                  </>
                )}
                {status === 'offline' && (
                  <span>
                    API <span className="mk mk-gap">unreachable</span>
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-ink-muted">
                New version in progress. This is the staging build.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
