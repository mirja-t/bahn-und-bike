// import "./destinationDetails.scss";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../AppSlice";
import { useTranslation } from "../../utils/i18n";
import {
    setActiveVelorouteSection,
    setActiveVeloroute,
    loadVeloroutes,
} from "../map/veloroutes/VeloroutesSlice";
import {
    selectActiveSection,
    selectCurrentTrainroutes,
    selectTrainrouteListLoading,
    setActiveSection,
    setTrainroutesAlongVeloroute,
    type CurrentTrainroute,
} from "../map/trainroutes/TrainroutesSlice";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { useState } from "react";

interface TrainlineDetailsProps {
    fn: () => void;
}
export const TrainlineDetails = ({ fn }: TrainlineDetailsProps) => {
    const { t } = useTranslation();
    const activeSection = useSelector(selectActiveSection);
    const trainRoutes = useSelector(selectCurrentTrainroutes);
    const trainlineListIsLoading = useSelector(selectTrainrouteListLoading);
    const [activeSectionClicked, setActiveSectionClicked] = useState(false);
    // check costs of fetching all related veloroutes when no trainline is selected
    // const filteredTrainroutes = trainRoutes.filter((trainroute) =>
    //     velorouteList.some((vr) => vr.trainRouteIds.includes(trainroute.id)),
    // );

    const dispatch = useAppDispatch();

    const handleTrainrouteHover = (trainroute: CurrentTrainroute | null) => {
        if (trainroute) {
            dispatch(setActiveSection(trainroute));
        } else if (!activeSectionClicked) {
            dispatch(setActiveSection(null));
        }
    };

    const handleTrainrouteClick = (line: CurrentTrainroute) => {
        dispatch(setTrainroutesAlongVeloroute([]));
        dispatch(setActiveVeloroute(null));
        dispatch(setActiveVelorouteSection(null));
        dispatch(setActiveSection(line));
        dispatch(loadVeloroutes([line]));
        fn();
        setActiveSectionClicked(true); // prevent deselect on hover after click
    };

    return (
        <div id="trainline-details">
            <div id="trainline" className="details">
                <section className="section">
                    {trainRoutes.length < 1 && !trainlineListIsLoading && (
                        <p>{`${t("nomatch")}`}</p>
                    )}
                    <ItemList
                        loading={trainlineListIsLoading}
                        items={trainRoutes}
                        activeId={activeSection?.id}
                        fn={handleTrainrouteClick}
                        onHover={handleTrainrouteHover}
                        icon={<TrainIcon />}
                    />
                </section>
            </div>
        </div>
    );
};
