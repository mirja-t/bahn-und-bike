import styles from "./veloroutes.module.scss";
import { useSelector } from "react-redux";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectPreviewVeloroute,
    selectVelorouteList,
    setActiveVeloroute,
    setVelorouteSectionActiveThunk,
    type VelorouteStop as VelorouteStopType,
} from "./VeloroutesSlice";
import { VelorouteStop } from "./velorouteStop/VelorouteStop";
import { VeloroutePath } from "./veloroutePath/veloroutePath";
import { setActiveTab, useAppDispatch } from "../../../AppSlice";

interface VeloroutesProps {
    strokeScale: number;
}

export const Veloroutes = ({ strokeScale }: VeloroutesProps) => {
    const dispatch = useAppDispatch();
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const previewVeloroute = useSelector(selectPreviewVeloroute);
    const velorouteList = useSelector(selectVelorouteList);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVeloroute
            ? activeVeloroute.route[activeVelorouteSectionIdx]
            : null;
    const activeVRouteStops = {
        start: activeVelorouteSection ? activeVelorouteSection.leg[0] : null,
        end: activeVelorouteSection
            ? activeVelorouteSection.leg[activeVelorouteSection.leg.length - 1]
            : null,
    };

    const handleSectionClick = (_: string, idx: number) => {
        dispatch(setActiveTab("veloroutes"));
        dispatch(setVelorouteSectionActiveThunk(idx));
    };
    const handleRouteClick = (id: string) => {
        dispatch(setActiveTab("veloroutes"));
        dispatch(setActiveVeloroute(id));
    };

    return (
        <g className={styles.veloroute}>
            {velorouteList.map((route) => (
                <VeloroutePath
                    key={`preview-${route.id}`}
                    id={route.id}
                    idx={0}
                    path={route.path.join(" ")}
                    strokeScale={strokeScale}
                    className={
                        previewVeloroute?.id === route.id
                            ? styles.hover
                            : styles.preview
                    }
                    onClick={handleRouteClick}
                />
            ))}
            {activeVeloroute &&
                activeVeloroute.path.map((path: string, idx: number) => (
                    <VeloroutePath
                        key={`current-${activeVeloroute.id}-${idx}`}
                        id={activeVeloroute.id}
                        idx={idx}
                        path={path}
                        strokeScale={strokeScale}
                        active={idx === activeVelorouteSectionIdx}
                        onClick={handleSectionClick}
                        className={styles.current}
                    />
                ))}

            {activeVeloroute &&
                activeVeloroute.route.map(
                    (s: { dist: number; leg: VelorouteStopType[] }) =>
                        s.leg.map((item: VelorouteStopType, idx: number) => (
                            <VelorouteStop
                                key={`${activeVeloroute.id}-stop-${idx}`}
                                item={item}
                                strokeScale={strokeScale}
                                type={
                                    item === activeVRouteStops.start ||
                                    item === activeVRouteStops.end
                                        ? styles.active
                                        : ""
                                }
                            />
                        )),
                )}
        </g>
    );
};
