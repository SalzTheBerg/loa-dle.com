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
const inputSubmit = document.getElementById("input_submit");
const inputDiv = document.getElementById("input_div");
const skillInput = document.getElementById("skill_input_div");
const skillGuess = document.getElementById("skill_guess");
const skillSubmit = document.getElementById("skill_submit");

const correctColor = "rgb(96, 220, 0)";
const wrongColor = "rgb(238, 42, 0)";

let dailyClass;
let dailySkill;
let dailyImage;

let classGuessed = false;

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
    dailyImage = document.getElementById("dailySkill");
    applyFilters();
}

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

document.getElementById("grayscale_checkbox").addEventListener("change", function() {
    if (grayscaleCheckbox.checked) {
        dailyImage.style.filter = "grayscale(100%)";
    } else {
        dailyImage.style.filter = "grayscale(0%)";
    }
});

document.getElementById("rotation_checkbox").addEventListener("change", function() {
    if (rotationCheckbox.checked) {
        dailyImage.style.transform = "rotate(" + dailyRotation + "deg)";
    } else {
        dailyImage.style.transform = "rotate(" + 0 + "deg)";
    }
});

function getInput() {
    //clearing suggestion container
    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';
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

    let newRow = guessTable.insertRow(0);
    let classGuess = classList[indexOfChar];

    let newCell = newRow.insertCell(0);

    newCell.innerHTML = classGuess;

    if (classList[indexOfChar] === dailyClass) {
        classGuessed = true;
        newCell.style.backgroundColor = correctColor;
        inputContent.placeholder = "Enter skill name..."
        dailyImage.style.filter = "grayscale(0%)";
        dailyImage.style.transform = "rotate(" + 0 + "deg)";

        const para = document.createElement("p");
        const head = document.createElement("h2");
        const node1 = document.createTextNode("Congratulations!");
        const node2 = document.createTextNode("Can you also guess the ability name?");
        head.appendChild(node1);
        para.appendChild(node2);
        inputDiv.appendChild(head);
        inputDiv.appendChild(para);
    } else newCell.style.backgroundColor = wrongColor;
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

        if (classGuessed) {
            suggestions = abilityList[dailyClass].abilities.filter(name => name.toLowerCase().includes(query));
        }

        if (suggestions.length > 0) {
            this.value = suggestions[0];
        }
        if (classGuessed) {
            getSkillInput();
        } else {
            getInput();
        }
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
    if (classGuessed) {
        suggestions = abilityList[dailyClass].abilities.filter(name => name.toLowerCase().includes(query));
    }

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

function getSkillInput() {
    //clearing suggestion container
    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = '';
    let value = inputContent.value.toLowerCase();

    if (value === dailySkill.toLowerCase()) {
        alert("Richtig");
    } else {
        alert("Falsch");
        alert(dailySkill);
        alert(value);
    }

    inputContent.value = "";
}