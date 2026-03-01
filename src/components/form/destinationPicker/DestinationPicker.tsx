import "./destinationpicker.scss";
import {
    selectStartPos,
    setStartPos,
} from "../../map/trainroutes/TrainroutesSlice";
import { useTranslation } from "../../../utils/i18n";
import { useAppDispatch } from "../../../AppSlice";
import { Select } from "../../stateless/select/Select";
import { useSelector } from "react-redux";

export const DestinationPicker = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const startPos = useSelector(selectStartPos);

    const handleStartChange = (id: string) => {
        dispatch(setStartPos(id));
    };

    const options = [
        { label: "Berlin", value: "2975" },
        { label: "Hamburg", value: "482873" },
        { label: "München", value: "609678" },
        { label: "Hameln", value: "513416" },
        { label: "Schwerin", value: "680461" },
        { label: "Hannover", value: "363803" },
        { label: "Kassel", value: "249812" },
        { label: "Düsseldorf", value: "596878" },
        { label: "Stuttgart", value: "131805" },
        { label: "Freiburg", value: "378216" },
        { label: "Frankfurt", value: "632406" },
        { label: "Erfurt", value: "492446" },
        { label: "Dresden", value: "243649" },
    ];

    return (
        <Select
            options={options}
            name="startdest"
            preselectedValue={startPos}
            onChange={handleStartChange}
            label={t("startdest")}
        />
    );
};
