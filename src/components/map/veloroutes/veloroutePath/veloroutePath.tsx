import { useSelector } from "react-redux";
import {
    selectHoveredVelorouteSection,
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    setVelorouteSectionActiveThunk,
    loadCrossingVeloroutes,
} from "../VeloroutesSlice";
import { useAppDispatch } from "../../../../AppSlice";

interface VeloroutePathProps {
    idx: number;
    strokeScale: number;
    path: string;
    active?: boolean;
}

export const VeloroutePath = ({
    idx,
    strokeScale,
    path,
    active,
}: VeloroutePathProps) => {
    const dispatch = useAppDispatch();
    const hoveredVrouteSection = useSelector(selectHoveredVelorouteSection);
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null
            ? activeVeloroute.route[activeVelorouteSectionIdx]
            : null;

    const setVelorouteSectionActive = (idx: number) => {
        dispatch(setVelorouteSectionActiveThunk(idx));
        dispatch(loadCrossingVeloroutes(idx));
    };

    return (
        <g
            className={idx === hoveredVrouteSection ? "hover" : ""}
            onClick={() => {
                setVelorouteSectionActive(idx);
            }}
        >
            <path
                className={
                    activeVelorouteSection === activeVeloroute.route[idx] ||
                    active
                        ? "veloroute-section active"
                        : "veloroute-section"
                }
                strokeWidth={
                    activeVelorouteSection === activeVeloroute.route[idx] ||
                    active
                        ? 1.5 / strokeScale
                        : 1 / strokeScale
                }
                d={path}
            />
            <path
                className="veloroute-section-large"
                strokeWidth={12 / strokeScale}
                d={path}
            />
        </g>
    );
};
