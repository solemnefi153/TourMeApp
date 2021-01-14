const express = require('express');
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const path = require('path');

//Initializations
const app = express();

//Settings 
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

//Midleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routers 
app.use('/', require('./routes/index.js'));
app.use('/findPlaces', require('./routes/findPlaces.js'));


//Other Settings 
app.use(express.static(path.join(__dirname, 'public')));

//Start Server 
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening in port ${port}`)
})
