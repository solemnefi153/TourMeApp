const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config  = require('../../../config');

//Makes a request to the forsquare API to get all the categories
router.get('/' ,async (req, res) => {
    try{
        const endpointPath = '/v2/venues/categories';
        const queryString = `?&client_id=${config.foursquareClientID}&client_secret=${config.foursquareClientSecret}&v=${config.foursquareVersionDate}`;
        const URL = `${config.forsquareUrl}${endpointPath}${queryString}`;
        const response = await fetch(URL);
        const jsonResponse = await response.json();
        res.status(jsonResponse.meta.code).send(jsonResponse);
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            meta: {
                errorDetail: 'Sonthing went wrong requesting venue categories'
            },
        })
    }
});
//Makes a request to the forsquare API to get all subcategories of a main category
router.get('/:parent_category' ,async (req, res) => {
    try{
        const parent_category = req.params.parent_category;
        const endpointPath = '/v2/venues/categories';
        const queryString = `?&client_id=${config.foursquareClientID}&client_secret=${config.foursquareClientSecret}&v=${config.foursquareVersionDate}`;
        const URL = `${config.forsquareUrl}${endpointPath}${queryString}`;
        const response = await fetch(URL);
        const jsonResponse = await response.json();
        const matchedCategories = jsonResponse.response.categories.filter(category => { return category.id == parent_category;});
        if(matchedCategories.length > 0){
            const subCategories = matchedCategories[0].categories;
            res.status(jsonResponse.meta.code).send(subCategories);
        }
        else{
            res.status(404).send({
                meta: {
                    errorDetail: 'Category not found'
                },
            })
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            meta: {
                errorDetail: 'Sonthing went wrong requesting venue sub categories'
            },
        })
    }
});


module.exports = router;