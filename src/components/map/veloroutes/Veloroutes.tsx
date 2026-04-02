import styles from "./veloroutes.module.scss";
import { useSelector } from "react-redux";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectHoveredVelorouteSection,
    selectPreviewVeloroute,
    setVelorouteSectionActiveThunk,
    type Veloroute,
    type VelorouteStop as VelorouteStopType,
} from "./VeloroutesSlice";
import { selectAppZoom, setActiveTab, useAppDispatch } from "../../../AppSlice";
import { VeloroutePath } from "./veloroutePath/veloroutePath";
import { VelorouteStop } from "./velorouteStop/VelorouteStop";
import { germanyBounds, SvgMapBuilder } from "../../../utils/svgMap";
import { selectTrainroutesAlongVeloroute } from "../trainroutes/TrainroutesSlice";

interface TrainstationVelorouteConnectionProps {
    trainstopCoordinates: { lat: number; lon: number } | null;
    velorouteCoordinate:
        | { x: number | undefined; y: number | undefined }
        | undefined;
}
const TrainstationVelorouteConnection = ({
    trainstopCoordinates,
    velorouteCoordinate,
}: TrainstationVelorouteConnectionProps) => {
    const appZoom = useSelector(selectAppZoom);

    if (
        !trainstopCoordinates ||
        !velorouteCoordinate ||
        velorouteCoordinate.x === undefined ||
        velorouteCoordinate.y === undefined
    )
        return null;
    const [x, y] = SvgMapBuilder.getMapPosition(
        trainstopCoordinates.lon,
        trainstopCoordinates.lat,
        germanyBounds,
    );

    return (
        <g>
            <line
                x1={x}
                y1={y}
                x2={velorouteCoordinate.x}
                y2={velorouteCoordinate.y}
                className={styles.connectionLine}
                strokeWidth={2 / appZoom}
            />
            <circle
                cx={x}
                cy={y}
                r={4 / appZoom}
                className={styles.connectionDot}
            />
        </g>
    );
};

export const Veloroutes = () => {
    const dispatch = useAppDispatch();
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const previewVeloroute = useSelector(selectPreviewVeloroute);
    const hoveredVelorouteSection = useSelector(selectHoveredVelorouteSection);
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
        dispatch(setActiveTab("leg"));
        dispatch(setVelorouteSectionActiveThunk(idx));
    };

    const trainlinesAlongVeloroute = useSelector(
        selectTrainroutesAlongVeloroute,
    );
    const [firstStop, lastStop] = trainlinesAlongVeloroute;

    return (
        <g className={styles.veloroute}>
            {activeVeloroute &&
                activeVeloroute.path.map((path: string, idx: number) => (
                    <VeloroutePath
                        key={`current-${activeVeloroute.id}-${idx}`}
                        id={activeVeloroute.id}
                        idx={idx}
                        path={path}
                        active={
                            idx === activeVelorouteSectionIdx ||
                            idx === hoveredVelorouteSection
                        }
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
            {activeVelorouteSection &&
                activeVelorouteSection.leg[0].trainstop && (
                    <>
                        <TrainstationVelorouteConnection
                            trainstopCoordinates={firstStop?.firstStation}
                            velorouteCoordinate={{
                                x: activeVelorouteSection.leg[0].x,
                                y: activeVelorouteSection.leg[0].y,
                            }}
                        />
                        <TrainstationVelorouteConnection
                            trainstopCoordinates={lastStop?.firstStation}
                            velorouteCoordinate={{
                                x: activeVelorouteSection.leg.at(-1)?.x,
                                y: activeVelorouteSection.leg.at(-1)?.y,
                            }}
                        />
                    </>
                )}

            {/* stops */}
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
                                key={`${activeVeloroute.id}-stop-${legIndex}-${idx}`}
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
