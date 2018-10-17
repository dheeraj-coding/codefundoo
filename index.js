const express = require('express');
const apixu = require('./src/apixu');
const fs = require('fs');

var app = express();
const port = 3000;

app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.get('/heatwave', function (req, res) {
    console.log(req.query.lat);
    console.log(req.query.lon);
    jsonObj = apixu.getForecastData(req.query.lat, req.query.lon, function (data) {
        res.json(data);
        fs.writeFile('./temperature.json', JSON.stringify(data, null, 4), function (err) {
            if (err) {
                console.log("Error writing to file");
                return
            }
            console.log("Successfully saved data");
        })
    });
});

app.listen(process.env.PORT || port);




