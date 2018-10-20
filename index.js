const express = require('express');
const weather = require('./src/apixu');
const fs = require('fs');
const moment = require('moment');
const spawn = require('child_process').spawn;
const heatmap = require('./src/heatWaveTracker');
const pushnotify = require('./src/pushNotification');
const bodyParser = require('body-parser');
const constants = require('./src/constants');

const app = express();
const port = 3000;
const heatMapDB = heatmap();
const notifier = pushnotify();

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
setInterval(notifier.notificationServiceWorker.bind(notifier), constants.userCheckFrequency);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.get('/heatwave', function (req, res) {
    var weatherFetcher = weather();
    weatherFetcher.getForecastData(req.query.lat, req.query.lon, log_to_csv.bind(this, res));
    weatherFetcher.getPriorData(req.query.lat, req.query.lon, log_to_csv.bind(this, res));
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
        res.json({ 'data': data, 'status': 'success' });
    }, (err) => {
        console.log("Error" + err);
        res.json({ 'status': 'failed', 'error': err });
    })
});
app.post('/users', function (req, res) {
    heatMapDB.insertUser(req.body.lat, req.body.lon, req.body.name, req.body.regtoken).then((data) => {
        res.json({ 'data': data, 'status': 'success' });
    }, (err) => {
        res.json({ 'error': err, 'status': 'failed' });
    })
});
app.put('/users', function (req, res) {
    heatMapDB.updateUser(req.body.lat, req.body.lon, req.body.userid).then((data) => {
        res.json({ 'data': data, 'status': 'success' });
    }, (err) => {
        res.json({ 'error': err, 'status': 'failed' });
    });
})
app.listen(process.env.PORT || port);




