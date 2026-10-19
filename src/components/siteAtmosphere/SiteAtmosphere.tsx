import { useEffect, useRef, type CSSProperties } from 'react'
import './style.css'

function SiteAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    root.style.setProperty('--spot-x', '50%')
    root.style.setProperty('--spot-y', '40%')

    let frame = 0
    let pendingX = 50
    let pendingY = 40
    let tracking = false

    function flush() {
      frame = 0
      root!.style.setProperty('--spot-x', `${pendingX}%`)
      root!.style.setProperty('--spot-y', `${pendingY}%`)
    }

    function onPointerMove(event: PointerEvent) {
      pendingX = (event.clientX / window.innerWidth) * 100
      pendingY = (event.clientY / window.innerHeight) * 100
      if (!frame) {
        frame = requestAnimationFrame(flush)
      }
    }

    function syncTracking() {
      const shouldTrack = finePointer.matches && !reduceMotion.matches
      if (shouldTrack === tracking) return
      tracking = shouldTrack
      if (tracking) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
      } else {
        window.removeEventListener('pointermove', onPointerMove)
        cancelAnimationFrame(frame)
        frame = 0
        root!.style.setProperty('--spot-x', '50%')
        root!.style.setProperty('--spot-y', '40%')
      }
    }

    syncTracking()
    finePointer.addEventListener('change', syncTracking)
    reduceMotion.addEventListener('change', syncTracking)

    return () => {
      finePointer.removeEventListener('change', syncTracking)
      reduceMotion.removeEventListener('change', syncTracking)
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="site-atmosphere"
      aria-hidden="true"
      style={{ '--spot-x': '50%', '--spot-y': '40%' } as CSSProperties}
    >
      <div className="site-atmosphere-aurora site-atmosphere-aurora-a" />
      <div className="site-atmosphere-aurora site-atmosphere-aurora-b" />
      <div className="site-atmosphere-aurora site-atmosphere-aurora-c" />
      <div className="site-atmosphere-grid" />
      <div className="site-atmosphere-spot" />
    </div>
  )
}

export default SiteAtmosphere
