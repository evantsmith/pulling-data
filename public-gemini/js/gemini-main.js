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
        saveGemData: function(event){
            event.preventDefault();

            $.get('/saveGemData', function(dataObj){
                console.log(dataObj);
                mainVue.tradePrice = dataObj.priceTradedAt;
                mainVue.tradeAmount = dataObj.amountTraded;
                mainVue.tradeTime = dataObj.timestamp;
            }) // End of get request

        }, // End of pullData

        saveGdaxData: function(event){
            event.preventDefault();

            $.get('/saveGdaxData', function(dataFromServer){
                console.log(dataFromServer);
            })

        },

        consoleToCheck: function(event){
            event.preventDefault();
            console.log(mainVue.arrOfCoins2.length);
        }
        
    } // end methods

}) // end mainVue