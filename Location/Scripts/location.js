import { autocompleteInput, checkInput, correctGuess, fnv1aHash  } from "../../Modules/utilFunc.js";
import { correctColor, wrongColor, focusState, today } from "../../Modules/utilConsts.js";
import { setupInput } from "../../Modules/inputSetup.js";
import { createParagraph, createHeader } from "../../Modules/utilDOM.js";
import { geoGuessInitializer } from "./geoGuess.js";

// Uninitialized Variables
let availableContinents = [];
let locationSpecifications = [];

let dailyContinent;
let dailyArea;
let locationsInArea;
let dailyLocationImage;
let dailyImage;

let centerX;
let centerY;
let originalScale;
let currentScale;

let correctAreaInput = false;
let continentGuessAmount = 0;
let areaGuessAmount = 0;

let existingScore = null;
let existingContinentGuesses = null;
let existingAreaGuesses = null;
let existingX = null;
let existingY = null;
let saveContinents = true;
let saveAreas = true;

// Consts
const hash = fnv1aHash(today);
const randomSeed = hash % 4;
const randomSeedTesting = Math.floor(Math.random() * 4);

// Id selectors
const guessTable = document.getElementById("guessTable");
const image = document.getElementById("locationImage");

const continentInputContainer = document.getElementById("continentInputContainer");
const continentInputContent = document.getElementById("continentInputContent");
const continentInputSubmit = document.getElementById("continentInputSubmit");
const continentSuggestionsContainer = document.getElementById("continentSuggestions");

const areaInputDiv = document.getElementById("areaInputDiv");

const continentResponseContainer = document.getElementById("continentResponseContainer");
const continentResponseMessage = document.getElementById("continentResponseMessage");

const areaResponseContainer = document.getElementById("areaResponseContainer");
const areaResponseMessage = document.getElementById("areaResponseMessage");
const geoGuessMap = document.getElementById("geoGuessMap");

// Getter functions for changing values
function getAvailableContinents() {
    return availableContinents;
}
function getAvailableAreas() {
    return Object.keys(locationSpecifications[dailyContinent]);
}
export function getLocationSpecifications() {
    return locationSpecifications;
}

// Dom Content loaded
document.addEventListener("DOMContentLoaded", () => {

    fetch("Objects/locationSpecifications.json")
        .then(response => response.json())
        .then(data => {
            locationSpecifications = data;
            availableContinents = Object.keys(locationSpecifications);
            availableContinents.sort();

            loadImg();

            // Setup event listeners
            // Continent input
            setupInput({
                inputField: continentInputContent,
                submitButton: continentInputSubmit,
                suggestionsContainer: continentSuggestionsContainer,
                readFunction: readContinentInput,
                getAvailableAnswers: getAvailableContinents,
                includesQuery: true,
                focusState: focusState
            });
        })
        .catch(error => console.error("Error loading character data:", error));
});

// Loads the daily image randomly and adding it to the DOM
function loadImg() {
    fetch("./Scripts/getDailyLocation.php")
        .then(response => response.json())
        .then(data => {
            dailyContinent = data.continentName;
            dailyArea = data.areaName;
            dailyLocationImage = data.imageName;
            locationsInArea = Object.keys(locationSpecifications[dailyContinent][dailyArea]);
            image.innerHTML = '<img src="Continents/' + dailyContinent + '/' + dailyArea + '/' + dailyLocationImage + '.jpg" id="dailyLocation">';

            centerX = data.centerX;
            centerY = data.centerY;
            originalScale = data.originalScale;
            currentScale = originalScale;
            dailyImage = document.getElementById("dailyLocation");
            dailyImage.style.transform = "translate(" + centerX + "px, " + centerY + "px) scale(" + originalScale + ")";

            loadLocationSave();
        })
    .catch(error => console.error('Error fetching data:', error));
    
    /*dailyContinent = "Rethramis";
    dailyArea = "Rethramis Border";
    dailyLocationImage = "Rethramis Border_3";
    locationsInArea = Object.keys(locationSpecifications[dailyContinent][dailyArea]);

    image.innerHTML = '<img src="Continents/' + dailyContinent + '/' + dailyArea + '/' + dailyLocationImage + '.jpg" id="dailyLocation">';
    centerX = 1700//locationSpecifications[dailyContinent][dailyArea][dailyLocationImage].centerX[randomSeedTesting];
    centerY = 0//locationSpecifications[dailyContinent][dailyArea][dailyLocationImage].centerY[randomSeedTesting];
    originalScale = 7;//locationSpecifications[dailyContinent][dailyArea][dailyLocationImage].originalScale[randomSeedTesting];
    currentScale = originalScale;
    dailyImage = document.getElementById("dailyLocation");
    dailyImage.style.transform = "translate(" + centerX + "px, " + centerY + "px) scale(" + originalScale + ")";*/
}

function readContinentInput() {
    continentSuggestionsContainer.style.border = "none";

    let autocomplete = autocompleteInput({
            inputContent: continentInputContent,
            availableAnswers: getAvailableContinents(),
            focusState: focusState,
            includesQuery: true,
            suggestionsContainer: continentSuggestionsContainer
    });

    checkInput({
            availableAnswers: getAvailableContinents(),
            input: autocomplete,
            guessTable: guessTable,
            callback: createRow,
            focusState
    });

    continentInputContent.value = "";
    continentInputContent.focus();
}

function createRow(indexOfContinent) {
    let newRow = guessTable.insertRow(0);
    let continentGuess = availableContinents[indexOfContinent];

    continentGuessAmount++;
    if (saveContinents) {
    saveContinentGuess(continentGuess);
    }

    let newCell = newRow.insertCell(0);
    newCell.innerHTML = continentGuess;

    if (availableContinents[indexOfContinent] === dailyContinent) {
        newCell.style.backgroundColor = correctColor;

        const img = new Image();
        img.src = 'Continents/' + dailyContinent + '/' + dailyArea + '/' + dailyLocationImage + '.jpg';
        let h2 = 'Congratulations';
        let p = 'Can you also guess the zone name?';

        continentResponseMessage.appendChild(img);
        createHeader(h2, 2, continentResponseMessage);
        createParagraph(p, continentResponseMessage);

        img.onload = () => {
            correctGuess(continentInputContainer, continentResponseContainer, continentResponseMessage);
            prepareAreaGuess();
        }

    } else {
        newCell.style.backgroundColor = wrongColor;
    }

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

function readAreaInput() {
        if (correctAreaInput) {
            return;
        }
        areaGuessAmount++;
        if (saveAreas) {
            saveAreaGuess(this.innerHTML);
        }

        if (this.innerHTML === dailyArea) {
            this.style.backgroundColor = correctColor;
            this.style.color = "black";
            areaResponseContainer.style.display = "block";
            prepareGeoguesser();
            correctAreaInput = true;
        } else {
            this.style.backgroundColor = wrongColor;
            this.style.color = "black";
        }
}

function prepareAreaGuess() {
    getAvailableAreas().forEach(element => {
        let x = document.createElement('button');
        let y = document.createTextNode(element);
        x.appendChild(y);
        x.classList.add("button")
        x.addEventListener("click", readAreaInput);
        areaInputDiv.appendChild(x);
    });

    if (existingAreaGuesses !== null) {
        saveAreas = false;
        let buttons = document.getElementsByClassName("button");
        const array = JSON.parse(existingAreaGuesses);
        array.forEach(guess => {
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].innerHTML === guess) {
                    buttons[i].click();
                }
            }
        });
        saveAreas = true;
    }
}

function prepareGeoguesser() {
    const img = new Image();
    img.src = 'Continents/' + dailyContinent + '/Maps/' + dailyArea + '.jpg';

    img.onload = () => {
        geoGuessMap.innerHTML = '';
        geoGuessMap.appendChild(img);

        let h2 = 'Do you also know where the image was taken?';
        let p = 'Click anywhere on the Map';
        
        createHeader(h2, 2, areaResponseMessage);
        createParagraph(p, areaResponseMessage);

        geoGuessInitializer(dailyContinent, dailyArea, dailyLocationImage);

        geoGuessMap.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        if (existingX !== null && existingY !== null) {
            const geoGuessMap = document.getElementById("geoGuessMap");
            const event = new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: geoGuessMap.getBoundingClientRect().left + existingX,
                clientY: geoGuessMap.getBoundingClientRect().top + existingY
            });
            geoGuessMap.dispatchEvent(event);
        }
    };
}

document.addEventListener('distanceCalculated', function(e) {
    if (existingScore !== null && existingScore !== 0) {
        const scoreElement = document.getElementById('scoreLocation');
        scoreElement.textContent = `Your score for the location mode today: ${existingScore}`;

        getRanking(existingScore);
        return;
    }

    const data = {
        continentGuesses: continentGuessAmount,
        areaGuesses: areaGuessAmount,
        areaAmount: getAvailableAreas().length,
        distance: e.detail
    };

    fetch('./Scripts/getScore.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        const scoreElement = document.getElementById('scoreLocation');
        scoreElement.textContent = `Your score for the location mode today: ${response.score}`;

        getRanking(response.score);
    })
    .catch(error => console.error('error:', error));
});

function getRanking(score) {
    const data = {
        score: score
    };

    fetch('Scripts/getLocationRanking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        const rankingElement = document.getElementById('rankingLocation');
        rankingElement.innerHTML = `<hr class="underline" style="background-color: rgb(255, 202, 87);">
  You're in the <span style="color: rgb(82, 220, 255);">top ${response.percentage}%</span> of 
  <span style="color: rgb(82, 220, 255)">${response.all}</span> location players today.`;
    })
    .catch(error => console.error('error:', error));
}

function saveContinentGuess(guess) {
    const data = {
        guess: guess
    };

    fetch('./Scripts/saveContinentGuess.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .catch(error => {
        console.error('Error saving guess:', error);
    });
}

function saveAreaGuess(guess) {
    const data = {
        guess: guess
    };

    fetch('./Scripts/saveAreaGuess.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .catch(error => {
        console.error('Error saving guess:', error);
    });
}

function loadLocationSave() {
    fetch("./Scripts/loadLocationSave.php")
        .then(response => response.json())
        .then(data => {
            existingScore = data.score,
            existingContinentGuesses = data.guessedContinents,
            existingAreaGuesses = data.guessedAreas,
            existingX = data.x,
            existingY = data.y

            if (existingContinentGuesses !== null) {
                saveContinents = false;
                guessTable.style.display = "table";
                const array = JSON.parse(existingContinentGuesses);
                array.forEach(guess => {
                    continentInputContent.value = guess;
                    readContinentInput();
                });
                saveContinents = true;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}