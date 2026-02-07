import "./veloroutes.scss";
import { useSelector } from "react-redux";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectActiveVelorouteStop,
    type VelorouteStop as VelorouteStopType,
} from "./VeloroutesSlice";
import { VelorouteStop } from "./velorouteStop/VelorouteStop";
import { VeloroutePath } from "./veloroutePath/veloroutePath";

interface VeloroutesProps {
    strokeScale: number;
}

export const Veloroutes = ({ strokeScale }: VeloroutesProps) => {
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVeloroute
            ? activeVeloroute.route[activeVelorouteSectionIdx]
            : null;
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);
    const activeVRouteStops = {
        start: activeVelorouteSection ? activeVelorouteSection.leg[0] : null,
        end: activeVelorouteSection
            ? activeVelorouteSection.leg[activeVelorouteSection.leg.length - 1]
            : null,
    };

    return (
        <g className="veloroute">
            {activeVeloroute &&
                activeVeloroute.path.map((path: string, idx: number) => (
                    <VeloroutePath
                        key={idx}
                        idx={idx}
                        path={path}
                        strokeScale={strokeScale}
                    />
                ))}

            {activeVeloroute &&
                activeVeloroute.route.map(
                    (s: { dist: number; leg: VelorouteStopType[] }) =>
                        s.leg.map((item: VelorouteStopType, idx: number) => (
                            <VelorouteStop
                                key={idx}
                                item={item}
                                activeSpot={activeVelorouteStop}
                                strokeScale={strokeScale}
                                type={
                                    item === activeVRouteStops.start ||
                                    item === activeVRouteStops.end
                                        ? "active"
                                        : ""
                                }
                            />
                        )),
                )}
        </g>
    );
};
