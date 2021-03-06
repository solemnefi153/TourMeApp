//Load the map on the screen 
const mymap = L.map('mapdiv');
//Set view to Dubai
mymap.setView([25.05, 55.17], 12);

//Add layer to the map
let backgroundLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
mymap.addLayer(backgroundLayer);

// Page Elements
const input = $('#city_input');
const search_btn = $('#search_btn');
const hide_show_btn = $('#hide_show_btn');

// Search for the venues in Foursquare
const getVenues = async () => {
    const city = input.val();
    //We need the this to make an call to a Proxy api that uses private keys
    const baseHref = window.location.href
    const urlToFetch = `${baseHref}findPlaces?city=${city}`
    const response = await fetch(urlToFetch);
    const jsonResponse = await response.json();
    if (response.ok) {
        const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
        const center = jsonResponse.response.geocode.center
        //Return all the venues and an array with the coordinates of the city 
        return {venues: venues, center: [center.lat - .025, center.lng]};
    }
    else{
        throw jsonResponse;
    }
 
}

//Generage a link to an image of a venue
const getVenuePhotoLink = async (venue_id) => {
    const baseHref = window.location.href
    const urlToFetch = `${baseHref}findPlaces/photos?venue_id=${venue_id}`
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

const removeAllMarkers = () => {
    //Remove all the current markers 
    $(".leaflet-marker-icon").remove();
    $(".leaflet-popup").remove();
    $(".leaflet-marker-shadow").remove();
};

const notifyErrorOnSearch = (message, error='') => {
    console.log(error);
    $(".alert").text(message);
    $(".alert").show().delay(5000).fadeOut();
}


const executeSearch = () => {
    //There must be a value provided for the city 
    if(input.val() !== ''){
        //Remove previous markers 
        removeAllMarkers();
        //Fetch and render the new markers on the map  
        getVenues().then(venues_object => renderVenuesOnMap(venues_object))
            .catch(error => {
                if(error.meta.errorDetail !== undefined){
                    notifyErrorOnSearch(error.meta.errorDetail, error);
                }
                else{
                    notifyErrorOnSearch('Something went wrong' );
                }
            })
    }
    else{
        notifyErrorOnSearch("Must provide a city name");
    }
}

search_btn.click(executeSearch)


