import "./veloroutes.scss";
import { useSelector } from "react-redux";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectActiveVelorouteStop,
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
        activeVelorouteSectionIdx !== null
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
            {activeVeloroute.path.map((path: any, idx: number) => (
                <VeloroutePath
                    key={idx}
                    idx={idx}
                    path={path}
                    strokeScale={strokeScale}
                />
            ))}

            {activeVeloroute.route.map((s: any) =>
                s.leg.map((item: any, idx: number) => (
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
