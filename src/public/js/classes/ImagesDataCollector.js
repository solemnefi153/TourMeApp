import AbstractTourMeEndpointVisitor from "../interfaces/AbstractTourMeEndpointVisitor.js";

export default class ImagesDataCollector extends AbstractTourMeEndpointVisitor
{
    constructor() {
        super();
    }

    async  visitPlacesEndpoint(placesAdapter,  parameters){
        const jsonResponse = await placesAdapter.getVenueImages(parameters.venueId);
        //Check if there is at least one image
        if(jsonResponse.response.photos.count > 0){
            const foto = jsonResponse.response.photos.items[0]
            //This creates the link to the photo
            const foto_link = `${foto.prefix}${foto.width}x${foto.height}${foto.suffix}`;
            return foto_link;
        }
        //If there are no photos return undefided
        else{
            return undefined;
        }
    }
    
    async  visitWeatherEndpoint(weatherEndpointAdapter, parameters){
        let weatherData =  await weatherEndpointAdapter.getWeatherData(parameters.city)
        return `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    }
}