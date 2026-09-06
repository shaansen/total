import React from 'react';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';

/* Ionic owns the app chrome: safe areas, scroll containers, keyboard-aware
   modals. Its stylesheets are imported from index.css inside a CSS layer, so
   Tailwind utilities still win. */

import App from './App';
import './index.css';

setupIonicReact({ mode: 'ios' });

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
