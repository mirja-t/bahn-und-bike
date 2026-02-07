import { useEffect, useState, useRef } from "react";
import { mapRatio, svgWidth, svgHeight } from "../utils/svgMap";
import { getLongestDistance } from "../utils/getLongestDistance";
import { getCenterPosition } from "../utils/getCenterPosition";

export const useZoom = (
    journeys: any,
    vrouteposition: any,
    value: number,
    mapContainer: HTMLDivElement | null,
    mapSize: [number, number],
    userscale: number,
    loading: boolean,
) => {
    userscale = Number(userscale.toFixed(1));
    const [zoom, setZoom] = useState({
        x: 0,
        y: 0,
        scale: userscale,
        containerWidth: mapSize[0],
        containerHeight: mapSize[1],
    });

    const zoomMemo = useRef(zoom);

    useEffect(() => {
        if (loading) return;

        // get shorter side of mapContainer
        if (!mapContainer) return;
        const mapContainerMinSize =
            Math.min(mapContainer?.offsetWidth, mapContainer?.offsetHeight) ||
            1;

        if (value === 0) {
            setZoom({
                x: 0,
                y: 0,
                scale: userscale,
                containerWidth: mapContainerMinSize * mapRatio,
                containerHeight: mapContainerMinSize,
            });
        } else {
            const xStart = getCenterPosition(journeys, "x");
            const yStart = getCenterPosition(journeys, "y");
            const leftOffset = (svgWidth / 2 - xStart) / 2;
            const topOffset = (svgHeight / 2 - yStart) / 2;

            let distX: number = getLongestDistance(
                journeys,
                "x",
                xStart,
                vrouteposition || null,
            );
            let distY: number = getLongestDistance(
                journeys,
                "y",
                yStart,
                vrouteposition || null,
            );

            // get viewport ratio
            const longestDist = Math.max(distX, distY);
            const scale = mapContainerMinSize / longestDist;

            const currentZoom = {
                x: leftOffset * scale * userscale,
                y: topOffset * scale * userscale,
                scale: scale * userscale,
                containerWidth:
                    mapContainerMinSize * mapRatio * scale * userscale,
                containerHeight: mapContainerMinSize * scale * userscale,
            };

            setZoom(currentZoom);
            zoomMemo.current = currentZoom;
        }
    }, [
        journeys,
        vrouteposition,
        value,
        mapContainer,
        mapSize,
        userscale,
        loading,
    ]);

    return zoom;
};
