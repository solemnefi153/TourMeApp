const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config  = require('../../../config');
//Makes a request to the forsquare API to get places that match a certain query
router.get('/' ,async (req, res) => {
    //Make a requres to forsquare API to get venues based on a query
    //Link that currently searches  for arts and entrettainment
    try{
        if(req.query.city != undefined){
            const category_ID = req.query.category;
            const city = req.query.city;
            const endpointPath = '/v2/venues/explore';
            const queryString = `?categoryId=${category_ID}&limit=20&radius=5000&near=${city}&client_id=${config.foursquareClientID}&client_secret=${config.foursquareClientSecret}&v=20200616`;
            const URL = `${config.forsquareUrl}${endpointPath}${queryString}`;
            const response = await fetch(URL);
            const jsonResponse = await response.json();
            res.status(jsonResponse.meta.code).send(jsonResponse);
        }
        else{
            res.status(400).send({Error: {
                message: 'City must be defined'
             }});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            meta: {
                errorDetail: 'Sonthing went wrong requesting venues'
            },
        })
    }
})
//Returns the phtos of a location 
router.get('/photos' , async (req, res) => {
    //Make a requres to forsquare API to get pictures of a venue 
    const venue_id = req.query.venue_id;
    const endpointPath = `/v2/venues/${venue_id}/photos`;
    const queryString = `?&client_id=${config.foursquareClientID}&client_secret=${config.foursquareClientSecret}&v=20200616`
    const URL = `${config.forsquareUrl}${endpointPath}${queryString}`;
    try {
        const response = await fetch(URL);
        const jsonResponse = await response.json();
        if(jsonResponse.meta.code == 429){
            // This will happen when the limit to make the premium request is reached. 
            //We want to ignore this error

            res.send({
                response: {
                    photos: []
                }   
            });
        }
        else{

            res.status(jsonResponse.meta.code).send(jsonResponse);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({Error: {
            message: 'Somthing went wrong requesting venue image'
         }})
    }
})


module.exports = router;