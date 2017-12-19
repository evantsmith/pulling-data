var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
const b64 = require('node-b64');

app.use(bodyParser.urlencoded({limit: '50mb', parameterLimit: 1000000, extended:true}));
app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));

app.use(express.static('./public'));

mongoose.connect('mongodb://localhost/coinsInfo', {useMongoClient: true});

mongoose.connection.once('open', function(){
    console.log("Connnection has been made!");
    // done();
}).on('error', function(error){
    console.log("Connection error ", error);
});

// new schema for model for the collection 'staticcoins' (array) of player objects in database

var CoinSchema = new mongoose.Schema({

    abbrev: {
        type: String,
        required: true

    },
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true

    },
    fullName: {
        type: String,
        required: true
    },
    totalCoinSupply: {
        type: String,
        required: true
    }

});

var CoinModel = mongoose.model('StaticCoin', CoinSchema);

// Schema and Model for 'coins' collection

var Coin2Schema = new mongoose.Schema({

    abbrev: {
        type: String,
        required: true

    },
    name: {
        type: String,
        required: true
    },
    repoUrl: {
        type: String,
        required: true

    },
    repoStars: {
        type: String,
        required: true
    },
    repoForks: {
        type: String,
        required: true
    },
    repoSubscribers: {
        type: String,
        required: true
    }

});

var Coin2Model = mongoose.model('Coin', Coin2Schema);

app.get('/',function(req,res){
    res.sendFile('./public/html/pulling-data-index.html',{root: './'});
})

app.get('/pullData', function(req,res){

    var url1 = 'https://www.cryptocompare.com/api/data/coinlist/';

    var options1 = {
        url: url1
    }
    request(options1, function(error,response,body){

        //Error check
        if(error || response.statusCode !== 200){
            console.log("Failed to send request");
            res.send("Failed to send request");
        } else {

        var dataObj1 = JSON.parse(body);

        res.send(dataObj1);

        }

    }) // end request

}) // end app.get '/pullData'

app.post('/saveData', function(req,res){


    for(var i = 0; i < req.body.arrOfCoinObjs.length; i++){

        var coinObjToSave = {

            abbrev: req.body.arrOfCoinObjs[i].Abbrev,
            _id: req.body.arrOfCoinObjs[i].Id,
            name: req.body.arrOfCoinObjs[i].Name,
            fullName: req.body.arrOfCoinObjs[i].FullName,
            totalCoinSupply: req.body.arrOfCoinObjs[i].TotalCoinSupply
        }

        var newCoin = new CoinModel(coinObjToSave);
        // save coin to the database
        newCoin.save(function(err){
            if(err){
                console.log(err);
            } else {
                console.log("Saved the coin");
            }
        });
    }

    res.send("Completed");

}) // end app.post for /saveData

app.post('/pullWantedData', function(req,res){

    // req.body is a string id
    var idToUse = req.body.id;

    var url1 = `https://www.cryptocompare.com/api/data/socialstats/?id=${idToUse}`;

    var options1 = {
        url: url1
    }

    request(options1, function(error,response,body){

        //Error check
        if(error || response.statusCode !== 200){
            console.log("Failed to send request");
            res.send("Failed to send request");
        } else {

        var dataObj1 = JSON.parse(body);

        // sending obj of social statsfor one coin
        res.send(dataObj1);

        }

    }) // end of request

}) // end post for /pullWantedData

app.post('/saveWantedData', function(req,res){

    for(var i = 0; i < req.body.arrOfCoinObjs.length; i++){

        var coinObjToSave =  {

            abbrev: req.body.arrOfCoinObjs[i].abbrev,
            name: req.body.arrOfCoinObjs[i].name,
            repoUrl: req.body.arrOfCoinObjs[i].repoUrl,
            repoStars: req.body.arrOfCoinObjs[i].repoStars,
            repoForks: req.body.arrOfCoinObjs[i].repoForks,
            repoSubscribers: req.body.arrOfCoinObjs[i].repoSubscribers

        }

        var newCoin2 = new Coin2Model(coinObjToSave);
        // save coin to the database
        newCoin2.save(function(err){
            if(err){
                console.log(err);
            } else {
                console.log("Saved the coin");
            }
        }); // end save

    } // end for loop

    res.send("Accomplished");

}) // end app.post for /saveWantedData


// app.post('/saveDataForAll', function(req,res){

//     var coinObjs = req.body.arrOfCoins;

//     // Now save all coins to new collection in database
//     for(var i = 0; i < coinsObjs.length; i++){

//         var coinObjToSave = {

//             abbrev: coinObjs[i].Data.General.Name,
//             name: coinObjs[i].Data.General.CoinName,
//             repoUrl: coinObjs[i].Data.CodeRepository.List[0].url,
//             repoStars: coinObjs[i].Data.CodeRepository.List[0].stars,
//             repoForks: coinObjs[i].Data.CodeRepository.List[0].forks,
//             repoSubscribers: coinObjs[i].Data.CodeRepository.List[0].subscribers
//         }

//         var newCoin2 = new Coin2Model(coinObjToSave);
//         // save coin to the database
//         newCoin2.save(function(err){
//             if(err){
//                 res.status(500).send(err);
//             } else {
//                 console.log("Saved the coin");
//             }
//         });
//     } // end of for loop

//     res.send("Done");

// })

/*
var team;
var poisition;
var playerName;
var baseUrl;


app.post('/search',function(req,res){


    positions = req.body.positions;
    teams = req.body.teams;
    playerName = req.body.playerName;

    baseUrl = `https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-regular/cumulative_player_stats.json?`;

    'use strict';
    var options = {
        url: baseUrl,
        headers: {
            "Authorization":"Basic " + b64.btoa("roughrider" + ":" + "jeffperrin93230")
        }
    }
    // Send request from back-end using request module
    request(options, function(error,response,body){

        //Error check
        if(error || response.statusCode !== 200){
            console.log("Failed to send request");
            res.send("Failed to send request");
        } else {
            // Turn body string into an object

            var dataObj = JSON.parse(body);

            res.send(dataObj);


        };

    }); // End request from request module

}) //  End app.post
*/

app.listen(8080, function(){
    console.log('The app is running on port 8080.');
})