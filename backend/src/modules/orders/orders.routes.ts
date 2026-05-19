import { FastifyInstance } from 'fastify';
import { createOrderSchema, updateOrderStatusSchema } from './orders.schema';
import { ordersService } from './orders.service';
import { sendError } from '../../utils/errors';

export const orderRoutes = async (fastify: FastifyInstance) => {

  // POST /orders  — authenticated customer
  fastify.post('/', { preHandler: fastify.authenticate }, async (req, reply) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      const result = await ordersService.create(fastify.supabase, req.user.sub, parsed.data);
      return reply.status(201).send(result);
    } catch (err: any) {
      return sendError(reply, 400, 'Order Failed', err.message);
    }
  });

  // GET /orders/my  — authenticated customer's own orders
  fastify.get('/my', { preHandler: fastify.authenticate }, async (req, reply) => {
    try {
      const result = await ordersService.getMyOrders(fastify.supabase, req.user.sub);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 500, 'Server Error', err.message);
    }
  });

  // GET /orders  — admin only, all orders
  fastify.get('/', { preHandler: fastify.adminOnly }, async (req, reply) => {
    try {
      const result = await ordersService.getAllOrders(fastify.supabase);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 500, 'Server Error', err.message);
    }
  });

  // PATCH /orders/:id/status  — admin only
  fastify.patch('/:id/status', { preHandler: fastify.adminOnly }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      const result = await ordersService.updateStatus(fastify.supabase, id, parsed.data);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 400, 'Update Failed', err.message);
    }
  });
};
