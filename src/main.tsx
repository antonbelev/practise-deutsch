import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ProgressProvider } from "./state/progress";
import { ThemeProvider } from "./state/theme";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* HashRouter keeps deep links working on any plain static host */}
    <HashRouter>
      <ThemeProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
);
