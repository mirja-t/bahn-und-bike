import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { getTime } from "../../utils/getTime";
import { selectLangCode, useAppDispatch } from "../../AppSlice";
import { useTranslation } from "../../utils/i18n";
import {
    selectActiveVelorouteId,
    setActiveVelorouteId,
    setActiveVelorouteSectionIdx,
    type VelorouteListItem,
} from "../map/veloroutes/VeloroutesSlice";
import {
    selectActiveSectionId,
    setActiveSpot,
    type CurrentTrainroute,
    type ResponseTrainLine,
    type Trainstop,
} from "../map/trainroutes/TrainroutesSlice";
import { PinIcon } from "../stateless/icons/PinIcon";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";
import { Collapse } from "../stateless/collapse/Collapse";
import { useFetchBatch } from "../../hooks/useFetchBatch";
import { type Destination } from "./DestinationDetailsSlice";
import { Fragment, useMemo } from "react";
import { Loading } from "../stateless/loading/Loading";
import { Error } from "../stateless/error/Error";
import { Tooltip } from "../stateless/tooltip/Tooltip";
import { useVeloroutesQuery } from "@/api/useVeloroutesQuery";
import { useTrainroutesAlongVelorouteSectionQuery } from "@/api/useTrainroutesAlongVelorouteSectionQuery";
import { useTrainroutesQuery } from "@/api/useTrainroutesQuery";
interface SectionProps {
    section: CurrentTrainroute;
}
const Section = ({ section }: SectionProps) => {
    const { t } = useTranslation();
    const langCode = useSelector(selectLangCode);
    const dispatch = useAppDispatch();

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
        assets: trainlinesWithAgencyNames,
        loading: loadingTrainlinesWithAgencyNames,
        error: errorTrainlinesWithAgencyNames,
    } = useFetchBatch<ResponseTrainLine>(trainlineIds, "trainlines");

    const handleTrainstationHover = (stop: Trainstop | null) => {
        if (!stop) {
            dispatch(setActiveSpot(null));
            return;
        }
        dispatch(setActiveSpot(stop));
    };
    const items: Destination<Trainstop>[] = useMemo(
        () =>
            section.routestops
                .filter((stop) => stop.stop_number !== null)
                .map((stop) => ({
                    ...stop,
                    id: stop.station_id,
                    name: stop.station_name || "",
                })),
        [section.routestops],
    );

    return (
        <>
            <header>
                <div className="details-headline">
                    <PinIcon size="large">
                        <TrainIcon />
                    </PinIcon>
                    <div>
                        <h2 className="h3">{section.name}</h2>
                        {loadingTrainlinesWithAgencyNames ? (
                            <Loading />
                        ) : errorTrainlinesWithAgencyNames ? (
                            <Error />
                        ) : (
                            trainlinesWithAgencyNames.map(
                                // to do: find out why there are duplicates
                                (trainline, idx) => (
                                    <span key={`${trainline.id}-${idx}`}>
                                        <Tooltip
                                            className="small"
                                            content={
                                                <div className="tooltip">
                                                    {trainline.agency_name}
                                                </div>
                                            }
                                        >
                                            {trainline.name}
                                            {idx <
                                                trainlinesWithAgencyNames.length -
                                                    1 && ", "}
                                        </Tooltip>
                                    </span>
                                ),
                            )
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
            <Collapse title={`${t("journey")}`}>
                <ItemList
                    onHover={handleTrainstationHover}
                    items={items}
                    variant="orderedList"
                />
            </Collapse>
            <hr style={{ marginTop: ".75em" }} />
        </>
    );
};
export const DestinationDetails = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const activeVelorouteId = useSelector(selectActiveVelorouteId);
    const activeSectionId = useSelector(selectActiveSectionId);
    const { data: trainroutesData } = useTrainroutesQuery();
    const trainroutes = trainroutesData?.currentTrainroutes;
    const activeSection = trainroutes?.find(
        (section) => section.id === activeSectionId,
    );
    const { data: veloroutes } = useVeloroutesQuery();

    const setVelorouteId = (vroute: VelorouteListItem) => {
        if (vroute !== undefined) {
            dispatch(setActiveVelorouteSectionIdx(null));
            dispatch(setActiveVelorouteId(vroute.id));
        }
    };
    const { data: trainlinesAlongVeloroute } =
        useTrainroutesAlongVelorouteSectionQuery();

    return (
        <div id="destination-details">
            <div id="destination" className="details">
                <div className="train-details">
                    {activeSection && <Section section={activeSection} />}
                    {trainlinesAlongVeloroute &&
                        trainlinesAlongVeloroute.map((trainline) => (
                            <Fragment key={trainline.id}>
                                <Section section={trainline} />
                            </Fragment>
                        ))}
                    {/* if not direct connection */}
                    {activeSection && activeSection.connection && (
                        <section className="section">
                            <div>
                                <h5>{t("trainconnection")}</h5>
                                <p>{activeSection.connection.station_name}</p>
                            </div>
                        </section>
                    )}

                    <section className="section veloroute-details">
                        <h5>{t("veloroutes")}</h5>
                        {veloroutes && veloroutes.length < 1 && (
                            <p>{`${t("nomatch")}`}</p>
                        )}
                        {veloroutes && (
                            <ItemList
                                items={veloroutes}
                                activeId={activeVelorouteId || ""}
                                onClick={setVelorouteId}
                                icon={<VelorouteIcon />}
                            />
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};
