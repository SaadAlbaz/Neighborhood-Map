// Create an arrya of locations with titles
var locations = [
    {title: 'Alchemy coffee', location: {lat: 24.80652, lng: 46.650542}},
    {title: 'Camel step coffee', location: {lat: 24.769306, lng: 46.691027}},
    {title: 'Manual brew coffee', location: {lat: 24.772537, lng: 46.710265}},
    {title: 'coffee tale', location: {lat:24.782176, lng: 46.706268}},
    {title: 'Five Elephants', location: {lat: 24.81698, lng: 46.644359}},
    {title: 'The Roasting house', location: {lat: 24.743643, lng: 46.674513}}
];


 function initMap() {
     // start maps on the div map
   var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 24.806658, lng: 46.682607},
         zoom: 1
       });

       var infowindow = new google.maps.InfoWindow();
       var bounds = new google.maps.LatLngBounds();

       // loop through locations to create markers
       var markers = [];
       for (var i = 0; i < locations.length; i++) {
           var position = locations[i].location;
           var title = locations[i].title;
           var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // click event for the markers
          marker.addListener('click', function() {
            openInfo(this, infowindow);
          });
           bounds.extend(markers[i].position);
       }
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
}

var viewModel = function() {
    // the observable array to be binded to
    this.titles = ko.observableArray(locations);
    // observable value to hold the filterd place
    this.placeName = ko.observable("");
    
    this.filter = function(){
        

           
               console.log(this.titles().pop())
           
           
        
    
    }
};

ko.applyBindings(new viewModel());
