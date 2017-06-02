// Create an arrya of locations with titles and markers
var locations = [
    {title: 'Alchemy coffee', location: {lat: 24.80652, lng: 46.650542}, marker:''},
    {title: 'Camel step coffee', location: {lat: 24.769306, lng: 46.691027}, marker:''},
    {title: 'Manual brew coffee', location: {lat: 24.772537, lng: 46.710265}, marker:''},
    {title: 'coffee tale', location: {lat:24.782176, lng: 46.706268}, marker:''},
    {title: 'Five Elephants', location: {lat: 24.81698, lng: 46.644359}, marker:''},
    {title: 'The Roasting house', location: {lat: 24.743643, lng: 46.674513}, marker:''}
];


 var map;
 var bounds;

 var initMap =function(){
     // start maps on the "map" div
       map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 24.806658, lng: 46.682607},
          zoom: 13
       });

       var infowindow = new google.maps.InfoWindow();
           bounds = new google.maps.LatLngBounds();

       // loop through all locations to create markers
       for (var i = 0; i < locations.length; i++) {
           var position = locations[i].location;
           var title = locations[i].title;
           var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
          });
          // Push the marker to our locations array
          locations[i].marker = marker;
    
          // click event for the markers
          marker.addListener('click', function() {
            openInfo(this, infowindow);
          });
           bounds.extend(locations[i].marker.position);
       };
        
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
        
        function openInfo(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.setContent('<div>' + marker.title + '</div>');
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick',function(){
                  infowindow.setMarker = null;
                });
            }
      }   
};

function renderMarkers(filterdLocations){
    // clear all markers
    console.log(filterdLocations.length);
    for( var i=0; i< locations.length; i++){
      locations[i].marker.setVisible(false);
    };
    // set the markers for filterd locations only
    for( var i=0; i< filterdLocations.length; i++){
        filterdLocations[i].marker.setVisible(true);
        bounds.extend(filterdLocations[i].marker.position);
    };
      // Extend the boundaries of the map for each marker
      map.fitBounds(bounds);
};

var viewModel = function() {
    // the observable array
    places = ko.observableArray(locations);
    // observable value to hold the filterd place
    placeName = ko.observable();
    // the list of places to be binded to
    this.filter= ko.computed(function () {
          // the filterd place
          var filtered = this.placeName();
          // if no filterd place list all the places
          if (!filtered) {
              return this.places();
          } else {
            // filter the places array 
            return ko.utils.arrayFilter(this.places(), function (filterdLocations) {
                  return stringStartsWith(filterdLocations.title.toLowerCase(), filtered.toLowerCase(), filterdLocations) ;
              });
          }
    });
    // with each key down clear the array that holds the filterd places
    this.clearArray = function(){
        // clear the array
        filterdArray=[];
        // set all places markers to true
        for( var i=0; i< locations.length; i++){
            locations[i].marker.setVisible(true);
        };
        return true;
    }

};

// Orginal code belongs to "rniemeyer" on this blog https://github.com/knockout/knockout/issues/401
// returns the places that starts with letters inputed by the user to filter
var stringStartsWith = function (string, startsWith, filterdLocations) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith && window.setTimeout(sendFilterd(filterdLocations));
};

// array to hold the filterd places
var filterdArray=[];
// Since the method stringStartsWith returns each filterd place in indivisual object, an array has to be created to push each objectthen render its marker
var sendFilterd = function(filterdLocations){

    filterdArray.push(filterdLocations);
    renderMarkers(filterdArray);  
};

ko.applyBindings(new viewModel());
