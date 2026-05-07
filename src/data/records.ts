export type Priority = 'Critical' | 'High' | 'Standard'
export type CaseStatus = 'Verified' | 'In verification' | 'Needs review' | 'Returned'
export type ActionStatus = 'Not started' | 'In progress' | 'Awaiting filing' | 'Completed'
export type SourceType = 'Digital PDF' | 'Scanned PDF'

export type Directive = {
  id: string
  text: string
  page: number
  paragraph: string
  sourceExcerpt: string
  confidence: number
  actionType: 'Administrative' | 'Legal' | 'Procedural' | 'Financial'
  timeline: string
}

export type CaseRecord = {
  id: string
  caseNumber: string
  forum: string
  matter: string
  department: string
  region: string
  orderDate: string
  uploadedAt: string
  dueDate: string
  priority: Priority
  status: CaseStatus
  sourceType: SourceType
  pages: number
  confidence: number
  owner: string
  actionStatus: ActionStatus
  decision: 'Comply' | 'Consider appeal' | 'Seek clarification'
  summary: string
  parties: string[]
  directives: Directive[]
  requiredSteps: string[]
  riskSignal: string
  verificationNotes: string
  activity: string[]
}

export type DepartmentSummary = {
  name: string
  lead: string
  verified: number
  pending: number
  atRisk: number
  avgDays: number
  focus: string
  capacity: number
}

export const caseRecords: CaseRecord[] = [
  {
    id: 'KA-HC-2026-0418',
    caseNumber: 'WP 1842/2026',
    forum: 'High Court of Karnataka',
    matter: 'Lake buffer restoration near Bellandur catchment',
    department: 'Urban Development Department',
    region: 'Bengaluru Urban',
    orderDate: '2026-04-18',
    uploadedAt: '2026-04-30 18:15',
    dueDate: '2026-05-12',
    priority: 'Critical',
    status: 'In verification',
    sourceType: 'Scanned PDF',
    pages: 38,
    confidence: 88,
    owner: 'Asha Menon',
    actionStatus: 'In progress',
    decision: 'Comply',
    summary:
      'Prepare a joint compliance note on buffer-zone clearance, publish ward-level inspection dates, and file status before the next listing.',
    parties: ['Residents Welfare Forum', 'State of Karnataka', 'BBMP'],
    directives: [
      {
        id: 'D-01',
        text: 'Submit a time-bound plan for clearing encroachments within the notified lake buffer.',
        page: 22,
        paragraph: 'Para 41',
        sourceExcerpt:
          'The competent authority shall place on record a time-bound programme for inspection, removal, and restoration within four weeks.',
        confidence: 91,
        actionType: 'Administrative',
        timeline: 'Four weeks from order date',
      },
      {
        id: 'D-02',
        text: 'Coordinate with pollution control officials for a joint inspection report.',
        page: 24,
        paragraph: 'Para 45',
        sourceExcerpt:
          'A joint inspection report with photographs and GPS references shall be filed before the Registry.',
        confidence: 86,
        actionType: 'Procedural',
        timeline: 'Before next hearing',
      },
    ],
    requiredSteps: [
      'Nominate BBMP lake-zone officer and legal cell coordinator.',
      'Issue inspection calendar for Mahadevapura and Bellandur wards.',
      'Prepare affidavit with photographs, GPS logs, and restoration milestones.',
    ],
    riskSignal: 'High public interest and short filing window.',
    verificationNotes: 'OCR confidence is lower on annexure pages; source links for Para 45 require review.',
    activity: ['OCR completed', 'Two directives extracted', 'Department mapping suggested'],
  },
  {
    id: 'SC-2026-0329',
    caseNumber: 'SLP(C) 9211/2025',
    forum: 'Supreme Court of India',
    matter: 'Regularisation of contract health workers',
    department: 'Health and Family Welfare',
    region: 'Statewide',
    orderDate: '2026-03-29',
    uploadedAt: '2026-04-29 11:40',
    dueDate: '2026-05-20',
    priority: 'High',
    status: 'Verified',
    sourceType: 'Digital PDF',
    pages: 56,
    confidence: 94,
    owner: 'Dr. Kavita Rao',
    actionStatus: 'Awaiting filing',
    decision: 'Comply',
    summary:
      'Create a district-wise eligibility register, publish a speaking order for excluded workers, and submit the compliance affidavit.',
    parties: ['Association of Contract Nurses', 'Union of India', 'State Health Mission'],
    directives: [
      {
        id: 'D-01',
        text: 'Prepare a verified eligibility list for contract workers engaged before April 2020.',
        page: 33,
        paragraph: 'Para 67',
        sourceExcerpt:
          'The State shall complete scrutiny of eligible workers engaged before April 2020 and communicate individual reasons for exclusion.',
        confidence: 96,
        actionType: 'Administrative',
        timeline: 'Six weeks',
      },
      {
        id: 'D-02',
        text: 'File an affidavit describing compliance and unresolved exclusions.',
        page: 35,
        paragraph: 'Para 71',
        sourceExcerpt:
          'A responsible officer shall file an affidavit indicating the status of compliance and pending representations.',
        confidence: 93,
        actionType: 'Legal',
        timeline: 'Next listing',
      },
    ],
    requiredSteps: [
      'Collect district HR rosters and attendance registers.',
      'Publish eligibility matrix with reasons for exclusion.',
      'Route draft affidavit through department legal cell.',
    ],
    riskSignal: 'Statewide implementation and service continuity impact.',
    verificationNotes: 'Approved by Principal Secretary office on 2026-05-02.',
    activity: ['Verified action plan', 'Owner assigned', 'Affidavit draft requested'],
  },
  {
    id: 'NGT-SZ-2026-0117',
    caseNumber: 'OA 117/2026',
    forum: 'National Green Tribunal, Southern Zone',
    matter: 'Construction debris along storm-water drain',
    department: 'Public Works Department',
    region: 'Mysuru',
    orderDate: '2026-04-21',
    uploadedAt: '2026-04-30 09:05',
    dueDate: '2026-05-06',
    priority: 'Critical',
    status: 'Needs review',
    sourceType: 'Scanned PDF',
    pages: 21,
    confidence: 81,
    owner: 'Nikhil Prasad',
    actionStatus: 'Not started',
    decision: 'Comply',
    summary:
      'Remove debris from the drain alignment, document disposal receipts, and submit a compliance status with photographs.',
    parties: ['Clean Mysuru Collective', 'Mysuru City Corporation', 'PWD'],
    directives: [
      {
        id: 'D-01',
        text: 'Clear construction debris from the identified drain segment.',
        page: 14,
        paragraph: 'Para 29',
        sourceExcerpt:
          'The public works authority shall ensure removal of construction debris from the marked stretch and prevent further dumping.',
        confidence: 84,
        actionType: 'Administrative',
        timeline: 'Two weeks',
      },
      {
        id: 'D-02',
        text: 'Submit disposal receipts and geo-tagged photographs.',
        page: 15,
        paragraph: 'Para 31',
        sourceExcerpt:
          'Compliance shall be supported by disposal receipts and geo-tagged photographs of the cleared stretch.',
        confidence: 78,
        actionType: 'Procedural',
        timeline: 'Two weeks',
      },
    ],
    requiredSteps: [
      'Assign field engineer for the drain segment.',
      'Book authorised debris disposal facility.',
      'Upload photographs and receipts for filing.',
    ],
    riskSignal: 'Due date is within 48 hours.',
    verificationNotes: 'Needs review because Para 31 scan has low contrast.',
    activity: ['Source OCR flagged', 'Urgency escalated', 'Review requested'],
  },
  {
    id: 'CAT-BLR-2026-0084',
    caseNumber: 'OA 84/2026',
    forum: 'Central Administrative Tribunal, Bengaluru',
    matter: 'Promotion panel publication for revenue inspectors',
    department: 'Revenue Department',
    region: 'Dharwad Division',
    orderDate: '2026-04-09',
    uploadedAt: '2026-04-26 16:25',
    dueDate: '2026-05-24',
    priority: 'Standard',
    status: 'Verified',
    sourceType: 'Digital PDF',
    pages: 27,
    confidence: 92,
    owner: 'M. S. Kulkarni',
    actionStatus: 'In progress',
    decision: 'Comply',
    summary:
      'Publish revised seniority list, invite objections for seven working days, and place final promotion panel before the department committee.',
    parties: ['K. Manjunath', 'State Revenue Department'],
    directives: [
      {
        id: 'D-01',
        text: 'Publish a revised seniority list and allow objections.',
        page: 18,
        paragraph: 'Para 36',
        sourceExcerpt:
          'The department shall publish the revised seniority list and provide seven working days for objections before finalisation.',
        confidence: 94,
        actionType: 'Administrative',
        timeline: 'Three weeks',
      },
    ],
    requiredSteps: [
      'Generate revised list from HRMS service records.',
      'Notify affected employees and district offices.',
      'Convene department promotion committee.',
    ],
    riskSignal: 'Moderate employee grievance exposure.',
    verificationNotes: 'Verified with HR branch on 2026-04-28.',
    activity: ['Entities confirmed', 'Timeline accepted', 'Action owner notified'],
  },
  {
    id: 'KA-HC-2026-0225',
    caseNumber: 'WP 2251/2026',
    forum: 'High Court of Karnataka',
    matter: 'Scholarship disbursal for minority hostels',
    department: 'Education Department',
    region: 'Kalaburagi',
    orderDate: '2026-04-12',
    uploadedAt: '2026-04-27 12:05',
    dueDate: '2026-05-17',
    priority: 'High',
    status: 'Returned',
    sourceType: 'Digital PDF',
    pages: 31,
    confidence: 89,
    owner: 'Farah Siddiqui',
    actionStatus: 'Not started',
    decision: 'Seek clarification',
    summary:
      'Reconcile beneficiary bank data, report failed transactions, and seek clarification on hostel-level arrears calculation.',
    parties: ['Parents Association', 'Department of Education'],
    directives: [
      {
        id: 'D-01',
        text: 'Reconcile unpaid scholarship claims with bank return files.',
        page: 19,
        paragraph: 'Para 38',
        sourceExcerpt:
          'The department shall reconcile unpaid claims with bank return files and place a beneficiary-wise statement before this Court.',
        confidence: 90,
        actionType: 'Financial',
        timeline: 'Five weeks',
      },
    ],
    requiredSteps: [
      'Pull treasury return files for the scholarship scheme.',
      'Reconcile hostel-wise beneficiary accounts.',
      'Prepare clarification note for arrears treatment.',
    ],
    riskSignal: 'Data mismatch across treasury and hostel records.',
    verificationNotes: 'Returned for clearer beneficiary scope before approval.',
    activity: ['Clarification requested', 'Finance branch added', 'Awaiting revised scope'],
  },
  {
    id: 'KA-HC-2026-0198',
    caseNumber: 'WA 198/2026',
    forum: 'High Court of Karnataka',
    matter: 'Road widening compensation near Tumakuru bypass',
    department: 'Transport Department',
    region: 'Tumakuru',
    orderDate: '2026-04-05',
    uploadedAt: '2026-04-25 10:30',
    dueDate: '2026-05-29',
    priority: 'High',
    status: 'Verified',
    sourceType: 'Digital PDF',
    pages: 44,
    confidence: 95,
    owner: 'Raghav Bhat',
    actionStatus: 'In progress',
    decision: 'Consider appeal',
    summary:
      'Prepare appeal memo on valuation method while simultaneously arranging deposit of the undisputed compensation amount.',
    parties: ['Land Owners Welfare Association', 'State Transport Authority'],
    directives: [
      {
        id: 'D-01',
        text: 'Deposit undisputed compensation amount with the registry.',
        page: 30,
        paragraph: 'Para 58',
        sourceExcerpt:
          'The undisputed amount shall be deposited with the Registry without prejudice to the contentions of the parties.',
        confidence: 96,
        actionType: 'Financial',
        timeline: 'Four weeks',
      },
      {
        id: 'D-02',
        text: 'Evaluate appellate remedy on valuation formula.',
        page: 31,
        paragraph: 'Para 60',
        sourceExcerpt:
          'It is open to the State to pursue available remedies on the question of valuation.',
        confidence: 94,
        actionType: 'Legal',
        timeline: 'Limitation period',
      },
    ],
    requiredSteps: [
      'Obtain finance concurrence for undisputed deposit.',
      'Prepare appeal opinion on valuation formula.',
      'Track limitation deadline with legal cell.',
    ],
    riskSignal: 'Financial exposure and limitation clock running.',
    verificationNotes: 'Verified with dual-track action: deposit plus appeal review.',
    activity: ['Decision split approved', 'Finance tagged', 'Limitation reminder added'],
  },
]

export const departmentSummaries: DepartmentSummary[] = [
  {
    name: 'Urban Development Department',
    lead: 'Asha Menon',
    verified: 18,
    pending: 6,
    atRisk: 3,
    avgDays: 12,
    focus: 'Environment-linked municipal orders',
    capacity: 72,
  },
  {
    name: 'Health and Family Welfare',
    lead: 'Dr. Kavita Rao',
    verified: 22,
    pending: 4,
    atRisk: 1,
    avgDays: 9,
    focus: 'Service matters and staffing compliance',
    capacity: 84,
  },
  {
    name: 'Public Works Department',
    lead: 'Nikhil Prasad',
    verified: 11,
    pending: 8,
    atRisk: 4,
    avgDays: 16,
    focus: 'Field evidence and works-site restoration',
    capacity: 58,
  },
  {
    name: 'Revenue Department',
    lead: 'M. S. Kulkarni',
    verified: 16,
    pending: 3,
    atRisk: 1,
    avgDays: 10,
    focus: 'Service records and land matters',
    capacity: 79,
  },
  {
    name: 'Education Department',
    lead: 'Farah Siddiqui',
    verified: 9,
    pending: 7,
    atRisk: 2,
    avgDays: 14,
    focus: 'Benefits reconciliation and institution data',
    capacity: 63,
  },
  {
    name: 'Transport Department',
    lead: 'Raghav Bhat',
    verified: 13,
    pending: 5,
    atRisk: 2,
    avgDays: 11,
    focus: 'Compensation, permits, and appeal decisions',
    capacity: 69,
  },
]
