const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/' ,async (req, res) => {
    //Make a requres to forsquare API to get venues based on a query
    //Link that currently searches  for arts and entrettainment
    if(req.query.city != undefined){
        const foursquareClientID = process.env.foursquareClientID;
        const foursquareClientSecret = process.env.foursquareClientSecret;
        const category_ID = '4d4b7105d754a06377d81259';
        const city = req.query.city;
        const baseURL = 'https://api.foursquare.com/v2/venues/explore';
        const credentials = `&client_id=${foursquareClientID}&client_secret=${foursquareClientSecret}&v=20200616`
        const URL = `${baseURL}?categoryId=${category_ID}&limit=10&radius=5000&near=${city}${credentials}`;
        try {
            const response = await fetch(URL);
            const jsonResponse = await response.json();
            if (response.ok) {
                res.send(jsonResponse)
            }
        }
        catch (err) {
            res.send(new Error("Unable to process request")).status(400)
        }
    }
    else(
        res.send(new Error("Unable to process request")).status(400)
    )
})


router.get('/photos' , async (req, res) => {
    //Make a requres to forsquare API to get pictures of a venue 
    const foursquareClientID = process.env.foursquareClientID;
    const foursquareClientSecret = process.env.foursquareClientSecret;
    const venue_id = req.query.venue_id;
    const baseURL = `https://api.foursquare.com/v2/venues/${venue_id}/photos`;
    const credentials = `&client_id=${foursquareClientID}&client_secret=${foursquareClientSecret}&v=20200616`
    const URL = `${baseURL}?${credentials}`;
    try {
        const response = await fetch(URL);
        const jsonResponse = await response.json();
        if (response.ok) {
            res.send(jsonResponse)
        }
        if(jsonResponse.meta.code == 429){
            res.send(undefined)
        }
        else{
            res.send(new Error("Unable to process request")).status(jsonResponse.meta.code)
        }
    }
    catch (err) {
        res.send(new Error("Unable to process request")).status(400)
    }
})


module.exports = router;