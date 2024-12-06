import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Arquivo CSS global (ou seu arquivo de estilos principal)
import App from './App';  // Componente principal do seu aplicativo

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
