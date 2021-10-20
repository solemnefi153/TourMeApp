import AbstractEndpointAdapter from "../interfaces/AbstractEndpointAdapter.js";

export default class CategoriesEndpointAdapter extends AbstractEndpointAdapter
{
    constructor() {
        super();
    }

    //Get the venue categories
    async getVenueCategories (){
        const urlToFetch = `/categories`;
        const response = await fetch(urlToFetch);
        const jsonResponse = await response.json();
        return jsonResponse;
    }
    //Get the venue categories
    async  getVenueSubCategories(parentCategory){
        const urlToFetch = `/categories/${parentCategory}`;
        const response = await fetch(urlToFetch);
        const jsonResponse = await response.json();
        return jsonResponse;
    }
}