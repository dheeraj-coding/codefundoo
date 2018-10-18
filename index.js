const express = require('express');
const weather = require('./src/apixu');
const fs = require('fs');
const moment = require('moment');
const spawn = require('child_process').spawn;


var app = express();
const port = 3000;

function log_to_csv(resp, data) {
    data['month'] = moment().format('M') - 1;
    fs.writeFile('./data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            console.log("Error writing to file");
            return
        }
        console.log("Successfully saved data");
    });
    const pythonPredict = spawn('python', ['./heat_wave_detect.py']);
    pythonPredict.stdout.on('data', function (data) {
        console.log(data.toString());
        resp.json(JSON.parse(data.toString()));
    });
}

app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.get('/heatwave', function (req, res) {
    console.log(req.query.lat);
    console.log(req.query.lon);
    var weatherFetcher = weather();
    weatherFetcher.getForecastData(req.query.lat, req.query.lon, log_to_csv.bind(this, res));
    weatherFetcher.getPriorData(req.query.lat, req.query.lon, log_to_csv.bind(this, res));
});

app.listen(process.env.PORT || port);




