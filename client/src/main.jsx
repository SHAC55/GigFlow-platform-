import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { GigProvider } from "./context/GigContext";
import { NotificationProvider } from "./context/NotificationContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <GigProvider>
        <NotificationProvider>
        <App />
        </NotificationProvider>
      </GigProvider>
    </AuthProvider>
  </BrowserRouter>
);
