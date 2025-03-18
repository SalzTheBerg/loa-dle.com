let abilityList = [];
let availableClasses = [];
let classList = [];
const rotationAngles = [90, 180, 270];
const dailyRotation = rotationAngles[Math.floor(Math.random()*rotationAngles.length)];

const imageDiv = document.getElementById("guess_image");

const grayscaleCheckbox = document.getElementById("grayscale_checkbox");

const rotationCheckbox = document.getElementById("rotation_checkbox");

fetch("abilityList.json")
    .then(response => response.json())
    .then(data => {
        abilityList = data;
        availableClasses = Object.keys(data);
        classList = Object.keys(data);
        availableClasses.sort();
        console.log(abilityList);
        console.log(classList);

        loadImg();
    })
    .catch(error => console.error("Error loading character data:", error));

function loadImg() {
    console.log(classList);
    const dailyClass = classList[Math.floor(Math.random()*classList.length)];
    console.log(dailyClass);
    console.log(abilityList);
    const dailySkill = abilityList[dailyClass].abilities[Math.floor(Math.random()*abilityList[dailyClass].abilities.length)];
    console.log(dailySkill);

    imageDiv.innerHTML = '<img src="Abilities/' + dailyClass + '/' + dailySkill + '.webp" id="dailySkill">';
    applyFilters();
};

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