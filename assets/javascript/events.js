
var city = 'Washington DC';
var favoriteCityArr = [];
var username;
var prevEventTitle = '';

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

if(localStorage.getItem('username')) {
  username = localStorage.getItem('username');
  database.ref('/userData/').once('value', function(snapshot) {
    if(snapshot.val().hasOwnProperty(username) && snapshot.val()[username].hasOwnProperty('favoriteCities')){
      favoriteCityArr = snapshot.val()[username].favoriteCities;
      favoriteCityArr.forEach(function(cityName) {
        var newDiv = $('<div>').attr('id',cityName + '-div');
        var newBtn = $('<button>').text(cityName).addClass('svd-btn btn btn-outline-danger favorite-city').attr('id', cityName);
        newDiv.append(newBtn);
        $('#saved-Cities').append(newDiv);
      });
    };
  });
  // localStorage.setItem('username', '')
}


if(localStorage.getItem('city')) {
  city = localStorage.getItem('city');
  $("#dash-city").text(city);
} else {
  $("#dash-city").text(city);
}
localStorage.setItem('city', '');

function signInValidation() {
  let usernameInput = $("#username-input")
    .val()
    .trim();
  let passwordInput = $("#password-input")
    .val()
    .trim();
  database.ref("/userAccounts/").on("child_added", function (snapshot) {
    if (
      usernameInput === snapshot.val().username &&
      snapshot.val().password === passwordInput
    ) {
      username = usernameInput;
      localStorage.setItem('username', username);
      database.ref('/userData/').once('value', function (snapshot) {
        if (snapshot.val().hasOwnProperty(username) && snapshot.val()[username].hasOwnProperty('favoriteCities')) {
          favoriteCityArr = snapshot.val()[username].favoriteCities;
          favoriteCityArr.forEach(function (cityName) {
            var newDiv = $('<div>').attr('id',cityName + '-div');
            var newBtn = $('<button>').text(cityName).addClass('svd-btn btn btn-outline-danger favorite-city').attr('id', cityName);
            newDiv.append(newBtn);
            $('#saved-Cities').append(newDiv);
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
};

function loadcity(cityinput) {
  $("#dash-city").text(cityinput);
  localStorage.setItem('city', cityinput);
}

function addToFavorite() {
  var favoriteCity = $("#dash-city").text();
  favoriteCityArr.push(favoriteCity);
  database.ref('/userData/' + username).set({
    favoriteCities : favoriteCityArr
  });
  var newDiv = $('<div>').attr('id',favoriteCity + '-div');
  var newBtn = $('<button>').text(favoriteCity).addClass('svd-btn btn btn-outline-danger favorite-city').attr('id', favoriteCity);
  newDiv.append(newBtn);
  $('#saved-Cities').append(newDiv);
};

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
      for (var i = 0; i < events.length; i++) {
        var eventTitle = events[i].title["#text"];
        if(prevEventTitle !== eventTitle) {
          var eventDescription = events[i].description["#text"]; 
          var eventUrl = events[i].url["#text"];
          var eventImageUrl;
          var eventLocation = events[i].venue_address["#text"];
          if(events[i].image.hasOwnProperty("medium")) {
            eventImageUrl = 'https://' + events[i].image.medium.url['#text'].slice(2);
          }else {
            eventImageUrl = 'https://www.crucial.com.au/blog/wp-content/uploads/2014/12/events_medium.jpg';
          }
          var newTitle = $('<h4>').text(eventTitle).addClass('card-title');
          var newCardBody = $('<div>').addClass('card-body');
          var newImgDiv = $('<div>');
          var newImg = $('<img>').attr('src', eventImageUrl).attr('alt', eventTitle).addClass('float-left img-fluid');
          newImgDiv.append(newImg);
          if(eventDescription) {
            var eventDescription300 = eventDescription.split('').splice(0,400);
            var modifiedEventDescription = eventDescription300.join('')+eventDescription.slice(400).split('.')[0] + '...';  
            if(modifiedEventDescription[4] === '>') {
              var newDescription = $('<p>').addClass('text-justify card-text').html(modifiedEventDescription.slice(5));;
            } else {
              var newDescription = $('<p>').addClass('text-justify card-text').html(modifiedEventDescription);
            }
          }
          
                
  
          var newLocation = $('<p>').text('Location : ' + eventLocation);
          var newUrl = $('<a>').html("see more").attr('href', eventUrl).attr('target', '_blank');
          newCardBody.append(newTitle).append(newImgDiv).append(newDescription).append(newLocation).append(newUrl);
          var newCard = $('<div>').addClass('card mb-3');
          newCard.append(newCardBody);
          var newDiv = $('<div>').addClass('dash-col col-12');
          newDiv.append(newCard);
          $('#events').append(newDiv);
          }
      }
      console.log(events);
    });
};
gettingDataFromEventfullAPI(city);

$("#sign-in-btn").on("click", function () {
  event.preventDefault();
  signInValidation();
});

$("#new-acc-btn").on("click", function () {
  event.preventDefault();
  createNewAccFunc();
});

$("#search-btn").on("click", function () {
  console.log(1);
  let searchInput = $("#input-city").val().trim().replace(/(^|\s)\S/g, x => x.toUpperCase());
  gettingDataFromEventfullAPI(searchInput);
  loadcity(searchInput);
});

$("#favorite-btn").on("click", function () {
  addToFavorite();
});

$(document).on('click', '.favorite-city', function() {
  $('#events').empty();
  gettingDataFromEventfullAPI(this.id);
  loadcity(this.id);
});