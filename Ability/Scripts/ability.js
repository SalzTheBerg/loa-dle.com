import { autocompleteInput, checkInput, removeItem, correctGuess, fnv1aHash  } from "../../Modules/utilFunc.js";
import { correctColor, wrongColor, focusState, today } from "../../Modules/utilConsts.js";
import { setupInput } from "../../Modules/inputSetup.js";

// Uninitialized variables
let abilityList = [];
let classList = [];
let availableClasses = [];
let genderUnlockGroups = [];
let dailyImage;
let dailySkill;
let dailyClass;

// Consts
const rotationAngles = [90, 180, 270];
const dailyRotation = rotationAngles[Math.floor(Math.random()*rotationAngles.length)];
const hash = fnv1aHash(today);

// Id selectors
const guessTable = document.getElementById("guessTable");
const image = document.getElementById("guessImage");

const classInputContainer = document.getElementById("classInputContainer");
const classInputContent = document.getElementById("classInputContent");
const classInputSubmit = document.getElementById("classInputSubmit");
const classSuggestionsContainer = document.getElementById("classSuggestions");
const responseMessage = document.getElementById("responseMessage");
const responseContainer = document.getElementById("responseContainer");

const skillInputContainer = document.getElementById("skillInputContainer");
const skillInputContent = document.getElementById("skillInputContent");
const skillInputSubmit = document.getElementById("skillInputSubmit");
const skillSuggestionsContainer = document.getElementById("skillSuggestions");
const skillResponseMessage = document.getElementById("skillResponseMessage");

// Getter functions for changing values
function getAvailableClasses() {
    return availableClasses;
}
function getAvailableSkills() {
    return abilityList[dailyClass].abilities;
}


// Dom Content loaded
document.addEventListener("DOMContentLoaded", () => {

    // Fetch for jsons
    Promise.all([
        fetch("../../Ability/Objects/abilityList.json").then(response => response.json()),
        fetch("../../Ability/Objects/genderUnlock.json").then(response => response.json())
    ])
        .then(([abilityListData, genderUnlockData]) => {
            abilityList = abilityListData;
            classList = Object.keys(abilityList);
            availableClasses = Object.keys(abilityList);
            availableClasses.sort();
            genderUnlockGroups = genderUnlockData;
            loadImg();
        })
    .catch(error => console.error("Error loading data:", error));

    // Setup event listeners
    // Class input
    setupInput({
        inputField: classInputContent,
        submitButton: classInputSubmit,
        suggestionsContainer: classSuggestionsContainer,
        readFunction: readClassInput,
        getAvailableAnswers: getAvailableClasses,
        includesQuery: false,
        path: 'Classes/',
        focusState: focusState
    });

    // Skill input
    setupInput({
        inputField: skillInputContent,
        submitButton: skillInputSubmit,
        suggestionsContainer: skillSuggestionsContainer,
        readFunction: readSkillInput,
        getAvailableAnswers: getAvailableSkills,
        includesQuery: true,
        focusState: focusState
    });
});

// Loads the daily image
function loadImg () {
    dailyClass = classList[hash % classList.length];
    dailySkill = abilityList[dailyClass].abilities[hash % abilityList[dailyClass].abilities.length];

    image.innerHTML = '<img src="AbilityImages/' + dailyClass + '/' + dailySkill + '.webp" id="dailySkill">';
    dailyImage = document.getElementById("dailySkill");
    dailyImage.style.filter = "grayscale(100%)";
    dailyImage.style.transform = "rotate(" + dailyRotation + "deg)";
}


// Handles logic for skill Guessing -> closes input after one guess
function readSkillInput () {
    let autocomplete = autocompleteInput({
        inputContent: skillInputContent,
        availableAnswers: getAvailableSkills(),
        focusState: focusState,
        includesQuery: true,
        suggestionsContainer: skillSuggestionsContainer
    });

    skillInputContent.value = autocomplete;

    if (skillInputContent.value.toLowerCase() === dailySkill.toLowerCase()) {
        skillResponseMessage.innerHTML = "Skill name and class entered correctly!<br>Congratulations!";
    }
    else if (abilityList[dailyClass].abilities.includes(skillInputContent.value)) {
        skillResponseMessage.innerHTML = "Wrong! ):<<br>The skill to guess was: " + dailySkill.replace(/_/g, ":") + "<br> At least you got the class right!";
    }
    else {
        skillInputContent.value = "";
        skillInputContent.focus;
        return;
    }
    skillInputContainer.style.display = "none";
}

// Handles the logic for class Guessing (calling a lot of functions) -> creates table and automatically closes input when correct answer is given
function readClassInput () {

    let autocomplete = autocompleteInput({
        inputContent: classInputContent,
        availableAnswers: getAvailableClasses(),
        focusState: focusState,
        includesQuery: false,
        suggestionsContainer: classSuggestionsContainer
    });

    if (checkInput({
        availableAnswers: getAvailableClasses(),
        input: autocomplete,
        guessTable: guessTable,
        callback: createRow
    })) {
        if (focusState.focusActive) {
            removeItem(availableClasses, autocomplete);
            focusState.focusActive = false;
        }else {
            removeItem(availableClasses, autocomplete);
        }
    }

    classInputContent.value = "";
    classInputContent.focus();
}


// Creates a tablerow and checks if its the correct guess
function createRow(index) {
    let newRow = guessTable.insertRow(0);
    let classGuess = availableClasses[index];
    let newCell = newRow.insertCell(0);
    newCell.innerHTML = classGuess;

    if (availableClasses[index] === dailyClass) {
        newCell.style.backgroundColor = correctColor;
        correctGuess(classInputContainer, responseContainer);

        let dailyImageTag = '<img src="AbilityImages/' + dailyClass + '/' + dailySkill + '.webp"';

        responseMessage.innerHTML = dailyImageTag + '<h2>Nice!</h2><p>Can you also guess the ability name?</p>';

    } else if (checkForGenderUnlock(classGuess)) {
        newCell.style.backgroundColor = correctColor;
        correctGuess(classInputContainer, responseContainer);

        let dailyImageTag = '<img src="AbilityImages/' + dailyClass + '/' + dailySkill + '.webp"';

        responseMessage.innerHTML = dailyImageTag + '<h2>Nice!</h2><p>The daily class was ' + classList[hash % classList.length] + ', but since this is also a skill for ' + dailyClass + ' it counts!<br>Can you also guess the ability name?</p>';

    } else newCell.style.backgroundColor = wrongColor;
}


// Returns true or false if daily skill is eligible for gender unlock and entered character is the opposite gender of it
function checkForGenderUnlock(classGuess) {
    for (let indexGroup = 0; indexGroup < genderUnlockGroups.groups.length; indexGroup++) {
        for (let indexClass = 0; indexClass < genderUnlockGroups.groups[indexGroup].groupID.length; indexClass++) {
            if (dailyClass === genderUnlockGroups.groups[indexGroup].groupID[indexClass]) {
                let firstClass = genderUnlockGroups.groups[indexGroup].groupID[0];
                let secondClass = genderUnlockGroups.groups[indexGroup].groupID[1];
                if (classGuess === firstClass || classGuess === secondClass) {
                    if (firstClass === dailyClass) {
                        for (let indexSkill = 0; indexSkill < genderUnlockGroups.groups[indexGroup].skills.length; indexSkill++) {
                            if (dailySkill === genderUnlockGroups.groups[indexGroup].skills[indexSkill][firstClass]) {
                                dailyClass = secondClass;
                                dailySkill = genderUnlockGroups.groups[indexGroup].skills[indexSkill][secondClass];
                                return true;
                            }
                        }
                    } else for (let indexSkill = 0; indexSkill < genderUnlockGroups.groups[indexGroup].skills.length; indexSkill++) {
                        if (dailySkill === genderUnlockGroups.groups[indexGroup].skills[indexSkill][secondClass]) {
                            dailyClass = firstClass;
                            dailySkill = genderUnlockGroups.groups[indexGroup].skills[indexSkill][firstClass];
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }
    return false;
}