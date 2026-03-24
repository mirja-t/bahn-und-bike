import styles from "./veloroutes.module.scss";
import { useSelector } from "react-redux";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectPreviewVeloroute,
    setVelorouteSectionActiveThunk,
    type Veloroute,
    type VelorouteStop as VelorouteStopType,
} from "./VeloroutesSlice";
import { setActiveTab, useAppDispatch } from "../../../AppSlice";
import { VeloroutePath } from "./veloroutePath/veloroutePath";
import { VelorouteStop } from "./velorouteStop/VelorouteStop";

export const Veloroutes = () => {
    const dispatch = useAppDispatch();
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const previewVeloroute = useSelector(selectPreviewVeloroute);
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
    const veloroutes = [];
    if (activeVeloroute) {
        veloroutes.push(activeVeloroute);
    }
    if (previewVeloroute) {
        veloroutes.push(previewVeloroute);
    }

    const handleSectionClick = (_: string, idx: number) => {
        dispatch(setActiveTab("veloroutes"));
        dispatch(setVelorouteSectionActiveThunk(idx));
    };

    return (
        <g className={styles.veloroute}>
            {activeVeloroute &&
                activeVeloroute.path.map((path: string, idx: number) => (
                    <VeloroutePath
                        key={`current-${activeVeloroute.id}-${idx}`}
                        id={activeVeloroute.id}
                        idx={idx}
                        path={path}
                        active={idx === activeVelorouteSectionIdx}
                        onClick={handleSectionClick}
                        className={styles.current}
                    />
                ))}
            {previewVeloroute &&
                previewVeloroute.path.map((path: string, idx: number) => (
                    <VeloroutePath
                        key={`preview-${previewVeloroute.id}-${idx}`}
                        id={previewVeloroute.id}
                        idx={idx}
                        path={path}
                        active={false}
                        onClick={handleSectionClick}
                        className={styles.preview}
                    />
                ))}
            {activeVeloroute &&
                activeVeloroute.route.map(
                    (
                        s: {
                            dist: number;
                            leg: Veloroute["route"][number]["leg"];
                        },
                        legIndex,
                    ) =>
                        s.leg.map((item: VelorouteStopType, idx: number) => (
                            <VelorouteStop
                                key={`${activeVeloroute.id}-stop-${idx}`}
                                item={item}
                                idx={legIndex}
                                type={
                                    item === activeVRouteStops.start
                                        ? "active start"
                                        : item === activeVRouteStops.end
                                          ? "active end"
                                          : ""
                                }
                            />
                        )),
                )}
        </g>
    );
};
