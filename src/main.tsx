import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.tsx";
import { App } from "./App.tsx";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <HashRouter>
                <App />
            </HashRouter>
        </Provider>
    </StrictMode>,
);
