// import "./destinationDetails.scss";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../AppSlice";
import { useTranslation } from "../../utils/i18n";
import {
    setActiveVelorouteId,
    setActiveVelorouteSectionIdx,
} from "../map/veloroutes/VeloroutesSlice";
import {
    selectActiveSection,
    setActiveSection,
    setPreviewSection,
    type CurrentTrainroute,
} from "../map/trainroutes/TrainroutesSlice";
import { TrainIcon } from "../stateless/icons/TrainIcon";
import { ItemList } from "../stateless/itemlist/ItemList";
import { useTrainroutesQuery } from "@/api/useTrainroutesQuery";

interface TrainlineDetailsProps {
    fn: () => void;
}
export const TrainlineDetails = ({ fn }: TrainlineDetailsProps) => {
    const { t } = useTranslation();
    const activeSection = useSelector(selectActiveSection);

    const { data: trainroutesQueryData, isLoading: trainroutesLoading } =
        useTrainroutesQuery();
    const currentTrainroutes = trainroutesQueryData?.currentTrainroutes;

    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            // Ensure any hover preview is cleared when this component unmounts
            dispatch(setPreviewSection(null));
        };
    }, [dispatch]);

    const handleTrainrouteHover = (trainroute: CurrentTrainroute | null) => {
        if (trainroute) {
            dispatch(setPreviewSection(trainroute));
        } else {
            dispatch(setPreviewSection(null));
        }
    };

    const handleTrainrouteClick = (line: CurrentTrainroute) => {
        dispatch(setActiveVelorouteId(null));
        dispatch(setActiveVelorouteSectionIdx(null));
        // Clear any hover preview when a route is explicitly selected
        dispatch(setPreviewSection(null));
        dispatch(setActiveSection(line));
        fn();
    };
    if (!currentTrainroutes) {
        return null;
    }
    return (
        <div id="trainline-details">
            <div id="trainline" className="details">
                <section className="section">
                    {currentTrainroutes?.length < 1 && !trainroutesLoading && (
                        <p>{`${t("nomatch")}`}</p>
                    )}
                    <ItemList
                        loading={trainroutesLoading}
                        items={currentTrainroutes}
                        activeId={activeSection?.id}
                        onClick={handleTrainrouteClick}
                        onHover={handleTrainrouteHover}
                        icon={<TrainIcon />}
                    />
                </section>
            </div>
        </div>
    );
};
