import { ArrowLeft, ArrowRight, X } from 'lucide-react'

export type TourStep = {
  title: string
  tabLabel: string
  why: string
  canDo: string
  signal: string
}

type TourOverlayProps = {
  step: TourStep
  stepIndex: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onFinish: () => void
}

export function TourOverlay({
  step,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  onFinish,
}: TourOverlayProps) {
  const isFirst = stepIndex === 0
  const isLast = stepIndex === totalSteps - 1

  return (
    <div className="tour-scrim" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-card">
        <button className="icon-button tour-close" type="button" onClick={onFinish} aria-label="Close tour">
          <X size={18} />
        </button>
        <div className="tour-progress">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span
              className={index <= stepIndex ? 'tour-dot active' : 'tour-dot'}
              key={`tour-dot-${index}`}
            />
          ))}
        </div>
        <p className="tour-tab">{step.tabLabel}</p>
        <h2 id="tour-title">{step.title}</h2>
        <div className="tour-sections">
          <section>
            <span>Why it matters</span>
            <p>{step.why}</p>
          </section>
          <section>
            <span>What you can do</span>
            <p>{step.canDo}</p>
          </section>
          <section>
            <span>Key signal</span>
            <p>{step.signal}</p>
          </section>
        </div>
        <div className="tour-actions">
          <button className="secondary-button" type="button" onClick={onBack} disabled={isFirst}>
            <ArrowLeft size={16} />
            Back
          </button>
          {isLast ? (
            <button className="primary-button" type="button" onClick={onFinish}>
              Finish
            </button>
          ) : (
            <button className="primary-button" type="button" onClick={onNext}>
              Next
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
