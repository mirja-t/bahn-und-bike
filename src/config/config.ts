/// <reference types="vite/client" />
export const headers = new Headers({
    Authorization: `Basic ${btoa(import.meta.env.VITE_API_AUTH)}`,
    "Content-Type": "application/json",
});
export const VITE_API_URL = import.meta.env.VITE_API_URL;
