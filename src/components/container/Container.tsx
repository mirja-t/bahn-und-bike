import styles from "./container.module.scss";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { DestinationDetails } from "../destinationDetails/DestinationDetails";
import { VelorouteDetails } from "../velorouteDetails/VelorouteDetails";
import { VelorouteLegDetails } from "../cominedVelorouteDetails/VelorouteLegDetails";
import {
    setActiveSection,
    setTrainroutesAlongVeloroute,
    selectStartPos,
    setTrainroutesLoading,
    setTrainroutesError,
    setIsDirect,
    setTrainTravelDuration,
    selectIsDirect,
    selectTrainTravelDuration,
} from "../map/trainroutes/TrainroutesSlice";
import {
    selectActiveVelorouteId,
    selectVelorouteList,
    setActiveVelorouteId,
    setActiveVelorouteSectionIdx,
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
import { Collapse } from "../stateless/collapse/Collapse";
import { useTrainroutesQuery } from "@/api/useTrainroutesQuery";

export const Container = () => {
    const dispatch = useAppDispatch();
    const veloroutes = useSelector(selectVelorouteList);
    const activeVelorouteId = useSelector(selectActiveVelorouteId);
    const submitValue = useSelector(selectSubmitValue);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { height: sidebarHeight } = useResponsiveSize(sidebarRef.current);
    const activeTabId = useSelector(selectActiveTab);
    const { t } = useTranslation();
    const startPos = useSelector(selectStartPos);
    const isDirect = useSelector(selectIsDirect);
    const travelDuration = useSelector(selectTrainTravelDuration);

    const prevValue = useRef(0);

    const {
        data: trainroutesQueryData,
        isLoading,
        isFetching,
        isError,
    } = useTrainroutesQuery({
        start: startPos,
        value: travelDuration,
        direct: isDirect,
    });

    useEffect(() => {
        dispatch(setTrainroutesLoading(isFetching));
    }, [isFetching, dispatch]);

    useEffect(() => {
        dispatch(setTrainroutesError(isError));
    }, [isError, dispatch]);

    const handleTabClick = (tabId: TabIds) => {
        if (tabId === "trainlines") {
            dispatch(setVelorouteList([]));
            dispatch(setActiveSection(null));
            dispatch(setActiveVelorouteId(null));
            dispatch(setActiveVelorouteSectionIdx(null));
            dispatch(setTrainroutesAlongVeloroute([]));
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
        dispatch(setActiveSection(null));
        dispatch(setActiveVelorouteId(null));
        dispatch(setActiveVelorouteSectionIdx(null));
        dispatch(setTrainroutesAlongVeloroute([]));
        dispatch(setVelorouteList([]));
        dispatch(setActiveTab("trainlines"));
        dispatch(setIsDirect(direct));
        dispatch(setTrainTravelDuration(value));
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
                        <div className={styles.sidebarWrapper} ref={sidebarRef}>
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
                                    disabled={!activeVelorouteId}
                                >
                                    <VelorouteDetails />
                                    <VelorouteLegDetails />
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
                            !trainroutesQueryData?.currentTrainroutes.length &&
                            !isLoading && (
                                <motion.div
                                    className={styles.instructionsOverlay}
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
                    <Collapse title="" variant="minify" open={true}>
                        <TravelDuration handleSubmit={handleSubmit} />
                    </Collapse>
                </Panel>
            </LayoutWithSidebar.Bottom>
        </LayoutWithSidebar>
    );
};
