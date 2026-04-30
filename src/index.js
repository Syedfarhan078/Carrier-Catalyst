import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/global.css";
import "./styles/premium.css";
import "./styles/Homepage.css";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById("root");

if (container.hasChildNodes()) {
  hydrateRoot(
    container,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Register service worker for offline caching and fast loads
serviceWorkerRegistration.register();
