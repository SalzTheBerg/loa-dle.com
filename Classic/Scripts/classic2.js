let characterList = [];
let availableCharacterNames = [];

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
            console.log(characterList);
            console.log(availableCharacterNames);
        })
        .catch(error => console.error("Error loading character data:", error));

});