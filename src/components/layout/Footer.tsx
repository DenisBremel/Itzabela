import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Logo } from './Logo';
import { FOOTER_NAV } from '@/constants/navigation';
import { SHOP, type SocialNetwork } from '@/constants/shop';
import { buildTelUrl, buildWhatsAppUrl } from '@/utils/whatsapp';

/** Icono de cada red social (solo se muestran las que tengan URL). */
const SOCIAL_ICONS: Record<SocialNetwork, IconName> = {
  instagram: 'instagram',
  facebook: 'facebook',
  tiktok: 'tiktok',
};

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  const socials = (Object.keys(SHOP.social) as SocialNetwork[]).filter(
    (network) => SHOP.social[network] !== '',
  );

  return (
    <footer className="mt-24 border-t border-rose-200 bg-blush-100">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca y contacto */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-600">
              {SHOP.description}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm">
              <li>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-stone-700 transition-colors hover:text-rose-700"
                >
                  <Icon name="whatsapp" size={18} className="text-[#25D366]" />
                  {SHOP.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={buildTelUrl()}
                  className="inline-flex items-center gap-2.5 text-stone-700 transition-colors hover:text-rose-700"
                >
                  <Icon name="phone" size={18} className="text-rose-600" />
                  Llamar a la tienda
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-stone-700">
                <Icon name="clock" size={18} className="text-rose-600" />
                {SHOP.schedule}
              </li>
              <li className="flex items-center gap-2.5 text-stone-700">
                <Icon name="location" size={18} className="text-rose-600" />
                {SHOP.deliveryArea}
              </li>
            </ul>

            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map((network) => (
                  <a
                    key={network}
                    href={SHOP.social[network]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={network}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700 transition-colors hover:bg-rose-100"
                  >
                    <Icon name={SOCIAL_ICONS[network]} size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Columnas de enlaces */}
          {FOOTER_NAV.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="font-display text-lg font-semibold text-stone-900">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-stone-600 transition-colors hover:text-rose-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Sin enlace al panel: se entra escribiendo /admin en la barra
            de direcciones, así el cliente ni se entera de que existe. */}
        <div className="mt-12 border-t border-rose-200 pt-6 text-center text-sm text-stone-500">
          <p>
            © {year} {SHOP.fullName}. Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
}
