import styles from "./destinations.module.scss";
import { useSelector } from "react-redux";
import {
    germanyBounds,
    svgHeight,
    SvgMapBuilder,
    svgWidth,
} from "../../../utils/svgMap";
import {
    selectDestinations,
    type Destination,
} from "../../destinationDetails/DestinationDetailsSlice";

export const Destinations = () => {
    const destinations = useSelector(selectDestinations);
    const renderDestinations = (destination: Destination) => {
        const [x, y] = SvgMapBuilder.getMapPosition(
            destination.lon,
            destination.lat,
            germanyBounds,
        );
        return (
            <g key={destination.id}>
                <text x={x + 6} y={y} fontSize="9" fill="black">
                    {destination.name}
                </text>
                <circle cx={x} cy={y} r="5" fill="blue" />
            </g>
        );
    };
    return (
        <svg
            id="cities"
            className={styles.cities}
            x="0px"
            y="0px"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            xmlSpace="preserve"
        >
            {destinations?.map(renderDestinations)}
        </svg>
    );
};
