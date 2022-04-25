import { svg_scale } from "../../data/svg_scale";
const {xFactor, yFactor, xOffset, yOffset} = svg_scale;

export class TrainlineTree {

    constructor(stopdata, nextStops = []){
        this.stop = stopdata;
        this.next_stops = nextStops;
    }

    getStop(){
        return this
    }

    getNextStopById(id, currentParent){
        return currentParent.find(s => s.stop.stop_id === id);
    }

    getPathLength(parentdata, x, y) {
        return Math.round(parentdata.pathLength + Math.sqrt(Math.abs(x - this.stop.x) ** 2 + Math.abs(y - this.stop.y) ** 2))
    }

    addChild(stopdata, parent) {
        parent.next_stops.push({
            stop: {
                dur: parent.stop.dur + stopdata.dur,
                trainline_ids: [stopdata.trainline_id],
                pathLength: this.getPathLength(parent.stop, stopdata.x, stopdata.y),
                stop_ids: parent.stop.stop_ids.concat(stopdata.stop_id),
                points: parent.stop.points + `${stopdata.lon * xFactor + xOffset},${- stopdata.lat * yFactor + yOffset} `,
                stop_name: stopdata.stop_name,
                stop_number: parent.stop.stop_number+1,
                stop_id: stopdata.stop_id,
                lat: stopdata.lat,
                lon: stopdata.lon,
                x: stopdata.lon * xFactor + xOffset,
                y: - stopdata.lat * yFactor + yOffset,
                connection: parent.stop.connection || null
            },
            next_stops: []
        });
    }

    addTrainlineIds(stopdata, parent) {
        if(!parent) return
        if(!parent.stop.trainline_ids.includes(stopdata.trainline_id))
            parent.stop.trainline_ids = parent.stop.trainline_ids.concat([stopdata.trainline_id])
        return parent
    }

    addConnection(change, currentStop) {
        // add change stop info
        change.stop.connection = {
            stop_name: change.stop.stop_name,
            initial_train: change.stop.trainline_ids,
            connecting_train: currentStop.trainline_id
        }
    }

    buildTrainline(currentParent, currentItem, stops) {
        //console.log('buildTrainline','\n parent: ',currentParent.stop.stop_name, currentParent.stop.trainline_ids, '\n current: ',currentItem.stop_name, '\n next: ',stops[0]?.stop_name)

        let childIds = !!this.getNextStopById(currentItem.stop_id, currentParent.next_stops);
        if(childIds) {

            let abort = false;
            do {
                this.addTrainlineIds(currentItem, currentParent)
                currentParent = this.getNextStopById(currentItem.stop_id, currentParent.next_stops); 
                this.addTrainlineIds(currentItem, currentParent)

                if(!stops.length) {
                    abort = true
                    break
                }
                currentItem = stops.shift();
                childIds = !!this.getNextStopById(currentItem.stop_id, currentParent.next_stops);

            } while(childIds && stops.length)
            
            if(!abort) {
                this.buildTrainline(currentParent, currentItem, stops)
            }
        }
        else {
            this.addChild(currentItem, currentParent)

            if(!stops.length) return
            this.buildTrainline(currentParent.next_stops[currentParent.next_stops.length-1], stops.shift(), stops)
        }
    }

    addTrainlines(currentStops, idx, change = this) {
        if(currentStops[idx].stop_id !== change.stop.stop_id) { // in case of incorrect db data
            console.log('broken trainline data: ', currentStops[idx].trainline_id)
            return
        }
        if(change.stop.stop_number > 0) {
            this.addConnection(change, currentStops[idx]);
        }
        const section2 = currentStops.splice(0, idx).reverse()
        const section1 = currentStops;
       
        this.addTrainlineIds(section1.shift(), change);
        currentStops = [section1, section2]

        if(currentStops.length){
            currentStops.forEach(line => {
                if(!line.length) return
                const firstStop = line.shift()
                this.buildTrainline(change, firstStop, line)
            })
        }
    }

    getRouteStopByLineId(current, stop){
        let change = null;
        const depthTraversal = (current) => {
            if(current.stop.stop_id === stop.stop_id) {
                change = current
                return
            }

            current = current.next_stops.filter(s => s.stop.trainline_ids.includes(stop.trainline_id));
            if(!current) return
            current.forEach(child => depthTraversal(child));
        }
        depthTraversal(current);
        return change
    }

    addIndirectTrainline(change, stops, idx) {
        const changeStop = this.getRouteStopByLineId(this, change);
        this.addTrainlines(stops, idx, changeStop);
    }

    get trainlines() {
        return {
            stop: this.stop, 
            next_stops: this.next_stops
        }
    }

    print(data = this, level = 0) {
        let result = '';
        for (let i = 0; i < level; i++) {
          result += '-- ';
        }
        console.log(`${result}${data.stop.stop_number}. ${data.stop.stop_name} ${data.stop.trainline_ids.join(', ')}`);
        data.next_stops.forEach(child => this.print(child, level + 1));
    }
}

export class Trainlines extends TrainlineTree {
    constructor(stopdata, nextStops = []) {
      super(stopdata, nextStops);
      this._journeys = [];
    } 

    generateRoute(laststop, firststop) {
        let train = {
            dur: laststop.dur,
            line: laststop.trainline_ids,
            pathLength: laststop.pathLength,
            firstStation: {
                stop_name: firststop.stop_name,
                stop_id: firststop.stop_id,
                x: firststop.x,
                y: firststop.y
            },
            lastStation: {
                stop_name: laststop.stop_name,
                stop_id: laststop.stop_id,
                x: laststop.x,
                y: laststop.y
            },
            stopIds: laststop.stop_ids,
            points: laststop.points,
            connection: laststop.connection || null
        }

        return train
    }

    getCurrentRoute(maxDur, route = this) {
        if(maxDur===0) {
            this._journeys = [];
            return
        }
        let prevItem = route;
        
        if(route.stop.dur <= maxDur) {
            prevItem = route;
        }
        if(route.stop.dur > maxDur || !route.next_stops.length) {
            this._journeys.push(this.generateRoute(prevItem.stop, this.stop))
            return 
        }
        route.next_stops.forEach(child => this.getCurrentRoute(maxDur, child));
    }

    getDirectTrainlineRoute(start, stop){
        let change = null;
        stop.trainstops.forEach(id => {
            if(change) return
            change = this.getRouteStopByLineId(start, {stop_id: stop.stop_id, trainline_id: id});
        });

        if(change) {
            this._journeys.push(this.generateRoute(change.stop, start));
        }
    }

    getShortestConnection(start, stop) {
        let dur = 240;
        let shortestJourney = {
            stop: start.stop, 
            next_stops: start.next_stops
        };

        let queue = [{
            stop: start.stop, 
            next_stops: start.next_stops
        }];

        while (queue.length > 0) {
            const current = queue.shift();
            if(current.stop.stop_id===stop.stop_id && current.stop.dur < dur){
                shortestJourney = current;
                dur = current.stop.dur;
            }
            queue = queue.concat(current.next_stops);
        }
        this._journeys.push(this.generateRoute(shortestJourney.stop, start.stop));
    }

    getTrainlinesAlongVeloroute(start, stops) {
        stops.forEach(stop => {
            const directline = stop.trainstops && start.stop.trainline_ids.find(id => stop.trainstops.includes(id));
            if(directline) {
                this.getDirectTrainlineRoute(start, stop)
            }
            else {
                this.getShortestConnection(start, stop)
            }
        });
    }

    get journeys(){
        return this._journeys
    }
}