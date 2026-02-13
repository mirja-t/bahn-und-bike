import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { getTime } from "../../utils/getTime";
import { type LangCode, selectLang, useAppDispatch } from "../../AppSlice";
import {
    selectVelorouteList,
    selectActiveVeloroute,
    setActiveVelorouteSection,
    loadVeloroute,
    type Veloroute,
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
    setActiveTabId?: (id: string) => void;
}

export const DestinationDetails = ({
    lang,
    setActiveTabId,
}: DestinationDetailsProps) => {
    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeSection = useSelector(selectActiveSection);
    const veloroutes = useSelector(selectVelorouteList);
    const trainLinesAlongVeloroute = useSelector(
        selectTrainroutesAlongVeloroute,
    );

    const getHeadline = (section: typeof activeSection) =>
        section
            ? `${section?.trainlines.join(", ")}: ${labels[lang].to} ${section?.lastStation.stop_name}`
            : null;
    const trainList =
        activeSection &&
        activeSection.trainlines.map((train, idx) => (
            <span key={idx} className="train">
                {train}
            </span>
        ));

    const initialTrains =
        activeSection &&
        activeSection.connection &&
        activeSection.connection.initial_trains.map((train, idx) => (
            <span key={idx} className="train">
                {train}
            </span>
        ));
    const connectingTrain = activeSection && activeSection.connection && (
        <span className="train">
            {activeSection.connection.connecting_train}
        </span>
    );
    const train =
        activeSection && activeSection.connection ? (
            <>
                {initialTrains}
                <span className="train connection"> + </span>
                {connectingTrain}
            </>
        ) : (
            trainList
        );

    const dispatch = useAppDispatch();

    const setVelorouteActive = (vroute: Veloroute) => {
        if (vroute.len !== undefined) {
            dispatch(setTrainroutesAlongVeloroute([]));
            dispatch(setActiveVelorouteSection(null));
            dispatch(loadVeloroute(vroute as Veloroute));
            setActiveTabId && setActiveTabId("leg");
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
                                    <h2>
                                        {`${getHeadline(section)}  `}
                                        {train}
                                    </h2>
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
                            <li>{`${labels[lang].nomatch}`}</li>
                        )}
                        <ItemList
                            items={veloroutes}
                            activeItem={activeVeloroute}
                            fn={setVelorouteActive}
                            icon={<VelorouteIcon />}
                        />
                    </section>
                </>
            </div>
        </div>
    );
};
