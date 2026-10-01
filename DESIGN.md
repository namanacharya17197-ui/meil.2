# 🎨 MEIL ESG Connect — Enterprise Design System & UX Architecture

> **Design Paradigm:** *Industrial Precision, High-Density Telemetry & Statutory Authority*  
> **Target Screen Class:** Ultra-Wide Desktops, Enterprise Laptops, Field Site Tablets  
> **Compliance:** WCAG 2.1 Level AA Accessibility Standards

---

## 💎 Design Philosophy & Core Principles

MEIL operates some of the world's most demanding engineering feats—from the sub-zero high-altitude tunnels of Zojila to massive multi-stage lift irrigation pump houses. 

The design system of **MEIL ESG Connect** reflects this reality:
1. **Zero-Fluff Telemetry:** Every metric, emission fraction, and water flow rate is presented with clear unit labels ($tCO_2e$, $kL$, $kWh$) and audit provenance.
2. **Statutory High-Fidelity:** Visual cues distinguish between self-declared estimates and third-party assured metrics (ISAE 3000 stamp).
3. **GenZ Polish Meets Enterprise Rigor:** Fluid micro-interactions, dark glassmorphism, glowing status badges, and ultra-crisp tabular typography.

---

## 🎨 Color Palette & Design Tokens

```
  ┌─────────────────────────────────────────────────────────────┐
  │                   PRIMARY CORPORATE PALETTE                 │
  ├──────────────┬──────────────┬──────────────┬────────────────┤
  │ Obsidian     │ Slate Dark   │ Emerald Mint │ Electric Blue  │
  │ #0B1120      │ #0F172A      │ #10B981      │ #0284C7        │
  │ (Deep Canvas)│ (Card Surface│ (ESG / Green)│ (MEIL Brand)   │
  └──────────────┴──────────────┴──────────────┴────────────────┘
```

### Detailed Token Palette

| Token Name | Hex Code | Purpose & Application |
| :--- | :--- | :--- |
| `--canvas-bg` | `#080D1A` | Deepest root background layer |
| `--surface-card` | `#0F172A` | Elevated container, modal, and table row surfaces |
| `--border-subtle` | `#1E293B` | Structural grid borders and dividers |
| `--emerald-primary` | `#10B981` | Sustainable KPI highlights, approved status, positive trends |
| `--emerald-glow` | `rgba(16, 185, 129, 0.15)` | Active glow on audited cards and verified badges |
| `--amber-warning` | `#F59E0B` | Anomaly radar flags, pending review, variance > 15% |
| `--rose-danger` | `#F43F5E` | Audit rejection, statutory non-compliance, missing slips |
| `--cyan-accent` | `#06B6D4` | AI Copilot interactions and live real-time telemetry |
| `--meil-red` | `#DC2626` | Official MEIL corporate geometric logo mark |
| `--meil-navy` | `#1E3A8A` | Official MEIL wordmark primary blue |

---

## 🔤 Typography & Font Hierarchy

### Font Families
- **Primary Interface Font:** `Plus Jakarta Sans`, `Inter`, system-ui
- **Tabular & Telemetry Font:** `JetBrains Mono`, `Roboto Mono`, monospace (used for all numeric figures, carbon values, and timestamps to eliminate column jitter)

### Type Scale

| Style Level | Size / Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- |
| **Display H1** | 24px / 700 Bold | 32px | Executive Dashboard Headers & Hero Headlines |
| **Card Title H2** | 16px / 600 SemiBold | 24px | Section and Component Titles |
| **Metric Value** | 28px / 800 ExtraBold | 36px | Primary KPI Tile Numbers ($tCO_2e$, Intensity) |
| **Body Standard** | 13px / 400 Regular | 20px | Table cells, descriptions, form field values |
| **Micro Caption** | 11px / 600 SemiBold | 16px | SEBI BRSR badges, factor tags, audit status |

---

## 🧩 Key Component Specifications

### 1. Fixed Sticky Topbar
- **MEIL Brand Mark:** Official dual-tone vector insignia featuring the red geometric icon + dark navy corporate lettering.
- **Hierarchical Site Switcher:** Searchable dropdown supporting 25+ infrastructure sites with instant keyboard filtering.
- **Role Simulator Widget:** Live switch between 6 enterprise personas with color-coded role tags.

### 2. Collapsible 7-Section Sidebar
- Multi-section navigation with badge counters indicating pending approvals and active anomalies.
- Smooth hover animations and keyboard accessibility focus rings.

### 3. Signed Weighbridge Slip & Delivery Challan Modal
- **Photorealistic Industrial Voucher:** Designed to mirror actual physical weighbridge receipts used across Indian mega infrastructure sites.
- **Header:** MEIL Project Site Name, Gate Pass Number, Date/Time In & Out.
- **Telemetry Grid:** Gross Weight, Tare Weight, Net Delivered Quantity with units (Metric Tonnes / Litres).
- **Inspection Stamp:** Physical red vector verification stamp with certifying officer signature and QR code verification link.

### 4. Live ESG Analytics & Slider Computation Engine
- Interactive inputs for fuel liters, grid power kWh, and green energy PPA share.
- Instant reactive charts displaying recalculated Scope 1, 2, and 3 footprint before and after mitigation.

---

## 📱 Responsive & Ergonomic Layout

- **Desktop (>= 1280px):** Permanent sidebar with full multi-column dashboard, split-screen live preview, and docked AI copilot.
- **Laptop (1024px - 1279px):** Auto-collapsed icon sidebar with slide-over drawers.
- **Tablet / Mobile (< 1024px):** Bottom navigation or sheet drawer with touch-friendly button targets (>= 44px).
