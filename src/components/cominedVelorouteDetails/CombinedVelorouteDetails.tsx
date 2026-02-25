import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "../../utils/i18n";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectActiveVelorouteStop,
    setActiveVelorouteStop,
    type VelorouteStop,
} from "../map/veloroutes/VeloroutesSlice";

export const CombinedVelorouteDetails = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVeloroute !== null
            ? activeVeloroute.route[activeVelorouteSectionIdx]
            : null;
    const activeVelorouteStop = useSelector(selectActiveVelorouteStop);

    const hoverVeloStop = (
        { type }: React.MouseEvent,
        velorouteStop: VelorouteStop | null = null,
    ) => {
        if (type === "mouseenter") {
            return dispatch(setActiveVelorouteStop(velorouteStop));
        }
        dispatch(setActiveVelorouteStop(null));
    };

    const sectionHeadline = (stop: VelorouteStop, idx: number) => (
        <h3 className="veloroute-trainstops">
            <div className="veloroutesection-icon">
                <span>{idx}</span>
            </div>
            <span>
                {idx === 1 ? t("from") : t("to")} {stop.stop_name}
                {stop.trainlines &&
                    stop.trainlines.map((s, i) => (
                        <span key={i} className="train">
                            {s}
                        </span>
                    ))}
            </span>
        </h3>
    );
    return (
        <div id="veloroute-details">
            <div id="veloroute" className="details">
                {activeVelorouteSection !== null && (
                    <section className="veloroute-details veloroute-section-details">
                        <h5>{`${t("leg")}`}</h5>
                        {sectionHeadline(activeVelorouteSection.leg[0], 1)}
                        {sectionHeadline(
                            activeVelorouteSection.leg[
                                activeVelorouteSection.leg.length - 1
                            ],
                            2,
                        )}
                        {activeVelorouteSection.leg.length > 2 && (
                            <>
                                <h6>{t("via")}</h6>
                                <ul className="veloroute-stops">
                                    {activeVelorouteSection.leg
                                        .slice(1, -1)
                                        .map(
                                            (
                                                s: VelorouteStop,
                                                idx: number,
                                                arr: VelorouteStop[],
                                            ) => (
                                                <li key={idx}>
                                                    <span
                                                        className={
                                                            activeVelorouteStop &&
                                                            activeVelorouteStop.stop_id ===
                                                                s.stop_id
                                                                ? "hover"
                                                                : ""
                                                        }
                                                        onMouseEnter={(e) =>
                                                            hoverVeloStop(e, s)
                                                        }
                                                        onMouseLeave={
                                                            hoverVeloStop
                                                        }
                                                    >
                                                        {s.stop_name}
                                                    </span>
                                                    {idx !== arr.length - 1 &&
                                                        `, `}
                                                </li>
                                            ),
                                        )}
                                </ul>
                            </>
                        )}
                        <h6>{t("distance")}</h6>
                        <p>{activeVelorouteSection.dist} km</p>
                    </section>
                )}
            </div>
        </div>
    );
};
