// import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { type LangCode, selectLang, useAppDispatch } from "../../AppSlice";
import {
    setActiveVelorouteSection,
    setActiveVeloroute,
    loadVeloroutes,
    selectVelorouteList,
    selectVelorouteListIsLoading,
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
    const velorouteListIsLoading = useSelector(selectVelorouteListIsLoading);
    const velorouteList = useSelector(selectVelorouteList);
    const filteredTrainroutes = trainRoutes.filter((trainroute) =>
        velorouteList.some((vr) => vr.trainRouteIds.includes(trainroute.id)),
    );

    const dispatch = useAppDispatch();

    const setTrainlineActive = (line: CurrentTrainroute) => {
        dispatch(setTrainroutesAlongVeloroute([]));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
        dispatch(loadDestinations({ ids: line.stopIds }));
        dispatch(loadVeloroutes([line]));
    };

    return (
        <div id="trainline-details">
            <div id="trainline" className="details">
                <section className="section">
                    {trainRoutes.length < 1 && (
                        <p>{`${labels[lang].nomatch}`}</p>
                    )}
                    {/* <h5>{labels[lang].trains}</h5> */}
                    <ItemList
                        loading={velorouteListIsLoading}
                        items={filteredTrainroutes}
                        activeId={activeSection?.id}
                        fn={setTrainlineActive}
                        icon={<TrainIcon />}
                    />
                </section>
            </div>
        </div>
    );
};
