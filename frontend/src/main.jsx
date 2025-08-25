import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Context, LoginContext } from "./context/LoginContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Context>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Context>
  </StrictMode>
);
