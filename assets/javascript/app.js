var firebaseConfig = {
    apiKey: "AIzaSyCwR2Wk62ZvmcJ_Y4741s0gDo2LRscKalQ",
    authDomain: "ctyscrpr.firebaseapp.com",
    databaseURL: "https://ctyscrpr.firebaseio.com",
    projectId: "ctyscrpr",
    storageBucket: "ctyscrpr.appspot.com",
    messagingSenderId: "959736741159",
    appId: "1:959736741159:web:bf3be1bddf2ad63e"
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
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${search},us&units=imperial&mode=json&appid=eebfc72febcd4f3a1f94dfc49ad4df6a`,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var list = response.list;
        for(var i = 0; i < list.length; i++) {
            var time = list[i].dt_txt;
            var temp = list[i].main.temp;
            var humidity = list[i].main.humidity;
            var weather = list[i].weather[0].description;
            console.log('Time :' + time);
            console.log('Temperature :' + temp);
            console.log('Humidity :' + humidity);
            console.log('Weather :' + weather);
        }
    });
};

function kelvinToFahrenheit(temp) {
    return ((temp-273.15) * 9 / 5 + 32).toFixed(0);
}

function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function gettingDataFromEventbriteAPI(search) {
    let setting = {
        "async": true,
        "crossDoamin": true,
        "url": `https://www.eventbriteapi.com/v3/events/search/?q=pa--philadelphia`,
        "method": 'GET',
        "headers": {
            
            "Authorization": "Bearer 4QXLG6TYHW7DY2WGF5Q3",
            "Content-Type": "application/json",
            // "cache-control": "no-cache",
            // "Postman-Token": "L3YAPY66VPHGMRC77LXHA6FX6SGAHLNB3HRV5XZVIWZLHQLA7R"
        }
    };
    $.ajax(setting).then(function(response) {
        
        console.log(response);
    })



}

var today = new Date();
var todayHour = today.getHours();


function gettingDataFromEventfullAPI(search) {
    let address =  "philadelphia";
    let setting = {
        // http://api.eventful.com/json/events/search?...&location=San+Diego
        "url": `https://community-eventful.p.rapidapi.com/events/search?keywords=${search}&app_key=RG2KXbmbvfckpd86`,
        "method": "GET",
        "contentType":"application/json",
        "headers": {
            "X-RapidAPI-Host": "community-eventful.p.rapidapi.com",
            "X-RapidAPI-Key": "d6602cd30dmsh1a91987979aca5ap164ca0jsn1c395fc734ba"
        }
    };
    $.ajax(setting).then(function(response) {

        response = xmlToJson(response);
        return response;
    }).then(function(response) {
        console.log(response);
        var events = response.search.events.event;
        for(var i = 0; i < events.length; i++) {
            var eventTitle = events[i].title['#text'];
            var eventDescription = events[i].description['#text'];
            var eventUrl = events[i].url['#text'];
            var eventLocation = events[i].venue_address['#text'];
            // var eventImageUrl = events[i].image.medium.url['#text'].slice(2);
            console.log('Title :' + eventTitle);
            console.log('Description : ' + eventDescription)
            console.log('Url :' + eventUrl);
            console.log('Location :' + eventLocation);
            // console.log('ImageUrl :' + eventImageUrl);
            console.log('------------')
        }
        console.log(events);
    })

}

function gettingDataFromSportsAPI(search) {
    let setting = {
        "url": `https://api.sportsdata.io/v3/soccer/scores/json/Areas?key=6bc510d4bf8943dd9ba22c79e698f3f7`,
        "method": "GET",
    };
    $.ajax(setting).then(function(response) {

        console.log(response);
    });
}

function initMap() {
    let apiKey = "AIzaSyDs0x0Ui6E2RpmMdipq-MOnAvgcTkvJZeY";
    var  map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
}

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
    gettingDataFromEventbriteAPI(searchInput);
    gettingDataFromEventfullAPI(searchInput)
    // gettingDataFromTwitterAPI();
    gettingDataFromSportsAPI(searchInput);
})
