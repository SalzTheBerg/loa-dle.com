let characterList = [];
let availableCharacterNames = [];

fetch("characterList.json")
    .then(response => response.json())
    .then(data => {
        characterList = data;
        availableCharacterNames = characterList.map(character => character.name);
        availableCharacterNames.sort();
    })
    .catch(error => console.error("Error loading character data:", error));

const guessTable = document.getElementById("guess_table");
const inputField = document.getElementById("input_guess");
const usedCharacters = [];

const correctColor = "rgb(96, 220, 0)";
const partialMatchColor = "rgb(225, 225, 0)";
const wrongColor = "rgb(238, 42, 0)";

var characterToGuess = null;

function getDailyCharacter() {
    const today = new Date().toISOString().split('T')[0];
    const hash = fnv1aHash(today);
    return characterList[hash % characterList.length];
}

function fnv1aHash(today) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < today.length; i++) {
        hash ^= today.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0;
    }
    console.log(hash);
    return hash;
}

function createRow(indexOfChar) {
    characterToGuess = getDailyCharacter();

    var table = document.getElementById("guess_table")
    var newRow = table.insertRow(1);
    let character = characterList[indexOfChar];

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
}

function getInput() {
    //clearing suggestion container
    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';

    let inputContent = document.getElementById("input_guess");
    let value = inputContent.value.toLowerCase();

    for (let i = 0; i < characterList.length; i++) {
        let character = characterList[i];
        if (value === character.name.toLowerCase() && !usedCharacters.includes(value)) {
            if (guessTable.style.display === "none") {
                guessTable.style.display = "table";
            }
            createRow(i);
            usedCharacters.push(character.name.toLowerCase());
            break;
        }
    }

    inputField.value = "";
}

inputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        let query = this.value.toLowerCase();

        if (query === '') {
            return;
        }

        let suggestions = availableCharacterNames.filter(name => name.toLowerCase().startsWith(query));
        removeItem(availableCharacterNames, suggestions[0]);

        if (suggestions.length > 0) {
            this.value = suggestions[0];
        }
        document.getElementById("input_submit").click();
    }
});

inputField.addEventListener("input", function () {
    let query = this.value.toLowerCase();
    let suggestions = availableCharacterNames.filter(name => name.toLowerCase().startsWith(query));

    if (query === '') {
        document.getElementById("suggestions").innerHTML = '';
        return;
    }

    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';


    suggestions.forEach(suggestion => {
        let suggestionItem = document.createElement("div");
        suggestionItem.classList.add('suggestion-item')
        suggestionItem.innerHTML = '<img src="Icons/' + suggestion + '.webp">' + suggestion;
        suggestionsContainer.appendChild(suggestionItem);
    });
});

function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
}