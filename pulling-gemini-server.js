var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');

const WebSocket = require('ws');
 
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

// btcWS.on('message', function incoming(btcData) {
//   console.log('btcData: ', btcData);
// })

// ethWS.on('message', function incoming(ethData) {
//   console.log('ethData: ', ethData);
// })

app.use(bodyParser.urlencoded({limit: '50mb', parameterLimit: 1000000, extended:true}));
app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));

app.use(express.static('./public-gemini'));

mongoose.connect('mongodb://localhost/btc', {useMongoClient: true});

mongoose.connection.once('open', function(){
    console.log("Connnection has been made!");
    // done();
}).on('error', function(error){
    console.log("Connection error ", error);
});

// new schema for model for the collection 'staticcoins' (array) of player objects in database

var GemBTCSchema = new mongoose.Schema({

    dateAndTime: {
        type: String,
        required: true
    },
    timeMS: {
        type: Number,
        required: true

    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true

    },

});

var GemBTCModel = mongoose.model('GemBTCTrade', GemBTCSchema);

app.get('/',function(req,res){
    res.sendFile('./public-gemini/html/gemini-index.html',{root: './'});
})

app.get('/pullData', function(req,res){

    var dataObj = {};

    var btcWS = new WebSocket('wss://api.gemini.com/v1/marketdata/btcusd');

    // get initial order book

    btcWS.on('message', function(btcData) {

        dataObj = JSON.parse(btcData);

            if(dataObj.events[0].type === 'trade'){
                //btcWS.close();
                console.log(" ")
                var date = new Date(dataObj.timestampms);
                var msTime = Number(dataObj.timestampms);
                var thePrice = Number(dataObj.events[0].price);
                var theAmount = Number(dataObj.events[0].amount);
                console.log("Date and Time : " + date )
                console.log(dataObj.events[0]);

                // changing ms to date and time

                var tradeInfo = {

                    dateAndTime: date,
                    timeMS: msTime,
                    price: thePrice,
                    amount: theAmount
                }

                var newGemBTCTrade = new GemBTCModel(tradeInfo);

                newGemBTCTrade.save(function(err){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Saved the Trade");
                    }
                }); // end save

            } // end if statement
        
    })  // end btcWS.on 

}) // end app.get '/pullData'



app.post('/saveData', function(req,res){
    res.send("Completed");
}) // end app.post for /saveData


app.listen(8080, function(){
    console.log('The app is running on port 8080.');
})