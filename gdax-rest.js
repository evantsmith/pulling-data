var Gdax = require('gdax');
var productID = 'BTC-USD'
var endpoint = 'https://api.gdax.com'
var key = 'your_api_key';
var b64secret = 'your_b64_secret';
var passphrase = 'your_passphrase';
var sandboxURI = 'https://api-public.sandbox.gdax.com';
var authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, sandboxURI);


publicClient = new Gdax.PublicClient(productID, endpoint);
	var params = {
		// start: 2016-11-07,
		// end: 2017-12-20,
		granularity: 86400
	}

publicClient
	.getProductHistoricRates(params)
	.then(data => {
	for(i=0; i<data.length; i++){
		var timeMs = data[i][0];
		// var epochMs = (new Date).getTime();
		var realMs = (1000*timeMs);
		var timedate = new Date(realMs);
		var newdate = timedate.toDateString()
		var low = data[i][1]
		var high = data[i][2]
		var open = data[i][3]
		var close = data[i][4]
		var volume = data[i][5]
		// console.log(" ");
		// console.log('Date: ',timedate)
		// console.log('Time in MS:',timeMs)
		// console.log('Low: ',low)
		// console.log('High: ',high)
		// console.log('Open: ',open)
		// console.log('Close: ',close)
		// console.log('Volume: ',volume)
	}})
	.catch(error => {
  	console.log('Error')
  	});

async function yourFunction() {
	try {
	var products = await publicClient.getProductHistoricRates();
	} 
	catch(error) {
    //pass
  	};
};

var accountID = 'asdf'
var buyParams = {
  'price': '100.00', // USD
  'size': '1',  // BTC
  'product_id': 'BTC-USD',
};

authedClient.buy(buyParams, callback);



authedClient.getAccountHistory(accountID,callback)