import type { JSX } from 'react';
import { Hero } from '@/components/sections/Hero';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { Occasions } from '@/components/sections/Occasions';
import { HowToOrder } from '@/components/sections/HowToOrder';
import { CustomDesignCta } from '@/components/sections/CustomDesignCta';
import { Faq } from '@/components/sections/Faq';

/** Portada: enamorar, mostrar producto y llevar a WhatsApp. */
export function HomePage(): JSX.Element {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Occasions />
      <HowToOrder />
      <CustomDesignCta />
      <Faq />
    </>
  );
}
