import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

const DEMO_ADMIN_KEY = '7gamer_admin_session';

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async login(email: string, password: string): Promise<AdminUser> {
    // If Supabase is connected
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Falha ao autenticar no Supabase.');
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado.');
      }

      // Check admin authorization in admin_users table (Backend check)
      const { data: adminRecord, error: roleError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (roleError || !adminRecord || adminRecord.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Acesso negado: Este usuário não possui privilégios de administrador.');
      }

      return {
        id: data.user.id,
        email: data.user.email || email,
        role: 'admin',
      };
    }

    // Fallback Demo Mode when Supabase .env is not yet configured
    if (email.trim().toLowerCase() === 'admin@7gamer.com' && password === '7gamer123') {
      const admin: AdminUser = {
        id: 'demo-admin-uuid-001',
        email: 'admin@7gamer.com',
        role: 'admin',
      };
      sessionStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(admin));
      return admin;
    }

    throw new Error('Credenciais inválidas. Para teste rápido use: admin@7gamer.com / 7gamer123');
  },

  async resetPassword(email: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#admin-reset',
      });
      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    // Local simulation feedback
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (email.trim().toLowerCase() !== 'admin@7gamer.com') {
      throw new Error('E-mail administrativo não localizado na base.');
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(DEMO_ADMIN_KEY);
  },

  async getCurrentAdmin(): Promise<AdminUser | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!adminRecord || adminRecord.role !== 'admin') {
        return null;
      }

      return {
        id: session.user.id,
        email: session.user.email || '',
        role: 'admin',
      };
    }

    // Check demo session
    const stored = sessionStorage.getItem(DEMO_ADMIN_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as AdminUser;
      } catch {
        sessionStorage.removeItem(DEMO_ADMIN_KEY);
      }
    }
    return null;
  },
};
