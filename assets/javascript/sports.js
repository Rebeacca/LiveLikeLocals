var favoriteSportsArr = [];
var username;

var firebaseConfig = {
  apiKey: "AIzaSyDdqidcVq2G9WxGondTvOt-LgQttCI9TSE",
  authDomain: "sports-api-83f12.firebaseapp.com",
  databaseURL: "https://sports-api-83f12.firebaseio.com",
  projectId: "sports-api-83f12",
  storageBucket: "",
  messagingSenderId: "195403093293",
  appId: "1:195403093293:web:42e19649a5d88ab6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

if (localStorage.getItem("username")) {
  username = localStorage.getItem("username");
  database.ref("/userData/").once("value", function(snapshot) {
    if (
      snapshot.val().hasOwnProperty(username) &&
      snapshot.val()[username].hasOwnProperty("favoriteSports")
    ) {
      favoriteSportsArr = snapshot.val()[username].favoriteSport;
      favoriteSportsArr.forEach(function(sportName) {
        var newBtn = $("<button>")
          .text(sportName)
          .addClass("svd-btn btn btn-outline-danger favorite-sport")
          .attr("id", cityName);
        $("#saved-Sports").append(newBtn);
      });
    }
  });
}

function gettingSportsAPI() {
  let setting = {
    url:
      "https://api.sportsdata.io/v3/nba/scores/json/Stadiums?key=46cbe2efbe14462997d1c402c84ffbda",
    method: "GET"
  };
  $.ajax(setting).then(function(response) {
    console.log("sports API RESPONSE BELOW");
    console.log(response);
    var stadiumList = response;
    for (i = 0; i < stadiumList.length; i++) {
      console.log(stadiumList[9].City);
      console.log(stadiumList);
      if (stadiumList[i].City === "Philadelphia") {
        console.log("found1");
        console.log(stadiumList[i].Name);
      } else {
        console.log("no matches");
      }
    }
  });
}

gettingSportsAPI();
