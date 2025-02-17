
$("button").on("click", function (event) {
  var city = $("#input-selector").val();
  event.preventDefault();
  addToStorage(city);
  renderButtons();
  localStorage.setItem("city", city);
  searchGeoCode(city)
});
function searchGeoCode(city){
  
  var geocodeUrl =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    city +
    "&key=" +
    myKey;
  
  $.ajax({
    url: geocodeUrl,
    method: "GET",
  }).then(queryCoffeesFromGeocodeResponse);
}

// Local storage
// function that adds new value to array in local storage
function addToStorage(newValue) {
  var searchedCities = JSON.parse(localStorage.getItem("searched")) || [];
  if (searchedCities.includes(newValue)) {
    return;
  }
  searchedCities.push(newValue);
  localStorage.setItem("searched", JSON.stringify(searchedCities));
}

// function to render a button for each city searched (unless it's already there)
function renderButtons() {
  var searchedCities = JSON.parse(localStorage.getItem("searched")) || [];
  console.log(searchedCities);
  if (!searchedCities) {
    localStorage.setItem("searched", JSON.stringify([]));
    return;
  }
  // empty history to render new array
  $("#history-list").empty();
  for (let i = 0; i < searchedCities.length; i++) {
    console.log(searchedCities[i]);
    var newCity = $("<button>");
    newCity.text(searchedCities[i]);
    $("#history-list").append(newCity);
    newCity.on("click", function () {
      console.log("cliked")
      searchGeoCode(this.innerHTML);
    });
  }
}

// function that query coffees in the location searched
function queryCoffeesFromGeocodeResponse(response) {
  // remove current recommendations
  clear();

  var latitude = response.results[0].geometry.location.lat;
  var longitude = response.results[0].geometry.location.lng;

  // build queryurl
  var queryUrl =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
    latitude +
    "," +
    longitude +
    "&radius=500&types=cafe" +
    "&key=" +
    myKey;
  console.log(queryUrl);

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var coffeePlace = [
      (coffeePlace1 = response.results[0].name),
      (coffeePlace2 = response.results[1].name),
      (coffeePlace3 = response.results[2].name),
      (coffeePlace3 = response.results[3].name),
      (coffeePlace4 = response.results[4].name),
    ];

    // loop through the results in the response data
    for (var i = 0; i < coffeePlace.length; i++) {
      var $coffeeList = $("<ul>");
      $coffeeList.addClass(" list-group-item flex");

      $("#cafe-section").append($coffeeList);

      // adding in opening hours if available in the response
      var openingHours = response.results[i].opening_hours?.open_now;
      console.log(openingHours);
      if (openingHours) {
        message = "Open now";
      } else {
        message = "Closed";
      }
      var openMessage = $("<p>");
      openMessage.text(message);

      var $articleListItem = $("<li class='list-group-item articleHeadline'>");
      var rating = response.results[i].rating;
      var address = response.results[i].vicinity;

      // appending all elements as li
      $articleListItem.append("<h3>"+ "<strong>" + coffeePlace[i] + "</strong>" +"</h3>");
      $articleListItem.append("<h4>Rating: " + rating + "</h4>");
      $articleListItem.append("<h4>Address: " + address + "</h4>");
      $articleListItem.append("<h4>Opening hours: " + message + "</h4>");
      var imageDiv = $("<div>")
      imageDiv.addClass("image-div")
      var imageEl = $("<img>")
      imageEl.attr("src", "./cafe-g05c344315_1920.jpg")
      imageEl.addClass("small")
      imageDiv.append(imageEl)
      $coffeeList.append(imageDiv)
      $coffeeList.append($articleListItem);
    }
  });
}

// Function to empty out the articles
function clear() {
  $("#cafe-section").empty();
}

// Clear history button
$("#clearHistory").on("click", function () {
  // emptying space for new data to appear
  $("#history-list").empty();
  localStorage.clear();
});
    renderButtons();
