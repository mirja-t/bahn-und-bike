import "./velorouteDetails.scss";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../AppSlice";
import { useTranslation } from "../../utils/i18n";
import {
    selectActiveVeloroute,
    selectActiveVelorouteSection,
    setHoveredVelorouteSection,
    setVelorouteSectionActiveThunk,
} from "../map/veloroutes/VeloroutesSlice";
import { PinIcon } from "../stateless/icons/PinIcon";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";
import { Collapse } from "../stateless/collapse/Collapse";
import { ItemList } from "../stateless/itemlist/ItemList";

export const VelorouteDetails = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();
    const activeVeloroute = useSelector(selectActiveVeloroute);
    const activeVelorouteSectionIdx = useSelector(selectActiveVelorouteSection);
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVeloroute !== null
            ? activeVeloroute.route[activeVelorouteSectionIdx]
            : null;

    const orderedListItems = activeVeloroute
        ? activeVeloroute.route.map((section, idx) => ({
              id: `${idx}-${section.leg[0].stop_name}-${section.leg[section.leg.length - 1].stop_name}`,
              name: `${section.leg[0].stop_name} to ${section.leg[section.leg.length - 1].stop_name}`,
              idx,
          }))
        : [];

    const setVelorouteSectionActive = (
        item: (typeof orderedListItems)[number] | null,
    ) => {
        if (item) {
            dispatch(setVelorouteSectionActiveThunk(item.idx));
        }
    };
    const hoverVelorouteSection = (
        item: (typeof orderedListItems)[number] | null,
    ) => {
        if (item) {
            dispatch(setHoveredVelorouteSection(item.idx));
        } else {
            dispatch(setHoveredVelorouteSection(null));
        }
    };

    return (
        <div id="veloroute-details">
            <div id="veloroute" className="details">
                {activeVeloroute && (
                    <div>
                        <header>
                            <div className="details-headline">
                                <PinIcon size="large">
                                    <VelorouteIcon />
                                </PinIcon>
                                <h2>{`${activeVeloroute.name}`}</h2>
                            </div>
                        </header>
                        <section className="veloroute-details">
                            <h5>{`${t("totaldistance")}`}</h5>
                            <p>{t("approx")} {activeVeloroute.len.toFixed(0)} km</p>
                            <Collapse title={`${t("cyclingroutelegs")}`}>
                                <ItemList
                                    items={orderedListItems}
                                    onClick={setVelorouteSectionActive}
                                    onHover={hoverVelorouteSection}
                                    variant="orderedList"
                                />
                            </Collapse>
                        </section>
                        {!activeVelorouteSection && t("nolegchosen")}
                    </div>
                )}
            </div>
        </div>
    );
};
