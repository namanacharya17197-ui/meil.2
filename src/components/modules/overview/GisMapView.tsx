import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  MapPin,
  Layers,
  Search,
  Filter,
  Info,
  CheckCircle2,
  ExternalLink,
  Droplets,
  HardHat,
  Leaf,
  Navigation,
} from 'lucide-react';

export const GisMapView: React.FC = () => {
  const { sites, selectedSiteId, setSelectedSiteId, setActiveModule, setActiveSubtab } = useEsg();
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHoverSite, setActiveHoverSite] = useState<string | null>(null);

  const divisions = ['All', 'Hydro & Irrigation', 'Energy & Hydrocarbons', 'Transport & Tunnels', 'Power & Solar', 'Water & Urban'];

  const filteredSites = sites.filter((site) => {
    const matchesDiv = selectedDivision === 'All' || site.division === selectedDivision;
    const matchesQuery =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesQuery;
  });

  const activeSiteData = sites.find((s) => s.id === selectedSiteId) || sites[0];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <span>Interactive Infrastructure GIS Telemetry Map</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Geospatial monitoring of MEIL mega projects across river basins, high-altitude mountain corridors, solar belts, and international hydrocarbon terminals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GIS site..."
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48"
              />
            </div>
          </div>
        </div>

        {/* Division Filter Badges */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 text-[11px] uppercase tracking-wider">
            <Filter className="w-3 h-3 text-emerald-400" /> Filter:
          </span>
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
                selectedDivision === div
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Interactive Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas (2 cols) */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative min-h-[500px] flex flex-col justify-between shadow-2xl p-6">
          {/* Subtle Map Coordinate Grid Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#38bdf8 1px, #020617 1px)',
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px',
            }}
          />

          {/* Top Floating Map Indicators */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs flex items-center gap-3">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {filteredSites.length} Live Sites Active
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">WGS-84 Coordinate Telemetry</span>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-lg text-[10px] text-slate-400 font-mono">
              LAT: 11.31°N - 44.89°N · LNG: 70.22°E - 110.12°E
            </div>
          </div>

          {/* Interactive Geographic Cluster Visualizer */}
          <div className="relative z-10 my-auto py-10">
            <div className="max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredSites.slice(0, 9).map((site) => {
                const isSelected = selectedSiteId === site.id;
                const isHovered = activeHoverSite === site.id;

                let divColor = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300';
                if (site.division === 'Energy & Hydrocarbons') {
                  divColor = 'border-amber-500/60 bg-amber-950/40 text-amber-300';
                } else if (site.division === 'Transport & Tunnels') {
                  divColor = 'border-sky-500/60 bg-sky-950/40 text-sky-300';
                } else if (site.division === 'Power & Solar') {
                  divColor = 'border-yellow-500/60 bg-yellow-950/40 text-yellow-300';
                }

                return (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSiteId(site.id)}
                    onMouseEnter={() => setActiveHoverSite(site.id)}
                    onMouseLeave={() => setActiveHoverSite(null)}
                    className={`text-left p-3 rounded-xl border transition-all relative group ${
                      isSelected
                        ? 'ring-2 ring-emerald-400 bg-slate-900 border-white/40 scale-105 shadow-xl shadow-emerald-950/60'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {site.code}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${divColor}`}
                      >
                        {site.state}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                      {site.name}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800">
                      <span>{site.scope1 + site.scope2} tCO2e</span>
                      <span className="text-cyan-400">{site.waterRecycledPct}% H2O</span>
                    </div>

                    {/* Pin ripple if selected */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hydro & Irrigation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Energy & Hydrocarbons
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Transport & Tunnels
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Power & Solar
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Click site pin to inspect statutory profile</div>
          </div>
        </div>

        {/* Site Details Card (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Site Telemetry Dossier
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  activeSiteData.status === 'Approved'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                {activeSiteData.status}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white leading-tight">
              {activeSiteData.name}
            </h2>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{activeSiteData.code}</span>
              <span>·</span>
              <span>{activeSiteData.subsidiary}</span>
            </div>

            {/* Geographical details */}
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Location</span>
                <span className="text-slate-200 font-medium">
                  {activeSiteData.state}, {activeSiteData.country}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GIS Coordinates</span>
                <span className="text-slate-200 font-mono text-[11px]">
                  {activeSiteData.lat.toFixed(2)}°N, {activeSiteData.lng.toFixed(2)}°E
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Infrastructure Facility</span>
                <span className="text-slate-200 font-medium text-right max-w-[180px] truncate">
                  {activeSiteData.keyFacility}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contract Turnover</span>
                <span className="text-white font-bold">₹ {activeSiteData.turnoverCr} Cr</span>
              </div>
            </div>

            {/* Key ESG Metrics */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Scope 1 & 2 Emissions
                  </span>
                  <span className="font-bold text-white">
                    {activeSiteData.scope1 + activeSiteData.scope2} tCO2e
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(activeSiteData.scope1 / (activeSiteData.scope1 + activeSiteData.scope2)) * 100}%` }}
                    className="bg-amber-500 h-full"
                  />
                  <div
                    style={{ width: `${(activeSiteData.scope2 / (activeSiteData.scope1 + activeSiteData.scope2)) * 100}%` }}
                    className="bg-sky-500 h-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Circularity Rate
                  </span>
                  <span className="font-bold text-cyan-300">{activeSiteData.waterRecycledPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${activeSiteData.waterRecycledPct}%` }}
                    className="bg-cyan-500 h-full rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5 text-amber-400" /> Safety LTIFR
                  </span>
                  <span className="font-bold text-emerald-400">{activeSiteData.ltifr} (Zero Fatalities)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, activeSiteData.ltifr * 200)}%` }}
                    className="bg-amber-500 h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setSelectedSiteId(activeSiteData.id);
                setActiveModule('collection');
                setActiveSubtab('quick-entry');
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ingest / Edit Site Telemetry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSelectedSiteId(activeSiteData.id);
                setActiveModule('analytics');
                setActiveSubtab('emission-engine');
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Run Carbon Accounting Engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
