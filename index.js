const express = require('express');
const weather = require('./src/apixu');
const fs = require('fs');
const moment = require('moment');
const spawn = require('child_process').spawn;
const heatmap = require('./src/heatWaveTracker');

var app = express();
const port = 3000;
var heatMapDB = heatmap();

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
    var weatherFetcher = weather();
    weatherFetcher.getForecastData(req.query.lat, req.query.lon, log_to_csv.bind(this, res));
    weatherFetcher.getPriorData(req.query.lat, req.query.lon, log_to_csv.bind(this, res));
});

app.get('/hotloc', function (req, res) {
    heatMapDB.insert(req.query.lat, req.query.lon).then((data) => {
        res.json({ 'data': data, 'status': 'success' });
    },(err)=>{
        console.log("Error"+err);
    });
});

app.listen(process.env.PORT || port);




