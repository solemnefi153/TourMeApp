import AbstractEndpointAdapter from "../interfaces/AbstractEndpointAdapter.js";

export default class WeatherEndpointAdapter extends AbstractEndpointAdapter
{
    //Overwrites the parent abstract constructor 
    constructor() {
        super();
    }

    async  accept(concretetAPIVisitor, parameters){
        concretetAPIVisitor.visitWeatherService(this, parameters);
    }

    async  getWeatherData(city){
        const urlToFetch = `/weather?city=${city}`
        const response = await fetch(urlToFetch);
        const jsonResponse = await response.json();
        return jsonResponse;
    }
}