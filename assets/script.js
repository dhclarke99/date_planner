var submitButton = document.querySelector("#submit");
var cityName = document.querySelector("#city-search");
var ulElement = document.querySelector(".event-list");
var googleLocation = document.querySelector(".location");
var selectedVenueEl = document.querySelector(".selected-venue")
var venueReviews = document.querySelector("#venue-reviews")
var restaurantReviews = document.querySelector("#restaurant-reviews");
var restaurantPriceLevel = document.querySelector("#price-level")
var restaurantRating = document.querySelector("#rating")
var restaurantTotalReviews = document.querySelector("#total-reviews")

function clearVenueReviewList() {
  while (venueReviews.firstChild) {
    venueReviews.removeChild(venueReviews.firstChild);
  }
}

function clearRestaurantReviewList() {
  while (restaurantPriceLevel.firstChild) {
    restaurantPriceLevel.removeChild(restaurantPriceLevel.firstChild);
    restaurantRating.removeChild(restaurantRating.firstChild);
    restaurantTotalReviews.removeChild(restaurantTotalReviews.firstChild);
  }
}

function getVenueReviews(place) {
  console.log(place)
  var reviews = place.reviews
  var h2Element = document.createElement("h2")
  h2Element.setAttribute("class", "venue-reviews-title")
  h2Element.textContent = place.name
  venueReviews.appendChild(h2Element)

  for (var i = 0; i < reviews.length; i++) {
    var pElement = document.createElement("p")
    pElement.textContent = reviews[i].text
    venueReviews.appendChild(pElement)
    console.log(reviews[i].text)
  }
  applyVenueReviewStyles();
}

function applyVenueReviewStyles() {
  var venueReviewsElement = document.querySelector("#venue-reviews");
  venueReviewsElement.style.width = "50%";
  venueReviewsElement.style.height = "100%";
  venueReviewsElement.style.overflowY = "scroll";
  venueReviewsElement.style.border = "1px solid #ccc";
  venueReviewsElement.style.padding = "10px";

  if (window.innerWidth <= 768) {
    venueReviewsElement.style.width = "100%";
    venueReviewsElement.style.height = "50%";
  }
}

function getRestaurantReviews(place) {
  console.log(place)
  console.log(place.price_level)
  console.log(place.rating)
  console.log(place.user_ratings_total)

  var h2Element = document.querySelector(".restaurant-reviews-title")
  h2Element.textContent = place.name

  restaurantPriceLevel.textContent = "Price";
  restaurantRating.textContent = "Rating"
  restaurantTotalReviews.textContent = "Total Reviews"

  var pElementPrice = document.createElement("p")
  pElementPrice.textContent = place.price_level
  restaurantPriceLevel.appendChild(pElementPrice)

  var pElementRating = document.createElement("p")
  pElementRating.textContent = place.rating
  restaurantRating.appendChild(pElementRating)

  var pElementTotalReviews = document.createElement("p")
  pElementTotalReviews.textContent = place.user_ratings_total
  restaurantTotalReviews.appendChild(pElementTotalReviews)

  applyRestaurantReviewStyles()
}

function applyRestaurantReviewStyles() {
  
  restaurantReviews.style.width = "50%";
  restaurantReviews.style.height = "100%";
  restaurantReviews.style.overflowY = "scroll";
  restaurantReviews.style.border = "1px solid #ccc";
  restaurantReviews.style.padding = "10px";

  if (window.innerWidth <= 768) {
    restaurantReviews.style.width = "100%";
    restaurantReviews.style.height = "50%";
  }
}


function clearEventList() {
  while (ulElement.firstChild) {
    ulElement.removeChild(ulElement.firstChild);
  }
}

function getData() {

  clearEventList();

  var cityText = cityName.value;

  var apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?city=" + cityText + "&onsaleOnStartDate=2023-04-07&apikey=NVTo5BdoHOx3wqrQqHYBnp1JGWpEdeQ7"

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    //getting name of venue for event in searched city
    .then(function (data) {
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
        var event = (data._embedded.events[i]._embedded.venues[0].name + ", " + cityText)
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


        buttonElement.addEventListener("click", function (event) {
          setLocation(event);

        });


      }
      function setLocation(event) {

        // var {Map, places} = google.maps;
        // var Marker = google.maps.Marker;

        // map = new Map(document.getElementById("map"), {
        //   center: { lat: -34.397, lng: 150.644 },
        //   zoom: 8,
        // });


        var buttonText = event.target.textContent.split(":");

        console.log(buttonText);

        var buttonText2 = buttonText[1].split("Genre")
        console.log(buttonText2);

        var finalVenue = buttonText2[0];

        selectedVenueEl.textContent = finalVenue;
        var searchInput = document.getElementById("search");
        searchInput.value = finalVenue;

      }
    }
    )
}

var map;


function initMap() {
  var { Map, places } = google.maps;
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
    clearVenueReviewList();
    getVenueReviews(place);
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


          (function (marker, place) {
            marker.addListener("click", () => {
              clearRestaurantReviewList()
              getRestaurantReviews(place)

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

