import { useEffect, useState } from "react";
import { svgWidth, svgHeight } from "../utils/svgMap";
import type { CurrentTrainroute } from "../components/map/trainroutes/TrainroutesSlice";

export const useZoom = (
    journeys: CurrentTrainroute[],
    value: number,
    loading: boolean,
) => {
    const [zoom, setZoom] = useState({
        x: 0,
        y: 0,
        scale: 1,
        ratio: 1,
    });

    useEffect(() => {
        if (loading) return;
        if (value === 0) {
            setZoom({
                x: 0,
                y: 0,
                scale: 1,
                ratio: 1,
            });
        } else {
            // const containerSize = mapContainer.current.getBoundingClientRect();
            const xValues = journeys.map((el) => el.lastStation.x);
            const yValues = journeys.map((el) => el.lastStation.y);
            const trainrouteDistanceXMin: number = Math.min(...xValues);
            const trainrouteDistanceXMax: number = Math.max(...xValues);
            const trainrouteDistanceYMin: number = Math.min(...yValues);
            const trainrouteDistanceYMax: number = Math.max(...yValues);
            const distX = Math.max(
                0.001,
                trainrouteDistanceXMax - trainrouteDistanceXMin,
            );
            const distY = Math.max(
                0.001,
                trainrouteDistanceYMax - trainrouteDistanceYMin,
            );
            const offsetX =
                0.5 - (trainrouteDistanceXMin + distX / 2) / svgWidth;
            const offsetY =
                0.5 - (trainrouteDistanceYMin + distY / 2) / svgHeight;
            setZoom((prev) => ({ ...prev, x: offsetX, y: offsetY }));

            // get viewport ratio
            const scaleX = svgWidth / distX;
            const scaleY = svgHeight / distY;
            setZoom((prev) => ({ ...prev, scale: Math.min(scaleX, scaleY) }));
            setZoom((prev) => ({ ...prev, ratio: distX / distY }));
        }
    }, [journeys, value, loading]);

    return zoom;
};
