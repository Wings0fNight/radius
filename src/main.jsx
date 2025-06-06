import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/styles/main.css'
import { App } from './app/App.jsx'

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
