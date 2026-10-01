import React, { useState } from 'react';
import { useEsg } from '../../context/EsgContext';
import { UserRole } from '../../types/esg';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useEsg();

  // Role mapping helper
  const roleMap: Record<string, UserRole> = {
    group_esg_admin: 'Group ESG Admin',
    subsidiary_approver: 'Subsidiary Approver',
    bu_reviewer: 'Business Unit Reviewer',
    project_data_entry: 'Project Data Entry User',
    independent_auditor: 'Independent Auditor (ISAE 3000)',
    board_viewer: 'Board Viewer',
  };

  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('group_esg_admin');
  const [email, setEmail] = useState<string>('cso@meilgroup.com');
  const [password, setPassword] = useState<string>('meil@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Status & Alert states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [btnText, setBtnText] = useState<string>('Authenticate Gateway');
  const [btnIcon, setBtnIcon] = useState<string>('lock_open');
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'info' | 'warning' | 'success';
    message: string;
    icon: string;
  }>({
    visible: false,
    type: 'info',
    message: '',
    icon: 'info',
  });

  if (!isLoginModalOpen) return null;

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedRoleKey(val);
    if (val === 'group_esg_admin') {
      setEmail('cso@meilgroup.com');
    } else if (val === 'subsidiary_approver') {
      setEmail('approver@meilinfra.com');
    } else if (val === 'bu_reviewer') {
      setEmail('reviewer@meilgroup.com');
    } else if (val === 'project_data_entry') {
      setEmail('site.engineer@meil.in');
    } else if (val === 'independent_auditor') {
      setEmail('auditor@kpmg-assurance.com');
    } else if (val === 'board_viewer') {
      setEmail('board@meil.in');
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setBtnText('Verifying Gateway Identity...');
    setAlert({ visible: false, type: 'info', message: '', icon: 'info' });

    setTimeout(() => {
      setIsLoading(false);

      if (!email.includes('@meilgroup.com') && !email.includes('@meil.in') && !email.includes('@kpmg-assurance.com') && !email.includes('@meilinfra.com')) {
        setBtnText('Authenticate Gateway');
        setAlert({
          visible: true,
          type: 'warning',
          icon: 'warning',
          message: 'Access restricted: Please provide an authorized @meilgroup.com directory email address.',
        });
      } else {
        setBtnText('Access Granted');
        setBtnIcon('task_alt');
        setAlert({
          visible: true,
          type: 'success',
          icon: 'task_alt',
          message: 'Cryptographic handshake complete. Redirecting to Executive ESG Console...',
        });

        const targetRole = roleMap[selectedRoleKey] || 'Group ESG Admin';
        setTimeout(() => {
          login(email, password, targetRole);
        }, 800);
      }
    }, 1000);
  };

  const triggerSSO = () => {
    setAlert({
      visible: true,
      type: 'info',
      icon: 'sync',
      message: 'Initiating SAML 2.0 / OAuth redirect via Microsoft Entra Tenant ID (MEIL-CORP)... Authenticating as Group ESG Admin...',
    });
    setTimeout(() => {
      login('cso@meilgroup.com', 'meil@2026', 'Group ESG Admin');
    }, 1200);
  };

  const triggerForgotPassword = () => {
    setAlert({
      visible: true,
      type: 'info',
      icon: 'support_agent',
      message: 'Credential reset requests require IT Security NOC approval. Contact noc-support@meilgroup.com or your compliance officer.',
    });
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B1A28] font-sans text-[#EDEDED] min-h-screen selection:bg-[#9B1B30] selection:text-white animate-in fade-in duration-200">
      {/* Full Background Image with Cinematic Dark Navy Blur & Vignette Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 filter blur-md opacity-35"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqNou2XKXgR_Hq0gtA274PY4DK3priWc6xG3T-kZJ7JVR8ilYr7DpkwDMADag1DJCOf3bO96SUmzI3g0bH8530QvHYM1AfLI5o5m5Bg2Es8pu9ADqsaGbNYf9JelUrFcHxQrumJmXtezu17SLLdyapzefHI6WCeLQWSp1tzyFXSI7ycEcBtoTpGwO5WFDumYPsMvLakxqrOZIOkP5QzcAYJCwOEqzkGRC8YBGUrQ9Fi9kCNhji4gXWhPp5PRoq59zfiik')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A28]/95 via-[#102A43]/85 to-[#0B1A28]/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,_rgba(155,27,48,0.12),_transparent_60%)]"></div>
      </div>

      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between p-4 md:p-8 lg:p-10">
        <div className="flex flex-col w-full max-w-[1560px] mx-auto">
          {/* Top Floating Exit / Return Bar */}
          <div className="w-full flex justify-end pb-3">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#102A43]/80 hover:bg-[#102A43] text-slate-300 hover:text-white border border-[#486581]/30 transition-colors text-xs font-mono cursor-pointer shadow-lg"
              title="Return to Public Landing Page"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Public Showcase</span>
            </button>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch min-h-[calc(100vh-6rem)]">
            {/* LEFT PANEL: Security Authentication Gateway */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
              {/* Top Branding & Institutional Security Pill */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3.5">
                  {/* MEIL Official Brand Logo Badge */}
                  <div className="h-12 px-3 py-1 rounded-md bg-[#0B1A28]/90 border border-[#486581]/28 shadow-lg flex items-center justify-center shrink-0">
                    <img
                      alt="MEIL Group Logo"
                      className="h-8 w-auto object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtAtktctuoAgV1k6a8QK3NYJnl3dNQX2rzQLed47kw5jGVqUGroZK8_-_uSVYlxFGvWv5ZxwMpM2W_ENQuXHvjHjCjEpFEREQAORU-uSH0PX1_owd4nJxPcHKIryAR-u77AZn-bvs92cvEcEcgsT6F9sqSd0pHXnsksCcutRLitL7cunXfkhQYLnfXupc7jR42AGuUmt7iY7plXmsql1yK3nXslDD2yNeXQR2a9eqYKhr-ly98gfAUsg0XvDlbSmSycBo"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-white tracking-wider leading-none">
                      MEIL GROUP
                    </span>
                    <span className="font-mono text-xs text-[#9B1B30] font-semibold tracking-widest uppercase mt-1">
                      Enterprise Portal
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#102A43]/70 border border-[#486581]/30 text-[11px] font-mono text-[#BCCCDC]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SEBI BRSR Core</span>
                </div>
              </div>

              {/* Main Login Surface (Glassmorphic Container) */}
              <div className="w-full max-w-lg mx-auto my-auto py-2">
                <div className="bg-[#102A43]/75 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-[#486581]/28 shadow-2xl">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                    MEIL ESG Gateway
                  </h1>
                  <p className="text-sm text-[#BCCCDC] mb-5 leading-relaxed">
                    Secure telemetry access to statutory reporting, grid offset metrics, and governance operations across India.
                  </p>

                  {/* Quick Demo Pre-fill Notice Pill */}
                  <div className="mb-4 p-2.5 rounded-lg bg-[#0B1A28]/80 border border-[#486581]/30 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#BCCCDC]">
                      Demo Acc: <strong className="text-white">cso@meilgroup.com</strong> / <strong className="text-white">meil@2026</strong>
                    </span>
                    <span className="text-[#9B1B30] font-semibold text-[11px]">1-Click Ready</span>
                  </div>

                  {/* Interactive Authentication Form */}
                  <form className="space-y-4" id="loginForm" onSubmit={handleAuthSubmit}>
                    {/* Operational Role Select */}
                    <div className="space-y-1.5 mb-2">
                      <label className="block font-mono text-xs text-[#EDEDED]" htmlFor="operationalRole">
                        Select Active Operational Role
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="operationalRole"
                          value={selectedRoleKey}
                          onChange={handleRoleChange}
                          className="w-full h-11 pl-3.5 pr-10 bg-[#0B1A28]/80 text-[#EDEDED] text-sm rounded-lg border border-[#486581]/28 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#9B1B30] focus:border-[#9B1B30] transition appearance-none cursor-pointer"
                        >
                          <option className="bg-[#0B1A28] text-white" value="group_esg_admin">
                            Group ESG Admin (Full Governance &amp; SEBI Submission)
                          </option>
                          <option className="bg-[#0B1A28] text-white" value="subsidiary_approver">
                            Subsidiary Approver (Division Level Sign-Off)
                          </option>
                          <option className="bg-[#0B1A28] text-white" value="bu_reviewer">
                            Business Unit Reviewer (Data Quality Check)
                          </option>
                          <option className="bg-[#0B1A28] text-white" value="project_data_entry">
                            Project Data Entry User (Site Quick-Entry)
                          </option>
                          <option className="bg-[#0B1A28] text-white" value="independent_auditor">
                            Independent Auditor (ISAE 3000 Assurance)
                          </option>
                          <option className="bg-[#0B1A28] text-white" value="board_viewer">
                            Board Viewer (Executive Read-Only)
                          </option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 text-[#486581] text-lg pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="block font-mono text-xs text-[#EDEDED]" htmlFor="corporateEmail">
                        Corporate Identity (MEIL Domain)
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-[#486581] text-lg pointer-events-none transition-colors">
                          alternate_email
                        </span>
                        <input
                          autoComplete="username"
                          className="w-full h-11 pl-11 pr-4 bg-[#0B1A28]/80 text-white text-sm rounded-lg border border-[#486581]/28 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#9B1B30] focus:border-[#9B1B30] transition placeholder:text-[#486581]/70"
                          id="corporateEmail"
                          placeholder="name@meilgroup.com"
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block font-mono text-xs text-[#EDEDED]" htmlFor="corporatePassword">
                          Access Key / Password
                        </label>
                        <button
                          className="font-mono text-xs text-[#9B1B30] hover:text-[#C32B45] transition-colors cursor-pointer"
                          onClick={triggerForgotPassword}
                          type="button"
                        >
                          Reset Credential?
                        </button>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-[#486581] text-lg pointer-events-none transition-colors">
                          lock_outline
                        </span>
                        <input
                          autoComplete="current-password"
                          className="w-full h-11 pl-11 pr-11 bg-[#0B1A28]/80 text-white text-sm rounded-lg border border-[#486581]/28 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#9B1B30] focus:border-[#9B1B30] transition placeholder:text-[#486581]/70"
                          id="corporatePassword"
                          placeholder="••••••••••••"
                          required
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          aria-label="Toggle password visibility"
                          className="absolute right-3 text-[#486581] hover:text-white transition-colors p-1 flex items-center cursor-pointer"
                          id="togglePasswordBtn"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-lg" id="eyeIcon">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Utilities Bar: Remember + Hardware Token State */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#0B1A28] border-[#486581]/28 text-[#9B1B30] focus:ring-[#9B1B30] focus:ring-offset-0 cursor-pointer accent-[#9B1B30]"
                          id="rememberMe"
                          type="checkbox"
                        />
                        <span className="text-xs text-[#BCCCDC]">Keep workspace session active</span>
                      </label>
                      <div className="flex items-center gap-1.5 text-[#486581] font-mono text-xs">
                        <span className="material-symbols-outlined text-sm text-[#9B1B30]">verified_user</span>
                        <span>FIPS 140-2</span>
                      </div>
                    </div>

                    {/* Alert notification box for validation / feedback */}
                    {alert.visible && (
                      <div
                        className={`p-3 rounded-lg border transition duration-200 ${
                          alert.type === 'warning'
                            ? 'bg-[#9B1B30]/20 border-[#9B1B30]/50 text-white'
                            : 'bg-[#102A43] border-[#486581]/28 text-white'
                        }`}
                        id="authAlert"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`material-symbols-outlined text-lg shrink-0 ${
                              alert.type === 'warning' ? 'text-[#9B1B30]' : 'text-emerald-400'
                            }`}
                          >
                            {alert.icon}
                          </span>
                          <p className="text-xs text-[#EDEDED] font-medium">{alert.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Primary Action CTA (MEIL Red #9B1B30) */}
                    <button
                      className="w-full h-12 bg-[#9B1B30] hover:bg-[#801627] text-white font-semibold text-sm rounded-lg shadow-lg hover:shadow-xl hover:shadow-[#9B1B30]/30 transition-all duration-200 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-80"
                      disabled={isLoading}
                      id="submitBtn"
                      type="submit"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              d="M4 12a8 8 0 018-8v8H4z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <span>{btnText}</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">{btnIcon}</span>
                          <span>{btnText}</span>
                        </>
                      )}
                    </button>

                    {/* SSO Partition */}
                    <div className="relative py-2.5 flex items-center justify-center">
                      <div className="w-full bg-[#486581]/30 h-[1px]"></div>
                      <span className="absolute bg-[#102A43] px-3 font-mono text-xs text-[#486581] uppercase tracking-wider">
                        Enterprise Federation
                      </span>
                    </div>

                    {/* Microsoft Entra ID Button */}
                    <button
                      className="w-full h-11 bg-[#0B1A28]/80 hover:bg-[#0B1A28] text-white font-medium text-sm rounded-lg border border-[#486581]/28 shadow-sm hover:border-[#486581] transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
                      onClick={triggerSSO}
                      type="button"
                    >
                      <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                        <div className="bg-[#f25022] rounded-[1px]"></div>
                        <div className="bg-[#7fba00] rounded-[1px]"></div>
                        <div className="bg-[#00a4ef] rounded-[1px]"></div>
                        <div className="bg-[#ffb900] rounded-[1px]"></div>
                      </div>
                      <span>Sign in with Microsoft Entra ID</span>
                    </button>
                  </form>

                  {/* Cryptographic Assurance Footer within Card */}
                  <div className="mt-6 pt-4 border-t border-[#486581]/28 flex items-center justify-between text-[#486581] font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#9B1B30]">encrypted</span>
                      <span>TLS 1.3 End-to-End</span>
                    </div>
                    <span>ISO/IEC 27001 Certified</span>
                  </div>
                </div>
              </div>

              {/* Legal and Regulatory Disclaimers */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#486581] text-xs">
                <p className="text-center sm:text-left">
                  © 2026 Megha Engineering &amp; Infrastructures Ltd (MEIL). Audited under SEBI BRSR Core.
                </p>
                <div className="flex items-center gap-4 shrink-0 font-medium">
                  <a className="hover:text-white transition-colors" href="#hero">
                    Compliance Policy
                  </a>
                  <a className="hover:text-white transition-colors" href="#hero">
                    Assurance Terms
                  </a>
                  <a className="hover:text-white transition-colors" href="#hero">
                    SOC-2 Status
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Infrastructure Showcase & Real-Time ESG Visuals */}
            <div className="hidden lg:col-span-6 xl:col-span-7 lg:flex flex-col justify-between p-6 xl:p-8 relative rounded-2xl overflow-hidden border border-[#486581]/28 shadow-2xl bg-[#0B1A28]/60 backdrop-blur-md">
              {/* Background Infrastructure Photo Overlay with Subtle Blur and Dark Navy Gradient */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBuut1Zo1l8ahmTFbvN3HcZC13NfMh8OhHQPkR2dNNKsI65M5Lf1PTAW_8cDEt5qG9kDqSrVpDkM8EL-twG1xlI6lNFnBpZ0D83_KLnXXTNCmkfxlfYVWr9Ep0qfWfEpCbX0hcrQSC3D6DMGj5pzUQOmqlST1L19vnyYc4oDA4B0FwCeX0vi8xTTuF21VopwZ-bR3ytwV2uO7pb5EbxlnL7CDO1KpkUCPGM4wmqw_qJ4dEpMW-MLmygmbwsQEMAcYbbITE')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A28] via-[#102A43]/75 to-[#0B1A28]/40 pointer-events-none"></div>

              {/* Floating Live Telemetry HUD Bar */}
              <div className="relative z-10 flex items-center justify-between bg-[#102A43]/85 backdrop-blur-md px-5 py-3.5 rounded-xl border border-[#486581]/28 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#9B1B30] text-2xl">bolt</span>
                  <div>
                    <div className="font-mono text-xs text-[#486581] tracking-wider uppercase">
                      Live Transmission Grid
                    </div>
                    <div className="text-sm font-semibold text-white">
                      14.8 GW Clean Yield • Northern Corridor
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden xl:block">
                    <div className="font-mono text-xs text-[#9B1B30] font-semibold">OFFSET VERIFIED</div>
                    <div className="font-mono text-xs text-[#EDEDED]">3.8M tCO₂e YTD</div>
                  </div>
                  <div className="h-8 w-px bg-[#486581]/28 hidden xl:block"></div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0B1A28]/80 border border-[#486581]/28 rounded-full shadow-sm">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#9B1B30] animate-pulse"></span>
                    <span className="font-mono text-xs text-[#EDEDED] font-medium">Telemetry Online</span>
                  </div>
                </div>
              </div>

              {/* Center Data Overlay Graphic (Inline Micro Visualizer) */}
              <div className="relative z-10 my-auto py-10 flex flex-col items-end">
                <div className="p-4 rounded-xl bg-[#102A43]/85 backdrop-blur-md border border-[#486581]/28 shadow-xl max-w-xs w-full space-y-3">
                  <div className="flex justify-between items-center text-white text-xs font-medium">
                    <span>Hydro &amp; Solar Flow Index</span>
                    <span className="text-[#EDEDED] font-semibold font-mono bg-[#9B1B30]/30 border border-[#9B1B30]/40 px-2 py-0.5 rounded">
                      +18.4% YoY
                    </span>
                  </div>
                  {/* Micro SVG sparkline styled with brand accent */}
                  <svg
                    className="w-full h-12 text-[#9B1B30]"
                    fill="none"
                    viewBox="0 0 200 40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 32L24 28L52 35L80 18L110 24L140 10L170 14L200 4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    ></path>
                    <path
                      d="M0 32L24 28L52 35L80 18L110 24L140 10L170 14L200 4V40H0Z"
                      fill="currentColor"
                      fillOpacity="0.18"
                    ></path>
                  </svg>
                  <div className="flex justify-between font-mono text-xs text-[#486581]">
                    <span>Western Grid Hub</span>
                    <span className="text-[#EDEDED]">99.8% Stored Uptime</span>
                  </div>
                </div>
              </div>

              {/* Bottom Executive Glassmorphic Feature Deck */}
              <div className="relative z-10 bg-[#102A43]/90 backdrop-blur-lg rounded-xl p-6 xl:p-8 border border-[#486581]/28 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#9B1B30]">
                    Unified Sustainable Infrastructure
                  </span>
                  <span className="font-mono text-xs text-[#486581]">
                    PORTFOLIO ID: IND-84-MEIL
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  One Gateway. Total Institutional Clarity.
                </h2>
                <p className="text-xs sm:text-sm text-[#BCCCDC] mb-6 max-w-xl leading-relaxed">
                  Consolidated operational metrics, cross-sector carbon lifecycle calculations, and SEBI BRSR compliance records deployed across major engineering concessions in water, high-voltage transmission, and clean mobility.
                </p>
                {/* Dynamic Indicator Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#0B1A28]/85 border border-[#486581]/28 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="material-symbols-outlined text-[#9B1B30] text-lg">bar_chart</span>
                      <span className="text-xs font-semibold text-white">ESG Registry</span>
                    </div>
                    <span className="font-mono text-xs text-[#486581]">FY 2025-26 Live</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0B1A28]/85 border border-[#486581]/28 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="material-symbols-outlined text-[#486581] text-lg">verified</span>
                      <span className="text-xs font-semibold text-white">Governance</span>
                    </div>
                    <span className="font-mono text-xs text-[#EDEDED]">BRSR Core Audited</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0B1A28]/85 border border-[#486581]/28 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="material-symbols-outlined text-[#9B1B30] text-lg">
                        energy_savings_leaf
                      </span>
                      <span className="text-xs font-semibold text-white">Decarbonization</span>
                    </div>
                    <span className="font-mono text-xs text-[#9B1B30] font-semibold">84 Active Assets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
