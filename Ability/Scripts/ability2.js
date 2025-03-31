import { manageInput  } from "/utilFunc.js";

function readInput () {
    manageInput(inputContent, classList, dailyClass, false, undefined, false, createRow);
}

document.getElementById("class_input_submit").addEventListener("click", readInput);

let abilityList = [];
let classList = [];
let availableClasses = [];
let genderUnlockGroups = [];

let dailyClass = "Slayer";
let dailySkill = "Wild Rush";

const correctColor = "rgb(96, 220, 0)"; //also other js
const wrongColor = "rgb(238, 42, 0)";

const inputContent = document.getElementById("class_input_guess");
const guessTable = document.getElementById("guess_table");
const responseMessage = document.getElementById("response_message");

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

//creates new tablerow for displaying guesses and enables the skill name guess upon correct guess
function createRow(indexOfChar) {

    let newRow = guessTable.insertRow(0);
    let classGuess = classList[indexOfChar];

    let newCell = newRow.insertCell(0);

    newCell.innerHTML = classGuess;
    // '<img src="Classes/' + classGuess + '.webp">' + classGuess;

    if (classList[indexOfChar] === dailyClass) {
        newCell.style.backgroundColor = correctColor;
        correctGuess();
        alternateClass = dailyClass;
        alternateSkill = dailySkill;

        const head = document.createElement("h2");
        const para = document.createElement("p");
        const node1 = document.createTextNode("Nice!");
        const node2 = document.createTextNode("Can you also guess the ability name?");
        head.appendChild(node1);
        para.appendChild(node2);
        responseMessage.appendChild(head);
        responseMessage.appendChild(para);

    } else if (checkForGenderUnlock(classGuess)) {
        newCell.style.backgroundColor = correctColor;
        correctGuess();

        responseMessage.innerHTML = '<br><h2>Nice!</h2><p>The daily class was ' + dailyClass + ', but since this is also a skill for ' + classGuess + ' it counts!</p><p>Can you also guess the ability name?</p>';

    } else newCell.style.backgroundColor = wrongColor;
}

function correctGuess() {
    responseMessage.style.display = "block";
    responseMessage.style.backgroundColor = "rgb(79, 97, 36)";
}

//returns true or false if daily skill is eligible for gender unlock and entered character is the opposite gender of it
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
    return true;
}