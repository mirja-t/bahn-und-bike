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
    selectTrainroutesAlongVeloroute,
    setTrainroutesAlongVeloroute,
    type CurrentTrainroute,
    type Train,
} from "../map/trainroutes/TrainroutesSlice";
import { PinIcon } from "../stateless/icons/PinIcon";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";
import { Collapse } from "../stateless/collapse/Collapse";
import { useStopNames } from "../../hooks/useStopNames";
import { useAgencyNames } from "../../hooks/useAgencyNames";

interface TrainInfoProps {
    trainline: Train;
}
const TrainInfo = ({ trainline }: TrainInfoProps) => {
    const { agencyName, loading, error } = useAgencyNames(
        trainline.trainline_id,
    );

    if (loading) return <span>Loading...</span>;
    if (error) return <span>Error loading trainline</span>;

    return (
        <div className="trainline-info">
            <span>
                {trainline.trainline_name}:&nbsp;{agencyName}
            </span>
        </div>
    );
};
interface SectionProps {
    section: CurrentTrainroute;
}
const Section = ({ section }: SectionProps) => {
    const { t } = useTranslation();
    const langCode = useSelector(selectLangCode);
    const { names: stopNames, loading, error } = useStopNames(section.stopIds);
    return (
        <>
            <header>
                <div className="details-headline">
                    <PinIcon size="large">
                        <TrainIcon />
                    </PinIcon>
                    <div>
                        <h2>{section.name}</h2>
                        {section.trainlines.map((trainline) => (
                            <TrainInfo
                                key={trainline.trainline_id}
                                trainline={trainline}
                            />
                        ))}
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
            {loading ? (
                "loading..."
            ) : error ? (
                "error loading stop names"
            ) : (
                <Collapse title={`${t("journey")}`}>
                    <ol>
                        {section.stopIds.map((id) => (
                            <li key={id}>{stopNames[id]}</li>
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
    const trainLinesAlongVeloroute = useSelector(
        selectTrainroutesAlongVeloroute,
    );

    const dispatch = useAppDispatch();

    const setVelorouteActive = (vroute: VelorouteList[number]) => {
        if (vroute.len !== undefined) {
            dispatch(setTrainroutesAlongVeloroute([]));
            dispatch(setActiveVelorouteSection(null));
            dispatch(loadVeloroute(vroute as VelorouteList[number]));
        }
    };
    const trainSections = activeSection
        ? [activeSection]
        : [...trainLinesAlongVeloroute];

    return (
        <div id="destination-details">
            <div id="destination" className="details">
                <>
                    {trainSections.map((section, idx) => (
                        <Section key={idx} section={section} />
                    ))}

                    {activeSection && activeSection.connection && (
                        <section className="section">
                            <div>
                                <h5>{t("trainconnection")}</h5>
                                {activeSection && (
                                    <p>{activeSection.connection.stop_name}</p>
                                )}
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
