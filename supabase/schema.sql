-- ==============================================================================
-- MEIL ESG CONNECT — ENTERPRISE DATABASE SCHEMA & SEED DATA (SUPABASE / POSTGRES)
-- Platform: SEBI BRSR Core, Scope 1/2/3 Accounting & Weighbridge Ingestion
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP TABLES (CLEAN SLATE IF RE-RUNNING)
DROP TABLE IF EXISTS public.anomalies CASCADE;
DROP TABLE IF EXISTS public.audit_trail CASCADE;
DROP TABLE IF EXISTS public.approvals CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.weighbridge_records CASCADE;
DROP TABLE IF EXISTS public.emission_factors CASCADE;
DROP TABLE IF EXISTS public.sites CASCADE;

-- 3. SITES TABLE (25+ Mega Infrastructure Projects)
CREATE TABLE public.sites (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    division TEXT NOT NULL,
    subsidiary TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status TEXT DEFAULT 'Submitted',
    scope1 NUMERIC DEFAULT 0,
    scope2 NUMERIC DEFAULT 0,
    scope3 NUMERIC DEFAULT 0,
    water_recycled_pct NUMERIC DEFAULT 0,
    turnover_cr NUMERIC DEFAULT 0,
    workforce_count INTEGER DEFAULT 0,
    ltifr NUMERIC DEFAULT 0,
    key_facility TEXT,
    completion_pct INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WEIGHBRIDGE RECORDS TABLE (Physical Vouchers & Gate Passes)
CREATE TABLE public.weighbridge_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    site_name TEXT NOT NULL,
    gate_pass_no TEXT NOT NULL,
    vehicle_no TEXT NOT NULL,
    material TEXT NOT NULL,
    gross_weight_mt NUMERIC NOT NULL,
    tare_weight_mt NUMERIC NOT NULL,
    net_quantity NUMERIC NOT NULL,
    unit TEXT DEFAULT 'Litres',
    scope1_tco2e NUMERIC NOT NULL,
    driver_name TEXT DEFAULT 'R. Narayana Reddy',
    inspection_officer TEXT DEFAULT 'NABL Quality Auditor',
    verified_status TEXT DEFAULT 'CERTIFIED_VERIFIED',
    voucher_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACTIVITY LOGS (Raw Ingestion / Quick-Entry Sheet)
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    cycle TEXT DEFAULT 'FY 2024-25',
    entry_date DATE DEFAULT CURRENT_DATE,
    fuel_type TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    calculated_co2e NUMERIC NOT NULL,
    facility TEXT,
    invoice_no TEXT,
    uploaded_file TEXT,
    status TEXT DEFAULT 'PENDING_APPROVAL',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPROVALS TABLE (Four-Eyes Review Workflow)
CREATE TABLE public.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    entity_name TEXT NOT NULL,
    cycle TEXT DEFAULT 'FY 2024-25',
    status TEXT DEFAULT 'Pending Review', -- 'Approved', 'Rejected', 'Pending Review', 'Clarification Requested'
    tier TEXT DEFAULT 'Tier-1 Review',
    scope1_tco2e NUMERIC DEFAULT 0,
    scope2_tco2e NUMERIC DEFAULT 0,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AUDIT TRAIL TABLE (Immutable Regulatory Ledger)
CREATE TABLE public.audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'APPROVE', 'REJECT', 'AUDIT'
    entity TEXT NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT DEFAULT '10.24.8.102',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ANOMALIES TABLE (Automated Detection Radar)
CREATE TABLE public.anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
    site_name TEXT NOT NULL,
    metric TEXT NOT NULL,
    variance_pct NUMERIC NOT NULL,
    previous_value NUMERIC NOT NULL,
    current_value NUMERIC NOT NULL,
    status TEXT DEFAULT 'FLAGGED', -- 'FLAGGED', 'UNDER_INVESTIGATION', 'RESOLVED'
    probable_cause TEXT,
    ai_explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EMISSION FACTORS MASTER (CEA, DEFRA, IPCC)
CREATE TABLE public.emission_factors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    factor_value NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    source TEXT NOT NULL,
    year TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES — OPEN READ & INSERT FOR PUBLISHABLE KEY
-- ==============================================================================
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighbridge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;

-- Permissive policies for client app access
CREATE POLICY "Public Read Sites" ON public.sites FOR SELECT USING (true);
CREATE POLICY "Public Upsert Sites" ON public.sites FOR ALL USING (true);

CREATE POLICY "Public Read Weighbridge" ON public.weighbridge_records FOR SELECT USING (true);
CREATE POLICY "Public Insert Weighbridge" ON public.weighbridge_records FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Activity" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Public Insert Activity" ON public.activity_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Approvals" ON public.approvals FOR SELECT USING (true);
CREATE POLICY "Public Update Approvals" ON public.approvals FOR ALL USING (true);

CREATE POLICY "Public Read Audit" ON public.audit_trail FOR SELECT USING (true);
CREATE POLICY "Public Insert Audit" ON public.audit_trail FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Anomalies" ON public.anomalies FOR SELECT USING (true);
CREATE POLICY "Public Upsert Anomalies" ON public.anomalies FOR ALL USING (true);

CREATE POLICY "Public Read Factors" ON public.emission_factors FOR SELECT USING (true);
CREATE POLICY "Public Upsert Factors" ON public.emission_factors FOR ALL USING (true);

-- ==============================================================================
-- 11. INDEXES FOR HIGH-THROUGHPUT QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_weighbridge_site ON public.weighbridge_records(site_id);
CREATE INDEX IF NOT EXISTS idx_weighbridge_gate ON public.weighbridge_records(gate_pass_no);
CREATE INDEX IF NOT EXISTS idx_activity_site ON public.activity_logs(site_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approvals(status);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_trail(timestamp DESC);

-- ==============================================================================
-- 12. SEED DATA: 25+ MEIL INFRASTRUCTURE SITES
-- ==============================================================================
INSERT INTO public.sites (id, code, name, division, subsidiary, state, country, lat, lng, status, scope1, scope2, scope3, water_recycled_pct, turnover_cr, workforce_count, ltifr, key_facility, completion_pct) VALUES
('site-042', 'Site #042', 'Polavaram Multi-Purpose Project', 'Hydro & Irrigation', 'Megha Hydro Infrastructure Ltd', 'Andhra Pradesh', 'India', 17.25, 81.65, 'In Review', 24500, 8200, 88400, 72.4, 4250, 8400, 0.12, 'Earth-cum-Rock Fill Dam & Spillway Reach', 82),
('site-108', 'Site #108', 'Zojila Strategic Tunnel Project', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Jammu & Kashmir / Ladakh', 'India', 34.29, 75.48, 'Submitted', 18950, 5400, 92300, 61.8, 3680, 4200, 0.24, '14.15 km High-Altitude Bi-Directional Tunnel', 68),
('site-014', 'Site #014', 'Kaleshwaram Lift Irrigation (Package 8 & 10)', 'Hydro & Irrigation', 'Megha Engineering Ltd', 'Telangana', 'India', 18.82, 79.91, 'Approved', 31200, 14200, 114500, 78.5, 5100, 6800, 0.08, 'World Largest Multi-Stage Underground Pump House', 94),
('site-INT-09', 'Site #INT-09', 'Mongol Modern Refinery EPC Project', 'Hydrocarbons & Energy', 'MEIL Global Energy BV', 'Dornogovi', 'Mongolia', 44.91, 109.58, 'In Review', 28400, 11900, 145000, 84.1, 6200, 3100, 0.18, '1.5 MMTPA Green-Field Crude Processing Facility', 54),
('site-077', 'Site #077', 'Char Dham All-Weather Highway (Silkyara Reach)', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Uttarakhand', 'India', 30.58, 78.32, 'Submitted', 11200, 3100, 48200, 58.2, 1850, 2400, 0.32, 'Himalayan Slope Stabilization & 4-Lane Pavement', 76),
('site-210', 'Site #210', 'Megha Gas City Gas Distribution (Belagavi GA)', 'Hydrocarbons & Energy', 'Megha City Gas Distribution Ltd', 'Karnataka', 'India', 15.85, 74.50, 'Approved', 6800, 2100, 22400, 88.0, 950, 850, 0.00, 'Steel Pipeline Grid & Mother CNG Station', 89),
('site-033', 'Site #033', 'Kundah Pumped Storage Hydro-Electric Project', 'Hydro & Irrigation', 'Megha Hydro Infrastructure Ltd', 'Tamil Nadu', 'India', 11.28, 76.62, 'Submitted', 14500, 4900, 63100, 71.3, 2400, 3100, 0.15, '4x125 MW Underground Cavern Powerhouse', 61),
('site-155', 'Site #155', 'Bhadla Phase-IV 500MW Ultra Mega Solar Park', 'Renewables & Power', 'MEIL Green Power Ltd', 'Rajasthan', 'India', 27.53, 71.91, 'Approved', 1800, 450, 19200, 94.6, 1200, 620, 0.00, 'Single-Axis Tracking PV Arrays & 400kV Substation', 100),
('site-088', 'Site #088', 'Western Dedicated Freight Corridor (Package CTP-11)', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Gujarat', 'India', 23.02, 72.57, 'Approved', 21400, 7800, 89000, 65.4, 3100, 4900, 0.11, 'Heavy Haul Track Laying & OHE Electrification', 96),
('site-062', 'Site #062', 'Upper Bhadra Lift Irrigation Scheme', 'Hydro & Irrigation', 'Megha Engineering Ltd', 'Karnataka', 'India', 13.92, 75.63, 'In Review', 16700, 6300, 54200, 69.8, 2900, 3800, 0.14, 'Canal Aqueduct & High-Discharge Pump Turbines', 73),
('site-302', 'Site #302', 'Drilling Rig Manufacturing & Assembly Plant', 'Manufacturing & DRI', 'Drillmec India Pvt Ltd', 'Telangana (Kandi)', 'India', 17.55, 78.08, 'Approved', 4200, 3900, 18400, 91.2, 1600, 1400, 0.05, 'API Spec Automated Deep Oil & Gas Rigs Yard', 100),
('site-224', 'Site #224', 'Krishna Drinking Water Supply Phase-III', 'Drinking Water & Smart Cities', 'Megha Engineering Ltd', 'Telangana', 'India', 16.51, 80.64, 'Approved', 5900, 8400, 24100, 82.3, 1400, 1100, 0.00, 'Water Treatment Plant (WTP) & Gravity Main Canal', 98),
('site-119', 'Site #119', 'Thane-Borivali Twin Tunnel Project', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Maharashtra', 'India', 19.21, 72.97, 'Submitted', 15200, 6100, 98400, 63.5, 4800, 2900, 0.19, '11.8 km Coastal Highway Tunnel using Mega TBMs', 32),
('site-051', 'Site #051', 'Palamuru Ranga Reddy Lift Irrigation', 'Hydro & Irrigation', 'Megha Engineering Ltd', 'Telangana', 'India', 16.74, 78.00, 'In Review', 22100, 9800, 76200, 74.0, 3800, 5200, 0.13, '5-Stage Lift Pumping & Reservoir Complex', 79),
('site-INT-14', 'Site #INT-14', 'Amman-Aqaba Water Desalination Pipeline EPC', 'Drinking Water & Smart Cities', 'MEIL Global Energy BV', 'Amman', 'Jordan', 30.52, 35.80, 'In Review', 19400, 12500, 112000, 95.0, 5400, 1900, 0.09, '450 km Brackish Sea-Water Conveyance Conduit', 41),
('site-188', 'Site #188', 'Rewa 250MW Floating Solar Array', 'Renewables & Power', 'MEIL Green Power Ltd', 'Madhya Pradesh', 'India', 24.53, 81.30, 'Approved', 850, 320, 12400, 96.2, 780, 340, 0.00, 'HDPE Float Modular Arrays on Reservoir Water Surface', 85);

-- ==============================================================================
-- 13. SEED DATA: EMISSION FACTORS MASTER (CEA v20, DEFRA 2024, IPCC)
-- ==============================================================================
INSERT INTO public.emission_factors (id, name, category, factor_value, unit, source, year) VALUES
('ef-01', 'High-Speed Diesel (HSD) - Mobile Heavy Fleet', 'Fuel & Combustion (Scope 1)', 2.68787, 'kg CO2e / Litre', 'DEFRA UK Government GHG Factors', '2024'),
('ef-02', 'Light Diesel Oil (LDO) - Standby Stationary DGs', 'Fuel & Combustion (Scope 1)', 2.86830, 'kg CO2e / Litre', 'IPCC AR6 Guidelines', '2024'),
('ef-03', 'Natural Gas (PNG / City Gas Distribution)', 'Fuel & Combustion (Scope 1)', 2.02819, 'kg CO2e / m3', 'DEFRA 2024 Fuel Factor', '2024'),
('ef-04', 'Indian National Grid Electricity (Baseline v20)', 'Purchased Power (Scope 2)', 0.71600, 'kg CO2e / kWh', 'Central Electricity Authority (CEA)', 'FY 2023-24'),
('ef-05', 'Green Energy Open Access Solar / Wind PPA', 'Purchased Power (Scope 2)', 0.00000, 'kg CO2e / kWh', 'GHG Protocol Scope 2 Guidance', '2024'),
('ef-06', 'Portland Slag Cement (PSC) - 45% Slag Blend', 'Raw Materials (Scope 3 Cat 1)', 580.00, 'kg CO2e / Metric Tonne', 'CMA & NABL Certified Lab', '2024'),
('ef-07', 'Primary Structural TMT Steel Rebar (Fe 550D)', 'Raw Materials (Scope 3 Cat 1)', 1840.00, 'kg CO2e / Metric Tonne', 'WorldSteel Association EPD', '2024'),
('ef-08', 'Crushed Aggregate / M-Sand Mass Concrete', 'Raw Materials (Scope 3 Cat 1)', 8.20000, 'kg CO2e / Metric Tonne', 'Indian Green Building Council', '2024');

-- ==============================================================================
-- 14. SEED DATA: INITIAL WEIGHBRIDGE RECORDS & GATE PASSES
-- ==============================================================================
INSERT INTO public.weighbridge_records (site_id, site_name, gate_pass_no, vehicle_no, material, gross_weight_mt, tare_weight_mt, net_quantity, unit, scope1_tco2e, driver_name, inspection_officer, verified_status) VALUES
('site-042', 'Polavaram Multi-Purpose Project', 'MEIL-WB-2026-9042', 'AP-09-TG-8841', 'High-Speed Diesel (HSD)', 38.5, 14.2, 28400, 'Litres', 76.33, 'R. Narayana Reddy', 'NABL Certified Quality Lead', 'CERTIFIED_VERIFIED'),
('site-108', 'Zojila Strategic Tunnel Project', 'MEIL-WB-2026-9108', 'JK-01-AB-4492', 'Light Diesel Oil (Stationary DG)', 42.0, 16.5, 29800, 'Litres', 85.47, 'Ghulam Mohammad Mir', 'Border Roads Wing Inspector', 'CERTIFIED_VERIFIED'),
('site-014', 'Kaleshwaram Lift Irrigation', 'MEIL-WB-2026-9014', 'TS-03-UB-1120', 'High-Speed Diesel (HSD)', 36.2, 13.8, 26200, 'Litres', 70.42, 'K. Sammaiah', 'Irrigation CAD Quality Auditor', 'CERTIFIED_VERIFIED');

-- ==============================================================================
-- 15. SEED DATA: INITIAL FOUR-EYES APPROVAL ITEMS
-- ==============================================================================
INSERT INTO public.approvals (site_id, entity_name, cycle, status, tier, scope1_tco2e, scope2_tco2e, reviewer_notes) VALUES
('site-042', 'Polavaram Project Site #042', 'FY 2024-25', 'Pending Review', 'Tier-1 Review', 24500, 8200, 'Fuel tickets verified against IOCL delivery notes. Awaiting concrete mix design confirmation.'),
('site-108', 'Zojila Tunnel Site #108', 'FY 2024-25', 'Pending Review', 'Tier-2 Approval', 18950, 5400, 'Standby DG runtimes increased due to high altitude power line icing. Verified by Project Director.'),
('site-014', 'Kaleshwaram Lift Site #014', 'FY 2024-25', 'Approved', 'Final Sign-off', 31200, 14200, 'All stage-1 pump house meters cross-calibrated. Ready for ISAE 3000 assurance sample.');

-- ==============================================================================
-- 16. SEED DATA: INITIAL AUDIT LEDGER
-- ==============================================================================
INSERT INTO public.audit_trail (user_name, user_role, action, entity, field_name, old_value, new_value, ip_address) VALUES
('K. V. Rao', 'Group ESG Admin', 'CREATE', 'Global System', 'Reporting Cycle Baseline', 'FY 2023-24', 'FY 2024-25 (Active)', '10.24.8.102'),
('P. Srinivas', 'Subsidiary Approver', 'APPROVE', 'Site #014 • Kaleshwaram Pump House', 'Scope 1 & 2 Annual Consolidation', 'Draft', 'Tier-2 Approved', '10.24.8.115'),
('M. Ramesh', 'Project Data Entry User', 'CREATE', 'Site #042 • Polavaram Project', 'Weighbridge Voucher Gate Pass', 'None', 'Ticket #MEIL-WB-2026-9042 (28,400 L)', '192.168.42.18');
