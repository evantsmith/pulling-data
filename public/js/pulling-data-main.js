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

                var coinObjs = dataObj.Data;
                console.log(coinObjs);


                //Add data objects to array
                for(var coin in coinObjs){
                    // each coin variable is just a string with a few letters and numbers, ex. Bitcoin is 'BTC'
                    // make an array of strings
                    mainVue.arrOfCoinAbbreviations.push(coin);
                }

                // make a new array of objects with id and coinName property
                for(var i = 0; i < mainVue.arrOfCoinAbbreviations.length; i++){

                    var coinAbbrev = mainVue.arrOfCoinAbbreviations[i];
                    var coinId = coinObjs[mainVue.arrOfCoinAbbreviations[i]].Id;
                    var coinName = coinObjs[mainVue.arrOfCoinAbbreviations[i]].CoinName;
                    var coinFullName = coinObjs[mainVue.arrOfCoinAbbreviations[i]].FullName;
                    var coinTotalSupply = coinObjs[mainVue.arrOfCoinAbbreviations[i]].TotalCoinSupply;

                    var coinOb = {
                        Abbrev: coinAbbrev,
                        Id: coinId,
                        Name: coinName,
                        FullName: coinFullName,
                        TotalCoinSupply: coinTotalSupply

                    }
                    mainVue.arrOfCoins.push(coinOb);
                }
                console.log(typeof mainVue.arrOfCoins[1].TotalCoinSupply);

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

        pullWantedData: function(event) {
            event.preventDefault();

            console.log(mainVue.arrOfCoins.length);

            for(var i = 0; i < mainVue.arrOfCoins.length; i++){

                var idObjToSend = {
                    id: mainVue.arrOfCoins[i].Id
                }

                $.post('/pullWantedData', idObjToSend, function(dataFromServer){

                    var hasList = dataFromServer.Data.CodeRepository.List[0];

                    var abbrev1 = dataFromServer.Data.General.Name;
                    var name1 =  dataFromServer.Data.General.CoinName;

                    var repoUrl1 = ' ';
                    var repoStars1 = ' ';
                    var repoForks1 = ' ';
                    var repoSubscribers1 = ' ';

                    if(typeof hasList === 'undefined'){
                        repoUrl1 = ' ';
                        repoStars1 = ' ';
                        repoForks1 = ' ';
                        repoSubscribers1 = ' ';
                    } else {
                        
                        repoUrl1 = dataFromServer.Data.CodeRepository.List[0].url;
                        repoStars1 = dataFromServer.Data.CodeRepository.List[0].stars;
                        repoForks1 = dataFromServer.Data.CodeRepository.List[0].forks;
                        repoSubscribers1 = dataFromServer.Data.CodeRepository.List[0].subscribers;
                    }

                    var coin = {
                        abbrev: abbrev1,
                        name: name1,
                        repoUrl: repoUrl1,
                        repoStars : repoStars1,
                        repoForks : repoForks1,
                        repoSubscribers : repoSubscribers1
                    }

                    mainVue.arrOfCoins2.push(coin);

                }) // end post

            } // end for loops

        },
        saveWantedData: function(event){
            event.preventDefault();

            // Sending an object with one property, an array of wanted coin objects
            var objectToSend = {
                arrOfCoinObjs : mainVue.arrOfCoins2
            }

            $.post('/saveWantedData', objectToSend, function(dataFromServer){
                console.log(dataFromServer);
            })

        },
        consoleToCheck: function(event){
            event.preventDefault();
            console.log(mainVue.arrOfCoins2.length);
        }

        // saveDataForAll : function(event){
        //     event.preventDefault();

        //     var infoToSend = {
        //         staticCoinObjs: mainVue.arrOfCoins
        //     }

        //     $.post('/saveDataForAll', infoToSend, function(dataFromServer){
        //         console.log(dataFromServer);
        //     })
        // }
        
    } // end methods

}) // end mainVue