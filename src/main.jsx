import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

// Guard against Vite HMR re-running this module and calling
// createRoot() again on the same #root element (dev-mode only warning,
// harmless but noisy in the console).
const container = document.getElementById("root");
const root = container._reactRoot || (container._reactRoot = ReactDOM.createRoot(container));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);