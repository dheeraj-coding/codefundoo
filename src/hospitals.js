const DB = require('./db');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAcountKey.json');
const constants = require('./constants');
const request = require('request');

module.exports = function () {
    return new Hospitals();
}
function Hospitals() {
    this.db = new DB();
    this.db.connect(constants.uri, 'HeatMap').then(() => console.log('Hospitals DB connection successful'), () => console.log("DB connection unsuccessful"));
    this.admin = admin;
}
Hospitals.prototype.register = function (name, password, repeat, lat, lon) {
    const collection = this.db.db.collection('hospitals');
    return new Promise((resolve, reject) => {
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
            if (password === repeat) {
                collection.insertOne({ 'name': name, 'password': password, 'postcode': parsed['address']['postcode'] }).then((results) => {
                    resolve(results.ops);
                }, (err) => {
                    reject(err);
                });
            }

        });
    });
}
Hospitals.prototype.pushToFirebase = function (name, phone, lat, lon, postcode) {
    let db = admin.database();
    let ref = db.ref('locations/' + postcode + '/affected');
    let newRow = ref.push();
    newRow.set({
        'name': name,
        'phone': phone,
        'lat': lat,
        'lon': lon,
    });
}