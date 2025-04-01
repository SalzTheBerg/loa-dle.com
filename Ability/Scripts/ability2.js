import { autocompleteInput, checkInput, removeItem  } from "/utilFunc.js";

//not const variables
let abilityList = [];
let classList = [];
let availableClasses = [];
let genderUnlockGroups = [];

//variables for testing
let dailyClass = "Slayer";
let dailySkill = "Wild Stomp";
let focusActive = false;
let currentFocus = 0;

//id selectors
const classInputContent = document.getElementById("classInputGuess");
const guessTable = document.getElementById("guessTable");

//event listeners
document.getElementById("classInputSubmit").addEventListener("click", readClassInput);

//fetch for jsons
Promise.all([
    fetch("/Ability/Objects/abilityList.json").then(response => response.json()),
    fetch("/Ability/Objects/genderUnlock.json").then(response => response.json())
])
    .then(([abilityListData, genderUnlockData]) => {
        abilityList = abilityListData;
        classList = Object.keys(abilityList);
        availableClasses = Object.keys(abilityList);
        availableClasses.sort();

        genderUnlockGroups = genderUnlockData;
    })
.catch(error => console.error("Error loading data:", error));


function readClassInput () {

    let autocomplete = autocompleteInput({
        inputContent: classInputContent,
        availableAnswers: availableClasses,
        focusActive: focusActive,
        currentFocus: currentFocus,
        includesQuery: false
    });
    alert(autocomplete);

    if (checkInput({
        availableAnswers: availableClasses,
        input: autocomplete,
        guessTable: guessTable,
        callback: createRow
    })) {
        if (focusActive) {
            removeItem(availableClasses, autocomplete);
            focusActive = false;
        }else {
            removeItem(availableClasses, autocomplete);
        }
    }

    classInputContent.value = "";
    classInputContent.focus();
}

function createRow(indexOfChar) {
    alert(indexOfChar);
}