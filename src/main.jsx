import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles.css";

import AppRoutes from './routes'
//import Login from './pages/Login'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
