const express = require('express');
const weather = require('./src/apixu');
const fs = require('fs');
const moment = require('moment');

var app = express();
var weatherFetcher = weather();
const port = 3000;

function log_to_csv(data) {
    data['month']=moment().format('M')-1;
    fs.writeFile('./data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            console.log("Error writing to file");
            return
        }
        console.log("Successfully saved data");
    })
}

app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.get('/heatwave', function (req, res) {
    console.log(req.query.lat);
    console.log(req.query.lon);
    weatherFetcher.getForecastData(req.query.lat, req.query.lon, log_to_csv);
    weatherFetcher.getPriorData(req.query.lat, req.query.lon, log_to_csv);
});

app.listen(process.env.PORT || port);




