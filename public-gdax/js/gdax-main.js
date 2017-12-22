var mainVue = new Vue({
    el: '#app',
    data: {
        // arr of strings that are coin abbreviations, used this array to build arrOfCoins
        arrOfCoinAbbreviations: [],

        // array of coin objects with id and other properties
        arrOfCoins: [],

        // array of coin objects that have social info
        arrOfCoins2: []
    },
    methods: {
        pullData: function(event){
            event.preventDefault();

            $.get('/pullData', function(dataObj){
                console.log(dataObj);
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