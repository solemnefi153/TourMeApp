const dotenv = require('dotenv');
const assert = require('assert');

//This line sets the environment variables found in .env
dotenv.config();

//Grab the environment variables
const PORT = process.env.PORT || 8880;
const {
    FORSQUARE_CLIENT_ID,
    FORSQUARE_CLIENT_SECRET,
    FOURSQUARE_URL,
    OPEN_WEATHER_KEY,
    OPEN_WEATHER_URL
} = process.env;

assert(PORT, 'PORT environment variable is rquired');
assert(FORSQUARE_CLIENT_ID, 'FORSQUARE_CLIENT_ID environment variable is rquired');
assert(FORSQUARE_CLIENT_SECRET, 'FORSQUARE_CLIENT_SECRET environment variable is rquired');
assert(FOURSQUARE_URL, 'FOURSQUARE_URL environment variable is rquired');
assert(OPEN_WEATHER_KEY, 'OPEN_WEATHER_KEY environment variable is rquired');
assert(OPEN_WEATHER_URL, 'OPEN_WEATHER_URL environment variable is rquired');


module.exports = {
    port: PORT,
    foursquareClientID : FORSQUARE_CLIENT_ID,
    foursquareClientSecret: FORSQUARE_CLIENT_SECRET,
    forsquareUrl : FOURSQUARE_URL,
    openWeatherKey: OPEN_WEATHER_KEY,
    openWeatherUrl : OPEN_WEATHER_URL
}
