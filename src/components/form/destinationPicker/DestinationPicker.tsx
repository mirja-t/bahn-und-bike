import "./destinationpicker.scss";
import { useDispatch } from "react-redux";
import { setStartPos } from "../../map/trainroutes/TrainroutesSlice";
import { useTranslation } from "../../../utils/i18n";

const startDest = {
    berlin: "8011160",
    hameln: "NDS000110215",
    schwerin: "8010324",
};

export const DestinationPicker = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target } = event;
        const start = startDest[target.value as keyof typeof startDest];
        dispatch(setStartPos(start));
    };

    return (
        <fieldset className="startdestination">
            <label htmlFor="startdest">{t("startdest")}:</label>
            <div className="selectwrapper">
                <select name="dest" id="startdest" onChange={handleChange}>
                    <option value="berlin">Berlin</option>
                    <option value="hameln">Hameln</option>
                    <option value="schwerin">Schwerin</option>
                </select>
            </div>
        </fieldset>
    );
};
