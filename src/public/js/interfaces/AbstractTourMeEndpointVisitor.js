
export default class AbstractTourMeEndpointVisitor
{
    constructor() {
        if(this.constructor == AbstractTourMeEndpointVisitor){
            throw new Error(" Object of Abstract Class cannot be created");
        }
    }
    async  visitPlacesEndpoint(placesAdapter,  parameters){
        throw new Error("Abstract Method has no implementation");
    }
    async  visitWeatherEndpoint(weatherAdapter, parameters){
        throw new Error("Abstract Method has no implementation");
    }
}