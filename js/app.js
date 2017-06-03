// Create an arrya of locations with titles and markers
var locations = [
    {title: 'Alchemy coffee', location: {lat: 24.80652, lng: 46.650542}, marker:'', id:'58baa0f60b5656702e53bdee', info:''},
    {title: 'Camel step coffee', location: {lat: 24.769306, lng: 46.691027}, marker:'', id:'53adccbd498ec970f3c9e074', info:''},
    {title: 'Manual brew coffee', location: {lat: 24.772537, lng: 46.710265}, marker:'', id:'58b3acebf22995176a0fe73d', info:''},
    {title: 'coffee tale', location: {lat:24.782176, lng: 46.706268}, marker:'', id:'57929662498e5988d3b1fd36', info:''},
    {title: 'Five Elephants', location: {lat: 24.81698, lng: 46.644359}, marker:'', id:'5884fddf0037eb3b6cbd3d36', info:''},
    {title: 'The Roasting house', location: {lat: 24.743643, lng: 46.674513}, marker:'', id:'53419640498e503a1014d54b', info:''}
];


 var map;
 var bounds;
 var infoWindowI;
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
           var id = locations[i].id;
           var rating;
           var markerContent;
           var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
          });
          // Push the marker to our locations array
          locations[i].marker = marker;

          var infowindow = new google.maps.InfoWindow({});
          
          // to get all the places ratings
         $.ajax({url: "https://api.foursquare.com/v2/venues/"+locations[i].id+"?oauth_token=ENTUA10JFDOS0AD4C10GDHJQQHHHHBSLCD5FXQ5IIWTBV0QR&v=20170603", success: function(result){
               rating = result.response.venue.rating;  
               //get the rating and set it on the infowindow content
               infowindow.setContent('<div>' + rating + '</div>');
            },
            error: function () {
                infowindow.setContent('<h5> Something went wrong when loading google maps, please try later </h5>');
            }
          });
           // add each infowindow in the locations array
            locations[i].info = infowindow;
         
          bounds.extend(locations[i].marker.position);
       };
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
        
        //create click event listener for each marker
        for( var i =0 ; i < locations.length; i++){
          infoWindowI = locations[i].info;
           locations[i].marker.addListener('click', function() {
            openInfo(this, infoWindowI);
          });
        };
        
        function openInfo(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick',function(){
                  infowindow.setMarker = null;
                });
            }
      };

};

function mapsError(){
  document.getElementById('map').innerHTML = "<p class='text-center' style='margin-top: 300px'> Something went wrong when loading google maps, please try later </p>"
}

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
    };
    this.animateMarker = function(){
        console.log(this);        
        // stop animimating all markers
         for( var i= 0; i < locations.length; i++){
          locations[i].marker.setAnimation(null);
         }
        // set the targeted marker to animiate
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
    };

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
