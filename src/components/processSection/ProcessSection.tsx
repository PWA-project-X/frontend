import type { ProcessStepItem } from '../../data/content'
import ProcessStep from '../processStep/ProcessStep'
import './style.css'

type ProcessSectionProps = {
  steps: ProcessStepItem[]
}

function ProcessSection({ steps }: ProcessSectionProps) {
  return (
    <section
      id="processo"
      className="section section-processo"
      aria-labelledby="processo-title"
    >
      <h2 id="processo-title">Processo</h2>
      <p className="section-intro">
        Três etapas simples: entender, criar e compartilhar.
      </p>
      <div className="process-list">
        {steps.map((step) => (
          <ProcessStep key={step.id} step={step} />
        ))}
      </div>
    </section>
  )
}

export default ProcessSection
