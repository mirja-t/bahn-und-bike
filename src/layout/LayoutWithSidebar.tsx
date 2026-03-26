import styles from "./layoutWithSidebar.module.scss";
import { Link } from "react-router";
import { Panel } from "../components/stateless/panel/Panel";
import { Logo } from "../components/stateless/header/logo/Logo";
import {
    LangCode,
    selectLangCode,
    setLangCode,
    useAppDispatch,
} from "../AppSlice";
import { Switcher } from "../components/form/switcher/Switcher";
import { useSelector } from "react-redux";
import {
    setActiveSection,
    setCurrentTrainroutes,
    setTrainroutesAlongVeloroute,
} from "../components/map/trainroutes/TrainroutesSlice";
import {
    setActiveVeloroute,
    setActiveVelorouteSection,
} from "../components/map/veloroutes/VeloroutesSlice";
import { Header } from "../components/stateless/header/Header";
import { Footer } from "../components/stateless/footer/Footer";

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

    const resetState = () => {
        dispatch(setCurrentTrainroutes([]));
        dispatch(setActiveSection(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setTrainroutesAlongVeloroute([]));
    };

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
