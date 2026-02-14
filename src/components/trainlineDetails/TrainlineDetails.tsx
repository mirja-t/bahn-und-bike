// import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { type LangCode, selectLang, useAppDispatch } from "../../AppSlice";
import {
    setActiveVelorouteSection,
    setActiveVeloroute,
    loadVeloroutes,
} from "../map/veloroutes/VeloroutesSlice";
import {
    selectActiveSection,
    selectCurrentTrainroutes,
    setActiveSection,
    setTrainroutesAlongVeloroute,
    type CurrentTrainroute,
} from "../map/trainroutes/TrainroutesSlice";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { loadDestinations } from "../destinationDetails/DestinationDetailsSlice";

interface DestinationDetailsProps {
    lang: LangCode;
}

export const TrainlineDetails = ({ lang }: DestinationDetailsProps) => {
    const labels = useSelector(selectLang);
    const activeSection = useSelector(selectActiveSection);
    const trainRoutes = useSelector(selectCurrentTrainroutes);

    const dispatch = useAppDispatch();

    const setTrainlineActive = (line: CurrentTrainroute) => {
        dispatch(setTrainroutesAlongVeloroute([]));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
        dispatch(loadDestinations({ ids: line.stopIds }));
        dispatch(loadVeloroutes(line.stopIds));
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
                        items={trainRoutes.map((route) => ({
                            ...route,
                            name: `${route.trainlines.map((line) => line).join(", ")}: ${route.lastStation.stop_name}`,
                        }))}
                        activeItem={activeSection}
                        fn={setTrainlineActive}
                        icon={<TrainIcon />}
                    />
                </section>
            </div>
        </div>
    );
};
