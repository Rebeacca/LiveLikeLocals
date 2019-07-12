var favoriteCityArr = [];
var username;
var searchInput = "Philadelphia";
if(localStorage.getItem('city') !== '') {
  searchInput = localStorage.getItem('city');
}

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
      localStorage.setItem("username", username);
      database.ref("/userData/").once("value", function(snapshot) {
        if (
          snapshot.val().hasOwnProperty(username) &&
          snapshot.val()[username].hasOwnProperty("favoriteCities")
        ) {
          favoriteCityArr = snapshot.val()[username].favoriteCities;
          favoriteCityArr.forEach(function(cityName) {
            var newDiv = $("<div>")
              .attr("id", cityName.replace(' ', '-') + "-div")
              .addClass("favorite-city-btn-div mr-2 ml-2");
            var newBtn = $("<button>")
              .text(cityName)
              .addClass("svd-btn btn btn-outline-danger favorite-city")
              .attr("id", cityName);
            newDiv.append(newBtn);
            $("#saved-Cities").append(newDiv);
            $("#saved-Cities-Card").css("display", "block");
          });
        }
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

function loadcity(cityinput) {
  $("#dash-city").text(cityinput);
  localStorage.setItem("city", cityinput);
}

function addToFavorite() {
  var favoriteCity = $("#dash-city").text();
  favoriteCityArr.push(favoriteCity);
  database.ref("/userData/" + username).set({
    favoriteCities: favoriteCityArr
  });
  var newDiv = $("<div>")
    .attr("id", favoriteCity.replace(' ', '-') + "-div")
    .addClass("favorite-city-btn-div mr-2 ml-2");
  var newBtn = $("<button>")
    .text(favoriteCity)
    .addClass("svd-btn btn btn-outline-danger favorite-city")
    .attr("id", favoriteCity);
  newDiv.append(newBtn);
  $("#saved-Cities").append(newDiv);
}

function gettingDataFromWeatherAPI(search) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${search},us&units=imperial&mode=json&appid=eebfc72febcd4f3a1f94dfc49ad4df6a`,
    method: "GET"
  }).then(function(response) {
    var list = response;
    var weathericon = list.weather[0].icon;
    var weatherDescription = list.weather[0].description;
    weatherDescription = weatherDescription.toUpperCase();
    var weatherTemp_Current = "Current: " + Math.floor(list.main.temp) + "º";
    var weatherTemp_High = "High: " + Math.floor(list.main.temp_max) + "º";
    var weatherTemp_Low = "Low: " + Math.floor(list.main.temp_min) + "º";
    var weatherTemps =
      weatherTemp_Current +
      "\r\n" +
      weatherTemp_High +
      "\r\n" +
      weatherTemp_Low;
    var weathericonSoure =
      "http://openweathermap.org/img/wn/" + weathericon + "@2x.png";
    $("#weather-panel-icon").attr("src", weathericonSoure);
    $("#weather-panel-desc").text(weatherDescription);
    $("#weather-panel-temps").text(weatherTemps);
  });
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

function gettingDataFromEventfullAPI(search) {
  let address = "philadelphia";
  let setting = {
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
      var events = response.search.events.event;
      for (var i = 0; i < 3; i++) {
        var eventTitle = events[i].title["#text"];
        var eventUrl = events[i].url["#text"];
        var newTitle = $("<a>")
          .attr("src", eventUrl)
          .attr("target", "_blank")
          .text(eventTitle);
        $("#upcoming-event-" + i).html(newTitle);
      }
    });
}

function gettingSportsAPI(search) {
  let setting = {
    url:
      "https://api.sportsdata.io/v3/nba/scores/json/Stadiums?key=46cbe2efbe14462997d1c402c84ffbda",
    method: "GET"
  };
  $.ajax(setting).then(function(response) {
    var stadiumList = response;
    for (i = 0; i < stadiumList.length; i++) {
      if (stadiumList[i].City === search) {
        $("#stadium-name-div").text(stadiumList[i].Name);
      }
    }
  });
}

function getPlacesPhoto(search) {
  let googleAPIkey = "AIzaSyDPd-sNhT630sHlTS2BBJXgx4YQpfpHLmc";
  let herok = "https://cors-anywhere.herokuapp.com/";

  //   first find the place in place search
  let setting = {
    url:
      herok +
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
      search +
      " &inputtype=textquery&fields=photos,formatted_address,name,type,place_id,geometry&key=" +
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
    var theimage =
      "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=" +
      gPlace +
      "&key=" +
      googleAPIkey;

    $("#flag-img").attr("src", theimage);
    $("body").css("background-image", "url('" + theimage + "')");
  });
}

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
    for (var i = 0; i < 5; i++) {
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

    $("#nyt-panel-body").empty();
    $("#nyt-panel-body").prepend(headline_div);
  });
}

function loadpanels(searchInput) {
  loadcity(searchInput);
  gettingDataFromWeatherAPI(searchInput);
  gettingDataFromEventfullAPI(searchInput);
  getPlacesPhoto(searchInput);
  getNYTheadlines(searchInput);
  gettingSportsAPI(searchInput);
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

$(document).on("click", ".favorite-city", function() {
  gettingDataFromEventfullAPI(this.id);
  loadpanels(this.id);
});

// set deafult city to philly

loadpanels(searchInput);

$("#search-btn").on("click", function() {
  event.preventDefault();
  searchInput = $("#input-city")
    .val()
    .trim()
    .replace(/(^|\s)\S/g, x => x.toUpperCase());
  loadpanels(searchInput);
  $("#input-city").val('');
});

let modal = document.getElementById("id01");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};



