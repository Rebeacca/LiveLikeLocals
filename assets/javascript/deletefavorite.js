function deleteFavDisplay(id) {
  var newDelBtn = $('<p>').text('X').addClass('del-fav-btn').attr('id', 'X').attr('data-id', id);
  $('#'+id + '-div').append(newDelBtn);
};

function deleteFavHide(id) {
  
}

$(document).on('mouseenter', '.favorite-city', function() {
  deleteFavDisplay(this.id.replace(' ', '-'));
});

$(document).on('mouseleave', '.favorite-city', function() {
  setTimeout(function() {
    $('#X').remove();
  },2000);
});

$(document).on('click', '#X', function() {
  var deleteCity = $(this).attr('data-id').replace('-', ' ');
  var index = favoriteCityArr.indexOf(deleteCity);
  favoriteCityArr.splice(index, 1);
  console.log(username);
  database.ref('/userData/' + username).set({
    favoriteCities : favoriteCityArr
  });
  $('#'+deleteCity.replace(' ', '-') + '-div').remove();
  console.log(deleteCity.replace(' ', '-'));
});

// function addToFavorite() {
//   var favoriteCity = $("#dash-city").text();
//   favoriteCityArr.push(favoriteCity);
//   database.ref('/userData/' + username).set({
//     favoriteCities : favoriteCityArr
//   });
//   var newDiv = $('<div>').attr('id', favoriteCity + '-div').addClass('favorite-city-btn-div');
//         var newBtn = $('<button>').text(favoriteCity).addClass('svd-btn btn btn-outline-danger favorite-city').attr('id', favoriteCity);
//         newDiv.append(newBtn);
//         $('#saved-Cities').append(newDiv);
// };
