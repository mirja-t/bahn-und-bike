import styles from "./veloroutes.module.scss";
import { useSelector } from "react-redux";
import {
    selectActiveVelorouteId,
    selectActiveVelorouteSectionIdx,
    selectHoveredVelorouteSectionIdx,
    setActiveVelorouteSectionIdx,
    type Veloroute,
    type VelorouteStop as VelorouteStopType,
} from "./VeloroutesSlice";
import { selectAppZoom, setActiveTab, useAppDispatch } from "../../../AppSlice";
import { VeloroutePath } from "./veloroutePath/veloroutePath";
import { VelorouteStop } from "./velorouteStop/VelorouteStop";
import { germanyBounds, SvgMapBuilder } from "../../../utils/svgMap";
import { useTrainroutesAlongVelorouteSectionQuery } from "@/api/useTrainroutesAlongVelorouteSectionQuery";
import { useVeloroutesQuery } from "@/api/useVeloroutesQuery";
import { useTrainroutesQuery } from "@/api/useTrainroutesQuery";
import { useVelorouteQuery } from "@/api/useVelorouteQuery";

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
    const { isLoading: trainroutesLoading } = useTrainroutesQuery();
    const { isLoading: veloroutesLoading } = useVeloroutesQuery();
    const loading = trainroutesLoading || veloroutesLoading;

    if (
        !trainstopCoordinates ||
        !velorouteCoordinate ||
        velorouteCoordinate.x === undefined ||
        velorouteCoordinate.y === undefined ||
        loading
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
    const { data: activeVeloroute } = useVelorouteQuery();
    const hoveredVelorouteSectionIdx = useSelector(
        selectHoveredVelorouteSectionIdx,
    );
    const activeVelorouteSectionIdx = useSelector(
        selectActiveVelorouteSectionIdx,
    );
    const handleSectionClick = (_: string, idx: number) => {
        dispatch(setActiveTab("leg"));
        dispatch(setActiveVelorouteSectionIdx(idx));
    };
    const activeVelorouteId = useSelector(selectActiveVelorouteId);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVelorouteId !== null
            ? activeVeloroute?.route[activeVelorouteSectionIdx]
            : null;
    const { data: trainlinesAlongVeloroute } =
        useTrainroutesAlongVelorouteSectionQuery();
    const firstStop = trainlinesAlongVeloroute?.[0] ?? null;
    const lastStop = trainlinesAlongVeloroute?.[1] ?? null;
    const activeVRouteStops = {
        start: activeVelorouteSection ? activeVelorouteSection.leg[0] : null,
        end: activeVelorouteSection
            ? activeVelorouteSection.leg[activeVelorouteSection.leg.length - 1]
            : null,
    };

    return (
        <g className={styles.veloroute}>
            {activeVeloroute &&
                activeVeloroute.route.map(({ path }, idx: number) => (
                    <VeloroutePath
                        key={`current-${activeVeloroute.id}-${idx}`}
                        id={activeVeloroute.id}
                        idx={idx}
                        path={path}
                        active={
                            idx === activeVelorouteSectionIdx ||
                            idx === hoveredVelorouteSectionIdx
                        }
                        onClick={handleSectionClick}
                        className={styles.current}
                    />
                ))}
            {activeVelorouteSection &&
                activeVelorouteSection.leg[0].trainstop && (
                    <>
                        {firstStop && (
                            <TrainstationVelorouteConnection
                                trainstopCoordinates={firstStop.firstStation}
                                velorouteCoordinate={{
                                    x: activeVelorouteSection.leg[0].x,
                                    y: activeVelorouteSection.leg[0].y,
                                }}
                            />
                        )}
                        {lastStop && (
                            <TrainstationVelorouteConnection
                                trainstopCoordinates={lastStop.firstStation}
                                velorouteCoordinate={{
                                    x: activeVelorouteSection.leg.at(-1)?.x,
                                    y: activeVelorouteSection.leg.at(-1)?.y,
                                }}
                            />
                        )}
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
