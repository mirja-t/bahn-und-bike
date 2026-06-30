import type { TrainstopsAPIResponse } from "@/components/map/trainroutes/TrainroutesSlice";
import type {
    VelorouteListItem,
    VeloroutesResponseStop,
} from "@/components/map/veloroutes/VeloroutesSlice";

export const createTrainstopsResponse = (): TrainstopsAPIResponse => ({
    100: [
        {
            station_id: 2975,
            station_name: "Berlin Hbf",
            dur: 0,
            lat: 52.525084,
            lon: 13.369402,
            name: "RE1",
            stop_number: 0,
            trainline_id: "100",
            next_station_id: 1234,
        },
        {
            station_id: 1234,
            station_name: "Potsdam",
            dur: 10,
            lat: 52.390569,
            lon: 13.064473,
            name: "RE1",
            stop_number: 1,
            trainline_id: "100",
            next_station_id: null,
        },
    ],
    200: [
        {
            station_id: 2975,
            station_name: "Berlin Hbf",
            dur: 0,
            lat: 52.525084,
            lon: 13.369402,
            name: "RE7",
            stop_number: 0,
            trainline_id: "200",
            next_station_id: 1500,
        },
        {
            station_id: 1500,
            station_name: "Flughafen BER",
            dur: 28,
            lat: 52.366665,
            lon: 13.503333,
            name: "RE7",
            stop_number: 1,
            trainline_id: "200",
            next_station_id: null,
        },
    ],
});

export const createVeloroutes = (): VelorouteListItem[] => [
    {
        id: "velo-1",
        name: "Berlin to Potsdam",
        len: 41,
        gcs: "52.525084,13.369402 52.390569,13.064473",
    },
    {
        id: "velo-2",
        name: "Berlin to BER",
        len: 32,
        gcs: "52.525084,13.369402 52.366665,13.503333",
    },
];

export const createVelorouteStopsById = (): Record<
    string,
    VeloroutesResponseStop[]
> => ({
    "velo-1": [
        {
            name: "Berlin to Potsdam",
            dest_name: null,
            dist: 0,
            gcs: "52.525084,13.369402 52.500000,13.280000",
            lat: "52.525084",
            lon: "13.369402",
            station_lat: "52.525084",
            station_lon: "13.369402",
            station_name: "Berlin Hbf",
            stop_number: 1,
            trainlines: "100",
            trainstop: 2975,
            veloroute_id: "velo-1",
        },
        {
            name: "Berlin to Potsdam",
            dest_name: null,
            dist: 41,
            gcs: "52.500000,13.280000 52.390569,13.064473",
            lat: "52.390569",
            lon: "13.064473",
            station_lat: "52.390569",
            station_lon: "13.064473",
            station_name: "Potsdam",
            stop_number: 2,
            trainlines: "100",
            trainstop: 1234,
            veloroute_id: "velo-1",
        },
    ],
    "velo-2": [
        {
            name: "Berlin to BER",
            dest_name: null,
            dist: 0,
            gcs: "52.525084,13.369402 52.450000,13.460000",
            lat: "52.525084",
            lon: "13.369402",
            station_lat: "52.525084",
            station_lon: "13.369402",
            station_name: "Berlin Hbf",
            stop_number: 1,
            trainlines: "200",
            trainstop: 2975,
            veloroute_id: "velo-2",
        },
        {
            name: "Berlin to BER",
            dest_name: null,
            dist: 32,
            gcs: "52.450000,13.460000 52.366665,13.503333",
            lat: "52.366665",
            lon: "13.503333",
            station_lat: "52.366665",
            station_lon: "13.503333",
            station_name: "Flughafen BER",
            stop_number: 2,
            trainlines: "200",
            trainstop: 1500,
            veloroute_id: "velo-2",
        },
    ],
});

export const createConnectionByIdAndStart = () => {
    const trainstops = createTrainstopsResponse();
    return {
        "1234&2975": trainstops[100],
        "1500&2975": trainstops[200],
        "2975&1234": [...trainstops[100]].reverse(),
        "2975&1500": [...trainstops[200]].reverse(),
    } as Record<string, TrainstopsAPIResponse[string]>;
};
