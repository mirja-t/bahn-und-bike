import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "../../utils/i18n";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectActiveVelorouteStop,
    setActiveVelorouteStop,
    type VelorouteStop,
} from "../map/veloroutes/VeloroutesSlice";
import { ItemList } from "../stateless/itemlist/ItemList";
import { selectTrainroutesAlongVeloroute } from "../map/trainroutes/TrainroutesSlice";
import { useEffect, useState } from "react";
import { haversineDistance } from "../../utils/haversineDistance";

export const CombinedVelorouteDetails = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVeloroute !== null
            ? activeVeloroute.route[activeVelorouteSectionIdx]
            : null;
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const trainlinesAlongVeloroute = useSelector(
        selectTrainroutesAlongVeloroute,
    );
    const [startStation, endStation] = trainlinesAlongVeloroute;
    const [startVeloStop, endVeloStop] = [
        activeVelorouteSection?.leg.at(0) || null,
        activeVelorouteSection?.leg.at(-1) || null,
    ];

    const itemList = activeVelorouteSection
        ? activeVelorouteSection.leg.slice(1, -1).map((stop) => ({
              ...stop,
              id: stop.stop_id,
              name: stop.stop_name,
          }))
        : [];
    const hoverVeloStop = (item: VelorouteStop | null) => {
        if (item) {
            dispatch(setActiveVelorouteStop(item));
        } else {
            dispatch(setActiveVelorouteStop(null));
        }
    };

    type DestinationInfo = {
        destName: string;
        trainlines: string;
    };
    const [destinationNames, setDestinationNames] = useState<{
        start: DestinationInfo;
        end: DestinationInfo;
    }>({
        start: {
            destName: "",
            trainlines: "",
        },
        end: {
            destName: "",
            trainlines: "",
        },
    });

    const distanceToStartStation = haversineDistance(
        startVeloStop?.lat || 0,
        startVeloStop?.lon || 0,
        startStation?.firstStation?.lat || 0,
        startStation?.firstStation?.lon || 0,
    ).toFixed(2);
    const distanceToEndStation = haversineDistance(
        endVeloStop?.lat || 0,
        endVeloStop?.lon || 0,
        endStation?.firstStation?.lat || 0,
        endStation?.firstStation?.lon || 0,
    ).toFixed(2);

    useEffect(() => {
        if (!activeVelorouteSection) return;

        const abortController = new AbortController();
        let isCancelled = false;

        const fetchDestinationInfo = async (
            lat: number,
            lon: number,
            key: keyof typeof destinationNames = "start",
        ) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                    { signal: abortController.signal },
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                if (isCancelled) {
                    return;
                }

                const address = data.address ?? {};
                const destname =
                    address.suburb ||
                    address.village ||
                    address.town ||
                    address.city ||
                    address.hamlet ||
                    address.county ||
                    address.state_district ||
                    "";

                if (!destname) {
                    return;
                }

                setDestinationNames((prev) => ({
                    ...prev,
                    [key]: { ...prev[key], destName: destname },
                }));
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }
                // Swallow other errors to avoid breaking the UI; optionally log.
            }
        };

        const { lat: startLat, lon: startLon } =
            activeVelorouteSection.leg.at(0) || {};
        const { lat: endLat, lon: endLon } =
            activeVelorouteSection.leg.at(-1) || {};

        if (startLat !== undefined && startLon !== undefined) {
            fetchDestinationInfo(startLat, startLon, "start");
        }
        if (endLat !== undefined && endLon !== undefined) {
            fetchDestinationInfo(endLat, endLon, "end");
        }

        return () => {
            isCancelled = true;
            abortController.abort();
        };
    }, [activeVelorouteSection]);

    const sectionHeadline = (stop: VelorouteStop, idx: number) => (
        <>
            <h3 className="veloroute-trainstops">
                <div className="veloroutesection-icon">
                    <span>{idx})&nbsp;</span>
                </div>
                <span>
                    {idx === 1 ? t("from") : t("to")}&nbsp;
                    {idx === 1
                        ? startStation?.firstStation?.stop_name
                        : endStation?.firstStation?.stop_name}
                </span>
            </h3>
            <p
                style={{
                    marginBottom: "0.5em",
                    paddingLeft: "1em",
                    lineHeight: 1.2,
                }}
            >
                {t("nearesttrainstation")}:&nbsp;
                <br />
                {destinationNames[idx === 1 ? "start" : "end"].destName ||
                    stop.stop_name}
                <br />
                {startVeloStop && endVeloStop ? (
                    <>
                        {t("distanceToNextTrainstation")}:&nbsp;
                        <br />
                        {idx === 1
                            ? distanceToStartStation
                            : distanceToEndStation}{" "}
                        km
                    </>
                ) : null}
            </p>
        </>
    );
    return (
        <div id="veloroute-details">
            <div id="veloroute" className="details">
                {activeVelorouteSection !== null && (
                    <section className="veloroute-details veloroute-section-details">
                        <h5>{`${t("leg")}`}</h5>
                        {sectionHeadline(activeVelorouteSection.leg[0], 1)}
                        {sectionHeadline(
                            activeVelorouteSection.leg[
                                activeVelorouteSection.leg.length - 1
                            ],
                            2,
                        )}
                        {activeVelorouteSection.leg.length > 2 && (
                            <>
                                <h6>{t("via")}</h6>
                                <ItemList
                                    variant="orderedList"
                                    items={itemList}
                                    onHover={hoverVeloStop}
                                    activeId={
                                        activeVelorouteStop
                                            ? activeVelorouteStop?.stop_id
                                            : ""
                                    }
                                />
                            </>
                        )}
                        <h6>{t("distance")}</h6>
                        <p>{activeVelorouteSection.dist} km</p>
                    </section>
                )}
            </div>
        </div>
    );
};
