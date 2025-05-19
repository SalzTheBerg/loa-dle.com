import { today, focusState, correctColor, wrongColor, partialMatchColor, arrowUp, arrowDown } from "../../Modules/utilConsts.js";
import { fnv1aHash, autocompleteInput, checkInput, correctGuess } from "../../Modules/utilFunc.js";
import { setupInput } from "../../Modules/inputSetup.js";
import { createHeader, createParagraph } from "../../Modules/utilDOM.js";
//import { characterOrder } from "./consts.js";

// Uninitialized Variables
let characterList = [];
let availableCharacterNames = [];
let characterToGuess;

let guessAmount = 0;
let correctAttributes = 0;
let hintUnlocked = false;

let existingScore = null;
let existingCharacterGuesses = null;
let saveCharacters = true;

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
const hint = document.getElementById("hint");

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

            loadClassicSave();
        })
        .catch(error => console.error("Error fetching character:", error));
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

    const el = document.getElementById("removeOnGuess");
    if (el) {
        el.remove();
    }

    let guess = availableCharacterNames[indexOfChar];
    let newRow = guessTable.insertRow(1);

    const guessChar = characterList[guess];
    const targetChar = characterList[characterToGuess];

    guessAmount++;
    if (saveCharacters) {
        saveCharacterGuess(guess);
    }
    
    if (5 - guessAmount === 0) {
        hint.innerHTML = '<button id="unlockHint" class="button" style="height: 30px;">Unlock hint';
        document.getElementById("unlockHint").addEventListener("click", function() {
            hint.innerHTML = "Card Description: " + targetChar["Hint"];
            hintUnlocked = true;
            saveHintUnlocked();
        });
        if (hintUnlocked === true) {
            document.getElementById("unlockHint").click();
        }
    } else if (guessAmount > 0) hint.innerHTML = "Hint unlocked in: " + (5 - guessAmount) + " guesses";

    let attributes = ["Gender", "Race", "First Appearance", "Affinity", "Card Rarity", "Height", "Status"];
    let newCell = newRow.insertCell(0);
    let image = guess + ".webp";
    newCell.style.backgroundImage = "url('Icons/" + image + "')";

    for (let i = 0; i < 7; i++) {
        let newCell = newRow.insertCell(i + 1);
        newCell.classList.add("cellHidden");
        let attributeName = attributes[i];

        if(guessChar[attributeName] === targetChar[attributeName] || JSON.stringify(guessChar[attributeName]) === JSON.stringify(targetChar[attributeName])) {
            newCell.style.backgroundColor = correctColor;
            correctAttributes++;
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
            }/* else {
                let x = characterOrder[guessChar[attributeName]];
                if (x.indexOf(guess) > x.indexOf(characterToGuess)) {
                    newCell.innerHTML += arrowDown;
                } else if (x.indexOf(guess) < x.indexOf(characterToGuess)) {
                    newCell.innerHTML += arrowUp;
                }
            }*/
            if (guessChar.Continent === targetChar.Continent && !(guessChar[attributeName] === targetChar[attributeName] || JSON.stringify(guessChar[attributeName]) === JSON.stringify(targetChar[attributeName]))) {
                newCell.style.backgroundColor = partialMatchColor;
            }
        }

        if (saveCharacters) {
        setTimeout(() => {
            newCell.classList.remove("cellHidden");
            newCell.classList.add("animatedCell");
            }, i * 350);
        } else {
            newCell.classList.remove("cellHidden");
        }
        if (i === attributes.length - 1) {
            const onGuessCorrect = () => {
                if (characterToGuess === guess) {
                    document.getElementById("guide").style.display = "none";
                    const img = document.createElement('img');
                    img.src = 'Icons/' + guess + '.webp';
                    let h2 = 'Congratulations!';
                    let p = "You've guessed the daily character, you can check out the other modes or come back tomorrow.";

                    responseMessage.prepend(img);
                    createHeader(h2, 2, responseMessageText);
                    createParagraph(p, responseMessageText);

                    correctGuess(gameContainer, responseContainer, responseMessage);
                    getScore();
                }
            };

            if (saveCharacters) {
                newCell.addEventListener("animationend", onGuessCorrect, { once: true });
            } else {
                onGuessCorrect();
            }
        }
    }
}

function getScore() {
    if (existingScore !== null && existingScore !== 0) {
        const scoreElement = document.getElementById('scoreClassic');
        scoreElement.textContent = `Your score for the classic mode today: ${existingScore}`;

        getRanking(existingScore);
        return;
    }

    const data = {
        guesses: guessAmount,
        correctAttributes: correctAttributes,
        hintUnlocked: hintUnlocked
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
        const scoreElement = document.getElementById('scoreClassic');
        if (scoreElement) {
            scoreElement.textContent = `Your score for the classic mode today: ${response.score}`;

            getRanking(response.score);
        }
    })
    .catch(error => console.error('Fehler:', error));
}

function getRanking(score) {
    const data = {
        score: score
    };

    fetch('Scripts/getClassicRanking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        const rankingElement = document.getElementById('rankingClassic');
        rankingElement.innerHTML = `<hr class="underline" style="background-color: rgb(255, 202, 87);">
  You're in the <span style="color: rgb(82, 220, 255);">top ${response.percentage}%</span> of 
  <span style="color: rgb(82, 220, 255)">${response.all}</span> classic players today.`;
    })
    .catch(error => console.error('error:', error));
}

function saveCharacterGuess(guess) {
    const data = {
        guess: guess
    };

    fetch('./Scripts/saveCharacterGuess.php', {
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

function saveHintUnlocked() {
    const data = {
        hintUnlocked: hintUnlocked
    };

    fetch('./Scripts/saveHintUnlocked.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .catch(error => {
        console.error('Error saving hint:', error);
    });
}

function loadClassicSave() {
    fetch("./Scripts/loadClassicSave.php")
        .then(response => response.json())
        .then(data => {
            existingScore = data.score,
            existingCharacterGuesses = data.guessedCharacters,
            hintUnlocked = data.hintUnlocked

            if (existingCharacterGuesses !== null) {
                hintUnlocked = Boolean(hintUnlocked);
                saveCharacters = false;
                guessTable.style.display = "table";
                const array = JSON.parse(existingCharacterGuesses);
                array.forEach(guess => {
                    characterInputContent.value = guess;
                    readInput();
                });
                saveCharacters = true;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}