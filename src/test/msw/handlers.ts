import { http, HttpResponse } from "msw";
import { VITE_API_URL } from "@/config/config";
import {
    createConnectionByIdAndStart,
    createTrainstopsResponse,
    createVelorouteStopsById,
    createVeloroutes,
} from "./factories";

const apiBase = VITE_API_URL.endsWith("/") ? VITE_API_URL : `${VITE_API_URL}/`;

const trainstopsResponse = createTrainstopsResponse();
const veloroutes = createVeloroutes();
const velorouteStopsById = createVelorouteStopsById();
const connectionsByIds = createConnectionByIdAndStart();

export const handlers = [
    http.get(`${apiBase}trainstops/:startId`, () => {
        return HttpResponse.json(trainstopsResponse);
    }),

    http.get(`${apiBase}connections/:startId`, () => {
        return HttpResponse.json(trainstopsResponse);
    }),

    http.post(`${apiBase}veloroutes`, async ({ request }) => {
        const body = (await request.json()) as { trainstations?: number[] };
        if (!body?.trainstations || body.trainstations.length === 0) {
            return HttpResponse.json([]);
        }
        return HttpResponse.json(veloroutes);
    }),

    http.get(`${apiBase}veloroute/:id`, ({ params }) => {
        const id = String(params.id);
        const stops = velorouteStopsById[id];
        if (!stops) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(stops);
    }),

    http.get(`${apiBase}connection/:idAndStart`, ({ params }) => {
        const idAndStart = String(params.idAndStart);
        const connection = connectionsByIds[idAndStart];
        if (!connection) {
            return new HttpResponse(null, { status: 404 });
        }
        return HttpResponse.json(connection);
    }),

    http.get(`${apiBase}trainlines`, ({ request }) => {
        const url = new URL(request.url);
        const ids = url.searchParams.getAll("ids[]");
        return HttpResponse.json(
            ids.map((id) => ({
                id,
                name: id === "100" ? "RE1" : id === "200" ? "RE7" : id,
                agency_name:
                    id === "100"
                        ? "Deutsche Bahn"
                        : id === "200"
                          ? "DB Regio"
                          : "Unknown",
            })),
        );
    }),
];
