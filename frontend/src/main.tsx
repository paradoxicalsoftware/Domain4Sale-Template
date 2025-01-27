import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {ColorModeProvider} from "./ColorModeContext.tsx";
import {CssBaseline} from "@mui/material";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ColorModeProvider>
          <CssBaseline />
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </ColorModeProvider>
  </StrictMode>,
)
