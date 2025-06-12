import { autocompleteInput, checkInput, correctGuess, fnv1aHash, filterSuggestions  } from "../../Modules/utilFunc.js";
import { correctColor, wrongColor, focusState, today } from "../../Modules/utilConsts.js";
import { setupInput } from "../../Modules/inputSetup.js";
import { createSuggestions } from "../../Modules/input.js";
import { createHeader, createParagraph } from "../../Modules/utilDOM.js";

// Uninitialized variables
let abilityList = [];
let classList = [];
let availableClasses = [];
let genderUnlockGroups = [];
let dailyImage;
let dailySkill;
let dailyClass;
let originalDailyClass;

// Consts
const rotationAngles = [90, 180, 270];
const dailyRotation = rotationAngles[Math.floor(Math.random()*rotationAngles.length)];
const hash = fnv1aHash(today);
let guessAmount = 0;
let nameGuessed = false;
let guessWithoutGrayscale = false;
let guessWithoutRotation = false;

let existingScore = null;
let existingClassGuesses = null;
let existingSkillGuess = null;
let saveClasses = true;
let saveSkill = true;

// Id selectors
const guessTable = document.getElementById("guessTable");
const image = document.getElementById("guessImage");

const classInputContainer = document.getElementById("classInputContainer");
const classInputContent = document.getElementById("classInputContent");
const classInputSubmit = document.getElementById("classInputSubmit");
const classSuggestionsContainer = document.getElementById("classSuggestions");
const responseMessage = document.getElementById("responseMessage");
const responseMessageText = document.getElementById("responseMessageText");
const responseContainer = document.getElementById("responseContainer");

const skillInputContainer = document.getElementById("skillInputContainer");
const skillInputContent = document.getElementById("skillInputContent");
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
        fetch("Objects/abilityList.json").then(response => response.json()),
        fetch("Objects/genderUnlock.json").then(response => response.json())
    ])
        .then(([abilityListData, genderUnlockData]) => {
            abilityList = abilityListData;
            classList = Object.keys(abilityList);
            availableClasses = Object.keys(abilityList);
            availableClasses.sort();
            genderUnlockGroups = genderUnlockData;
            loadImg();

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
                suggestionsContainer: skillSuggestionsContainer,
                readFunction: readSkillInput,
                getAvailableAnswers: getAvailableSkills,
                includesQuery: true,
                focusState: focusState,
                suggestAlways: true
            });
        })
    .catch(error => console.error("Error loading data:", error));
});

// Loads the daily image
function loadImg () {
    fetch("./Scripts/getDailySkill.php")
        .then(response => response.json())
        .then(data => {
            dailyClass = data.className;
            originalDailyClass = data.className;
            dailySkill = data.skillName;

            image.innerHTML = '<img src="AbilityImages/' + dailyClass + '/' + dailySkill + '.webp" id="dailySkill">';
            dailyImage = document.getElementById("dailySkill");

            dailyImage.onload = () => {
                const event = new CustomEvent("dailySkillImageReady", { detail: { img: dailyImage } });
                window.dispatchEvent(event);

                image.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                });

                image.addEventListener("dragstart", (e) => {
                    e.preventDefault();
                });
            };

            loadAbilitySave();
        })
        .catch(error => console.error('Error fetching data:', error));
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

    if (saveSkill) {
        saveSkillGuess(autocomplete);
    }

    if (skillInputContent.value.toLowerCase() === dailySkill.toLowerCase()) {
        skillResponseMessage.innerHTML = "<p>Skill name and class entered correctly!</p><p><strong>Congratulations!</strong></p>";
        nameGuessed = true;
    }
    else if (abilityList[dailyClass].abilities.includes(skillInputContent.value)) {
        skillResponseMessage.innerHTML = "<p>The skill to guess was: <strong>" + dailySkill.replace(/_/g, ":") + "</strong>,<br>at least you got the class right!</p>";
    }
    else {
        skillInputContent.value = "";
        skillInputContent.focus;
        return;
    }
    skillInputContainer.style.display = "none";

    getScore();
}

// Handles the logic for class Guessing (calling a lot of functions) -> creates table and automatically closes input when correct answer is given
function readClassInput () {
    classSuggestionsContainer.style.border = "none";

    let autocomplete = autocompleteInput({
        inputContent: classInputContent,
        availableAnswers: getAvailableClasses(),
        focusState: focusState,
        includesQuery: false,
        suggestionsContainer: classSuggestionsContainer
    });

    checkInput({
        availableAnswers: getAvailableClasses(),
        input: autocomplete,
        guessTable: guessTable,
        callback: createRow,
        focusState
    });

    classInputContent.value = "";
    classInputContent.focus();
}


// Creates a tablerow and checks if its the correct guess
function createRow(index) {
    let newRow = guessTable.insertRow(0);
    let classGuess = availableClasses[index];
    let newCell = newRow.insertCell(0);
    newCell.innerHTML = classGuess;

    guessAmount++;
    if (saveClasses) {
        saveClassGuess(classGuess);
    }

    if (availableClasses[index] === dailyClass) {
        newCell.style.backgroundColor = correctColor;

        const h2 = 'Nice!';
        const p = 'Can you also guess the ability name?';
        createHeader(h2, 2, responseMessageText);
        createParagraph(p, responseMessageText);

        prepareSkillGuess();

    } else if (checkForGenderUnlock(classGuess)) {
        newCell.style.backgroundColor = correctColor;

        const h2 = 'Nice!';
        const p = 'The daily class was ' + originalDailyClass + ', but since this is also a skill for ' + dailyClass + ' it counts!';
        const p2 = 'Can you also guess the ability name?';

        createHeader(h2, 2, responseMessageText);
        createParagraph(p, responseMessageText);
        createParagraph(p2, responseMessageText);

        prepareSkillGuess();

    } else newCell.style.backgroundColor = wrongColor;
}

// Prepares the skill guess Container with suggestions
function prepareSkillGuess () {

    const img = document.createElement('img');
    img.src = 'AbilityImages/' + dailyClass + '/' + dailySkill + '.webp';
    responseMessage.prepend(img);

    correctGuess(classInputContainer, responseContainer, skillInputContainer);
    skillInputContent.focus();

    let suggestions = filterSuggestions({
                availableAnswers: getAvailableSkills()
            });
    suggestions = suggestions.map(name => name.replace(/_/g, ":"));      
    createSuggestions({
        suggestions: suggestions,
        suggestionsContainer: skillSuggestionsContainer,
        inputContent: skillInputContent,
        callback: readSkillInput
    });

    // Prevents mouse wheel up or down when at start / end
    skillSuggestionsContainer.addEventListener('wheel', function(e) {
        const atTop = skillSuggestionsContainer.scrollTop === 0;
        const atBottom = skillSuggestionsContainer.scrollHeight - skillSuggestionsContainer.scrollTop === skillSuggestionsContainer.clientHeight;
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            e.preventDefault();
        }
    }, { passive: false });

    if (existingSkillGuess !== null) {
        saveSkill = false;
        skillInputContent.value = existingSkillGuess;
        readSkillInput();
    }
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

window.addEventListener("grayscaleDeactivated", () => {
    guessWithoutGrayscale = guessAmount;
});

window.addEventListener("rotationDeactivated", () => {
    guessWithoutRotation = guessAmount;
});

function getScore() {
    if (existingScore !== null && existingScore !== 0) {
        const scoreElement = document.getElementById('scoreAbility');
        scoreElement.textContent = `Your score for the ability mode today: ${existingScore}`;

        getRanking(existingScore);
        return;
    }

    if (typeof(guessWithoutGrayscale) === "boolean") {
        guessWithoutGrayscale = guessAmount;
    }
    if (typeof(guessWithoutRotation) === "boolean") {
        guessWithoutRotation = guessAmount;
    }

    const data = {
        guesses: guessAmount,
        nameGuessed: nameGuessed,
        withoutGrayscale: guessWithoutGrayscale,
        withoutRotation: guessWithoutRotation
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
        const scoreElement = document.getElementById('scoreAbility');
        if (scoreElement) {
            scoreElement.textContent = `Your score for the ability mode today: ${response.score}`;

            getRanking(response.score);
        }
    })
    .catch(error => console.error('Fehler:', error));
}

function getRanking(score) {
    const data = {
        score: score
    };

    fetch('Scripts/getAbilityRanking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        const rankingElement = document.getElementById('rankingAbility');
        rankingElement.innerHTML = `<hr class="underline" style="background-color: rgb(255, 202, 87);">
  You're in the <span style="color: rgb(82, 220, 255);">top ${response.percentage}%</span> of 
  <span style="color: rgb(82, 220, 255)">${response.all}</span> ability players today.`;
    })
    .catch(error => console.error('error:', error));
}


function saveClassGuess(guess) {
    const data = {
        guess: guess
    };

    fetch('./Scripts/saveClassGuess.php', {
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

function saveSkillGuess(guess) {
    const data = {
        guess: guess
    };

    fetch('./Scripts/saveSkillGuess.php', {
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

function loadAbilitySave() {
    fetch("./Scripts/loadAbilitySave.php")
        .then(response => response.json())
        .then(data => {
            existingScore = data.score,
            existingClassGuesses = data.guessedClasses,
            existingSkillGuess = data.guessedSkill

            if (existingClassGuesses !== null) {
                saveClasses = false;
                guessTable.style.display = "table";
                const array = JSON.parse(existingClassGuesses);
                array.forEach(guess => {
                    classInputContent.value = guess;
                    readClassInput();
                });
                saveClasses = true;
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}
