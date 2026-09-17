import type { ProcessStepItem } from '../../data/content'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import ProcessStep from '../processStep/ProcessStep'
import './style.css'

type ProcessSectionProps = {
  steps: ProcessStepItem[]
}

function ProcessSection({ steps }: ProcessSectionProps) {
  const ref = useRevealOnScroll<HTMLElement>()

  return (
    <section
      ref={ref}
      id="processo"
      className="section section-processo section-with-grid section-reveal"
      aria-labelledby="processo-title"
    >
      <div className="section-inner">
        <p className="section-number">05</p>
        <h2 id="processo-title">Processo</h2>
        <p className="section-intro">
          Três etapas simples: entender, criar e compartilhar.
        </p>
        <div className="process-list">
          {steps.map((step) => (
            <ProcessStep key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
