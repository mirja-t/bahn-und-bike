import "./destinationpicker.scss";
import {
    selectStartPos,
    setStartPos,
} from "../../map/trainroutes/TrainroutesSlice";
import { useTranslation } from "../../../utils/i18n";
import { useAppDispatch } from "../../../AppSlice";
import { useSelector } from "react-redux";
import {
    Combobox,
    type ComboboxOption,
} from "../../stateless/combobox/Combobox";
import { debounce } from "../../../utils/utils";
import { headers, VITE_API_URL } from "../../../config/config";
import { useState } from "react";
import type { Destination } from "../../destinationDetails/DestinationDetailsSlice";

export const DestinationPicker = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const startPos = useSelector(selectStartPos);

    const [options, setOptions] = useState<ComboboxOption[]>([
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
    ]);

    const handleStartChange = (value: ComboboxOption | null) => {
        if (value) {
            dispatch(setStartPos(value.value));
        }
    };
    const fetchDestinations = async (value: string) => {
        const res = await fetch(
            VITE_API_URL +
                "destinations?str=" +
                encodeURIComponent(value) +
                "&trainstop=true",
            {
                headers: headers,
            },
        );
        return res.json();
    };
    const handleInputChange = (value: string) => {
        if (value.length < 2) {
            return;
        }
        debounce(
            () =>
                fetchDestinations(value).then((destinations: Destination[]) => {
                    const options = destinations.map((dest: Destination) => ({
                        label: dest.name,
                        value: dest.id,
                    }));
                    setOptions(options);
                }),
            500,
        )();
    };

    return (
        <Combobox
            dropdownPosition="top"
            options={options}
            name="startdest"
            value={options.find((option) => option.value === startPos) || null}
            onChange={handleStartChange}
            onInputChange={handleInputChange}
            label={t("startdest")}
        />
    );
};
