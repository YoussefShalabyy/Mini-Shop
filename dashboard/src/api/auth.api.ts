import { api } from './client';
import { User } from '@/types';

export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
};
