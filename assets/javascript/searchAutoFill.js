var arr = '';
$('#input-city').keyup( function() {
  var input = $(this).val().trim();
  $('#city-suggestion').show();
  $('#city-suggestion').empty();
  $.ajax({
    url: "https://api.teleport.org/api/cities/?search=" + input,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    for(var i = 0; i < response.count; i++) {
      var searchResults = response._embedded["city:search-results"][i];
        var newSuggestion = searchResults.matching_full_name;
        var newP = $('<p>').text(newSuggestion).addClass('suggested-city');
        $('#city-suggestion').append(newP);
    }
  })
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