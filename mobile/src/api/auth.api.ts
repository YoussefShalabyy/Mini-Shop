import { client } from './client';
import { User } from '@/types';

export const authApi = {
  register: async (name: string, email: string, password: string) => {
    const res = await client.post('/auth/register', { name, email, password });
    return res.data as { message: string };
  },

  login: async (email: string, password: string) => {
    const res = await client.post('/auth/login', { email, password });
    return res.data as { token: string; user: User };
  },

  forgotPassword: async (email: string) => {
    const res = await client.post('/auth/forgot-password', { email });
    return res.data as { message: string };
  },

  getMe: async () => {
    const res = await client.get('/auth/me');
    return res.data as User;
  },
};
