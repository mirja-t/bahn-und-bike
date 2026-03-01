import "./destinationpicker.scss";
import { setStartPos, selectStartPos } from "../../map/trainroutes/TrainroutesSlice";
import { useTranslation } from "../../../utils/i18n";
import { useAppDispatch } from "../../../AppSlice";
import { useSelector } from "react-redux";
import { Select } from "../../stateless/select/Select";

export const DestinationPicker = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
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
