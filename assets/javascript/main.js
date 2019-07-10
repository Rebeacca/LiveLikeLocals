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
      console.log("thi is my response",response);
    for (var i = 0; i < 3 ; i++) {
      var url = response.events[i].url;
      console.log("eventurl", url)
      var p = "<p>" + url + "</p>";
      $(".list-group-item list-group-item-dark").append(p);
      $(".list-group-item list-group-item-danger").append(p);
      $(".list-group-item list-group-item-dark").append(p);
    });
  }

$(document).ready(function(){


