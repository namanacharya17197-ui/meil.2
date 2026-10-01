import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseUrl !== 'https://your-project.supabase.co' &&
      !supabaseUrl.includes('your-project') &&
      supabaseKey
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Types for Supabase Ingestion
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
  driver_name: string;
  inspection_officer: string;
  verified_status: string;
  created_at?: string;
}

// Database helper functions
export async function syncWeighbridgeToCloud(record: SupabaseWeighbridgeRecord) {
  if (!supabase) {
    console.info('Supabase not fully connected yet (awaiting Supabase Project URL). Storing in local state.');
    return { success: false, mode: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('weighbridge_records')
      .insert([record])
      .select();

    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase sync exception:', err?.message || err);
    return { success: false, error: err?.message || err };
  }
}

export async function syncAuditEntryToCloud(auditEntry: any) {
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
