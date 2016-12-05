var locations = [
  {
    name: 'Pho Duy 6',
    lat: 39.913189,
    lng: -105.070082
  },

  {
    name: "Sakana Sushi & Ramen",
    lat: 39.832,
    lng: -105.052
  },

  {
    name: "DAE GEE KOREAN BBQ",
    lat: 39.833,
    lng: -105.052
  },

  {
    name: "Woody's Wings N Things",
    lat: 39.82,
    lng: -105.035
  },

  {
    name: "Pho 79",
    lat: 39.829,
    lng: -105.02
  },
];



var Location = function (data) {
  var self = this;
  this.name = data.name;
  this.lat = data.lat;
  this.lng = data.lng;
  this.URL = '';
  this.street = '';
  this.city = '';
  this.phone = '';

  this.visible = ko.observable(true);

  // API client info


  // url builder for request to foursquare
  var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search?ll='
    + this.lat + ',' + this.lng + '&client_id=' + client_id + '&client_secret='
    + client_secret + '&v=20161204' + '&query=' + this.name;

  // start of ajax call for foursquare api
  $.ajax({
    type: "GET",
    url: "https://api.foursquare.com/v2/venues/search",
    dataType: "json",
    data: 'll=' + this.lat + ',' + this.lng + '&client_id=' +
    client_id + '&client_secret=' + client_secret + '&v=20161204' +
    '&query=' + this.name,

    success: function (data) {
      // grabs first and stores in variable place
      var place = data.response.venues[0];

      // sets url to empty string if data emtpy/undefined. else sets data to url
      if ($.trim(place.url) === '' || place.url === undefined) {
        self.URL = ''
      } else {
        self.URL = place.url
      }

      // sets phone empty string if data is emtpy/undefined. else sets to data number
      if ($.trim(place.contact.formattedPhone) === '' || typeof place.contact.formattedPhone === undefined) {
        self.phone = ''
      } else {
        self.phone = place.contact.formattedPhone
      }

      // grabs address
      self.street = place.location.formattedAddress[0];

      // grabs city state zip
      self.city = place.location.formattedAddress[1];
    }, // end success

    error: function(xhr, status, error) {
      // logs error to console 
      console.log(error);
      
    } // end ajax error
  }), // end ajax call
  

  // format for infowindow
  this.contentString = '<div><div><strong>' + data.name + self.error + "</strong></div>" +
    '<div><a href="' + self.URL + '">' + self.URL + "</a></div>" +
    '<div>' + self.street + "</div>" +
    '<div>' + self.city + "</div>" +
    '<div>' + self.phone + "</div></div>";

  // creates infowindow
  this.infoWindow = new google.maps.InfoWindow({ content: self.contentString });

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.lat, data.lng),
    map: map,
    title: data.name
  });

  this.addMarker = ko.computed(function () {
    if (this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);

  this.marker.addListener('click', function () {
    self.contentString = '<div><div><strong>' + data.name + "</strong></div>" +
      '<div><a href="' + self.URL + '">' + self.URL + "</a></div>" +
      '<div>' + self.street + "</div>" +
      '<div>' + self.city + "</div>" +
      '<div><a href="tel:' + self.phone + '">' + self.phone + "</a></div></div>";

    self.infoWindow.setContent(self.contentString);

    self.infoWindow.open(map, this);

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      self.marker.setAnimation(null);
    }, 2000);
  });

  // bounce animation on click using google map js
  this.bounce = function (place) {
    google.maps.event.trigger(self.marker, 'click');
  };



}; // End Var Location



// App View
function appView() {
  // define this as self.
  var self = this;

  // sets search params to empty so complete list displays
  this.searchTerm = ko.observable("");

  //sets empty array
  this.locationList = ko.observableArray([]);

  //creates map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: { lat: 39.7, lng: -105.1 }
  });

  // creates a new location for each item in the data
  locations.forEach(function (location) {
    self.locationList.push(new Location(location));
  });

  // filters search list to lower case 
  this.searchList = ko.computed(function () {
    var filter = self.searchTerm().toLowerCase();
    if (!filter) {
      self.locationList().forEach(function (location) {
        location.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function (location) {
        var string = location.name.toLowerCase();
        var result = (string.search(filter) >= 0);
        location.visible(result);
        return result;
      });
    }
  }, self);

}


// launches app on successful call back
function appInit() {
  ko.applyBindings(new appView());
}

// Google error Handling
function errorHandling() {
  alert("Failure to load google maps")
}