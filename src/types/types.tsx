export enum Coord {
    X,
    Y
}
  
export interface Stop {
    stop_name: string,
    stop_id: string,
    x: number,
    y: number
}

export interface Route {
    dist: number,
    leg: Stop[]
}

export interface CurrentTrainroute {
    connection: any,
    dur: number,
    firstStation: Stop,
    lastStation: Stop,
    line: string[],
    pathLength: number,
    points: string,
    stopIds: string[]
}

export type CurrentTrainroutes = CurrentTrainroute[];

export interface Veloroute {
    id: string, 
    name: string, 
    len: number, 
    route: Route[], 
    path: string[]
}

