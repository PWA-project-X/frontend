import { useEffect, useState } from 'react'
import './style.css'

function ButtonScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      className="btn-scroll-top"
      onClick={scrollTop}
      aria-label="Voltar ao topo"
    >
      ↑
    </button>
  )
}

export default ButtonScrollTop
