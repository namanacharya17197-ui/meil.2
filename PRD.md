# 📋 MEIL ESG Connect — Product Requirements Document (PRD)

> **Document Status:** Approved & Baseline v1.0  
> **Product Name:** MEIL ESG Connect Platform  
> **Target Audience:** Group Executive Board, Sustainability Officers, Site Project In-Charges, Statutory Auditors  
> **Regulatory Foundation:** SEBI BRSR Core Mandate (Circular: `SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122`)

---

## 1. Executive Summary

Megha Engineering & Infrastructures Limited (MEIL) is one of India's premier infrastructure conglomerates executing mega projects in hydro-power, tunneling, irrigation, city gas distribution, and energy EPC. 

As a top listed enterprise under SEBI regulations, MEIL is required to furnish **Reasonable Assurance under BRSR Core** starting FY 2024–25. **MEIL ESG Connect** serves as the single source of truth for all corporate sustainability data, carbon accounting, digital physical evidence provenance (weighbridge slips), and AI-driven statutory narrative generation.

---

## 2. Problem Statement

1. **Fragmented Project Telemetry:** Operating across 25+ remote mega-sites results in fragmented fuel logs, paper weighbridge slips, and delayed data collection.
2. **Regulatory Penalties for Greenwashing:** SEBI BRSR Core requires **Reasonable Assurance (ISAE 3000)** for top listed companies. Estimated or unbacked numbers risk audit qualifications.
3. **Complex Carbon Math:** Converting diesel, heavy fuel oils, captive power generation, and mixed grid consumption using disparate national (CEA) and international (DEFRA) factors causes calculation errors.
4. **Time-Consuming Narrative Generation:** Compiling director statements and principle-wise disclosures takes weeks of manual drafting.

---

## 3. User Personas & User Stories

### Persona A: Site Data Entry Engineer (e.g. at Zojila Tunnel)
- **Need:** Fast tabular input for daily diesel generator runtime and weighbridge vouchers with instant receipt generation.
- **Story:** *"As a site engineer, I want to log bulk diesel deliveries and instantly view a signed weighbridge slip so I have verifiable physical proof for audits."*

### Persona B: Subsidiary Sustainability Reviewer
- **Need:** Automated anomaly detection flagging suspicious spikes (>15% MoM variance) before escalating to Group.
- **Story:** *"As a BU reviewer, I want the system to flag unusual fuel consumption spikes and explain the engineering root cause so I can request site clarification immediately."*

### Persona C: Chief Sustainability Officer (CSO) / Group ESG Admin
- **Need:** Conglomerate-wide Scope 1, 2, 3 carbon footprint overview, GHG intensity per ₹ Crore turnover, and one-click regulatory PDF export.
- **Story:** *"As CSO, I need to generate audit-ready SEBI BRSR Core disclosures and executive narratives backed by immutable evidence."*

### Persona D: Independent Statutory Auditor (ISAE 3000)
- **Need:** Chronological, tamper-proof audit trails showing timestamps, IP addresses, original values, and certified digital vouchers.
- **Story:** *"As an independent auditor, I need full traceability from the high-level BRSR Core table down to individual site weighbridge receipts."*

---

## 4. SEBI BRSR Core 9 Mandatory Attributes Matrix

MEIL ESG Connect automates tracking for all nine mandatory BRSR Core KPIs:

| # | BRSR Core Attribute | Units | Computation Engine |
| :- | :--- | :--- | :--- |
| **1** | **Greenhouse Gas (GHG) Footprint** | $tCO_2e$ | Scope 1 (Direct Fuel) + Scope 2 (Location/Market Grid) |
| **2** | **GHG Intensity per Turnover** | $tCO_2e / ₹\text{ Cr}$ | Total Scope 1+2 / Net Annual Consolidated Revenue |
| **3** | **Energy Consumption & Intensity** | GJ / ₹ Cr | Megawatt Hours (Grid) + Diesel Fuel Megajoules |
| **4** | **Water Withdrawal & Recycling** | kL & % | Total Recycled Water / Total Fresh Water Withdrawn |
| **5** | **Waste Generation & Circularity** | Metric Tonnes | Recycled concrete, scrap steel, hazard waste disposal |
| **6** | **Workforce Safety & Health** | LTIFR / Zero | Lost Time Injury Frequency Rate per 1M Hours |
| **7** | **Workforce Diversity & Inclusion** | Ratio % | Female representation in engineering & permanent rolls |
| **8** | **Fair Remuneration & Median Ratio**| Ratio | Median wage comparison across worker categories |
| **9** | **Vendor ESG Due Diligence** | % Spend | Tier-1 suppliers screened for environmental compliance |

---

## 5. Functional Requirements by Module

### Module 1: Overview & Mission Control
- Real-time KPI tiles for Scope 1, Scope 2, Scope 3, Water Recycled %, and LTIFR.
- Interactive GIS map showing all 25+ mega sites with status pins and project specs.
- UN SDG alignment matrix mapping activities to SDGs 6, 7, 9, and 13.

### Module 2: Governance & Structure
- Multi-tier organizational tree: Group Holding -> Division -> Subsidiary -> Site.
- Submission matrix tracking site compliance status (Draft, Under Review, Approved).

### Module 3: Data Ingestion & Physical Provenance
- Section A (General), Section B (Management & Process), and Section C (Principle Performance).
- Site Quick-Entry spreadsheet for bulk logging.
- **Signed Weighbridge Modal:** Interactive gate pass voucher viewer with physical signatures, QR stamps, and telemetry.

### Module 4: ESG Analytics & Computation Engine
- Live interactive calculator for diesel, grid kWh, and green solar PPA modeling.
- Automated anomaly radar detecting variance > 15% with threshold controls.

### Module 5: Assurance & Compliance
- Four-Eyes review kanban with Accept, Reject, and Request Clarification actions.
- Tamper-proof audit trail ledger with IP, timestamp, user, and delta recording.
- Statutory SEBI BRSR Core report generator and XBRL export.

### Module 6: Autonomous AI ESG Copilot
- AI-synthesized executive narratives using Google Gemini (`gemini-3.5-flash` / `gemini-3.8-flash`).
- Root-cause anomaly explainer and automatic site clarification memo generator.
- Statutory gap analysis auditor.
- Grounded conversational Q&A assistant.

### Module 7: Administration & Masters
- Global emission factor library master (CEA v20, DEFRA 2024, IPCC AR6).
- Indicator dictionary and configurable threshold parameters.

---

## 6. Non-Functional Requirements (NFR)

1. **Performance:** Sub-100ms UI response for filtering 25+ sites; sub-2s for AI narrative generation.
2. **Auditability:** Every update generates an immutable entry in the audit ledger.
3. **Availability & Resilience:** Dual-tier AI fallback ensuring uninterrupted operation even during external API downtime.
4. **Security:** Role-based access control (RBAC), sanitization of all inputs, environment secret isolation for API credentials.

---

## 7. Product Roadmap

- **v2.0 (Current):** End-to-end SEBI BRSR Core platform, signed weighbridge viewer, multi-model Gemini copilot.
- **v2.5 (Q1 2027):** IoT flow meter telemetry direct ingestion from batching plants.
- **v3.0 (Q3 2027):** Satellite synthetic-aperture radar (SAR) verification for environmental ground displacement and water bodies.
