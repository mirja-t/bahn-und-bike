import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { getTime } from "../../utils/getTime";
import { selectLangCode, useAppDispatch } from "../../AppSlice";
import { useTranslation } from "../../utils/i18n";
import {
    selectVelorouteList,
    selectActiveVeloroute,
    setActiveVelorouteSection,
    loadVeloroute,
    type VelorouteList,
} from "../map/veloroutes/VeloroutesSlice";
import {
    selectActiveSection,
    setTrainroutesAlongVeloroute,
    type CurrentTrainroute,
    type ResponseTrainLine,
} from "../map/trainroutes/TrainroutesSlice";
import { PinIcon } from "../stateless/icons/PinIcon";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";
import { Collapse } from "../stateless/collapse/Collapse";
import { useFetchBatch } from "../../hooks/useFetchBatch";
import type { ActiveDestination } from "./DestinationDetailsSlice";
import { useMemo } from "react";
interface SectionProps {
    section: CurrentTrainroute;
}
const Section = ({ section }: SectionProps) => {
    const { t } = useTranslation();
    const langCode = useSelector(selectLangCode);

    const trainlineIds = useMemo(() => {
        const ids = section.trainlines
            .map((trainline) => trainline.trainline_id)
            .flat();
        if (section.connection) {
            ids.push(
                ...section.connection.connecting_trains.map(
                    (train) => train.trainline_id,
                ),
            );
        }
        return ids;
    }, [section]);
    const {
        assets: stops,
        loading: loadingStopNames,
        error: errorStopNames,
    } = useFetchBatch<ActiveDestination>(section.stopIds, "destinations");
    const {
        assets: trainlinesWithAgencyNames,
        loading: loadingTrainlinesWithAgencyNames,
        error: errorTrainlinesWithAgencyNames,
    } = useFetchBatch<ResponseTrainLine>(trainlineIds, "trainlines");

    return (
        <>
            <header>
                <div className="details-headline">
                    <PinIcon size="large">
                        <TrainIcon />
                    </PinIcon>
                    <div>
                        <h2>{section.name}</h2>
                        {loadingTrainlinesWithAgencyNames
                            ? "loading trainline info..."
                            : errorTrainlinesWithAgencyNames
                              ? "error loading trainline info"
                              : trainlinesWithAgencyNames.map(
                                    (trainline, idx) => (
                                        <div
                                            key={`${trainline.trainline_id}-${idx}`}
                                            className="trainline-info"
                                        >
                                            <span>
                                                {trainline.name}
                                                :&nbsp;
                                                {trainline.agency_name}
                                            </span>
                                        </div>
                                    ),
                                )}
                    </div>
                </div>
            </header>

            {section.dur && (
                <section className="section">
                    <div>
                        <h5>{t("traveltime")}</h5>
                        <p>{getTime(section.dur, langCode)}</p>
                    </div>
                </section>
            )}
            {loadingStopNames ? (
                "loading..."
            ) : errorStopNames ? (
                "error loading stop names"
            ) : (
                <Collapse title={`${t("journey")}`}>
                    <ol>
                        {stops.map((stop) => (
                            <li key={stop.id}>{stop.name}</li>
                        ))}
                    </ol>
                </Collapse>
            )}
        </>
    );
};
export const DestinationDetails = () => {
    const { t } = useTranslation();
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeSection = useSelector(selectActiveSection);
    const veloroutes = useSelector(selectVelorouteList);
    // to do: fix route for trainlines along veloroute, name and stopIds currently not working
    // const trainLinesAlongVeloroute = useSelector(
    //     selectTrainroutesAlongVeloroute,
    // );

    const dispatch = useAppDispatch();

    const setVelorouteActive = (vroute: VelorouteList[number]) => {
        if (vroute.len !== undefined) {
            dispatch(setTrainroutesAlongVeloroute([]));
            dispatch(setActiveVelorouteSection(null));
            dispatch(loadVeloroute(vroute as VelorouteList[number]));
        }
    };

    return (
        <div id="destination-details">
            <div id="destination" className="details">
                <>
                    {activeSection && <Section section={activeSection} />}
                    {/* {trainLinesAlongVeloroute.length > 0 &&
                        trainLinesAlongVeloroute.map((trainline) => (
                            <Section key={trainline.id} section={trainline} />
                        ))} */}
                    {/* if not direct connection */}
                    {activeSection && activeSection.connection && (
                        <section className="section">
                            <div>
                                <h5>{t("trainconnection")}</h5>
                                <p>{activeSection.connection.stop_name}</p>
                            </div>
                        </section>
                    )}

                    <section className="section">
                        <h5>{t("veloroutes")}</h5>
                        {veloroutes.length < 1 && <p>{`${t("nomatch")}`}</p>}
                        <ItemList
                            items={veloroutes}
                            activeId={activeVeloroute?.id}
                            fn={setVelorouteActive}
                            icon={<VelorouteIcon />}
                        />
                    </section>
                </>
            </div>
        </div>
    );
};
