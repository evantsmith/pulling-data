var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var Gdax = require('gdax');
let publicClients = {};
let lastPrice = {};
//     "type": "subscribe",
//     "product_ids": [d
//         "ETH-USD",
//     ],
//     "channels": [
//         "level2",
//         {
//             "name": "ticker",
//             "product_ids": [
//                 "BTC-USD",
//                 "ETH-USD"
//             ]
//         }
//     ]
// }
var websocket = new Gdax.WebsocketClient(['BTC-USD']);
var arrData = [];
//var trade = {};

websocket.on('message', dataObj => {

	if(dataObj === null){
		console.log('error');
	} 
	var trade = dataObj;
		
	if(dataObj.type === 'match'){
		console.log(trade);
			
	};
	// console.log(data);

});

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

// function someAsyncApiCall(callback) {
//   process.nextTick(callback);
// }

// process.nextTick(() => {
//   console.log('nextTick callback');
// });
