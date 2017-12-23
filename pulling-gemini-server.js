var express = require('express');

var app = express();

var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var Gdax = require('gdax');

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

var GdaxBTCSchema = new mongoose.Schema({

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

var GdaxBTCModel = mongoose.model('GdaxBTCTrade', GdaxBTCSchema);

app.get('/',function(req,res){
    res.sendFile('./public-gemini/html/gemini-index.html',{root: './'});
})

app.get('/saveGemData', function(req,res){

    var dataObj = {};

    var btcWS = new WebSocket('wss://api.gemini.com/v1/marketdata/btcusd');

    btcWS.on('error', err => {
        if(err){
            console.log(err);
        }
    });

    btcWS.on('message', function(btcData) {

        dataObj = JSON.parse(btcData);

            if(dataObj.events[0].type === 'trade'){
                //btcWS.close();
                console.log(" ")
                //var date = new Date(dataObj.timestampms);

                // This is epoch ms of trade from Gemini
                var totalMs = Number(dataObj.timestampms);

                // This is date in MST
                var date = new Date(totalMs);

                // this will round time (ms) to nearest second      
                var roundedMs = Date.parse(date);
                // var roundedMs2 = roundedMs.toString();
                // var roundedMs3 = Number(roundedMs2);

                // this turn original date to GMT
                var finalDateString = new Date(roundedMs);

                var thePrice = Number(dataObj.events[0].price);
                var theAmount = Number(dataObj.events[0].amount);

                console.log("Date and Time : " + date )
                console.log("Final Date : ", finalDateString)
                console.log("Total ms : ", totalMs)
                console.log("Rounded ms : ", roundedMs);
                console.log("Price : ", thePrice);
                console.log("Amount : ", theAmount);

                var tradeInfo = {

                    dateAndTime: finalDateString,
                    timeMS: roundedMs,
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

}) // end app.get /savGemData



app.get('/saveGdaxData', function(req,res){

    var websocket = new Gdax.WebsocketClient(['BTC-USD']);

    websocket.on('message', dataObj => {

        if(dataObj === null){
            console.log('error');
        } 
            
        if(dataObj.type === 'match'){

            console.log(" ");

            // This is GMT date string Gdax gives us for each trade
            var dateString = dataObj.time;

            // Turing GMT date string into ms for storage
            var totalMs = Date.parse(dateString);

            // Turing ms back into GMT date
            var middleDateString = new Date(totalMs);

            // Turing GMT date string back into ms, rounded to nearest second
            var roundedMs = Date.parse(middleDateString);
            // var roundedMs2 = roundedMs.toString();
            // var roundedMs3 = Number(roundedMs2);

            // Turning testingMs2 into date with no ms remainder
            var finalDateString = new Date(roundedMs);

            // rounding amount
            var initialAmount = dataObj.size;
            var roundedAmountString = initialAmount.toString();
            var roundedAmount = Number(roundedAmountString);

            // rounding price to 2 decimal places
            var initialPrice = dataObj.price;
            var roundedPrice = parseFloat(Math.round((initialPrice)*100)/100).toFixed(2);

            console.log("given dateString : " + dateString);
            console.log("finalDateString : ", finalDateString);
            console.log("totalMs : ", totalMs);
            console.log("roundedMs : ", roundedMs);
            console.log("Price : ", initialPrice)
            console.log("Rounded Price : ", roundedPrice)
            console.log("Amount : ", initialAmount)
            console.log("Rounded amount : ", roundedAmount)

            var tradeInformation = {

                dateAndTime: finalDateString,
                timeMS: roundedMs,
                price: roundedPrice,
                amount: roundedAmount
            }

            var newGdaxBTCTrade = new GdaxBTCModel(tradeInformation);

            newGdaxBTCTrade.save(function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("Saved the trade")
                }
            }) // end save
                
        }; // end if statement

    }); // end gdax websocket

    websocket.on('error', err => {
        if(err){
            console.log('Handle the error')
        }
    });

    websocket.on('close', () => {
        console.log('Websocket closed');
        webSocketStateChange();
    });

    function webSocketStateChange(err) {
        setTimeout(() => websocket.connect(), 100000);
    };

}) // end app.get for /saveGdaxData


app.listen(8080, function(){
    console.log('The app is running on port 8080.');
})