//Load the map on the screen 
const mymap = L.map('mapdiv', { zoomControl: false });
//Set view to Dubai
mymap.setView([25.05, 55.17], 12);

//Add layer to the map
let backgroundLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
mymap.addLayer(backgroundLayer);
new L.Control.Zoom({ position: 'bottomright' }).addTo(mymap);

// Page Elements
const sideBar = $('#sideBar')
const searchSection = $('#searchSection')
const city_input = $('#city_input');
const category_input = $('#category_input');
const sub_category_input = $('#sub_category_input');
const sub_category_input_label = $('#sub_category_input_label');
const searchForm = $('#searchForm');
const search_btn = $('#search_btn');
const hide_show_menu_btn = $('#hide_show_menu_btn');
const toggleIcon =  $('#toggleIcon');
const weatherdiv = $('#weatherdiv');


// Search for the venues in Foursquare
const getVenues = async () => {
    const city = city_input.val();
    let category = category_input.val();
    //check if the subCategory has been set
    if(sub_category_input.val() != null){
        //Replace the requested category
        category = sub_category_input.val();
    }
    //We need the this to make an call to a Proxy api that uses private keys
    const urlToFetch = `/places?city=${city}&category=${category}`
    const response = await fetch(urlToFetch);
    const jsonResponse = await response.json();
    if (response.ok) {
        const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
        const center = jsonResponse.response.geocode.center
        //Return all the venues and an array with the coordinates of the city 
        return {venues: venues, center: [center.lat, center.lng]};
    }
    else{
        throw jsonResponse;
    }
 
}
//Generage a link to an image of a venue
const getVenuePhotoLink = async (venue_id) => {
    const urlToFetch = `/places/photos?venue_id=${venue_id}`
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
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
    }
    catch (error) {
        console.log(error) ;
    }
}
// Render markers of venues On map 
const renderVenuesOnMap =  (venues_object) => {
    //Set the view of the map to the City that was searched 
    mymap.setView(venues_object.center, 13);
    //Loop throuhg the venues and create a marker for each one of them
    //Create a popup and try to get an image of the venue as well
    venues_object.venues.forEach( async (item, index) => {
        let venue = venues_object.venues[index];
        if(venue.name != undefined){

            let image_link = undefined;
            //Generate a link to a venue photo 
            //This will return undefined if there has been more than 50 requests
            image_link = await getVenuePhotoLink(venue.id);
    
            //If there was not photo make the link point to the venue category icon
            if(image_link == undefined){
                const venueIcon = venue.categories[0].icon;
                image_link = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
            }
            //Create the HTML for the pop up 
            var str = '<h2>' + venue.name + '</h2><hr><br>';
            str += '<div class="pupup_content"><img class="popup_image" src="' + image_link + '">';
            str += '<div><a class="pupup_btn" target=blank href="https://www.google.com/search?q=';
            str +=  venue.name.replace(' ', '+')
            if(venue.location.city != undefined){
            str += ',+' + venue.location.city.replace(' ', '+');
            } 
            str += '" >Learn More</a><br><br>';
            str += '<a class="pupup_btn" target=blank href="https://www.google.com/maps/search/' 
            str += venue.name.replace(' ', '+') + '+';
            if(venue.location.city != undefined){
                str += venue.location.city.replace(' ', '+');
            }
            if(venue.location.postalCode != undefined){
                str += venue.location.postalCode;
            }  
            str += '" >Go there</a></div></div>';

            //Add the marker with the pop up to the map 
            //In the future we will append this to a layer  
            L.marker([venue.location.lat, venue.location.lng]).addTo(mymap).bindPopup(str);
        }
    });
};
//This function removes all markers on the map to start a new search
const removeAllMarkers = () => {
    //Remove all the current markers 
    $(".leaflet-marker-icon").remove();
    $(".leaflet-popup").remove();
    $(".leaflet-marker-shadow").remove();
};
// Search for the weather from openWeather
const getWeather = async () => {
    const city = city_input.val();
    //We need the this to make an call to a Proxy api that uses private keys
    const baseHref = window.location.href
    const urlToFetch = `/weather?city=${city}`
    const response = await fetch(urlToFetch);
    const jsonResponse = await response.json();
    if (response.ok) {
        return jsonResponse;
    }
    else{
        throw jsonResponse;
    }
 
}
//Function necesary to convert kelvin to fahrenheit
const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);
//Creates the necesary HTML do display a div with the weather of a city
const createWeatherHTML = (weather) => {
    return `
        <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
		<p>${kelvinToFahrenheit(weather.main.temp)}&deg;F</p>
		<p>${weather.weather[0].description}</p>`;
  	    
}
//Renders a div in the UI with information about the current city weather
const renderWeather = (weather) => {
    let weatherContent = createWeatherHTML(weather);
    weatherdiv.html(weatherContent);
}
//This function removes the div containing the weather information
const removeWeatherInfo = () => {
    weatherdiv.html('');
}
//Displays an error message on the map
const notifyErrorOnSearch = (message, error='') => {
    console.log(error);
    $(".alert").text(message);
    $(".alert").show().delay(5000).fadeOut();
}
//Runs the program to render markers on a map based on a query
const executeSearch = () => {
    //There must be a value provided for the city 
    if(city_input.val() !== '' &&  category_input.val() !== null){
        toggleShowSideBar();
        //Fetch and render the new markers on the map  
        getVenues()
            .then(venues_object => renderVenuesOnMap(venues_object))
            .catch(error => {
                console.log(error)
                if(error.meta.errorDetail !== undefined){
                    notifyErrorOnSearch(error.meta.errorDetail, error);
                }
                else{
                    notifyErrorOnSearch('Something went wrong requesting venues' );
                }
            })
        getWeather()
            .then(weather => {
                renderWeather(weather);
            })
            .catch(error => {
                console.log(error)
                notifyErrorOnSearch('Something went wrong requesting the weather' );
            })
        //Remove previous markers 
        removeAllMarkers();
        //Remove weather info 
        removeWeatherInfo();

    }
    else{
        notifyErrorOnSearch("Must provide a city name and category");
    }
}
//Compresses or expands the side bar
const toggleShowSideBar = () => {
    sideBar.toggleClass('hideSideBar');
    if(toggleIcon.attr('name') == "chevron-back-outline"){
        toggleIcon.attr('name', "search-outline");
    }
    else{
        toggleIcon.attr('name', "chevron-back-outline");
    }
}
//Event listener to toggles the search menu
hide_show_menu_btn.click(toggleShowSideBar);
//This is an event listener of the form to submit the query and filters to the server
searchForm.submit(function(e){
    e.preventDefault();
    executeSearch();
});
//Get the venue categories
const getVenueCategories= async () => {
    const urlToFetch = `/categories`;
    const response = await fetch(urlToFetch);
    const jsonResponse = await response.json();
    return jsonResponse;
}
//Get the venue categories
const getVenueSubCategories= async (parentCategory) => {
    const urlToFetch = `/categories/${parentCategory}`;
    const response = await fetch(urlToFetch);
    const jsonResponse = await response.json();
    return jsonResponse;
}
//Request all the main categories and renders them on the select input field
const loadMainCategoriesOnTheForm = async () => {
    //Get the main categories 
    const mainCategories = await getVenueCategories();
    let newHtml = "<option value='' disabled selected hidden>----------</option> ";
    mainCategories.forEach( category => {
        newHtml += `
        <option value='${category.id}'>${category.name}</option>`
    })
    category_input.html(newHtml);
}
loadMainCategoriesOnTheForm();
//Request all the main categories and renders them on the select input field
const loadSubCategoriesOnTheForm = async () => {
    //Grab the current parent category
    let parrentCategoryId = category_input.val();
    //Get the main categories 
    const subCategories = await getVenueSubCategories(parrentCategoryId);
    let newHtml = "<option value='' disabled selected hidden>----------</option> ";
    subCategories.forEach( category => {
        newHtml += `
        <option value='${category.id}'>${category.name}</option>`
    })
    sub_category_input.html(newHtml);
    sub_category_input.show();
    sub_category_input_label.show();
}
category_input.change(loadSubCategoriesOnTheForm);







