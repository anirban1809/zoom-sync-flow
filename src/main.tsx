import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider
        clientId={
            "358321016708-5t1irg3vrfeeb1ujf6jaenso1rnrlgbf.apps.googleusercontent.com"
        }
    >
        <App />
    </GoogleOAuthProvider>
);
