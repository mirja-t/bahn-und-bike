interface Bounds {
    west: number,
    south: number,
    east: number,
    north: number
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
        return [ lonCenter, latCenter ];
    }

    get mercatorScaleFactorY() {
        const getRadians = (deg: number) => deg * Math.PI / 180;
        const lat = this.center[1];
        return 1 / Math.cos(getRadians(lat));
    }

    get boundsRatio() {
        return this.size.width / this.size.height;
    }

    get size() {
        return {
            width: Math.abs(this.east - this.west) * this.scale,
            height: Math.abs(this.north - this.south) * this.scale * this.mercatorScaleFactorY
        }
    }

    getRadians(deg: number) {
        return deg * Math.PI / 180;
    }

    getMercatorFactor(lat: number) {
        return Math.log((1 + Math.sin(this.getRadians(lat))) / (1 - Math.sin(this.getRadians(lat))));
    }

    getMapPosition(longitude: number, latitude: number) {

        const mapWidth = this.size.width; // in pixels
        const mapHeight = this.size.height; // in pixels
        const mapLonDelta = Math.abs(this.east - this.west); // in degrees
        
        let relativeMapWidth = mapLonDelta * this.getRadians(1);
        let mercatorSouth = this.getMercatorFactor(this.south);
        let mercatorLat = this.getMercatorFactor(latitude);
        let mercatorDiff = mercatorLat - mercatorSouth;
        let relativeOffsetY = mercatorDiff / relativeMapWidth / 2;

        let y = mapHeight - mapWidth * relativeOffsetY;
        let x = (longitude - this.west) * (mapWidth / mapLonDelta);

        return [x, y];
    }
}


const germanyBounds: Bounds = {
    west: 5.866944, 
    south: 47.271679, 
    east: 15.04193, 
    north: 55.0582645
}

const svgMap = new SvgMapBuilder(germanyBounds);
const mapRatio = svgMap.boundsRatio;
const svgWidth = svgMap.size.width;
const svgHeight = svgMap.size.height;
const getMapPosition = svgMap.getMapPosition.bind(svgMap);

export { 
    svgMap, 
    mapRatio, 
    svgWidth, 
    svgHeight, 
    getMapPosition 
}