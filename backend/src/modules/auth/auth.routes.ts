import { FastifyInstance } from 'fastify';
import { registerSchema, loginSchema, forgotPasswordSchema } from './auth.schema';
import { authService } from './auth.service';
import { sendError } from '../../utils/errors';

export const authRoutes = async (fastify: FastifyInstance) => {

  // POST /auth/register
  fastify.post('/register', async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      const result = await authService.register(fastify.supabaseAuth, parsed.data);
      return reply.status(201).send(result);
    } catch (err: any) {
      return sendError(reply, 400, 'Registration Failed', err.message);
    }
  });

  // POST /auth/login
  fastify.post('/login', async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      // Pass authClient (anon) for sign-in, dbClient (service_role) for profile fetch
      const result = await authService.login(fastify.supabaseAuth, fastify.supabase, parsed.data);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 401, 'Login Failed', err.message);
    }
  });

  // POST /auth/forgot-password
  fastify.post('/forgot-password', async (req, reply) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      const result = await authService.forgotPassword(fastify.supabaseAuth, parsed.data);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 400, 'Request Failed', err.message);
    }
  });

  // GET /auth/me  — requires auth
  fastify.get('/me', { preHandler: fastify.authenticate }, async (req, reply) => {
    try {
      const profile = await authService.getMe(fastify.supabase, req.user.sub);
      return reply.send(profile);
    } catch (err: any) {
      return sendError(reply, 404, 'Not Found', err.message);
    }
  });

  // GET /auth/users  — admin only
  fastify.get('/users', { preHandler: fastify.adminOnly }, async (req, reply) => {
    try {
      const users = await authService.getAllProfiles(fastify.supabase);
      return reply.send(users);
    } catch (err: any) {
      return sendError(reply, 500, 'Server Error', err.message);
    }
  });
};
