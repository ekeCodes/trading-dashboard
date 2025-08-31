import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SymbolProvider } from "./context/SymbolContext.tsx";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SymbolProvider>
      <App />
    </SymbolProvider>
  </StrictMode>
);
