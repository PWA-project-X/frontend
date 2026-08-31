import './style.css'

type ButtonNextProps = {
  sectionIds: string[]
}

function ButtonNext({ sectionIds }: ButtonNextProps) {
  const goNext = () => {
    const scrollY = window.scrollY + 8
    let currentIndex = 0

    for (let i = 0; i < sectionIds.length; i++) {
      const el = document.getElementById(sectionIds[i])
      if (!el) continue
      if (el.offsetTop <= scrollY) currentIndex = i
    }

    const nextId = sectionIds[Math.min(sectionIds.length - 1, currentIndex + 1)]
    document.getElementById(nextId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <button type="button" className="btn-nav btn-next" onClick={goNext}>
      Próxima
    </button>
  )
}

export default ButtonNext
