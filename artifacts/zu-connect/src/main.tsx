import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.documentElement.dir = "rtl";

const stored = localStorage.getItem("theme") as "light" | "dark" | null;
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const theme = stored ?? (prefersDark ? "dark" : "light");
document.documentElement.classList.toggle("dark", theme === "dark");

createRoot(document.getElementById("root")!).render(<App />);