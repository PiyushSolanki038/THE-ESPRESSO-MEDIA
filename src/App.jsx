import { useEffect, useMemo, useRef, useState } from 'react'

const STEP_LIST = [
  { num: '01', phase: 'Input', title: 'Find the signal', copy: 'We align on the business goal, audience tension and the number that defines success.', tag: 'Input — objective, audience, metric' },
  { num: '02', phase: 'Shape', title: 'Shape the story', copy: 'Strategy becomes a sharp creative system—message, look, channel and measurement.', tag: 'Output — message, look, channel' },
  { num: '03', phase: 'Motion', title: 'Put it in motion', copy: 'We produce, launch and learn quickly, keeping creative and media in one feedback loop.', tag: 'Loop — produce, launch, learn' },
  { num: '04', phase: 'Scale', title: 'Scale what works', copy: 'Winning ideas get refined and expanded. Weak signals are cut without sentiment.', tag: 'Decision — refine, expand, cut' },
]

const SERVICES = [
  { num: '01', title: 'Branding & design', copy: 'Identity, positioning and design systems that make every campaign more recognisable.' },
  { num: '02', title: 'Digital marketing', copy: 'Paid media and conversion journeys shaped by data, tested against clear commercial goals.' },
  { num: '03', title: 'Social management', copy: 'A consistent content engine designed for relevance, recall and meaningful audience action.' },
  { num: '04', title: 'Video production', copy: 'Strategy-led films and short-form creative made to hold attention and move people.' },
]

const ENQUIRY = [
  { k: 'Good fit', v: 'Growing businesses' },
  { k: 'Engagements', v: 'Retainer / project' },
  { k: 'Starts with', v: 'One objective, one metric' },
]

const STATS = [
  { value: '2022', label: 'Founded' },
  { value: '04', label: 'Core disciplines' },
  { value: '01', label: 'Shared measure: impact' },
]

const TICKER_GROUPS = [0, 1]

export default function App({ revealOnScroll = true, showTicker = true, tickerSeconds = 22 }) {
  const [state, setState] = useState({ progress: 0, hProgress: 0, hActive: 0, wide: true, roomy: true })
  const { progress, hProgress, hActive, wide, roomy } = state
  const [navOpen, setNavOpen] = useState(false)

  const rootRef = useRef(null)
  const heroImgRef = useRef(null)
  const heroContentRef = useRef(null)
  const heroSectionRef = useRef(null)
  const capSectionRef = useRef(null)
  const capWordRef = useRef(null)
  const outSectionRef = useRef(null)
  const outWordRef = useRef(null)
  const outWord2Ref = useRef(null)
  const outWord3Ref = useRef(null)
  const hSectionRef = useRef(null)

  const revealElsRef = useRef([])
  const capRowsRef = useRef([])
  const hRowsRef = useRef([])

  useEffect(() => {
    const onResize = () => {
      const w = (rootRef.current && rootRef.current.clientWidth) || window.innerWidth
      setState((s) => ({ ...s, wide: w >= 860, roomy: w >= 1120 }))
      if (w >= 860) setNavOpen(false)
    }
    onResize()
    window.addEventListener('resize', onResize)

    // Cache DOM lookups once instead of re-querying the whole document every
    // animation frame — querySelectorAll + per-row querySelector calls inside
    // the rAF loop were the main source of jank/stutter right at page load.
    revealElsRef.current = Array.from(document.querySelectorAll('[data-reveal]'))
    capRowsRef.current = capSectionRef.current
      ? Array.from(capSectionRef.current.querySelectorAll('[data-cap]')).map((row) => ({
          row,
          anchor: row.querySelector('[data-captitle]'),
          fill: row.querySelector('[data-capfill]'),
          num: row.querySelector('[data-capnum]'),
          copy: row.querySelector('[data-capcopy]'),
        }))
      : []
    hRowsRef.current = hSectionRef.current
      ? Array.from(hSectionRef.current.querySelectorAll('[data-wrow]')).map((el) => ({
          el,
          title: el.querySelector('[data-wtitle]'),
          body: el.querySelector('[data-wbody]'),
          meta: el.querySelector('[data-wmeta]'),
          rule: el.querySelector('[data-wrule]'),
          tick: el.querySelector('[data-wtick]'),
        }))
      : []

    const frame = () => {
      let sc = null, best = 0
      const cands = [document.scrollingElement, document.documentElement, document.body]
      let p = rootRef.current && rootRef.current.parentElement
      while (p) { cands.push(p); p = p.parentElement }
      for (const el of cands) {
        if (!el) continue
        const over = el.scrollHeight - el.clientHeight
        if (over > 40 && el.scrollTop > best) { best = el.scrollTop; sc = el }
        if (!sc && over > 40) sc = el
      }
      const top = sc ? sc.scrollTop : window.scrollY
      const max = sc ? sc.scrollHeight - sc.clientHeight : document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.min(100, (top / max) * 100) : 0
      setState((s) => (Math.abs(pct - s.progress) > 0.2 ? { ...s, progress: pct } : s))

      const vh = sc ? sc.clientHeight : window.innerHeight
      const base = sc && sc !== document.documentElement && sc !== document.body ? sc.getBoundingClientRect().top : 0
      const off = revealOnScroll === false
      for (const el of revealElsRef.current) {
        if (el.classList.contains('is-in')) continue
        if (off) { el.classList.remove('is-armed'); el.classList.add('is-in'); continue }
        const r = el.getBoundingClientRect()
        const y = r.top - base
        if (y < vh * 0.9 && y + r.height > 0) { el.classList.remove('is-armed'); el.classList.add('is-in') }
        else if (y >= vh * 0.9) el.classList.add('is-armed')
      }

      if (heroImgRef.current) {
        const hr = heroImgRef.current.getBoundingClientRect()
        const v = Math.min(Math.max(0, -(hr.top - base)), vh)
        heroImgRef.current.style.transform = 'translate3d(0,' + v * 0.02 + 'px,0) scale(1.60)'
        if (heroContentRef.current) {
          const f = Math.min(1, v / (vh * 0.85))
          heroContentRef.current.style.transform = 'translate3d(0,' + v * 0.03 + 'px,0)'
          heroContentRef.current.querySelectorAll('[data-hero-fade]').forEach((el) => {
            el.style.opacity = String(1 - f * 0.85)
          })
        }
      }
      if (capSectionRef.current) {
        const cb = capSectionRef.current.getBoundingClientRect()
        const ck = Math.min(1, Math.max(0, (vh - (cb.top - base)) / (vh + cb.height)))
        if (capWordRef.current) capWordRef.current.style.transform = 'translate3d(' + (-6 - ck * 30).toFixed(2) + '%,0,0)'
        capRowsRef.current.forEach(({ anchor, fill, num, copy }, i) => {
          if (!anchor) return
          const b = anchor.getBoundingClientRect()
          const top = b.top - base
          const on = top < vh * 0.8
          if (fill) fill.style.transform = 'scaleX(' + (on ? 1 : 0) + ')'
          if (copy) { copy.style.opacity = on ? '1' : '0'; copy.style.transform = on ? 'none' : 'translateY(14px)' }
          const prog = Math.min(1, Math.max(-1, (vh * 0.62 - top) / vh))
          if (num) num.style.transform = 'translateY(' + (prog * (i % 2 ? -10 : -5)).toFixed(1) + 'px)'
        })
      }
      if (outSectionRef.current) {
        const orb = outSectionRef.current.getBoundingClientRect()
        const t = (vh - (orb.top - base)) / (vh + orb.height)
        const k = Math.min(1, Math.max(0, t))
        if (outWordRef.current) outWordRef.current.style.transform = 'translate3d(' + (-k * 26).toFixed(2) + '%,0,0)'
        if (outWord2Ref.current) outWord2Ref.current.style.transform = 'translate3d(' + (-34 + k * 30).toFixed(2) + '%,0,0)'
        if (outWord3Ref.current) outWord3Ref.current.style.transform = 'translate3d(' + (-8 - k * 38).toFixed(2) + '%,0,0) scale(' + (0.985 + k * 0.03).toFixed(3) + ')'
        if (outWordRef.current) outWordRef.current.style.opacity = String(0.82 + Math.min(0.18, k * 0.4))
      }
      if (hSectionRef.current) {
        const rows = hRowsRef.current
        const n = rows.length || 1
        const r = hSectionRef.current.getBoundingClientRect()
        const spanH = r.height - vh
        const hp = spanH > 0 ? Math.min(1, Math.max(0, -(r.top - base) / spanH)) : 0
        const pos = hp * n - 0.5
        const nearest = Math.min(n - 1, Math.max(0, Math.round(pos)))
        const pctH = Math.round(((nearest + 1) / n) * 1000) / 10

        setState((s) => {
          let next = s
          if (Math.abs(pctH - s.hProgress) > 0.4) next = { ...next, hProgress: pctH }
          if (nearest !== s.hActive) next = { ...next, hActive: nearest }
          return next
        })

        rows.forEach(({ el, title, body, meta, rule, tick }, i) => {
          const on = i === nearest
          el.style.padding = on ? (state.wide ? '40px 0 48px' : '32px 0 36px') : (state.wide ? '28px 0' : '22px 0')
          if (title) {
            title.style.color = on ? '#003242' : 'transparent'
            title.style.webkitTextStrokeColor = on ? 'transparent' : 'rgba(0,50,66,.4)'
            title.style.transform = on ? 'translateX(0)' : 'translateX(-6px)'
          }
          if (body) {
            body.style.maxHeight = on ? '240px' : '0px'
            body.style.opacity = on ? '1' : '0'
            body.style.transform = on ? 'translateY(0)' : 'translateY(12px)'
          }
          if (meta) {
            meta.style.color = on ? '#C72A09' : 'rgba(0,50,66,.45)'
            meta.style.transform = on ? 'translateY(4px)' : 'none'
          }
          if (rule) rule.style.transform = 'scaleX(' + (on ? 1 : 0) + ')'
          if (tick) tick.style.transform = 'scale(' + (on ? 1 : 0) + ')'
        })
      }
    }

    let raf
    const tick = () => {
      try { frame() } catch (e) { /* never kill the loop */ }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealOnScroll])

  const active = STEP_LIST[Math.min(STEP_LIST.length - 1, Math.max(0, hActive))]

  // The vw/1.5 aspect-ratio height is meant for wide/landscape screens; on a
  // narrow mobile portrait viewport it collapses to ~250-280px, which is too
  // short for the headline + meta bar and makes them overlap the sticky
  // header. Fall back to a near-full-height hero on mobile instead.
  const heroSectionHeight = wide ? 'min(calc(100vw / 1.5), 100vh)' : 'min(100svh, 820px)'

  const progressWidth = progress + '%'
  const hProgressWidth = hProgress + '%'

  const outWordSize = wide ? 'clamp(5.5rem,14vw,13rem)' : 'clamp(3.25rem,18vw,7rem)'
  const outWordSize2 = wide ? 'clamp(3rem,7.5vw,7rem)' : 'clamp(2.25rem,11vw,4.5rem)'
  const outWordSize3 = wide ? 'clamp(7rem,17vw,16rem)' : 'clamp(4rem,21vw,9rem)'
  const outPad = wide ? '88px 0 96px' : '56px 0 64px'
  const outLabelGap = wide ? '40px' : '28px'
  const outRowGap = wide ? 'clamp(4px,.6vw,12px)' : '4px'
  const outputHeadSpan = wide ? '1 / 8' : '1 / -1'
  const contactAsideSpan = roomy ? '8 / -1' : '1 / -1'

  const heroSize = roomy
    ? 'min(13vw, 15rem, max(3rem, calc((100vh - 260px) / 2.55)))'
    : wide
    ? 'min(12.5vw, 11rem, max(2.5rem, calc((100vh - 300px) / 2.6)))'
    : 'min(14vw, 5rem, max(2rem, calc((100vh - 330px) / 2.7)))'
  const heroIndent = wide ? '13vw' : '8vw'
  const heroTagTop = wide ? '120px' : '104px'
  const heroSideDisplay = roomy ? 'flex' : 'none'
  const heroPad = roomy ? '88px 24px 26px 110px' : wide ? '88px 24px 26px' : '80px 20px 24px'
  const heroBarGap = wide ? 'min(32px, 3vh)' : '22px'
  const heroBarCols = roomy ? 'auto minmax(20rem,1fr) auto' : 'minmax(0,1fr)'
  const heroStatementPad = roomy ? '32px' : '0'
  const heroStatementRule = roomy ? '1px solid rgba(227,226,222,.35)' : '0'
  const heroCtaAlign = roomy ? 'end' : 'start'
  const navDisplay = wide ? 'flex' : 'none'

  const tickerDuration = tickerSeconds + 's'
  const tickerDurationSlow = tickerSeconds * 1.8 + 's'

  const capPad = wide ? '104px 0 0' : '72px 0 0'
  const capLabelGap = wide ? '36px' : '24px'
  const capWordSize = wide ? 'clamp(5rem,15vw,14rem)' : 'clamp(3.25rem,19vw,7.5rem)'
  const capListGap = wide ? '88px' : '56px'
  const capRowPad = wide ? '44px 0 52px' : '26px 0 10px'
  const capCopyPad = wide ? '44px 0 52px' : '0 0 30px'
  const capCols = wide ? '6rem minmax(0,1fr) 22rem' : '3.5rem minmax(0,1fr)'
  const capCopyCol = wide ? '3' : '2'
  const capNumSize = wide ? 'clamp(3rem,4.4vw,4.25rem)' : '2.25rem'
  const capTitleSize = wide ? 'clamp(2rem,4.2vw,3.5rem)' : 'clamp(1.6rem,7vw,2.2rem)'
  const capTitleMax = wide ? '18ch' : 'none'

  const rowCols = wide ? '88px minmax(0,1fr)' : 'minmax(0,1fr)'
  const rowPad = wide ? '28px 0' : '22px 0'
  const titlePad = wide ? '0' : '28px'
  const bodyCol = wide ? '2' : '1'

  const services = useMemo(() => SERVICES, [])
  const steps = useMemo(() => STEP_LIST, [])
  const enquiry = useMemo(() => ENQUIRY, [])
  const stats = useMemo(() => STATS, [])
  const tickerGroups = useMemo(() => TICKER_GROUPS, [])

  return (
    <main ref={rootRef} style={{ position: 'relative', background: '#E3E2DE' }}>
      <div aria-hidden="true" style={{ position: 'fixed', left: 0, right: 0, top: 0, height: 2, zIndex: 60, background: 'rgba(27,14,13,.12)' }}>
        <div style={{ height: '100%', background: '#C72A09', width: progressWidth }}></div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 50,
          opacity: 0.08,
          mixBlendMode: 'multiply',
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/></filter><rect width=\'300\' height=\'300\' filter=\'url(%23n)\'/></svg>")',
        }}
      ></div>

      <header style={{ position: 'sticky', top: 0, zIndex: 55, color: '#E3E2DE' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(27,14,13,.82), rgba(27,14,13,.45) 65%, rgba(27,14,13,0))', pointerEvents: 'none' }}></span>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '20px 24px' }}>
          <a href="#top" style={{ fontFamily: "'Clash Grotesk',sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1 }}>THE ESPRESSO MEDIA</a>
          <nav aria-label="Main navigation" style={{ display: navDisplay, alignItems: 'center', gap: 36, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            <a href="#capabilities" className="lnk">Capabilities</a>
            <a href="#approach" className="lnk">Approach</a>
            <a href="#studio" className="lnk">Studio</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>
            {wide && <span>AMD · IST</span>}
            {wide && <a href="#contact" className="lnk" style={{ fontWeight: 500 }}>Enquire</a>}
            {!wide && (
              <button
                type="button"
                aria-label={navOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={navOpen}
                onClick={() => setNavOpen((v) => !v)}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5, width: 32, height: 32, padding: 0, background: 'transparent', border: 0, cursor: 'pointer' }}
              >
                <span style={{ display: 'block', width: '100%', height: 2, background: '#E3E2DE', transition: 'transform .3s, opacity .3s', transform: navOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}></span>
                <span style={{ display: 'block', width: '100%', height: 2, background: '#E3E2DE', transition: 'opacity .3s', opacity: navOpen ? 0 : 1 }}></span>
                <span style={{ display: 'block', width: '100%', height: 2, background: '#E3E2DE', transition: 'transform .3s, opacity .3s', transform: navOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}></span>
              </button>
            )}
          </div>
        </div>
        {!wide && (
          <nav
            aria-label="Mobile navigation"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              background: '#1B0E0D',
              borderTop: '1px solid rgba(227,226,222,.2)',
              overflow: 'hidden',
              maxHeight: navOpen ? '320px' : '0px',
              transition: 'max-height .35s cubic-bezier(.16,.84,.3,1)',
            }}
          >
            <a href="#capabilities" onClick={() => setNavOpen(false)} style={{ padding: '18px 24px', fontSize: 15, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(227,226,222,.15)' }}>Capabilities</a>
            <a href="#approach" onClick={() => setNavOpen(false)} style={{ padding: '18px 24px', fontSize: 15, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(227,226,222,.15)' }}>Approach</a>
            <a href="#studio" onClick={() => setNavOpen(false)} style={{ padding: '18px 24px', fontSize: 15, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid rgba(227,226,222,.15)' }}>Studio</a>
            <a href="#contact" onClick={() => setNavOpen(false)} style={{ padding: '18px 24px', fontSize: 15, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', color: '#31EF07' }}>Enquire</a>
          </nav>
        )}
      </header>

      <section id="top" ref={heroSectionRef} style={{ position: 'relative', width: '100%', height: heroSectionHeight, minHeight: heroSectionHeight, marginTop: -72, background: '#1B0E0D', color: '#E3E2DE', overflow: 'hidden' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(120% 90% at 50% 45%, rgba(97,34,15,.5), rgba(27,14,13,1) 78%)' }}></span>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            animation: 'heroZoom 2.4s cubic-bezier(.16,.84,.3,1) both',
          }}
        >
          <picture>
            <source type="image/webp" srcSet="/espresso-campaign.webp" />
            <img
              ref={heroImgRef}
              src="/espresso-campaign.png"
              alt="Sculptural architectural set of arches, stairs and geometric forms in terracotta, stone and deep green"
              fetchPriority="high"
              decoding="async"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: wide ? 'contain' : 'cover',
                objectPosition: 'center center',
                transformOrigin: 'center center',
                filter: 'contrast(1.06) saturate(1.04) brightness(1.35)',
                willChange: 'transform',
              }}
            />
          </picture>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(105deg, rgba(27,14,13,.88) 0%, rgba(27,14,13,.55) 42%, rgba(27,14,13,.2) 68%, rgba(27,14,13,.35) 100%)' }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(27,14,13,.3), rgba(27,14,13,.04) 30%, rgba(27,14,13,.45) 70%, rgba(27,14,13,.92))' }}></div>

        <div aria-hidden="true" className="hf" style={{ animationDelay: '.6s', position: 'absolute', left: 24, top: heroTagTop, display: heroSideDisplay, flexDirection: 'column', gap: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(227,226,222,.65)', zIndex: 3 }}>
          <span>Ideas</span><span>Brands</span><span>People</span><span>Growth</span>
          <span style={{ width: 34, height: 1, background: 'rgba(227,226,222,.4)', marginTop: 12 }}></span>
          <span style={{ marginTop: 12, lineHeight: 1.7 }}>20<br />26</span>
        </div>
        <div aria-hidden="true" className="hf" style={{ animationDelay: '.68s', position: 'absolute', right: 24, top: heroTagTop, display: heroSideDisplay, flexDirection: 'column', alignItems: 'flex-end', gap: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(227,226,222,.65)', zIndex: 3 }}>
          <span>Creative</span><span>Strategy</span><span>Execution</span><span>Impact</span>
          <span style={{ width: 34, height: 1, background: 'rgba(227,226,222,.4)', marginTop: 12 }}></span>
        </div>

        <div ref={heroContentRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: heroPad, boxSizing: 'border-box', willChange: 'transform' }}>
          <h1 data-hero-fade="" style={{ margin: 'auto 0 0', flex: '0 0 auto', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: heroSize, lineHeight: 0.78, letterSpacing: '-.055em', textTransform: 'uppercase', color: '#FFFFFF', textShadow: '0 6px 24px rgba(0,0,0,.85)' }}>
            <span className="hl"><span style={{ animationDelay: '.05s' }}>Ideas that</span></span>
            <span className="hl" style={{ marginLeft: heroIndent, color: '#FF2200' }}><span style={{ animationDelay: '.17s' }}>earn</span></span>
            <span className="hl"><span style={{ animationDelay: '.29s' }}>attention.</span></span>
          </h1>

          <div style={{ marginTop: heroBarGap, paddingTop: 26, position: 'relative', flex: '0 0 auto', display: 'grid', gridTemplateColumns: heroBarCols, gap: '26px 40px', alignItems: 'center' }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1, background: 'rgba(227,226,222,.45)', transformOrigin: 'left', animation: 'heroRule 1.1s cubic-bezier(.16,.84,.3,1) .42s both' }}></span>
            <div data-hero-fade="" className="hf" style={{ animationDelay: '.52s', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', lineHeight: 2.1, color: '#FFFFFF', textShadow: '0 4px 16px rgba(0,0,0,.8)' }}>
              <div>Performance marketing / Ahmedabad</div>
              <div>Brand / Design / Media / Social / Film</div>
            </div>
            <p data-hero-fade="" className="hf" style={{ animationDelay: '.62s', margin: 0, maxWidth: '30rem', paddingLeft: heroStatementPad, borderLeft: heroStatementRule, fontSize: 16, lineHeight: 1.55, color: '#FFFFFF', textShadow: '0 4px 16px rgba(0,0,0,.8)', textWrap: 'pretty' }}>We connect brand, media, social and film into one focused system built to move business forward.</p>
            <a className="hf hero-cta" href="#contact" style={{ animationDelay: '.72s', justifySelf: heroCtaAlign, display: 'inline-flex', alignItems: 'center', gap: 18, background: '#E8451F', color: '#FFFFFF', padding: '20px 32px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.2em', fontSize: 12, boxShadow: '0 14px 34px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.15)' }}>Start a project <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      {showTicker && (
        <div style={{ borderTop: '1px solid #1B0E0D', borderBottom: '1px solid #1B0E0D', background: '#E3E2DE' }}>
          <div style={{ overflow: 'hidden', background: '#C72A09', color: '#E3E2DE' }}>
            <div style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(28px,4vw,52px)', textTransform: 'uppercase', letterSpacing: '-.03em', padding: '10px 0', animation: `ribbon ${tickerDuration} linear infinite` }}>
              {tickerGroups.map((g) => (
                <div key={g} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ padding: '0 26px' }}>Strategy</span><span style={{ width: 14, height: 14, background: '#E3E2DE', display: 'inline-block', flex: '0 0 14px' }}></span><span style={{ padding: '0 26px', color: 'transparent', WebkitTextStroke: '1px #E3E2DE' }}>Creative</span><span style={{ width: 14, height: 14, background: '#E3E2DE', display: 'inline-block', flex: '0 0 14px' }}></span><span style={{ padding: '0 26px' }}>Performance</span><span style={{ width: 14, height: 14, background: '#E3E2DE', display: 'inline-block', flex: '0 0 14px' }}></span><span style={{ padding: '0 26px', color: 'transparent', WebkitTextStroke: '1px #E3E2DE' }}>Production</span><span style={{ width: 14, height: 14, background: '#E3E2DE', display: 'inline-block', flex: '0 0 14px' }}></span><span style={{ padding: '0 26px' }}>Iteration</span><span style={{ width: 14, height: 14, background: '#E3E2DE', display: 'inline-block', flex: '0 0 14px' }}></span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ overflow: 'hidden', borderTop: '1px solid #1B0E0D', background: '#1B0E0D', color: '#E3E2DE' }}>
            <div style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', padding: '9px 0', animation: `ribbon-rev ${tickerDurationSlow} linear infinite` }}>
              {tickerGroups.map((g) => (
                <div key={g} style={{ display: 'flex', alignItems: 'center', color: 'rgba(227,226,222,.6)' }}>
                  <span style={{ padding: '0 22px' }}>Est. 2022</span><span style={{ color: '#31EF07' }}>/</span><span style={{ padding: '0 22px' }}>Ahmedabad · IST</span><span style={{ color: '#31EF07' }}>/</span><span style={{ padding: '0 22px' }}>Performance marketing</span><span style={{ color: '#31EF07' }}>/</span><span style={{ padding: '0 22px' }}>Season 04</span><span style={{ color: '#31EF07' }}>/</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section style={{ padding: '112px 24px', display: 'grid', gridTemplateColumns: 'repeat(12,minmax(0,1fr))', gap: 24 }}>
        <div data-reveal="" style={{ gridColumn: '1 / -1' }}>
          <p style={{ margin: '0 0 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#003242' }}>Manifesto / 01</p>
          <div style={{ borderTop: '1px solid #003242' }}></div>
        </div>
        <div data-reveal="" style={{ gridColumn: '1 / -1' }}>
          <p style={{ margin: 0, fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 500, fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1.08, letterSpacing: '-.02em', textTransform: 'uppercase', textIndent: '3rem', textWrap: 'pretty', color: '#003242' }}>Creativity is only powerful when it creates <span style={{ color: '#C72A09' }}>movement.</span> Not more noise. Not prettier reports. We build clear, connected marketing systems where every piece has a job—and every decision traces back to <span style={{ color: '#C72A09' }}>impact.</span></p>
        </div>
      </section>

      <section ref={capSectionRef} style={{ position: 'relative', overflow: 'hidden', padding: capPad }}>
        <p style={{ margin: `0 0 ${capLabelGap}`, padding: '0 24px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: '#C72A09' }}>Capabilities / 02</p>

        <div aria-hidden="true" style={{ overflow: 'hidden' }}>
          <div ref={capWordRef} style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: capWordSize, lineHeight: 0.82, letterSpacing: '-.055em', textTransform: 'uppercase', color: '#61220F', willChange: 'transform' }}>
            <span style={{ paddingRight: '.2em' }}>Capabilities</span>
            <span style={{ paddingRight: '.2em', color: 'transparent', WebkitTextStroke: '1.5px rgba(97,34,15,.4)' }}>Capabilities</span>
            <span style={{ paddingRight: '.2em' }}>Capabilities</span>
          </div>
        </div>
        <h2 id="capabilities" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', margin: -1 }}>Capabilities</h2>

        <div style={{ marginTop: capListGap, padding: '0 24px', display: 'grid', gridTemplateColumns: capCols, columnGap: 40, alignItems: 'start', borderBottom: '1px solid rgba(27,14,13,.2)' }}>
          {services.map((s) => (
            <article data-cap="" key={s.num} style={{ display: 'contents' }}>
              <span data-caprule="" aria-hidden="true" style={{ gridColumn: '1 / -1', height: 1, background: 'rgba(27,14,13,.2)', position: 'relative', overflow: 'hidden' }}>
                <span data-capfill="" aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#C72A09', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .9s cubic-bezier(.16,.84,.3,1)' }}></span>
              </span>

              <span data-capnum="" aria-hidden="true" style={{ gridColumn: 1, padding: capRowPad, fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: capNumSize, lineHeight: 0.74, letterSpacing: '-.05em', color: 'transparent', WebkitTextStroke: '1px rgba(0,50,66,.45)', willChange: 'transform' }}>{s.num}</span>

              <h3 data-captitle="" className="cap-title" style={{ gridColumn: 2, margin: 0, padding: capRowPad, maxWidth: capTitleMax, fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 600, fontSize: capTitleSize, lineHeight: 0.9, letterSpacing: '-.045em', textTransform: 'uppercase', color: '#1B0E0D', textWrap: 'balance' }}>{s.title}</h3>

              <p data-capcopy="" style={{ gridColumn: capCopyCol, margin: 0, padding: capCopyPad, maxWidth: '22rem', fontSize: 15, lineHeight: 1.6, color: '#4a3a33', textWrap: 'pretty', opacity: 0, transform: 'translateY(14px)', transition: 'opacity .7s cubic-bezier(.16,.84,.3,1) .1s,transform .8s cubic-bezier(.16,.84,.3,1) .1s' }}>{s.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="approach" ref={hSectionRef} style={{ position: 'relative', background: '#E3E2DE', color: '#003242', height: '300vh' }}>
        <div style={{ position: 'sticky', top: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0, padding: '80px 24px', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase' }}>
            <span style={{ color: '#C72A09' }}>How we work / 03</span>
            <span style={{ color: 'rgba(0,50,66,.55)' }}>Four movements · one loop</span>
          </div>

          <h2 style={{ margin: '28px 0 0', maxWidth: '26rem', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,2.8vw,2.5rem)', lineHeight: 1.04, letterSpacing: '-.03em', textTransform: 'uppercase' }}>A tighter loop.<br /><span style={{ color: '#C72A09' }}>A stronger return.</span></h2>

          <div style={{ position: 'relative', marginTop: 48 }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'rgba(0,50,66,.18)' }}></span>
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: 1, background: '#C72A09', height: hProgressWidth, transition: 'height .12s linear' }}></span>

            {steps.map((st) => (
              <article data-wrow="" key={st.num} style={{ position: 'relative', borderTop: '1px solid rgba(0,50,66,.18)', padding: rowPad, display: 'grid', gridTemplateColumns: rowCols, gap: '8px 32px', alignItems: 'start', transition: 'padding .6s cubic-bezier(.16,.84,.3,1)' }}>
                <span data-wtick="" aria-hidden="true" style={{ position: 'absolute', left: -4, top: -4, width: 9, height: 9, background: '#C72A09', borderRadius: '50%', transform: 'scale(0)', transition: 'transform .55s cubic-bezier(.16,.84,.3,1)' }}></span>
                <span data-wrule="" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: -1, height: 1, background: '#C72A09', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .8s cubic-bezier(.16,.84,.3,1)' }}></span>

                <div data-wmeta="" style={{ paddingLeft: 28, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(0,50,66,.45)', transition: 'color .5s,transform .6s cubic-bezier(.16,.84,.3,1)' }}>
                  <span style={{ display: 'block' }}>{st.num}</span>
                  <span style={{ display: 'block', marginTop: 8 }}>{st.phase}</span>
                </div>

                <h3 data-wtitle="" style={{ margin: 0, paddingLeft: titlePad, fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 600, fontSize: 'clamp(2.6rem,7.4vw,6.5rem)', lineHeight: 0.86, letterSpacing: '-.05em', textTransform: 'uppercase', color: 'transparent', WebkitTextStroke: '1px rgba(0,50,66,.4)', transition: 'color .6s,-webkit-text-stroke-color .6s,transform .7s cubic-bezier(.16,.84,.3,1)', willChange: 'transform' }}>{st.title}</h3>

                <div data-wbody="" style={{ gridColumn: bodyCol, paddingLeft: titlePad, overflow: 'hidden', maxHeight: 0, opacity: 0, transition: 'max-height .7s cubic-bezier(.16,.84,.3,1),opacity .5s,transform .7s cubic-bezier(.16,.84,.3,1)', transform: 'translateY(12px)' }}>
                  <p style={{ margin: '18px 0 0', maxWidth: '36rem', fontSize: 19, lineHeight: 1.55, color: 'rgba(0,50,66,.75)', textWrap: 'pretty' }}>{st.copy}</p>
                  <p style={{ margin: '16px 0 6px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#C72A09' }}>{st.tag}</p>
                </div>
              </article>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,50,66,.18)' }}></div>
          </div>

          <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: '12px 28px', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(0,50,66,.5)' }}>
            <span>Now reading — <span style={{ color: '#003242' }}>{active.num} {active.title}</span></span>
            <span>Then it starts again</span>
          </div>
        </div>
      </section>

      <section ref={outSectionRef} style={{ position: 'relative', overflow: 'hidden', padding: outPad }}>
        <p style={{ margin: `0 0 ${outLabelGap}`, padding: '0 24px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.28em', textTransform: 'uppercase', color: '#C72A09' }}>The output / 04</p>

        <div aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', display: 'grid', gap: outRowGap }}>
          <div style={{ overflow: 'hidden' }}>
            <div ref={outWordRef} style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: outWordSize, lineHeight: 0.82, letterSpacing: '-.055em', textTransform: 'uppercase', color: '#1B0E0D', willChange: 'transform' }}>
              <span style={{ paddingRight: '.22em' }}>Work made</span>
              <span style={{ paddingRight: '.22em', color: 'transparent', WebkitTextStroke: '1.5px rgba(199,42,9,.55)' }}>to perform</span>
              <span style={{ paddingRight: '.22em', color: '#C72A09' }}>Work made</span>
              <span style={{ paddingRight: '.22em', color: 'transparent', WebkitTextStroke: '1.5px rgba(199,42,9,.55)' }}>to perform</span>
            </div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div ref={outWord2Ref} style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: outWordSize2, lineHeight: 0.82, letterSpacing: '-.055em', textTransform: 'uppercase', color: '#003242', willChange: 'transform' }}>
              <span style={{ paddingRight: '.22em', color: 'transparent', WebkitTextStroke: '1px rgba(0,50,66,.5)' }}>to perform</span>
              <span style={{ paddingRight: '.22em', color: '#61220F' }}>Work made</span>
              <span style={{ paddingRight: '.22em', color: 'transparent', WebkitTextStroke: '1px rgba(0,50,66,.5)' }}>to perform</span>
              <span style={{ paddingRight: '.22em' }}>Work made</span>
            </div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div ref={outWord3Ref} style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: outWordSize3, lineHeight: 0.82, letterSpacing: '-.055em', textTransform: 'uppercase', color: '#C72A09', transformOrigin: 'left center', willChange: 'transform' }}>
              <span style={{ paddingRight: '.22em', color: 'transparent', WebkitTextStroke: '1.5px rgba(27,14,13,.3)' }}>Work made</span>
              <span style={{ paddingRight: '.22em' }}>To perform</span>
              <span style={{ paddingRight: '.22em', color: 'transparent', WebkitTextStroke: '1.5px rgba(27,14,13,.3)' }}>Work made</span>
              <span style={{ paddingRight: '.22em', color: '#1B0E0D' }}>To perform</span>
            </div>
          </div>
        </div>
      </section>

      <section id="studio" style={{ borderTop: '1px solid #D9D9D9', padding: '96px 24px 112px', display: 'grid', gridTemplateColumns: 'repeat(12,minmax(0,1fr))', gap: '40px 24px' }}>
        <div data-reveal="" style={{ gridColumn: '1 / -1' }}>
          <p style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase' }}>The studio / 05</p>
          <h2 style={{ margin: '18px 0 0', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 0.85, letterSpacing: '-.05em', textTransform: 'uppercase' }}>Small by design.<br />Ambitious by default.</h2>
        </div>
        <div data-reveal="" style={{ gridColumn: '1 / -1', display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', borderTop: '1px solid #1B0E0D', paddingTop: 28 }}>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#4a3a33', textWrap: 'pretty' }}>Founded in Ahmedabad in 2022, The Espresso Media brings strategy and making closer together. The people shaping the thinking stay close to the work.</p>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#4a3a33', textWrap: 'pretty' }}>We partner with growing businesses that value clarity, speed and honest measurement over layers of account management.</p>
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '24px 56px', fontFamily: "'JetBrains Mono',monospace" }}>
          {stats.map((f) => (
            <div key={f.label}>
              <strong style={{ fontFamily: "'Clash Grotesk',sans-serif", fontSize: 44, fontWeight: 700, letterSpacing: '-.04em', color: '#61220F' }}>{f.value}</strong>
              <p style={{ margin: '4px 0 0', fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#4a3a33' }}>{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={{ borderTop: '1px solid #1B0E0D', padding: '0 24px' }}>
        <div data-reveal="" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,minmax(0,1fr))', gap: '32px 24px', padding: '80px 0 64px' }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #1B0E0D', paddingBottom: 14, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase' }}>
            <span style={{ color: '#C72A09' }}>Next / 06</span>
            <span style={{ color: '#4a3a33' }}>Enquiries answered within 2 working days</span>
          </div>
          <div style={{ gridColumn: outputHeadSpan }}>
            <h2 style={{ margin: 0, fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(2.75rem,7vw,6.5rem)', lineHeight: 0.8, letterSpacing: '-.05em', textTransform: 'uppercase' }}>Got a number<br /><span style={{ marginLeft: '3rem', display: 'inline-block', color: '#C72A09' }}>to move?</span></h2>
            <div style={{ marginTop: 36, display: 'grid', gap: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', maxWidth: '30rem' }}>
              {enquiry.map((e) => (
                <div key={e.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderTop: '1px solid #D9D9D9', padding: '11px 0' }}>
                  <span style={{ color: '#4a3a33' }}>{e.k}</span>
                  <span>{e.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: contactAsideSpan, display: 'grid', gap: 22, alignContent: 'start', justifyItems: 'stretch', minWidth: 0 }}>
            <p style={{ margin: 0, maxWidth: 'min(24rem,100%)', fontSize: 17, lineHeight: 1.6, color: '#4a3a33', textWrap: 'pretty' }}>Bring us the challenge. We&rsquo;ll bring a clear point of view.</p>
            <a href="mailto:hello@theespressomedia.com" className="card" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: '100%', boxSizing: 'border-box', background: '#C72A09', color: '#E3E2DE', padding: '20px 24px', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.1em', overflowWrap: 'anywhere' }}>
              <span className="badge" style={{ position: 'absolute', top: -1, right: -1, background: '#1B0E0D', color: '#E3E2DE', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', padding: '5px 9px' }}>Write to us</span>
              <span style={{ minWidth: 0 }}>hello@theespressomedia.com</span><span>↗</span>
            </a>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#4a3a33', overflowWrap: 'anywhere' }}>23.0225° N / 72.5714° E — Ahmedabad</p>
          </div>
        </div>

        <div style={{ overflow: 'hidden', background: '#61220F', color: '#E3E2DE', margin: '0 -24px', borderTop: '1px solid #1B0E0D', borderBottom: '1px solid #1B0E0D' }}>
          <div style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(20px,2.6vw,34px)', textTransform: 'uppercase', letterSpacing: '-.02em', padding: '12px 0', animation: `ribbon-rev ${tickerDuration} linear infinite` }}>
            {tickerGroups.map((g) => (
              <div key={g} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ padding: '0 24px' }}>Available for new partners</span><span style={{ width: 12, height: 12, background: '#E3E2DE', display: 'inline-block', flex: '0 0 12px' }}></span><span style={{ padding: '0 24px', color: 'transparent', WebkitTextStroke: '1px #E3E2DE' }}>Let&rsquo;s make it move</span><span style={{ width: 12, height: 12, background: '#E3E2DE', display: 'inline-block', flex: '0 0 12px' }}></span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 1, padding: 0, background: '#D9D9D9', margin: '0 -24px', borderBottom: '1px solid #D9D9D9' }}>
          <div style={{ background: '#E3E2DE', padding: '40px 24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-.01em' }}>Studio<span style={{ color: '#C72A09' }}>.</span></h3>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 2, letterSpacing: '.08em', textTransform: 'uppercase', color: '#4a3a33' }}>Ahmedabad, India<br />Founded 2022<br />Season 04</p>
          </div>
          <div style={{ background: '#E3E2DE', padding: '40px 24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>Services<span style={{ color: '#C72A09' }}>.</span></h3>
            <div style={{ display: 'grid', gap: 9, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              <a href="#capabilities" className="lnk" style={{ justifySelf: 'start', color: '#4a3a33' }}>Branding &amp; design</a>
              <a href="#capabilities" className="lnk" style={{ justifySelf: 'start', color: '#4a3a33' }}>Digital marketing</a>
              <a href="#capabilities" className="lnk" style={{ justifySelf: 'start', color: '#4a3a33' }}>Social management</a>
              <a href="#capabilities" className="lnk" style={{ justifySelf: 'start', color: '#4a3a33' }}>Video production</a>
            </div>
          </div>
          <div style={{ background: '#E3E2DE', padding: '40px 24px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>Contact<span style={{ color: '#C72A09' }}>.</span></h3>
            <div style={{ display: 'grid', gap: 11, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              <a href="mailto:hello@theespressomedia.com" className="lnk" style={{ justifySelf: 'start' }}>hello@theespressomedia.com</a>
              <a href="#top" className="lnk" style={{ justifySelf: 'start', color: '#4a3a33' }}>Instagram ↗</a>
              <a href="#top" className="lnk" style={{ justifySelf: 'start', color: '#4a3a33' }}>LinkedIn ↗</a>
            </div>
          </div>
          <div style={{ background: '#1B0E0D', color: '#E3E2DE', padding: '40px 24px' }}>
            <h3 style={{ margin: '0 0 18px', fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>Newsletter</h3>
            <p style={{ margin: '0 0 20px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(227,226,222,.6)' }}>Field notes on performance creative</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(227,226,222,.4)', paddingBottom: 10 }}>
              <input type="email" placeholder="EMAIL" aria-label="Email address" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 'none', color: '#E3E2DE', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase' }} />
              <button type="button" style={{ border: 0, background: '#31EF07', color: '#1B0E0D', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', padding: '8px 14px', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 72, position: 'relative' }}>
          <p style={{ margin: 0, fontFamily: "'Clash Grotesk',sans-serif", fontWeight: 700, fontSize: '8vw', lineHeight: 1, paddingBottom: '.08em', letterSpacing: '-.055em', color: '#003242', textTransform: 'uppercase' }}>The Espresso Media<span style={{ color: '#C72A09' }}>.</span></p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', justifyContent: 'space-between', borderTop: '1px solid #1B0E0D', padding: '22px 0', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#4a3a33' }}>
          <span>The Espresso Media · Ahmedabad, India</span>
          <span>Season 04 — Performance creative</span>
          <a href="#top" className="lnk" style={{ color: '#1B0E0D' }}>Back to top ↑</a>
        </div>
      </section>
    </main>
  )
}
