import "./destinationpicker.scss";
import { useDispatch } from "react-redux";
import { setStartPos } from "../../map/trainroutes/TrainroutesSlice";
import type { LangCode, Labels } from "../../../AppSlice";

const startDest = {
    berlin: "8011160",
    hameln: "NDS000110215",
    schwerin: "8010324",
};

interface DestinationPickerProps {
    labels: Labels;
    lang: LangCode;
}

export const DestinationPicker = ({ labels, lang }: DestinationPickerProps) => {
    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { target } = event;
        const start = startDest[target.value as keyof typeof startDest];
        dispatch(setStartPos(start));
    };

    return (
        <fieldset className="startdestination">
            <label htmlFor="startdest">{labels[lang].startdest}:</label>
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
