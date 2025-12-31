
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import App from './App';

const container = document.getElementById('root');

if (container instanceof HTMLElement) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>
  );
} else {
  console.error("Root element not found or is not a valid DOM element");
}
