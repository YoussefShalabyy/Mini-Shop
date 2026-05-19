import { FastifyInstance } from 'fastify';
import { listProductsSchema, createProductSchema, updateProductSchema } from './products.schema';
import { productsService } from './products.service';
import { sendError } from '../../utils/errors';

export const productRoutes = async (fastify: FastifyInstance) => {

  // GET /products  — public
  fastify.get('/', async (req, reply) => {
    const parsed = listProductsSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      const result = await productsService.list(fastify.supabase, parsed.data);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 500, 'Server Error', err.message);
    }
  });

  // GET /products/categories  — public
  fastify.get('/categories', async (req, reply) => {
    try {
      const result = await productsService.listCategories(fastify.supabase);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 500, 'Server Error', err.message);
    }
  });

  // GET /products/:id  — public
  fastify.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const result = await productsService.getById(fastify.supabase, id);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 404, 'Not Found', err.message);
    }
  });

  // POST /products  — admin only
  fastify.post('/', { preHandler: fastify.adminOnly }, async (req, reply) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      const result = await productsService.create(fastify.supabase, parsed.data);
      return reply.status(201).send(result);
    } catch (err: any) {
      return sendError(reply, 400, 'Create Failed', err.message);
    }
  });

  // PATCH /products/:id  — admin only
  fastify.patch('/:id', { preHandler: fastify.adminOnly }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(reply, 400, 'Validation Error', parsed.error.errors[0].message);
    }
    try {
      const result = await productsService.update(fastify.supabase, id, parsed.data);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 400, 'Update Failed', err.message);
    }
  });

  // DELETE /products/:id  — admin only (soft delete)
  fastify.delete('/:id', { preHandler: fastify.adminOnly }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const result = await productsService.softDelete(fastify.supabase, id);
      return reply.send(result);
    } catch (err: any) {
      return sendError(reply, 400, 'Delete Failed', err.message);
    }
  });
};
