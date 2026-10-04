import { createClient } from '@supabase/supabase-js';
import { INFRASTRUCTURE_SITES, EMISSION_FACTORS, INITIAL_AUDIT_TRAIL, INITIAL_APPROVALS } from '../data/mockData';
import { InfrastructureSite, EmissionFactor, AuditTrailEntry, ApprovalItem } from '../types/esg';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jwvhngbdsrsvtkivzfkj.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_IVXLjYCyQ0sXTLdMIac-Lw_86DsNrVt';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      !supabaseUrl.includes('your-project') &&
      supabaseKey &&
      supabaseKey.startsWith('sb_publishable_')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ==============================================================================
// 1. WEIGHBRIDGE RECORDS CLOUD OPERATIONS
// ==============================================================================
export interface SupabaseWeighbridgeRecord {
  id?: string;
  site_id: string;
  site_name: string;
  gate_pass_no: string;
  vehicle_no: string;
  material: string;
  gross_weight_mt: number;
  tare_weight_mt: number;
  net_quantity: number;
  unit: string;
  scope1_tco2e: number;
  driver_name?: string;
  inspection_officer?: string;
  verified_status?: string;
  voucher_url?: string;
  created_at?: string;
}

export async function syncWeighbridgeToCloud(record: SupabaseWeighbridgeRecord) {
  if (!supabase) return { success: false, mode: 'local' };

  try {
    const { data, error } = await supabase
      .from('weighbridge_records')
      .insert([record])
      .select();

    if (error) {
      console.warn('Supabase weighbridge insert note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase sync exception:', err?.message || err);
    return { success: false, error: err?.message || err };
  }
}

export async function fetchWeighbridgeRecordsFromDb(siteId?: string) {
  if (!supabase) return [];

  try {
    let query = supabase.from('weighbridge_records').select('*').order('created_at', { ascending: false });
    if (siteId && siteId !== 'all') {
      query = query.eq('site_id', siteId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Using local weighbridge cache:', err);
    return [];
  }
}

// ==============================================================================
// 2. SITES & CONSOLIDATION CLOUD OPERATIONS
// ==============================================================================
export async function fetchSitesFromDb(): Promise<InfrastructureSite[]> {
  if (!supabase) return INFRASTRUCTURE_SITES;

  try {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('code', { ascending: true });

    if (error || !data || data.length === 0) {
      return INFRASTRUCTURE_SITES;
    }

    return data.map((row: any) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      division: row.division,
      subsidiary: row.subsidiary,
      state: row.state,
      country: row.country || 'India',
      lat: Number(row.lat),
      lng: Number(row.lng),
      status: row.status,
      scope1: Number(row.scope1 || 0),
      scope2: Number(row.scope2 || 0),
      scope3: Number(row.scope3 || 0),
      waterRecycledPct: Number(row.water_recycled_pct || 0),
      turnoverCr: Number(row.turnover_cr || 0),
      workforceCount: Number(row.workforce_count || 0),
      ltifr: Number(row.ltifr || 0),
      keyFacility: row.key_facility || '',
      completionPct: Number(row.completion_pct || 0),
    }));
  } catch (err) {
    console.warn('Falling back to local infrastructure sites dataset:', err);
    return INFRASTRUCTURE_SITES;
  }
}

// ==============================================================================
// 3. AUDIT TRAIL CLOUD OPERATIONS
// ==============================================================================
export async function syncAuditEntryToCloud(auditEntry: {
  user_name: string;
  user_role: string;
  action: string;
  entity: string;
  field_name: string;
  old_value?: string;
  new_value?: string;
  ip_address?: string;
}) {
  if (!supabase) return { success: false, mode: 'local' };

  try {
    const { data, error } = await supabase
      .from('audit_trail')
      .insert([auditEntry])
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || err };
  }
}

export async function fetchAuditTrailFromDb(): Promise<AuditTrailEntry[]> {
  if (!supabase) return INITIAL_AUDIT_TRAIL;

  try {
    const { data, error } = await supabase
      .from('audit_trail')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) {
      return INITIAL_AUDIT_TRAIL;
    }

    return data.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      user: row.user_name,
      role: row.user_role as any,
      action: row.action as any,
      entity: row.entity,
      field: row.field_name,
      oldValue: row.old_value || '-',
      newValue: row.new_value || '-',
      ipAddress: row.ip_address || '10.24.8.102',
      verifiedHash: `sha256-${row.id?.slice(0, 8)}`,
    }));
  } catch {
    return INITIAL_AUDIT_TRAIL;
  }
}

// ==============================================================================
// 4. FOUR-EYES APPROVALS CLOUD OPERATIONS
// ==============================================================================
export async function updateApprovalInDb(id: string, status: string, notes?: string) {
  if (!supabase) return { success: false, mode: 'local' };

  try {
    const { data, error } = await supabase
      .from('approvals')
      .update({ status, reviewer_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || err };
  }
}

export async function fetchApprovalsFromDb(): Promise<ApprovalItem[]> {
  if (!supabase) return INITIAL_APPROVALS;

  try {
    const { data, error } = await supabase
      .from('approvals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_APPROVALS;
    }

    return data.map((row: any) => ({
      id: row.id,
      siteCode: row.site_id,
      siteName: row.entity_name,
      period: row.cycle || 'FY 2024-25',
      division: 'Infrastructure Division',
      submittedBy: 'Site Engineer',
      submittedAt: row.created_at || 'Just now',
      scope1: Number(row.scope1_tco2e || 0),
      scope2: Number(row.scope2_tco2e || 0),
      scope3: 45000,
      waterWithdrawalKl: 12400,
      wasteGeneratedMt: 320,
      varianceFlag: false,
      status: row.status as any,
      comments: row.reviewer_notes
        ? [
            {
              author: 'Reviewer',
              role: 'Subsidiary Approver',
              text: row.reviewer_notes,
              timestamp: row.updated_at || new Date().toISOString(),
            },
          ]
        : [],
      attachments: ['Signed_Weighbridge_Challan.pdf'],
    }));
  } catch {
    return INITIAL_APPROVALS;
  }
}

// ==============================================================================
// 5. EMISSION FACTORS CLOUD OPERATIONS
// ==============================================================================
export async function fetchEmissionFactorsFromDb(): Promise<EmissionFactor[]> {
  if (!supabase) return EMISSION_FACTORS;

  try {
    const { data, error } = await supabase
      .from('emission_factors')
      .select('*')
      .order('category', { ascending: true });

    if (error || !data || data.length === 0) {
      return EMISSION_FACTORS;
    }

    return data.map((row: any) => ({
      id: row.id,
      category: (row.category?.includes('Scope 1') ? 'Scope 1' : row.category?.includes('Scope 2') ? 'Scope 2' : 'Scope 3') as any,
      fuelOrSource: row.name,
      unit: row.unit,
      factor: Number(row.factor_value),
      sourceStandard: (row.source?.includes('CEA') ? 'CEA v20 (India Central Electricity Authority)' : row.source?.includes('DEFRA') ? 'DEFRA 2024' : 'IPCC AR6') as any,
      effectiveYear: row.year,
      notes: `Ingested from ${row.source}`,
    }));
  } catch {
    return EMISSION_FACTORS;
  }
}

// ==============================================================================
// 6. EMISSIONS LOG & EVIDENCE CLOUD OPERATIONS
// ==============================================================================
export async function syncEmissionLogToCloud(log: {
  site_id: string;
  reporting_month_year: string;
  scope_type: 'Scope 1' | 'Scope 2' | 'Scope 3';
  activity_category: string;
  activity_quantity: number;
  unit: string;
  emission_factor: number;
  co2e_metric_tonnes: number;
  status?: string;
  facility?: string;
  invoice_no?: string;
  notes?: string;
}) {
  if (!supabase) return { success: false, mode: 'local' };

  try {
    const { data, error } = await supabase
      .from('emissions_log')
      .insert([log])
      .select();

    if (error) {
      console.warn('Supabase emissions_log insert notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err?.message || err };
  }
}

export async function syncEvidenceToCloud(evidence: {
  emission_log_id: string;
  file_url: string;
  file_name: string;
  document_type: string;
  uploaded_by: string;
  verification_hash?: string;
}) {
  if (!supabase) return { success: false, mode: 'local' };

  try {
    const { data, error } = await supabase
      .from('evidence_attachments')
      .insert([evidence])
      .select();

    if (error) {
      console.warn('Supabase evidence_attachments notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err?.message || err };
  }
}

export async function fetchEmissionsLogsFromDb(siteId?: string) {
  if (!supabase) return [];

  try {
    let query = supabase.from('emissions_log').select(`
      *,
      evidence_attachments (*)
    `).order('created_at', { ascending: false });

    if (siteId && siteId !== 'all') {
      query = query.eq('site_id', siteId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Falling back to local cache for emissions logs:', err);
    return [];
  }
}

export async function syncAuditTrailToCloud(entry: {
  record_id: string;
  action: string;
  actor_id: string;
  role: string;
  previous_value?: string;
  new_value?: string;
  comments?: string;
  verified_hash?: string;
}) {
  if (!supabase) return { success: false, mode: 'local' };

  try {
    const { data, error } = await supabase
      .from('audit_trails')
      .insert([entry])
      .select();

    if (error) {
      console.warn('Supabase audit_trails notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err?.message || err };
  }
}
