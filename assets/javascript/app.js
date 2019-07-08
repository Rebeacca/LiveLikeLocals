var favoriteCityArr = [];
var username;

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
  let usernameInput = $("#username-input")
    .val()
    .trim();
  let passwordInput = $("#password-input")
    .val()
    .trim();
  database.ref("/userAccounts/").on("child_added", function(snapshot) {
    if (
      usernameInput === snapshot.val().username &&
      snapshot.val().password === passwordInput
    ) {
      username = usernameInput;
      localStorage.setItem('username', username);
      database.ref('/userData/').once('value', function(snapshot) {
        if(snapshot.val().hasOwnProperty(username) && snapshot.val()[username].hasOwnProperty('favoriteCities')){
          favoriteCityArr = snapshot.val()[username].favoriteCities;
          favoriteCityArr.forEach(function(cityName) {
            var newBtn = $('<button>').text(cityName).addClass('svd-btn btn btn-outline-danger favorite-city').attr('id', cityName);
            $('#saved-Cities').append(newBtn);
          });
        };
      });
      $("#sign-in-form").remove();
    }
  });
}

function createNewAccFunc() {
  let newUsernameInput = $("#newusername-input")
    .val()
    .trim();
  let newPasswordInput = $("#newpassword-input")
    .val()
    .trim();
  let confirmPasswordInput = $("#confirm-password-input")
    .val()
    .trim();
  if (newPasswordInput === confirmPasswordInput) {
    database.ref("/userAccounts").push({
      username: newUsernameInput,
      password: newPasswordInput
    });
  }
}

function addToFavorite() {
  favoriteCityArr.push($("#dash-city").text());
  database.ref('/userData/' + username).set({
    favoriteCities : favoriteCityArr
  })
};

function gettingDataFromWeatherAPI(search) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${search},us&units=imperial&mode=json&appid=eebfc72febcd4f3a1f94dfc49ad4df6a`,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var list = response.list;
    for (var i = 0; i < list.length; i++) {
      var time = list[i].dt_txt;
      var temp = list[i].main.temp;
      var humidity = list[i].main.humidity;
      var weather = list[i].weather[0].description;
      var weathericon = list[i].weather[0].icon;
      var weathericonSoure =
        "http://openweathermap.org/img/wn/" + weathericon + "@2x.png";

      console.log(weathericonSoure);
      console.log("Time :" + time);
      console.log("Temperature :" + temp);
      console.log("Humidity :" + humidity);
      console.log("Weather :" + weather);
      $("#weather-panel-icon").attr("src", weathericonSoure);
    }
  });
}

function kelvinToFahrenheit(temp) {
  return (((temp - 273.15) * 9) / 5 + 32).toFixed(0);
}

function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

function gettingDataFromEventbriteAPI(search) {
  let setting = {
    async: true,
    crossDoamin: true,
    url: `https://www.eventbriteapi.com/v3/events/search/?q=pa--philadelphia`,
    method: "GET",
    headers: {
      Authorization: "Bearer 4QXLG6TYHW7DY2WGF5Q3",
      "Content-Type": "application/json"
      // "cache-control": "no-cache",
      // "Postman-Token": "L3YAPY66VPHGMRC77LXHA6FX6SGAHLNB3HRV5XZVIWZLHQLA7R"
    }
  };
  $.ajax(setting).then(function(response) {
    console.log(response);
  });
}

function gettingDataFromEventfullAPI(search) {
  let address = "philadelphia";
  let setting = {
    // http://api.eventful.com/json/events/search?...&location=San+Diego
    url: `https://community-eventful.p.rapidapi.com/events/search?keywords=${search}&app_key=RG2KXbmbvfckpd86`,
    method: "GET",
    contentType: "application/json",
    headers: {
      "X-RapidAPI-Host": "community-eventful.p.rapidapi.com",
      "X-RapidAPI-Key": "d6602cd30dmsh1a91987979aca5ap164ca0jsn1c395fc734ba"
    }
  };
  $.ajax(setting)
    .then(function(response) {
      response = xmlToJson(response);
      return response;
    })
    .then(function(response) {
      console.log(response);
      var events = response.search.events.event;
      for (var i = 0; i < 3; i++) {
        var eventTitle = events[i].title["#text"];
        var eventUrl = events[i].url["#text"];
        console.log(eventTitle);
        var newTitle = $('<a>').attr('src', eventUrl).attr('target', '_blank').text(eventTitle);
        $('#upcoming-event-' + i).html(newTitle);
      }
      console.log(events);
    });
}

function gettingDataFromSportsAPI(search) {
  let setting = {
    url: `https://api.sportsdata.io/v3/soccer/scores/json/Areas?key=6bc510d4bf8943dd9ba22c79e698f3f7`,
    method: "GET"
  };
  $.ajax(setting).then(function(response) {
    console.log(response);
  });
}

function loadcity(cityinput) {
  $("#dash-city").text(cityinput);
  localStorage.setItem('city', cityinput);
}

$("#sign-in-btn").on("click", function() {
  event.preventDefault();
  signInValidation();
});

$("#new-acc-btn").on("click", function() {
  event.preventDefault();
  createNewAccFunc();
});

$("#favorite-btn").on("click", function() {
  addToFavorite();
});

$(document).on('click', '.favorite-city', function() {
  window.location = 'events.html';
  localStorage.setItem('city', this.id);
});


$("#search-btn").on("click", function() {
  let searchInput = $("#input-city").val().trim().replace(/(^|\s)\S/g, x => x.toUpperCase());
  gettingDataFromWeatherAPI(searchInput);
  gettingDataFromEventbriteAPI(searchInput);
  gettingDataFromEventfullAPI(searchInput);
  // gettingDataFromTwitterAPI();
  gettingDataFromSportsAPI(searchInput);
  loadcity(searchInput);
});
// Get image of city from google places
function getPlacesPhoto(search) {
  let googleAPIkey = "AIzaSyDPd-sNhT630sHlTS2BBJXgx4YQpfpHLmc";
  let herok = "https://cors-anywhere.herokuapp.com/";

  //   first find the place in place search
  let setting = {
    url:
      herok +
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
      search +
      " &inputtype=textquery&fields=photos,formatted_address,name,place_id,geometry&key=" +
      googleAPIkey,
    method: "GET"
  };
  //   then get a photo reference
  $.ajax(setting).then(function(response) {
    let gPlace = response.candidates[0].photos[0].photo_reference;
    let photo_setting = {
      url:
        herok +
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=" +
        gPlace +
        "&key=" +
        googleAPIkey,
      method: "GET"
    };
    $.ajax(photo_setting).then(function(det_response) {
    //   console.log(det_response);
      console.log(typeof det_response);
      var theimage = 'data:image/jpg;base64,'+ det_response;
      $("#flag-img").attr("src", 'theimage');

      console.log("🌄");
    });
    console.log(gPlace);
    console.log(response);
    console.log("🏔");
  });
}
getPlacesPhoto('london');

// using NYTimes Api to get ARticles realted to the City
function getNYTheadlines(search) {
  let timesAPIKey = "tZBdDvmK4rEbR0G33QN4LMbkuYMVDJr2";
  let setting = {
    url:
      "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
      search +
      "&api-key=tZBdDvmK4rEbR0G33QN4LMbkuYMVDJr2",
    method: "GET"
  };
  $.ajax(setting).then(function(response) {
    var articleList = response.response.docs;
    // console.log(response);
    // console.log(articleList);
    var headline_div = $("<ul class='list-group list-group-left' >");
    for (var i = 0; i < 3; i++) {
      var headline = articleList[i].headline.main;
      var timesLink = articleList[i].web_url;
      var cardlink = $("<a class='card-link'>");
      cardlink.attr("href", timesLink);
      cardlink.text(headline);
      //   console.log(headline_div);
      headline_div.append(
        $("<li class='list-group-item bg-dark text-danger' >").append(cardlink)
      );
    }
    $("#nyt-panel-body").append(headline_div);
  });
}