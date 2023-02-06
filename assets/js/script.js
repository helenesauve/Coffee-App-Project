// when button is clicked, the function starts
$("button").on("click", function () {
  console.log(city);

  var city = $("#input-selector").val();
  var geocodeUrl =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    city +
    "&key=" +
    myKey;

  $.ajax({
    url: geocodeUrl,
    method: "GET",
  }).then(queryCoffeesFromGeocodeResponse);
});

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

    var coffeePlace = [
      (coffeePlace1 = response.results[0].name),
      (coffeePlace2 = response.results[1].name),
      (coffeePlace3 = response.results[2].name),
      (coffeePlace3 = response.results[3].name),
      (coffeePlace4 = response.results[4].name),
    ];

    // loop through the results in the response data
    for (var i = 0; i < coffeePlace.length; i++) {
      coffeeBlock = $("<div>");
      coffeeBlock.css({
        "background-color": "black",
        color: "white",
        padding: "10px",
        border: "solid white",
      });
      // test

      var $coffeeList = $("<ul>");
      $coffeeList.addClass("list-group");

      $("#cafe-section").append($coffeeList);

      var openingHours = response.results[i].opening_hours.open_now;
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

      $articleListItem.append("<h3>" + coffeePlace[i] + "</h3>");
      $articleListItem.append("<h4>Rating: " + rating + "</h4>");
      $articleListItem.append("<h4>Address: " + address + "</h4>");
      $articleListItem.append("<h4>Opening hours: " + message + "</h4>");

      $coffeeList.append($articleListItem);
    }
  });
}

// Function to empty out the articles
function clear() {
  $("#cafe-section").empty();
}
