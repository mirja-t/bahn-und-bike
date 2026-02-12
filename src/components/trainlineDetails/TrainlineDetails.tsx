// import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { type LangCode, selectLang, useAppDispatch } from "../../AppSlice";
import {
    setActiveVelorouteSection,
    setActiveVeloroute,
} from "../map/veloroutes/VeloroutesSlice";
import {
    selectActiveSection,
    selectCurrentTrainroutes,
    setActiveSection,
    setTrainLinesAlongVeloroute,
    type CurrentTrainroute,
} from "../map/trainroutes/TrainroutesSlice";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";

interface DestinationDetailsProps {
    lang: LangCode;
}

export const TrainlineDetails = ({ lang }: DestinationDetailsProps) => {
    const labels = useSelector(selectLang);
    const activeSection = useSelector(selectActiveSection);
    const trainRoutes = useSelector(selectCurrentTrainroutes);

    const dispatch = useAppDispatch();

    const setTrainlineActive = (line: CurrentTrainroute) => {
        dispatch(setTrainLinesAlongVeloroute([]));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
    };

    return (
        <div id="trainline-details">
            <div id="trainline" className="details">
                <section className="section">
                    {trainRoutes.length < 1 && (
                        <li>{`${labels[lang].nomatch}`}</li>
                    )}
                    {/* <h5>{labels[lang].trains}</h5> */}
                    <ItemList
                        items={trainRoutes}
                        activeItem={activeSection}
                        fn={setTrainlineActive}
                        icon={<TrainIcon />}
                    />
                </section>
            </div>
        </div>
    );
};
