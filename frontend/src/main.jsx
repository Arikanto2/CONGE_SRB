import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Style/index.css'
import "@fontsource/viaoda-libre"; 
import App from '/src/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
