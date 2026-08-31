import './style.css'

type ButtonHomeProps = {
  targetId?: string
}

function ButtonHome({ targetId = 'home' }: ButtonHomeProps) {
  const goHome = () => {
    const el = document.getElementById(targetId)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <button type="button" className="btn-nav btn-home" onClick={goHome}>
      Home
    </button>
  )
}

export default ButtonHome
