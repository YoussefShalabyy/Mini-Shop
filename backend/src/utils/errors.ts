import { FastifyReply } from 'fastify';

export const sendError = (
  reply: FastifyReply,
  statusCode: number,
  error: string,
  message: string
) => {
  return reply.status(statusCode).send({ statusCode, error, message });
};
