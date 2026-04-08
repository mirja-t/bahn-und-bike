import "./germany.scss";
import map from "./germany.svg";

export const Germany = () => {
    return (
        <div id="germany">
            {/* <div className="map-bg" /> */}
            <img src={map} alt="Map of Germany" className="map" />
        </div>
    );
};
