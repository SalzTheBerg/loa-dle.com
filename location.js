let locationList = [];
let availableContinents = [];
let locationSpecifications = [];

let dailyContinent;
let dailyLocation;
let locationsInArea;
let dailyLocationImage;
let dailyImage;

const imageDiv = document.getElementById("location_image");
const inputContent = document.getElementById("input_guess");

let centerX;
let centerY;
let randomSeed = Math.floor(Math.random() * 4);
let originalScale;
let currentScale;

Promise.all([
    fetch("locationList.json").then(response => response.json()),
    fetch("locationSpecifications.json").then(response => response.json())
])
    .then(([locationsData, specificationsData]) => {
    locationList = locationsData;
    availableContinents = Object.keys(locationList);
    availableContinents.sort();
    locationSpecifications = specificationsData;
    loadImg();
    })
.catch(error => console.error("Error loading data:", error));

//loads the daily image randomly and adding it to the DOM
function loadImg() {
    dailyContinent = "Arthetine"//availableContinents[Math.floor(Math.random() * availableContinents.length)];
    dailyLocation = "Origins of Stern"//locationList[dailyContinent].locations[Math.floor(Math.random() * locationList[dailyContinent].locations.length)]
    locationsInArea = Object.keys(locationSpecifications[dailyLocation]);
    dailyLocationImage = "Origins of Stern_2"//locationsInArea[Math.floor(Math.random() * locationsInArea.length)];

    imageDiv.innerHTML = '<img src="Locations/' + dailyContinent + '_' + dailyLocationImage + '.jpg" id="dailyLocation">';
    centerX = -1600;//locationSpecifications[dailyLocation][dailyLocationImage].centerX[randomSeed];
    centerY = 100;//locationSpecifications[dailyLocation][dailyLocationImage].centerY[randomSeed];
    originalScale = 7;//locationSpecifications[dailyLocation][dailyLocationImage].originalScale[randomSeed];
    currentScale = originalScale;
    dailyImage = document.getElementById("dailyLocation");
    dailyImage.style.transform = "translate(" + centerX + "px, " + centerY + "px) scale(" + originalScale + ")";
}

inputContent.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
        if (currentScale > 1) {
            currentScale = currentScale * 0.85;
            if (currentScale < 1) {
                currentScale = 1;
            }

            let newX = centerX * ((currentScale - 1) / (originalScale - 1));
            let newY = centerY * ((currentScale - 1) / (originalScale - 1));

            dailyImage.style.transform = "translate(" + newX + "px, " + newY + "px) scale(" + currentScale + ")";
        }
    }
})