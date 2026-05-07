type StatusPillProps = {
  value: string
  tone?: 'green' | 'amber' | 'red' | 'blue' | 'muted'
}

export function StatusPill({ value, tone = 'muted' }: StatusPillProps) {
  return <span className={`status-pill ${tone}`}>{value}</span>
}
