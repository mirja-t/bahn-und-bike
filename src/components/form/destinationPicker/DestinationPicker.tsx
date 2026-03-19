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
import { useRef, useState } from "react";
import type { Destination } from "../../destinationDetails/DestinationDetailsSlice";

const presetOptions: ComboboxOption[] = [
    { label: "Berlin", value: "2975" },
    { label: "Hamburg", value: "482873" },
    { label: "München", value: "609678" },
    { label: "Köln", value: "116528" },
    { label: "Frankfurt", value: "632406" },
    { label: "Stuttgart", value: "131805" },
    { label: "Düsseldorf", value: "596878" },
    { label: "Leipzig", value: "448483" },
    { label: "Dortmund", value: "438344" },
    { label: "Essen", value: "294198" },
    { label: "Bremen", value: "273374" },
    { label: "Dresden", value: "243649" },
    { label: "Hannover", value: "363803" },
    { label: "Nürnberg", value: "499451" },
    { label: "Duisburg", value: "180965" },
    { label: "Bochum", value: "481356" },
    { label: "Wuppertal", value: "676261" },
    { label: "Bielefeld", value: "553148" },
    { label: "Bonn", value: "415799" },
    { label: "Münster", value: "431855" },
    { label: "Schwerin", value: "680461" },
    { label: "Kassel", value: "249812" },
    { label: "Freiburg", value: "378216" },
    { label: "Erfurt", value: "492446" },
    { label: "Hameln", value: "513416" },
].sort((a, b) => a.label.localeCompare(b.label));

export const DestinationPicker = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const startPos = useSelector(selectStartPos);

    const [options, setOptions] = useState<ComboboxOption[]>(presetOptions);

    const handleStartChange = (value: ComboboxOption | null) => {
        if (value) {
            dispatch(setStartPos(value.value));
            setOptions(() => {
                const valueExistsInPreset = presetOptions.some(
                    (option) => option.value === value.value,
                );
                if (valueExistsInPreset) {
                    return presetOptions;
                }
                return [...presetOptions, value].sort((a, b) =>
                    a.label.localeCompare(b.label),
                );
            });
        }
    };
    const fetchDestinations = async (value: string): Promise<Destination[]> => {
        const res = await fetch(
            VITE_API_URL +
                "destinations?str=" +
                encodeURIComponent(value) +
                "&trainstop=true",
            {
                headers: headers,
            },
        );
        if (!res.ok) {
            throw new Error(
                `Failed to fetch destinations: ${res.status} ${res.statusText}`,
            );
        }
        return res.json() as Promise<Destination[]>;
    };
    const debouncedFetchRef = useRef<((value: string) => void) | null>(null);
    if (debouncedFetchRef.current === null) {
        debouncedFetchRef.current = debounce((value: string) => {
            fetchDestinations(value)
                .then((destinations: Destination[]) => {
                    const options = destinations.map((dest: Destination) => ({
                        label: dest.name,
                        value: dest.id,
                    }));
                    setOptions(options);
                })
                .catch((error) => {
                    // On error, fall back to preset options to avoid stale/invalid entries.
                    // eslint-disable-next-line no-console
                    console.error(error);
                    setOptions(presetOptions);
                });
        }, 500);
    }

    const handleInputChange = (value: string) => {
        if (value.length < 2) {
            return;
        }
        if (debouncedFetchRef.current) {
            debouncedFetchRef.current(value);
        }
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
            placeholder={t("search")}
        />
    );
};
