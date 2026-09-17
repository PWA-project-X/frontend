import { useEffect, useRef } from 'react'

function isInView(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight
  return rect.top < vh * 0.85 && rect.bottom > vh * 0.1
}

export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion || isInView(el)) {
      el.classList.add('is-visible')
      if (reduceMotion) return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
