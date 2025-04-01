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
const guessTable = document.getElementById("guess_table");
const responseMessage = document.getElementById("response_message");

const correctColor = "rgb(96, 220, 0)";
const wrongColor = "rgb(238, 42, 0)";

let centerX;
let centerY;
let randomSeed = Math.floor(Math.random() * 4);
let originalScale;
let currentScale;

Promise.all([
    fetch("Objects/locationList.json").then(response => response.json()),
    fetch("Objects/locationSpecifications.json").then(response => response.json())
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
    dailyContinent = availableContinents[Math.floor(Math.random() * availableContinents.length)];
    dailyLocation = locationList[dailyContinent].locations[Math.floor(Math.random() * locationList[dailyContinent].locations.length)]
    locationsInArea = Object.keys(locationSpecifications[dailyLocation]);
    dailyLocationImage = locationsInArea[Math.floor(Math.random() * locationsInArea.length)];

    imageDiv.innerHTML = '<img src="Locations/' + dailyContinent + '/' + dailyLocationImage + '.jpg" id="dailyLocation">';
    centerX = locationSpecifications[dailyLocation][dailyLocationImage].centerX[randomSeed];
    centerY = locationSpecifications[dailyLocation][dailyLocationImage].centerY[randomSeed];
    originalScale = locationSpecifications[dailyLocation][dailyLocationImage].originalScale[randomSeed];
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

//called upon submit or enter -> reads input and adds tablerow (calling createRow(); function) when input == continent
function getInput() {
    //suggestionsContainer.innerHTML = '';
    let value = inputContent.value.toLowerCase();

    /*if (classGuessed) {
        getSkillInput();
        return;
    }*/

    for (let i = 0; i < availableContinents.length; i++) {
        let continentName = availableContinents[i];
        if (value === continentName.toLowerCase() /*&& !usedClasses.includes(value)*/) {
            if (guessTable.style.display === "none") {
                guessTable.style.display = "table";
            }
            createRow(i);
            //usedClasses.push(className.toLowerCase());
            break;
        }
    }

    inputContent.value = "";
    inputContent.focus();
}

//creates new tablerow for displaying guesses /*and enables the location name guess upon correct guess*/
function createRow(indexOfContinent) {

    let newRow = guessTable.insertRow(0);
    let continentGuess = availableContinents[indexOfContinent];

    let newCell = newRow.insertCell(0);

    newCell.innerHTML = continentGuess;
    // '<img src="Classes/' + classGuess + '.webp">' + classGuess;

    if (availableContinents[indexOfContinent] === dailyContinent) {
        newCell.style.backgroundColor = correctColor;
        //correctGuess();

        responseMessage.innerHTML = '<h2>Congratulations</h2>';

    } else newCell.style.backgroundColor = wrongColor;
}