
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
