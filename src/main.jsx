import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Developer easter egg
console.log(
  '%c✦ FirstTouch Universe %cloaded%c — built with obsession by Ascension First AI',
  'color: #C9A96E; font-weight: bold; font-size: 14px;',
  'color: #6a8; font-weight: bold; font-size: 14px;',
  'color: #888; font-size: 11px;'
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
