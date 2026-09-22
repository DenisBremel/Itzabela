import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { CustomDesignPage } from '@/pages/CustomDesignPage';
import { AdminPage } from '@/pages/AdminPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Árbol de rutas.
 *
 * Hay dos zonas bien separadas:
 *  - La tienda: envuelta en <Layout>, sin login de ningún tipo.
 *  - /admin: fuera del Layout, con su propia pantalla de acceso.
 */
export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />

      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/diseno-personalizado" element={<CustomDesignPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}
