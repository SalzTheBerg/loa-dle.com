let abilityList = [];
let usedClasses = [];
let classList = [];
let availableClasses = [];
const rotationAngles = [90, 180, 270];
const dailyRotation = rotationAngles[Math.floor(Math.random()*rotationAngles.length)];

const imageDiv = document.getElementById("guess_image");

const grayscaleCheckbox = document.getElementById("grayscale_checkbox");

const rotationCheckbox = document.getElementById("rotation_checkbox");

const guessTable = document.getElementById("guess_table")

const inputContent = document.getElementById("input_guess");
const inputSubmit = document.getElementById("input_submit")

const correctColor = "rgb(96, 220, 0)";
const wrongColor = "rgb(238, 42, 0)";

let dailyClass;
let dailySkill;

fetch("abilityList.json")
    .then(response => response.json())
    .then(data => {
        abilityList = data;
        classList = Object.keys(data);
        availableClasses = Object.keys(data);
        availableClasses.sort();
        console.log(abilityList);
        console.log(classList);

        loadImg();
    })
    .catch(error => console.error("Error loading character data:", error));

function loadImg() {
    dailyClass = classList[Math.floor(Math.random()*classList.length)];
    dailySkill = abilityList[dailyClass].abilities[Math.floor(Math.random()*abilityList[dailyClass].abilities.length)];

    imageDiv.innerHTML = '<img src="Abilities/' + dailyClass + '/' + dailySkill + '.webp" id="dailySkill">';
    applyFilters();
}

function applyFilters() {
    const dailyImage = document.getElementById("dailySkill");
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

document.getElementById("grayscale_checkbox").addEventListener("change", function() {
    const dailyImage = document.getElementById("dailySkill");
    if (grayscaleCheckbox.checked) {
        dailyImage.style.filter = "grayscale(100%)";
    } else {
        dailyImage.style.filter = "grayscale(0%)";
    }
});

document.getElementById("rotation_checkbox").addEventListener("change", function() {
    const dailyImage = document.getElementById("dailySkill");
    if (rotationCheckbox.checked) {
        dailyImage.style.transform = "rotate(" + dailyRotation + "deg)";
    } else {
        dailyImage.style.transform = "rotate(" + 0 + "deg)";
    }
});

function getInput() {
    /*//clearing suggestion container
    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';*/
    let value = inputContent.value.toLowerCase();

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
}

function createRow(indexOfChar) {
    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';

    let newRow = guessTable.insertRow(0);
    let classGuess = classList[indexOfChar];

    let newCell = newRow.insertCell(0);

    newCell.innerHTML = classGuess;

    if (classList[indexOfChar] === dailyClass) {
        newCell.style.backgroundColor = correctColor;
        inputContent.style.display = "none";
        inputSubmit.style.display = "none";
        guessSkillName();
    } else newCell.style.backgroundColor = wrongColor;
}

function guessSkillName() {
    return;
}

inputContent.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        let query = this.value.toLowerCase();

        if (query === '') {
            return;
        }

        let suggestions = availableClasses.filter(name => name.toLowerCase().startsWith(query));
        removeItem(availableClasses, suggestions[0]);

        if (suggestions.length > 0) {
            this.value = suggestions[0];
        }
        inputSubmit.click();
    }
});

function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

inputContent.addEventListener("input", function () {
    let query = this.value.toLowerCase();
    let suggestions = availableClasses.filter(name => name.toLowerCase().startsWith(query));

    if (query === '') {
        document.getElementById("suggestions").innerHTML = '';
        return;
    }

    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';


    suggestions.forEach(suggestion => {
        let suggestionItem = document.createElement("div");
        suggestionItem.classList.add('suggestion-item')
        suggestionItem.innerHTML = suggestion;
        suggestionsContainer.appendChild(suggestionItem);
    });
});