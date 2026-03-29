export const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number => {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const R = 6371e3; // Earth radius in meters
    const a1 = toRadians(lat1);
    const a2 = toRadians(lat2);
    const b1 = toRadians(lat2 - lat1);
    const b2 = toRadians(lon2 - lon1);

    const a =
        Math.sin(b1 / 2) * Math.sin(b1 / 2) +
        Math.cos(a1) * Math.cos(a2) * Math.sin(b2 / 2) * Math.sin(b2 / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c) / 1000; // Distance in kilometers
};
