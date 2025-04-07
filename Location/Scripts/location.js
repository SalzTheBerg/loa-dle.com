import { autocompleteInput, checkInput, correctGuess, fnv1aHash  } from "/LOA-dle/Modules/utilFunc.js";
import { correctColor, wrongColor, focusState, today } from "/LOA-dle/Modules/utilConsts.js";
import { setupInput } from "/LOA-dle/Modules/inputSetup.js";
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

            // TODO disable empty guess
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
                includesQuery: true,
                focusState: focusState
            });
        })
        .catch(error => console.error("Error loading character data:", error));
});

// Loads the daily image randomly and adding it to the DOM
function loadImg() {
    dailyContinent = availableContinents[hash % availableContinents.length];
    dailyArea = getAvailableAreas()[hash % getAvailableAreas().length];
    locationsInArea = Object.keys(locationSpecifications[dailyContinent][dailyArea]);
    dailyLocationImage = locationsInArea[hash % locationsInArea.length];

    image.innerHTML = '<img src="Continents/' + dailyContinent + '/' + dailyArea + '/' + dailyLocationImage + '.jpg" id="dailyLocation">';
    centerX = locationSpecifications[dailyContinent][dailyArea][dailyLocationImage].centerX[randomSeed];
    centerY = locationSpecifications[dailyContinent][dailyArea][dailyLocationImage].centerY[randomSeed];
    originalScale = locationSpecifications[dailyContinent][dailyArea][dailyLocationImage].originalScale[randomSeed];
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

        let dailyImageTag = '<img src="Continents/' + dailyContinent + '/' + dailyArea + '/' + dailyLocationImage + '.jpg" />';

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
    geoGuessMap.innerHTML = '<img src="Continents/' + dailyContinent + '/Maps/' + dailyArea + '.jpg" />';
    areaResponseMessage.innerHTML = '<h2>Do you also know where the image was taken?</h2><br><p>Click anywhere on the Map</p>';
    geoGuessInitializer(dailyContinent, dailyArea, dailyLocationImage);
}