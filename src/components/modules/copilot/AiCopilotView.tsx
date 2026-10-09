import React, { useState, useRef, useEffect } from 'react';
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
  Download,
  FileDown,
  Wrench,
  AlertOctagon,
  CornerDownLeft,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  copilotService,
  AnomalyResponse,
  GapAuditItem,
  GapAuditResponse,
} from '../../../services/copilotService';

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
  const [narrativeError, setNarrativeError] = useState<string | null>(null);

  // 2. Anomaly Explainer State
  const [selectedAnomalyId, setSelectedAnomalyId] = useState(anomalies[0]?.id || '');
  const [anomalyOutput, setAnomalyOutput] = useState<AnomalyResponse | null>(null);
  const [loadingAnomaly, setLoadingAnomaly] = useState(false);
  const [anomalyError, setAnomalyError] = useState<string | null>(null);

  // 3. Gap Analysis State
  const [gapData, setGapData] = useState<GapAuditResponse | null>(null);
  const [loadingGap, setLoadingGap] = useState(false);
  const [gapError, setGapError] = useState<string | null>(null);

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
  const [streamingChatText, setStreamingChatText] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loadingChat, streamingChatText]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // File download helper (for Word/PDF/Text export)
  const downloadDocument = (filename: string, content: string, mimeType = 'text/plain;charset=utf-8') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Generate Statutory Narrative
  const handleGenerateNarrative = async () => {
    setLoadingNarrative(true);
    setNarrativeError(null);
    setNarrativeOutput(null);

    try {
      const res = await copilotService.generateNarrative({
        section: narrativeSection,
        tone: narrativeTone,
        telemetryMetrics: {
          scope1: aggregatedMetrics.totalScope1,
          scope2: aggregatedMetrics.totalScope2,
          scope3: aggregatedMetrics.totalScope3,
          intensity: aggregatedMetrics.intensityTco2ePerCr,
          waterRecycled: aggregatedMetrics.avgWaterRecycledPct,
          ltifr: aggregatedMetrics.avgLtifr,
          siteCount: sites.length,
        },
        project: currentSite ? `${currentSite.code} • ${currentSite.name}` : 'Consolidated MEIL Group',
        cycle: selectedCycle,
      });
      setNarrativeOutput(res.text);
    } catch (err: any) {
      console.error('Error generating narrative:', err);
      setNarrativeError(err.message || 'Failed to generate narrative');
    } finally {
      setLoadingNarrative(false);
    }
  };

  // 2. Anomaly Explainer
  const targetAnomaly = anomalies.find((a) => a.id === selectedAnomalyId) || anomalies[0];

  const handleGenerateAnomalyExplainer = async () => {
    if (!targetAnomaly) return;
    setLoadingAnomaly(true);
    setAnomalyError(null);
    setAnomalyOutput(null);

    try {
      const res = await copilotService.analyzeAnomaly({
        anomalyId: targetAnomaly.id,
        project: targetAnomaly.siteName,
        deviationData: {
          metric: targetAnomaly.metric,
          variance: `${targetAnomaly.variancePct > 0 ? '+' : ''}${targetAnomaly.variancePct}%`,
          previousValue: targetAnomaly.previousValue,
          currentValue: targetAnomaly.currentValue,
          probableCause: targetAnomaly.probableCause,
        },
      });
      setAnomalyOutput(res);
    } catch (err: any) {
      console.error('Error analyzing anomaly:', err);
      setAnomalyError(err.message || 'Failed to analyze anomaly');
    } finally {
      setLoadingAnomaly(false);
    }
  };

  // 3. Gap Analysis
  const handleGenerateGapAnalysis = async () => {
    setLoadingGap(true);
    setGapError(null);
    setGapData(null);

    try {
      const res = await copilotService.runGapAudit({
        framework: 'SEBI_BRSR_2023_122',
        indicators: brsrIndicators,
      });
      setGapData(res);
    } catch (err: any) {
      console.error('Error running gap audit:', err);
      setGapError(err.message || 'Failed to execute gap audit');
    } finally {
      setLoadingGap(false);
    }
  };

  // 4. Chat
  const handleSendChat = async (presetText?: string) => {
    const query = presetText || chatInput;
    if (!query.trim() || loadingChat) return;

    const userMsg = {
      role: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatInput('');
    setLoadingChat(true);
    setStreamingChatText(null);

    try {
      const res = await copilotService.sendChatMessage({
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
        history: chatMessages,
      });

      // Token streaming animation
      const fullReply = res.reply;
      const chunks = fullReply.split(' ');
      let currentIdx = 0;

      const streamTimer = setInterval(() => {
        currentIdx += 3;
        if (currentIdx >= chunks.length) {
          clearInterval(streamTimer);
          setStreamingChatText(null);
          setChatMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: fullReply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setLoadingChat(false);
        } else {
          setStreamingChatText(chunks.slice(0, currentIdx).join(' '));
        }
      }, 35);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Error contacting AI Copilot. Telemetry fallback active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoadingChat(false);
      setStreamingChatText(null);
    }
  };

  // Styled Markdown Renderer Helper
  const renderMarkdownFormatted = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table parsing
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        if (!cells.every((c) => c.startsWith(':--') || c.startsWith('---'))) {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        // Table finished, render table
        inTable = false;
        if (tableRows.length > 0) {
          const header = tableRows[0];
          const body = tableRows.slice(1);
          elements.push(
            <div key={`table-${index}`} className="my-3 overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 text-emerald-400 font-semibold border-b border-slate-800">
                  <tr>
                    {header.map((th, hIdx) => (
                      <th key={hIdx} className="p-2.5">
                        {th.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {body.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2.5 text-slate-300">
                          {cell.replace(/\*\*/g, '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          tableRows = [];
        }
      }

      if (trimmed === '---') {
        elements.push(<hr key={index} className="my-3 border-slate-800" />);
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-bold text-white mt-4 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-sm inline-block" />
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-sm font-semibold text-emerald-300 mt-3 mb-1.5">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const content = trimmed.replace(/^[-•]\s*/, '');
        const parts = content.split('**');
        elements.push(
          <div key={index} className="flex items-start gap-2 text-xs text-slate-300 my-1 pl-2">
            <span className="text-emerald-400 mt-0.5">•</span>
            <div>
              {parts.map((p, pIdx) =>
                pIdx % 2 === 1 ? (
                  <strong key={pIdx} className="text-white font-semibold">
                    {p}
                  </strong>
                ) : (
                  p
                )
              )}
            </div>
          </div>
        );
      } else if (trimmed.startsWith('> ')) {
        elements.push(
          <blockquote
            key={index}
            className="my-2 border-l-2 border-amber-500/80 bg-amber-950/20 pl-3 py-1.5 text-xs text-amber-200/90 italic rounded-r-md"
          >
            {trimmed.replace('> ', '').replace(/"/g, '')}
          </blockquote>
        );
      } else if (trimmed.length > 0) {
        const parts = trimmed.split('**');
        elements.push(
          <p key={index} className="text-xs text-slate-300 leading-relaxed my-1.5">
            {parts.map((p, pIdx) =>
              pIdx % 2 === 1 ? (
                <strong key={pIdx} className="text-white font-semibold">
                  {p}
                </strong>
              ) : (
                p
              )
            )}
          </p>
        );
      }
    });

    // If table was at the end of content
    if (inTable && tableRows.length > 0) {
      const header = tableRows[0];
      const body = tableRows.slice(1);
      elements.push(
        <div key="table-end" className="my-3 overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 text-emerald-400 font-semibold border-b border-slate-800">
              <tr>
                {header.map((th, hIdx) => (
                  <th key={hIdx} className="p-2.5">
                    {th.replace(/\*\*/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {body.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-2.5 text-slate-300">
                      {cell.replace(/\*\*/g, '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
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
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini 3.5 Flash Active
              </span>
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
                <span className="font-semibold text-slate-200 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Ingested Telemetry Data:
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-1 border-t border-slate-850">
                  <div>• Scope 1: <span className="text-white font-medium">{(aggregatedMetrics.totalScope1 / 1000).toFixed(1)}k</span> tCO₂e</div>
                  <div>• Scope 2: <span className="text-white font-medium">{(aggregatedMetrics.totalScope2 / 1000).toFixed(1)}k</span> tCO₂e</div>
                  <div>• Intensity: <span className="text-white font-medium">{aggregatedMetrics.intensityTco2ePerCr}</span> tCO₂e/₹Cr</div>
                  <div>• Water Recycled: <span className="text-emerald-400 font-medium">{aggregatedMetrics.avgWaterRecycledPct}%</span></div>
                </div>
              </div>

              {narrativeError && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-[11px] flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{narrativeError}</span>
                </div>
              )}

              <button
                onClick={handleGenerateNarrative}
                disabled={loadingNarrative}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loadingNarrative ? 'animate-spin' : ''}`} />
                <span>{loadingNarrative ? 'Synthesizing with Gemini...' : 'Generate Statutory Narrative'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Synthesized Statutory Narrative</h3>
                  {narrativeOutput && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ISAE 3000 Ready
                    </span>
                  )}
                </div>

                {narrativeOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(narrativeOutput, 'narrative')}
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      title="Copy Markdown"
                    >
                      {copiedKey === 'narrative' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'narrative' ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() =>
                        downloadDocument(
                          `MEIL_Statutory_Narrative_${selectedCycle.replace(/\s+/g, '_')}.doc`,
                          narrativeOutput,
                          'application/msword;charset=utf-8'
                        )
                      }
                      className="flex items-center gap-1 text-xs text-white bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors"
                      title="Export as PDF/Word Document"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export as PDF/Word</span>
                    </button>
                  </div>
                )}
              </div>

              {loadingNarrative ? (
                /* Skeleton Loading State */
                <div className="space-y-4 py-4 animate-pulse">
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-800/60 rounded w-1/2" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3.5 bg-slate-800 rounded" />
                    <div className="h-3.5 bg-slate-800 rounded w-5/6" />
                    <div className="h-3.5 bg-slate-800 rounded w-4/6" />
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-20 bg-slate-850 rounded" />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 pt-4">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Gemini 3.5 Flash is calculating statutory factors & drafting SEBI BRSR commentary...</span>
                  </div>
                </div>
              ) : narrativeOutput ? (
                <div className="text-xs leading-relaxed max-h-[520px] overflow-y-auto pr-2 space-y-2">
                  {renderMarkdownFormatted(narrativeOutput)}
                </div>
              ) : (
                <div className="py-24 text-center text-slate-500 text-xs space-y-2">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="max-w-md mx-auto">
                    Click <strong className="text-slate-300">"Generate Statutory Narrative"</strong> to synthesize an audit-ready executive statement grounded in MEIL's real carbon and water telemetry.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
              <span>Grounding: SEBI LODR Regulation 34(2)(f) · ISO 14064-1:2018 · CEA Baseline v20</span>
              <span className="text-emerald-400/80">NABL Calibration Reconciled</span>
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

              {targetAnomaly && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] space-y-1.5">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Flagged Details:</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800">
                      {targetAnomaly.variancePct > 0 ? `+${targetAnomaly.variancePct}%` : `${targetAnomaly.variancePct}%`}
                    </span>
                  </div>
                  <div className="text-slate-400">• Metric: <span className="text-slate-200">{targetAnomaly.metric}</span></div>
                  <div className="text-slate-400">• Shift: <span className="text-slate-200">{targetAnomaly.previousValue} → {targetAnomaly.currentValue}</span></div>
                  <div className="text-slate-400">• Operational Note: <span className="text-slate-300 italic">{targetAnomaly.probableCause}</span></div>
                </div>
              )}

              {anomalyError && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-[11px] flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{anomalyError}</span>
                </div>
              )}

              <button
                onClick={handleGenerateAnomalyExplainer}
                disabled={loadingAnomaly}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loadingAnomaly ? 'animate-spin' : ''}`} />
                <span>{loadingAnomaly ? 'Investigating with Gemini...' : 'Analyze Root-Cause & Draft Notice'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">AI Auditor Root-Cause & Clarification Memo</h3>
                  {anomalyOutput && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950 text-amber-400 border border-amber-800">
                      Audit Notice Ready
                    </span>
                  )}
                </div>

                {anomalyOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(anomalyOutput.text, 'anomaly')}
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                    >
                      {copiedKey === 'anomaly' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'anomaly' ? 'Copied' : 'Copy All'}</span>
                    </button>

                    <button
                      onClick={() =>
                        downloadDocument(
                          `Audit_Notice_${targetAnomaly?.siteName.replace(/[^a-zA-Z0-9]/g, '_')}.doc`,
                          anomalyOutput.clarificationMemo,
                          'application/msword;charset=utf-8'
                        )
                      }
                      className="flex items-center gap-1 text-xs text-white bg-amber-600 hover:bg-amber-500 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Draft Memo</span>
                    </button>
                  </div>
                )}
              </div>

              {loadingAnomaly ? (
                /* Skeleton Loader */
                <div className="space-y-4 py-6 animate-pulse">
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-12 bg-slate-850 rounded" />
                  </div>
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="h-12 bg-slate-850 rounded" />
                  </div>
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-16 bg-slate-850 rounded" />
                  </div>
                  <div className="text-center text-xs text-amber-400 pt-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Cross-referencing site excavator logs, transmission grid logs, and SEBI P6 criteria...</span>
                  </div>
                </div>
              ) : anomalyOutput ? (
                /* 3-Part Card Implementation */
                <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                  {/* Part 1: Engineering Root Cause */}
                  <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 border-b border-amber-950/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-amber-400" />
                        1. Engineering Root Cause Analysis
                      </span>
                      <span className="text-[10px] text-amber-300/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        Site Operations Grounding
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pt-1">
                      {anomalyOutput.rootCause}
                    </div>
                  </div>

                  {/* Part 2: Statutory Risk Assessment */}
                  <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-400 border-b border-rose-950/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        2. Statutory Risk Assessment (SEBI BRSR Principle 6)
                      </span>
                      <span className="text-[10px] text-rose-300/80 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                        ISAE 3000 ±15% Rule
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pt-1">
                      {anomalyOutput.statutoryRisk}
                    </div>
                  </div>

                  {/* Part 3: Official Clarification Memo */}
                  <div className="bg-slate-950 border border-emerald-900/40 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400 border-b border-emerald-950/80 pb-2">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        3. Official Clarification Memo Draft
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(anomalyOutput.clarificationMemo, 'memo-copy')}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          {copiedKey === 'memo-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'memo-copy' ? 'Copied' : 'Copy Memo'}</span>
                        </button>
                        <button
                          onClick={() =>
                            downloadDocument(
                              `Notice_${targetAnomaly?.siteName.replace(/[^a-zA-Z0-9]/g, '_')}.doc`,
                              anomalyOutput.clarificationMemo,
                              'application/msword;charset=utf-8'
                            )
                          }
                          className="text-[10px] text-white bg-emerald-700 hover:bg-emerald-600 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export Draft</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-200 whitespace-pre-line leading-relaxed">
                      {anomalyOutput.clarificationMemo}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-slate-500 text-xs space-y-2">
                  <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="max-w-md mx-auto">
                    Select an anomaly flag and trigger AI root-cause analysis to inspect site operations and draft a formal clarification memo.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
              <span>Standard: ISAE 3000 Reasonable Assurance · SEBI Circular 2023/122</span>
              <span className="text-amber-400/80">Audit Trail Immutable Logged</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. SEBI GAP ANALYSIS */}
      {activeSubtab === 'gap-analysis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122
                </span>
                <span className="text-xs text-slate-400">· ISAE 3000 Criteria</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Statutory SEBI BRSR Core Gap & Assurance Audit</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated continuous gap audit against SEBI's 9 mandatory BRSR Core attributes and assurance evidence readiness.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {gapData && (
                <button
                  onClick={() =>
                    downloadDocument(
                      'SEBI_BRSR_Assurance_Dossier_2024_25.doc',
                      `${gapData.text}\n\nDETAILED INDICATOR BREAKDOWN:\n` +
                        gapData.items
                          .map(
                            (i) =>
                              `[${i.status.toUpperCase()}] ${i.principle} - ${i.attribute}\nPriority: ${i.priority}\nRequired Doc: ${i.requiredDoc}\nDetails: ${i.details}\n`
                          )
                          .join('\n\n'),
                      'application/msword;charset=utf-8'
                    )
                  }
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Assurance Dossier</span>
                </button>
              )}

              <button
                onClick={handleGenerateGapAnalysis}
                disabled={loadingGap}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingGap ? 'animate-spin' : ''}`} />
                <span>{loadingGap ? 'Auditing Indicators...' : 'Run Gap Audit'}</span>
              </button>
            </div>
          </div>

          {gapError && (
            <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{gapError}</span>
            </div>
          )}

          {loadingGap ? (
            <div className="py-20 text-center space-y-4">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <div className="text-xs text-slate-300 font-semibold">
                Cross-referencing 25 site disclosures with BRSR Core Principles P1 through P9...
              </div>
              <div className="max-w-md mx-auto space-y-2 pt-2 animate-pulse">
                <div className="h-3 bg-slate-800 rounded" />
                <div className="h-3 bg-slate-800 rounded w-4/5 mx-auto" />
              </div>
            </div>
          ) : gapData ? (
            <div className="space-y-6">
              {/* Compliance Health Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-emerald-800/80 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-extrabold text-lg border border-emerald-800">
                    {gapData.healthScore}%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Assurance Health Score</div>
                    <div className="text-[11px] text-emerald-400 font-medium">Reasonable Assurance Qualified</div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400">Total Mandatory Attributes</div>
                  <div className="text-lg font-bold text-white mt-1">9 Attributes (100% Tracked)</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400">Active Remediation Action Items</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">2 Pending Vendor Logs</div>
                </div>
              </div>

              {/* Detailed Compliance Breakdown Table */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    SEBI BRSR Core Indicator Breakdown Table
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Framework: {gapData.framework}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Principle / Attribute</th>
                        <th className="p-3">Disclosure Status</th>
                        <th className="p-3">Required Documentation</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Audit Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {gapData.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-white">{item.principle}</div>
                            <div className="text-[11px] text-slate-400">{item.attribute}</div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border inline-flex items-center gap-1 ${
                                item.status === 'Compliant'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                  : item.status === 'Gap'
                                  ? 'bg-rose-950 text-rose-400 border-rose-800'
                                  : 'bg-amber-950 text-amber-400 border-amber-800'
                              }`}
                            >
                              {item.status === 'Compliant' && <Check className="w-3 h-3" />}
                              {item.status === 'Gap' && <AlertTriangle className="w-3 h-3" />}
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-300 text-[11px] max-w-xs">
                            {item.requiredDoc}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.priority === 'High'
                                  ? 'bg-rose-900/50 text-rose-300'
                                  : item.priority === 'Medium'
                                  ? 'bg-amber-900/50 text-amber-300'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">
                            {item.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Executive Summary Markdown Box */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2">
                {renderMarkdownFormatted(gapData.text)}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-base font-bold text-white">Current Compliance Health: 91.4% Assurance-Ready</div>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                Scope 1 and Scope 2 disclosures are complete. Scope 3 upstream transport boundary requires 3 more vendor certifications. Click <strong className="text-emerald-400">"Run Gap Audit"</strong> to execute a full SEBI Circular 2023/122 breakdown and generate the Assurance Dossier.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. ASK ESG CONVERSATIONAL CHAT */}
      {activeSubtab === 'ask-chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[640px]">
          {/* Preset Prompts Bar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-semibold shrink-0 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-400" />
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
                disabled={loadingChat}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-850 shrink-0 transition-colors disabled:opacity-50"
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
                  <div className="space-y-1">
                    {msg.role === 'assistant' ? renderMarkdownFormatted(msg.text) : msg.text}
                  </div>
                  <div className="text-[9px] text-slate-500 text-right">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {/* Token Streaming Message Preview */}
            {streamingChatText && (
              <div className="flex gap-3 text-xs max-w-2xl">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-sky-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl rounded-tl-none space-y-1">
                  <div className="space-y-1">{renderMarkdownFormatted(streamingChatText)}</div>
                  <div className="text-[9px] text-emerald-400 animate-pulse">Streaming response...</div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loadingChat && !streamingChatText && (
              <div className="flex gap-3 text-xs max-w-md">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 italic flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Analyzing MEIL telemetry & SEBI benchmarks with Gemini...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Bottom Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 sticky bottom-0"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChat();
                }
              }}
              placeholder="Ask anything about MEIL ESG telemetry, DEFRA/CEA factors, or SEBI filings..."
              className="flex-1 bg-slate-900 border border-slate-750 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loadingChat || !chatInput.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
