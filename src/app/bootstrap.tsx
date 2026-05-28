import ReactDOM from "react-dom/client";
import { GameShell } from "./GameShell";
import "./gameShell.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Missing root element");
}

ReactDOM.createRoot(rootElement).render(<GameShell />);
