var mainVue = new Vue({
    el: '#app',
    data: {
        // array of coin objects that have social info
        arrOfTrades: [],
        tradePrice: 0,
        tradeAmount: 0,
        tradeTime: 0

    },
    methods: {
        pullData: function(event){
            event.preventDefault();

            $.get('/pullData', function(dataObj){
                console.log(dataObj);
                mainVue.tradePrice = dataObj.priceTradedAt;
                mainVue.tradeAmount = dataObj.amountTraded;
                mainVue.tradeTime = dataObj.timestamp;
            }) // End of get request

        }, // End of pullData

        saveData: function(event){
            event.preventDefault();

            // Sending an object with one property, an array of static coin objects
            var objectToSend = {
                arrOfCoinObjs : mainVue.arrOfCoins
            }

            $.post('/saveData', objectToSend, function(dataFromServer){
                console.log(dataFromServer);
            })

        },

        consoleToCheck: function(event){
            event.preventDefault();
            console.log(mainVue.arrOfCoins2.length);
        }
        
    } // end methods

}) // end mainVue