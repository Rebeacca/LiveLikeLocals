var city = 'Washington DC';
if(localStorage.getItem('city')) {
  city = localStorage.getItem('city');
}

localStorage.setItem('city', '');
console.log(city);

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
        var eventDescription = events[i].description["#text"]; 
        var eventUrl = events[i].url["#text"];
        var eventImageUrl;
        var eventLocation = events[i].venue_address["#text"];
        if(events[i].image.hasOwnProperty("medium")) {
          eventImageUrl = 'https://' + events[i].image.medium.url['#text'].slice(2);
        }else {
          eventImageUrl = 'https://www.crucial.com.au/blog/wp-content/uploads/2014/12/events_medium.jpg';
        }
        var newCardTitle = $('<div>').addClass('card-title');
        var newTitle = $('<h4>').text(eventTitle);
        newCardTitle.append(newTitle);
        var newCardBody = $('<div>').addClass('card-body');
        var newImgDiv = $('<div>');
        var newImg = $('<img>').attr('src', eventImageUrl).attr('alt', eventTitle).addClass('float-left img-fluid');
        newImgDiv.append(newImg);
        if(eventDescription) {
          if(eventDescription[4] === '>') {
            var newDescription = $('<p>').addClass('text-justify').html(eventDescription.slice(5));;
          } else {
            var newDescription = $('<p>').html(eventDescription);
          }
        }
        var newLocation = $('<p>').text('Location : ' + eventLocation);
        var newUrl = $('<a>').html("see more").attr('href', eventUrl).attr('target', '_blank');
        newCardBody.append(newImgDiv).append(newDescription).append(newLocation).append(newUrl);
        var newCard = $('<div>').addClass('card p-3 mb-3');
        newCard.append(newCardTitle).append(newCardBody);
        var newDiv = $('<div>').addClass('dash-col col-12');
        newDiv.append(newCard);
        $('#events').append(newDiv);
      }
      console.log(events);
    });
};
gettingDataFromEventfullAPI(city)