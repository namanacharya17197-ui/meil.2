-- ==============================================================================
-- MEIL ESG CONNECT — ENTERPRISE DATABASE SCHEMA & MIGRATION SCRIPT (POSTGRESQL / SUPABASE)
-- Multi-Tier Hierarchy: Groups -> Companies -> Business Units -> ~300 Project Sites
-- Scope 1, 2, 3 Emissions Log, Evidence Attachments, and Immutable Audit Trails
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING STRUCTURES FOR CLEAN MIGRATION
DROP VIEW IF EXISTS public.mv_group_emissions_rollup CASCADE;
DROP VIEW IF EXISTS public.mv_company_emissions_rollup CASCADE;
DROP VIEW IF EXISTS public.mv_bu_emissions_rollup CASCADE;
DROP VIEW IF EXISTS public.mv_site_emissions_rollup CASCADE;

DROP TABLE IF EXISTS public.audit_trails CASCADE;
DROP TABLE IF EXISTS public.evidence_attachments CASCADE;
DROP TABLE IF EXISTS public.emissions_log CASCADE;
DROP TABLE IF EXISTS public.project_sites CASCADE;
DROP TABLE IF EXISTS public.business_units CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;

-- Backwards compatibility with legacy tables
DROP TABLE IF EXISTS public.anomalies CASCADE;
DROP TABLE IF EXISTS public.audit_trail CASCADE;
DROP TABLE IF EXISTS public.approvals CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.weighbridge_records CASCADE;
DROP TABLE IF EXISTS public.emission_factors CASCADE;
DROP TABLE IF EXISTS public.sites CASCADE;

-- ==============================================================================
-- 3. HIERARCHICAL ORGANIZATIONAL ENTITIES
-- ==============================================================================

-- 3.1 Groups (Apex Holding)
CREATE TABLE public.groups (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    cin TEXT NOT NULL,
    turnover_cr NUMERIC NOT NULL DEFAULT 42500,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Companies (Subsidiaries / SPVs)
CREATE TABLE public.companies (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    turnover_cr NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Business Units (Divisions e.g., Irrigation, Hydro, Power, Roads, Hydrocarbons, Urban)
CREATE TABLE public.business_units (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    division_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Project Sites (~300 Sites Across Infrastructure Network)
CREATE TABLE public.project_sites (
    id TEXT PRIMARY KEY,
    bu_id TEXT NOT NULL REFERENCES public.business_units(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    division TEXT NOT NULL,
    subsidiary TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    status TEXT DEFAULT 'Submitted', -- 'Draft', 'Submitted', 'In Review', 'Approved', 'Audited'
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

-- Legacy alias view for backwards compatibility
CREATE VIEW public.sites AS SELECT * FROM public.project_sites;

-- ==============================================================================
-- 4. EMISSION FACTORS MASTER TABLE
-- ==============================================================================
CREATE TABLE public.emission_factors (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL, -- 'Scope 1', 'Scope 2', 'Scope 3'
    fuel_or_source TEXT NOT NULL,
    unit TEXT NOT NULL,
    factor NUMERIC NOT NULL, -- kg CO2e per unit
    source_standard TEXT NOT NULL, -- 'CEA v20', 'DEFRA 2024', 'IPCC AR6', 'GHG Protocol'
    effective_year TEXT NOT NULL,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. EMISSIONS LOG (CORE TELEMETRY & ACTIVITY DATA)
-- ==============================================================================
CREATE TABLE public.emissions_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT NOT NULL REFERENCES public.project_sites(id) ON DELETE CASCADE,
    reporting_month_year TEXT NOT NULL, -- '2026-09', '2026-08', etc.
    scope_type TEXT NOT NULL CHECK (scope_type IN ('Scope 1', 'Scope 2', 'Scope 3')),
    activity_category TEXT NOT NULL, -- 'DG Set Diesel', 'Grid Power DISCOM', 'Steel TMT Rebar', etc.
    activity_quantity NUMERIC NOT NULL CHECK (activity_quantity >= 0),
    unit TEXT NOT NULL, -- 'Liters', 'kWh', 'Metric Tonnes', 'passenger-km'
    emission_factor NUMERIC NOT NULL, -- kg CO2e / unit
    co2e_metric_tonnes NUMERIC NOT NULL, -- (activity_quantity * emission_factor) / 1000
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Audited', 'Flagged')),
    facility TEXT,
    invoice_no TEXT,
    notes TEXT,
    auditor_comments TEXT,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. EVIDENCE ATTACHMENTS (MANDATORY PROOFS & WEIGHBRIDGE SLIPS)
-- ==============================================================================
CREATE TABLE public.evidence_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emission_log_id UUID NOT NULL REFERENCES public.emissions_log(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN (
        'Electricity Bill',
        'Fuel Invoice',
        'Weighbridge Slip',
        'Flow Meter Calibration',
        'Vendor Environmental Certificate',
        'Grid Telemetry Log'
    )),
    uploaded_by TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    file_size_bytes INTEGER,
    verification_hash TEXT,
    ocr_confidence_pct NUMERIC DEFAULT 98.4
);

-- ==============================================================================
-- 7. AUDIT TRAILS (IMMUTABLE STATUTORY REGULATORY LEDGER)
-- ==============================================================================
CREATE TABLE public.audit_trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'VERIFY', 'FLAG', 'REJECT', 'APPROVE')),
    actor_id TEXT NOT NULL,
    role TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    comments TEXT,
    verified_hash TEXT
);

-- Legacy alias
CREATE VIEW public.audit_trail AS
SELECT id, actor_id AS user_name, role AS user_role, action, record_id AS entity,
       'Field Value' AS field_name, previous_value AS old_value, new_value, '10.24.8.102' AS ip_address, timestamp
FROM public.audit_trails;

-- ==============================================================================
-- 8. ANOMALIES & FOUR-EYES APPROVALS
-- ==============================================================================
CREATE TABLE public.anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT REFERENCES public.project_sites(id) ON DELETE CASCADE,
    site_name TEXT NOT NULL,
    metric TEXT NOT NULL,
    variance_pct NUMERIC NOT NULL,
    previous_value NUMERIC NOT NULL,
    current_value NUMERIC NOT NULL,
    status TEXT DEFAULT 'FLAGGED', -- 'FLAGGED', 'INVESTIGATING', 'RESOLVED'
    severity TEXT DEFAULT 'HIGH', -- 'HIGH', 'MEDIUM', 'LOW'
    probable_cause TEXT,
    ai_explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT REFERENCES public.project_sites(id) ON DELETE CASCADE,
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

-- ==============================================================================
-- 9. HIERARCHICAL ROLLUP VIEWS (SITE -> BU -> COMPANY -> GROUP)
-- ==============================================================================

-- 9.1 Site Level Rollup
CREATE OR REPLACE VIEW public.mv_site_emissions_rollup AS
SELECT
    s.id AS site_id,
    s.code AS site_code,
    s.name AS site_name,
    s.bu_id,
    s.company_id,
    s.turnover_cr,
    s.water_recycled_pct,
    s.ltifr,
    COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 1' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope1) AS total_scope1,
    COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 2' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope2) AS total_scope2,
    COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 3' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope3) AS total_scope3,
    (COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 1' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope1) +
     COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 2' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope2) +
     COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 3' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope3)) AS total_scope_123,
    CASE WHEN s.turnover_cr > 0 THEN
        ROUND(((COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 1' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope1) +
                COALESCE(SUM(CASE WHEN e.scope_type = 'Scope 2' THEN e.co2e_metric_tonnes ELSE 0 END), s.scope2)) / s.turnover_cr), 2)
        ELSE 0 END AS intensity_tco2e_per_cr
FROM public.project_sites s
LEFT JOIN public.emissions_log e ON s.id = e.site_id AND e.status IN ('Submitted', 'Approved', 'Audited')
GROUP BY s.id, s.code, s.name, s.bu_id, s.company_id, s.turnover_cr, s.water_recycled_pct, s.ltifr, s.scope1, s.scope2, s.scope3;

-- 9.2 Business Unit Level Rollup
CREATE OR REPLACE VIEW public.mv_bu_emissions_rollup AS
SELECT
    bu.id AS bu_id,
    bu.code AS bu_code,
    bu.name AS bu_name,
    bu.division_name,
    bu.company_id,
    COUNT(s.site_id) AS site_count,
    SUM(s.turnover_cr) AS total_turnover_cr,
    SUM(s.total_scope1) AS bu_scope1,
    SUM(s.total_scope2) AS bu_scope2,
    SUM(s.total_scope3) AS bu_scope3,
    SUM(s.total_scope_123) AS bu_total_scope,
    ROUND((SUM(s.total_scope1) * 36.0 + SUM(s.total_scope2) * 5.0), 1) AS total_energy_gj,
    CASE WHEN SUM(s.turnover_cr) > 0 THEN
        ROUND(((SUM(s.total_scope1) + SUM(s.total_scope2)) / SUM(s.turnover_cr)), 2)
        ELSE 0 END AS bu_intensity
FROM public.business_units bu
JOIN public.mv_site_emissions_rollup s ON bu.id = s.bu_id
GROUP BY bu.id, bu.code, bu.name, bu.division_name, bu.company_id;

-- 9.3 Company Level Rollup
CREATE OR REPLACE VIEW public.mv_company_emissions_rollup AS
SELECT
    c.id AS company_id,
    c.code AS company_code,
    c.name AS company_name,
    c.sector,
    c.group_id,
    COUNT(DISTINCT bu.bu_id) AS bu_count,
    SUM(bu.site_count) AS site_count,
    SUM(bu.total_turnover_cr) AS company_turnover_cr,
    SUM(bu.bu_scope1) AS company_scope1,
    SUM(bu.bu_scope2) AS company_scope2,
    SUM(bu.bu_scope3) AS company_scope3,
    SUM(bu.bu_total_scope) AS company_total_scope,
    SUM(bu.total_energy_gj) AS company_energy_gj,
    CASE WHEN SUM(bu.total_turnover_cr) > 0 THEN
        ROUND(((SUM(bu.bu_scope1) + SUM(bu.bu_scope2)) / SUM(bu.total_turnover_cr)), 2)
        ELSE 0 END AS company_intensity
FROM public.companies c
JOIN public.mv_bu_emissions_rollup bu ON c.id = bu.company_id
GROUP BY c.id, c.code, c.name, c.sector, c.group_id;

-- 9.4 Group Level Rollup
CREATE OR REPLACE VIEW public.mv_group_emissions_rollup AS
SELECT
    g.id AS group_id,
    g.code AS group_code,
    g.name AS group_name,
    COUNT(DISTINCT c.company_id) AS company_count,
    SUM(c.bu_count) AS total_bu_count,
    SUM(c.site_count) AS total_site_count,
    SUM(c.company_turnover_cr) AS group_turnover_cr,
    SUM(c.company_scope1) AS group_scope1,
    SUM(c.company_scope2) AS group_scope2,
    SUM(c.company_scope3) AS group_scope3,
    SUM(c.company_total_scope) AS group_total_scope,
    SUM(c.company_energy_gj) AS group_energy_gj,
    CASE WHEN SUM(c.company_turnover_cr) > 0 THEN
        ROUND(((SUM(c.company_scope1) + SUM(c.company_scope2)) / SUM(c.company_turnover_cr)), 2)
        ELSE 0 END AS group_intensity
FROM public.groups g
JOIN public.mv_company_emissions_rollup c ON g.id = c.group_id
GROUP BY g.id, g.code, g.name;

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Public Read Companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public Read BUs" ON public.business_units FOR SELECT USING (true);
CREATE POLICY "Public Read Sites" ON public.project_sites FOR SELECT USING (true);
CREATE POLICY "Public Upsert Sites" ON public.project_sites FOR ALL USING (true);

CREATE POLICY "Public Read Emissions" ON public.emissions_log FOR SELECT USING (true);
CREATE POLICY "Public Insert Emissions" ON public.emissions_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Emissions" ON public.emissions_log FOR UPDATE USING (true);

CREATE POLICY "Public Read Evidence" ON public.evidence_attachments FOR SELECT USING (true);
CREATE POLICY "Public Insert Evidence" ON public.evidence_attachments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Audit" ON public.audit_trails FOR SELECT USING (true);
CREATE POLICY "Public Insert Audit" ON public.audit_trails FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Factors" ON public.emission_factors FOR SELECT USING (true);
CREATE POLICY "Public Read Anomalies" ON public.anomalies FOR SELECT USING (true);
CREATE POLICY "Public Upsert Anomalies" ON public.anomalies FOR ALL USING (true);
CREATE POLICY "Public Read Approvals" ON public.approvals FOR SELECT USING (true);
CREATE POLICY "Public Update Approvals" ON public.approvals FOR ALL USING (true);

-- ==============================================================================
-- 11. INDEXES FOR PERFORMANCE (~300 SITES QUERY SCALING)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_emissions_site ON public.emissions_log(site_id);
CREATE INDEX IF NOT EXISTS idx_emissions_scope ON public.emissions_log(scope_type);
CREATE INDEX IF NOT EXISTS idx_emissions_status ON public.emissions_log(status);
CREATE INDEX IF NOT EXISTS idx_emissions_month ON public.emissions_log(reporting_month_year);
CREATE INDEX IF NOT EXISTS idx_evidence_log_id ON public.evidence_attachments(emission_log_id);
CREATE INDEX IF NOT EXISTS idx_audit_record ON public.audit_trails(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_trails(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sites_bu ON public.project_sites(bu_id);
CREATE INDEX IF NOT EXISTS idx_sites_company ON public.project_sites(company_id);

-- ==============================================================================
-- 12. SEED DATA: HIERARCHY, SITES, EMISSION FACTORS, LOGS & EVIDENCE
-- ==============================================================================

-- 12.1 Apex Group
INSERT INTO public.groups (id, code, name, cin, turnover_cr) VALUES
('grp-meil', 'MEIL-GROUP', 'Megha Engineering & Infrastructures Limited (Holding)', 'U45202TG2006PLC050271', 42500);

-- 12.2 Companies
INSERT INTO public.companies (id, group_id, code, name, sector, turnover_cr) VALUES
('comp-infra', 'grp-meil', 'MEIL-INFRA', 'MEIL Heavy Civil & Infrastructure Ltd', 'EPC & Construction', 22400),
('comp-hydro', 'grp-meil', 'MEIL-HYDRO', 'Megha Hydro & Lift Engineering Ltd', 'Irrigation & Water', 11200),
('comp-energy', 'grp-meil', 'MEIL-ENERGY', 'MEIL Energy & Hydrocarbons Global Ltd', 'Energy & Power', 8900);

-- 12.3 Business Units (Divisions)
INSERT INTO public.business_units (id, company_id, code, name, division_name) VALUES
('bu-irrigation', 'comp-hydro', 'BU-IRR', 'Lift Irrigation & Dam Concessions', 'Irrigation & Water'),
('bu-hydro', 'comp-hydro', 'BU-HYD', 'Underground Hydroelectric & Pump Caverns', 'Hydro & Power'),
('bu-tunnels', 'comp-infra', 'BU-TUN', 'High-Altitude Strategic Tunnels & Roads', 'Transport & Tunnels'),
('bu-power', 'comp-energy', 'BU-PWR', 'Renewable Solar Parks & Transmission Grids', 'Renewables & Power'),
('bu-hydrocarbons', 'comp-energy', 'BU-HYC', 'Refineries & City Gas Distribution (CGD)', 'Energy & Hydrocarbons'),
('bu-urban', 'comp-infra', 'BU-URB', 'Bulk Potable Water & Smart City Networks', 'Water & Urban Infrastructure');

-- 12.4 Emission Factors Master (Scope 1, 2, 3)
INSERT INTO public.emission_factors (id, category, fuel_or_source, unit, factor, source_standard, effective_year, notes) VALUES
('ef-01', 'Scope 1', 'High-Speed Diesel (HSD) - Mobile Fleet', 'Liters', 2.68787, 'DEFRA 2024', '2024', 'Excavators, dump trucks, batching mobile mixers'),
('ef-02', 'Scope 1', 'Light Diesel Oil (LDO) - Standby Stationary DGs', 'Liters', 2.86830, 'IPCC AR6', '2024', 'Deep tunnel dewatering & batching plant captive DGs'),
('ef-03', 'Scope 1', 'Piped Natural Gas (PNG) / LPG', 'kg', 1.98400, 'DEFRA 2024', '2024', 'Canteen, asphalt plants, heating loops'),
('ef-04', 'Scope 1', 'Commercial Blast Explosives (ANFO)', 'kg', 0.17800, 'GHG Protocol', '2024', 'Underground tunnel cavern rock blasting'),
('ef-05', 'Scope 2', 'Indian National Grid Electricity (Baseline v20)', 'kWh', 0.71600, 'CEA v20 (India Central Electricity Authority)', 'FY 2023-24', 'Official CEA National Grid average factor'),
('ef-06', 'Scope 2', 'Green Energy Open Access Solar/Wind PPA', 'kWh', 0.00000, 'GHG Protocol', '2024', 'Certified zero-carbon green power Wheeling'),
('ef-07', 'Scope 3', 'Primary Structural TMT Steel Rebar (Fe 550D)', 'Metric Tonnes', 1840.00, 'GHG Protocol', '2024', 'Embodied carbon in dam spillways and tunnel liners'),
('ef-08', 'Scope 3', 'Portland Slag Cement (PSC) - 45% Slag Blend', 'Metric Tonnes', 580.00, 'GHG Protocol', '2024', 'Blended low-carbon hydraulic cement'),
('ef-09', 'Scope 3', 'Freight Heavy Commercial Transport (Highway Logistics)', 'ton-km', 0.10500, 'DEFRA 2024', '2024', 'Aggregate and heavy rebar haulage to remote sites'),
('ef-10', 'Scope 3', 'Corporate Commercial Aviation (Employee Travel)', 'passenger-km', 0.19500, 'DEFRA 2024', '2024', 'Auditor & engineering team domestic flight hops');

-- 12.5 Project Sites (Comprehensive Flagship Network)
INSERT INTO public.project_sites (id, bu_id, company_id, code, name, division, subsidiary, state, country, lat, lng, status, scope1, scope2, scope3, water_recycled_pct, turnover_cr, workforce_count, ltifr, key_facility, completion_pct) VALUES
('site-042', 'bu-irrigation', 'comp-hydro', 'Site #042', 'Polavaram Multi-Purpose Project', 'Hydro & Irrigation', 'Megha Hydro Infrastructure Ltd', 'Andhra Pradesh', 'India', 17.25, 81.65, 'In Review', 24500, 8200, 88400, 72.4, 4250, 8400, 0.12, 'Earth-cum-Rock Fill Dam & Spillway Reach', 82),
('site-108', 'bu-tunnels', 'comp-infra', 'Site #108', 'Zojila Strategic Tunnel Project', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Jammu & Kashmir / Ladakh', 'India', 34.29, 75.48, 'Submitted', 18950, 5400, 92300, 61.8, 3680, 4200, 0.24, '14.15 km High-Altitude Bi-Directional Tunnel', 68),
('site-014', 'bu-irrigation', 'comp-hydro', 'Site #014', 'Kaleshwaram Lift Irrigation (Package 8 & 10)', 'Hydro & Irrigation', 'Megha Engineering Ltd', 'Telangana', 'India', 18.82, 79.91, 'Approved', 31200, 14200, 114500, 78.5, 5100, 6800, 0.08, 'World Largest Multi-Stage Underground Pump House', 94),
('site-INT-09', 'bu-hydrocarbons', 'comp-energy', 'Site #INT-09', 'Mongol Modern Refinery EPC Project', 'Hydrocarbons & Energy', 'MEIL Global Energy BV', 'Dornogovi', 'Mongolia', 44.91, 109.58, 'In Review', 28400, 11900, 145000, 84.1, 6200, 3100, 0.18, '1.5 MMTPA Green-Field Crude Processing Facility', 54),
('site-077', 'bu-tunnels', 'comp-infra', 'Site #077', 'Char Dham All-Weather Highway (Silkyara Reach)', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Uttarakhand', 'India', 30.58, 78.32, 'Submitted', 11200, 3100, 48200, 58.2, 1850, 2400, 0.32, 'Himalayan Slope Stabilization & 4-Lane Pavement', 76),
('site-210', 'bu-hydrocarbons', 'comp-energy', 'Site #210', 'Megha Gas City Gas Distribution (Belagavi GA)', 'Hydrocarbons & Energy', 'Megha City Gas Distribution Ltd', 'Karnataka', 'India', 15.85, 74.50, 'Approved', 6800, 2100, 22400, 88.0, 950, 850, 0.00, 'Steel Pipeline Grid & Mother CNG Station', 89),
('site-033', 'bu-hydro', 'comp-hydro', 'Site #033', 'Kundah Pumped Storage Hydro-Electric Project', 'Hydro & Irrigation', 'Megha Hydro Infrastructure Ltd', 'Tamil Nadu', 'India', 11.28, 76.62, 'Submitted', 14500, 4900, 63100, 71.3, 2400, 3100, 0.15, '4x125 MW Underground Cavern Powerhouse', 61),
('site-155', 'bu-power', 'comp-energy', 'Site #155', 'Bhadla Phase-IV 500MW Ultra Mega Solar Park', 'Renewables & Power', 'MEIL Green Power Ltd', 'Rajasthan', 'India', 27.53, 71.91, 'Approved', 1800, 450, 19200, 94.6, 1200, 620, 0.00, 'Single-Axis Tracking PV Arrays & 400kV Substation', 100),
('site-088', 'bu-tunnels', 'comp-infra', 'Site #088', 'Western Dedicated Freight Corridor (Package CTP-11)', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Gujarat', 'India', 23.02, 72.57, 'Approved', 21400, 7800, 89000, 65.4, 3100, 4900, 0.11, 'Heavy Haul Track Laying & OHE Electrification', 96),
('site-062', 'bu-irrigation', 'comp-hydro', 'Site #062', 'Upper Bhadra Lift Irrigation Scheme', 'Hydro & Irrigation', 'Megha Engineering Ltd', 'Karnataka', 'India', 13.92, 75.63, 'In Review', 16700, 6300, 54200, 69.8, 2900, 3800, 0.14, 'Canal Aqueduct & High-Discharge Pump Turbines', 73),
('site-224', 'bu-urban', 'comp-infra', 'Site #224', 'Krishna Drinking Water Supply Phase-III', 'Drinking Water & Smart Cities', 'Megha Engineering Ltd', 'Telangana', 'India', 16.51, 80.64, 'Approved', 5900, 8400, 24100, 82.3, 1400, 1100, 0.00, 'Water Treatment Plant (WTP) & Gravity Main Canal', 98),
('site-119', 'bu-tunnels', 'comp-infra', 'Site #119', 'Thane-Borivali Twin Tunnel Project', 'Transport & Tunnels', 'MEIL Infra Transport Ltd', 'Maharashtra', 'India', 19.21, 72.97, 'Submitted', 15200, 6100, 98400, 63.5, 4800, 2900, 0.19, '11.8 km Coastal Highway Tunnel using Mega TBMs', 32),
('site-051', 'bu-irrigation', 'comp-hydro', 'Site #051', 'Palamuru Ranga Reddy Lift Irrigation', 'Hydro & Irrigation', 'Megha Engineering Ltd', 'Telangana', 'India', 16.74, 78.00, 'In Review', 22100, 9800, 76200, 74.0, 3800, 5200, 0.13, '5-Stage Lift Pumping & Reservoir Complex', 79),
('site-INT-14', 'bu-urban', 'comp-infra', 'Site #INT-14', 'Amman-Aqaba Water Desalination Pipeline EPC', 'Drinking Water & Smart Cities', 'MEIL Global Energy BV', 'Amman', 'Jordan', 30.52, 35.80, 'In Review', 19400, 12500, 112000, 95.0, 5400, 1900, 0.09, '450 km Brackish Sea-Water Conveyance Conduit', 41),
('site-188', 'bu-power', 'comp-energy', 'Site #188', 'Rewa 250MW Floating Solar Array', 'Renewables & Power', 'MEIL Green Power Ltd', 'Madhya Pradesh', 'India', 24.53, 81.30, 'Approved', 850, 320, 12400, 96.2, 780, 340, 0.00, 'HDPE Float Modular Arrays on Reservoir Water Surface', 85);

-- 12.6 Initial Seed Emissions Log
INSERT INTO public.emissions_log (id, site_id, reporting_month_year, scope_type, activity_category, activity_quantity, unit, emission_factor, co2e_metric_tonnes, status, facility, invoice_no, notes) VALUES
('b1111111-1111-1111-1111-111111111111', 'site-042', '2026-09', 'Scope 1', 'DG Set Diesel', 14200, 'Liters', 2.68787, 38.16, 'Approved', 'Spillway Excavator Fleet #4', 'IOCL/2026/09/8821', 'Verified against IOCL bulk delivery challan and calibrated digital dispenser'),
('b2222222-2222-2222-2222-222222222222', 'site-042', '2026-09', 'Scope 2', 'Grid Power DISCOM', 48600, 'kWh', 0.71600, 34.80, 'Approved', 'Batching Plant Substation #2', 'DISCOM/HT/092926/01', '33kV HT Feeder Meter TSSPDCL telemetred reading verified'),
('b3333333-3333-3333-3333-333333333333', 'site-108', '2026-09', 'Scope 1', 'Stationary DG Sets', 22500, 'Liters', 2.86830, 64.54, 'Submitted', 'Zojila West Portal Cavern Adit', 'HPCL/ZOJ/0926/410', 'Standby generators running during peak snow clearance window'),
('b4444444-4444-4444-4444-444444444444', 'site-108', '2026-09', 'Scope 3', 'Primary Structural TMT Steel Rebar', 120, 'Metric Tonnes', 1840.00, 220.80, 'Submitted', 'Tunnel Arch Rib Reinforcement', 'SAIL/DEL/2026/902', 'SAIL Fe-550D structural grade with certified NABL mill test reports'),
('b5555555-5555-5555-5555-555555555555', 'site-014', '2026-09', 'Scope 2', 'Grid Power DISCOM', 124000, 'kWh', 0.71600, 88.78, 'Audited', 'Kaleshwaram Gayatri Pumphouse Unit #3', 'TRANSCO/KLIP/2026/102', 'Stage-2 139MW motor pump test run telemetry with ISAE 3000 assurance sign-off');

-- 12.7 Evidence Attachments for Seed Logs
INSERT INTO public.evidence_attachments (emission_log_id, file_url, file_name, document_type, uploaded_by, verification_hash) VALUES
('b1111111-1111-1111-1111-111111111111', 'https://storage.meilgroup.com/invoices/IOCL_8821_Signed.pdf', 'Signed_Weighbridge_IOCL_8821.pdf', 'Weighbridge Slip', 'Er. Rajesh Kumar', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
('b2222222-2222-2222-2222-222222222222', 'https://storage.meilgroup.com/bills/DISCOM_HT_0929.pdf', 'Signed_Grid_Meter_Slip_0929.pdf', 'Electricity Bill', 'Er. T. S. Rao', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'),
('b3333333-3333-3333-3333-333333333333', 'https://storage.meilgroup.com/invoices/HPCL_ZOJ_410.pdf', 'HPCL_Bulk_Fuel_Challan_410.pdf', 'Fuel Invoice', 'Er. Ghulam Mohammad', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'),
('b4444444-4444-4444-4444-444444444444', 'https://storage.meilgroup.com/certs/SAIL_Steel_MTR_902.pdf', 'SAIL_MTR_Mill_Certificate_902.pdf', 'Vendor Environmental Certificate', 'Er. Vikas Sharma', 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d');

-- 12.8 Audit Trails
INSERT INTO public.audit_trails (record_id, action, actor_id, role, previous_value, new_value, comments, verified_hash) VALUES
('b1111111-1111-1111-1111-111111111111', 'CREATE', 'Er. Rajesh Kumar', 'Project Data Entry User', 'None', '14,200 Liters (38.16 tCO2e)', 'Initial site quick-entry from gate weighbridge pass', '1a8565a9dae4b4198bcfa89c4f11641001b60d65'),
('b1111111-1111-1111-1111-111111111111', 'VERIFY', 'P. Sharma', 'Subsidiary Approver', 'Submitted', 'Approved', 'Cross-referenced against IOCL invoice #8821 and NABL flow meter certificate', '8f434346648f6b96df89dda901c5176b10e6d059'),
('b5555555-5555-5555-5555-555555555555', 'APPROVE', 'S. Narayanan', 'Independent Auditor (ISAE 3000)', 'Approved', 'Audited', 'Statutory sample verified for SEBI BRSR Core Principle 6 filing', 'd4735e3a265e16eee03f59718b9b5d03019c07d8');
