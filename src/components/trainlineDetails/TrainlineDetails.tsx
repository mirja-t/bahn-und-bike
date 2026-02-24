// import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../AppSlice";
import { useTranslation } from "../../utils/i18n";
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

export const TrainlineDetails = () => {
    const { t } = useTranslation();
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
                    {trainRoutes.length < 1 && <p>{`${t("nomatch")}`}</p>}
                    {/* <h5>{t("trains")}</h5> */}
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
