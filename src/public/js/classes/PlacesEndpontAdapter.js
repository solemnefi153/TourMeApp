import AbstractEndpointAdapter from "../interfaces/AbstractEndpointAdapter.js";

export default class PlacesEndpontAdapter extends AbstractEndpointAdapter
{
    //Overwrites the parent abstract constructor 
    constructor() {
        super();
    }

    async accept(concretetAPIVisitor, parameters){
        concretetAPIVisitor.visitPlacesService(this, parameters);
    }

    async getCityVenues(city, category){
        const urlToFetch = `/places?city=${city}&category=${category}`
        const response = await fetch(urlToFetch);
        const jsonResponse = await response.json();
        return jsonResponse; 
    }

    async getVenueImages(venueId){
        const urlToFetch = `/places/photos?venue_id=${venueId}`
        const response = await fetch(urlToFetch);
        const jsonResponse = await response.json();
        return jsonResponse;
    }

}