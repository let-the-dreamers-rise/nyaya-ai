import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ReactElement } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  CircleCheck,
  CircleDashed,
  ClipboardList,
  Clock3,
  Eye,
  FileSearch,
  FileText,
  Filter,
  Home,
  Layers3,
  PanelRightOpen,
  Plus,
  RefreshCw,
  ScanLine,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  UserCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { StatusPill } from './components/StatusPill'
import { TourOverlay } from './components/TourOverlay'
import type { TourStep } from './components/TourOverlay'
import { caseRecords, departmentSummaries } from './data/records'
import type { ActionStatus, CaseRecord, CaseStatus, Priority, SourceType } from './data/records'

type TabId =
  | 'overview'
  | 'intake'
  | 'extraction'
  | 'verification'
  | 'actions'
  | 'departments'
  | 'guide'

type NavItem = {
  id: TabId
  label: string
  description: string
  Icon: LucideIcon
}

type IntakeItem = {
  name: string
  sourceType: SourceType
  pages: number
  stage: 'Queued' | 'OCR running' | 'Extracted'
  owner: string
}

const today = new Date('2026-05-07T00:00:00')

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', description: 'System control view', Icon: Home },
  { id: 'intake', label: 'Intake', description: 'Order PDF routing', Icon: UploadCloud },
  { id: 'extraction', label: 'Extraction', description: 'Source-linked directives', Icon: ScanLine },
  { id: 'verification', label: 'Verification', description: 'Human approval desk', Icon: UserCheck },
  { id: 'actions', label: 'Action Plans', description: 'Verified work only', Icon: ClipboardList },
  { id: 'departments', label: 'Departments', description: 'Ownership and load', Icon: Building2 },
  { id: 'guide', label: 'Product Guide', description: 'Operating model', Icon: BookOpen },
]

const tourSteps: Array<TourStep & { tab: TabId }> = [
  {
    tab: 'overview',
    tabLabel: 'Overview',
    title: 'Start with verified operational truth',
    why: 'Leaders need a fast view of urgent court-order work without reading every PDF or trusting unreviewed automation.',
    canDo:
      'Scan deadlines, confidence levels, department load, and the pipeline from intake to approved action plans.',
    signal:
      'Notice that the command view separates pending review from approved action so decisions are made from reliable records.',
  },
  {
    tab: 'intake',
    tabLabel: 'Intake',
    title: 'Bring order PDFs into a controlled queue',
    why: 'Court orders arrive as scanned and digital PDFs, and the first risk is losing context before extraction begins.',
    canDo:
      'Import files, route them by department, run OCR, and see which documents are ready for source-linked extraction.',
    signal:
      'Watch the source type, page count, and queue stage; scanned orders need more trace checks before review.',
  },
  {
    tab: 'extraction',
    tabLabel: 'Extraction',
    title: 'Trace every directive back to the source',
    why: 'Action plans are trusted only when each directive is tied to a page, paragraph, and source excerpt.',
    canDo:
      'Select a case, inspect extracted entities, filter confidence levels, and send the record to verification.',
    signal:
      'The key signal is source confidence beside every directive, not a free-floating summary.',
  },
  {
    tab: 'verification',
    tabLabel: 'Verification',
    title: 'Approve the decision, not just the summary',
    why: 'Departments need accountable decisions: comply, consider appeal, or seek clarification, with a named owner.',
    canDo:
      'Edit the action summary, choose the decision route, approve the plan, or return it when evidence is weak.',
    signal:
      'A plan becomes operational only after human approval; returned items stay out of the decision view.',
  },
  {
    tab: 'actions',
    tabLabel: 'Action Plans',
    title: 'Track only approved government work',
    why: 'Decision-makers need clean execution lists that exclude unverified extraction noise.',
    canDo:
      'Filter verified plans by department, priority, and status, then update workflow progress as filings move.',
    signal:
      'Notice the deadline and risk panel on each plan; it turns legal text into accountable administrative work.',
  },
  {
    tab: 'departments',
    tabLabel: 'Departments',
    title: 'Balance ownership across agencies',
    why: 'Compliance often depends on several departments moving together, with different capacity and risk levels.',
    canDo:
      'Review workload, at-risk counts, average response time, and department-specific queues.',
    signal:
      'Capacity pressure and at-risk counts identify where leadership intervention is needed before deadlines slip.',
  },
  {
    tab: 'guide',
    tabLabel: 'Product Guide',
    title: 'Use the product with a clear operating model',
    why: 'A government system needs consistent review rules, traceability expectations, and onboarding for new teams.',
    canDo:
      'Read the product guide, reopen this tour, and see how extraction, generation, verification, and dashboarding connect.',
    signal:
      'The core operating rule is simple: no record reaches the action dashboard until it is approved by a person.',
  },
]

const initialIntake: IntakeItem[] = [
  {
    name: 'bellandur-buffer-order.pdf',
    sourceType: 'Scanned PDF',
    pages: 38,
    stage: 'Extracted',
    owner: 'Urban Development Department',
  },
  {
    name: 'health-worker-regularisation.pdf',
    sourceType: 'Digital PDF',
    pages: 56,
    stage: 'Extracted',
    owner: 'Health and Family Welfare',
  },
  {
    name: 'storm-drain-debris-order.pdf',
    sourceType: 'Scanned PDF',
    pages: 21,
    stage: 'OCR running',
    owner: 'Public Works Department',
  },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [records, setRecords] = useState<CaseRecord[]>(caseRecords)
  const [selectedId, setSelectedId] = useState(caseRecords[0].id)
  const [tourOpen, setTourOpen] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [intakeItems, setIntakeItems] = useState<IntakeItem[]>(initialIntake)
  const [sourceFilter, setSourceFilter] = useState<'All' | SourceType>('All')
  const [confidenceFloor, setConfidenceFloor] = useState(80)
  const [reviewSummary, setReviewSummary] = useState(caseRecords[0].summary)
  const [reviewDecision, setReviewDecision] = useState<CaseRecord['decision']>(caseRecords[0].decision)
  const [planDepartment, setPlanDepartment] = useState('All departments')
  const [planPriority, setPlanPriority] = useState<'All priorities' | Priority>('All priorities')
  const [planStatus, setPlanStatus] = useState<'All statuses' | ActionStatus>('All statuses')
  const [selectedPlanId, setSelectedPlanId] = useState(caseRecords.find((item) => item.status === 'Verified')?.id ?? caseRecords[0].id)
  const [selectedDepartment, setSelectedDepartment] = useState(departmentSummaries[0].name)
  const [departmentNotice, setDepartmentNotice] = useState('')
  const [guideOpen, setGuideOpen] = useState('Operating rule')

  const activeRecord = records.find((record) => record.id === selectedId) ?? records[0]
  const selectedPlan = records.find((record) => record.id === selectedPlanId) ?? records[0]

  useEffect(() => {
    if (!window.localStorage.getItem('nyaya-ai-tour-complete')) {
      setTourOpen(true)
    }
  }, [])

  useEffect(() => {
    if (tourOpen) {
      setActiveTab(tourSteps[tourStep].tab)
    }
  }, [tourOpen, tourStep])

  useEffect(() => {
    setReviewSummary(activeRecord.summary)
    setReviewDecision(activeRecord.decision)
  }, [activeRecord])

  const metrics = useMemo(() => {
    const verified = records.filter((record) => record.status === 'Verified').length
    const dueSoon = records.filter((record) => getDaysLeft(record.dueDate) <= 7).length
    const avgConfidence = Math.round(
      records.reduce((total, record) => total + record.confidence, 0) / records.length,
    )
    const atRisk = records.filter((record) => record.priority === 'Critical').length
    return { verified, dueSoon, avgConfidence, atRisk }
  }, [records])

  const departments = useMemo(
    () => ['All departments', ...Array.from(new Set(records.map((record) => record.department)))],
    [records],
  )

  const filteredPlans = useMemo(
    () =>
      records.filter((record) => {
        if (record.status !== 'Verified') {
          return false
        }
        const departmentMatch = planDepartment === 'All departments' || record.department === planDepartment
        const priorityMatch = planPriority === 'All priorities' || record.priority === planPriority
        const statusMatch = planStatus === 'All statuses' || record.actionStatus === planStatus
        return departmentMatch && priorityMatch && statusMatch
      }),
    [planDepartment, planPriority, planStatus, records],
  )

  function finishTour() {
    window.localStorage.setItem('nyaya-ai-tour-complete', 'true')
    setTourOpen(false)
    setTourStep(0)
  }

  function reopenTour() {
    setTourStep(0)
    setTourOpen(true)
  }

  function handleFileImport(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) {
      return
    }

    const imported = files.map((file, index) => ({
      name: file.name,
      sourceType: file.name.toLowerCase().includes('scan') ? ('Scanned PDF' as SourceType) : ('Digital PDF' as SourceType),
      pages: 18 + index * 7,
      stage: 'Queued' as const,
      owner: 'Legal Coordination Cell',
    }))

    setIntakeItems((current) => [...imported, ...current])
    event.target.value = ''
  }

  function runOcr(index: number) {
    setIntakeItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              stage: item.stage === 'Queued' ? 'OCR running' : 'Extracted',
            }
          : item,
      ),
    )
  }

  function sendToVerification(recordId: string) {
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId
          ? { ...record, status: 'In verification', activity: ['Moved to verification', ...record.activity] }
          : record,
      ),
    )
    setSelectedId(recordId)
    setActiveTab('verification')
  }

  function approveRecord(recordId: string) {
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId
          ? {
              ...record,
              status: 'Verified',
              decision: reviewDecision,
              summary: reviewSummary,
              actionStatus: record.actionStatus === 'Not started' ? 'In progress' : record.actionStatus,
              verificationNotes: 'Approved by reviewer in this workspace session.',
              activity: ['Action plan approved', ...record.activity],
            }
          : record,
      ),
    )
    setSelectedPlanId(recordId)
    setActiveTab('actions')
  }

  function returnRecord(recordId: string) {
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId
          ? {
              ...record,
              status: 'Returned',
              verificationNotes: 'Returned for stronger source trace and department confirmation.',
              activity: ['Returned for revision', ...record.activity],
            }
          : record,
      ),
    )
  }

  function updateActionStatus(recordId: string, actionStatus: ActionStatus) {
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId
          ? { ...record, actionStatus, activity: [`Workflow set to ${actionStatus}`, ...record.activity] }
          : record,
      ),
    )
  }

  const content = {
    overview: (
      <OverviewView
        metrics={metrics}
        records={records}
        onSelect={(recordId, tab) => {
          setSelectedId(recordId)
          setActiveTab(tab)
        }}
        onOpenTour={reopenTour}
      />
    ),
    intake: (
      <IntakeView
        items={intakeItems}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
        onImport={handleFileImport}
        onRunOcr={runOcr}
        records={records}
        onSelectRecord={(recordId) => {
          setSelectedId(recordId)
          setActiveTab('extraction')
        }}
      />
    ),
    extraction: (
      <ExtractionView
        records={records}
        activeRecord={activeRecord}
        selectedId={selectedId}
        onSelectRecord={setSelectedId}
        confidenceFloor={confidenceFloor}
        onConfidenceFloorChange={setConfidenceFloor}
        onSendToVerification={sendToVerification}
      />
    ),
    verification: (
      <VerificationView
        records={records}
        activeRecord={activeRecord}
        selectedId={selectedId}
        reviewSummary={reviewSummary}
        reviewDecision={reviewDecision}
        onSelectRecord={setSelectedId}
        onSummaryChange={setReviewSummary}
        onDecisionChange={setReviewDecision}
        onApprove={approveRecord}
        onReturn={returnRecord}
      />
    ),
    actions: (
      <ActionPlansView
        records={records}
        filteredPlans={filteredPlans}
        selectedPlan={selectedPlan}
        selectedPlanId={selectedPlanId}
        departments={departments}
        planDepartment={planDepartment}
        planPriority={planPriority}
        planStatus={planStatus}
        onDepartmentChange={setPlanDepartment}
        onPriorityChange={setPlanPriority}
        onStatusChange={setPlanStatus}
        onSelectPlan={setSelectedPlanId}
        onUpdateStatus={updateActionStatus}
      />
    ),
    departments: (
      <DepartmentsView
        records={records}
        selectedDepartment={selectedDepartment}
        notice={departmentNotice}
        onSelectDepartment={setSelectedDepartment}
        onSendNotice={setDepartmentNotice}
      />
    ),
    guide: (
      <ProductGuideView
        openSection={guideOpen}
        onOpenSection={setGuideOpen}
        onOpenTour={reopenTour}
        onOpenVerification={() => setActiveTab('verification')}
      />
    ),
  } satisfies Record<TabId, ReactElement>

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-lockup">
          <div className="brand-mark">
            <ShieldCheck size={24} />
          </div>
          <div>
            <strong>NYAYA-AI</strong>
            <span>Action OS</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ id, label, description, Icon }) => (
            <button
              className={activeTab === id ? 'nav-item active' : 'nav-item'}
              type="button"
              key={id}
              aria-label={label}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={19} />
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="guide-button" type="button" onClick={reopenTour}>
            <Sparkles size={17} />
            Product tour
          </button>
          <div className="trust-chip">
            <CircleCheck size={16} />
            <span>Verified plans only reach the action view</span>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="section-kicker">Court orders to verified government action</p>
            <h1>{navItems.find((item) => item.id === activeTab)?.label}</h1>
          </div>
          <div className="topbar-actions">
            <button className="secondary-button" type="button" onClick={reopenTour}>
              <PanelRightOpen size={16} />
              Product tour
            </button>
            <div className="date-chip">
              <Clock3 size={16} />
              7 May 2026
            </div>
          </div>
        </header>

        {content[activeTab]}
      </main>

      {tourOpen ? (
        <TourOverlay
          step={tourSteps[tourStep]}
          stepIndex={tourStep}
          totalSteps={tourSteps.length}
          onBack={() => setTourStep((current) => Math.max(0, current - 1))}
          onNext={() => setTourStep((current) => Math.min(tourSteps.length - 1, current + 1))}
          onFinish={finishTour}
        />
      ) : null}
    </div>
  )
}

type OverviewViewProps = {
  metrics: {
    verified: number
    dueSoon: number
    avgConfidence: number
    atRisk: number
  }
  records: CaseRecord[]
  onSelect: (recordId: string, tab: TabId) => void
  onOpenTour: () => void
}

function OverviewView({ metrics, records, onSelect, onOpenTour }: OverviewViewProps) {
  const nextDeadlines = [...records].sort((a, b) => getDaysLeft(a.dueDate) - getDaysLeft(b.dueDate)).slice(0, 4)
  const pipeline = [
    { label: 'Intake', value: records.length, tone: 'blue' },
    { label: 'Extraction', value: records.filter((record) => record.status !== 'Verified').length, tone: 'amber' },
    { label: 'Verified', value: metrics.verified, tone: 'green' },
  ]

  return (
    <div className="view-grid overview-grid">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="system-label">NYAYA-AI action control</span>
          <h2>Convert legal orders into accountable department work.</h2>
          <p>
            The workspace tracks every source-linked directive, reviewer decision, owner, and deadline before an
            action plan reaches the operational dashboard.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onSelect(records[0].id, 'verification')}>
              Open verification queue
              <ArrowRight size={16} />
            </button>
            <button className="secondary-button" type="button" onClick={onOpenTour}>
              <BookOpen size={16} />
              Product guide
            </button>
          </div>
        </div>
        <div className="ledger-visual" aria-hidden="true">
          <div className="ledger-page main">
            <span />
            <span />
            <span className="highlight" />
            <span />
          </div>
          <div className="ledger-page action">
            <CheckCircle2 size={28} />
            <strong>Verified action plan</strong>
            <small>Owner, timeline, source trace</small>
          </div>
        </div>
      </section>

      <section className="metric-strip" aria-label="Key metrics">
        <MetricCard icon={BadgeCheck} label="Verified plans" value={metrics.verified.toString()} detail="Ready for execution" />
        <MetricCard icon={Clock3} label="Due in 7 days" value={metrics.dueSoon.toString()} detail="Needs close follow-up" />
        <MetricCard icon={FileSearch} label="Source confidence" value={`${metrics.avgConfidence}%`} detail="Across active records" />
        <MetricCard icon={AlertTriangle} label="Critical priority" value={metrics.atRisk.toString()} detail="Leadership attention" />
      </section>

      <section className="panel pipeline-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Pipeline</span>
            <h3>From PDF to approved work</h3>
          </div>
          <StatusPill value="Human approval required" tone="blue" />
        </div>
        <div className="pipeline">
          {pipeline.map((item) => (
            <div className={`pipeline-step ${item.tone}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <div className="pipeline-bar">
                <span style={{ width: `${Math.min(100, item.value * 16)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel deadline-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Deadline watch</span>
            <h3>Next decisions to protect</h3>
          </div>
          <button className="text-button" type="button" onClick={() => onSelect(nextDeadlines[0].id, 'actions')}>
            Open plans
          </button>
        </div>
        <div className="deadline-list">
          {nextDeadlines.map((record) => (
            <button
              className="deadline-row"
              type="button"
              key={record.id}
              onClick={() => onSelect(record.id, record.status === 'Verified' ? 'actions' : 'verification')}
            >
              <span>
                <strong>{record.matter}</strong>
                <small>{record.department}</small>
              </span>
              <StatusPill value={`${getDaysLeft(record.dueDate)} days`} tone={getDaysLeft(record.dueDate) <= 3 ? 'red' : 'amber'} />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

type IntakeViewProps = {
  items: IntakeItem[]
  sourceFilter: 'All' | SourceType
  records: CaseRecord[]
  onSourceFilterChange: (value: 'All' | SourceType) => void
  onImport: (event: ChangeEvent<HTMLInputElement>) => void
  onRunOcr: (index: number) => void
  onSelectRecord: (recordId: string) => void
}

function IntakeView({
  items,
  sourceFilter,
  records,
  onSourceFilterChange,
  onImport,
  onRunOcr,
  onSelectRecord,
}: IntakeViewProps) {
  const visibleItems = items.filter((item) => sourceFilter === 'All' || item.sourceType === sourceFilter)

  return (
    <div className="view-grid intake-grid">
      <section className="panel upload-panel">
        <div className="upload-zone">
          <UploadCloud size={34} />
          <h2>Import court order PDFs</h2>
          <p>Accept scanned and digital files, then route each document into source extraction with department context.</p>
          <label className="primary-button file-picker">
            <Plus size={16} />
            Add PDF files
            <input type="file" accept="application/pdf" multiple onChange={onImport} />
          </label>
        </div>
      </section>

      <section className="panel queue-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Intake queue</span>
            <h3>OCR and routing status</h3>
          </div>
          <select value={sourceFilter} onChange={(event) => onSourceFilterChange(event.target.value as 'All' | SourceType)}>
            <option>All</option>
            <option>Digital PDF</option>
            <option>Scanned PDF</option>
          </select>
        </div>
        <div className="queue-list">
          {visibleItems.map((item, index) => (
            <div className="queue-row" key={`${item.name}-${index}`}>
              <div className="file-icon">
                <FileText size={20} />
              </div>
              <span>
                <strong>{item.name}</strong>
                <small>
                  {item.owner} | {item.pages} pages | {item.sourceType}
                </small>
              </span>
              <StatusPill value={item.stage} tone={item.stage === 'Extracted' ? 'green' : item.stage === 'OCR running' ? 'amber' : 'muted'} />
              <button className="icon-button" type="button" onClick={() => onRunOcr(index)} aria-label={`Advance ${item.name}`}>
                <RefreshCw size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel routing-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Ready records</span>
            <h3>Select a file for extraction</h3>
          </div>
          <Search size={18} />
        </div>
        <div className="routing-list">
          {records.map((record) => (
            <button className="routing-card" type="button" key={record.id} onClick={() => onSelectRecord(record.id)}>
              <span>
                <strong>{record.caseNumber}</strong>
                <small>{record.matter}</small>
              </span>
              <StatusPill value={record.status} tone={statusTone(record.status)} />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

type ExtractionViewProps = {
  records: CaseRecord[]
  activeRecord: CaseRecord
  selectedId: string
  confidenceFloor: number
  onSelectRecord: (recordId: string) => void
  onConfidenceFloorChange: (value: number) => void
  onSendToVerification: (recordId: string) => void
}

function ExtractionView({
  records,
  activeRecord,
  selectedId,
  confidenceFloor,
  onSelectRecord,
  onConfidenceFloorChange,
  onSendToVerification,
}: ExtractionViewProps) {
  const visibleDirectives = activeRecord.directives.filter((directive) => directive.confidence >= confidenceFloor)

  return (
    <div className="view-grid extraction-grid">
      <section className="panel control-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Extraction engine</span>
            <h3>Case context</h3>
          </div>
          <StatusPill value={`${activeRecord.confidence}% source confidence`} tone={activeRecord.confidence >= 90 ? 'green' : 'amber'} />
        </div>
        <label className="field-label" htmlFor="case-select">
          Active record
        </label>
        <select id="case-select" value={selectedId} onChange={(event) => onSelectRecord(event.target.value)}>
          {records.map((record) => (
            <option value={record.id} key={record.id}>
              {record.caseNumber} - {record.department}
            </option>
          ))}
        </select>
        <div className="entity-grid">
          <Entity label="Forum" value={activeRecord.forum} />
          <Entity label="Order date" value={formatDate(activeRecord.orderDate)} />
          <Entity label="Department" value={activeRecord.department} />
          <Entity label="Responsible officer" value={activeRecord.owner} />
        </div>
        <div className="slider-row">
          <label htmlFor="confidence">Minimum directive confidence</label>
          <strong>{confidenceFloor}%</strong>
          <input
            id="confidence"
            type="range"
            min="70"
            max="98"
            value={confidenceFloor}
            onChange={(event) => onConfidenceFloorChange(Number(event.target.value))}
          />
        </div>
      </section>

      <section className="panel document-panel">
        <div className="document-toolbar">
          <span>{activeRecord.sourceType}</span>
          <span>{activeRecord.pages} pages</span>
          <span>{activeRecord.caseNumber}</span>
        </div>
        <div className="document-canvas">
          <div className="page-rail">
            {activeRecord.directives.map((directive) => (
              <button type="button" key={directive.id}>
                p.{directive.page}
              </button>
            ))}
          </div>
          <div className="pdf-page">
            <h3>{activeRecord.matter}</h3>
            <p>{activeRecord.parties.join(' vs ')}</p>
            {activeRecord.directives.map((directive) => (
              <mark key={directive.id}>
                <span>{directive.paragraph}</span>
                {directive.sourceExcerpt}
              </mark>
            ))}
          </div>
        </div>
      </section>

      <section className="panel directive-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Extracted directives</span>
            <h3>Source-linked requirements</h3>
          </div>
          <button className="primary-button" type="button" onClick={() => onSendToVerification(activeRecord.id)}>
            Send to verification
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="directive-list">
          {visibleDirectives.length > 0 ? (
            visibleDirectives.map((directive) => (
              <article className="directive-card" key={directive.id}>
                <div>
                  <StatusPill value={directive.actionType} tone="blue" />
                  <StatusPill value={directive.timeline} tone="amber" />
                </div>
                <h4>{directive.text}</h4>
                <p>
                  Page {directive.page}, {directive.paragraph}: {directive.sourceExcerpt}
                </p>
                <div className="confidence-bar">
                  <span style={{ width: `${directive.confidence}%` }} />
                </div>
                <small>{directive.confidence}% confidence</small>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <Filter size={22} />
              <p>No directives meet this confidence threshold. Lower the filter to inspect weaker source matches.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

type VerificationViewProps = {
  records: CaseRecord[]
  activeRecord: CaseRecord
  selectedId: string
  reviewSummary: string
  reviewDecision: CaseRecord['decision']
  onSelectRecord: (recordId: string) => void
  onSummaryChange: (value: string) => void
  onDecisionChange: (value: CaseRecord['decision']) => void
  onApprove: (recordId: string) => void
  onReturn: (recordId: string) => void
}

function VerificationView({
  records,
  activeRecord,
  selectedId,
  reviewSummary,
  reviewDecision,
  onSelectRecord,
  onSummaryChange,
  onDecisionChange,
  onApprove,
  onReturn,
}: VerificationViewProps) {
  return (
    <div className="view-grid verification-grid">
      <section className="panel review-list-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Review queue</span>
            <h3>Records needing human decision</h3>
          </div>
          <StatusPill value={`${records.filter((record) => record.status !== 'Verified').length} open`} tone="amber" />
        </div>
        <div className="review-list">
          {records.map((record) => (
            <button
              className={selectedId === record.id ? 'review-row active' : 'review-row'}
              type="button"
              key={record.id}
              onClick={() => onSelectRecord(record.id)}
            >
              <span>
                <strong>{record.caseNumber}</strong>
                <small>{record.department}</small>
              </span>
              <StatusPill value={record.status} tone={statusTone(record.status)} />
            </button>
          ))}
        </div>
      </section>

      <section className="panel evidence-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Evidence trace</span>
            <h3>{activeRecord.matter}</h3>
          </div>
          <Eye size={18} />
        </div>
        <div className="evidence-stack">
          {activeRecord.directives.map((directive) => (
            <article key={directive.id}>
              <span>
                Page {directive.page} | {directive.paragraph}
              </span>
              <p>{directive.sourceExcerpt}</p>
            </article>
          ))}
        </div>
        <div className="risk-box">
          <AlertTriangle size={18} />
          <p>{activeRecord.riskSignal}</p>
        </div>
      </section>

      <section className="panel decision-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Action plan editor</span>
            <h3>Reviewer decision</h3>
          </div>
          <StatusPill value={activeRecord.decision} tone="blue" />
        </div>
        <label className="field-label" htmlFor="decision">
          Decision route
        </label>
        <select
          id="decision"
          value={reviewDecision}
          onChange={(event) => onDecisionChange(event.target.value as CaseRecord['decision'])}
        >
          <option>Comply</option>
          <option>Consider appeal</option>
          <option>Seek clarification</option>
        </select>
        <label className="field-label" htmlFor="summary">
          Action summary
        </label>
        <textarea
          id="summary"
          value={reviewSummary}
          onChange={(event) => onSummaryChange(event.target.value)}
          rows={5}
        />
        <div className="step-list">
          {activeRecord.requiredSteps.map((step) => (
            <div className="step-row" key={step}>
              <CircleDashed size={16} />
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="decision-actions">
          <button className="secondary-button danger" type="button" onClick={() => onReturn(activeRecord.id)}>
            Return for revision
          </button>
          <button className="primary-button" type="button" onClick={() => onApprove(activeRecord.id)}>
            Approve action plan
            <CheckCircle2 size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

type ActionPlansViewProps = {
  records: CaseRecord[]
  filteredPlans: CaseRecord[]
  selectedPlan: CaseRecord
  selectedPlanId: string
  departments: string[]
  planDepartment: string
  planPriority: 'All priorities' | Priority
  planStatus: 'All statuses' | ActionStatus
  onDepartmentChange: (value: string) => void
  onPriorityChange: (value: 'All priorities' | Priority) => void
  onStatusChange: (value: 'All statuses' | ActionStatus) => void
  onSelectPlan: (recordId: string) => void
  onUpdateStatus: (recordId: string, status: ActionStatus) => void
}

function ActionPlansView({
  records,
  filteredPlans,
  selectedPlan,
  selectedPlanId,
  departments,
  planDepartment,
  planPriority,
  planStatus,
  onDepartmentChange,
  onPriorityChange,
  onStatusChange,
  onSelectPlan,
  onUpdateStatus,
}: ActionPlansViewProps) {
  const verifiedCount = records.filter((record) => record.status === 'Verified').length

  return (
    <div className="view-grid action-grid">
      <section className="panel filters-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Verified action plans</span>
            <h3>{verifiedCount} approved records</h3>
          </div>
          <SlidersHorizontal size={18} />
        </div>
        <div className="filter-grid">
          <label>
            Department
            <select value={planDepartment} onChange={(event) => onDepartmentChange(event.target.value)}>
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select value={planPriority} onChange={(event) => onPriorityChange(event.target.value as 'All priorities' | Priority)}>
              <option>All priorities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Standard</option>
            </select>
          </label>
          <label>
            Workflow status
            <select value={planStatus} onChange={(event) => onStatusChange(event.target.value as 'All statuses' | ActionStatus)}>
              <option>All statuses</option>
              <option>Not started</option>
              <option>In progress</option>
              <option>Awaiting filing</option>
              <option>Completed</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel plan-list-panel">
        <div className="plan-list">
          {filteredPlans.map((plan) => (
            <button
              className={selectedPlanId === plan.id ? 'plan-row active' : 'plan-row'}
              type="button"
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
            >
              <span>
                <strong>{plan.matter}</strong>
                <small>{plan.department}</small>
              </span>
              <span className="plan-meta">
                <StatusPill value={plan.priority} tone={priorityTone(plan.priority)} />
                <small>{getDaysLeft(plan.dueDate)} days left</small>
              </span>
            </button>
          ))}
          {filteredPlans.length === 0 ? (
            <div className="empty-state">
              <CircleCheck size={22} />
              <p>No approved plans match the current filters.</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel plan-detail-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">{selectedPlan.caseNumber}</span>
            <h3>{selectedPlan.matter}</h3>
          </div>
          <StatusPill value={selectedPlan.actionStatus} tone={selectedPlan.actionStatus === 'Completed' ? 'green' : 'amber'} />
        </div>
        <p className="detail-summary">{selectedPlan.summary}</p>
        <div className="detail-grid">
          <Entity label="Department" value={selectedPlan.department} />
          <Entity label="Owner" value={selectedPlan.owner} />
          <Entity label="Decision" value={selectedPlan.decision} />
          <Entity label="Due date" value={formatDate(selectedPlan.dueDate)} />
        </div>
        <div className="step-list">
          {selectedPlan.requiredSteps.map((step) => (
            <div className="step-row checked" key={step}>
              <CircleCheck size={16} />
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="workflow-actions">
          <button className="secondary-button" type="button" onClick={() => onUpdateStatus(selectedPlan.id, 'In progress')}>
            Mark in progress
          </button>
          <button className="secondary-button" type="button" onClick={() => onUpdateStatus(selectedPlan.id, 'Awaiting filing')}>
            Awaiting filing
          </button>
          <button className="primary-button" type="button" onClick={() => onUpdateStatus(selectedPlan.id, 'Completed')}>
            Complete
          </button>
        </div>
      </section>
    </div>
  )
}

type DepartmentsViewProps = {
  records: CaseRecord[]
  selectedDepartment: string
  notice: string
  onSelectDepartment: (department: string) => void
  onSendNotice: (message: string) => void
}

function DepartmentsView({
  records,
  selectedDepartment,
  notice,
  onSelectDepartment,
  onSendNotice,
}: DepartmentsViewProps) {
  const selected = departmentSummaries.find((department) => department.name === selectedDepartment) ?? departmentSummaries[0]
  const departmentRecords = records.filter((record) => record.department === selected.name)

  return (
    <div className="view-grid departments-grid">
      <section className="panel department-list-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Department workload</span>
            <h3>Capacity and risk</h3>
          </div>
          <Building2 size={18} />
        </div>
        <div className="department-list">
          {departmentSummaries.map((department) => (
            <button
              className={selectedDepartment === department.name ? 'department-row active' : 'department-row'}
              type="button"
              key={department.name}
              onClick={() => onSelectDepartment(department.name)}
            >
              <span>
                <strong>{department.name}</strong>
                <small>{department.focus}</small>
              </span>
              <div className="capacity-meter">
                <span style={{ width: `${department.capacity}%` }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel department-detail-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Selected department</span>
            <h3>{selected.name}</h3>
          </div>
          <StatusPill value={`${selected.capacity}% capacity`} tone={selected.capacity > 75 ? 'green' : selected.capacity > 62 ? 'amber' : 'red'} />
        </div>
        <div className="department-metrics">
          <MetricCard icon={BadgeCheck} label="Verified" value={selected.verified.toString()} detail="This quarter" />
          <MetricCard icon={CircleDashed} label="Pending" value={selected.pending.toString()} detail="Needs review" />
          <MetricCard icon={AlertTriangle} label="At risk" value={selected.atRisk.toString()} detail="Deadline pressure" />
          <MetricCard icon={Clock3} label="Avg days" value={selected.avgDays.toString()} detail="Order to action" />
        </div>
        <div className="owner-card">
          <UserCheck size={20} />
          <span>
            <strong>{selected.lead}</strong>
            <small>Department action lead</small>
          </span>
          <button
            className="secondary-button"
            type="button"
            onClick={() => onSendNotice(`Capacity note sent to ${selected.lead} for ${selected.name}.`)}
          >
            Send capacity note
          </button>
        </div>
        {notice ? <div className="inline-success">{notice}</div> : null}
      </section>

      <section className="panel department-cases-panel">
        <div className="panel-heading">
          <div>
            <span className="system-label">Department queue</span>
            <h3>Active records</h3>
          </div>
          <StatusPill value={`${departmentRecords.length} records`} tone="blue" />
        </div>
        <div className="compact-table">
          {departmentRecords.map((record) => (
            <div className="compact-row" key={record.id}>
              <span>
                <strong>{record.caseNumber}</strong>
                <small>{record.matter}</small>
              </span>
              <StatusPill value={record.status} tone={statusTone(record.status)} />
              <small>{formatDate(record.dueDate)}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

type ProductGuideViewProps = {
  openSection: string
  onOpenSection: (section: string) => void
  onOpenTour: () => void
  onOpenVerification: () => void
}

function ProductGuideView({
  openSection,
  onOpenSection,
  onOpenTour,
  onOpenVerification,
}: ProductGuideViewProps) {
  const sections = [
    {
      title: 'Operating rule',
      body: 'Every directive must keep its page and paragraph source trace. Generated action plans remain draft work until a reviewer approves the decision route, owner, and timeline.',
    },
    {
      title: 'Review standard',
      body: 'Reviewers compare source excerpts, confidence scores, department mapping, and deadlines before approving. Weak source trace should be returned for revision.',
    },
    {
      title: 'Action dashboard',
      body: 'The action plan view includes only approved records. This keeps senior officials focused on work that is ready for execution and filing.',
    },
    {
      title: 'Data handling',
      body: 'The prototype models role-aware review, source references, audit activity, and department ownership so implementation can connect to CCMS, OCR, and a secure database later.',
    },
  ]

  return (
    <div className="view-grid guide-grid">
      <section className="panel guide-hero">
        <div>
          <span className="system-label">Product guide</span>
          <h2>How NYAYA-AI moves from court order PDFs to verified action plans</h2>
          <p>
            The product is designed for legal coordination cells, department officers, and senior administrators who need
            traceable, human-approved compliance work.
          </p>
        </div>
        <div className="guide-actions">
          <button className="primary-button" type="button" onClick={onOpenTour}>
            Reopen product tour
            <Sparkles size={16} />
          </button>
          <button className="secondary-button" type="button" onClick={onOpenVerification}>
            Open verification desk
          </button>
        </div>
      </section>

      <section className="panel guide-flow">
        <div className="flow-step">
          <FileText size={22} />
          <strong>Extract</strong>
          <span>Source-linked case details, parties, dates, directives, and timelines.</span>
        </div>
        <div className="flow-step">
          <Layers3 size={22} />
          <strong>Generate</strong>
          <span>Structured action plans with decision route, owner, action type, and risk signal.</span>
        </div>
        <div className="flow-step">
          <UserCheck size={22} />
          <strong>Verify</strong>
          <span>Human approval before any record becomes operational.</span>
        </div>
        <div className="flow-step">
          <BarChart3 size={22} />
          <strong>Track</strong>
          <span>Verified plans, department workload, deadlines, and execution status.</span>
        </div>
      </section>

      <section className="panel guide-accordion">
        {sections.map((section) => (
          <article className={openSection === section.title ? 'guide-section open' : 'guide-section'} key={section.title}>
            <button type="button" onClick={() => onOpenSection(section.title)}>
              <strong>{section.title}</strong>
              <ArrowRight size={16} />
            </button>
            {openSection === section.title ? <p>{section.body}</p> : null}
          </article>
        ))}
      </section>
    </div>
  )
}

type MetricIcon = {
  icon: LucideIcon
  label: string
  value: string
  detail: string
}

function MetricCard({ icon: Icon, label, value, detail }: MetricIcon) {
  return (
    <article className="metric-card">
      <Icon size={19} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

function Entity({ label, value }: { label: string; value: string }) {
  return (
    <div className="entity">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function getDaysLeft(date: string) {
  const due = new Date(`${date}T00:00:00`)
  return Math.ceil((due.getTime() - today.getTime()) / 86_400_000)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function statusTone(status: CaseStatus): 'green' | 'amber' | 'red' | 'blue' | 'muted' {
  if (status === 'Verified') {
    return 'green'
  }
  if (status === 'Returned') {
    return 'red'
  }
  if (status === 'In verification') {
    return 'blue'
  }
  return 'amber'
}

function priorityTone(priority: Priority): 'green' | 'amber' | 'red' | 'blue' | 'muted' {
  if (priority === 'Critical') {
    return 'red'
  }
  if (priority === 'High') {
    return 'amber'
  }
  return 'muted'
}

export default App
