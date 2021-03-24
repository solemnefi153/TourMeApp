# Overview

## Description 
This application helps users make decisions on places they can visit when traveling to a city.
<br><br>
The application prompts the user for a city and renders markers on a map representing places that the user can visit in that city. Currently, the application only returns places for outdoor activities. 
 
[Software Demo Video](https://www.youtube.com/watch?v=QDZzM0QoQ7I)

[Live application](https://tourmeapp.herokuapp.com/)

## Notes from the developer
This project helped me understand the implementation of environment variables to hide sensitive information from the client, like private keys.
<br><br>
While working on this project I develop stronger learning and researching skills. I had to study the documentation of different libraries and public APIs to better implement them in my code. 

# Development Environment

Before you begin, you’ll need to register for a developer account for [Foursquare API ](https://developer.foursquare.com/developer/). Once you register your account, you will [create a new app](https://foursquare.com/developers/register).
<br>

The Foursquare API will then give you a client ID and a client secret key. Save these variables in your .env file as FORSQUARE_CLIENT_ID and FORSQUARE_CLIENT_SECRET. 
<br>

This application runs with Node. Please install [Node version 14](https://nodejs.org/en/download/) in your environment.  
<br>

If you are running the application locally, run the following command in your terminal at the root folder of this project: <b>npm install</b> to install all dependencies

# Useful Websites

* [Create a Foursquare app](https://support.appreciationengine.com/article/RGVGID0my1-creating-a-foursquare-application)
* [How to define environment varialbes](https://www.imatest.com/docs/editing-system-environment-variables/#Windows)
* [Leaflet Tutorials and documentation](https://leafletjs.com/examples.html)

# Future Work

* Allow the user to hide and display the query section to give more space to the map
* Make the application more friendly on landscape view
* Add additional queries to render targeted locations on the map 