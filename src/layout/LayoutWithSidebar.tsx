import styles from "./layoutWithSidebar.module.scss";
import { Link, NavLink } from "react-router-dom";
import { Panel } from "../components/stateless/panel/Panel";
import { Logo } from "../components/stateless/header/logo/Logo";
import {
    LangCode,
    resetAppStateThunk,
    selectLangCode,
    setLangCode,
    useAppDispatch,
} from "../AppSlice";
import { Switcher } from "../components/form/switcher/Switcher";
import { useSelector } from "react-redux";
import { Header } from "../components/stateless/header/Header";
import { Footer } from "../components/stateless/footer/Footer";
import { Select } from "../components/stateless/select/Select";
import { loadDestinations } from "../components/destinationDetails/DestinationDetailsSlice";
import { useEffect } from "react";

const Main = ({ children }: { children: React.ReactNode }) => {
    return <main className={styles.main}>{children}</main>;
};
const Aside = ({ children }: { children: React.ReactNode }) => {
    return <aside className={styles.aside}>{children}</aside>;
};
const Bottom = ({ children }: { children: React.ReactNode }) => {
    return <div className={styles.bottom}>{children}</div>;
};
const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const langCode = useSelector(selectLangCode);
    const handlePopulationChange = (value: string) => {
        const numericValue = parseInt(value.replace(/[^\d]/g, ""), 10);
        dispatch(loadDestinations({ population: numericValue }));
    };
    const options = [
        { value: "> 1000000", label: "> 1,000,000" },
        { value: "> 500000", label: "> 500,000" },
        { value: "> 100000", label: "> 100,000" },
    ];
    useEffect(() => {
        dispatch(loadDestinations({ population: 1000000 }));
    }, [dispatch]);

    return (
        <div className={styles.wrapper}>
            <Header>
                <Link
                    to="/"
                    title={
                        langCode === LangCode.DE
                            ? "Zur Startseite"
                            : "Back to Homepage"
                    }
                    onClick={resetAppStateThunk}
                >
                    <Logo />
                </Link>
                <Panel>
                    <nav className={styles.navigation}>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Routefinder
                        </NavLink>
                    </nav>
                    <Select
                        label="Cities"
                        name="cities"
                        options={options}
                        preselectedValue={options[0].value}
                        onChange={handlePopulationChange}
                    />
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
                </Panel>
            </Header>
            <div className={styles.container}>{children}</div>
            <Footer>
                <Link to="/datenschutz">
                    {langCode === LangCode.DE ? "Datenschutz" : "Privacy"}
                </Link>
                &nbsp;&nbsp;
                <Link to="/impressum">
                    {langCode === LangCode.DE ? "Impressum" : "Legal Notes"}
                </Link>
            </Footer>
        </div>
    );
};
export default Object.assign(LayoutWithSidebar, {
    Main,
    Aside,
    Bottom,
});
