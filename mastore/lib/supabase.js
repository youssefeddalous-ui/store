import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Had l client kaykhdem GHIR f serveur (service_role key ma katmchich l navigateur).
let client;
export function db() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Na9sin SUPABASE_URL wla SUPABASE_SERVICE_ROLE_KEY f .env.local');
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
