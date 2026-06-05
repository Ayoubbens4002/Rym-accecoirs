import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n';
import { ThemeAndLangProvider } from './components/ThemeAndLangContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeAndLangProvider>
      <App />
    </ThemeAndLangProvider>
  </StrictMode>,
)
