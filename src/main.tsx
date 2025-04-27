import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WebApp } from "./telegram/telegram";

// WebApp.lockOrientation();
// WebApp.disableVerticalSwipes();
// WebApp.enableClosingConfirmation();
// WebApp.requestFullscreen();

createRoot(document.getElementById("root")!).render(<App />);
