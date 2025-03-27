let abilityList = [];
let usedClasses = [];
let classList = [];
let availableClasses = [];
const rotationAngles = [90, 180, 270];
const dailyRotation = rotationAngles[Math.floor(Math.random()*rotationAngles.length)];
let classGuessed = false;

const genderUnlockClasses = ["Berserker", "Slayer"];
let genderUnlockGroups = [];
let alternateClass;
let alternateSkill;
let suggestionItem;
let dailyClass;
let dailySkill;
let dailyImage;

const inputContent = document.getElementById("input_guess");
const inputSubmit = document.getElementById("input_submit");
const inputDiv = document.getElementById("input_div");
const skillInput = document.getElementById("skill_input_div");
const guessTable = document.getElementById("guess_table");
const skillGuess = document.getElementById("skill_guess");
const skillSubmit = document.getElementById("skill_submit");
const imageDiv = document.getElementById("guess_image");
const suggestionsContainer = document.getElementById("suggestions");
const responseMessage = document.getElementById("response_message");
const rotationCheckbox = document.getElementById("rotation_checkbox");
const grayscaleCheckbox = document.getElementById("grayscale_checkbox");

const correctColor = "rgb(96, 220, 0)";
const wrongColor = "rgb(238, 42, 0)";

const today = new Date().toISOString().split('T')[0];

//loading the abilityList.json and saving data in abilityList array and class names in classList and availableClasses, calls the loadImg(); function after finishing
Promise.all([
    fetch("abilityList.json").then(response => response.json()),
    fetch("genderUnlock.json").then(response => response.json())
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

//loads the daily image randomly and adding it to the DOM, calls the applyFilters(); method when done
function loadImg() {
    dailyClass = getDailyClass();
    dailySkill = getDailySkill();

    imageDiv.innerHTML = '<img src="Abilities/' + dailyClass + '/' + dailySkill + '.webp" id="dailySkill">';
    dailyImage = document.getElementById("dailySkill");
    applyFilters();
}

function getDailyClass() {
    const hash = fnv1aHash(today);
    return classList[hash % classList.length];
}

function getDailySkill() {
    const hash = fnv1aHash(today);
    return abilityList[dailyClass].abilities[hash % abilityList[dailyClass].abilities.length];
}

//hashes the input by fnv1a hashing
function fnv1aHash(today) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < today.length; i++) {
        hash ^= today.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0;
    }
    return hash;
}

//applys grayscale and rotation to the image based on checkboxes
function applyFilters() {
    if (grayscaleCheckbox.checked) {
        dailyImage.style.filter = "grayscale(100%)";
    } else {
        dailyImage.style.filter = "grayscale(0%)";
    }
    if (rotationCheckbox.checked) {
        dailyImage.style.transform = "rotate(" + dailyRotation + "deg)";
    } else {
        dailyImage.style.transform = "rotate(" + 0 + "deg)";
    }
};

//event listener for grayscale checkbox
//TODO: change checkbox to extra window
document.getElementById("grayscale_checkbox").addEventListener("change", function() {
    if (grayscaleCheckbox.checked) {
        dailyImage.style.filter = "grayscale(100%)";
    } else {
        dailyImage.style.filter = "grayscale(0%)";
    }
});

//event listener for rotation checkbox
//TODO: change checkbox to extra window
document.getElementById("rotation_checkbox").addEventListener("change", function() {
    if (rotationCheckbox.checked) {
        dailyImage.style.transform = "rotate(" + dailyRotation + "deg)";
    } else {
        dailyImage.style.transform = "rotate(" + 0 + "deg)";
    }
});

//called upon submit or enter -> reads input and adds tablerow (calling createRow(); function) when input == className
function getInput() {
    //clearing suggestion container
    suggestionsContainer.innerHTML = '';
    let value = inputContent.value.toLowerCase();

    if (classGuessed) {
        getSkillInput();
        return;
    }

    for (let i = 0; i < classList.length; i++) {
        let className = classList[i];
        if (value === className.toLowerCase() && !usedClasses.includes(value)) {
            if (guessTable.style.display === "none") {
                guessTable.style.display = "table";
            }
            createRow(i);
            usedClasses.push(className.toLowerCase());
            break;
        }
    }

    inputContent.value = "";
    inputContent.focus();
}

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

        responseMessage.innerHTML = '<h2>Congratulations</h2><p>Can you also guess the ability name?</p>';

    } else if (checkForGenderUnlock()) {
        newCell.style.backgroundColor = correctColor;
        correctGuess();

        responseMessage.innerHTML = '<h2>Congratulations</h2><p>The daily class was ' + dailyClass + ', but since this is also a skill for ' + alternateClass + ' it counts!</p><p>Can you also guess the ability name?</p>';

    } else newCell.style.backgroundColor = wrongColor;
}

//removes redundancy from create Row function
function correctGuess() {
    classGuessed = true;
    inputContent.placeholder = "Enter skill name..."
    dailyImage.style.filter = "grayscale(0%)";
    dailyImage.style.transform = "rotate(" + 0 + "deg)";
}

//returns true or false if daily skill is eligible for gender unlock
function checkForGenderUnlock() {
    for (let indexGroup = 0; indexGroup < genderUnlockGroups.groups.length; indexGroup++) {
        for (let indexClass = 0; indexClass < genderUnlockGroups.groups[indexGroup].groupID.length; indexClass++) {
            if (dailyClass === genderUnlockGroups.groups[indexGroup].groupID[indexClass]) {
                let firstClass = genderUnlockGroups.groups[indexGroup].groupID[0];
                let secondClass = genderUnlockGroups.groups[indexGroup].groupID[1];
                if (firstClass === dailyClass) {
                    for (let indexSkill = 0; indexSkill < genderUnlockGroups.groups[indexGroup].skills.length; indexSkill++) {
                        if (dailySkill === genderUnlockGroups.groups[indexGroup].skills[indexSkill][firstClass]) {
                            alternateClass = secondClass;
                            alternateSkill = genderUnlockGroups.groups[indexGroup].skills[indexSkill][secondClass];
                            return true;
                        }
                    }
                } else for (let indexSkill = 0; indexSkill < genderUnlockGroups.groups[indexGroup].skills.length; indexSkill++) {
                    if (dailySkill === genderUnlockGroups.groups[indexGroup].skills[indexSkill][secondClass]) {
                        alternateClass = firstClass;
                        alternateSkill = genderUnlockGroups.groups[indexGroup].skills[indexSkill][firstClass];
                        return true;
                    }
                }
                alternateClass = dailyClass;
                alternateSkill = dailySkill;
                return false;
            }
        }
    }
    alternateClass = dailyClass;
    alternateSkill = dailySkill;
    return false;
}

//event listener for pressing enter in input field -> calls the submit button function and removes input as a suggestion
inputContent.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        let query = this.value.toLowerCase();

        if (query === '') {
            return;
        }
        
        let suggestions = availableClasses.filter(name => name.toLowerCase().startsWith(query));
        removeItem(availableClasses, suggestions[0]);

        if (classGuessed) {
            suggestions = abilityList[alternateClass].abilities.filter(name => name.toLowerCase().includes(query));
        }

        if (suggestions.length > 0) {
            this.value = suggestions[0];
        }
        getInput();
    }
});

//function to remove an item out of an array input(array, itemToRemove) output nothing
function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

//event listener for keyboard input in guess field
inputContent.addEventListener("input", function () {
    let query = this.value.toLowerCase();

    let suggestions = availableClasses.filter(name => name.toLowerCase().startsWith(query));
    if (classGuessed) {
        suggestions = abilityList[alternateClass].abilities.filter(name => name.toLowerCase().includes(query));
        suggestions = suggestions.map(name => name.replace(/_/g, ":"));
    }

    if (query === '') {
        document.getElementById("suggestions").innerHTML = '';
        return;
    }

    suggestionsContainer.innerHTML = '';


    suggestions.forEach(suggestion => {
        suggestionItem = document.createElement("div");
        suggestionItem.classList.add('suggestion-item');
        if (!classGuessed) {
            suggestionItem.innerHTML = '<img src="Classes/' + suggestion + '.webp">' + suggestion;
        } else { 
            suggestionItem.innerHTML = suggestion;
            suggestionItem.style.paddingLeft = "3px";
        }

        //event listener for click in suggestion items
        //IMPORTANT NOTE: Currently splits at > since this is the indicator for end of img tag, when changing keep in mind
        suggestionItem.addEventListener("click", function() {
            if (classGuessed) {
                inputContent.value = this.innerHTML;
            } else {
                inputContent.value = this.innerHTML.split(">")[1];
            }
            removeItem(availableClasses, suggestions[0]);
            getInput();
        })
        suggestionsContainer.appendChild(suggestionItem);
    });
});

//function similar to getInput(); but only called after class is already guessed
function getSkillInput() {
    let value = inputContent.value;

    if (value === alternateSkill) {
        responseMessage.innerHTML = "Skill name and class entered correctly!<br>Congratulations!";
    } else {
        responseMessage.innerHTML = "Wrong! ):<<br>The skill to guess was: " + alternateSkill.replace(/_/g, ":") + "<br> At least you got the class right!";
    }

    inputDiv.style.display = "none";
    
    document.querySelectorAll("br.removable").forEach(br => br.remove());
}