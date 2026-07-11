import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/index.css";

// Dynamic Favicon Crop Logic (Extract JEA logo without text)
const img = new Image();
img.src = "/logo.png";
img.onload = () => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height * 0.58, 0, 0, 64, 64);
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = canvas.toDataURL("image/png");
    }
  } catch (e) {
    console.error("Failed to crop favicon:", e);
  }
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
