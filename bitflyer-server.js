var request = require('request');

var path = '/v1/executions';
var query = '?product_code=BTC_USD&count=1000';
var url = 'https://api.bitflyer.com' + path + query;
request(url, function (err, response, payload) {
	var data = JSON.parse(payload)

    // console.log(data);
    console.log(data);


});