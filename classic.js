let characterList = [];
let availableCharacterNames = [];
const usedCharacters = [];

const inputContent = document.getElementById("input_guess");
const inputSubmit = document.getElementById("input_submit");
const inputDiv = document.getElementById("input_div");
const guessTable = document.getElementById("guess_table");
const responseMessage = document.getElementById("response_message");

const correctColor = "rgb(96, 220, 0)";
const partialMatchColor = "rgb(225, 225, 0)";
const wrongColor = "rgb(238, 42, 0)";

let characterToGuess;
let currentFocus;
let focusActive = false;

//fetches the character list and stores into characterList array
fetch("characterList.json")
    .then(response => response.json())
    .then(data => {
        characterList = data;
        availableCharacterNames = characterList.map(character => character.name);
        availableCharacterNames.sort();
    })
    .catch(error => console.error("Error loading character data:", error));

//calls the hashing function and gets the daily character
function getDailyCharacter() {
    const today = new Date().toISOString().split('T')[0];
    const hash = fnv1aHash(today);
    return characterList[hash % characterList.length];
}

//hashes the input String by fnv1a hashing
function fnv1aHash(today) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < today.length; i++) {
        hash ^= today.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0;
    }
    return hash;
}

function createRow(indexOfChar) {
    characterToGuess = getDailyCharacter();

    let newRow = guessTable.insertRow(1);
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
    if (characterToGuess === characterList[indexOfChar]) {

        responseMessage.innerHTML = "<h2>Congratulations!</h2><p>You've guessed the daily character, you can check out the other modes or come back tomorrow.</p>";

        inputDiv.style.display = "none";

        document.querySelectorAll("br.removable").forEach(br => br.remove());
    }
}

//creates a row in the table if input is an available character -> calls create row function
function getInput() {
    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';

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

    inputContent.value = "";
    inputContent.focus();
}

//Event listener for enter key
/*inputContent.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        let query = this.value.toLowerCase();

        if (query === '') {
            return;
        }

        

        if (suggestions.length > 0) {
            this.value = suggestions[0];
        }
        document.getElementById("input_submit").click();
    }
});*/

//Event listener for enter and arrow keys, sets focus and inputs the top or the current focus image when pressing enter
inputContent.addEventListener("keydown", function(event) {
    let query = this.value.toLowerCase();

    if (query === '') {
        return;
    }

    let x = document.getElementsByClassName("suggestion-item");

    if (event.keyCode == 40) {
        event.preventDefault();
        if (focusActive === false) {
            focusActive = true;
            currentFocus = 0;
        } else {
            x[currentFocus].classList.remove("active");
            currentFocus++;
        }
        if (currentFocus === x.length) {
            currentFocus = 0;
        }
        x[currentFocus].classList.add("active");
    }
    else if (event.keyCode == 38) {
        event.preventDefault();
        if (focusActive === false) {
            focusActive = true;
            currentFocus = x.length - 1;
        } else {
            x[currentFocus].classList.remove("active");
            currentFocus--;
        }
        if (currentFocus < 0) {
            currentFocus = x.length - 1;
        }
        x[currentFocus].classList.add("active");
    }
    else if (event.keyCode === 13) {
        event.preventDefault();

        let suggestions = availableCharacterNames.filter(name => name.toLowerCase().startsWith(query));

        if (focusActive) {
            removeItem(availableCharacterNames, suggestions[currentFocus]);
        }else removeItem(availableCharacterNames, suggestions[0]);

        if (suggestions.length > 0) {
            if (focusActive) {
                focusActive = false;
                this.value = suggestions[currentFocus];
            } else this.value = suggestions[0];
        }
        getInput();
    }
    else focusActive = false;
})

//Event listener for input -> creates suggestions
inputContent.addEventListener("input", function () {
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

        //Event listener for clicking suggestions
        suggestionItem.addEventListener("click", function() {
            inputContent.value = this.innerHTML.split(">")[1];
            removeItem(availableCharacterNames, suggestions[0]);
            getInput();
        })

        suggestionsContainer.appendChild(suggestionItem);
    });
});

//functino to removeItem from array
function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
}