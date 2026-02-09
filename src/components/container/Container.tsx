import "./container.scss";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { DestinationDetails } from "../destinationDetails/DestinationDetails";
import { VelorouteDetails } from "../velorouteDetails/VelorouteDetails";
import { CombinedVelorouteDetails } from "../cominedVelorouteDetails/CombinedVelorouteDetails";
import {
    setActiveSection,
    setTrainLinesAlongVeloroute,
    selectStartPos,
    loadTrainroutes,
} from "../map/trainroutes/TrainroutesSlice";
import {
    setActiveVeloroute,
    setActiveVelorouteSection,
} from "../map/veloroutes/VeloroutesSlice";
import { mapRatio } from "../../utils/svgMap";
import { TravelDuration } from "../form/TravelDuration";
import { Map } from "../map/Map";
import { useAppDispatch, type LangCode } from "../../AppSlice";
import { Panel } from "../stateless/panel/Panel";
import Tabs from "../stateless/tabs/Tabs";

interface ContainerProps {
    lang: LangCode;
}

export const Container = ({ lang }: ContainerProps) => {
    const dispatch = useAppDispatch();
    // const activeSection = useSelector(selectActiveSection);
    // const activeVeloroute = useSelector(selectActiveVeloroute);
    // const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    // const activeVelorouteSection =
    //     activeVelorouteSectionIdx !== null && activeVeloroute !== null
    //         ? activeVeloroute.route[activeVelorouteSectionIdx]
    //         : null;
    const start = useSelector(selectStartPos);
    const [submitVal, setSubmitVal] = useState(0);
    const [mapSize, setMapSize] = useState<[number, number]>([0, 0]);
    const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
    const [userScale, setUserScale] = useState(1);

    const container = useRef<HTMLDivElement | null>(null);
    const prevValue = useRef(0);

    const memoizedMapSize = useMemo(() => mapSize, [mapSize]);
    const memoizedZoomMap = useCallback(
        (dir: "+" | "-") => {
            const factor = dir === "+" ? 1 : -1;
            setUserScale(userScale + factor * 0.2);
        },
        [userScale],
    );

    const handleSubmit = (
        e: React.SubmitEvent,
        value: number,
        direct = true,
    ) => {
        e.preventDefault();
        prevValue.current = value;
        dispatch(setActiveSection(null));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setTrainLinesAlongVeloroute([]));
        setUserScale(1);
        dispatch(loadTrainroutes({ start, value, direct }));
        setSubmitVal(value);
    };

    useEffect(() => {
        if (!wrapper) return;

        const setSize = () => {
            const width = wrapper.getBoundingClientRect().width;
            const height = width / mapRatio;
            setMapSize([width, height]);
        };

        setSize();
        window.addEventListener("resize", setSize);
        return () => {
            window.removeEventListener("resize", setSize);
        };
    }, [wrapper]);

    return (
        <>
            <div id="container" ref={container}>
                <div
                    className="box"
                    style={{
                        position: "relative",
                        zIndex: 2,
                        height: "100%",
                    }}
                >
                    <Panel>
                        <aside className="destination-details-container">
                            <Tabs>
                                <Tabs.Tab id="trainlines" name="Bahnlinien">
                                    Bahnlinien
                                </Tabs.Tab>
                                <Tabs.Tab id="destination" name="Radwege">
                                    <DestinationDetails lang={lang} />
                                </Tabs.Tab>
                                <Tabs.Tab id="veloroute" name="Abschnitte">
                                    <VelorouteDetails lang={lang} />
                                    <CombinedVelorouteDetails lang={lang} />
                                </Tabs.Tab>
                            </Tabs>
                        </aside>
                    </Panel>
                </div>
                <main>
                    <div id="map-wrapper" ref={setWrapper}>
                        <Map
                            value={submitVal}
                            mapSize={memoizedMapSize}
                            mapContainer={wrapper}
                            lang={lang}
                            fn={memoizedZoomMap}
                            userScale={userScale}
                        />
                    </div>
                </main>
            </div>
            <div className="box">
                <Panel>
                    <TravelDuration handleSubmit={handleSubmit} lang={lang} />
                </Panel>
            </div>
        </>
    );
};
