import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { LoaderProvider } from "./contexts/LoaderContext";
import { ToastProvider } from "./contexts/ToastContext";

import "./styles/global.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </ToastProvider>
  </React.StrictMode>
);
