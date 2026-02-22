export type Coordinates = {
    x: number;
    y: number;
};
export const getRoutePath = (arr: Coordinates[][]): string[] => {
    if (!arr.length) return [];
    const getPos = (stop: Coordinates) => [stop.x, stop.y];

    const getSegmentPath = (path: number[][]) => {
        if (path.length < 1) return "";

        const getBezier = (s: number[], idx: number) => {
            const nextNext = path[idx + 2];
            const distFromPrevToNextPos = {
                x: nextNext !== undefined ? (path[idx][0] - nextNext[0]) / 4 : 0,
                y: nextNext !== undefined ? (path[idx][1] - nextNext[1]) / 4 : 0,
            };
            const Qx = s[0] + distFromPrevToNextPos.x;
            const Qy = s[1] + distFromPrevToNextPos.y;
            return `Q${Qx},${Qy}`;
        };
        const getMiddle = (s: number[], idx: number) =>
            `${getBezier(s, idx)} ${s[0]},${s[1]}`;
        const start = `M${path[0][0]},${path[0][1]}`;
        const middle = path
            .slice(1, path.length - 1)
            .map(getMiddle)
            .join(" ");
        const end = `T${path[path.length - 1][0]},${path[path.length - 1][1]}`;
        return start + middle + end;
    };
    return arr.map((segment) => segment.map(getPos)).map(getSegmentPath);
};
