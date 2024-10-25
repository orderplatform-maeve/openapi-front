import './index.css';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import enableMocking from '@/configs/mocks';
import App from '@/App.tsx';

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
