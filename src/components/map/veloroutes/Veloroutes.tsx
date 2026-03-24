import styles from "./veloroutes.module.scss";
import { useSelector } from "react-redux";
import {
    loadVeloroute,
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectPreviewVeloroute,
    selectVelorouteList,
    setVelorouteSectionActiveThunk,
    type Veloroute,
    type VelorouteStop as VelorouteStopType,
} from "./VeloroutesSlice";
import { setActiveTab, useAppDispatch } from "../../../AppSlice";
import { VeloroutePath } from "./veloroutePath/veloroutePath";
import { germanyBounds, SvgMapBuilder } from "../../../utils/svgMap";
import { VelorouteStop } from "./velorouteStop/VelorouteStop";

export const Veloroutes = () => {
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
        console.log("Load veloroute with id:", id);
        dispatch(setActiveTab("veloroutes"));
        dispatch(loadVeloroute({ id }));
    };

    const getPath = (gcs: string) => {
        const path = gcs
            .split(" ")
            .map((coord) => {
                const [lat, lon] = coord.split(",").map(Number);
                if (isNaN(lat) || isNaN(lon)) {
                    console.warn(
                        `Invalid coordinate pair: ${coord} (lat: ${lat}, lon: ${lon})`,
                    );
                    return "";
                }
                return SvgMapBuilder.getMapPosition(
                    lon,
                    lat,
                    germanyBounds,
                ).join(",");
            })
            .join(" ");
        return path;
    };

    return (
        <g className={styles.veloroute}>
            {velorouteList.slice(2, 6).map((route) => (
                <VeloroutePath
                    key={`preview-${route.id}`}
                    id={route.id}
                    idx={0}
                    path={getPath(route.gcs)}
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
                        active={idx === activeVelorouteSectionIdx}
                        onClick={handleSectionClick}
                        className={styles.current}
                    />
                ))}

            {activeVeloroute &&
                activeVeloroute.route.map(
                    (s: {
                        dist: number;
                        leg: Veloroute["route"][number]["leg"];
                    }) =>
                        s.leg.map((item: VelorouteStopType, idx: number) => (
                            <VelorouteStop
                                key={`${activeVeloroute.id}-stop-${idx}`}
                                item={item}
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
