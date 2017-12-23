var Gdax = require('gdax');
var productID = 'BTC-USD'
var endpoint = 'https://api.gdax.com'
publicClient = new Gdax.PublicClient(productID, endpoint);

publicClient
	.getProductOrderBook({level: 2 })
	.then(book => { 
		console.log(book)
	.catch(error => {
		console.log('Error')
  	});