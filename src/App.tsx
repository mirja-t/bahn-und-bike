import "./App.scss";
import { selectTheme, useAppDispatch } from "./AppSlice";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Privacy } from "./components/privacy/Privacy";
import { Imprint } from "./components/imprint/Imprint";
import { Container } from "./components/container/Container";
import ErrorBoundary from "./components/stateless/errorBoundary/ErrorBoundary";

export function App() {
    const theme = useSelector(selectTheme);

    return (
        <div className={`App theme-${theme}`}>
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Container />} />
                    <Route path="datenschutz" element={<Privacy />} />
                    <Route path="impressum" element={<Imprint />} />
                </Routes>
            </ErrorBoundary>
        </div>
    );
}
