import type { ProcessStepItem } from '../../data/content'
import './style.css'

type ProcessStepProps = {
  step: ProcessStepItem
}

function ProcessStep({ step }: ProcessStepProps) {
  return (
    <article className="process-step">
      <span className="process-step-number" aria-hidden="true">
        {step.number}
      </span>
      <h3 className="process-step-title">{step.title}</h3>
      <p className="process-step-description">{step.description}</p>
    </article>
  )
}

export default ProcessStep
