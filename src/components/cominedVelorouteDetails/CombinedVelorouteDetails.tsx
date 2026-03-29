import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "../../utils/i18n";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    selectActiveVelorouteStop,
    setActiveVelorouteStop,
    type VelorouteStop,
} from "../map/veloroutes/VeloroutesSlice";
import { ItemList } from "../stateless/itemlist/ItemList";
import { Collapse } from "../stateless/collapse/Collapse";
import { Box } from "../stateless/box/Box";

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

    const itemList = activeVelorouteSection
        ? activeVelorouteSection.leg.slice(1, -1).map((stop) => ({
              ...stop,
              id: stop.stop_id,
              name: stop.stop_name,
          }))
        : [];
    const hoverVeloStop = (item: VelorouteStop | null) => {
        if (item) {
            dispatch(setActiveVelorouteStop(item));
        } else {
            dispatch(setActiveVelorouteStop(null));
        }
    };

    const sectionHeadline = (stop: VelorouteStop, idx: number) => (
        <h3 className="veloroute-trainstops">
            <div className="veloroutesection-icon">
                <span>{idx})&nbsp;</span>
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
        <>
            <hr />
            <div id="veloroute-details">
                <div id="veloroute" className="details">
                    {activeVelorouteSection !== null && (
                        <section className="veloroute-details veloroute-section-details">
                            <h5>{`${t("leg")}`}</h5>
                            <Box>
                                {sectionHeadline(
                                    activeVelorouteSection.leg[0],
                                    1,
                                )}
                                {sectionHeadline(
                                    activeVelorouteSection.leg[
                                        activeVelorouteSection.leg.length - 1
                                    ],
                                    2,
                                )}
                            </Box>
                            {activeVelorouteSection.leg.length > 2 && (
                                <Collapse title={`${t("via")}`}>
                                    <ItemList
                                        variant="orderedList"
                                        items={itemList}
                                        onHover={hoverVeloStop}
                                        activeId={
                                            activeVelorouteStop
                                                ? activeVelorouteStop.stop_id
                                                : ""
                                        }
                                    />
                                </Collapse>
                            )}
                            <h6>{t("distance")}</h6>
                            <p>{activeVelorouteSection.dist} km</p>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
};
