import React, { useState } from 'react';
import { useEsg } from '../../context/EsgContext';
import {
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  MapPin,
  Cpu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const GuidedTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, setActiveModule, setActiveSubtab } = useEsg();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTourOpen) return null;

  const steps = [
    {
      title: 'Welcome to MEIL ESG Connect',
      description:
        'A comprehensive platform designed for Megha Engineering & Infrastructures Limited to manage SEBI BRSR Core disclosures, carbon accounting across 25+ mega sites, and statutory assurance workflows.',
      icon: Compass,
      targetAction: () => {
        setActiveModule('overview');
        setActiveSubtab('dashboard');
      },
    },
    {
      title: 'Global Site & Entity Telemetry',
      description:
        'Seamlessly filter between the Consolidated Group and 25+ major infrastructure assets like Polavaram, Zojila Tunnel, Kaleshwaram, and Mongol Refinery using the top-bar entity switcher.',
      icon: MapPin,
      targetAction: () => {
        setActiveModule('overview');
        setActiveSubtab('gis-map');
      },
    },
    {
      title: 'DEFRA & CEA Carbon Computation Engine',
      description:
        'Real-time automated conversion of diesel liters, explosive kg, and grid kWh into Scope 1, 2, and 3 emissions applying CEA v20 and DEFRA 2024 emission factors.',
      icon: Cpu,
      targetAction: () => {
        setActiveModule('analytics');
        setActiveSubtab('emission-engine');
      },
    },
    {
      title: 'Assurance & Immutable Audit Trail',
      description:
        'Full four-eyes approval kanban, ISAE 3000 audit trail with cryptographic hash verification, and single-click statutory SEBI BRSR and XBRL export.',
      icon: ShieldCheck,
      targetAction: () => {
        setActiveModule('assurance');
        setActiveSubtab('approvals');
      },
    },
    {
      title: 'AI Copilot Powered by Gemini',
      description:
        'Draft executive statements, explain data anomalies (>20% MoM spikes), audit BRSR compliance gaps, and chat with your corporate ESG intelligence engine.',
      icon: Sparkles,
      targetAction: () => {
        setActiveModule('copilot');
        setActiveSubtab('narratives');
      },
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      steps[next].targetAction();
    } else {
      setIsTourOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      steps[prev].targetAction();
    }
  };

  const current = steps[currentStep];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={() => setIsTourOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              Step {currentStep + 1} of {steps.length}
            </div>
            <h3 className="text-lg font-bold text-white">{current.title}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">{current.description}</p>

        {/* Progress indicators */}
        <div className="flex items-center gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-emerald-500'
                  : idx < currentStep
                  ? 'w-4 bg-emerald-800'
                  : 'w-4 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsTourOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Skip Walkthrough
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              {currentStep === steps.length - 1 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
