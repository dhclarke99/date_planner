var submitButton = document.querySelector("#submit");
var cityName = document.querySelector("#city-search");
var ulElement = document.querySelector(".event-list");
var googleLocation = document.querySelector(".location");
var selectedVenueEl = document.querySelector(".selected-venue")



function getData(){
  
  var cityText = cityName.value;

  var apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + cityText + "&onsaleOnStartDate=2023-04-07&apikey=NVTo5BdoHOx3wqrQqHYBnp1JGWpEdeQ7"
    
    fetch (apiUrl) 
        .then (function (response){
            return response.json ();
        })
        //getting name of venue for event in searched city
        .then (function (data){
          console.log(data._embedded.events.length)
          console.log(data._embedded.events)
          console.log(data)
          var arrayItems = []
          var arraySearch = []
          var arrayLinks = []
          for (var i = 0; i < data._embedded.events.length - 1; i++) {
            // if any of the below fields are missing, loop will fail
            arrayItems.push("Venue: " + data._embedded.events[i]._embedded.venues[0].name + " Genre: " + data._embedded.events[i].classifications[0].segment.name + " SubGenre: " + data._embedded.events[i].classifications[0].subGenre.name)
            arraySearch.push(data._embedded.events[i]._embedded.venues[0].name + ", " + cityText)
            arrayLinks.push(data._embedded.events[i].url)
            //logging venue name, Event Type, and Subgenre.
            //  console.log (data._embedded.events[i]._embedded.venues[0].name + ": " + data._embedded.events[i].classifications[0].segment.name + ": " + data._embedded.events[i].classifications[0].subGenre.name)
             var event =(data._embedded.events[i]._embedded.venues[0].name + ", " + cityText)
             console.log(event)
             

          
          }
          console.log(arrayLinks)
          for (var i = 0; i < arrayItems.length; i++) {
            var buttonElement = document.createElement("button");
            buttonElement.setAttribute("class", "location");
            
            var liElement = document.createElement("li");
            var aElement = document.createElement("a")

            
            buttonElement.textContent = arrayItems[i];
            aElement.setAttribute("href", arrayLinks[i]);
            aElement.setAttribute("target", "_blank");  

            aElement.appendChild(buttonElement)
            liElement.appendChild(aElement)
            ulElement.appendChild(liElement)

            
            buttonElement.addEventListener("click", function(event){
              setLocation(event);
            });
          
              
          }
          function setLocation (event){
            
            // var {Map, places} = google.maps;
            // var Marker = google.maps.Marker;
          
            // map = new Map(document.getElementById("map"), {
            //   center: { lat: -34.397, lng: 150.644 },
            //   zoom: 8,
            // });
            
            var buttonText = event.target.textContent;
            console.log(buttonText);
            
            selectedVenueEl.textContent = buttonText;
            
          }
          }
        )
}
  
var map;


function initMap() {
  var {Map, places} = google.maps;
  var Marker = google.maps.Marker;

  var restaurantList = document.getElementById("restaurantList");
  var selectedRestaurant = document.querySelector(".selected-restaurant");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  var searchInput = document.getElementById("search");
  var autocomplete = new places.Autocomplete(searchInput);

  var infoWindow = new google.maps.InfoWindow();

  var lastClickedMarker;

  autocomplete.addListener("place_changed", () => {
    var place = autocomplete.getPlace();
    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(15);

      var marker = new Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
      });

      marker.addListener("click", () => {
        infoWindow.setContent(place.name);
        infoWindow.open(map, marker);
        console.log(place.name);
        var eventName = place.name
        console.log(eventName);
      });
    }
    document.getElementById("saveDateBtn").addEventListener("click", function () {
      var selectedRestaurant = document.querySelector(".selected-restaurant");
      var selectedVenue = document.querySelector(".selected-venue");

      if (selectedRestaurant && selectedVenue) {
        var restaurantText = selectedRestaurant.textContent;
        var venueText = selectedVenue.textContent;

        localStorage.setItem("selectedRestaurant", restaurantText);
        localStorage.setItem("selectedVenue", venueText);

        alert("Date Saved!");
      } else {
        alert("Error: select a restaurant or venue");
      }
    });

      var request = {
      location: map.getCenter(),
      radius: 500,
      type: "restaurant",
};
  
    var service = new places.PlacesService(map);

  
    service.nearbySearch(request, (results, status) => {
      if (status === places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
          });

          (function(marker, place) {
            marker.addListener("click", () => {
              infoWindow.setContent(place.name);
              infoWindow.open(map, marker);
              console.log(place.name + ": " + place.types[0]);

              lastClickedMarker = place.name;
              selectedRestaurant.textContent = lastClickedMarker;

            });
          })(marker, place);
        }
      }
    });
  });
}
window.initMap = initMap;


submitButton.addEventListener("click", getData)

