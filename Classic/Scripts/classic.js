import { today, focusState, correctColor, wrongColor, partialMatchColor, arrowUp, arrowDown } from "../../Modules/utilConsts.js";
import { fnv1aHash, autocompleteInput, checkInput, correctGuess } from "../../Modules/utilFunc.js";
import { setupInput } from "../../Modules/inputSetup.js";
import { createHeader, createParagraph } from "../../Modules/utilDOM.js";
import { characterOrder } from "./consts.js";

// Uninitialized Variables
let characterList = [];
let availableCharacterNames = [];
let characterToGuess;

// Consts
const hash = fnv1aHash(today);
//remove once dict is done
const areasInOrder = ["Trixion", "Trua, the Forgotten Land", "Rethramis", "Yudia", "West Luterra", "East Luterra", "Tortoyk", "Anikka", "Arthetine", "North Vern", "Shushire", "Rohendel", "Yorn", "Feiton", "Whispering Islet", "Illusion Bamboo Island", "Punika", "Isteri", "South Vern", "Rowen", "Elgacia", "Pleccia", "Voldis", "South Kurzan", "North Kurzan", "South Rimeria", "North Rimeria"];

// Id selectors
const guessTable = document.getElementById("guessTable");
const gameContainer = document.getElementById("gameContainer");

const characterInputContent = document.getElementById("characterInputContent");
const characterInputSubmit = document.getElementById("characterInputSubmit");
const suggestionsContainer = document.getElementById("characterSuggestions");
const responseMessage = document.getElementById("responseMessage");
const responseMessageText = document.getElementById("responseMessageText");

// Getter functions for changing values
function getAvailableCharacterNames() {
    return availableCharacterNames;
}

// Dom Content loaded
document.addEventListener("DOMContentLoaded", () => {

    // Fetch for jsons
    fetch("Objects/characterList.json")
        .then(response => response.json())
        .then(data => {
            characterList = data;
            availableCharacterNames = Object.keys(characterList);
            //availableCharacterNames.sort();

            console.log(characterList);
            console.log(availableCharacterNames);

            getDailyCharacter();

            // Setup event listener
            setupInput({
                inputField: characterInputContent,
                submitButton: characterInputSubmit,
                suggestionsContainer: suggestionsContainer,
                readFunction: readInput,
                getAvailableAnswers: getAvailableCharacterNames,
                includesQuery: false,
                path: 'Icons/',
                focusState: focusState
            });
        })
        .catch(error => console.error("Error loading character data:", error));
});


// Initializes the daily Character to the characterToGuess variable
function getDailyCharacter() {
    fetch("./Scripts/getDailyCharacter.php")
        .then(response => response.json())
        .then(data => {
            characterToGuess = data.characterToGuess;
            alert(availableCharacterNames.length);
        })
        .catch(error => console.error("Error fetching character:", error));

    //Test for regions
    let x;
    for (let checkCharacter in availableCharacterNames) {
        x = characterOrder[characterList[availableCharacterNames[checkCharacter]]["First Appearance"]];
        if (Array.isArray(x) && x.length > 0) {
            if (!x.includes(availableCharacterNames[checkCharacter])) {
                console.log("Character: " + availableCharacterNames[checkCharacter] + " is not right in consts");
            }
        }
    }
}

// Handles logic for character Guessing
function readInput () {
    suggestionsContainer.style.border = "none";

    let autocomplete = autocompleteInput({
        inputContent: characterInputContent,
        availableAnswers: getAvailableCharacterNames(),
        focusState: focusState,
        includesQuery: false,
        suggestionsContainer: suggestionsContainer
    });

    checkInput({
        availableAnswers: getAvailableCharacterNames(),
            input: autocomplete,
            guessTable: guessTable,
            callback: createRow,
            focusState
    });

    characterInputContent.value = "";
    characterInputContent.focus();
}

// Creates a tablerow and checks if its the correct guess
function createRow(indexOfChar) {
    let guess = availableCharacterNames[indexOfChar];
    let newRow = guessTable.insertRow(1);

    const guessChar = characterList[guess];
    const targetChar = characterList[characterToGuess];

    let attributes = ["Gender", "Race", "First Appearance", "Affinity", "Card Rarity", "Height", "Status"];
    let newCell = newRow.insertCell(0);
    let image = guess + ".webp";
    newCell.style.backgroundImage = "url('Icons/" + image + "')";

    for (let i = 0; i < 7; i++) {
        let newCell = newRow.insertCell(i + 1);
        let attributeName = attributes[i];

        if(guessChar[attributeName] === targetChar[attributeName] || JSON.stringify(guessChar[attributeName]) === JSON.stringify(targetChar[attributeName])) {
            newCell.style.backgroundColor = correctColor;
        } else if(guessChar[attributeName].constructor === Array && guessChar[attributeName].some(item => targetChar[attributeName].includes(item))) {
            newCell.style.backgroundColor = partialMatchColor;
        } else {
            newCell.style.backgroundColor = wrongColor;
        }

        if(guessChar[attributeName].constructor === Array){
            newCell.innerHTML = guessChar[attributeName].join(",<br>");
        } else {
            newCell.innerHTML = guessChar[attributeName];
        }

        if (attributeName == "First Appearance") {
            if (areasInOrder.indexOf(guessChar[attributeName]) > areasInOrder.indexOf(targetChar[attributeName])) {
                newCell.innerHTML += arrowDown;
            } else if (areasInOrder.indexOf(guessChar[attributeName]) < areasInOrder.indexOf(targetChar[attributeName])) {
                newCell.innerHTML += arrowUp;
            } else {
                let x = characterOrder[guessChar[attributeName]];
                if (x.indexOf(guess) > x.indexOf(characterToGuess)) {
                    newCell.innerHTML += arrowDown;
                } else if (x.indexOf(guess) < x.indexOf(characterToGuess)) {
                    newCell.innerHTML += arrowUp;
                }
            }
            if (guessChar.Continent === targetChar.Continent && !(guessChar[attributeName] === targetChar[attributeName] || JSON.stringify(guessChar[attributeName]) === JSON.stringify(targetChar[attributeName]))) {
                newCell.style.backgroundColor = partialMatchColor;
            }
        }
    }
    if (characterToGuess === guess) {
        const img = document.createElement('img');
        img.src = 'Icons/' + guess + '.webp';
        let h2 = 'Congratulations!';
        let p = "You've guessed the daily character, you can check out the other modes or come back tomorrow.";

        responseMessage.prepend(img);
        createHeader(h2, 2, responseMessageText);
        createParagraph(p, responseMessageText);

        correctGuess(gameContainer, responseContainer, responseMessage);
    }
}