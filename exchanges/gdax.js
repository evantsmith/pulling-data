const Gdax = require('gdax');
var publicClient = new Gdax.PublicClient();


publicClient.getProducts(function(err, response, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data);
});

publicClient.getProductTicker(function(err, response, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data);
});

publicClient.getProductOrderBook({level: 3}, function(err, response, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data);
});

publicClient.getProductHistoricRates(function(err, response, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data);
});

publicClient.getProduct24HrStats(function(err, response, data) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data);
});

