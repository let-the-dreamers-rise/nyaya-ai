# NYAYA-AI: Court Order to Government Action OS

NYAYA-AI is a frontend prototype that converts court-order PDFs into traceable, human-approved government action plans. It is built for legal coordination cells, departments, and senior administrators who need to move from "an order was uploaded" to "the right office has an approved plan, owner, deadline, and evidence trail."

The prototype is intentionally focused on one high-value government workflow: court order compliance. It does not try to replace lawyers, judges, or official court systems. It gives officials a controlled operating layer where AI extraction is useful, but human review remains mandatory before any action becomes operational.

## Submission Title

**NYAYA-AI: Court Order to Government Action OS**

## Short Description

NYAYA-AI turns court-order PDFs into source-linked directives, reviewer-approved action plans, and department-level compliance dashboards. The prototype shows how government teams can intake scanned or digital orders, extract obligations with page and paragraph references, verify decisions through a human reviewer, assign departments and owners, and track approved action plans before deadlines slip.

## Problem

Court orders often reach government departments as long PDFs, scanned documents, emails, annexures, and fragmented notes. The work after receiving an order is operationally messy:

- Officials must identify the exact directions, deadlines, parties, and responsible departments.
- Scanned PDFs and long judgments make manual review slow and error-prone.
- Departments need action plans, not only legal summaries.
- Senior officials need to know what is verified, what is pending review, and what is at risk.
- AI summaries are not enough in a legal/government setting unless every recommendation can be traced back to the source.

The result is a dangerous gap between legal obligation and administrative execution. NYAYA-AI closes that gap by converting orders into a verified action workflow.

## Solution

NYAYA-AI is an action operating system for court-order compliance. It models a complete workflow:

1. **Intake** court-order PDFs from digital or scanned sources.
2. **Extract** directives, parties, timelines, source excerpts, confidence scores, and department mappings.
3. **Verify** the extracted record through a human reviewer before it is trusted.
4. **Generate** an action plan with decision route, owner, required steps, risk signal, and due date.
5. **Track** only approved plans in an execution dashboard.
6. **Monitor** department workload, capacity pressure, and at-risk cases.

The key product rule is simple: **no extracted record reaches the action dashboard until a person approves it.**

## Who It Is For

- State legal coordination cells
- Department legal officers
- Principal Secretary and Commissioner offices
- District administration teams
- Public works, health, education, urban development, revenue, transport, and similar departments
- Hackathon reviewers evaluating AI for governance, legal operations, or public service delivery

## Prototype Scope

This repository contains a working React/Vite frontend prototype. It demonstrates the product experience and operating model using mock case data in `src/data/records.ts`.

Current prototype includes:

- Multi-section dashboard
- Product tour
- Order intake queue
- Mock PDF import interaction
- Source type tracking for scanned and digital PDFs
- OCR stage simulation
- Source-linked extraction view
- Confidence filtering
- Human verification desk
- Reviewer decision route
- Action plan approval and return flow
- Verified action plan dashboard
- Department ownership and capacity view
- Responsive layout for desktop and mobile

This is not yet connected to a production OCR engine, court database, authentication provider, or backend database. The current build is designed to communicate the workflow clearly and prove the interface concept.

## Why This Is Different

Most legal-tech tools focus on legal research, case search, contract review, drafting, or litigation management. NYAYA-AI is focused on what happens after a government department receives a binding order.

The differentiating factors are:

- **Government execution focus:** Built around departments, owners, deadlines, and compliance work.
- **Source-linked directives:** Every extracted obligation keeps page, paragraph, excerpt, and confidence context.
- **Human verification gate:** AI output remains draft until a reviewer approves the action plan.
- **Operational dashboard:** The action view shows only verified work, reducing noise for senior officials.
- **Department workload intelligence:** Capacity, pending load, and at-risk records are visible by department.
- **Decision route support:** Records can be marked for comply, consider appeal, or seek clarification.
- **Audit-friendly workflow:** Activity history and verification notes model traceability for public-sector use.

## Product Workflow

### 1. Overview

The Overview tab acts as the command center. It shows verified plans, cases due soon, average source confidence, critical priority records, and the pipeline from intake to verified action.

### 2. Intake

The Intake tab models how court-order PDFs enter the system. Users can import files, see whether they are scanned or digital PDFs, route them to departments, and move items through OCR and extraction stages.

### 3. Extraction

The Extraction tab shows extracted case entities, parties, directives, timelines, page references, paragraph references, confidence scores, and source excerpts. Reviewers can filter by confidence before sending a record to verification.

### 4. Verification

The Verification tab is the accountability layer. A human reviewer checks evidence, edits the action summary, chooses a decision route, approves the plan, or returns the record for better source trace.

### 5. Action Plans

The Action Plans tab only displays verified records. Users can filter by department, priority, and workflow status. They can mark plans as in progress, awaiting filing, or completed.

### 6. Departments

The Departments tab shows workload, capacity, verified count, pending count, at-risk records, average response days, action lead, and department-specific active records.

### 7. Product Guide

The Product Guide explains the operating model and reinforces the central trust rule: generated action plans are not operational until approved.

## Demo Data

The prototype includes realistic mock records for:

- Lake buffer restoration near Bellandur catchment
- Regularisation of contract health workers
- Construction debris along storm-water drain
- Promotion panel publication for revenue inspectors
- Scholarship disbursal for minority hostels
- Road widening compensation near Tumakuru bypass

Each record includes case number, forum, matter, department, region, dates, priority, source type, confidence, owner, action status, decision route, parties, directives, required steps, risk signal, verification notes, and activity history.

## Tech Stack

- React 19
- TypeScript
- Vite
- Lucide React icons
- CSS modules through a single app stylesheet
- Static mock data for prototype behavior

## Folder Structure

```text
.
|-- docs/
|   |-- SUBMISSION_GUIDE.md
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- styles.css
|   |-- components/
|   |   |-- StatusPill.tsx
|   |   |-- TourOverlay.tsx
|   |-- data/
|       |-- records.ts
|-- index.html
|-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- vite.config.ts
|-- README.md
```

## Data Model

The central data model is `CaseRecord` in `src/data/records.ts`.

Important fields:

- `caseNumber`: Court case identifier.
- `forum`: Court or tribunal name.
- `matter`: Short description of the dispute or order.
- `department`: Responsible department.
- `dueDate`: Compliance deadline.
- `priority`: Critical, High, or Standard.
- `status`: Verified, In verification, Needs review, or Returned.
- `sourceType`: Digital PDF or Scanned PDF.
- `confidence`: Overall extraction confidence.
- `decision`: Comply, Consider appeal, or Seek clarification.
- `directives`: Source-linked extracted obligations.
- `requiredSteps`: Operational steps for the department.
- `riskSignal`: Why leadership should pay attention.
- `verificationNotes`: Reviewer notes.
- `activity`: Timeline of workflow events.

## How To Run Locally

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the Vite URL printed in the terminal, usually:

```text
http://localhost:5173
```

### Build Production Bundle

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

Open the preview URL printed in the terminal.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Runs TypeScript checks and creates a production build in `dist/`.

```bash
npm run preview
```

Serves the production build locally for review.

## Suggested Demo Flow

Use this flow for judging:

1. Open the app and show the product tour.
2. Start on Overview and explain the trust rule: only verified plans reach the action dashboard.
3. Go to Intake and import a sample PDF file to show how incoming orders enter the queue.
4. Open Extraction and show source-linked directives with page, paragraph, excerpt, and confidence.
5. Use the confidence slider to show that weak evidence can be filtered.
6. Send a record to Verification.
7. In Verification, edit or confirm the action summary, select a decision route, and approve the action plan.
8. Open Action Plans and show that the approved record now appears in the execution dashboard.
9. Update workflow status to In progress, Awaiting filing, or Completed.
10. Open Departments and show capacity, owner, workload, and at-risk records.

## Submission Form Copy

### Title

NYAYA-AI: Court Order to Government Action OS

### Description

NYAYA-AI is a legal-governance prototype that turns court-order PDFs into verified government action plans. It helps departments move from unstructured orders to accountable execution by extracting directives, parties, timelines, source excerpts, page and paragraph references, confidence scores, department ownership, decision route, risk signals, and required compliance steps.

The prototype demonstrates a full workflow: intake scanned or digital PDFs, route them through OCR and extraction, review every directive with source evidence, approve or return the generated plan, and track only verified action plans by department, priority, deadline, and workflow status. It is designed for government legal coordination cells and department officers who need traceability, human accountability, and deadline visibility.

NYAYA-AI is different from generic legal research or chatbot tools because it is built around operational compliance. The product does not treat AI output as final. Every action plan must be approved by a reviewer before it reaches the dashboard used by officials.

### Source Code

Upload `nyaya-ai-source.zip` if present in the project root. If you need to regenerate it, zip the repository without `node_modules`, `dist`, `.git`, `.vercel`, and `.env.local`.

### Instructions To Run

```bash
npm install
npm run dev
```

Then open the local Vite URL, usually `http://localhost:5173`.

For a production check:

```bash
npm run build
npm run preview
```

### Custom Attachment

Recommended attachment: exported pitch deck PDF. Use the complete deck outline in `docs/SUBMISSION_GUIDE.md` to create the PPT/PDF.

### Which Shortlisted Idea

Use the shortlisted idea closest to:

**AI-powered legal document processing and government compliance tracking**

If the portal has different wording, choose the option closest to AI for governance, legal-tech, court-order processing, public administration, or compliance automation.

## Future Scope

Production development can add:

- OCR integration for scanned PDFs
- Secure document storage
- Role-based authentication
- Department-level access control
- Database-backed case records
- eCourts/NJDG or official court data integration where legally permitted
- Legal cell approval workflow
- Notification and deadline reminders
- Audit logs
- Exportable compliance affidavits
- Multilingual extraction and translation
- Analytics on department response time and recurring compliance bottlenecks

## Risks And Safeguards

NYAYA-AI handles high-stakes legal/government workflow, so a production system must include:

- Human approval before official action
- Source trace for every directive
- Confidence thresholds
- Audit logs
- Secure document access
- Data retention controls
- Role-based permissions
- No model training on confidential government documents unless explicitly approved
- Clear disclaimer that AI output is assistance, not legal advice

## Disclaimer

This repository is a prototype for demonstration and hackathon evaluation. It uses mock data and does not provide legal advice. A production deployment would require security review, legal review, government data permissions, OCR validation, accessibility testing, and integration with approved official systems.
