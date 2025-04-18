import { autocompleteInput, checkInput, correctGuess, fnv1aHash  } from "/LOA-dle/Modules/utilFunc.js";
import { correctColor, wrongColor, focusState, today } from "/LOA-dle/Modules/utilConsts.js";
import { setupInput } from "/LOA-dle/Modules/inputSetup.js";
import { createParagraph, createHeader } from "/LOA-dle/Modules/utilDOM.js";
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
const randomSeed = hash % 4;

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

        if (this.innerHTML === dailyArea) {
            this.style.backgroundColor = correctColor;
            this.style.color = "black";
            areaResponseContainer.style.display = "block";
            prepareGeoguesser();
        } else this.style.backgroundColor = wrongColor;
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
    };
}