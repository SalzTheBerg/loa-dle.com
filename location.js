let locationList = [];
let availableContinents = [];

let dailyContinent;
let dailyLocation;
let dailyImage;

const imageDiv = document.getElementById("guess_image");

//fetches the location list and stores into locationList array
fetch("locationList.json")
    .then(response => response.json())
    .then(data => {
        locationList = data;
        availableContinents = Object.keys(locationList);
        availableContinents.sort();
        console.log(availableContinents);
        console.log(locationList[availableContinents[0]].locations);
        loadImg();
    })
    .catch(error => console.error("Error loading location data:", error));

//loads the daily image randomly and adding it to the DOM
function loadImg() {
    dailyContinent = availableContinents[Math.floor(Math.random() * availableContinents.length)];
    dailyLocation = locationList[dailyContinent].locations[Math.floor(Math.random() * locationList[dailyContinent].locations.length)]
    alert("Still in progress, doesn't work yet");

    imageDiv.innerHTML = '<img src="Locations/' + dailyContinent + '_' + dailyLocation + '.webp" id="dailyLocation">';
    dailyImage = document.getElementById("dailyLocation");
}