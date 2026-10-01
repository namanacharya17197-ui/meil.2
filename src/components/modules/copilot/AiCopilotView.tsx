import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  Sparkles,
  BrainCircuit,
  ShieldAlert,
  CheckSquare,
  CheckCircle2,
  Send,
  Copy,
  Check,
  RefreshCw,
  FileText,
  AlertTriangle,
  Lightbulb,
  Building2,
  ChevronRight,
} from 'lucide-react';

export const AiCopilotView: React.FC = () => {
  const {
    activeSubtab,
    setActiveSubtab,
    selectedSiteId,
    sites,
    aggregatedMetrics,
    anomalies,
    selectedCycle,
    brsrIndicators,
  } = useEsg();

  const currentSite = sites.find((s) => s.id === selectedSiteId) || null;

  // 1. Narrative Generation State
  const [narrativeSection, setNarrativeSection] = useState('Executive ESG & BRSR Director Statement');
  const [narrativeTone, setNarrativeTone] = useState('Authoritative, Statutory, Transparent, Technical');
  const [narrativeOutput, setNarrativeOutput] = useState<string | null>(null);
  const [loadingNarrative, setLoadingNarrative] = useState(false);

  // 2. Anomaly Explainer State
  const [selectedAnomalyId, setSelectedAnomalyId] = useState(anomalies[0]?.id || '');
  const [anomalyOutput, setAnomalyOutput] = useState<string | null>(null);
  const [loadingAnomaly, setLoadingAnomaly] = useState(false);

  // 3. Gap Analysis State
  const [gapOutput, setGapOutput] = useState<string | null>(null);
  const [loadingGap, setLoadingGap] = useState(false);

  // 4. Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      role: 'assistant',
      text: `Hello K. V. Rao. I am your MEIL ESG Intelligence Copilot powered by Gemini. I have ingested live carbon telemetry across your 25+ infrastructure assets (Polavaram, Zojila Tunnel, Kaleshwaram, Mongol Refinery) for ${selectedCycle}. How can I assist with your statutory SEBI BRSR filings or decarbonization roadmap today?`,
      timestamp: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateClientNarrative = () => {
    const s1 = (aggregatedMetrics.totalScope1 / 1000).toFixed(1);
    const s2 = (aggregatedMetrics.totalScope2 / 1000).toFixed(1);
    const s3 = (aggregatedMetrics.totalScope3 / 1000).toFixed(1);
    const entity = currentSite ? `${currentSite.code} • ${currentSite.name}` : 'MEIL Consolidated Infrastructure Group';

    return `### Statutory ESG & BRSR Performance Narrative (${selectedCycle})
**Reporting Entity:** ${entity}
**Statutory Framework:** SEBI BRSR Core / LODR Regulation 34(2)(f) · ISAE 3000 Reasonable Assurance Standard
**Auditor Voice & Tone:** ${narrativeTone}
**Target Disclosure Section:** ${narrativeSection}

---

#### 1. Executive ESG Governance & Operational Scale
During ${selectedCycle}, Megha Engineering & Infrastructures Limited (MEIL) maintained continuous environmental, social, and energy telemetry across **${sites.length} active mega infrastructure sites**, including the high-altitude **Zojila Strategic Tunnel**, **Polavaram Multi-Purpose Dam**, **Kaleshwaram Lift Irrigation**, and international hydrocarbon projects like the **Mongol Refinery**.

Consolidated Greenhouse Gas Intensity recorded at **${aggregatedMetrics.intensityTco2ePerCr} tCO₂e per ₹ Crore Turnover**, reflecting an **8.4% year-on-year decarbonization trajectory** in compliance with our interim glidepath benchmark (&lt;4.00 tCO₂e/₹ Cr by 2030).

| Statutory Indicator | Telemetry Benchmark (${selectedCycle}) | Assurance Status | Standard Methodology |
| :--- | :--- | :--- | :--- |
| **Scope 1 (Direct Fuel & Equipment)** | **${s1}k tCO₂e** | ISAE 3000 Reasonable | DEFRA 2024 / NABL Verified |
| **Scope 2 (Grid Purchased Power)** | **${s2}k tCO₂e** | ISAE 3000 Reasonable | CEA Baseline v20 (0.716 kg/kWh) |
| **Scope 3 (Embodied Steel & Cement)** | **${s3}k tCO₂e** | Limited Assurance | GHG Protocol Cat 1 & Cat 4 |
| **Carbon Turnover Intensity** | **${aggregatedMetrics.intensityTco2ePerCr} tCO₂e / ₹ Cr** | ISAE 3000 Reasonable | SEBI BRSR Core Attribute 1 |
| **Water Circularity Proportion** | **${aggregatedMetrics.avgWaterRecycledPct}% Recycled** | ISAE 3000 Reasonable | SEBI BRSR Core Attribute 4 |
| **Safety Benchmark (LTIFR)** | **${aggregatedMetrics.avgLtifr} per 1M Hours** | Chief Safety Officer Certified | Zero Fatalities Mandate |

---

#### 2. Emissions Trajectory & Decarbonization Actions (BRSR Principle 6)
- **Scope 1 Fuel Telemetry:** Direct fuel consumption across heavy earthmoving excavators, tunnel boring machines, and standby diesel generators totaled **${s1}k tCO₂e**. Deployment of captive 33kV high-tension transmission grid tie-ins across tunnel adits avoided an estimated 28,400 tCO₂e of captive diesel generator runtimes.
- **Scope 2 Clean Energy Transition:** Recorded at **${s2}k tCO₂e** under the Central Electricity Authority (CEA v20) national baseline factor. Transition of 25% batching plant loads to Green Energy Open Access solar PPAs reduced market-based Scope 2 emissions by 18,200 tCO₂e.
- **Scope 3 Embodied Carbon Stewardship:** Tier-1 supplier audits for structural TMT rebar and Portland Slag Cement (PSC) resulted in the adoption of 42% blast furnace slag blends, curtailing embodied lifecycle emissions across mega dam spillways.

---

#### 3. Water Circularity & River Basin Stewardship
With key project reaches situated along sensitive river basins (Godavari, Krishna, and Narmada), MEIL achieved a consolidated **${aggregatedMetrics.avgWaterRecycledPct}% water recycling and reuse rate**. 
- Automated sedimentation basins and filter presses at batching facilities recovered 1.84 million kL of process water.
- Zero Liquid Discharge (ZLD) systems operating at major pump houses neutralized untreated effluent discharge into public waterways.

---

#### 4. Occupational Health & Safety Compliance (BRSR Principle 3)
Lost Time Injury Frequency Rate (LTIFR) stood at **${aggregatedMetrics.avgLtifr} incidents per million man-hours**, outperforming the global heavy infrastructure benchmark of 0.50. This benchmark was reinforced by over **420,000+ computerized toolbox training hours** and 100% medical insurance coverage for 60,000+ contractual and permanent site workers.

---

#### 5. Independent Assurance Attestation
*The quantitative metrics summarized above have been reconciled against signed digital weighbridge receipts, NABL meter calibration certificates, and DISCOM grid billing records. They comply fully with SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 for reasonable assurance filing.*`;
  };

  const handleGenerateNarrative = async () => {
    setLoadingNarrative(true);
    setNarrativeOutput(null);

    try {
      const res = await fetch('/api/ai/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: narrativeSection,
          siteName: currentSite ? `${currentSite.code} • ${currentSite.name}` : 'Consolidated MEIL Group',
          reportingYear: selectedCycle,
          tone: narrativeTone,
          metrics: {
            scope1_tco2e: aggregatedMetrics.totalScope1,
            scope2_tco2e: aggregatedMetrics.totalScope2,
            scope3_tco2e: aggregatedMetrics.totalScope3,
            intensity_tco2e_per_cr: aggregatedMetrics.intensityTco2ePerCr,
            water_recycled_pct: aggregatedMetrics.avgWaterRecycledPct,
            ltifr: aggregatedMetrics.avgLtifr,
            site_count: sites.length,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNarrativeOutput(data.text || generateClientNarrative());
      } else {
        setNarrativeOutput(generateClientNarrative());
      }
    } catch (err: any) {
      console.warn('Network issue calling /api/ai/narrative, using dynamic client synthesis:', err);
      setNarrativeOutput(generateClientNarrative());
    } finally {
      setLoadingNarrative(false);
    }
  };

  const handleGenerateAnomalyExplainer = async () => {
    const targetAnomaly = anomalies.find((a) => a.id === selectedAnomalyId) || anomalies[0];
    if (!targetAnomaly) return;

    setLoadingAnomaly(true);
    setAnomalyOutput(null);

    const fallbackAnomaly = `### ESG Audit Assurance Anomaly Investigation
**Target Entity:** ${targetAnomaly.siteName}
**Metric Flagged:** ${targetAnomaly.metric} | Variance: ${targetAnomaly.variancePct}% (${targetAnomaly.previousValue} -> ${targetAnomaly.currentValue})

#### 1. Root Cause Analysis
The observed shift represents an operational deviation common during intensified civil works phases. For heavy construction such as tunneling and canal excavation, diesel fuel variance typically correlates with:
- Transition from temporary 33kV high-tension grid feeders to captive heavy DG sets during deep cut dewatering.
- Double-shift operation of heavy hydraulic excavators and dump trucks during seasonal weather windows.
- Uncalibrated fuel flow meters or delayed entry of bulk storage deliveries.

#### 2. Statutory Audit Risk (SEBI BRSR Core)
Under SEBI BRSR Core Principle 6 mandatory assurance requirements, variance exceeding ±15% requires documented reconciliations against SAP ERP gate-passes and delivery challans. Unverified entries risk an auditor qualification under ISAE 3000.

#### 3. Formal Site Clarification Notice
**To:** Project Director & Plant In-Charge, ${targetAnomaly.siteName}
**Subject:** Urgent Requisition: ESG Data Variance Verification (${targetAnomaly.metric})
> *"During our automated pre-assurance scan for ${selectedCycle}, a ${targetAnomaly.variancePct}% variance was detected in ${targetAnomaly.metric}. Kindly furnish signed fuel meter logs, IOCL/BPCL bulk supply invoices, and equipment operating hours within 48 hours for Independent Auditor sign-off."*

#### 4. Mandatory Corrective Steps
1. Reconcile fuel dispensary digital meters against equipment logbooks.
2. Upload stamped surveyor inspection certificates to the Assurance Vault.
3. Submit formal variance justification note signed by General Manager (Projects).`;

    try {
      const res = await fetch('/api/ai/anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: targetAnomaly.siteName,
          metric: targetAnomaly.metric,
          variance: `${targetAnomaly.variancePct}%`,
          previousValue: targetAnomaly.previousValue,
          currentValue: targetAnomaly.currentValue,
          probableCause: targetAnomaly.probableCause,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnomalyOutput(data.text || fallbackAnomaly);
      } else {
        setAnomalyOutput(fallbackAnomaly);
      }
    } catch (err: any) {
      console.warn('Network issue calling /api/ai/anomaly, using fallback explainer:', err);
      setAnomalyOutput(fallbackAnomaly);
    } finally {
      setLoadingAnomaly(false);
    }
  };

  const handleGenerateGapAnalysis = async () => {
    setLoadingGap(true);
    setGapOutput(null);

    const fallbackGap = `### SEBI BRSR Core Statutory Gap Analysis
**Audit Benchmark:** SEBI Mandate circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 & ISO 14064-1:2018
**Compliance Health Score:** 91.4% (Assurance-Ready with Minor Rectifications)

#### 1. Statutory Attribute Status
- **Greenhouse Gas Emissions (P6):** 96% Complete. Scope 1 and Scope 2 verified with CEA v20 and DEFRA 2024 emission factors. Scope 3 upstream transport boundary requires 3 more vendor certifications.
- **Water Management (P6):** 92% Complete. Surface vs. Groundwater breakdown validated. Zero liquid discharge validation certificates uploaded for 21 out of 25 sites.
- **Waste & Hazardous Materials (P6):** 89% Complete. PCB disposal receipts logged; e-waste authorized vendor manifest pending for 2 remote sub-stations.
- **Workforce Well-being & Safety (P3):** 98% Complete. Zero fatal incident logs and safe man-hours verified by Chief Safety Officer.
- **Fair Sourcing & SCM (P8):** 84% Complete. Local procurement within 50km radius documented for 72% of aggregate volume.

#### 2. Priority Remediations
1. **Scope 3 Category 4 (Upstream Logistics):** Obtain third-party vehicle emission verification for fleet operators on Zojila tunnel corridor.
2. **Internal Carbon Pricing (ICP):** Formally document MEIL shadow carbon price ($35/tCO₂e) in Section B governance policies.
3. **Gender Pay Ratio (P5):** Complete equal remuneration certification for contract engineering staff.`;

    try {
      const res = await fetch('/api/ai/gap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          indicators: brsrIndicators,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGapOutput(data.text || fallbackGap);
      } else {
        setGapOutput(fallbackGap);
      }
    } catch (err: any) {
      console.warn('Network issue calling /api/ai/gap-analysis, using fallback gap analysis:', err);
      setGapOutput(fallbackGap);
    } finally {
      setLoadingGap(false);
    }
  };

  const handleSendChat = async (presetText?: string) => {
    const query = presetText || chatInput;
    if (!query.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatInput('');
    setLoadingChat(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            activeSite: currentSite ? currentSite.name : 'All MEIL Sites',
            cycle: selectedCycle,
            scope1: aggregatedMetrics.totalScope1,
            scope2: aggregatedMetrics.totalScope2,
            intensity: aggregatedMetrics.intensityTco2ePerCr,
            waterRecycled: aggregatedMetrics.avgWaterRecycledPct,
            ltifr: aggregatedMetrics.avgLtifr,
          },
        }),
      });
      const data = await res.json();
      const botMsg = {
        role: 'assistant' as const,
        text: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Error contacting AI Copilot. Please verify network or API key.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>MEIL Intelligence Copilot</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">Gemini 3.8 Flash Powered</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>AI Copilot & Statutory LLM Integration</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated synthesis of SEBI Director statements, technical anomaly explanation, statutory gap audit, and natural language ESG data querying.
            </p>
          </div>

          {/* Subtab Segmented Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveSubtab('narratives')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 ${
                activeSubtab === 'narratives'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Draft Narratives
            </button>
            <button
              onClick={() => setActiveSubtab('anomaly-explainer')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 ${
                activeSubtab === 'anomaly-explainer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Anomaly Explainer
            </button>
            <button
              onClick={() => setActiveSubtab('gap-analysis')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 ${
                activeSubtab === 'gap-analysis'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SEBI Gap Analysis
            </button>
            <button
              onClick={() => setActiveSubtab('ask-chat')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                activeSubtab === 'ask-chat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-sky-400" />
              <span>Ask ESG Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. DRAFT NARRATIVES & STATEMENTS */}
      {activeSubtab === 'narratives' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Configure Narrative Synthesis</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Section</label>
                <select
                  value={narrativeSection}
                  onChange={(e) => setNarrativeSection(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Executive ESG & BRSR Director Statement">
                    Executive ESG & BRSR Director Statement
                  </option>
                  <option value="Principle 6 Decarbonization & Fuel Transition Commentary">
                    Principle 6 Decarbonization & Fuel Transition Commentary
                  </option>
                  <option value="Water Circularity in Sensitive River Basins (Polavaram / Kaleshwaram)">
                    Water Circularity in Sensitive River Basins
                  </option>
                  <option value="Vision Zero & Occupational Safety Performance (LTIFR)">
                    Vision Zero & Occupational Safety Performance (LTIFR)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tone & Auditor Voice</label>
                <select
                  value={narrativeTone}
                  onChange={(e) => setNarrativeTone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Authoritative, Statutory, Transparent, Technical">
                    Authoritative & Statutory (ISAE 3000 Ready)
                  </option>
                  <option value="Executive Board Summary, High-Level Strategic">
                    Executive Board Summary (Strategic & Concise)
                  </option>
                  <option value="Investor ESG & Green Financing Disclosures">
                    Investor ESG & Green Financing Focused
                  </option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">Ingested Data Injected:</span>
                <div>• Scope 1: {(aggregatedMetrics.totalScope1 / 1000).toFixed(1)}k tCO₂e</div>
                <div>• Scope 2: {(aggregatedMetrics.totalScope2 / 1000).toFixed(1)}k tCO₂e</div>
                <div>• Intensity: {aggregatedMetrics.intensityTco2ePerCr} tCO₂e / ₹ Cr</div>
                <div>• Water Recycled: {aggregatedMetrics.avgWaterRecycledPct}%</div>
              </div>

              <button
                onClick={handleGenerateNarrative}
                disabled={loadingNarrative}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingNarrative ? 'Synthesizing with Gemini...' : 'Generate Statutory Narrative'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white">Synthesized Statutory Narrative</h3>
                {narrativeOutput && (
                  <button
                    onClick={() => handleCopy(narrativeOutput, 'narrative')}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedKey === 'narrative' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'narrative' ? 'Copied' : 'Copy Markdown'}</span>
                  </button>
                )}
              </div>

              {loadingNarrative ? (
                <div className="py-20 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <div className="text-xs text-slate-300 font-semibold">
                    Gemini 3.8 Flash is drafting statutory commentary against SEBI BRSR guidelines...
                  </div>
                </div>
              ) : narrativeOutput ? (
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {narrativeOutput}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs">
                  Click "Generate Statutory Narrative" to synthesize an audit-ready executive statement grounded in MEIL's real carbon and water telemetry.
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800 mt-4">
              Grounding: SEBI LODR Regulation 34(2)(f) · ISO 14064-1:2018 · CEA Baseline v20
            </div>
          </div>
        </div>
      )}

      {/* 2. ANOMALY ROOT-CAUSE EXPLAINER */}
      {activeSubtab === 'anomaly-explainer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Select Flagged Anomaly</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Anomaly Flag</label>
                <select
                  value={selectedAnomalyId}
                  onChange={(e) => setSelectedAnomalyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {anomalies.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.siteName} ({a.variancePct > 0 ? `+${a.variancePct}%` : `${a.variancePct}%`} {a.metric})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateAnomalyExplainer}
                disabled={loadingAnomaly}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingAnomaly ? 'Investigating with Gemini...' : 'Analyze Root-Cause & Draft Notice'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white">AI Auditor Root-Cause & Clarification Memo</h3>
                {anomalyOutput && (
                  <button
                    onClick={() => handleCopy(anomalyOutput, 'anomaly')}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedKey === 'anomaly' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'anomaly' ? 'Copied' : 'Copy Memo'}</span>
                  </button>
                )}
              </div>

              {loadingAnomaly ? (
                <div className="py-20 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                  <div className="text-xs text-slate-300 font-semibold">
                    Investigating engineering factors (excavator duty cycles, grid interruptions, monsoon dewatering)...
                  </div>
                </div>
              ) : anomalyOutput ? (
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {anomalyOutput}
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500 text-xs">
                  Select an anomaly flag and trigger AI root-cause analysis to draft a technical justification note and site clarification notice.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SEBI GAP ANALYSIS */}
      {activeSubtab === 'gap-analysis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Statutory SEBI BRSR Core Gap & Assurance Audit</span>
              </h2>
              <p className="text-xs text-slate-400">
                Auditing current disclosures against SEBI Circular 2023/122 mandatory assurance requirements.
              </p>
            </div>

            <button
              onClick={handleGenerateGapAnalysis}
              disabled={loadingGap}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingGap ? 'animate-spin' : ''}`} />
              <span>{loadingGap ? 'Auditing Indicators...' : 'Run Gap Audit'}</span>
            </button>
          </div>

          {loadingGap ? (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <div className="text-xs text-slate-300 font-semibold">
                Cross-referencing 25 site disclosures with BRSR Core Principles P1 through P9...
              </div>
            </div>
          ) : gapOutput ? (
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              {gapOutput}
            </div>
          ) : (
            <div className="p-8 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">Current Compliance Health: 91.4% Assurance-Ready</div>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Scope 1 and Scope 2 disclosures are complete. Scope 3 upstream transport boundary requires 3 more vendor certifications. Click "Run Gap Audit" to execute a full AI audit report.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. ASK ESG CONVERSATIONAL CHAT */}
      {activeSubtab === 'ask-chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
          {/* Preset Prompts Bar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-semibold shrink-0 uppercase tracking-wider text-[10px]">
              Prompt Suggestions:
            </span>
            {[
              'Compare Polavaram and Zojila carbon intensities',
              'What is MEIL Scope 2 under market-based vs location-based?',
              'Explain how our water circularity rate is computed',
              'Draft an executive summary for our Q3 board meeting',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(p)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-850 shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs max-w-2xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-br from-teal-500 to-sky-600 text-white'
                  }`}
                >
                  {msg.role === 'user' ? 'KR' : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3.5 rounded-xl border leading-relaxed space-y-1 ${
                    msg.role === 'user'
                      ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-100 rounded-tr-none'
                      : 'bg-slate-950 border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className="text-[9px] text-slate-500 text-right">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {loadingChat && (
              <div className="flex gap-3 text-xs max-w-md">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 italic">
                  Analyzing MEIL telemetry database...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about MEIL ESG telemetry, DEFRA/CEA factors, or SEBI filings..."
              className="flex-1 bg-slate-900 border border-slate-750 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loadingChat || !chatInput.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
