var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
const b64 = require('node-b64');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('./public'));

// mongoose.connect('mongodb://localhost/players', {useMongoClient: true});

// mongoose.connection.once('open', function(){
//     console.log("Connnection has been made!");
//     // done();
// }).on('error', function(error){
//     console.log("Connection error ", error);
// });

// new schema for model for the collection 'Players' (array) of player objects in database

// var PlayerSchema = new mongoose.Schema({

//     team: {
//         type: String

//     },
//     position: {
//         type: String
//     },
//     name: {
//         type: String
//     }

// });

// var PlayerModel = mongoose.model('Player', PlayerSchema);

app.get('/',function(req,res){
    res.sendFile('./public/html/nflData-index.html',{root: './'});
})

var team;
var poisition;
var playerName;
var baseUrl;

app.post('/search',function(req,res){


    positions = req.body.positions;
    teams = req.body.teams;
    playerName = req.body.playerName;

    baseUrl = `https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-regular/cumulative_player_stats.json?`;

    if(playerName !== ''){
        baseUrl += `player=${playerName}`;
    };
    if((playerName === '') && (teams !== '')){
        baseUrl += `team=${teams}`;
    } else if ((playerName !== '') && (teams !== '')){
        baseUrl += `&team=${teams}`
    }
    if((playerName === '') && (teams === '') && (positions !== '')){
        baseUrl += `position=${positions}`;
    } else {
        baseUrl += `&position=${positions}`;
    } 
    if((playerName === '') && (teams === '') && (positions === '')){
        res.send('No fields specified');
    };


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

app.listen(8080, function(){
    console.log('The app is running on port 8080.');
})