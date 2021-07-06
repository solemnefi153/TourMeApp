const express = require('express');
const engine = require('ejs-mate');
const path = require('path');


//Initializations
const app = express();

//Settings 
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static(path.join(__dirname, '/src/public')));

//Midleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routers 
app.use('/', require('./src/routes/map/index.js'));
app.use('/places', require('./src/routes/places/index.js'));
app.use('/weather', require('./src/routes/weather/index.js'));
app.use('/categories', require('./src/routes/categories/index.js'));

//Start Server 
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening in port ${port}`)
})
