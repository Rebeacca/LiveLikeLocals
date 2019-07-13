
var city = 'Philadelphia';
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
            $("#favorite-btn").show();
      });
    };
  });
  city = localStorage.getItem('city');
  $("#dash-city").text(city);
  $('#log-in-btn').hide();
  $('#log-out-btn').show();
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
  database.ref("/userAccounts/").on("child_added", function(snapshot) {
    if (usernameInput === snapshot.val().username) {
      if(snapshot.val().password === passwordInput) {
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
              $("#saved-Cities-Card").show();
            });
          }
        });
        $("#saved-Cities").empty();
        modal.style.display = "none"
        $('#log-in-btn').hide();
        $('#log-out-btn').show();
        $('#sign-in-invalid-text').text('');
        $("#username-input").val('');
        $("#password-input").val('');
        $('#log-in-btn').hide();
        $('#log-out-btn').show();
        $("#favorite-btn").show();
      }
    } else {
      $('#sign-in-invalid-text').text('The username or the password is invalid');
    };
  });
}

function createNewAccFunc() {
  let signedInUsernames = [];
  let newUsernameInput = $("#newusername-input")
    .val()
    .trim();
  let newPasswordInput = $("#newpassword-input")
    .val()
    .trim();
  let confirmPasswordInput = $("#confirm-password-input")
    .val()
    .trim();
    database.ref('/userAccounts').on('child_added', (snapshot) => {
      signedInUsernames.push(snapshot.val().username);
    });
    setTimeout(function() {
      if (newPasswordInput === confirmPasswordInput && !signedInUsernames.includes(newUsernameInput)) {
        database.ref("/userAccounts").push({
          username: newUsernameInput,
          password: newPasswordInput
        });
        $("#create-acc-div").hide();
        $("#log-in-div").show();
      } else if(signedInUsernames.includes(newUsernameInput)){
          $('#create-acc-invalid-text').text('The username is not available.');
      } else {
          $('#create-acc-invalid-text').text('The passwords are not the same. Please type again.');
      }
    },2000);
}

function loadcity(cityinput) {
  $("#dash-city").text(cityinput);
  localStorage.setItem('city', cityinput);
}

function addToFavorite() {
  var favoriteCity = $("#dash-city").text();
  if(!favoriteCityArr.includes(favoriteCity)) {
    favoriteCityArr.push(favoriteCity);
  }
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
  $("#saved-Cities-Card").show();
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

var latLngArr = [];
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
      var events = response.search.events.event;
      for (var i = 0; i < events.length; i++) {
        var eventTitle = events[i].title["#text"];
        if(prevEventTitle !== eventTitle) {
          var eventDescription = events[i].description["#text"]; 
          var eventUrl = events[i].url["#text"];
          var eventImageUrl;
          var eventLocation = events[i].venue_address["#text"];
          var eventStartTime = events[i].start_time["#text"];
          if(eventStartTime) {
            var timeArr = eventStartTime.split(' ');
            var eventStartDate = timeArr[0];
            var eventStartTime = timeArr[1];
            var eventStartYear = eventStartDate.split('-')[0];
            var eventStartMonth = eventStartDate.split('-')[1];
            var eventStartDay = eventStartDate.split('-')[2];
            var eventStartHour = parseInt(eventStartTime.split(':')[0]);
            var eventStartMin = eventStartTime.split(':')[1];
            eventStartDate = eventStartMonth + '-' + eventStartDay + '-' + eventStartYear;
            if(eventStartHour > 12) {
              eventStartHour -= 12;
              eventStartTime = eventStartHour + ':' + eventStartMin + 'PM';
            } else {
              eventStartTime = eventStartHour + ':' + eventStartMin + 'AM';
            }
          }
          if(events[i].image.hasOwnProperty("medium")) {
            eventImageUrl = 'https://' + events[i].image.medium.url['#text'].slice(2);
          }else {
            eventImageUrl = 'https://www.crucial.com.au/blog/wp-content/uploads/2014/12/events_medium.jpg';
          }
          var eventLat = parseFloat(events[i].latitude["#text"]);
          var eventLng = parseFloat(events[i].longitude["#text"]);
          latlng = {lat: eventLat, lng: eventLng};
          latLngArr.push(Object.assign({}, latlng));
          var newTitle = $('<h4>').text(eventTitle).addClass('card-title');
          var newCardBody = $('<div>').addClass('card-body');
          var newImgDiv = $('<div>');
          var newImg = $('<img>').attr('src', eventImageUrl).attr('alt', eventTitle).addClass('float-left img-fluid');
          newImgDiv.append(newImg);
          var newStartDateP = $('<p>').text(eventStartDate); 
          var newStartTimeP = $('<p>').text(eventStartTime);
          if(eventDescription) {
            var eventDescription300 = eventDescription.split('').splice(0,400);
            var modifiedEventDescription = eventDescription300.join('')+eventDescription.slice(400).split('.')[0] + '...';  
            if(modifiedEventDescription[4] === '>') {
              var newDescription = $('<p>').addClass('text-justify card-text').html(modifiedEventDescription.slice(5));;
            } else {
              var newDescription = $('<p>').addClass('text-justify card-text').html(modifiedEventDescription);
            }
          }
          if(!eventLocation) {
            eventLocation = '';
          }
          var newLocation = $('<p>').text('Location : ' + eventLocation);
          var newUrl = $('<a>').html("see more").attr('href', eventUrl).attr('target', '_blank');
          newCardBody.append(newImgDiv).append(newStartDateP).append(newStartTimeP).append(newLocation).append(newDescription).append(newUrl);
          var newCard = $('<div>').addClass('card mt-3');
          var newCardHeader = $('<div>').addClass('card-header bg-light');
          newCardHeader.append(newTitle);
          newCard.append(newCardHeader)
            .append(newCardBody);
          var newDiv = $('<div>').addClass('dash-col col-12');
          newDiv.append(newCard);
          $('#events').append(newDiv);
          prevEventTitle = eventTitle;
          }
      }
    });
};
gettingDataFromEventfullAPI(city);


$("#sign-in-btn").on("click", function () {
  event.preventDefault();
  signInValidation();
});

$("#sign-up-link").on('click', function() {
  $("#create-acc-div").show();
  $("#log-in-div").hide();
});

$("#new-acc-btn").on("click", function () {
  event.preventDefault();
  createNewAccFunc();
});

$("#sign-in-link").on('click', function() {
  $("#create-acc-div").hide();
  $("#log-in-div").show();
});

$('#log-in-btn').on('click', function() {
  document.getElementById('id01').style.display='block';
  $("#create-acc-div").hide();
  $("#log-in-div").show();
});

$('#log-out-btn').on('click', function() {
  favoriteCityArr = [];
  upcomingEventImageArr = [];
  $('#saved-Cities').empty();
  $("#saved-Cities-Card").hide();
  username = '';
  localStorage.setItem('username', username);
  $('#log-in-btn').show();
  $('#log-out-btn').hide();
  $('#sign-in-invalid-text').text('');
  $("#favorite-btn").hide();
});


$("#search-btn").on("click", function () {
  $('#events').empty();
  if($("#input-city").val()) {
    let searchInput = $("#input-city").val().trim().replace(/(^|\s)\S/g, x => x.toUpperCase());
    gettingDataFromEventfullAPI(searchInput);
    loadcity(searchInput);
  }
  $("#input-city").val('');
  $("#invalid-text").text('Enter a city');
  
});

$("#favorite-btn").on("click", function () {
  addToFavorite();
});

$(document).on('click', '.favorite-city', function() {
  $('#events').empty();
  gettingDataFromEventfullAPI(this.id);
  loadcity(this.id);
});

let modal = document.getElementById("id01");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
