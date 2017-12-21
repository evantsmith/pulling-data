var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');

const WebSocket = require('ws');
 
const btcWS = new WebSocket('wss://api.gemini.com/v1/marketdata/btcusd');
// const ethWS = new WebSocket('wss://api.gemini.com/v1/marketdata/ethusd');

// var numTimes = 0;

// // var getBtcData = function(){
//     btcWS.on('message', function(btcData) {
//         var dataObj = JSON.parse(btcData);
//         if((numTimes % 20) === 0){
//             console.log('btcData: ', dataObj);
            
//         }
//         numTimes++;
//     })   
    
// }
// getBtcData();
//setInterval(getBtcData, 3000);
// for(var i = 0; i < 10; i++){
//     setTimeout(getBtcData, 3000);
// }



// ethWS.on('message', function incoming(ethData) {
//   console.log('ethData: ', ethData);
// })

app.use(bodyParser.urlencoded({limit: '50mb', parameterLimit: 1000000, extended:true}));
app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));

app.use(express.static('./public-gemini'));

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

app.get('/',function(req,res){
    res.sendFile('./public-gemini/html/gemini-index.html',{root: './'});
})

app.get('/pullData', function(req,res){

    var numTimes = 0;
    var dataObj = {};

    // get initial order book

    btcWS.on('message', function(btcData) {
        
        if(numTimes < 2){
            dataObj = JSON.parse(btcData);
            console.log(dataObj);
            res.send(dataObj);
            btcWS.close();
            numTimes++;                                 
        } else {
            btcWS.close();
            
        }
        //numTimes++;
    })  
    

}) // end app.get '/pullData'

app.post('/saveData', function(req,res){

    res.send("Completed");

}) // end app.post for /saveData


app.listen(8080, function(){
    console.log('The app is running on port 8080.');
})