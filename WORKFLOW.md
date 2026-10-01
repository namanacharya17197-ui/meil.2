# 🔄 MEIL ESG Connect — Operational Workflows & Lifecycle Architecture

> **Document Version:** 2.4.0  
> **Target Framework:** SEBI BRSR Core (Regulation 34 LODR) · ISAE 3000 Reasonable Assurance Standard  
> **Classification:** Enterprise Operational Architecture

---

## 📑 Table of Contents
1. [Overview & Governance Hierarchy](#1-overview--governance-hierarchy)
2. [Role Matrix & Access Control (RBAC)](#2-role-matrix--access-control-rbac)
3. [End-to-End ESG Reporting Lifecycle](#3-end-to-end-esg-reporting-lifecycle)
4. [Data Ingestion & Physical Evidence Provenance](#4-data-ingestion--physical-evidence-provenance)
5. [Real-Time Carbon Accounting & Emission Computation](#5-real-time-carbon-accounting--emission-computation)
6. [Automated Anomaly Radar & AI Diagnostic Loop](#6-automated-anomaly-radar--ai-diagnostic-loop)
7. [Four-Eyes Review & Approval Workflow](#7-four-eyes-review--approval-workflow)
8. [Statutory SEBI BRSR Generation & Audit Vault](#8-statutory-sebi-brsr-generation--audit-vault)

---

## 1. Overview & Governance Hierarchy

MEIL ESG Connect models the conglomerate's complex multi-tier organizational structure across four distinct tiers:

```mermaid
graph TD
    Apex[🏢 Level 0: Megha Engineering & Infrastructures Ltd Holding Group] --> D1[⚡ Division 1: Energy & Hydrocarbons]
    Apex --> D2[🌊 Division 2: Hydro & Irrigation Infrastructure]
    Apex --> D3[🚇 Division 3: Transport & Tunneling]
    Apex --> D4[🏭 Division 4: Manufacturing & Industrial Works]

    D1 --> S1[Megha Gas / City Gas Distribution]
    D1 --> S2[Mongol Refinery EPC Project]

    D2 --> S3[Polavaram Multi-Purpose Project Site #042]
    D2 --> S4[Kaleshwaram Lift Irrigation Site #014]

    D3 --> S5[Zojila Strategic Tunnel Site #108]
    D3 --> S6[Char Dham All-Weather Highway]
```

Each project site functions as an autonomous data collection unit with its own digital logbooks, fuel dispensing telemetry, and weighbridge gate vouchers.

---

## 2. Role Matrix & Access Control (RBAC)

The platform enforces strict separation of duties (SoD) to satisfy ISAE 3000 independent assurance standards:

| Role Persona | Ingestion / Edit | Anomaly Review | Four-Eyes Approval | AI Executive Narrative | Regulatory Sign-off |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Project Data Entry User** | ✅ Yes | 👁️ View Only | ❌ No | ❌ No | ❌ No |
| **Business Unit Reviewer** | ✏️ Annotate | ✅ Diagnose | 🟡 Tier-1 Pass | 👁️ View Only | ❌ No |
| **Subsidiary Approver** | ❌ No | ✅ Mitigate | 🟢 Tier-2 Pass | ✏️ Generate Draft | ❌ No |
| **Group ESG Admin** | ⚙️ Config Masters | ✅ Full Access | 🟣 Final Group Pass | 🚀 Full AI Copilot | ✍️ Statutory Sign |
| **Independent Auditor (ISAE 3000)** | ❌ No | 🔍 Audit Mode | 📜 Issue Assurance Cert | 🔍 Verification Chat | 🔍 Sample Verification |
| **Board Viewer** | 👁️ Read-Only | 👁️ Read-Only | 👁️ Read-Only | 👁️ Executive View | 👁️ Read-Only |

---

## 3. End-to-End ESG Reporting Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor SiteEng as 👷 Site Engineer
    participant System as 💻 ESG Connect Core
    actor Reviewer as 📋 BU Reviewer
    actor Approver as 🏢 Subsidiary Approver
    participant Gemini as 🧠 Gemini AI Copilot
    actor Auditor as 🛡️ ISAE 3000 Auditor

    SiteEng->>System: Enter diesel, electricity & steel records
    SiteEng->>System: Upload / Generate Signed Weighbridge Slip
    System->>System: Compute Scope 1, 2, 3 CO2e (CEA/DEFRA)
    
    alt Variance > 15% detected
        System->>Gemini: Flag anomaly & query root cause
        Gemini-->>System: Draft root cause memo & CAP notice
        System-->>SiteEng: Issue urgent clarification notice
    else Standard variance (<15%)
        System->>Reviewer: Dispatch to Tier-1 Review Queue
    end

    Reviewer->>System: Verify evidence vouchers & Approve
    System->>Approver: Escalate to Tier-2 Approval
    Approver->>System: Four-Eyes Sign-Off & Lock Record
    
    System->>Gemini: Synthesize statutory disclosure narrative
    Gemini-->>System: Return formatted BRSR Executive Statement
    
    Auditor->>System: Review immutable audit log & sample slips
    Auditor->>System: Issue Reasonable Assurance Opinion (SEBI Core)
```

---

## 4. Data Ingestion & Physical Evidence Provenance

### The Weighbridge Slip Verification Protocol
In heavy infrastructure works (e.g. tunnel excavation, mass concrete batching), **diesel fuel and raw materials constitute >80% of Scope 1 and Scope 3 footprints**. 

MEIL ESG Connect enforces physical slip provenance:
1. **Gross / Tare / Net Telemetry:** Automatic extraction of vehicle gross weight, tare weight, and net delivered fuel/aggregate quantity.
2. **Quality Stamp Certification:** Verification of sulfur content (BS-VI diesel standard) or slag blend proportion.
3. **Automated Carbon Footprint Ingestion:**
   $$\text{Scope 1 Fuel Emission } (tCO_2e) = \text{Net Quantity (L)} \times 2.68787 \times 10^{-3}$$
4. **Permanent Digital Voucher:** Stored in the tamper-proof Assurance Vault with clickable modal access across the entire reporting trail.

---

## 5. Real-Time Carbon Accounting & Emission Computation

The platform calculates carbon and intensity figures dynamically:

### Formulae & Factor Masters
- **Scope 1 (Direct Fuel):**
  $$\text{Scope 1} = \sum (\text{Fuel Volume} \times \text{DEFRA Fuel Factor})$$
- **Scope 2 (Grid Electricity - Location Based):**
  $$\text{Scope 2} = \text{Grid kWh} \times 0.716 \text{ kg } CO_2e/\text{kWh (CEA v20 Baseline)}$$
- **Scope 2 (Market Based):**
  $$\text{Scope 2 (Market)} = (\text{Grid kWh} - \text{Green Open Access kWh}) \times 0.716$$
- **Turnover GHG Intensity (SEBI BRSR Attribute 1):**
  $$\text{GHG Intensity} = \frac{\text{Scope 1 } (tCO_2e) + \text{Scope 2 } (tCO_2e)}{\text{Turnover in ₹ Crores}}$$
- **Water Recycling Ratio (SEBI BRSR Attribute 4):**
  $$\text{Water Recycled \%} = \frac{\text{Volume Recycled \& Reused (kL)}}{\text{Total Fresh Water Withdrawn (kL)}} \times 100$$

---

## 6. Automated Anomaly Radar & AI Diagnostic Loop

```mermaid
flowchart TD
    Data[Raw Activity Entry] --> AnomalyCheck{Variance vs Previous Cycle > 15%?}
    AnomalyCheck -->|No| Clean[Mark Verified & Enqueue]
    AnomalyCheck -->|Yes| Flag[Flag in Anomaly Radar]
    Flag --> GenPrompt[Construct Context Payload]
    GenPrompt --> Gemini[🧠 Invoke Gemini AI Copilot]
    Gemini --> Diagnosis[Technical Root Cause Assessment]
    Gemini --> Risk[SEBI Regulatory Risk Analysis]
    Gemini --> Memo[Draft Site Clarification Notice]
    Memo --> Notification[Send to Project Director & Site In-Charge]
    Notification --> CAP[Corrective Action Plan Required within 7 Days]
```

---

## 7. Four-Eyes Review & Approval Workflow

The platform provides an actionable kanban/table interface for Approvers:
- **Accept & Stamp:** Validates the quantitative figure and associated weighbridge slip, locking the record against further edits.
- **Request Clarification:** Generates an inline thread back to the site engineer requesting meter calibration certificates or delivery challans.
- **Reject & Purge:** Rejects fraudulent or duplicated records with mandatory audit justification notes.
- **Audit Trail Immutability:** Every interaction is written to the cryptographic audit ledger containing:
  - User ID & Full Name
  - Timestamp (UTC & IST)
  - IP Address
  - Before/After Value Snapshot

---

## 8. Statutory SEBI BRSR Generation & Audit Vault

At the culmination of each reporting cycle:
1. **Aggregated Matrix Compilation:** All approved site data aggregates to Division and Group Apex levels.
2. **AI Director Narrative Synthesis:** Gemini analyzes annual variances to draft statutory commentary for Section C disclosures.
3. **XBRL Package Generation:** Data maps into MCA/SEBI-compliant XBRL taxonomy tags.
4. **PDF Statutory Filing Preview:** Produces the official SEBI BRSR report formatted for direct annexure to MEIL's Annual Integrated Report.
