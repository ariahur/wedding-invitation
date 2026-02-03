import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

/**
 * Supabase keepalive - 하루에 한 번 호출되어 프로젝트가 일시정지되지 않도록 함.
 * Vercel Cron에서 매일 실행됩니다.
 */
export default async function handler(_req: Request): Promise<Response> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Supabase env not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase
      .from('rsvp_responses')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Supabase keepalive error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Keepalive success' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Supabase keepalive exception:', err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
