import fp from 'fastify-plugin';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;     // service_role — DB queries only, never set session on this
    supabaseAuth: SupabaseClient; // anon key — auth operations (login, register, etc.)
  }
}

export const supabasePlugin = fp(async (fastify: FastifyInstance) => {
  // Admin DB client — service_role bypasses RLS.
  // NEVER call auth.signIn/signUp on this client or it will contaminate the session.
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  // Auth-only client — anon key, used for login/register/forgot-password.
  // Kept separate so its session state never affects DB queries.
  const supabaseAuth = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  fastify.decorate('supabase', supabase);
  fastify.decorate('supabaseAuth', supabaseAuth);
});
