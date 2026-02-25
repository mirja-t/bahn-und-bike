import "./App.scss";
import {
    selectTheme,
    setTheme,
    LangCode,
    Theme,
    useAppDispatch,
    setLangCode,
    selectLangCode,
} from "./AppSlice";
import { useEffect, useState } from "react";
import { Header } from "./components/stateless/header/Header";
import { useSelector } from "react-redux";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Switcher } from "./components/form/switcher/Switcher";
import { Logo } from "./components/stateless/header/logo/Logo";
import {
    setActiveSection,
    setCurrentTrainroutes,
    setTrainroutesAlongVeloroute,
} from "./components/map/trainroutes/TrainroutesSlice";
import {
    setActiveVeloroute,
    setActiveVelorouteSection,
} from "./components/map/veloroutes/VeloroutesSlice";
import { Footer } from "./components/stateless/footer/Footer";
import { Home } from "./components/home/Home";
import { Privacy } from "./components/privacy/Privacy";
import { Imprint } from "./components/imprint/Imprint";
import { Container } from "./components/container/Container";
import { Panel } from "./components/stateless/panel/Panel";
import { Select } from "./components/stateless/select/Select";
import ErrorBoundary from "./components/stateless/errorBoundary/ErrorBoundary";
export function App() {
    const theme = useSelector(selectTheme);
    const [classes, setClasses] = useState("");
    const location = useLocation();
    const dispatch = useAppDispatch();
    const langCode = useSelector(selectLangCode);

    const setPageTheme = (value: Theme) => {
        dispatch(setTheme(value));
    };

    useEffect(() => {
        const lastSlugSegment = location.pathname.match(/[^\/]*$/);
        const classNames =
            location.pathname === "/"
                ? "home"
                : lastSlugSegment
                  ? lastSlugSegment[0]
                  : "";
        setClasses(classNames);
    }, [location]);

    const resetState = () => {
        dispatch(setCurrentTrainroutes([]));
        dispatch(setActiveSection(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setTrainroutesAlongVeloroute([]));
    };

    return (
        <ErrorBoundary>
            <div className={`App theme-${theme}`}>
                <div id="wrapper" className={classes}>
                    <Header>
                        <Link
                            to="/"
                            title={
                                langCode === LangCode.DE
                                    ? "Zur Startseite"
                                    : "Back to Homepage"
                            }
                            onClick={resetState}
                        >
                            <Logo />
                        </Link>
                        <Panel>
                            <Switcher
                                setValue={(langCode: LangCode) =>
                                    dispatch(setLangCode(langCode))
                                }
                                values={[
                                    {
                                        value: LangCode.DE,
                                        label: "de",
                                    },
                                    {
                                        value: LangCode.EN,
                                        label: "en",
                                    },
                                ]}
                            />
                            <Select
                                options={[
                                    { label: "light", value: "light" },
                                    { label: "dark", value: "dark" },
                                ]}
                                name={"Select Theme"}
                                preselectedValue={theme}
                                onChange={setPageTheme}
                                label="theme"
                            />
                        </Panel>
                    </Header>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="routefinder"
                            element={<Container lang={langCode} />}
                        />
                        <Route
                            path="datenschutz"
                            element={<Privacy resetState={resetState} />}
                        />
                        <Route
                            path="impressum"
                            element={<Imprint resetState={resetState} />}
                        />
                    </Routes>
                    <Footer>
                        <Link to="datenschutz">
                            {langCode === LangCode.DE
                                ? "Datenschutz"
                                : "Privacy"}
                        </Link>
                        &nbsp;&nbsp;
                        <Link to="impressum">
                            {langCode === LangCode.DE
                                ? "Impressum"
                                : "Legal Notes"}
                        </Link>
                    </Footer>
                </div>
            </div>
        </ErrorBoundary>
    );
}
