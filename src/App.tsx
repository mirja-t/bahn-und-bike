import "./App.scss";
import { selectTheme, useAppDispatch } from "./AppSlice";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Privacy } from "./components/privacy/Privacy";
import { Imprint } from "./components/imprint/Imprint";
import { Container } from "./components/container/Container";
import ErrorBoundary from "./components/stateless/errorBoundary/ErrorBoundary";
import {
    setActiveSection,
    setCurrentTrainroutes,
    setTrainroutesAlongVeloroute,
} from "./components/map/trainroutes/TrainroutesSlice";
import {
    setActiveVeloroute,
    setActiveVelorouteSection,
} from "./components/map/veloroutes/VeloroutesSlice";
export function App() {
    const theme = useSelector(selectTheme);
    const dispatch = useAppDispatch();
    const resetState = () => {
        dispatch(setCurrentTrainroutes([]));
        dispatch(setActiveSection(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setTrainroutesAlongVeloroute([]));
    };

    return (
        <div className={`App theme-${theme}`}>
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Container />} />
                    <Route
                        path="datenschutz"
                        element={<Privacy resetState={resetState} />}
                    />
                    <Route
                        path="impressum"
                        element={<Imprint resetState={resetState} />}
                    />
                </Routes>
            </ErrorBoundary>
        </div>
    );
}
