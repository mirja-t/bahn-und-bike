import { 
    Trainlines 
} from './TrainlineTree';

export const generateCurrentTrainroutes = (trainlines, velorouteStops, value) => {

    const routes = new Trainlines(trainlines);

    if(!velorouteStops && parseInt(value) > 0){
        routes.getCurrentRoute(parseInt(value) * 30);
        return routes.journeys;
    }   
    
    else if(velorouteStops) {
        routes.getTrainlinesAlongVeloroute(trainlines, velorouteStops);
        return routes.journeys;
    }

}