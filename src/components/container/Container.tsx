import styles from "./container.module.scss";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { DestinationDetails } from "../destinationDetails/DestinationDetails";
import { VelorouteDetails } from "../velorouteDetails/VelorouteDetails";
import { CombinedVelorouteDetails } from "../cominedVelorouteDetails/CombinedVelorouteDetails";
import {
    setActiveSection,
    setTrainroutesAlongVeloroute,
    selectStartPos,
    loadTrainroutes,
    selectCurrentTrainroutes,
    setCurrentTrainroutes,
    selectTrainrouteListLoading,
} from "../map/trainroutes/TrainroutesSlice";
import {
    loadVeloroutes,
    selectActiveVeloroute,
    selectVelorouteList,
    setActiveVeloroute,
    setActiveVelorouteSection,
    setPreviewVeloroute,
    setVelorouteList,
} from "../map/veloroutes/VeloroutesSlice";
import { Map } from "../map/Map";
import {
    selectActiveTab,
    selectSubmitValue,
    setActiveTab,
    setSubmitValue,
    setUserScale,
    useAppDispatch,
    type TabIds,
} from "../../AppSlice";
import { Panel } from "../stateless/panel/Panel";
import Tabs from "../stateless/tabs/Tabs";
import { TrainlineDetails } from "../trainlineDetails/TrainlineDetails";
import { useResponsiveSize } from "../../hooks/useResponsiveSize";
import { useTranslation } from "../../utils/i18n";
import { TravelDuration } from "../form/TravelDuration";
import { Instructions } from "../instructions/Instructions";
import LayoutWithSidebar from "../../layout/LayoutWithSidebar";
import { motion, AnimatePresence } from "framer-motion";

export const Container = () => {
    const dispatch = useAppDispatch();
    const start = useSelector(selectStartPos);
    const veloroutes = useSelector(selectVelorouteList);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const trainRoutes = useSelector(selectCurrentTrainroutes);
    const submitValue = useSelector(selectSubmitValue);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { height: sidebarHeight } = useResponsiveSize(sidebarRef.current);
    const activeTabId = useSelector(selectActiveTab);
    const journeys = useSelector(selectCurrentTrainroutes);
    const isLoading = useSelector(selectTrainrouteListLoading);
    const { t } = useTranslation();

    const prevValue = useRef(0);

    const handleTabClick = (tabId: TabIds) => {
        if (tabId === "trainlines") {
            const stopIds = Array.from(
                new Set(
                    trainRoutes
                        .map((route) => route.stopIds)
                        .flat()
                        .filter((id) => id !== null && id !== undefined),
                ),
            );
            dispatch(setVelorouteList([]));
            dispatch(setActiveSection(null));
            dispatch(setActiveVeloroute(null));
            dispatch(setPreviewVeloroute(null));
            dispatch(setActiveVelorouteSection(null));
            dispatch(setTrainroutesAlongVeloroute([]));
            dispatch(loadVeloroutes(stopIds));
        }
        dispatch(setActiveTab(tabId));
    };

    const handleSubmit = (
        e: React.SubmitEvent,
        value: number,
        direct = true,
    ) => {
        e.preventDefault();
        prevValue.current = value;
        dispatch(setCurrentTrainroutes([]));
        dispatch(setActiveSection(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setPreviewVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setTrainroutesAlongVeloroute([]));
        dispatch(setVelorouteList([]));
        dispatch(setActiveTab("trainlines"));
        dispatch(loadTrainroutes({ start, value, direct }));
        dispatch(setUserScale("reset"));
        dispatch(setSubmitValue(value));
    };

    const handleTrainrouteSelect = () => {
        dispatch(setActiveTab("veloroutes"));
    };

    return (
        <LayoutWithSidebar>
            {submitValue > 0 && (
                <LayoutWithSidebar.Aside>
                    <Panel>
                        <div ref={sidebarRef}>
                            <Tabs
                                height={sidebarHeight.toString() + "px"}
                                activeTabId={activeTabId}
                                handleTabClick={handleTabClick}
                            >
                                <Tabs.Tab
                                    id="trainlines"
                                    name={t("trainconnections")}
                                >
                                    <TrainlineDetails
                                        fn={handleTrainrouteSelect}
                                    />
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id="veloroutes"
                                    name={t("bikeroutes")}
                                    disabled={veloroutes.length === 0}
                                >
                                    <DestinationDetails />
                                </Tabs.Tab>
                                <Tabs.Tab
                                    id="leg"
                                    name={t("routelegs")}
                                    disabled={!activeVeloroute}
                                >
                                    <VelorouteDetails />
                                    <CombinedVelorouteDetails />
                                </Tabs.Tab>
                            </Tabs>
                        </div>
                    </Panel>
                </LayoutWithSidebar.Aside>
            )}
            <LayoutWithSidebar.Main>
                <div className={styles.mapWrapper} ref={wrapperRef}>
                    <AnimatePresence>
                        {submitValue === 0 &&
                            !journeys.length &&
                            !isLoading && (
                                <motion.div
                                    style={{
                                        position: "absolute",
                                        zIndex: 999,
                                        alignSelf: "center",
                                        justifyContent: "center",
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{
                                        opacity: 0,
                                        transition: { duration: 0.5 },
                                    }}
                                >
                                    <Instructions />
                                </motion.div>
                            )}
                    </AnimatePresence>
                    <Map value={submitValue} />
                </div>
            </LayoutWithSidebar.Main>
            <LayoutWithSidebar.Bottom>
                <Panel>
                    <TravelDuration handleSubmit={handleSubmit} />
                </Panel>
            </LayoutWithSidebar.Bottom>
        </LayoutWithSidebar>
    );
};
