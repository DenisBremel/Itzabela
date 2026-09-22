import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { SupabaseSetup } from '@/components/admin/SupabaseSetup';
import { Icon } from '@/components/ui/Icon';
import { ToastProvider } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * ============================================================
 *  /admin — ÁREA PRIVADA
 * ============================================================
 *  Esta ruta vive FUERA del Layout público: no tiene el menú de
 *  la tienda ni el botón flotante de WhatsApp. Los clientes no
 *  necesitan cuenta para comprar; el login es solo tuyo.
 *
 *  Quien no haya iniciado sesión ve el formulario. Quien no
 *  tenga contraseña no puede escribir en la base de datos,
 *  porque las políticas RLS de Supabase lo impiden aunque
 *  conozca la clave pública del sitio.
 * ============================================================
 */
export function AdminPage(): JSX.Element {
  return (
    <ToastProvider>
      <AdminArea />
    </ToastProvider>
  );
}

function AdminArea(): JSX.Element {
  const { session, isLoading, signIn, signOut } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blush-100 p-5">
        <SupabaseSetup />
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blush-100">
        <p className="flex items-center gap-2 text-stone-500">
          <Icon name="refresh" size={20} className="animate-spin" />
          Comprobando tu sesión…
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-blush-100 p-5">
        <LoginForm onSubmit={signIn} />
        <Link to="/" className="text-sm text-stone-500 transition-colors hover:text-rose-700">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main>
      <AdminPanel email={session.user.email ?? 'administradora'} onSignOut={signOut} />
    </main>
  );
}
