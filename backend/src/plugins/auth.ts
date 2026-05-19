import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload, UserProfile } from '../types';
import { sendError } from '../utils/errors';

// Extend Fastify with auth decorators and request.user
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    adminOnly: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user: JWTPayload & { profile: UserProfile };
  }
}

export const authPlugin = fp(async (fastify: FastifyInstance) => {

  /**
   * Verifies Bearer JWT via a raw HTTP call to Supabase Auth.
   * We intentionally avoid supabase.auth.getUser(token) here because it mutates
   * the shared client's internal session, which would override the service_role key
   * and cause RLS to block subsequent DB queries.
   */
  fastify.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const auth = req.headers.authorization;
      if (!auth?.startsWith('Bearer ')) {
        return sendError(reply, 401, 'Unauthorized', 'Missing authorization header');
      }

      const token = auth.split(' ')[1];

      // Raw HTTP call — does NOT affect the shared Supabase client state
      const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.SUPABASE_SERVICE_KEY!,
        },
      });

      if (!res.ok) {
        return sendError(reply, 401, 'Unauthorized', 'Invalid or expired token');
      }

      const authUser = await res.json() as { id: string; email: string };

      // Fetch profile from DB — service_role client, not affected by above call
      const { data: profile, error: profileError } = await fastify.supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();


      if (profileError || !profile) {
        return sendError(reply, 401, 'Unauthorized', 'User profile not found');
      }

      req.user = {
        sub: authUser.id,
        email: authUser.email ?? '',
        aud: 'authenticated',
        role: 'authenticated',
        iat: 0,
        exp: 0,
        profile,
      };
    } catch {
      return sendError(reply, 401, 'Unauthorized', 'Invalid or expired token');
    }
  });

  // Same as authenticate but also enforces admin role
  fastify.decorate('adminOnly', async (req: FastifyRequest, reply: FastifyReply) => {
    await fastify.authenticate(req, reply);
    if (reply.sent) return;
    if (req.user?.profile?.role !== 'admin') {
      return sendError(reply, 403, 'Forbidden', 'Admin access required');
    }
  });
});
