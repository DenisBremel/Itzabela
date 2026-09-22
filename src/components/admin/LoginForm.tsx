import { useState, type FormEvent, type JSX } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SHOP } from '@/constants/shop';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

/**
 * Entrada al panel de stock.
 * Solo aparece en /admin: los clientes de la tienda nunca ven esta
 * pantalla ni necesitan cuenta para comprar.
 */
export function LoginForm({ onSubmit }: LoginFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setIsSending(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-rose-200 bg-blush-100 p-8 shadow-card">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
        <Icon name="lock" size={24} />
      </span>

      <h1 className="mt-5 font-display text-3xl font-semibold text-stone-900">Panel de stock</h1>
      <p className="mt-2 text-sm text-stone-600">
        Área privada de {SHOP.fullName}. Entra con tu correo y contraseña para actualizar el
        catálogo.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-800">
            Correo
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-rose-200 bg-white/70 px-4 py-2.5 text-stone-900 outline-none transition-colors focus:border-rose-400 focus:bg-white"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-800">
            Contraseña
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-rose-200 bg-white/70 px-4 py-2.5 pr-12 text-stone-900 outline-none transition-colors focus:border-rose-400 focus:bg-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-stone-400 transition-colors hover:text-rose-700"
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" disabled={isSending}>
          {isSending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
