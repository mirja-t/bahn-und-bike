import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { getTime } from "../../utils/getTime";
import { type LangCode, selectLang, useAppDispatch } from "../../AppSlice";
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
} from "../map/trainroutes/TrainroutesSlice";
import { PinIcon } from "../stateless/icons/PinIcon";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";
import { Fragment } from "react";

interface DestinationDetailsProps {
    lang: LangCode;
}

export const DestinationDetails = ({ lang }: DestinationDetailsProps) => {
    const labels = useSelector(selectLang);
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
                        <Fragment key={idx}>
                            <header>
                                <div className="details-headline">
                                    <PinIcon size="large">
                                        <TrainIcon />
                                    </PinIcon>
                                    <h2>{section.name}</h2>
                                </div>
                            </header>

                            <section className="section">
                                <div>
                                    <h5>{labels[lang].traveltime}</h5>
                                    <p>{getTime(section.dur, lang)}</p>
                                </div>
                            </section>
                        </Fragment>
                    ))}

                    {activeSection && activeSection.connection && (
                        <section className="section">
                            <div>
                                <h5>{labels[lang].trainconnection}</h5>
                                {activeSection && (
                                    <p>{activeSection.connection.stop_name}</p>
                                )}
                            </div>
                        </section>
                    )}

                    <section className="section">
                        <h5>{labels[lang].veloroutes}</h5>
                        {veloroutes.length < 1 && (
                            <p>{`${labels[lang].nomatch}`}</p>
                        )}
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
