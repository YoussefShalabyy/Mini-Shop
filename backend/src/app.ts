import Fastify from 'fastify';
import cors from '@fastify/cors';
import { supabasePlugin } from './plugins/supabase';
import { authPlugin } from './plugins/auth';
import { authRoutes } from './modules/auth/auth.routes';
import { productRoutes } from './modules/products/products.routes';
import { orderRoutes } from './modules/orders/orders.routes';

export const buildApp = async () => {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, { origin: true });
  await fastify.register(supabasePlugin);
  await fastify.register(authPlugin);

  fastify.get('/health', async () => ({ status: 'ok' }));

  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(productRoutes, { prefix: '/products' });
  await fastify.register(orderRoutes, { prefix: '/orders' });

  return fastify;
};
