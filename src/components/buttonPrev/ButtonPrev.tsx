import './style.css'

type ButtonPrevProps = {
  sectionIds: string[]
}

function ButtonPrev({ sectionIds }: ButtonPrevProps) {
  const goPrev = () => {
    const scrollY = window.scrollY + 8
    let currentIndex = 0

    for (let i = 0; i < sectionIds.length; i++) {
      const el = document.getElementById(sectionIds[i])
      if (!el) continue
      if (el.offsetTop <= scrollY) currentIndex = i
    }

    const prevId = sectionIds[Math.max(0, currentIndex - 1)]
    document.getElementById(prevId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <button type="button" className="btn-nav btn-prev" onClick={goPrev}>
      Anterior
    </button>
  )
}

export default ButtonPrev
