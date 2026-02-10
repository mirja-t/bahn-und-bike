interface Bounds {
    west: number;
    south: number;
    east: number;
    north: number;
}

class SvgMapBuilder {
    west: number;
    south: number;
    east: number;
    north: number;
    scale: number;

    constructor(bounds: Bounds, scale = 100) {
        this.west = bounds.west;
        this.south = bounds.south;
        this.east = bounds.east;
        this.north = bounds.north;
        this.scale = scale;
    }

    get center() {
        const latCenter = (this.north + this.south) / 2;
        const lonCenter = (this.east + this.west) / 2;
        return [lonCenter, latCenter];
    }

    static getCenter(bounds: Bounds) {
        const latCenter = (bounds.north + bounds.south) / 2;
        const lonCenter = (bounds.east + bounds.west) / 2;
        return [lonCenter, latCenter];
    }

    static getMercatorScaleFactor(lat: number) {
        const getRadians = (deg: number) => (deg * Math.PI) / 180;
        return 1 / Math.cos(getRadians(lat));
    }

    get boundsRatio() {
        return this.size.width / this.size.height;
    }

    get size() {
        return {
            width: Math.abs(this.east - this.west) * this.scale,
            height:
                Math.abs(this.north - this.south) *
                this.scale *
                SvgMapBuilder.getMercatorScaleFactor(this.center[1]),
        };
    }

    static getSize(bounds: Bounds, scale: number = 100) {
        return {
            width: Math.abs(bounds.east - bounds.west) * scale,
            height:
                Math.abs(bounds.north - bounds.south) *
                scale *
                SvgMapBuilder.getMercatorScaleFactor(
                    (bounds.north + bounds.south) / 2,
                ),
        };
    }

    static getRadians(deg: number) {
        return (deg * Math.PI) / 180;
    }

    static getMercatorFactor(lat: number) {
        return Math.log(
            (1 + Math.sin(SvgMapBuilder.getRadians(lat))) /
                (1 - Math.sin(SvgMapBuilder.getRadians(lat))),
        );
    }

    static getMapPosition(
        longitude: number,
        latitude: number,
        bounds: Bounds,
        scale: number = 100,
    ) {
        const { width, height } = this.getSize(bounds, scale);
        const mapWidth = width; // in pixels
        const mapHeight = height; // in pixels
        const mapLonDelta = Math.abs(bounds.east - bounds.west); // in degrees

        const relativeMapWidth = mapLonDelta * this.getRadians(1);
        const mercatorSouth = this.getMercatorFactor(bounds.south);
        const mercatorLat = this.getMercatorFactor(latitude);
        const mercatorDiff = mercatorLat - mercatorSouth;
        const relativeOffsetY = mercatorDiff / relativeMapWidth / 2;

        const y = mapHeight - mapWidth * relativeOffsetY;
        const x = (longitude - bounds.west) * (mapWidth / mapLonDelta);

        return [x, y];
    }
}

export const germanyBounds: Bounds = {
    west: 5.866944,
    south: 47.271679,
    east: 15.04193,
    north: 55.0582645,
};

const svgMap = new SvgMapBuilder(germanyBounds);
const mapRatio = svgMap.boundsRatio;
const svgWidth = svgMap.size.width;
const svgHeight = svgMap.size.height;

export { SvgMapBuilder, svgMap, mapRatio, svgWidth, svgHeight };
