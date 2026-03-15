import { createRoot } from "react-dom/client";
import { StrictMode, Suspense } from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.tsx";
import { App } from "./App.tsx";
import "./index.scss";
import ErrorBoundary from "./components/stateless/errorBoundary/ErrorBoundary.tsx";
import { Spinner } from "./components/stateless/spinner/Spinner.tsx";

const root = document.getElementById("root") as HTMLElement;
createRoot(root).render(
    <StrictMode>
        <ErrorBoundary>
            <Suspense fallback={<Spinner />}>
                <Provider store={store}>
                    <HashRouter>
                        <App />
                    </HashRouter>
                </Provider>
            </Suspense>
        </ErrorBoundary>
    </StrictMode>,
);
