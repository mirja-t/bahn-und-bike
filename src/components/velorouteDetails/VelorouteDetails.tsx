import "./velorouteDetails.scss";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { ScrollContent } from "../stateless/scrollcontent/ScrollContent";
import { selectLang, useAppDispatch } from "../../AppSlice";
import {
    selectActiveVeloroute,
    // setActiveVelorouteSection,
    selectActiveVelorouteSection,
    // setCombinedVeloroute,
    setHoveredVelorouteSection,
    // selectCrossingVelorouteList,
    // selectCombinedVeloroute,
    setVelorouteSectionActiveThunk,
} from "../map/veloroutes/VeloroutesSlice";
// import {
//     selectTrainrouteList
// } from '../map/trainroutes/TrainroutesSlice';
import { PinIcon } from "../stateless/icons/PinIcon";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";
import { Collapse } from "../stateless/collapse/Collapse";

interface VelorouteDetailsProps {
    parent: any;
    lang: string;
}

export const VelorouteDetails = ({ parent, lang }: VelorouteDetailsProps) => {
    const dispatch = useAppDispatch();

    const labels = useSelector(selectLang);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null
            ? activeVeloroute.route[activeVelorouteSectionIdx]
            : null;

    const setVelorouteSectionActive = (idx: number) => {
        dispatch(setVelorouteSectionActiveThunk(idx));
    };

    const hoverVelorouteSection = (
        { type }: React.MouseEvent,
        idx?: number,
    ) => {
        type === "mouseenter" && idx !== undefined
            ? dispatch(setHoveredVelorouteSection(idx))
            : dispatch(setHoveredVelorouteSection(null));
    };

    return (
        <ScrollContent
            parentEl={parent}
            transitionComplete={true}
            id="veloroute-details"
        >
            <div id="veloroute" className="details">
                {activeVeloroute && (
                    <div>
                        <header>
                            <div className="details-headline">
                                <PinIcon size="large">
                                    <VelorouteIcon />
                                </PinIcon>
                                <h2>{`${activeVeloroute.name}`}</h2>
                            </div>
                        </header>
                        <section className="veloroute-details">
                            <h5>{`${labels[lang].totaldistance}`}</h5>
                            <p>{activeVeloroute.len}km</p>
                            <Collapse
                                title={`${labels[lang].cyclingroutelegs}`}
                            >
                                <ol className="veloroute-stops">
                                    {activeVeloroute.route.map(
                                        (
                                            obj: {
                                                leg: { stop_name: string }[];
                                            },
                                            idx: number,
                                        ) => (
                                            <li
                                                key={uuidv4()}
                                                onClick={() =>
                                                    setVelorouteSectionActive(
                                                        idx,
                                                    )
                                                }
                                                onMouseEnter={(e) =>
                                                    hoverVelorouteSection(
                                                        e,
                                                        idx,
                                                    )
                                                }
                                                onMouseLeave={(e) =>
                                                    hoverVelorouteSection(e)
                                                }
                                            >
                                                <div>{`${obj.leg[0].stop_name} to ${obj.leg[obj.leg.length - 1].stop_name}`}</div>
                                            </li>
                                        ),
                                    )}
                                </ol>
                            </Collapse>
                        </section>
                        {/* { activeVelorouteSection && 
                        (<section className="section">
                            <h5>{labels[lang].alternativeveloroutes}</h5>
                            { crossingVeloroutes && !crossingVeloroutesLoading &&
                                <ItemList
                                    items={crossingVeloroutes}
                                    lang={lang}
                                    activeItem={combinedVeloroute}
                                    fn={setCurrentCombinedVeloroute} />}
                        </section>)
                    } */}
                        {!activeVelorouteSection && labels[lang].nolegchosen}
                    </div>
                )}
            </div>
        </ScrollContent>
    );
};
