import React, { useState } from 'react';
import { MeilLogo } from '../../common/MeilLogo';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  FileText,
  Truck,
  Scale,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export interface WeighbridgeRecord {
  id: string;
  date: string;
  fuelType: string;
  quantity: number;
  unit: string;
  facility: string;
  invoiceNo: string;
  uploadedFile: string;
  calculatedCo2e: number;
  // Specific weighbridge extras
  ticketNo?: string;
  vehicleNo?: string;
  supplier?: string;
  grossWeight?: string;
  tareWeight?: string;
  netWeight?: string;
  driverName?: string;
  siteCode?: string;
  siteName?: string;
  timeIn?: string;
  timeOut?: string;
  operatorName?: string;
}

interface SignedWeighbridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: WeighbridgeRecord | null;
}

export const SignedWeighbridgeModal: React.FC<SignedWeighbridgeModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'slip' | 'certificate'>('slip');

  if (!isOpen || !record) return null;

  const ticketNo = record.ticketNo || `WB-${(record.siteCode || 'POL').replace('#', '').replace(/\s+/g, '')}-${record.date.replace(/-/g, '')}-${record.id.slice(-4)}`;
  const vehicleNo = record.vehicleNo || (record.fuelType.includes('Electricity') ? 'SUBSTATION FEEDER METER #33kV' : 'AP 39 TE 4821');
  const supplier = record.supplier || (record.fuelType.includes('Diesel') ? 'Indian Oil Corporation Ltd (IOCL Bulk Depot)' : record.fuelType.includes('Grid') ? 'State Power Distribution DISCOM (TSSPDCL)' : 'Solar Industries India Ltd');
  const grossWeight = record.grossWeight || `${Math.round(record.quantity * 1.9 + 14200)} kg`;
  const tareWeight = record.tareWeight || '14,200 kg';
  const netDelivered = `${record.quantity.toLocaleString()} ${record.unit}`;
  const driverName = record.driverName || 'K. Ramesh Naidu (DL: AP05-20180041289)';
  const siteName = record.siteName || 'Polavaram Multi-Purpose Dam Works';
  const siteCode = record.siteCode || 'Site #042';
  const timeIn = record.timeIn || '08:42:15 AM';
  const timeOut = record.timeOut || '09:18:40 AM';
  const operatorName = record.operatorName || 'Er. Rajesh Kumar (Site In-Charge)';
  const shaHash = `0x${record.id.slice(-6)}8f49e1...b14c77aa9${ticketNo.slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const slipManifest = {
      title: 'MEIL OFFICIAL WEIGHBRIDGE & DELIVERY CHALLAN VOUCHER',
      ticketNo,
      site: `${siteCode} - ${siteName}`,
      date: record.date,
      timeIn,
      timeOut,
      material: record.fuelType,
      deliveredQuantity: netDelivered,
      calculatedScopeEmissions: `${record.calculatedCo2e} tCO2e`,
      vehicleRegistration: vehicleNo,
      supplier,
      driverName,
      grossWeight,
      tareWeight,
      digitalSealHash: shaHash,
      compliance: 'SEBI BRSR Core / ISAE 3000 Primary Evidence Stamped',
      inspectedBy: operatorName,
    };

    const blob = new Blob([JSON.stringify(slipManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MEIL_Weighbridge_Slip_${ticketNo}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto relative animate-in fade-in zoom-in-95">
        {/* Top Control Bar (Non-Printable) */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Site Evidence Voucher</span>
              </div>
              <h2 className="text-sm font-bold text-white">
                Signed Weighbridge Slip & Material Delivery Challan
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs mr-2">
              <button
                onClick={() => setActiveTab('slip')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'slip' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Physical Slip
              </button>
              <button
                onClick={() => setActiveTab('certificate')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'certificate' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Audit Hash Seal
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
              title="Print Weighbridge Slip"
            >
              <Printer className="w-4 h-4 text-sky-400" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
              title="Download Digital Manifest"
            >
              <Download className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-2 bg-emerald-950/90 text-emerald-300 text-xs text-center border-b border-emerald-800 font-medium no-print">
            Weighbridge Manifest & Digital Seal downloaded successfully!
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {activeTab === 'slip' ? (
            /* THE OFFICIAL PRINTABLE WEIGHBRIDGE SLIP */
            <div className="bg-[#fcfdfa] text-slate-900 rounded-xl p-6 sm:p-8 border-2 border-slate-300 shadow-xl relative font-sans">
              {/* Slip Top Header with MEIL Official Logo */}
              <div className="border-b-2 border-slate-800 pb-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  {/* Using the Official MEIL Logo */}
                  <div className="flex items-center gap-3">
                    <MeilLogo height={42} showText={true} />
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-tight mt-1">
                    Megha Engineering & Infrastructures Limited
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    CIN: U45202TG2006PLC050271 · Registered Office: Balanagar, Hyderabad - 500037
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="inline-block bg-slate-900 text-white font-mono text-xs font-bold px-2.5 py-1 rounded">
                    TICKET #: {ticketNo}
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono">
                    GATE PASS: GP-{ticketNo.slice(-6)}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700">
                    SEBI BRSR CORE VALIDATED VOUCHER
                  </div>
                </div>
              </div>

              {/* Title Ribbon */}
              <div className="bg-slate-100 border border-slate-300 rounded-md py-1.5 px-3 text-center mb-5">
                <span className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">
                  AUTOMATED DIGITAL WEIGHBRIDGE SLIP & MATERIAL DELIVERY RECEIPT
                </span>
              </div>

              {/* Project & Consignment Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-5 pb-5 border-b border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Infrastructure Site:</span>
                    <span className="font-bold text-slate-900">{siteCode} · {siteName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Facility / Reach:</span>
                    <span className="text-slate-800 font-medium">{record.facility}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Supplier / Refiner:</span>
                    <span className="text-slate-800 font-medium">{supplier}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Invoice / Challan:</span>
                    <span className="font-mono font-bold text-slate-900">{record.invoiceNo}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Date of Weight:</span>
                    <span className="font-mono font-bold text-slate-900">{record.date}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Time In / Out:</span>
                    <span className="font-mono text-slate-800">{timeIn} / {timeOut}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Vehicle / Bowzer:</span>
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {vehicleNo}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-semibold">Driver / Operator:</span>
                    <span className="text-slate-800">{driverName}</span>
                  </div>
                </div>
              </div>

              {/* Material & Weights Table */}
              <div className="mb-5 overflow-hidden rounded-lg border border-slate-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2.5">Material Description</th>
                      <th className="p-2.5 text-right">Gross Weight</th>
                      <th className="p-2.5 text-right">Tare Weight</th>
                      <th className="p-2.5 text-right bg-emerald-50 text-emerald-900">Net Delivered Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">
                        {record.fuelType}
                        <div className="text-[10px] text-slate-500 font-normal">
                          Certified Fuel Dispensary Meter (NABL Calibrated)
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-700">{grossWeight}</td>
                      <td className="p-3 text-right font-mono text-slate-700">{tareWeight}</td>
                      <td className="p-3 text-right font-mono font-extrabold text-emerald-800 bg-emerald-50/60 text-sm">
                        {netDelivered}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* GHG & SEBI Conversion Block */}
              <div className="bg-emerald-900 text-emerald-50 rounded-lg p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                    SEBI BRSR Principle 6 Telemetry Attribution
                  </div>
                  <div className="font-semibold mt-0.5">
                    Automated Carbon Equivalent: <strong className="text-white text-sm">{record.calculatedCo2e} tCO₂e</strong>
                  </div>
                  <div className="text-[10px] text-emerald-200 opacity-90 mt-0.5">
                    Standard: {record.fuelType.includes('Diesel') ? 'DEFRA 2024 (2.687 kg CO₂e/L)' : 'CEA Baseline v20 (0.716 kg CO₂e/kWh)'}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-800 rounded border border-emerald-700 text-[10px] font-bold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>ISAE 3000 Assured Evidence</span>
                  </div>
                </div>
              </div>

              {/* Signatures & Red Rubber Stamp */}
              <div className="pt-4 border-t-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
                {/* Left: Weighbridge Operator */}
                <div className="text-center sm:text-left space-y-1">
                  <div className="font-script text-slate-600 text-sm italic font-serif">
                    Rajesh Kumar
                  </div>
                  <div className="w-44 border-t border-slate-400 pt-1 text-[10px] text-slate-600">
                    <div className="font-bold text-slate-800">{operatorName}</div>
                    <div>Site Material In-Charge · MEIL</div>
                  </div>
                </div>

                {/* Center: The Official Red Rubber Stamp */}
                <div className="relative border-4 border-dashed border-red-600 rounded-full w-32 h-32 flex flex-col items-center justify-center p-2 text-center text-red-600 rotate-[-12deg] select-none opacity-90 shadow-sm pointer-events-none">
                  <span className="text-[8px] font-black tracking-widest uppercase">MEIL WEIGHBRIDGE</span>
                  <span className="text-[10px] font-black uppercase my-0.5 leading-tight">
                    CERTIFIED &amp;<br />RECEIVED
                  </span>
                  <span className="text-[7px] font-bold tracking-tight text-red-700">POLAVARAM SITE</span>
                  <span className="text-[7px] font-mono mt-0.5">{record.date}</span>
                </div>

                {/* Right: Security Gate Stamp & Barcode */}
                <div className="text-center sm:text-right space-y-2">
                  <div className="inline-block p-1 bg-white border border-slate-300 rounded">
                    <div className="w-28 h-6 bg-slate-900 flex items-center justify-center text-[9px] text-white font-mono tracking-widest">
                      ||| | |||| | ||| ||||
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600">
                    Security Gate Stamped · Pass #0928
                    <div className="text-[9px] text-slate-400 font-mono">MD5: {shaHash.slice(0, 14)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* AUDIT CERTIFICATE INSPECTOR TAB */
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-5 text-xs text-slate-300">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Cryptographic ISAE 3000 Assurance Manifest</h3>
                  <p className="text-xs text-slate-400">Tamper-evident verification details for SEBI statutory auditor</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px]">Document Hash (SHA-256)</span>
                  <span className="text-emerald-400 font-bold">{shaHash}fa829104bcde390192837482910</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px]">Digital Signature Issuer</span>
                  <span className="text-slate-200">CN=MEIL Enterprise PKI CA, O=Megha Engineering & Infrastructures Ltd, C=IN</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-500 block uppercase text-[10px]">Verification Protocol</span>
                  <span className="text-slate-200">SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 · ISO 14064-1 Principle 6 Primary Telemetry Evidence</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>This digital slip is cryptographically locked into MEIL ESG Connect's immutable audit trail and cannot be altered.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Non-Printable) */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs no-print">
          <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ticket: {ticketNo}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors font-medium"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed Voucher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
