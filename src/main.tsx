import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './glass.css'
import App from './App.tsx'

// iOS Safari only applies :active styles once the page has a touch listener.
document.addEventListener('touchstart', () => {}, { passive: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
