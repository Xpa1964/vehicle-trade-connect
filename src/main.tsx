import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Static Image Platform initialization moved to App.tsx useEffect
// to ensure React is fully mounted before running

// Make sure root element exists before rendering
const root = document.getElementById("root");

if (root) {
  try {
    createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Error al renderizar la aplicación:", error);
    root.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
          <h1>Error de carga</h1>
          <p>Ha ocurrido un error al cargar la aplicación. Por favor, recarga la página.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Recargar página
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error("No se encontró el elemento con id 'root'");
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1>Error de configuración</h1>
        <p>No se encontró el elemento root en el DOM.</p>
      </div>
    </div>
  `;
}
