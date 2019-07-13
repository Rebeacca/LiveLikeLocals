// Copy and paste your woAPP ID
//app_id
const appID = "qk0tor9gn0sBTg9a74U5"

//APP CODE
const appCode = "TGeFTDkuDPK7Ol8eefzaUA"

//freeform
// https://geocoder.api.here.com/6.2/geocode.json
// ?app_id={YOUR_APP_ID}&app_code={YOUR_APP_CODE}
// &searchtext=200%20S%20Mathilda%20Sunnyvale%20CA

//landmark around the location
// https://reverse.geocoder.api.here.com/6.2/reversegeocode.json
//   ?app_id={YOUR_APP_ID}
//   &app_code={YOUR_APP_CODE}
//   &mode=retrieveLandmarks
//   &prox=37.7442,-119.5931,1000rk, or start typing.
  
 
//  function getFreeForm(){
//    $.get(`https://geocoder.api.here.com/6.2/geocode.json?app_id=${appID}&app_code=${appCode}&${searchText}`)
//  }


        function gettingDataFromGecoderAPI() {

            const searchText = $("#input-city");

            const queryURL =
                `https://geocoder.api.here.com/6.2/geocode.json?app_id=qk0tor9gn0sBTg9a74U5&app_code=TGeFTDkuDPK7Ol8eefzaUA&searchtext=${searchText}`;

            $.ajax({
                //Async request to giphy API URL 10micro sec
                url: queryURL,
                method: "GET"
            }).then(function (data) {

                //getting the data from the first call
                const long = data.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude
                const lat = data.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude

                //calling the second function and passing the data
                getLandMarks(long, lat);

            })
                .catch(function (err) {
                    console.log(err);
                })
        }


        function getLandMarks(long, lat) {

            const queryURL = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?app_id=qk0tor9gn0sBTg9a74U5&app_code=TGeFTDkuDPK7Ol8eefzaUA&mode=retrieveLandmarks&prox=${lat},${long},1000`;

            $.ajax({
                //Async request to giphy API URL 10micro sec
                url: queryURL,
                method: "GET"
            }).then(function (data) {

            for (var i = 0; i < 3; i++) { 
                const landmarks = data.Response.View[0].Result[i].Location.Name;
                console.log(landmarks);
                }       
            
// if(data.Response.View[vents.length > 0){ 
            //     for (var i = 0; i < 3; i++) {
                // const landmarks1 = data.Response.View[0].Result[1].Location.Name
                // const landmarks2 = data.Response.View[0].Result[2].Location.Name

            //     if(i % 2 === 0){ $(".event_block").append(`<li class="list-group-item list-group-item-dark">
            // <a href="${url}">${name}</a></li>`) }
            // else{ 
            //   $(".event_block").append(`<li class="list-group-item list-group-item-danger">
            // <a href="${url}">${name}</a></li>`) } } }
            
            // else{ $(".event_block").append(`
            // <li class="list-group-item list-group-item-danger">No results found</li>
            // `) } };



                console.log(data);
                
                // console.log(landmarks1)
                // console.log(landmarks2)


            })
                .catch(function (err) {
                    console.log(err);
                })
        }

        gettingDataFromGecoderAPI();


