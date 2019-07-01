var firebaseConfig = {
    apiKey: "AIzaSyDs-rUpadv-5w_AzmdDUb5e8PDYws8osjQ",
    authDomain: "test-6444f.firebaseapp.com",
    databaseURL: "https://test-6444f.firebaseio.com",
    projectId: "test-6444f",
    storageBucket: "",
    messagingSenderId: "642414957945",
    appId: "1:642414957945:web:358771aae0f437b1"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

function signInValidation() {
    let usernameInput = $('#username-input').val().trim();
    let passwordInput = $('#password-input').val().trim();
    database.ref('/userData/userAccounts/').on('child_added',function(snapshot) {
        if(usernameInput === snapshot.val().username && snapshot.val().password === passwordInput) {
            $('#sign-in-form').remove();
        };
    });
};

function createNewAccFunc() {
    let newUsernameInput = $('#newusername-input').val().trim();
    let newPasswordInput = $('#newpassword-input').val().trim();
    let confirmPasswordInput = $('#confirm-password-input').val().trim();
    if(newPasswordInput === confirmPasswordInput) {
        database.ref('/userData/userAccounts').push({
            username: newUsernameInput,
            password: newPasswordInput
        });
    };
};

$('#sign-in-btn').on('click', function() {
    event.preventDefault();
    signInValidation();
});

$('#new-acc-btn').on('click', function() {
    event.preventDefault();
    
    createNewAccFunc()
});

function gettingDataFromWeatherAPI(search) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=eebfc72febcd4f3a1f94dfc49ad4df6a`,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    });
};

function kelvinToFahrenheit(temp) {
    return ((temp-273.15) * 9 / 5 + 32).toFixed(0);
}

// function gettingDataFromEventbriteAPI(search) {
//     let address =  "philadelphia";
//     let setting = {
//         "async": true,
//         "crossDoamin": true,
//         "url": `https://www.eventbriteapi.com/v3/events/search/?q=${address}&location.address=`,
//         "method": 'GET',
//         "headers": {
//             "Authorization": "Bearer PER2XACXI4XO4FK2XSYF",
//             "Content-Type": "application/json"
//         }
//     };
//     $.ajax(setting).then(function(response) {
//         console.log(response);
//     })

// }

function gettingDataFromTwitterAPI() {

    //lets create signature
    // $.ajax({
    //     url: 'https://api.twitter.com/1.1/search/tweets.json?q=philadelphia&result_type=mixed&count=2',
    //     method: 'get',
    //     dataType:'json',
    //     header: {
    //         "authorization": "OAuth",
    //         "oauth_consumer_key": "2QZwyGahvrpkQFqfb0Veho9D2", 
    //         "oauth_nonce" : "generated-nonce",
    //         "oauth_signature":"generated-signature", 
    //         "oauth_signature_method": "HMAC-SHA1", 
    //         "oauth_timestamp": "generated-timestamp", 
    //         "oauth_token": "1145536089270169601-TLeZYW2U3vYG2gLgkwUtsx3RqiYj4J", 
    //         "oauth_version": "1.0"
    //     }
    // }).then(function(response) {
    //     console.log(response);
    // });

    // var oauth = require('oauth.js');

    // var urlLink = 'https://api.twitter.com/1.1/statuses/update.json';

    // var twitterStatus = "Sample tweet";

    // var oauth_consumer_key = "2QZwyGahvrpkQFqfb0Veho9D2";
    // var consumerSecret = "LDeGpLet5yTdnFYeLAzN1IqlSRoiI6H4y1lLSDTGsPBOJJam9G";

    // var oauth_token = "1145536089270169601-TLeZYW2U3vYG2gLgkwUtsx3RqiYj4J";
    // var tokenSecret = "S5hztbtyp6KfH4pumPk5ymytg822MMKMsV5gB5HtBdSct";

    // var nonce = oauth.nonce(32);
    // var ts = Math.floor(new Date().getTime() / 1000);
    // var timestamp = ts.toString();

    // var accessor = {
    //     "consumerSecret": consumerSecret,
    //     "tokenSecret": tokenSecret
    // };

    // var params = {
    //     "status": twitterStatus,
    //     "oauth_consumer_key": oauth_consumer_key,
    //     "oauth_nonce": nonce,
    //     "oauth_signature_method": "HMAC-SHA1",
    //     "oauth_timestamp": timestamp,
    //     "oauth_token": oauth_token,
    //     "oauth_version": "1.0"
    // };
    // var message = {
    //     "method": "GET",
    //     "action": urlLink,
    //     "parameters": params
    // };

    // //lets create signature
    // oauth.SignatureMethod.sign(message, accessor);
    // var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    // var baseString = oauth.SignatureMethod.getBaseString(message);
    // var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    // var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature

    // $.ajax({
    //     url: urlLink,
    //     type: 'GET',
    //     data: {
    //         "status": twitterStatus
    //     },
    //     beforeSend: function(xhr){
    //         xhr.setRequestHeader("Authorization",'OAuth oauth_consumer_key="'+oauth_consumer_key+'",oauth_signature_method="HMAC-SHA1",oauth_timestamp="' + timestamp + '",oauth_nonce="' + nonce + '",oauth_version="1.0",oauth_token="'+oauth_token+'",oauth_signature="' + encodedSig + '"');  
    //    },
    //    success: function(data) { 
    //         alert("Tweeted!"); 
    //    },
    //    error:function(exception){
    //        alert("Exeption:"+exception);
    //     }
    //   });
};     


$('#search-btn').on('click',function() {
    let searchInput = $('#location-search').val();
    gettingDataFromWeatherAPI(searchInput);
    // gettingDataFromEventbriteAPI(searchInput);
    gettingDataFromTwitterAPI();
})

