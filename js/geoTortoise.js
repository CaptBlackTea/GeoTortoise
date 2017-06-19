var x = document.getElementById("demo");
var distance = document.getElementById("distance");
var videoElement = document.getElementById("videoSource");
var textPanelElement = document.getElementById("textTafel");
var nextImgLinkElement = document.getElementById("nextImgLink");
var radius = 10;
var watchId;

/*POIs*/
var neuesSchloss;
var metropol;
var koenigsbau;
var altesSchloss;
var markthalle;
var hansBrunnen;

var poiList;

var playerPosition;

var map = L.map('mapid').setView([48.77787033498812, 9.1770601272583], 16);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*var bahnhofLatLng = L.latLng(48.78222532064176, 9.18032169342041);
var bahnhof = L.circle(bahnhofLatLng, radius).addTo(map);*/
/*L.marker(bahnhofLatLng).addTo(map);*/

initPOIs();

drawMarkers();

trackingPlayer();
/*
showVideo("img/Metropol.mp4");*/

map.on('locationfound', onLocationUpdate);
/*
ToDo: get this to work! aktuell ständiger Fehler "position aquisition timed out"
map.on('locationerror', onLocationError);*/

function locateUser() {
  this.map.locate({watch: true, maxZoom: 16});
}

function trackingPlayer() {
  if (navigator.geolocation) {
   watchId = navigator.geolocation.watchPosition(showPosition, showError, {enableHighAccuracy:true, timeout:60000, maximumAge:600000});
   locateUser();

 } else { 
  x.innerHTML = "Geolocation is not supported by this browser.";
}
}

function onLocationUpdate(e) {

  /*    playerPosition = L.circle(e.latlng, radius).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
  */
  if (playerPosition) {
    playerPosition.setLatLng(e.latlng);
    /*calcDist(e.latlng);*/

    for (var i = poiList.length - 1; i >= 0; i--) {
      L.marker(poiList[i].latLng).addTo(map);

      if(playerPosition.getBounds().intersects(poiList[i].geometry.getBounds())){
        /*navigator.geolocation.clearWatch(watchId);*/
        showTextPanel(poiList[i].textPicturePath1);
        /*setUpBtn(poiList[i].answerPicturePath);*/
        showVideo(poiList[i].videoPath);
        if(poiList[i].latLng.equals(metropol.latLng)){
          showVideo("img/Metropol.mp4");
        }
      }
    };

  } else {
    playerPosition = L.circle(e.latlng, radius).addTo(map).bindPopup("You are here.").openPopup();
    /*calcDist(e.latlng);*/
  }
  return false;
}

function showTextPanel(source){
  textPanelElement.src = source;

}

function showVideo(source){
  videoElement.src = source;
}

function setUpBtn(source){
  buttonElement.onclick = showTextPanel(source);
}


function calcDist(latlng){
  /*    var bahnhof = L.latLng(48.78222532064176, 9.18032169342041);*/
  /*bahnhof.distanceTo(playerPosition.getLatLng());*/
  /*distance.innerHTML = "Distance: " + bahnhofLatLng.distanceTo(latlng);*/
}


function onLocationError(e) {
  alert(e.message);
}


/*error callback*/
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
    x.innerHTML = "User denied the request for Geolocation."
    break;
    case error.POSITION_UNAVAILABLE:
    x.innerHTML = "Location information is unavailable."
    break;
    case error.TIMEOUT:
    x.innerHTML = "The request to get user location timed out."
    break;
    case error.UNKNOWN_ERROR:
    x.innerHTML = "An unknown error occurred."
    break;
  }
} 

/*successful callback*/
function showPosition(position) {
  /* Retrieve longitude and latitude from Position */
  var plon = position.coords.longitude;
  var plat = position.coords.latitude;

/*  x.innerHTML = "Latitude: " + plat + 
"<br>Longitude: " + plon;*/


}

/*var bahnhofLatLng = L.latLng(48.78222532064176, 9.18032169342041);
var bahnhof = L.circle(bahnhofLatLng, radius, {stroke:false, fill:false}).addTo(map);
L.marker(bahnhofLatLng).addTo(map);*/

function poi(latLng, showMarker, captured, currentPOI, nextPOI, videoPath, textPicturePath1, textPicturePath2, textPicturePath3, answerPicturePath, answers){
  this.latLng = latLng;
  this.geometry = L.circle(this.latLng, radius, {stroke:false, fill:false}).addTo(map);
  this.showMarker = showMarker;
  this.captured = captured;
  this.currentPOI = currentPOI;
  this.nextPOI = nextPOI;
  this.videoPath = videoPath;
  this.textPicturePath1 = textPicturePath1;
  this.textPicturePath2 = textPicturePath2;
  this.textPicturePath3 = textPicturePath3;
  this.answerPicturePath = answerPicturePath;
  this.answers = answers;
}

function initPOIs(){
  neuesSchloss = new poi(L.latLng(48.7781, 9.1814),
    false, false, false,
    metropol,
    null,
    "img/Panels/start/",
    null
    );
  metropol = new poi(L.latLng(48.7801, 9.1777),
    false, false, false,
    koenigsbau,
    "img/Metropol.mp4",
    "img/Panels/metropol/Metropol1.png",
    "img/Panels/metropol/Metropol2.png",
    "img/Panels/metropol/Metropol3.png",
    "img/Panels/metropol/MetropolFrage.png",
    /*fillAnswers({A, true,}, {B, false}, {C, false}, {D, false})*/ null
    );
  koenigsbau = new poi(L.latLng(48.7790, 9.1787),
    false, false, false,
    altesSchloss,
    "img/Königsbau.mp4",
    "img/Panels/koenigsbau/Koenigsbau1.png",
    /*fillAnswers({A, true,}, {B, false}, {C, false}, {D, false})*/ null
    );
  altesSchloss = new poi(L.latLng(48.7771, 9.1793),
    false, false, false,
    markthalle,
    "img/Altes Schloss.mp4",
    "img/Panels/schloss/Schloss1.png",
    null
    );
  markthalle = new poi(L.latLng(48.7761, 9.1788),
    false, false, false,
    hansBrunnen,
    "img/Markthalle.mp4",
    "img/Panels/markthalle/Marthalle1.png",
    null
    );
  hansBrunnen = new poi(L.latLng(48.7736, 9.1773),
    false, false, false,
    null,
    "img/Brunnen.mp4",
    "img/Panels/hansBrunnen/Brunnen1.png",
    null
    );

  poiList = [neuesSchloss,
  metropol,
  koenigsbau,
  altesSchloss,
  markthalle,
  hansBrunnen];
}

function drawMarkers(){
  for (var i = poiList.length - 1; i >= 0; i--) {
    L.marker(poiList[i].latLng).addTo(map);
    
  };
}

function fillAnswers({text1, bool1}, {text2, bool2}, {text3, bool3}, {text4, bool4}){
  this.one = {text1, bool1};
  this.two = {text2, bool2};
  this.three = {text3, bool3};
  this.four = {text4, bool4};
}