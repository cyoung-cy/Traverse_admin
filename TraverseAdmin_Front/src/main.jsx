import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          bottom: 40,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "white",
            padding: "16px",
            borderRadius: "10px",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "black",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "black",
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
