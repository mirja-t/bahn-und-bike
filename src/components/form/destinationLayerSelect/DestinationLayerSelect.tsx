import { useEffect } from "react";
import { useAppDispatch } from "../../../AppSlice";
import { loadDestinations } from "../../destinationDetails/DestinationDetailsSlice";
import { Select } from "../../stateless/select/Select";

export const DestinationLayerSelect = () => {
    const dispatch = useAppDispatch();

    const handlePopulationChange = (value: string) => {
        const numericValue = parseInt(value.replace(/[^\d]/g, ""), 10);
        dispatch(loadDestinations({ population: numericValue }));
    };
    const options = [
        { value: "> 1000000", label: "> 1,000,000" },
        { value: "> 500000", label: "> 500,000" },
        { value: "> 100000", label: "> 100,000" },
    ];
    useEffect(() => {
        dispatch(loadDestinations({ population: 1000000 }));
    }, [dispatch]);

    return (
        <Select
            label="Cities"
            name="cities"
            options={options}
            preselectedValue={options[0].value}
            onChange={handlePopulationChange}
        />
    );
};
