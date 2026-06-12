import { createRoot } from "react-dom/client";
import { StrictMode, Suspense } from "react";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./store.tsx";

const queryClient = new QueryClient();
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
                    <QueryClientProvider client={queryClient}>
                        <HashRouter>
                            <App />
                        </HashRouter>
                    </QueryClientProvider>
                </Provider>
            </Suspense>
        </ErrorBoundary>
    </StrictMode>,
);
