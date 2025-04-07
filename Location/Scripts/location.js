import { autocompleteInput, checkInput, correctGuess, fnv1aHash  } from "/LOA-dle/Modules/utilFunc.js";
import { correctColor, wrongColor, focusState, today } from "/LOA-dle/Modules/utilConsts.js";
import { setupInput } from "/LOA-dle/Modules/inputSetup.js";

// Uninitialized Variables
let locationList = [];
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

// Consts
const hash = fnv1aHash(today);
const randomSeed = Math.floor(Math.random() * 4);

// Id selectors
const guessTable = document.getElementById("guessTable");
const image = document.getElementById("locationImage");

const continentInputContainer = document.getElementById("continentInputContainer");
const continentInputContent = document.getElementById("continentInputContent");
const continentInputSubmit = document.getElementById("continentInputSubmit");
const continentSuggestionsContainer = document.getElementById("continentSuggestions");

const areaInputContainer = document.getElementById("areaInputContainer");
const areaInputContent = document.getElementById("areaInputContent");
const areaInputSubmit = document.getElementById("areaInputSubmit");
const areaSuggestionsContainer = document.getElementById("areaSuggestions");

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
    return locationList[dailyContinent].areas;
}

// Dom Content loaded
document.addEventListener("DOMContentLoaded", () => {
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

        // Setup event listeners
        // Continent input
        setupInput({
            inputField: continentInputContent,
            submitButton: continentInputSubmit,
            suggestionsContainer: continentSuggestionsContainer,
            readFunction: readContinentInput,
            getAvailableAnswers: getAvailableContinents,
            includesQuery: false,
            focusState: focusState
        });

        // Area input
        setupInput({
            inputField: areaInputContent,
            submitButton: areaInputSubmit,
            suggestionsContainer: areaSuggestionsContainer,
            readFunction: readAreaInput,
            getAvailableAnswers: getAvailableAreas,
            includesQuery: false,
            focusState: focusState
        });
    })
    .catch(error => console.error("Error loading data:", error));

});

// Loads the daily image randomly and adding it to the DOM
function loadImg() {
    dailyContinent = availableContinents[hash % availableContinents.length];
    dailyArea = locationList[dailyContinent].areas[hash % locationList[dailyContinent].areas.length];
    locationsInArea = Object.keys(locationSpecifications[dailyArea]);
    dailyLocationImage = locationsInArea[hash % locationsInArea.length];

    image.innerHTML = '<img src="Continents/' + dailyContinent + '/' + dailyLocationImage + '.jpg" id="dailyLocation">';
    centerX = locationSpecifications[dailyArea][dailyLocationImage].centerX[randomSeed];
    centerY = locationSpecifications[dailyArea][dailyLocationImage].centerY[randomSeed];
    originalScale = locationSpecifications[dailyArea][dailyLocationImage].originalScale[randomSeed];
    currentScale = originalScale;
    dailyImage = document.getElementById("dailyLocation");
    dailyImage.style.transform = "translate(" + centerX + "px, " + centerY + "px) scale(" + originalScale + ")";
}

function readContinentInput() {
    continentSuggestionsContainer.style.border = "none";

    let autocomplete = autocompleteInput({
            inputContent: continentInputContent,
            availableAnswers: getAvailableContinents(),
            focusState: focusState,
            includesQuery: false,
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

    let newCell = newRow.insertCell(0);
    newCell.innerHTML = continentGuess;

    if (availableContinents[indexOfContinent] === dailyContinent) {
        newCell.style.backgroundColor = correctColor;
        correctGuess(continentInputContainer, continentResponseContainer);

        let dailyImageTag = '<img src="Continents/' + dailyContinent + '/' + dailyLocationImage + '.jpg" />';

        continentResponseMessage.innerHTML = dailyImageTag + '<h2>Congratulations</h2><p>Can you also guess the zone name?</p>';

        // ???? TODO scheinbar geht es nicht anders
        continentResponseMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })

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
    areaSuggestionsContainer.style.border = "none";

    let autocomplete = autocompleteInput({
        inputContent: areaInputContent,
        availableAnswers: getAvailableAreas(),
        focusState: focusState,
        includesQuery: false,
        suggestionsContainer: areaSuggestionsContainer
    });

    areaInputContent.value = autocomplete;

    if (areaInputContent.value.toLowerCase() === dailyArea.toLowerCase()) {
        correctGuess(areaInputContainer, areaResponseContainer);

        // ???? TODO scheinbar geht es nicht anders
        geoGuessMap.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        prepareGeoguesser();
    }
}

function prepareGeoguesser() {
    geoGuessMap.innerHTML = '<img src="Continents/' + dailyContinent + '/Maps/' + dailyLocationImage + '.webp" />';
    areaResponseMessage.innerHTML = '<h2>Do you also know where the image was taken?</h2><br><p>Click anywhere on the Map</p><br><h1>Still WIP be patient pls</h1>'
}