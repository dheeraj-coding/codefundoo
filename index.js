const express = require('express');
const fs = require('fs');
const moment = require('moment');
const spawn = require('child_process').spawn;
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const request = require('request');
const json2csv = require('json2csv').Parser;
const ObjectID = require('mongodb').ObjectID;

const weather = require('./src/apixu');
const heatmap = require('./src/heatWaveTracker');
const pushnotify = require('./src/pushNotification');
const constants = require('./src/constants');
const hospital = require('./src/hospitals');
const DB = require('./src/db');

const app = express();
const port = 8080;
const heatMapDB = heatmap();
const notifier = pushnotify();
const hospitals = hospital();

const data_fields = ["maxtemp_c", "maxtemp_f", "mintemp_c", "mintemp_f", "avgtemp_c", "avgtemp_f",
    "maxwind_mph", "maxwind_kph", "totalprecip_mm", "totalprecip_in", "avgvis_km", "avgvis_miles", "avghumidity", "date"];
const opts = { data_fields };
const parser = new json2csv(opts);
var db = new DB();
db.connect(constants.uri, 'HeatMap').then(() => console.log("HEATMAP DB Connection Successful:"), (err) => console.log("DB Connection Failed:" + err));


function heartRateMonitor(userid, resp) {
    const collection = db.db.collection('users');
    collection.find({ '_id': new ObjectID(userid) }).toArray((err, result) => {
        if (result.length >= 0) {
            fs.writeFile('./heartrate.json', JSON.stringify({ 'Points': result[0]['Points'] }, null, 4), function (err) {
                if (err) {
                    console.log("Error writing to file");
                    return
                }
                const pythonPredict = spawn('python', ['./anomaly_detection.py']);
                pythonPredict.stdout.on('data', function (data) {
                    resp.json(JSON.parse(data.toString()));
                });
                console.log("Successfully saved heart_rate data");
            });
        } else {
            resp.json({ 'status': 'success' });
        }


    });

}

function log_to_csv(resp, data) {
    data['month'] = moment().format('M') - 1;
    fs.writeFile('./data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            console.log("Error writing to file");
            return
        }
        const pythonPredict = spawn('python', ['./heat_wave_detect.py']);
        pythonPredict.stdout.on('data', function (data) {
            resp.json(JSON.parse(data.toString()));
        });
        console.log("Successfully saved data");
    });

}


setInterval(notifier.notificationServiceWorker.bind(notifier), constants.userCheckFrequency);

setInterval(() => {
    const collection = db.db.collection('weather');
    var weather_list = [];
    collection.find().toArray((err, result) => {
        result.forEach((val) => {
            val['weather'].forEach((weathVal) => {
                weather_list.push(weathVal);
            })
        });
        const csv = parser.parse(weather_list);
        fs.writeFile('./data.csv', csv, function (err) {
            if (err) {
                console.log("Error writing csv to file");
                return
            }
            console.log("Successfully csv saved data");
            const pythonPredict = spawn('python', ['./heat_wave_analysis.py']);
            pythonPredict.stdout.on('data', function (data) {
                console.log("Python Predictive model accuracy:" + data.toString());
            });
        });
    });
}, constants.dataDumpFrequency);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/heatwave', function (req, res) {
    var weatherFetcher = weather();
    const lat = req.query.lat;
    const lon = req.query.lon;
    request({
        uri: 'https://eu1.locationiq.com/v1/reverse.php?key=' + constants.apiKey + '&lat=' + lat + '&lon=' + lon + '&format=json',
        method: "GET",
        followRedirect: true,
    }, (error, response, body) => {
        if (error) {
            console.log('Error in Reverse Geocoder');
            reject(err);
        }
        parsed = JSON.parse(body);
        weatherFetcher.getForecastData(req.query.lat, req.query.lon, log_to_csv.bind(this, res));
        weatherFetcher.getPriorData(req.query.lat, req.query.lon, parsed['address']['postcode'], log_to_csv.bind(this, res));
    });

});

app.post('/hotloc', function (req, res) {
    heatMapDB.insert(req.body.lat, req.body.lon).then((data) => {
        res.json({ 'data': data, 'status': 'success' });
    }, (err) => {
        console.log("Error" + err);
        res.json({ 'status': 'failed', 'error': err });
    });
});

app.post('/affected', function (req, res) {
    heatMapDB.addAffectedUser(req.body.lat, req.body.lon, req.body.userid).then((data) => {
        hospitals.pushToFirebase(data.name, data.phone, req.body.lat, req.body.lon, data.postcode, data.display_name);
        res.json({ 'data': data, 'status': 'success' });
    }, (err) => {
        console.log("Error" + err);
        res.json({ 'status': 'failed', 'error': err });
    })
});

app.post('/users', function (req, res) {
    heatMapDB.insertUser(req.body.lat, req.body.lon, req.body.phone, req.body.name, req.body.regtoken).then((data) => {
        res.json({ 'data': data, 'status': 'success' });
    }, (err) => {
        res.json({ 'error': err, 'status': 'failed' });
    })
});

app.put('/users', function (req, res) {
    if (req.body.heart_rate) {
        heatMapDB.updateHeartRate(req.body.userid, req.body.heart_rate).then((data) => {
            heartRateMonitor(req.body.userid, res);
        }, (err) => {
            res.json({ 'error': err, 'status': 'failed' });
        });
    } else {
        heatMapDB.updateUser(req.body.lat, req.body.lon, req.body.userid).then((data) => {
            res.json({ 'data': data, 'status': 'success' });
        }, (err) => {
            res.json({ 'error': err, 'status': 'failed' });
        });
    }
});

//HTML file server.
app.use(express.static(path.join(__dirname + '/public')));

//DashBoard routes
app.post('/hospitals', function (req, res) {
    hospitals.register(req.body.name, req.body.password, req.body.repeat, req.body.lat, req.body.lon).then((result) => {
        res.json({ 'data': result, 'status': 'success' });
    }, (err) => {
        res.json({ 'error': err, 'status': 'failed' });
    });
});
app.listen(process.env.PORT || port);