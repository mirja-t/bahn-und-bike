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
    setTrainLinesAlongVeloroute,
} from "../map/trainroutes/TrainroutesSlice";
import { PinIcon } from "../stateless/icons/PinIcon";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";

interface DestinationDetailsProps {
    lang: LangCode;
}

export const DestinationDetails = ({ lang }: DestinationDetailsProps) => {
    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeSection = useSelector(selectActiveSection);
    const veloroutes = useSelector(selectVelorouteList);

    const headline = activeSection
        ? `${labels[lang].from} ${activeSection?.firstStation.stop_name} ${labels[lang].to} ${activeSection?.lastStation.stop_name}`
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
            dispatch(setTrainLinesAlongVeloroute([]));
            dispatch(setActiveVelorouteSection(null));
            dispatch(loadVeloroute(vroute as Veloroute));
        }
    };

    return (
        <div id="destination-details">
            <div id="destination" className="details">
                <>
                    <header>
                        <div className="details-headline">
                            <PinIcon size="large">
                                <TrainIcon />
                            </PinIcon>
                            <h2>
                                {`${headline}  `}
                                {train}
                            </h2>
                        </div>
                    </header>

                    <section className="section">
                        <div>
                            <h5>{labels[lang].traveltime}</h5>
                            {activeSection && (
                                <p>{getTime(activeSection.dur, lang)}</p>
                            )}
                        </div>
                    </section>

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
