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

var autocomplete;
function setLocation(event) {
  var buttonText = event.target.textContent.split(":");
  var buttonText2 = buttonText[1].split("Genre");
  var finalVenue = buttonText2[0];
  selectedVenueEl.textContent = finalVenue;
  var searchInput = document.getElementById("search");
  searchInput.value = finalVenue;

}

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
  var reviews = place.reviews
  var h2Element = document.createElement("h2")
  h2Element.setAttribute("class", "venue-reviews-title")
  h2Element.textContent = place.name + " - Reviews"
  venueReviews.appendChild(h2Element)

  for (var i = 0; i < reviews.length; i++) {
    var divElement = document.createElement("div")
    var h3Element = document.createElement("h3")
    var ratingElement = document.createElement("p");
    var textElement = document.createElement("p")
    h3Element.textContent = reviews[i].author_name + " - " + reviews[i].relative_time_description;
    ratingElement.textContent = "Rating: " + reviews[i].rating;
    textElement.textContent = '"' + reviews[i].text + '"';
    textElement.setAttribute("class", "venue-reviews-text")
    divElement.style.border = "1px solid #ccc";
    divElement.style.borderColor = "#000000";
    divElement.style.borderWidth = "3px";
    divElement.style.margin = "5px";
    divElement.appendChild(h3Element);
    divElement.appendChild(ratingElement);
    divElement.appendChild(textElement);
    venueReviews.appendChild(divElement);
  }
  applyVenueReviewStyles();
}

function applyVenueReviewStyles() {
  var parentElement = document.querySelector(".reviews");
  var venueReviewsElement = document.querySelector("#venue-reviews");

  parentElement.style.display = "flex";


  venueReviewsElement.style.width = "50%";
  venueReviewsElement.style.height = "100%";
  venueReviewsElement.style.overflowY = "scroll";
  venueReviewsElement.style.border = "1px solid #ccc";
  venueReviewsElement.style.padding = "10px";
  venueReviewsElement.style.backgroundColor = "#f5f5f5";
  venueReviewsElement.style.color = "#333";
  venueReviewsElement.style.fontFamily = "Arial, sans-serif";
  venueReviewsElement.style.fontSize = "16px";

  if (window.innerWidth <= 768) {
    venueReviewsElement.style.width = "100%";
    venueReviewsElement.style.height = "50%";
    venueReviewsElement.style.position = "fixed";
    venueReviewsElement.style.top = "50px";
  }
}

function getRestaurantReviews(place) {

  var h2Element = document.querySelector(".restaurant-reviews-title")
  h2Element.textContent = place.name + " - Ratings"

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

  var restaurantReviewsElement = document.querySelector("#restaurant-reviews");

  restaurantReviewsElement.style.width = "50%";
  restaurantReviewsElement.style.height = "100%";
  restaurantReviewsElement.style.overflowY = "scroll";
  restaurantReviewsElement.style.border = "1px solid #ccc";
  restaurantReviewsElement.style.padding = "10px";
  restaurantReviewsElement.style.backgroundColor = "#f5f5f5";
  restaurantReviewsElement.style.color = "#333";
  restaurantReviewsElement.style.fontFamily = "Arial, sans-serif";
  restaurantReviewsElement.style.fontSize = "16px";

  if (window.innerWidth <= 768) {
    restaurantReviewsElement.style.width = "100%";
    restaurantReviewsElement.style.height = "50%";
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
      // if there are no events, return an alert
      if (data.page.totalElements > 0) {

        var arrayItems = []
        var arraySearch = []
        var arrayLinks = []
        for (var i = 0; i < data._embedded.events.length; i++) {

          //  if the subgenre value is missing, input "N/A"
          if (data._embedded.events[i].classifications[0].subGenre) {
            arrayItems.push("Venue: " + data._embedded.events[i]._embedded.venues[0].name + " Genre: " + data._embedded.events[i].classifications[0].segment.name + " SubGenre: " + data._embedded.events[i].classifications[0].subGenre.name)
          } else {
            arrayItems.push("Venue: " + data._embedded.events[i]._embedded.venues[0].name + " Genre: " + data._embedded.events[i].classifications[0].segment.name + " SubGenre: N/A")
          }
          arraySearch.push(data._embedded.events[i]._embedded.venues[0].name + ", " + cityText)
          arrayLinks.push(data._embedded.events[i].url)

        }

        

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

      } else {
        console.log(data)
        alert("No upcoming ticketmaster events in this city")
      }
    }
    )
}

document.getElementById("saveDateBtn").addEventListener("click", function () {
  var selectedRestaurant = document.querySelector(".selected-restaurant");
  var selectedVenue = document.querySelector(".selected-venue");

  console.log(selectedRestaurant.textContent)
  if (selectedRestaurant.textContent  && selectedVenue.textContent) {
    var restaurantText = selectedRestaurant.textContent;
    var venueText = selectedVenue.textContent;

    localStorage.setItem("selectedRestaurant", restaurantText);
    localStorage.setItem("selectedVenue", venueText);

    alert("Date Saved!");
  } else  {
    alert("Error: Please select a restaurant and venue");
  }
});

function initMap() {
  var { Map, places } = google.maps;
  var Marker = google.maps.Marker;

  var selectedRestaurant = document.querySelector(".selected-restaurant");

  var map = new Map(document.getElementById("map"), {
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
      });
    }
   

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

