import { today, focusState, correctColor, wrongColor, partialMatchColor } from "/LOA-dle/Modules/utilConsts.js";
import { fnv1aHash, autocompleteInput, checkInput, correctGuess } from "/LOA-dle/Modules/utilFunc.js";
import { setupInput } from "/LOA-dle/Modules/inputSetup.js";
import { createHeader, createParagraph } from "/LOA-dle/Modules/utilDOM.js";

// Uninitialized Variables
let characterList = [];
let availableCharacterNames = [];
let characterToGuess;

// Consts
const hash = fnv1aHash(today);

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
            availableCharacterNames = characterList.map(character => character.name);
            availableCharacterNames.sort();

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
    characterToGuess = characterList[hash % characterList.length];
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
    let characterName = availableCharacterNames[indexOfChar];

    let newRow = guessTable.insertRow(1);
    let character = characterList.find(c => c.name === characterName);

    let attributes = ["name", "gender", "race", "region", "occupation", "affinity", "status"]
    let newCell = newRow.insertCell(0);
    let image = character.name + ".webp";
    newCell.style.backgroundImage = "url('Icons/" + image + "')";

    for (let i = 1; i < 7; i++) {
        let newCell = newRow.insertCell(i);

        let attributeName = attributes[i];

        if(character[attributeName] === characterToGuess[attributeName] || JSON.stringify(character[attributeName]) === JSON.stringify(characterToGuess[attributeName])) {
            newCell.style.backgroundColor = correctColor;
        } else if(character[attributeName].constructor === Array && character[attributeName].some(item => characterToGuess[attributeName].includes(item))) {
            newCell.style.backgroundColor = partialMatchColor;
        } else {
            newCell.style.backgroundColor = wrongColor;
        }

        if(character[attributeName].constructor === Array){
            newCell.innerHTML = character[attributeName].join(",<br>");
        } else {
            newCell.innerHTML = character[attributeName];
        }
    }
    if (characterToGuess === character) {
        const img = document.createElement('img');
        img.src = 'Icons/' + character.name + '.webp';
        let h2 = 'Congratulations!';
        let p = "You've guessed the daily character, you can check out the other modes or come back tomorrow.";

        responseMessage.prepend(img);
        createHeader(h2, 2, responseMessageText);
        createParagraph(p, responseMessageText);

        correctGuess(gameContainer, responseContainer, responseMessage);
    }
}