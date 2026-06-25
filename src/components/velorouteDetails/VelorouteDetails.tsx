import "./velorouteDetails.scss";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../AppSlice";
import { useTranslation } from "../../utils/i18n";
import {
    selectActiveVelorouteSectionIdx,
    setHoveredVelorouteSectionIdx,
    setVelorouteSectionActiveThunk,
} from "../map/veloroutes/VeloroutesSlice";
import { PinIcon } from "../stateless/icons/PinIcon";
import { VelorouteIcon } from "../stateless/icons/VelorouteIcon";
import { Collapse } from "../stateless/collapse/Collapse";
import { ItemList } from "../stateless/itemlist/ItemList";
import { RangeInput } from "../form/rangeinput/RangeInput";
import {
    selectMaxDistToNextStation,
    setMaxDistToNextStation,
} from "../map/veloroutes/VeloroutesSlice";
import { Box } from "../stateless/box/Box";
import { useQueryCache } from "@/api/useQueryCache";

export const VelorouteDetails = () => {
    const dispatch = useAppDispatch();

    const { t } = useTranslation();
    const activeVelorouteSectionIdx = useSelector(
        selectActiveVelorouteSectionIdx,
    );
    const { activeVeloroute } = useQueryCache();
    const activeVelorouteSection =
        activeVelorouteSectionIdx !== null && activeVeloroute
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
            dispatch(setHoveredVelorouteSectionIdx(item.idx));
        } else {
            dispatch(setHoveredVelorouteSectionIdx(null));
        }
    };

    const maxDistanceToStation = useSelector(selectMaxDistToNextStation);
    const handleMaxDistanceToStationRelease = (
        e:
            | React.MouseEvent<HTMLInputElement>
            | React.TouchEvent<HTMLInputElement>,
    ) => {
        const value = Number((e.target as HTMLInputElement).value);
        dispatch(setMaxDistToNextStation(value));
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
                            <p>
                                {t("approx")} {activeVeloroute.len.toFixed(0)}{" "}
                                km
                            </p>
                            <Collapse title={`${t("cyclingroutelegs")}`}>
                                <ItemList
                                    items={orderedListItems}
                                    onClick={setVelorouteSectionActive}
                                    onHover={hoverVelorouteSection}
                                    variant="orderedList"
                                />
                            </Collapse>
                        </section>
                        <Box>
                            <RangeInput
                                min={1}
                                max={5}
                                value={maxDistanceToStation}
                                step={1}
                                onRelease={handleMaxDistanceToStationRelease}
                                name={t("maxDistanceToNextTrainstation")}
                                getCurrentValue={(val) => `${val} km`}
                            />
                        </Box>
                        {!activeVelorouteSection && t("nolegchosen")}
                    </div>
                )}
            </div>
        </div>
    );
};
