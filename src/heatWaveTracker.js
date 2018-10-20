const DB = require('./db');
const constants = require('./constants');
const request = require('request');
const ObjectID = require('mongodb').ObjectID;
module.exports = function () {
    return new HeatMap();
}
function HeatMap() {
    this.db = new DB();
    this.db.connect(constants.uri, 'HeatMap').then(() => console.log("DB Connection Successful:"), () => console.log("DB Connection Failed"));
}
HeatMap.prototype.insert = function (lat, lon) {
    const collection = this.db.db.collection('locations');
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://eu1.locationiq.com/v1/reverse.php?key=' + constants.apiKey + '&lat=' + lat + '&lon=' + lon + '&format=json',
            method: "GET",
            followRedirect: true,
        }, (error, response, body) => {
            if (error) {
                console.log('Error in Reverse Geocoder');
                reject();
            }
            parsed = JSON.parse(body);
            collection.find({ 'postcode': parsed['address']['postcode'] }).toArray((err, docs) => {
                if (docs.length == 0) {
                    collection.insertOne({ 'postcode': parsed['address']['postcode'], 'heatwave': true }, (err, result) => {
                        resolve(result.ops);
                    });
                    return;
                }
                collection.updateOne({ 'postcode': parsed['address']['postcode'] }, { $set: { 'heatwave': true } }).then((result) => {
                    resolve(result);
                });
            });
        });
    });
}
HeatMap.prototype.addAffectedUser = function (lat, lon, userid) {
    const collection = this.db.db.collection('locations');
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://eu1.locationiq.com/v1/reverse.php?key=' + constants.apiKey + '&lat=' + lat + '&lon=' + lon + '&format=json',
            method: 'GET',
            followRedirect: true,
        }, (error, response, body) => {
            if (error) {
                console.log("Error in accessing Reverse Geocoding API");
                reject(error);
                return;
            }
            parsed = JSON.parse(body);
            collection.updateOne({ 'postcode': parsed['address']['postcode'] }, { $addToSet: { "affected_user": userid } }).then((result) => {
                console.log(result);
                resolve(result);
            });

        });
    });
}
HeatMap.prototype.insertUser = function (lat, lon, name, regtoken) {
    const collection = this.db.db.collection('users');
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://eu1.locationiq.com/v1/reverse.php?key=' + constants.apiKey + '&lat=' + lat + '&lon=' + lon + '&format=json',
            method: 'GET',
            followRedirect: true,
        }, (error, response, body) => {
            if (error) {
                console.log("Error in accessing Revers Geocoding API");
                reject(error);
                return;
            }
            parsed = JSON.parse(body);
            collection.insertOne({ 'name': name, 'postcode': parsed['address']['postcode'], 'regtoken': regtoken }).then((result) => {
                resolve(result.ops[0]);
            }, (err) => {
                reject(err);
            })
        });
    });
}
HeatMap.prototype.updateUser = function (lat, lon, userid) {
    const collection = this.db.db.collection('users');
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://eu1.locationiq.com/v1/reverse.php?key=' + constants.apiKey + '&lat=' + lat + '&lon=' + lon + '&format=json',
            method: 'GET',
            followRedirect: true,
        }, (error, response, body) => {
            if (error) {
                console.log("Error in accessing Revers Geocoding API");
                reject(error);
                return;
            }
            parsed = JSON.parse(body);
            collection.updateOne({ '_id': new ObjectID(userid) }, { $set: { 'postcode': parsed['address']['postcode'] } }, { upsert: true }).then((result) => {
                console.log(result);
                resolve(result.ops);
            }, (err) => {
                console.log(err);
                reject(err);
            })
        })
    })
}


