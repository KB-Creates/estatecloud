import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"

import "./index.css"
import App from "./App"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <App />
          <Toaster position="bottom-center" />
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
)