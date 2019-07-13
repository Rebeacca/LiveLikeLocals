
		//variables that are going to save the first ajax information
		let city = "";
        let id = "";
        let searchTerm = $("#input-city");


		//is calling the first ajax 
        function gettingDataFromzomatoAPI(search) {

            const queryURL = `https://developers.zomato.com/api/v2.1/locations?query=${searchTerm}&apikey=323f95f71d6490ae9709022f1e613955`;

            $.ajax({
                //Async request to giphy API URL 10micro sec
                url: queryURL,
                method: "GET"
            }).then(function (response) {
	
				//extracting the information from the response
                city = response.location_suggestions[0].entity_type;
                id = response.location_suggestions[0].entity_id;
                console.log("this is my first function", response)
                console.log(city,id)
            })
                .catch(function (err) {
                    console.log(err);
                })

        }

		//calling the first function 
        gettingDataFromzomatoAPI();

		//is calling the second ajax call
        function getMoreData() {
			
			//this query is adding both varibles that saved the infromation from the first ajax call
            const queryURL = `https://developers.zomato.com/api/v2.1/location_details?entity_id=${id}&entity_type=${city}&apikey=323f95f71d6490ae9709022f1e613955`;

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (respond) {

                // for (var i = 0; i < 3; i++) { 
                //     console.log("this is my second function", respond.best_rated_restaurant);
                    for (var j = 0; j < 3; j++){
                    const restaurantName = respond.best_rated_restaurant[j].restaurant.name;
                    const restaurantUrl = respond.best_rated_restaurant[j].restaurant.url;
                    console.log("inside second function array", restaurantName, restaurantUrl)
                    }
                    // console.log(restaurantName, restaurantUrl);

            })
                .catch(errr => console.log(errr));
        };
    $('#search-btn').on('click', function() {
        event.preventDefault();
        console.log(searchTerm.val())
    })
		
		//This calling the second function 
        getMoreData();
