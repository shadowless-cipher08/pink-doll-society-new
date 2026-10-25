
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'sb_publishable_XBFanOh5XBakQzq0XHUATQ_AJsnvfue';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_XBFanOh5XBakQzq0XHUATQ_AJsnvfue';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
