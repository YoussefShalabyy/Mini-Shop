import { SupabaseClient } from '@supabase/supabase-js';
import { RegisterInput, LoginInput, ForgotPasswordInput } from './auth.schema';

// Note: all methods here take the AUTH client (anon key), not the admin DB client.
// This keeps the DB client's session clean (service_role always active).

export const authService = {

  async register(authClient: SupabaseClient, input: RegisterInput) {
    const { data, error } = await authClient.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { name: input.name } },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registration failed');

    return { message: 'Registration successful. Please verify your email.' };
  },

  async login(authClient: SupabaseClient, dbClient: SupabaseClient, input: LoginInput) {
    const { data, error } = await authClient.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) throw new Error(error.message);
    if (!data.session) throw new Error('Login failed');

    // Use DB client (service_role) for profile fetch — unaffected by the login above
    const { data: profile } = await dbClient
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name ?? '',
        role: profile?.role ?? 'customer',
      },
    };
  },

  async forgotPassword(authClient: SupabaseClient, input: ForgotPasswordInput) {
    const { error } = await authClient.auth.resetPasswordForEmail(input.email);
    if (error) throw new Error(error.message);
    return { message: 'Password reset email sent' };
  },

  async getMe(dbClient: SupabaseClient, userId: string) {
    const { data: profile, error } = await dbClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) throw new Error('Profile not found');
    return profile;
  },

  async getAllProfiles(dbClient: SupabaseClient) {
    const { data, error } = await dbClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
};
