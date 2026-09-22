import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontró el contenedor #root en index.html');
}

// Marca que hay JavaScript disponible: activa las animaciones de
// aparición sin ocultar contenido a buscadores ni a navegadores sin JS.
document.documentElement.classList.add('js');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
