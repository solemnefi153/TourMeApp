import AbstractTourMeEndpointVisitor from "../interfaces/AbstractTourMeEndpointVisitor.js";

export default class MappingDataCollector extends AbstractTourMeEndpointVisitor
{
    //Overwrites the parent abstract constructor 
    constructor() {
        super();
    }

    async  visitPlacesEndpoint(placesAdapter,  parameters){
        let jsonResponse = await placesAdapter.getCityVenues(parameters.city, parameters.category);
        const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
        const center = jsonResponse.response.geocode.center
        //Return all the venues and an array with the coordinates of the city 
        return {venues: venues, center: [center.lat, center.lng]};
        
    }
    
    async  visitWeatherEndpoint(weatherAdapter, parameters){
        return weatherAdapter.getWeatherData(parameters.city)
    }
}