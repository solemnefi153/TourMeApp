const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const config  = require('../../../config');
//Makes a request to the openweather API to get weather of a specific city 
router.get('/' ,async (req, res) => {
    try{
        if(req.query.city != undefined){
            const city = req.query.city;
            const URL = `${config.openWeatherUrl}?q=${city}&APPID=${config.openWeatherKey}`;
            const response = await fetch(URL);
            const jsonResponse = await response.json();
            res.status(jsonResponse.cod).send(jsonResponse);
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
                errorDetail: 'Sonthing went wrong requesting the weather'
            },
        })
    }
})

module.exports = router;
