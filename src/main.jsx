/**
 * main.jsx — Point d'entrée de l'application React
 * Importe le CSS global et monte App dans le DOM.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { installGlobalErrorLogging } from './shared/observability/systemLogger.js';

installGlobalErrorLogging();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
