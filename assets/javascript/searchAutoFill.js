var arr = '';
var cityInputInvalid = false;
$('#input-city').keyup( function() {
  var input = $(this).val().trim();
  var newInvalidP = $('#invalid-text');
  $.ajax({
    url: "https://api.teleport.org/api/cities/?search=" + input,
    method: "GET"
  }).then(function(response) {
    if(response.count !== 0) {
      $('#city-suggestion').show();
      $('#city-suggestion').empty();
      for(var i = 0; i < response.count; i++) {
        var searchResults = response._embedded["city:search-results"][i];
          var newSuggestion = searchResults.matching_full_name;
          var newP = $('<p>').text(newSuggestion).addClass('suggested-city');
          $('#city-suggestion').append(newP);
          newInvalidP.text('');
      }
    } else {
      $('#city-suggestion').hide();
      newInvalidP.text('Invalid City');
      $('#input-city-div').append(newInvalidP);
      $('#input-city').val('');
    }
  });
});

$('#input-city').focus(function() {
  var input = $(this).val().trim();
  if(input) {
    $('#city-suggestion').show();
  };
});

$(document).click(function() {
  if(event.target.id !== 'input-city') {
    $('#city-suggestion').hide();
  }
 });

$(document).on('click', '.suggested-city', function() {
  $('#input-city').val($(this).text().split(',')[0]);
})